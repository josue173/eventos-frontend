import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { EventosService } from '../../services/eventos.service';
import { AuthService } from '../../services/auth';
import { filter } from 'rxjs/operators';
import { Evento } from '../../models/evento.model';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eventos.html',
  styleUrl: './eventos.css'
})
export class EventosComponent implements OnInit {
  eventos: Evento[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private eventosService: EventosService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEventos();
    
    // Suscribirse a cambios de navegación para recargar eventos
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Solo recargar si estamos en la ruta de eventos
        if (event.url === '/eventos' || event.urlAfterRedirects === '/eventos') {
          this.loadEventos();
        }
      });
  }

  loadEventos(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.eventosService.getAllEventos().subscribe({
      next: (eventos) => {
        this.eventos = eventos;
        console.log('Eventos cargados:', eventos);
        // Debug: mostrar información de imágenes
        eventos.forEach((evento, index) => {
          console.log(`Evento ${index + 1}:`, {
            nombre: evento.ev_nombre,
            imagen: evento.ev_imagen_lugar,
            tieneImagen: !!evento.ev_imagen_lugar && evento.ev_imagen_lugar.trim() !== ''
          });
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar eventos:', error);
        this.errorMessage = 'Error al cargar los eventos';
        this.isLoading = false;
      }
    });
  }

  // Método público para recargar eventos manualmente
  refreshEventos(): void {
    this.loadEventos();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(timeString: string): string {
    return timeString.substring(0, 5); // HH:MM
  }

  confirmarParticipacion(eventoId: string): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'Debes estar logueado para participar en eventos';
      return;
    }

    this.eventosService.confirmarParticipacion(eventoId, currentUser.us_id).subscribe({
      next: (response) => {
        console.log('Participación confirmada:', response);
        this.loadEventos(); // Recargar eventos para mostrar cambios
      },
      error: (error) => {
        console.error('Error al confirmar participación:', error);
        this.errorMessage = 'Error al confirmar participación en el evento';
      }
    });
  }

  goToCrearEvento(): void {
    this.router.navigate(['/crear-evento']);
  }

  goToEditarEvento(eventoId: string): void {
    this.router.navigate(['/editar-evento', eventoId]);
  }

  eliminarEvento(eventoId: string, eventoNombre: string): void {
    const confirmacion = confirm(`¿Estás seguro de que quieres eliminar el evento "${eventoNombre}"?`);
    
    if (confirmacion) {
      this.isLoading = true;
      this.errorMessage = '';

      this.eventosService.deleteEvento(eventoId).subscribe({
        next: (response) => {
          console.log('Evento eliminado exitosamente:', response);
          this.loadEventos(); // Recargar la lista de eventos
        },
        error: (error) => {
          console.error('Error al eliminar evento:', error);
          this.isLoading = false;
          
          if (error.status === 400) {
            this.errorMessage = error.error?.message || 'No se puede eliminar el evento porque tiene participantes registrados';
          } else if (error.status === 404) {
            this.errorMessage = 'El evento no fue encontrado';
          } else if (error.status === 0) {
            this.errorMessage = 'Error de conexión. Verifica que el backend esté ejecutándose';
          } else {
            this.errorMessage = error.error?.message || `Error del servidor (${error.status})`;
          }
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  onImageError(event: any): void {
    console.log('Error al cargar imagen:', event.target.src);
    event.target.style.display = 'none';
    // Mostrar placeholder si hay error
    const placeholder = event.target.parentElement.querySelector('.evento-imagen-placeholder');
    if (placeholder) {
      placeholder.style.display = 'block';
    }
  }

  onImageLoad(event: any): void {
    console.log('Imagen cargada correctamente:', event.target.src);
    // Ocultar placeholder si la imagen se carga correctamente
    const placeholder = event.target.parentElement.querySelector('.evento-imagen-placeholder');
    if (placeholder) {
      placeholder.style.display = 'none';
    }
  }


  getImageUrl(evento: any): string {
    if (!evento.ev_imagen_lugar || evento.ev_imagen_lugar.trim() === '') {
      return 'https://picsum.photos/400/200?random=' + Math.floor(Math.random() * 1000);
    }
    
    // Validar que sea una URL válida
    try {
      new URL(evento.ev_imagen_lugar);
    } catch {
      // Si no es una URL válida, usar imagen aleatoria
      return 'https://picsum.photos/400/200?random=' + Math.floor(Math.random() * 1000);
    }
    
    // Detectar si es una URL de página web (no imagen directa)
    if (this.isWebPageUrl(evento.ev_imagen_lugar)) {
      console.warn('URL de página web detectada, usando imagen aleatoria:', evento.ev_imagen_lugar);
      return 'https://picsum.photos/400/200?random=' + Math.floor(Math.random() * 1000);
    }
    
    // Si es una URL de YouTube, convertir a thumbnail
    if (evento.ev_imagen_lugar.includes('youtube.com/watch') || evento.ev_imagen_lugar.includes('youtu.be/')) {
      const videoId = this.extractYouTubeId(evento.ev_imagen_lugar);
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }
    
    return evento.ev_imagen_lugar;
  }

  private extractYouTubeId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  private isWebPageUrl(url: string): boolean {
    // Detectar URLs de páginas web comunes que no son imágenes directas
    const webPagePatterns = [
      /tripadvisor\./i,
      /facebook\./i,
      /instagram\./i,
      /twitter\./i,
      /linkedin\./i,
      /google\./i,
      /wikipedia\./i,
      /\.html$/i,
      /\.php$/i,
      /\.aspx$/i,
      /\/reviews\//i,
      /\/attraction/i,
      /\/hotel/i,
      /\/restaurant/i
    ];
    
    return webPagePatterns.some(pattern => pattern.test(url));
  }
}

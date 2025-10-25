import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventosService } from '../../services/eventos.service';
import { AuthService } from '../../services/auth';
import { CreateEventoRequest } from '../../models/evento.model';

@Component({
  selector: 'app-crear-evento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-evento.html',
  styleUrl: './crear-evento.css'
})
export class CrearEventoComponent {
  eventoData: CreateEventoRequest = {
    ev_nombre: '',
    ev_description: '',
    ev_fecha_evento: '', // Se llenará desde el formulario
    ev_ubicacion: '',
    ev_hora_inicio: '',
    ev_hora_fin: '',
    ev_propietario: '',
    ev_imagen_lugar: ''
  };

  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private eventosService: EventosService,
    private authService: AuthService,
    private router: Router
  ) {
    // Establecer el propietario como el usuario actual
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.eventoData.ev_propietario = currentUser.us_usuario;
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Preparar los datos según las validaciones del backend
    const eventoToSend = {
      ev_nombre: this.eventoData.ev_nombre,
      ev_description: this.eventoData.ev_description,
      ev_fecha_evento: this.eventoData.ev_fecha_evento, // Ya es string en formato YYYY-MM-DD
      ev_ubicacion: this.eventoData.ev_ubicacion,
      ev_hora_inicio: this.eventoData.ev_hora_inicio,
      ev_hora_fin: this.eventoData.ev_hora_fin,
      ev_propietario: this.eventoData.ev_propietario,
      ev_imagen_lugar: this.eventoData.ev_imagen_lugar || 'https://picsum.photos/400/200?random=' + Math.floor(Math.random() * 1000)
    };

    console.log('Enviando evento:', eventoToSend);

    this.eventosService.createEvento(eventoToSend).subscribe({
      next: (response) => {
        console.log('Evento creado exitosamente:', response);
        // Navegar a eventos y forzar recarga
        this.router.navigate(['/eventos']).then(() => {
          // Forzar recarga de la página para asegurar que se carguen los nuevos eventos
          window.location.reload();
        });
      },
      error: (error) => {
        console.error('Error al crear evento:', error);
        console.error('Error details:', error.error);
        
        if (error.status === 0) {
          this.errorMessage = 'Error de conexión. Verifica que el backend esté ejecutándose';
        } else if (error.status === 400) {
          // Mostrar errores de validación específicos
          console.log('Error details:', error.error);
          if (error.error?.message) {
            if (Array.isArray(error.error.message)) {
              this.errorMessage = error.error.message.join(', ');
            } else {
              this.errorMessage = error.error.message;
            }
          } else if (Array.isArray(error.error)) {
            this.errorMessage = error.error.map((err: any) => err.message).join(', ');
          } else {
            this.errorMessage = 'Datos inválidos. Verifica que todos los campos cumplan los requisitos';
          }
        } else {
          this.errorMessage = error.error?.message || `Error del servidor (${error.status})`;
        }
        
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/eventos']);
  }
}

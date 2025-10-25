import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EventosService } from '../../services/eventos.service';
import { Evento } from '../../models/evento.model';

@Component({
  selector: 'app-editar-evento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-evento.html',
  styleUrl: './editar-evento.css'
})
export class EditarEventoComponent implements OnInit {
  evento: Evento | null = null;
  eventoId: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private eventosService: EventosService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.eventoId = this.route.snapshot.paramMap.get('id') || '';
    if (this.eventoId) {
      this.loadEvento();
    }
  }

  loadEvento(): void {
    this.isLoading = true;
    this.eventosService.getEventoById(this.eventoId).subscribe({
      next: (evento) => {
        this.evento = evento;
        // Convertir la fecha a formato string para el input date (YYYY-MM-DD)
        if (this.evento && this.evento.ev_fecha_evento) {
          const fecha = new Date(this.evento.ev_fecha_evento);
          this.evento.ev_fecha_evento = fecha.toISOString().split('T')[0] as any;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar evento:', error);
        this.errorMessage = 'Error al cargar el evento';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.evento) return;

    this.isLoading = true;
    this.errorMessage = '';

    const updateData = {
      ev_nombre: this.evento.ev_nombre,
      ev_description: this.evento.ev_description,
      ev_fecha_evento: new Date(this.evento.ev_fecha_evento), // Convertir a Date object
      ev_ubicacion: this.evento.ev_ubicacion,
      ev_hora_inicio: this.evento.ev_hora_inicio,
      ev_hora_fin: this.evento.ev_hora_fin,
      ev_imagen_lugar: this.evento.ev_imagen_lugar
    };

    this.eventosService.updateEvento(this.eventoId, updateData).subscribe({
      next: (response) => {
        console.log('Evento actualizado exitosamente:', response);
        // Navegar a eventos y forzar recarga
        this.router.navigate(['/eventos']).then(() => {
          // Forzar recarga de la página para asegurar que se carguen los eventos actualizados
          window.location.reload();
        });
      },
      error: (error) => {
        console.error('Error al actualizar evento:', error);
        
        if (error.status === 0) {
          this.errorMessage = 'Error de conexión. Verifica que el backend esté ejecutándose';
        } else if (error.status === 400) {
          this.errorMessage = error.error?.message || 'Datos inválidos. Verifica que todos los campos estén correctos';
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
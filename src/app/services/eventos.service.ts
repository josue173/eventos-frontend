import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento, CreateEventoRequest } from '../models/evento.model';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private apiUrl = 'http://localhost:3000/tus_eventos/eventos';

  constructor(private http: HttpClient) { }

  getAllEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.apiUrl);
  }

  getEventoById(id: string): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}/${id}`);
  }

  createEvento(evento: CreateEventoRequest): Observable<Evento> {
    return this.http.post<Evento>(this.apiUrl, evento);
  }

  updateEvento(id: string, evento: Partial<Evento>): Observable<Evento> {
    return this.http.patch<Evento>(`${this.apiUrl}/${id}`, evento);
  }

  deleteEvento(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  confirmarParticipacion(eventoId: string, usuarioId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${eventoId}/participantes/${usuarioId}/confirmar`, {});
  }

  enviarRecordatorio(eventoId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${eventoId}/recordatorio`, {});
  }
}

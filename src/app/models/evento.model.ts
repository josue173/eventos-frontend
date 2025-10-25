export interface Evento {
  ev_id: string;
  ev_nombre: string;
  ev_description: string;
  ev_fecha_creacion: Date;
  ev_fecha_evento: Date;
  ev_fecha_modificacion: Date;
  ev_ubicacion: string;
  ev_hora_inicio: string;
  ev_hora_fin: string;
  ev_propietario: string;
  ev_imagen_lugar: string;
  ev_usuarios?: any[];
}

export interface CreateEventoRequest {
  ev_nombre: string;
  ev_description: string;
  ev_fecha_evento: string; // Cambiado a string para enviar formato ISO al backend
  ev_ubicacion: string;
  ev_hora_inicio: string;
  ev_hora_fin: string;
  ev_imagen_lugar: string;
  ev_propietario: string;
}

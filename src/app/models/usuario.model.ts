export interface Usuario {
  us_id: string;
  us_nombre: string;
  us_apellido: string;
  us_usuario: string;
  us_correo: string;
  us_password: string;
  us_eventos?: any[];
}

export interface LoginRequest {
  us_usuario: string;
  us_password: string;
}

export interface LoginResponse {
  usuario: Usuario;
  message: string;
}

export interface CreateUsuarioRequest {
  us_nombre: string;
  us_apellido: string;
  us_usuario: string;
  us_correo: string;
  us_password: string;
}

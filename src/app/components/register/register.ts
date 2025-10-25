import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CreateUsuarioRequest } from '../../models/usuario.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  userData: CreateUsuarioRequest = {
    us_nombre: '',
    us_apellido: '',
    us_usuario: '',
    us_correo: '',
    us_password: ''
  };

  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.userData).subscribe({
      next: (response) => {
        console.log('Usuario registrado exitosamente:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
        
        if (error.status === 0) {
          this.errorMessage = 'Error de conexión. Verifica que el backend esté ejecutándose en http://localhost:3000';
        } else if (error.status === 400) {
          this.errorMessage = error.error?.message || 'Datos inválidos. Verifica que todos los campos estén correctos';
        } else if (error.status === 409) {
          this.errorMessage = 'El usuario o correo ya existe';
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

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
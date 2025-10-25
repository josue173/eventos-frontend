import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { LoginRequest } from '../../models/usuario.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  credentials: LoginRequest = {
    us_usuario: '',
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

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.router.navigate(['/eventos']);
      },
      error: (error) => {
        console.error('Error en login:', error);
        
        if (error.status === 0) {
          this.errorMessage = 'Error de conexión. Verifica que el backend esté ejecutándose en http://localhost:3000';
        } else if (error.status === 401) {
          this.errorMessage = 'Credenciales incorrectas';
        } else if (error.status === 404) {
          this.errorMessage = 'Endpoint no encontrado. Verifica la configuración del backend';
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

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}

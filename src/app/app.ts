import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  title = 'Sistema de Eventos';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Restaurar el usuario desde localStorage al inicializar la app
    this.authService.restoreUser();
  }
}

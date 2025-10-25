import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { EventosComponent } from './components/eventos/eventos';
import { CrearEventoComponent } from './components/crear-evento/crear-evento';
import { EditarEventoComponent } from './components/editar-evento/editar-evento';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'eventos', component: EventosComponent },
  { path: 'crear-evento', component: CrearEventoComponent },
  { path: 'editar-evento/:id', component: EditarEventoComponent },
  { path: '**', redirectTo: '/login' }
];

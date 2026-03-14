import { Routes } from '@angular/router';
import { DisenoComponent } from './components/layout/diseno.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    component: DisenoComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'tablero', pathMatch: 'full' },
      {
        path: 'tablero',
        loadComponent: () => import('./pages/tablero/tablero.component').then(m => m.TableroComponent),
      },
      {
        path: 'citas',
        loadComponent: () => import('./pages/citas/lista-citas/lista-citas.component').then(m => m.ListaCitasComponent),
      },
      {
        path: 'citas/nueva',
        loadComponent: () => import('./pages/citas/formulario-cita/formulario-cita.component').then(m => m.FormularioCitaComponent),
      },
      {
        path: 'citas/calendario',
        loadComponent: () => import('./pages/citas/calendario-citas/calendario-citas.component').then(m => m.CalendarioCitasComponent),
      },
      {
        path: 'citas/:id/editar',
        loadComponent: () => import('./pages/citas/formulario-cita/formulario-cita.component').then(m => m.FormularioCitaComponent),
      },
      {
        path: 'medicos',
        loadComponent: () => import('./pages/medicos/lista-medicos/lista-medicos.component').then(m => m.ListaMedicosComponent),
      },
      {
        path: 'medicos/nuevo',
        loadComponent: () => import('./pages/medicos/formulario-medico/formulario-medico.component').then(m => m.FormularioMedicoComponent),
      },
      {
        path: 'medicos/:id/editar',
        loadComponent: () => import('./pages/medicos/formulario-medico/formulario-medico.component').then(m => m.FormularioMedicoComponent),
      },
      {
        path: 'pacientes',
        loadComponent: () => import('./pages/pacientes/lista-pacientes/lista-pacientes.component').then(m => m.ListaPacientesComponent),
      },
      {
        path: 'pacientes/nuevo',
        loadComponent: () => import('./pages/pacientes/formulario-paciente/formulario-paciente.component').then(m => m.FormularioPacienteComponent),
      },
      {
        path: 'pacientes/:id/editar',
        loadComponent: () => import('./pages/pacientes/formulario-paciente/formulario-paciente.component').then(m => m.FormularioPacienteComponent),
      },
      {
        path: 'horarios',
        loadComponent: () => import('./pages/horarios/horarios.component').then(m => m.HorariosComponent),
      },
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
  }
];

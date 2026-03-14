import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { AuthServicio } from '../../services/auth.servicio';

@Component({
  selector: 'app-encabezado',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatIconModule, MatButtonModule, MatMenuModule, MatBadgeModule, MatTooltipModule, MatDividerModule
  ],
  template: `
    <header class="encabezado">
      <div class="encabezado-izquierda">
        <button class="btn-menu" (click)="toggleMenu.emit()" matTooltip="Menú">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="titulo">{{ titulo() }}</span>
      </div>

      <div class="encabezado-derecha">
        <button mat-button [matMenuTriggerFor]="menuPerfil" class="btn-perfil">
          <div class="avatar-usuario">AD</div>
          <div class="info-usuario">
            <span class="nombre-usuario">Administrador</span>
            <span class="rol-usuario">Sistema</span>
          </div>
          <mat-icon class="icono-dropdown">expand_more</mat-icon>
        </button>

        <mat-menu #menuPerfil="matMenu">
          <button mat-menu-item>
            <mat-icon>person</mat-icon>
            <span>Mi Perfil</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="authServicio.logout()">
            <mat-icon>logout</mat-icon>
            <span>Cerrar Sesión</span>
          </button>
        </mat-menu>
      </div>
    </header>
  `,
  styles: [`
    .encabezado {
      height: 100%;
      background: #F4F6F9;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      border-bottom: 1px solid #DDE3EC;
    }

    .encabezado-izquierda {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .btn-menu {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      border: none;
      background: #E8EDF4;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4A5568;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .btn-menu:hover {
      background: #DDE3EC;
      color: #1E293B;
    }

    .titulo {
      font-size: 17px;
      font-weight: 600;
      color: #1E293B;
    }

    .encabezado-derecha {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .fecha-actual {
      font-size: 13px;
      color: #64748B;
      margin-right: 8px;
      display: none;
    }

    @media (min-width: 768px) {
      .fecha-actual { display: block; }
    }

    .btn-perfil {
      display: flex;
      align-items: center;
      gap: 10px;
      height: 44px;
      border-radius: 10px !important;
      padding: 0 12px !important;
    }

    .avatar-usuario {
      width: 34px;
      height: 34px;
      background: #01B3BF;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 13px;
    }

    .info-usuario {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .nombre-usuario {
      font-size: 13px;
      font-weight: 600;
      color: #1E293B;
      line-height: 1.2;
    }

    .rol-usuario {
      font-size: 11px;
      color: #64748B;
    }

    .icono-dropdown {
      font-size: 18px !important;
      width: 18px !important;
      height: 18px !important;
      color: #64748B !important;
    }
  `]
})
export class EncabezadoComponent {
  titulo = input('Tablero');
  migajas = input('Inicio / Tablero');
  toggleMenu = output();

  authServicio = inject(AuthServicio);

  get fechaHoy(): string {
    return new Date().toLocaleDateString('es-EC', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

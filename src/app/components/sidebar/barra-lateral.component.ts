import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

interface ElementoMenu {
  ruta: string;
  icono: string;
  etiqueta: string;
  descripcion: string;
}

@Component({
  selector: 'app-barra-lateral',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, MatRippleModule, MatTooltipModule],
  template: `
    <aside class="barra-lateral" [class.colapsada]="colapsada()">
      <!-- Logo -->
      <div class="logo-contenedor">
        <div class="logo-icono">
          <mat-icon>local_hospital</mat-icon>
        </div>
        @if (!colapsada()) {
          <div class="logo-texto">
            <span class="logo-nombre">Graeco</span>
            <span class="logo-subtitulo">Citas Médicas</span>
          </div>
        }
      </div>

      <!-- Menú de navegación -->
      <nav class="navegacion">
        <div class="grupo-menu">
          @if (!colapsada()) {
            <span class="etiqueta-grupo">Principal</span>
          }

          @for (elemento of menuPrincipal; track elemento.ruta) {
            <a
              [routerLink]="elemento.ruta"
              routerLinkActive="activo"
              [routerLinkActiveOptions]="{ exact: elemento.ruta === '/tablero' }"
              class="elemento-menu"
              matRipple
              [matTooltip]="colapsada() ? elemento.etiqueta : ''"
              matTooltipPosition="right"
            >
              <mat-icon class="icono-menu">{{ elemento.icono }}</mat-icon>
              @if (!colapsada()) {
                <span class="texto-menu">{{ elemento.etiqueta }}</span>
              }
            </a>
          }
        </div>

        <div class="grupo-menu">
          @if (!colapsada()) {
            <span class="etiqueta-grupo">Gestión</span>
          }

          @for (elemento of menuGestion; track elemento.ruta) {
            <a
              [routerLink]="elemento.ruta"
              routerLinkActive="activo"
              class="elemento-menu"
              matRipple
              [matTooltip]="colapsada() ? elemento.etiqueta : ''"
              matTooltipPosition="right"
            >
              <mat-icon class="icono-menu">{{ elemento.icono }}</mat-icon>
              @if (!colapsada()) {
                <span class="texto-menu">{{ elemento.etiqueta }}</span>
              }
            </a>
          }
        </div>

      </nav>

    </aside>
  `,
  styles: [`
    .barra-lateral {
      width: 240px;
      min-height: 100vh;
      background: #F4F6F9;
      border-right: 1px solid #DDE3EC;
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 100;
      overflow: hidden;
    }

    .barra-lateral.colapsada {
      width: 64px;
    }

    .logo-contenedor {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 14px;
      border-bottom: 1px solid #DDE3EC;
      min-height: 72px;
    }

    .logo-icono {
      width: 38px;
      height: 38px;
      background: #01B3BF;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .logo-icono mat-icon {
      color: white;
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    .logo-texto {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .logo-nombre {
      color: #1E293B;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }

    .logo-subtitulo {
      color: #64748B;
      font-size: 11px;
      white-space: nowrap;
    }

    .navegacion {
      flex: 1;
      padding: 12px 8px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .grupo-menu {
      margin-bottom: 8px;
    }

    .etiqueta-grupo {
      display: block;
      color: #94A3B8;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 8px 8px 4px;
    }

    .elemento-menu {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 10px;
      border-radius: 10px;
      color: #4A5568;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
    }

    .elemento-menu:hover {
      background: #E8EDF4;
      color: #1E293B;
    }

    .elemento-menu.activo {
      background: #E0F7FA;
      color: #01B3BF;
      font-weight: 600;
    }

    .icono-menu {
      font-size: 20px;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .texto-menu {
      font-size: 13.5px;
      font-weight: 500;
    }

  `]
})
export class BarraLateralComponent {
  colapsada = input(false);
  alternarColapso = output();

  menuPrincipal: ElementoMenu[] = [
    { ruta: '/tablero', icono: 'dashboard', etiqueta: 'Tablero', descripcion: 'Resumen general' },
    { ruta: '/citas', icono: 'event', etiqueta: 'Citas', descripcion: 'Gestión de citas' },
  ];

  menuGestion: ElementoMenu[] = [
    { ruta: '/medicos', icono: 'medical_services', etiqueta: 'Médicos', descripcion: 'Gestión de médicos' },
    { ruta: '/pacientes', icono: 'people', etiqueta: 'Pacientes', descripcion: 'Gestión de pacientes' },
    { ruta: '/horarios', icono: 'schedule', etiqueta: 'Horarios', descripcion: 'Horarios médicos' },
  ];

  menuConfiguracion: ElementoMenu[] = [];
}

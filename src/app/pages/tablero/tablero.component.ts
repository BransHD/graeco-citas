import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { CitaServicio } from '../../services/cita.servicio';
import { MedicoServicio } from '../../services/medico.servicio';
import { PacienteServicio } from '../../services/paciente.servicio';
import { ETIQUETAS_ESTADO_CITA } from '../../models/cita.modelo';

@Component({
  selector: 'app-tablero',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule],
  template: `
    <div class="contenedor-pagina">
      <!-- Encabezado de bienvenida -->
      <div class="bienvenida">
        <div>
          <h1>¡Bienvenido al Sistema Graeco!</h1>
        </div>
        <a routerLink="/citas/nueva" mat-raised-button class="boton-primario">Nueva Cita</a>
      </div>

      <!-- Contenido principal: citas de hoy + distribución -->
      <div class="cuadricula-principal">
        <!-- Citas de hoy -->
        <div class="tarjeta">
          <div class="tarjeta-encabezado">
            <h2>Citas de Hoy</h2>
            <a routerLink="/citas" mat-button color="primary">Ver todas</a>
          </div>

          @if (citasHoy.length === 0) {
            <div class="sin-resultados">
              <p>No hay citas programadas para hoy</p>
            </div>
          } @else {
            <div class="lista-citas-hoy">
              @for (cita of citasHoy; track cita.id) {
                <div class="item-cita-hoy">
                  <div class="hora-cita">
                    <span>{{ cita.horaInicio }}</span>
                  </div>
                  <div class="linea-tiempo" [class]="'linea-' + cita.estado"></div>
                  <div class="detalle-cita">
                    <div class="nombre-paciente-cita">{{ obtenerNombrePaciente(cita.pacienteId) }}</div>
                    <div class="info-cita">{{ obtenerNombreMedico(cita.medicoId) }}</div>
                  </div>
                  <span class="estado-badge" [class]="'estado-' + cita.estado">
                    {{ etiquetasEstado[cita.estado] }}
                  </span>
                </div>
              }
            </div>
          }
        </div>

        <!-- Panel derecho: Distribución de estados -->
        <div class="tarjeta">
          <div class="tarjeta-encabezado">
            <h2>Estado de Citas</h2>
          </div>
          <div class="distribucion-estados">
            @for (item of distribucionEstados; track item.etiqueta) {
              <div class="item-distribucion">
                <div class="distribucion-info">
                  <span class="distribucion-dot" [style.background]="item.color"></span>
                  <span class="distribucion-etiqueta">{{ item.etiqueta }}</span>
                </div>
                <div class="distribucion-barra-contenedor">
                  <div class="distribucion-barra" [style.width]="item.porcentaje + '%'" [style.background]="item.color"></div>
                </div>
                <span class="distribucion-valor">{{ item.cantidad }}</span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bienvenida {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 12px;
    }

    .bienvenida h1 {
      font-size: 22px;
      font-weight: 700;
      color: #1a1a2e;
    }

    .subtitulo-bienvenida {
      color: #78909c;
      font-size: 14px;
      text-transform: capitalize;
    }

    /* Layout principal */
    .cuadricula-principal {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 20px;
      margin-bottom: 20px;
    }

    @media (max-width: 1100px) {
      .cuadricula-principal { grid-template-columns: 1fr; }
    }

    .tarjeta-encabezado {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 16px;
    }

    .tarjeta-encabezado h2 {
      font-size: 15px; font-weight: 600; color: #1a1a2e;
      display: flex; align-items: center; gap: 8px;
    }

    .tarjeta-encabezado h2 mat-icon { color: #1565c0; font-size: 18px; width: 18px; height: 18px; }

    /* Lista citas de hoy */
    .lista-citas-hoy { display: flex; flex-direction: column; gap: 12px; }

    .item-cita-hoy {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 12px; border-radius: 10px;
      background: #f8fafc; border: 1px solid #e0e7ef;
      transition: all 0.2s;
    }

    .item-cita-hoy:hover { background: #f0f7ff; border-color: #bbdefb; }

    .hora-cita {
      font-size: 13px; font-weight: 700; color: #1565c0;
      min-width: 45px; margin-top: 2px;
    }

    .linea-tiempo {
      width: 3px; border-radius: 2px; align-self: stretch; min-height: 50px;
    }

    .linea-programada { background: #1565c0; }
    .linea-confirmada { background: #2e7d32; }
    .linea-en_curso { background: #e65100; }
    .linea-completada { background: #1b5e20; }
    .linea-cancelada { background: #c62828; }

    .detalle-cita { flex: 1; }
    .nombre-paciente-cita { font-size: 14px; font-weight: 600; color: #1a1a2e; margin-bottom: 4px; }

    .info-cita {
      display: flex; align-items: center; gap: 4px;
      font-size: 12px; color: #78909c;
    }
    .info-cita mat-icon { font-size: 14px; width: 14px; height: 14px; }

    /* Distribución */
    .distribucion-estados { display: flex; flex-direction: column; gap: 12px; }

    .item-distribucion {
      display: flex; align-items: center; gap: 8px;
    }

    .distribucion-info { display: flex; align-items: center; gap: 6px; min-width: 100px; }
    .distribucion-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .distribucion-etiqueta { font-size: 12px; color: #546e7a; }
    .distribucion-barra-contenedor { flex: 1; height: 6px; background: #f0f4f8; border-radius: 3px; overflow: hidden; }
    .distribucion-barra { height: 100%; border-radius: 3px; transition: width 0.5s ease; }
    .distribucion-valor { font-size: 13px; font-weight: 600; color: #1a1a2e; min-width: 24px; text-align: right; }

  `]
})
export class TableroComponent {
  tituloPagina = 'Tablero';
  migajas = 'Inicio / Tablero';

  private citaServicio = inject(CitaServicio);
  private medicoServicio = inject(MedicoServicio);
  private pacienteServicio = inject(PacienteServicio);

  etiquetasEstado = ETIQUETAS_ESTADO_CITA;

  resumen = computed(() => this.citaServicio.resumen());

  get fechaHoy(): string {
    return new Date().toLocaleDateString('es-EC', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  get citasHoy() {
    const hoy = new Date().toISOString().split('T')[0];
    return this.citaServicio.obtenerPorFecha(hoy);
  }

  get distribucionEstados() {
    const res = this.resumen();
    const total = res.total || 1;
    return [
      { etiqueta: 'Programadas', cantidad: res.programadas, color: '#1565c0', porcentaje: Math.round(res.programadas / total * 100) },
      { etiqueta: 'Confirmadas', cantidad: res.confirmadas, color: '#2e7d32', porcentaje: Math.round(res.confirmadas / total * 100) },
      { etiqueta: 'Completadas', cantidad: res.completadas, color: '#1b5e20', porcentaje: Math.round(res.completadas / total * 100) },
      { etiqueta: 'Canceladas', cantidad: res.canceladas, color: '#c62828', porcentaje: Math.round(res.canceladas / total * 100) },
      { etiqueta: 'No Asistió', cantidad: res.noAsistio, color: '#e65100', porcentaje: Math.round(res.noAsistio / total * 100) },
    ];
  }

  obtenerNombrePaciente(id: number): string {
    const p = this.pacienteServicio.obtenerPorId(id);
    return p ? `${p.nombres} ${p.apellidos}` : 'Desconocido';
  }

  obtenerNombreMedico(id: number): string {
    const m = this.medicoServicio.obtenerPorId(id);
    return m ? `Dr. ${m.apellidos}` : 'Desconocido';
  }

}

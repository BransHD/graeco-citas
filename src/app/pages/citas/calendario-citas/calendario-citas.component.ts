import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CitaServicio } from '../../../services/cita.servicio';
import { MedicoServicio } from '../../../services/medico.servicio';
import { PacienteServicio } from '../../../services/paciente.servicio';
import { Cita, ETIQUETAS_ESTADO_CITA, ETIQUETAS_TIPO_CITA } from '../../../models/cita.modelo';

interface DiaCalendario {
  fecha: Date;
  esHoy: boolean;
  esMesActual: boolean;
  citas: Cita[];
}

@Component({
  selector: 'app-calendario-citas',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    MatIconModule, MatButtonModule, MatSelectModule, MatFormFieldModule, MatTooltipModule
  ],
  template: `
    <div class="contenedor-pagina">
      <div class="encabezado-pagina">
        <h1><mat-icon>calendar_month</mat-icon> Calendario de Citas</h1>
        <div style="display:flex;gap:8px">
          <a routerLink="/citas" mat-stroked-button>
            <mat-icon>list</mat-icon> Lista
          </a>
          <a routerLink="/citas/nueva" mat-raised-button class="boton-primario">
            <mat-icon>add</mat-icon> Nueva Cita
          </a>
        </div>
      </div>

      <div class="cuadricula-calendario">
        <!-- Calendario -->
        <div class="tarjeta calendario-principal">
          <!-- Navegación del mes -->
          <div class="nav-mes">
            <button mat-icon-button (click)="mesAnterior()"><mat-icon>chevron_left</mat-icon></button>
            <div class="titulo-mes">
              <h2>{{ nombreMes }} {{ anioActual }}</h2>
              <button mat-button color="primary" (click)="irAHoy()" style="font-size:12px">Hoy</button>
            </div>
            <button mat-icon-button (click)="mesSiguiente()"><mat-icon>chevron_right</mat-icon></button>
          </div>

          <!-- Días de la semana -->
          <div class="cabecera-semana">
            @for (dia of nombresDias; track dia) {
              <div class="celda-dia-nombre">{{ dia }}</div>
            }
          </div>

          <!-- Cuadrícula de días -->
          <div class="cuadricula-dias">
            @for (dia of diasCalendario(); track dia.fecha.toISOString()) {
              <div
                class="celda-dia"
                [class.hoy]="dia.esHoy"
                [class.otro-mes]="!dia.esMesActual"
                [class.seleccionada]="esDiaSeleccionado(dia.fecha)"
                (click)="seleccionarDia(dia)"
              >
                <span class="numero-dia">{{ dia.fecha.getDate() }}</span>
                <div class="citas-dia">
                  @for (cita of dia.citas.slice(0, 3); track cita.id) {
                    <div class="punto-cita" [class]="'punto-' + cita.estado" [matTooltip]="getCitaTooltip(cita)">
                      <span>{{ cita.horaInicio }}</span>
                    </div>
                  }
                  @if (dia.citas.length > 3) {
                    <span class="mas-citas">+{{ dia.citas.length - 3 }} más</span>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Leyenda -->
          <div class="leyenda">
            @for (item of leyenda; track item.estado) {
              <div class="leyenda-item">
                <span class="punto-cita punto-{{ item.estado }}"></span>
                <span>{{ item.etiqueta }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Panel de citas del día seleccionado -->
        <div class="panel-dia">
          <div class="tarjeta">
            <div class="panel-dia-titulo">
              <mat-icon>today</mat-icon>
              <h3>{{ tituloDiaSeleccionado }}</h3>
            </div>

            @if (citasDiaSeleccionado.length === 0) {
              <div class="sin-resultados" style="padding:40px 20px">
                <mat-icon>event_available</mat-icon>
                <p>No hay citas este día</p>
                <a routerLink="/citas/nueva" mat-stroked-button color="primary" style="margin-top:12px">
                  <mat-icon>add</mat-icon> Agendar Cita
                </a>
              </div>
            } @else {
              <div class="lista-citas-panel">
                @for (cita of citasDiaSeleccionado; track cita.id) {
                  <div class="item-cita-panel" [class]="'borde-' + cita.estado">
                    <div class="cita-panel-hora">{{ cita.horaInicio }}</div>
                    <div class="cita-panel-detalle">
                      <div class="cita-panel-paciente">{{ getNombrePaciente(cita.pacienteId) }}</div>
                      <div class="cita-panel-medico">{{ getNombreMedico(cita.medicoId) }}</div>
                      <div class="cita-panel-motivo">{{ cita.motivo }}</div>
                      <div style="display:flex;gap:6px;margin-top:4px;flex-wrap:wrap">
                        <span class="estado-badge" style="font-size:10px;padding:2px 8px" [class]="'estado-' + cita.estado">
                          {{ etiquetasEstado[cita.estado] }}
                        </span>
                        <span class="chip-tipo chip-{{ cita.tipo }}" style="font-size:10px">{{ etiquetasTipo[cita.tipo] }}</span>
                      </div>
                    </div>
                    <div class="cita-panel-acciones">
                      <a [routerLink]="['/citas', cita.id, 'editar']" mat-icon-button matTooltip="Editar">
                        <mat-icon style="font-size:16px;width:16px;height:16px">edit</mat-icon>
                      </a>
                    </div>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Mini estadísticas del mes -->
          <div class="tarjeta">
            <div class="panel-dia-titulo">
              <mat-icon>bar_chart</mat-icon>
              <h3>Resumen de {{ nombreMes }}</h3>
            </div>
            <div class="resumen-mes">
              @for (item of resumenMes; track item.etiqueta) {
                <div class="item-resumen">
                  <span class="resumen-label">{{ item.etiqueta }}</span>
                  <div class="resumen-barra-contenedor">
                    <div class="resumen-barra" [style.width]="item.porcentaje + '%'" [style.background]="item.color"></div>
                  </div>
                  <span class="resumen-valor">{{ item.cantidad }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cuadricula-calendario {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 20px;
      align-items: start;
    }

    @media (max-width: 1000px) {
      .cuadricula-calendario { grid-template-columns: 1fr; }
    }

    .calendario-principal { padding: 20px; }

    .nav-mes {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 16px;
    }

    .titulo-mes {
      display: flex; align-items: center; gap: 8px;
    }

    .titulo-mes h2 { font-size: 18px; font-weight: 700; color: #1a1a2e; }

    .cabecera-semana {
      display: grid; grid-template-columns: repeat(7, 1fr);
      margin-bottom: 4px;
    }

    .celda-dia-nombre {
      text-align: center; font-size: 12px; font-weight: 600;
      color: #78909c; text-transform: uppercase; padding: 6px 0;
    }

    .cuadricula-dias {
      display: grid; grid-template-columns: repeat(7, 1fr);
      gap: 2px;
    }

    .celda-dia {
      min-height: 80px; padding: 6px; border-radius: 8px;
      cursor: pointer; border: 1px solid transparent;
      transition: all 0.15s;
    }

    .celda-dia:hover { background: #f0f7ff; border-color: #bbdefb; }
    .celda-dia.hoy { background: #e3f2fd; border-color: #1565c0; }
    .celda-dia.otro-mes { opacity: 0.4; }
    .celda-dia.seleccionada { background: #1565c0; border-color: #1565c0; }
    .celda-dia.seleccionada .numero-dia { color: white; }

    .numero-dia {
      font-size: 13px; font-weight: 600; color: #1a1a2e;
      display: block; margin-bottom: 4px;
    }

    .celda-dia.hoy .numero-dia { color: #1565c0; }

    .citas-dia { display: flex; flex-direction: column; gap: 2px; }

    .punto-cita {
      font-size: 9px; padding: 1px 4px; border-radius: 3px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      color: white; cursor: pointer;
    }

    .punto-programada { background: #1565c0; }
    .punto-confirmada { background: #2e7d32; }
    .punto-en_curso { background: #e65100; }
    .punto-completada { background: #1b5e20; }
    .punto-cancelada { background: #c62828; }
    .punto-no_asistio { background: #78909c; }

    .mas-citas { font-size: 10px; color: #78909c; }

    .leyenda {
      display: flex; gap: 12px; flex-wrap: wrap;
      margin-top: 12px; padding-top: 12px; border-top: 1px solid #e0e7ef;
    }

    .leyenda-item {
      display: flex; align-items: center; gap: 4px;
      font-size: 11px; color: #546e7a;
    }

    .leyenda-item .punto-cita { padding: 4px; border-radius: 50%; }

    /* Panel del día */
    .panel-dia { display: flex; flex-direction: column; gap: 16px; }

    .panel-dia-titulo {
      display: flex; align-items: center; gap: 8px;
      margin-bottom: 12px;
    }

    .panel-dia-titulo mat-icon { color: #1565c0; }
    .panel-dia-titulo h3 { font-size: 14px; font-weight: 600; color: #1a1a2e; }

    .lista-citas-panel { display: flex; flex-direction: column; gap: 10px; }

    .item-cita-panel {
      display: flex; gap: 10px; padding: 10px;
      border-radius: 8px; border-left: 3px solid;
      background: #f8fafc; transition: all 0.2s;
    }

    .item-cita-panel:hover { background: #f0f7ff; }

    .borde-programada { border-color: #1565c0; }
    .borde-confirmada { border-color: #2e7d32; }
    .borde-en_curso { border-color: #e65100; }
    .borde-completada { border-color: #1b5e20; }
    .borde-cancelada { border-color: #c62828; }
    .borde-no_asistio { border-color: #78909c; }

    .cita-panel-hora { font-size: 12px; font-weight: 700; color: #1565c0; min-width: 40px; }
    .cita-panel-detalle { flex: 1; }
    .cita-panel-paciente { font-size: 13px; font-weight: 600; color: #1a1a2e; }
    .cita-panel-medico { font-size: 11px; color: #546e7a; }
    .cita-panel-motivo { font-size: 11px; color: #78909c; margin-top: 2px; }
    .cita-panel-acciones { display: flex; align-items: flex-start; }

    /* Resumen mes */
    .resumen-mes { display: flex; flex-direction: column; gap: 10px; }

    .item-resumen { display: flex; align-items: center; gap: 8px; }
    .resumen-label { font-size: 12px; color: #546e7a; min-width: 85px; }
    .resumen-barra-contenedor { flex: 1; height: 6px; background: #f0f4f8; border-radius: 3px; overflow: hidden; }
    .resumen-barra { height: 100%; border-radius: 3px; }
    .resumen-valor { font-size: 12px; font-weight: 600; color: #1a1a2e; min-width: 20px; }
  `]
})
export class CalendarioCitasComponent {
  tituloPagina = 'Calendario';
  migajas = 'Inicio / Citas / Calendario';

  private citaServicio = inject(CitaServicio);
  private medicoServicio = inject(MedicoServicio);
  private pacienteServicio = inject(PacienteServicio);

  etiquetasEstado = ETIQUETAS_ESTADO_CITA;
  etiquetasTipo = ETIQUETAS_TIPO_CITA;

  private _fechaActual = signal(new Date());
  private _diaSeleccionado = signal(new Date());

  nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  leyenda = [
    { estado: 'programada', etiqueta: 'Programada' },
    { estado: 'confirmada', etiqueta: 'Confirmada' },
    { estado: 'en_curso', etiqueta: 'En Curso' },
    { estado: 'completada', etiqueta: 'Completada' },
    { estado: 'cancelada', etiqueta: 'Cancelada' },
  ];

  get nombreMes() {
    return this._fechaActual().toLocaleDateString('es-EC', { month: 'long' });
  }

  get anioActual() { return this._fechaActual().getFullYear(); }

  get tituloDiaSeleccionado() {
    const d = this._diaSeleccionado();
    const hoy = new Date();
    if (d.toDateString() === hoy.toDateString()) return 'Citas de Hoy';
    return d.toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  diasCalendario = computed((): DiaCalendario[] => {
    const fecha = this._fechaActual();
    const mes = fecha.getMonth();
    const anio = fecha.getFullYear();
    const hoy = new Date();

    const primerDia = new Date(anio, mes, 1);
    const ultimoDia = new Date(anio, mes + 1, 0);

    const dias: DiaCalendario[] = [];

    // Días del mes anterior para completar la semana
    for (let i = primerDia.getDay(); i > 0; i--) {
      const d = new Date(anio, mes, 1 - i);
      dias.push(this.crearDia(d, false, hoy));
    }

    // Días del mes actual
    for (let i = 1; i <= ultimoDia.getDate(); i++) {
      const d = new Date(anio, mes, i);
      dias.push(this.crearDia(d, true, hoy));
    }

    // Días del mes siguiente para completar
    const restantes = 42 - dias.length;
    for (let i = 1; i <= restantes; i++) {
      const d = new Date(anio, mes + 1, i);
      dias.push(this.crearDia(d, false, hoy));
    }

    return dias;
  });

  private crearDia(fecha: Date, esMesActual: boolean, hoy: Date): DiaCalendario {
    const fechaStr = fecha.toISOString().split('T')[0];
    return {
      fecha,
      esHoy: fecha.toDateString() === hoy.toDateString(),
      esMesActual,
      citas: this.citaServicio.obtenerPorFecha(fechaStr),
    };
  }

  get citasDiaSeleccionado(): Cita[] {
    const fechaStr = this._diaSeleccionado().toISOString().split('T')[0];
    return this.citaServicio.obtenerPorFecha(fechaStr)
      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
  }

  get resumenMes() {
    const mes = this._fechaActual().getMonth();
    const anio = this._fechaActual().getFullYear();
    const todas = this.citaServicio.obtenerTodas().filter(c => {
      const d = new Date(c.fecha);
      return d.getMonth() === mes && d.getFullYear() === anio;
    });
    const total = todas.length || 1;
    const datos = [
      { etiqueta: 'Programadas', cantidad: todas.filter(c => c.estado === 'programada').length, color: '#1565c0' },
      { etiqueta: 'Completadas', cantidad: todas.filter(c => c.estado === 'completada').length, color: '#2e7d32' },
      { etiqueta: 'Canceladas', cantidad: todas.filter(c => c.estado === 'cancelada').length, color: '#c62828' },
    ];
    return datos.map(d => ({ ...d, porcentaje: Math.round(d.cantidad / total * 100) }));
  }

  esDiaSeleccionado(fecha: Date) {
    return fecha.toDateString() === this._diaSeleccionado().toDateString();
  }

  seleccionarDia(dia: DiaCalendario) { this._diaSeleccionado.set(dia.fecha); }
  mesAnterior() { const f = this._fechaActual(); this._fechaActual.set(new Date(f.getFullYear(), f.getMonth() - 1, 1)); }
  mesSiguiente() { const f = this._fechaActual(); this._fechaActual.set(new Date(f.getFullYear(), f.getMonth() + 1, 1)); }
  irAHoy() { this._fechaActual.set(new Date()); this._diaSeleccionado.set(new Date()); }

  getNombrePaciente(id: number) { const p = this.pacienteServicio.obtenerPorId(id); return p ? `${p.nombres} ${p.apellidos}` : '—'; }
  getNombreMedico(id: number) { const m = this.medicoServicio.obtenerPorId(id); return m ? `Dr. ${m.apellidos}` : '—'; }

  getCitaTooltip(cita: Cita) {
    const p = this.pacienteServicio.obtenerPorId(cita.pacienteId);
    return `${p?.nombres} ${p?.apellidos} - ${cita.motivo}`;
  }
}

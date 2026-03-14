import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CitaServicio } from '../../../services/cita.servicio';
import { MedicoServicio } from '../../../services/medico.servicio';
import { PacienteServicio } from '../../../services/paciente.servicio';
import { Cita, EstadoCita, TipoCita, ETIQUETAS_ESTADO_CITA, ETIQUETAS_TIPO_CITA } from '../../../models/cita.modelo';

@Component({
  selector: 'app-lista-citas',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    MatIconModule, MatButtonModule, MatTableModule, MatInputModule,
    MatFormFieldModule, MatSelectModule, MatTooltipModule, MatMenuModule, MatDividerModule, MatSnackBarModule
  ],
  template: `
    <div class="contenedor-pagina">
      <div class="encabezado-pagina">
        <h1>Gestión de Citas</h1>
        <a routerLink="/citas/nueva" mat-raised-button class="boton-primario">
          Nueva Cita
        </a>
      </div>

      <!-- Filtros -->
      <div class="tarjeta">
        <div class="barra-busqueda">
          <mat-form-field appearance="outline">
            <mat-label>Buscar cita...</mat-label>
            <input matInput [(ngModel)]="terminoBusqueda" (ngModelChange)="filtrar()" placeholder="Paciente, médico, motivo...">
          </mat-form-field>

          <mat-form-field appearance="outline" style="min-width:150px">
            <mat-label>Estado</mat-label>
            <mat-select [(ngModel)]="filtroEstado" (ngModelChange)="filtrar()">
              <mat-option value="">Todos</mat-option>
              @for (item of estadosCita; track item.valor) {
                <mat-option [value]="item.valor">{{ item.etiqueta }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <button mat-stroked-button (click)="limpiarFiltros()" style="vertical-align: middle;">Limpiar</button>

          <span class="contador-resultados">{{ citasFiltradas().length }} cita(s)</span>
        </div>

        <!-- Tabla -->
        <div class="tabla-contenedor">
          <table mat-table [dataSource]="citasFiltradas()">

            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>#</th>
              <td mat-cell *matCellDef="let c">
                <span style="font-weight:700;color:#1565c0">#{{ c.id.toString().slice(-4) }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="paciente">
              <th mat-header-cell *matHeaderCellDef>Paciente</th>
              <td mat-cell *matCellDef="let c">
                <div>
                  <div>
                    <div class="nombre-tabla">{{ getNombrePaciente(c.pacienteId) }}</div>
                    <div class="sub-tabla">{{ getCedulaPaciente(c.pacienteId) }}</div>
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="medico">
              <th mat-header-cell *matHeaderCellDef>Médico</th>
              <td mat-cell *matCellDef="let c">
                <div class="nombre-tabla">{{ getNombreMedico(c.medicoId) }}</div>
              </td>
            </ng-container>

            <ng-container matColumnDef="fechaHora">
              <th mat-header-cell *matHeaderCellDef>Fecha y Hora</th>
              <td mat-cell *matCellDef="let c">
                <div style="font-weight:600;color:#1a1a2e;font-size:13px">{{ c.fecha | date:'dd/MM/yyyy':'':'es' }}</div>
                <div class="sub-tabla">{{ c.horaInicio }} - {{ c.horaFin }}</div>
              </td>
            </ng-container>

            <ng-container matColumnDef="sala">
              <th mat-header-cell *matHeaderCellDef>Sala</th>
              <td mat-cell *matCellDef="let c">
                <span class="sub-tabla">{{ c.consultorio || '—' }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="tipo">
              <th mat-header-cell *matHeaderCellDef>Tipo</th>
              <td mat-cell *matCellDef="let c">
                <span class="chip-tipo chip-{{ c.tipo }}">{{ getTipoLabel(c) }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="estado">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let c">
                <span class="estado-badge" [class]="'estado-' + c.estado">{{ getEstadoLabel(c) }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let c">
                <div style="display:flex;gap:4px">
                  <a [routerLink]="['/citas', c.id, 'editar']" mat-button color="primary">Editar</a>
                  <button mat-button [matMenuTriggerFor]="menuEstado">Estado</button>
                  <mat-menu #menuEstado="matMenu">
                    <button mat-menu-item (click)="cambiarEstado(c, 'confirmada')">Confirmar</button>
                    <button mat-menu-item (click)="cambiarEstado(c, 'en_curso')">En Curso</button>
                    <button mat-menu-item (click)="cambiarEstado(c, 'completada')">Completada</button>
                    <button mat-menu-item (click)="cambiarEstado(c, 'cancelada')">Cancelar</button>
                    <button mat-menu-item (click)="cambiarEstado(c, 'no_asistio')">No Asistió</button>
                    <mat-divider></mat-divider>
                    <button mat-menu-item (click)="eliminar(c)" style="color:#c62828">Eliminar</button>
                  </mat-menu>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columnas"></tr>
            <tr mat-row *matRowDef="let row; columns: columnas;"></tr>
            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell" colspan="8">
                <div class="sin-resultados">
                  <p>No se encontraron citas</p>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mini-stat {
      background: white; border-radius: 10px; padding: 14px 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.07);
      display: flex; flex-direction: column; gap: 4px;
    }
    .mini-stat-num { font-size: 26px; font-weight: 700; }
    .mini-stat-label { font-size: 12px; color: #78909c; }
    .nombre-tabla { font-size: 13px; font-weight: 600; color: #1a1a2e; }
    .sub-tabla { font-size: 12px; color: #78909c; }
    .contador-resultados { font-size: 13px; color: #78909c; margin-left: auto; white-space: nowrap; }
  `]
})
export class ListaCitasComponent {
  tituloPagina = 'Citas';
  migajas = 'Inicio / Citas';

  private citaServicio = inject(CitaServicio);
  private medicoServicio = inject(MedicoServicio);
  private pacienteServicio = inject(PacienteServicio);
  private snackBar = inject(MatSnackBar);

  columnas = ['id', 'paciente', 'medico', 'fechaHora', 'sala', 'tipo', 'estado', 'acciones'];
  terminoBusqueda = '';
  filtroEstado = '';
  filtroTipo = '';
  filtroFecha = '';
  etiquetasEstado = ETIQUETAS_ESTADO_CITA;
  etiquetasTipo = ETIQUETAS_TIPO_CITA;

  estadosCita = Object.entries(ETIQUETAS_ESTADO_CITA).map(([valor, etiqueta]) => ({ valor, etiqueta }));

  private _filtradas = signal<Cita[]>(this.citaServicio.obtenerTodas());
  citasFiltradas = this._filtradas.asReadonly();

  get estadisticasRapidas() {
    const r = this.citaServicio.resumen();
    return [
      { etiqueta: 'Total', valor: r.total, color: '#1565c0' },
      { etiqueta: 'Programadas', valor: r.programadas, color: '#0277bd' },
      { etiqueta: 'Completadas', valor: r.completadas, color: '#2e7d32' },
      { etiqueta: 'Canceladas', valor: r.canceladas + r.noAsistio, color: '#c62828' },
    ];
  }

  filtrar() {
    let lista = this.citaServicio.obtenerTodas();
    if (this.terminoBusqueda) {
      const t = this.terminoBusqueda.toLowerCase();
      lista = lista.filter(c => {
        const p = this.pacienteServicio.obtenerPorId(c.pacienteId);
        const m = this.medicoServicio.obtenerPorId(c.medicoId);
        return (
          (p && (`${p.nombres} ${p.apellidos}`).toLowerCase().includes(t)) ||
          (m && (`${m.nombres} ${m.apellidos}`).toLowerCase().includes(t)) ||
          c.motivo.toLowerCase().includes(t)
        );
      });
    }
    if (this.filtroEstado) lista = lista.filter(c => c.estado === this.filtroEstado);
    if (this.filtroTipo) lista = lista.filter(c => c.tipo === this.filtroTipo);
    if (this.filtroFecha) lista = lista.filter(c => c.fecha === this.filtroFecha);
    this._filtradas.set(lista);
  }

  limpiarFiltros() {
    this.terminoBusqueda = '';
    this.filtroEstado = '';
    this.filtroTipo = '';
    this.filtroFecha = '';
    this.filtrar();
  }

  getTipoLabel(c: Cita) { return ETIQUETAS_TIPO_CITA[c.tipo] ?? c.tipo; }
  getEstadoLabel(c: Cita) { return ETIQUETAS_ESTADO_CITA[c.estado] ?? c.estado; }
  getNombrePaciente(id: number) { const p = this.pacienteServicio.obtenerPorId(id); return p ? `${p.nombres} ${p.apellidos}` : '—'; }
  getCedulaPaciente(id: number) { return this.pacienteServicio.obtenerPorId(id)?.cedula ?? '—'; }
  getNombreMedico(id: number) { const m = this.medicoServicio.obtenerPorId(id); return m ? `Dr. ${m.nombres} ${m.apellidos}` : '—'; }
  iniciales(pacienteId: number) { const p = this.pacienteServicio.obtenerPorId(pacienteId); return p ? `${p.nombres.charAt(0)}${p.apellidos.charAt(0)}` : '??'; }

  cambiarEstado(cita: Cita, estado: EstadoCita) {
    this.citaServicio.cambiarEstado(cita.id, estado);
    this.filtrar();
    this.snackBar.open(`Estado cambiado a: ${ETIQUETAS_ESTADO_CITA[estado]}`, 'Cerrar', { duration: 3000 });
  }

  eliminar(cita: Cita) {
    if (confirm('¿Desea eliminar esta cita?')) {
      this.citaServicio.eliminar(cita.id);
      this.filtrar();
      this.snackBar.open('Cita eliminada', 'Cerrar', { duration: 3000 });
    }
  }
}

import { Component, inject, signal, computed } from '@angular/core';
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
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MedicoServicio } from '../../../services/medico.servicio';
import { Medico } from '../../../models/medico.modelo';

@Component({
  selector: 'app-lista-medicos',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    MatIconModule, MatButtonModule, MatTableModule, MatInputModule,
    MatFormFieldModule, MatSelectModule, MatTooltipModule, MatChipsModule,
    MatDialogModule, MatSnackBarModule
  ],
  template: `
    <div class="contenedor-pagina">
      <div class="encabezado-pagina">
        <h1>Médicos</h1>
        <a routerLink="/medicos/nuevo" mat-raised-button class="boton-primario">
          Registrar Médico
        </a>
      </div>

      <!-- Filtros -->
      <div class="tarjeta">
        <div class="barra-busqueda">
          <mat-form-field appearance="outline">
            <mat-label>Buscar médico...</mat-label>
            <input matInput [(ngModel)]="terminoBusqueda" (ngModelChange)="filtrar()" placeholder="Nombre, cédula, especialidad...">
          </mat-form-field>

          <mat-form-field appearance="outline" style="min-width:160px">
            <mat-label>Estado</mat-label>
            <mat-select [(ngModel)]="filtroEstado" (ngModelChange)="filtrar()">
              <mat-option value="">Todos</mat-option>
              <mat-option value="activo">Activo</mat-option>
              <mat-option value="vacaciones">Vacaciones</mat-option>
              <mat-option value="licencia">Licencia</mat-option>
              <mat-option value="inactivo">Inactivo</mat-option>
            </mat-select>
          </mat-form-field>

          <span class="contador-resultados">{{ medicosFiltrados().length }} médico(s)</span>
        </div>

        <!-- Tabla -->
        <div class="tabla-contenedor">
          <table mat-table [dataSource]="medicosFiltrados()">

            <ng-container matColumnDef="medico">
              <th mat-header-cell *matHeaderCellDef>Médico</th>
              <td mat-cell *matCellDef="let m">
                <div>
                  <div class="nombre-tabla">Dr. {{ m.nombres }} {{ m.apellidos }}</div>
                  <div class="sub-tabla">Reg. {{ m.registroMedico }}</div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="especialidad">
              <th mat-header-cell *matHeaderCellDef>Especialidad</th>
              <td mat-cell *matCellDef="let m">
                <span class="sub-tabla">{{ m.especialidad }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="contacto">
              <th mat-header-cell *matHeaderCellDef>Contacto</th>
              <td mat-cell *matCellDef="let m">
                <div class="sub-tabla">{{ m.email }}</div>
                <div class="sub-tabla">{{ m.telefono }}</div>
              </td>
            </ng-container>

            <ng-container matColumnDef="consultorio">
              <th mat-header-cell *matHeaderCellDef>Consultorio</th>
              <td mat-cell *matCellDef="let m">
                <span class="sub-tabla">{{ m.consultorio }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="estado">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let m">
                <span class="estado-badge" [class]="'estado-' + m.estado">{{ etiquetaEstado(m.estado) }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef style="text-align:center">Acciones</th>
              <td mat-cell *matCellDef="let m" style="text-align:center">
                <a [routerLink]="['/medicos', m.id, 'editar']" mat-button color="primary">Editar</a>
                <button mat-button color="warn" (click)="confirmarEliminar(m)">Eliminar</button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columnas"></tr>
            <tr mat-row *matRowDef="let row; columns: columnas;"></tr>

            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell" colspan="6">
                <div class="sin-resultados">
                  <p>No se encontraron médicos con los filtros aplicados</p>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .celda-medico { display: flex; align-items: center; gap: 10px; }
    .nombre-tabla { font-size: 14px; font-weight: 600; color: #1a1a2e; }
    .sub-tabla { font-size: 12px; color: #78909c; display: flex; align-items: center; gap: 3px; }
    .chip-especialidad {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 4px 10px; border-radius: 16px; font-size: 12px; font-weight: 500;
    }
    .consultorio-badge {
      display: flex; align-items: center; gap: 4px;
      font-size: 13px; color: #546e7a; font-weight: 500;
    }
    .consultorio-badge mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .contador-resultados { font-size: 13px; color: #78909c; margin-left: auto; white-space: nowrap; }
  `]
})
export class ListaMedicosComponent {
  tituloPagina = 'Médicos';
  migajas = 'Inicio / Médicos';

  private medicoServicio = inject(MedicoServicio);
  private snackBar = inject(MatSnackBar);

  columnas = ['medico', 'especialidad', 'contacto', 'consultorio', 'estado', 'acciones'];
  terminoBusqueda = '';
  filtroEspecialidad: any = '';
  filtroEstado = '';

  private _filtrados = signal<Medico[]>(this.medicoServicio.obtenerTodos());
  medicosFiltrados = this._filtrados.asReadonly();


  filtrar() {
    let lista = this.medicoServicio.obtenerTodos();
    if (this.terminoBusqueda) {
      const t = this.terminoBusqueda.toLowerCase();
      lista = lista.filter(m =>
        m.nombres.toLowerCase().includes(t) ||
        m.apellidos.toLowerCase().includes(t) ||
        m.cedula.includes(t) ||
        m.email.toLowerCase().includes(t)
      );
    }
    if (this.filtroEstado) {
      lista = lista.filter(m => m.estado === this.filtroEstado);
    }
    this._filtrados.set(lista);
  }

  limpiarBusqueda() { this.terminoBusqueda = ''; this.filtrar(); }

  iniciales(m: Medico) { return `${m.nombres.charAt(0)}${m.apellidos.charAt(0)}`; }

  etiquetaEstado(estado: string) {
    const map: Record<string, string> = { activo: 'Activo', inactivo: 'Inactivo', vacaciones: 'Vacaciones', licencia: 'Licencia' };
    return map[estado] ?? estado;
  }

  confirmarEliminar(m: Medico) {
    if (confirm(`¿Desea eliminar al Dr. ${m.nombres} ${m.apellidos}?`)) {
      this.medicoServicio.eliminar(m.id);
      this.filtrar();
      this.snackBar.open('Médico eliminado correctamente', 'Cerrar', { duration: 3000 });
    }
  }
}

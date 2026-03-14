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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { PacienteServicio } from '../../../services/paciente.servicio';
import { Paciente, calcularEdad } from '../../../models/paciente.modelo';

@Component({
  selector: 'app-lista-pacientes',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    MatIconModule, MatButtonModule, MatTableModule, MatInputModule,
    MatFormFieldModule, MatSelectModule, MatTooltipModule, MatSnackBarModule
  ],
  template: `
    <div class="contenedor-pagina">
      <div class="encabezado-pagina">
        <h1>Pacientes</h1>
        <a routerLink="/pacientes/nuevo" mat-raised-button class="boton-primario">
          Registrar Paciente
        </a>
      </div>

      <div class="tarjeta">
        <div class="barra-busqueda">
          <mat-form-field appearance="outline">
            <mat-label>Buscar paciente...</mat-label>
            <input matInput [(ngModel)]="terminoBusqueda" (ngModelChange)="filtrar()" placeholder="Nombre, cédula, email...">
          </mat-form-field>

          <mat-form-field appearance="outline" style="min-width:150px">
            <mat-label>Estado</mat-label>
            <mat-select [(ngModel)]="filtroEstado" (ngModelChange)="filtrar()">
              <mat-option value="">Todos</mat-option>
              <mat-option value="activo">Activo</mat-option>
              <mat-option value="inactivo">Inactivo</mat-option>
            </mat-select>
          </mat-form-field>

          <span class="contador-resultados">{{ pacientesFiltrados().length }} paciente(s)</span>
        </div>

        <div class="tabla-contenedor">
          <table mat-table [dataSource]="pacientesFiltrados()">

            <ng-container matColumnDef="paciente">
              <th mat-header-cell *matHeaderCellDef>Paciente</th>
              <td mat-cell *matCellDef="let p">
                <div class="nombre-tabla">{{ p.nombres }} {{ p.apellidos }}</div>
                <div class="sub-tabla">CI: {{ p.cedula }}</div>
              </td>
            </ng-container>

            <ng-container matColumnDef="datos">
              <th mat-header-cell *matHeaderCellDef>Datos</th>
              <td mat-cell *matCellDef="let p">
                <div class="sub-tabla">{{ calcularEdad(p.fechaNacimiento) }} años • {{ etiquetaGenero(p.genero) }}</div>
                <div class="sub-tabla">
                  <span class="tipo-sangre">{{ p.tipoSangre }}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="contacto">
              <th mat-header-cell *matHeaderCellDef>Contacto</th>
              <td mat-cell *matCellDef="let p">
                <div class="sub-tabla">{{ p.telefono }}</div>
                <div class="sub-tabla">{{ p.email }}</div>
              </td>
            </ng-container>

            <ng-container matColumnDef="estado">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let p">
                <span class="estado-badge" [class]="'estado-' + p.estado">
                  {{ p.estado === 'activo' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef style="text-align:center">Acciones</th>
              <td mat-cell *matCellDef="let p" style="text-align:center">
                <a [routerLink]="['/pacientes', p.id, 'editar']" mat-button color="primary">Editar</a>
                <button mat-button color="warn" (click)="confirmarEliminar(p)">Eliminar</button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columnas"></tr>
            <tr mat-row *matRowDef="let row; columns: columnas;"></tr>
            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell" colspan="6">
                <div class="sin-resultados">
                  <p>No se encontraron pacientes</p>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .celda-paciente { display: flex; align-items: center; gap: 10px; }
    .nombre-tabla { font-size: 14px; font-weight: 600; color: #1a1a2e; }
    .sub-tabla { font-size: 12px; color: #78909c; display: flex; align-items: center; gap: 3px; }
    .tipo-sangre {
      display: inline-block; background: #e3f2fd; color: #1565c0;
      padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 700;
    }
    .contador-resultados { font-size: 13px; color: #78909c; margin-left: auto; white-space: nowrap; }
  `]
})
export class ListaPacientesComponent {
  tituloPagina = 'Pacientes';
  migajas = 'Inicio / Pacientes';

  private pacienteServicio = inject(PacienteServicio);
  private snackBar = inject(MatSnackBar);

  columnas = ['paciente', 'datos', 'contacto', 'estado', 'acciones'];
  terminoBusqueda = '';
  filtroGenero = '';
  filtroEstado = '';

  private _filtrados = signal<Paciente[]>(this.pacienteServicio.obtenerTodos());
  pacientesFiltrados = this._filtrados.asReadonly();

  calcularEdad = calcularEdad;
  iniciales = (p: Paciente) => `${p.nombres.charAt(0)}${p.apellidos.charAt(0)}`;
  etiquetaGenero = (g: string) => ({ masculino: 'Masculino', femenino: 'Femenino', otro: 'Otro' }[g] ?? g);

  filtrar() {
    let lista = this.pacienteServicio.obtenerTodos();
    if (this.terminoBusqueda) {
      const t = this.terminoBusqueda.toLowerCase();
      lista = lista.filter(p =>
        p.nombres.toLowerCase().includes(t) ||
        p.apellidos.toLowerCase().includes(t) ||
        p.cedula.includes(t) ||
        p.email.toLowerCase().includes(t)
      );
    }
    if (this.filtroGenero) lista = lista.filter(p => p.genero === this.filtroGenero);
    if (this.filtroEstado) lista = lista.filter(p => p.estado === this.filtroEstado);
    this._filtrados.set(lista);
  }

  limpiar() { this.terminoBusqueda = ''; this.filtrar(); }

  confirmarEliminar(p: Paciente) {
    if (confirm(`¿Desea eliminar al paciente ${p.nombres} ${p.apellidos}?`)) {
      this.pacienteServicio.eliminar(p.id);
      this.filtrar();
      this.snackBar.open('Paciente eliminado', 'Cerrar', { duration: 3000 });
    }
  }
}

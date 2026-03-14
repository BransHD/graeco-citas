import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { HorarioServicio } from '../../services/horario.servicio';
import { MedicoServicio } from '../../services/medico.servicio';
import { Horario, DIAS_SEMANA } from '../../models/horario.modelo';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="contenedor-pagina">
      <div class="encabezado-pagina">
        <h1>Horarios de Atención</h1>
        <button
          mat-raised-button
          class="boton-primario"
          (click)="mostrarFormulario = !mostrarFormulario; limpiar()"
        >
          {{ mostrarFormulario ? 'Cancelar' : 'Nuevo Horario' }}
        </button>
      </div>

      <!-- Formulario -->
      @if (mostrarFormulario) {
        <div class="tarjeta">
          <div class="seccion-titulo">
            {{ esEdicion ? 'Editar Horario' : 'Registrar Nuevo Horario' }}
          </div>
          <form [formGroup]="formulario" (ngSubmit)="guardar()">
            <div class="cuadricula-3">
              <mat-form-field appearance="outline">
                <mat-label>Médico *</mat-label>
                <mat-select formControlName="medicoId">
                  @for (m of medicos; track m.id) {
                    <mat-option [value]="m.id">Dr. {{ m.nombres }} {{ m.apellidos }}</mat-option>
                  }
                </mat-select>
                <mat-error>Seleccione un médico</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Consultorio *</mat-label>
                <mat-select formControlName="consultorio">
                  <mat-option value="101">Consultorio 101</mat-option>
                  <mat-option value="102">Consultorio 102</mat-option>
                  <mat-option value="103">Consultorio 103</mat-option>
                  <mat-option value="104">Consultorio 104</mat-option>
                  <mat-option value="105">Consultorio 105</mat-option>
                </mat-select>
                <mat-error>Seleccione un consultorio</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Día de la Semana *</mat-label>
                <mat-select formControlName="diaSemana">
                  @for (dia of diasSemana; track dia.valor) {
                    <mat-option [value]="dia.valor">{{ dia.etiqueta }}</mat-option>
                  }
                </mat-select>
                <mat-error>Seleccione un día</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Hora de Inicio *</mat-label>
                <input matInput type="time" formControlName="horaInicio" />
                <mat-error>Campo requerido</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Hora de Fin *</mat-label>
                <input matInput type="time" formControlName="horaFin" />
                <mat-error>Campo requerido</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Intervalo (minutos) *</mat-label>
                <mat-select formControlName="intervaloMinutos">
                  <mat-option [value]="15">15 minutos</mat-option>
                  <mat-option [value]="20">20 minutos</mat-option>
                  <mat-option [value]="30">30 minutos</mat-option>
                  <mat-option [value]="45">45 minutos</mat-option>
                  <mat-option [value]="60">60 minutos</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Cupo Máximo *</mat-label>
                <input matInput type="number" formControlName="cupoMaximo" min="1" max="50" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Estado</mat-label>
                <mat-select formControlName="estado">
                  <mat-option value="activo">Activo</mat-option>
                  <mat-option value="inactivo">Inactivo</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="acciones-formulario">
              <button type="button" mat-stroked-button (click)="cerrar()">Cancelar</button>
              <button
                type="submit"
                mat-raised-button
                class="boton-primario"
                [disabled]="formulario.invalid"
              >
                {{ esEdicion ? 'Actualizar Horario' : 'Registrar Horario' }}
              </button>
            </div>
          </form>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .tarjeta-encabezado-h {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        flex-wrap: wrap;
        gap: 12px;
      }
      .nombre-tabla {
        font-size: 14px;
        font-weight: 600;
        color: #1a1a2e;
      }
      .sub-tabla {
        font-size: 12px;
        color: #78909c;
      }
      .dia-badge {
        display: inline-block;
        padding: 3px 10px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
        background: #e3f2fd;
        color: #1565c0;
      }
    `,
  ],
})
export class HorariosComponent {
  tituloPagina = 'Horarios';
  migajas = 'Inicio / Horarios';

  private horarioServicio = inject(HorarioServicio);
  private medicoServicio = inject(MedicoServicio);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  diasSemana = DIAS_SEMANA;
  mostrarFormulario = false;
  esEdicion = false;
  idEdicion: number | null = null;
  filtroMedico: any = '';
  columnas = ['medico', 'dia', 'horario', 'consultorio', 'estado', 'acciones'];

  formulario = this.fb.group({
    medicoId: [null as number | null, Validators.required],
    consultorio: ['', Validators.required],
    diaSemana: ['lunes', Validators.required],
    horaInicio: ['08:00', Validators.required],
    horaFin: ['12:00', Validators.required],
    intervaloMinutos: [30, Validators.required],
    cupoMaximo: [8, Validators.required],
    estado: ['activo'],
  });

  get medicos() {
    return this.medicoServicio.obtenerActivos();
  }

  get horariosFiltrados(): Horario[] {
    const todos = this.horarioServicio.obtenerTodos();
    return this.filtroMedico
      ? todos.filter((h) => h.medicoId === Number(this.filtroMedico))
      : todos;
  }

  getNombreMedico(id: number) {
    const m = this.medicoServicio.obtenerPorId(id);
    return m ? `Dr. ${m.nombres} ${m.apellidos}` : '—';
  }

  etiquetaDia(dia: string) {
    return DIAS_SEMANA.find((d) => d.valor === dia)?.etiqueta ?? dia;
  }

  editarHorario(h: Horario) {
    this.esEdicion = true;
    this.idEdicion = h.id;
    this.formulario.patchValue(h as any);
    this.mostrarFormulario = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  limpiar() {
    this.esEdicion = false;
    this.idEdicion = null;
    this.formulario.reset({
      consultorio: '',
      diaSemana: 'lunes',
      horaInicio: '08:00',
      horaFin: '12:00',
      intervaloMinutos: 30,
      cupoMaximo: 8,
      estado: 'activo',
    });
  }

  cerrar() {
    this.mostrarFormulario = false;
    this.limpiar();
  }

  guardar() {
    if (this.formulario.invalid) return;
    const datos = this.formulario.value as any;
    datos.medicoId = Number(datos.medicoId);
    if (this.esEdicion && this.idEdicion) {
      this.horarioServicio.actualizar(this.idEdicion, datos);
      this.snackBar.open('Horario actualizado', 'Cerrar', { duration: 3000 });
    } else {
      this.horarioServicio.agregar(datos);
      this.snackBar.open('Horario registrado correctamente', 'Cerrar', { duration: 3000 });
    }
    this.cerrar();
  }

  eliminar(h: Horario) {
    if (confirm('¿Eliminar este horario?')) {
      this.horarioServicio.eliminar(h.id);
      this.snackBar.open('Horario eliminado', 'Cerrar', { duration: 3000 });
    }
  }
}

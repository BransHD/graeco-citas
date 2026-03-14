import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CitaServicio } from '../../../services/cita.servicio';
import { MedicoServicio } from '../../../services/medico.servicio';
import { PacienteServicio } from '../../../services/paciente.servicio';
import { Medico } from '../../../models/medico.modelo';

@Component({
  selector: 'app-formulario-cita',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatIconModule, MatButtonModule, MatInputModule,
    MatFormFieldModule, MatSelectModule, MatSnackBarModule
  ],
  template: `
    <div class="contenedor-pagina">
      <div class="encabezado-pagina">
        <h1>{{ esEdicion ? 'Editar Cita' : 'Programar Nueva Cita' }}</h1>
        <a routerLink="/citas" mat-stroked-button>Volver</a>
      </div>

      <form [formGroup]="formulario" (ngSubmit)="guardar()" class="formulario-contenedor">

        <!-- Paciente -->
        <div class="seccion-formulario">
          <div class="seccion-titulo">Datos del Paciente</div>
          <div class="cuadricula-2">
            <mat-form-field appearance="outline">
              <mat-label>Paciente *</mat-label>
              <mat-select formControlName="pacienteId">
                @for (p of pacientes; track p.id) {
                  <mat-option [value]="p.id">{{ p.nombres }} {{ p.apellidos }} - CI: {{ p.cedula }}</mat-option>
                }
              </mat-select>
              <mat-error>Seleccione un paciente</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Tipo de Cita *</mat-label>
              <mat-select formControlName="tipo">
                <mat-option value="primera_vez">Primera Vez</mat-option>
                <mat-option value="control">Control / Seguimiento</mat-option>
                <mat-option value="urgencia">Urgencia</mat-option>
                <mat-option value="procedimiento">Procedimiento</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>

        <!-- Médico -->
        <div class="seccion-formulario">
          <div class="seccion-titulo">Médico</div>
          <div class="cuadricula-2">
            <mat-form-field appearance="outline">
              <mat-label>Médico *</mat-label>
              <mat-select formControlName="medicoId" (selectionChange)="onMedicoChange()">
                @for (m of medicos; track m.id) {
                  <mat-option [value]="m.id">Dr. {{ m.nombres }} {{ m.apellidos }} — {{ m.especialidad }}</mat-option>
                }
              </mat-select>
              <mat-error>Seleccione un médico</mat-error>
            </mat-form-field>

            @if (medicoSeleccionado) {
              <div style="display:flex;align-items:center;gap:16px;padding:0 8px;font-size:13px;color:#546e7a">
                <span><strong>Especialidad:</strong> {{ medicoSeleccionado.especialidad }}</span>
                <span><strong>Consultorio:</strong> {{ medicoSeleccionado.consultorio }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Fecha y Hora -->
        <div class="seccion-formulario">
          <div class="seccion-titulo">Fecha y Horario</div>
          <div class="cuadricula-3">
            <mat-form-field appearance="outline">
              <mat-label>Fecha *</mat-label>
              <input matInput type="date" formControlName="fecha" [min]="hoy">
              <mat-error>Seleccione una fecha</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Hora de Inicio *</mat-label>
              <input matInput type="time" formControlName="horaInicio">
              <mat-error>Campo requerido</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Hora de Fin *</mat-label>
              <input matInput type="time" formControlName="horaFin">
              <mat-error>Campo requerido</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Estado</mat-label>
              <mat-select formControlName="estado">
                <mat-option value="programada">Programada</mat-option>
                <mat-option value="confirmada">Confirmada</mat-option>
                <mat-option value="cancelada">Cancelada</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>

        <!-- Motivo y Notas -->
        <div class="seccion-formulario">
          <div class="seccion-titulo">Motivo y Observaciones</div>
          <mat-form-field appearance="outline" style="width:100%;margin-bottom:12px">
            <mat-label>Motivo de Consulta *</mat-label>
            <textarea matInput formControlName="motivo" rows="3" placeholder="Describa el motivo de la consulta..."></textarea>
            <mat-error>Campo requerido (mínimo 5 caracteres)</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" style="width:100%;margin-bottom:12px">
            <mat-label>Notas Adicionales</mat-label>
            <textarea matInput formControlName="notas" rows="2" placeholder="Notas para el médico..."></textarea>
          </mat-form-field>

          @if (esEdicion) {
            <mat-form-field appearance="outline" style="width:100%">
              <mat-label>Diagnóstico / Resultado</mat-label>
              <textarea matInput formControlName="diagnostico" rows="2"></textarea>
            </mat-form-field>
          }
        </div>

        <div class="acciones-formulario">
          <a routerLink="/citas" mat-stroked-button>Cancelar</a>
          <button mat-raised-button class="boton-primario" type="submit" [disabled]="formulario.invalid">
            {{ esEdicion ? 'Actualizar Cita' : 'Programar Cita' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class FormularioCitaComponent implements OnInit {
  tituloPagina = 'Citas';
  migajas = 'Inicio / Citas / Formulario';

  private fb = inject(FormBuilder);
  private citaServicio = inject(CitaServicio);
  private medicoServicio = inject(MedicoServicio);
  private pacienteServicio = inject(PacienteServicio);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  esEdicion = false;
  idEdicion: number | null = null;
  medicoSeleccionado: Medico | null = null;
  hoy = new Date().toISOString().split('T')[0];

  formulario = this.fb.group({
    pacienteId: [null as number | null, Validators.required],
    medicoId: [null as number | null, Validators.required],
    fecha: [this.hoy, Validators.required],
    horaInicio: ['08:00', Validators.required],
    horaFin: ['08:30', Validators.required],
    motivo: ['', [Validators.required, Validators.minLength(5)]],
    notas: [''],
    diagnostico: [''],
    tipo: ['primera_vez', Validators.required],
    estado: ['programada', Validators.required],
  });

  get pacientes() { return this.pacienteServicio.obtenerActivos(); }
  get medicos() { return this.medicoServicio.obtenerActivos(); }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.idEdicion = Number(id);
      const cita = this.citaServicio.obtenerPorId(this.idEdicion);
      if (cita) {
        this.formulario.patchValue(cita as any);
        this.medicoSeleccionado = this.medicoServicio.obtenerPorId(cita.medicoId) ?? null;
        this.tituloPagina = `Editar Cita #${id}`;
      }
    }
  }

  onMedicoChange() {
    const medicoId = Number(this.formulario.value.medicoId);
    this.medicoSeleccionado = this.medicoServicio.obtenerPorId(medicoId) ?? null;
  }

  guardar() {
    if (this.formulario.invalid) return;
    const datos = this.formulario.value as any;
    datos.pacienteId = Number(datos.pacienteId);
    datos.medicoId = Number(datos.medicoId);
    datos.consultorio = this.medicoSeleccionado?.consultorio ?? '';

    if (this.esEdicion && this.idEdicion) {
      this.citaServicio.actualizar(this.idEdicion, datos);
      this.snackBar.open('Cita actualizada correctamente', 'Cerrar', { duration: 3000 });
    } else {
      this.citaServicio.agregar(datos);
      this.snackBar.open('Cita programada correctamente', 'Cerrar', { duration: 3000 });
    }
    this.router.navigate(['/citas']);
  }
}

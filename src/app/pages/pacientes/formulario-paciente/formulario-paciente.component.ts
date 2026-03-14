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

import { PacienteServicio } from '../../../services/paciente.servicio';

@Component({
  selector: 'app-formulario-paciente',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatIconModule, MatButtonModule, MatInputModule,
    MatFormFieldModule, MatSelectModule, MatSnackBarModule
  ],
  template: `
    <div class="contenedor-pagina">
      <div class="encabezado-pagina">
        <h1>{{ esEdicion ? 'Editar Paciente' : 'Registrar Nuevo Paciente' }}</h1>
        <a routerLink="/pacientes" mat-stroked-button>Volver</a>
      </div>

      <form [formGroup]="formulario" (ngSubmit)="guardar()" class="formulario-contenedor">

        <div class="seccion-formulario">
          <div class="seccion-titulo">Datos Personales</div>
          <div class="cuadricula-2">
            <mat-form-field appearance="outline">
              <mat-label>Nombres *</mat-label>
              <input matInput formControlName="nombres">
              <mat-error>Campo requerido</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Apellidos *</mat-label>
              <input matInput formControlName="apellidos">
              <mat-error>Campo requerido</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>DNI *</mat-label>
              <input matInput formControlName="cedula" placeholder="15640832">
              <mat-error>Ingrese cédula de mínimo 8 dígitos numéricos</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Fecha de Nacimiento *</mat-label>
              <input matInput type="date" formControlName="fechaNacimiento">
              <mat-error>Campo requerido</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Género *</mat-label>
              <mat-select formControlName="genero">
                <mat-option value="masculino">Masculino</mat-option>
                <mat-option value="femenino">Femenino</mat-option>
                <mat-option value="otro">Otro</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Tipo de Sangre *</mat-label>
              <mat-select formControlName="tipoSangre">
                @for (ts of tiposSangre; track ts) {
                  <mat-option [value]="ts">{{ ts }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
          </div>
        </div>

        <div class="seccion-formulario">
          <div class="seccion-titulo">Contacto y Dirección</div>
          <div class="cuadricula-2">
            <mat-form-field appearance="outline">
              <mat-label>Correo Electrónico *</mat-label>
              <input matInput type="email" formControlName="email">
              <mat-error>Ingrese un correo válido</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Teléfono *</mat-label>
              <input matInput formControlName="telefono">
              <mat-error>Campo requerido</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Teléfono de Emergencia</mat-label>
              <input matInput formControlName="telefonoEmergencia">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Contacto de Emergencia</mat-label>
              <input matInput formControlName="contactoEmergencia" placeholder="Nombre y relación">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Dirección *</mat-label>
              <input matInput formControlName="direccion">
              <mat-error>Campo requerido</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Ciudad *</mat-label>
              <input matInput formControlName="ciudad">
              <mat-error>Campo requerido</mat-error>
            </mat-form-field>
          </div>
        </div>
        <div class="acciones-formulario">
          <a routerLink="/pacientes" mat-stroked-button>Cancelar</a>
          <button mat-raised-button class="boton-primario" type="submit" [disabled]="formulario.invalid">
            {{ esEdicion ? 'Actualizar Paciente' : 'Registrar Paciente' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class FormularioPacienteComponent implements OnInit {
  tituloPagina = 'Pacientes';
  migajas = 'Inicio / Pacientes / Formulario';

  private fb = inject(FormBuilder);
  private pacienteServicio = inject(PacienteServicio);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  esEdicion = false;
  idEdicion: number | null = null;

  tiposSangre = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  formulario = this.fb.group({
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    cedula: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^\d+$/)]],
    fechaNacimiento: ['', Validators.required],
    genero: ['masculino', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required],
    telefonoEmergencia: [''],
    contactoEmergencia: [''],
    direccion: ['', Validators.required],
    ciudad: ['Quito', Validators.required],
    tipoSangre: ['O+', Validators.required],
    alergias: [''],
    enfermedadesBase: [''],
    seguroMedico: [''],
    numeroSeguro: [''],
    observaciones: [''],
    estado: ['activo'],
    fechaRegistro: [new Date().toISOString().split('T')[0]],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.idEdicion = Number(id);
      const paciente = this.pacienteServicio.obtenerPorId(this.idEdicion);
      if (paciente) {
        this.formulario.patchValue(paciente as any);
        this.tituloPagina = `Editar - ${paciente.nombres}`;
      }
    }
  }

  guardar() {
    if (this.formulario.invalid) return;
    const datos = this.formulario.value as any;
    if (this.esEdicion && this.idEdicion) {
      this.pacienteServicio.actualizar(this.idEdicion, datos);
      this.snackBar.open('Paciente actualizado correctamente', 'Cerrar', { duration: 3000 });
    } else {
      this.pacienteServicio.agregar(datos);
      this.snackBar.open('Paciente registrado correctamente', 'Cerrar', { duration: 3000 });
    }
    this.router.navigate(['/pacientes']);
  }
}

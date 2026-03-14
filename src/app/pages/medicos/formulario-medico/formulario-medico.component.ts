import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MedicoServicio } from '../../../services/medico.servicio';

@Component({
  selector: 'app-formulario-medico',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule,
    MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatSnackBarModule
  ],
  template: `
    <div class="contenedor-pagina">
      <div class="encabezado-pagina">
        <h1>{{ esEdicion ? 'Editar Médico' : 'Registrar Nuevo Médico' }}</h1>
        <a routerLink="/medicos" mat-stroked-button>Volver</a>
      </div>

      <form [formGroup]="formulario" (ngSubmit)="guardar()" class="formulario-contenedor">

        <!-- Datos personales -->
        <div class="seccion-formulario">
          <div class="seccion-titulo">
            <mat-icon>person</mat-icon> Datos Personales
          </div>
          <div class="cuadricula-2">
            <mat-form-field appearance="outline">
              <mat-label>Nombres *</mat-label>
              <input matInput formControlName="nombres" placeholder="Ej: Carlos Alberto">
              <mat-error>Campo requerido</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Apellidos *</mat-label>
              <input matInput formControlName="apellidos" placeholder="Ej: Mendoza Torres">
              <mat-error>Campo requerido</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>DNI *</mat-label>
              <input matInput formControlName="cedula" placeholder="1712345678">
              <mat-error>Ingrese una cédula válida (mínimo 8 dígitos)</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Número de Registro Médico *</mat-label>
              <input matInput formControlName="registroMedico" placeholder="MSP-2020-001">
              <mat-error>Campo requerido</mat-error>
            </mat-form-field>
          </div>
        </div>

        <!-- Datos profesionales -->
        <div class="seccion-formulario">
          <div class="seccion-titulo">
            <mat-icon>school</mat-icon> Datos Profesionales
          </div>
          <div class="cuadricula-2">
            <mat-form-field appearance="outline">
              <mat-label>Especialidad *</mat-label>
              <mat-select formControlName="especialidad">
                <mat-option value="Medicina General">Medicina General</mat-option>
                <mat-option value="Cardiología">Cardiología</mat-option>
                <mat-option value="Neurología">Neurología</mat-option>
                <mat-option value="Ginecología">Ginecología</mat-option>
                <mat-option value="Pediatría">Pediatría</mat-option>
                <mat-option value="Traumatología">Traumatología</mat-option>
                <mat-option value="Dermatología">Dermatología</mat-option>
                <mat-option value="Oftalmología">Oftalmología</mat-option>
                <mat-option value="Psiquiatría">Psiquiatría</mat-option>
                <mat-option value="Urología">Urología</mat-option>
                <mat-option value="Endocrinología">Endocrinología</mat-option>
                <mat-option value="Gastroenterología">Gastroenterología</mat-option>
                <mat-option value="Oncología">Oncología</mat-option>
              </mat-select>
              <mat-error>Seleccione una especialidad</mat-error>
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
              <mat-label>Universidad de Graduación *</mat-label>
              <input matInput formControlName="universidad" placeholder="Universidad Central del Ecuador">
              <mat-error>Campo requerido</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Año de Graduación *</mat-label>
              <input matInput type="number" formControlName="anoGraduacion" placeholder="2015" min="1950" [max]="anioActual">
              <mat-error>Ingrese un año válido</mat-error>
            </mat-form-field>
          </div>
        </div>

        <!-- Datos de contacto -->
        <div class="seccion-formulario">
          <div class="seccion-titulo">
            <mat-icon>contact_phone</mat-icon> Datos de Contacto
          </div>
          <div class="cuadricula-2">
            <mat-form-field appearance="outline">
              <mat-label>Correo Electrónico *</mat-label>
              <input matInput formControlName="email" type="email" placeholder="medico@graeco.med">
              <mat-error>Ingrese un correo válido</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Teléfono Celular *</mat-label>
              <input matInput formControlName="telefono" placeholder="0991234567">
              <mat-error>Campo requerido</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Estado *</mat-label>
              <mat-select formControlName="estado">
                <mat-option value="activo">Activo</mat-option>
                <mat-option value="vacaciones">Vacaciones</mat-option>
                <mat-option value="licencia">Licencia</mat-option>
                <mat-option value="inactivo">Inactivo</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Fecha de Ingreso *</mat-label>
              <input matInput formControlName="fechaIngreso" type="date">
              <mat-error>Campo requerido</mat-error>
            </mat-form-field>
          </div>
        </div>

        <!-- Acciones -->
        <div class="acciones-formulario">
          <a routerLink="/medicos" mat-stroked-button>Cancelar</a>
          <button mat-raised-button class="boton-primario" type="submit" [disabled]="formulario.invalid">
            {{ esEdicion ? 'Actualizar Médico' : 'Registrar Médico' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class FormularioMedicoComponent implements OnInit {
  tituloPagina = 'Médicos';
  migajas = 'Inicio / Médicos / Formulario';

  private fb = inject(FormBuilder);
  private medicoServicio = inject(MedicoServicio);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  esEdicion = false;
  idEdicion: number | null = null;
  anioActual = new Date().getFullYear();

  formulario = this.fb.group({
    nombres: ['', [Validators.required, Validators.minLength(2)]],
    apellidos: ['', [Validators.required, Validators.minLength(2)]],
    cedula: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^\d+$/)]],
    registroMedico: ['', Validators.required],
    especialidad: ['', Validators.required],
    consultorio: ['', Validators.required],
    universidad: ['', Validators.required],
    anoGraduacion: [null as number | null, [Validators.required, Validators.min(1950)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required],
    estado: ['activo', Validators.required],
    fechaIngreso: [new Date().toISOString().split('T')[0], Validators.required],
  });


  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.idEdicion = Number(id);
      const medico = this.medicoServicio.obtenerPorId(this.idEdicion);
      if (medico) {
        this.formulario.patchValue(medico as any);
        this.tituloPagina = `Editar - Dr. ${medico.apellidos}`;
      }
    }
  }

  guardar() {
    if (this.formulario.invalid) return;
    const datos = this.formulario.value as any;

    if (this.esEdicion && this.idEdicion) {
      this.medicoServicio.actualizar(this.idEdicion, datos);
      this.snackBar.open('Médico actualizado correctamente', 'Cerrar', { duration: 3000 });
    } else {
      this.medicoServicio.agregar(datos);
      this.snackBar.open('Médico registrado correctamente', 'Cerrar', { duration: 3000 });
    }
    this.router.navigate(['/medicos']);
  }
}

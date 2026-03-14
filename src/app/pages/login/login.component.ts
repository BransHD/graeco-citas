import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthServicio } from '../../services/auth.servicio';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="login-contenedor">
      <div class="login-caja">
        <div class="login-encabezado">
          <h1>Graeco Citas</h1>
          <p>Sistema de Gestión de Citas Médicas</p>
        </div>

        <form (ngSubmit)="ingresar()" class="login-formulario">
          <mat-form-field appearance="outline" style="width:100%">
            <mat-label>Usuario</mat-label>
            <input matInput [(ngModel)]="usuario" name="usuario" placeholder="admin" autocomplete="username">
          </mat-form-field>

          <mat-form-field appearance="outline" style="width:100%">
            <mat-label>Contraseña</mat-label>
            <input matInput type="password" [(ngModel)]="contrasena" name="contrasena" placeholder="••••••" autocomplete="current-password">
          </mat-form-field>

          @if (errorMensaje) {
            <div class="error-login">{{ errorMensaje }}</div>
          }

          <button mat-raised-button type="submit" class="btn-ingresar" [disabled]="!usuario || !contrasena">
            Ingresar
          </button>
        </form>

        <div class="login-pie">
          <small>Usuario: <strong>admin</strong> &nbsp;|&nbsp; Contraseña: <strong>admin</strong></small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-contenedor {
      min-height: 100vh;
      background: #f0f4f8;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .login-caja {
      background: white;
      border-radius: 12px;
      padding: 40px 36px;
      width: 100%;
      max-width: 380px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .login-encabezado {
      text-align: center;
      margin-bottom: 28px;
    }

    .login-encabezado h1 {
      font-size: 26px;
      font-weight: 700;
      color: #1565c0;
      margin: 0 0 6px;
    }

    .login-encabezado p {
      font-size: 13px;
      color: #78909c;
      margin: 0;
    }

    .login-formulario {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .error-login {
      background: #ffebee;
      color: #c62828;
      border-radius: 6px;
      padding: 10px 14px;
      font-size: 13px;
      text-align: center;
    }

    .btn-ingresar {
      width: 100%;
      height: 44px;
      background: #1565c0 !important;
      color: white !important;
      font-size: 15px;
      font-weight: 600;
      margin-top: 8px;
    }

    .btn-ingresar:disabled {
      background: #b0bec5 !important;
    }

    .login-pie {
      text-align: center;
      margin-top: 20px;
      color: #90a4ae;
      font-size: 12px;
    }
  `]
})
export class LoginComponent {
  private authServicio = inject(AuthServicio);
  private router = inject(Router);

  usuario = '';
  contrasena = '';
  errorMensaje = '';

  ingresar() {
    const ok = this.authServicio.login(this.usuario, this.contrasena);
    if (ok) {
      this.router.navigate(['/tablero']);
    } else {
      this.errorMensaje = 'Usuario o contraseña incorrectos';
    }
  }
}

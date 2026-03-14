import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, MatButtonModule],
  template: `
    <div class="pagina-404">
      <div class="contenido-404">
        <h1 class="numero-404">404</h1>
        <h2>Página no encontrada</h2>
        <p>La ruta que intentas acceder no existe.</p>
        <a routerLink="/tablero" mat-raised-button class="boton-primario">
          Volver al Inicio
        </a>
      </div>
    </div>
  `,
  styles: [`
    .pagina-404 {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f0f4f8;
    }

    .contenido-404 {
      text-align: center;
      background: white;
      padding: 60px 48px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .numero-404 {
      font-size: 96px;
      font-weight: 700;
      color: #1565c0;
      margin: 0 0 8px;
      line-height: 1;
    }

    h2 {
      font-size: 22px;
      font-weight: 600;
      color: #1a1a2e;
      margin: 0 0 10px;
    }

    p {
      font-size: 14px;
      color: #78909c;
      margin: 0 0 28px;
    }
  `]
})
export class NotFoundComponent {}

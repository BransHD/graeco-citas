import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BarraLateralComponent } from '../sidebar/barra-lateral.component';
import { EncabezadoComponent } from '../header/encabezado.component';
import { PiePaginaComponent } from '../footer/pie-pagina.component';

@Component({
  selector: 'app-diseno',
  standalone: true,
  imports: [RouterOutlet, BarraLateralComponent, EncabezadoComponent, PiePaginaComponent],
  template: `
    <div class="contenedor-app" [class.colapsado]="barraColapsada()">
      <app-barra-lateral
        [colapsada]="barraColapsada()"
        (alternarColapso)="alternarBarra()"
      />
      <div class="area-contenido">
        <div class="zona-encabezado">
          <app-encabezado
            [titulo]="tituloActual()"
            [migajas]="migajasActuales()"
            (toggleMenu)="alternarBarra()"
          />
        </div>
        <main class="contenido-principal">
          <router-outlet (activate)="alActivar($event)" />
        </main>
        <div class="zona-footer">
          <app-pie-pagina />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contenedor-app {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    .area-contenido {
      flex: 1;
      margin-left: 240px;
      transition: margin-left 0.3s ease;
      min-width: 0;
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    .contenedor-app.colapsado .area-contenido {
      margin-left: 64px;
    }

    .zona-encabezado {
      height: 10vh;
      min-height: 52px;
      flex-shrink: 0;
    }

    .contenido-principal {
      flex: 1;
      overflow-y: auto;
      background: #f0f4f8;
    }

    .zona-footer {
      height: 5vh;
      min-height: 36px;
      flex-shrink: 0;
    }

    @media (max-width: 768px) {
      .area-contenido { margin-left: 64px; }
    }
  `]
})
export class DisenoComponent {
  barraColapsada = signal(false);
  tituloActual = signal('Tablero');
  migajasActuales = signal('Inicio / Tablero');

  alternarBarra() {
    this.barraColapsada.update(v => !v);
  }

  alActivar(componente: any) {
    if (componente?.tituloPagina) {
      this.tituloActual.set(componente.tituloPagina);
    }
    if (componente?.migajas) {
      this.migajasActuales.set(componente.migajas);
    }
  }
}

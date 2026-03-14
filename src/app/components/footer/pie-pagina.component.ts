import { Component } from '@angular/core';

@Component({
  selector: 'app-pie-pagina',
  standalone: true,
  template: `
    <footer class="pie-pagina">
      <div class="container-fluid">
        <div class="row align-items-center py-3">
          <div class="col-md-6 text-center text-md-start mb-2 mb-md-0">
            <span class="texto-copyright">
              &copy; {{ anioActual }} <strong>Graeco Citas</strong>. Todos los derechos reservados.
            </span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .pie-pagina {
      background: #E8EDF4;
      border-top: 1px solid #DDE3EC;
      height: 100%;
      display: flex;
      align-items: center;
    }

    .texto-copyright {
      font-size: 12px;
      color: #64748B;
    }

    .texto-copyright strong {
      color: #1E293B;
    }

    .texto-tecnologia {
      font-size: 12px;
      color: #64748B;
    }

    .texto-tecnologia strong {
      color: #01B3BF;
    }
  `]
})
export class PiePaginaComponent {
  anioActual = new Date().getFullYear();
}

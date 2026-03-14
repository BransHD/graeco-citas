import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthServicio {
  private _autenticado = signal<boolean>(false);
  estaAutenticado = this._autenticado.asReadonly();

  private _usuario = signal<string>('');
  usuario = this._usuario.asReadonly();

  constructor(private router: Router) {}

  login(usuario: string, contrasena: string): boolean {
    if (usuario === 'admin' && contrasena === 'admin') {
      this._autenticado.set(true);
      this._usuario.set(usuario);
      return true;
    }
    return false;
  }

  logout(): void {
    this._autenticado.set(false);
    this._usuario.set('');
    this.router.navigate(['/login']);
  }
}

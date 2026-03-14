import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServicio } from '../services/auth.servicio';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthServicio);
  const router = inject(Router);

  if (auth.estaAutenticado()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};

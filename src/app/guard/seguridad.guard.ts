import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject } from '@angular/core';
export const seguridadGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar); 

  const tokenValido = loginService.verificar();
  const rutaActual = state.url;
  const rolUsuario = loginService.showRole();

  // 🔐 No tiene token
  if (!tokenValido) {
    if (rutaActual === '/usuarios/insertar') {
      return true;
    } else {
      snackBar.open('⚠️ Token inválido. Redirigiendo al login.', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-warning']
      });
      router.navigate(['login']);
      return false;
    }
  }

  // ❌ Tiene token, pero no es ADMINISTRADOR y va a /usuarios/...
  if (rolUsuario !== 'ADMINISTRADOR' && rutaActual.startsWith('/usuarios')) {
    snackBar.open('🚫 Acceso denegado.', 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
    router.navigate(['/acceso-denegado']);
    return false;
  }

  // ✔️ Rol válido, pero validamos permisos específicos si se definieron
  const rolesPermitidos: string[] = route.data['rolesPermitidos'] || [];
  if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(rolUsuario || '')) {
    snackBar.open('🚫 No tienes permiso para acceder.', 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
    router.navigate(['/acceso-denegado']);
    return false;
  }

  return true;
};
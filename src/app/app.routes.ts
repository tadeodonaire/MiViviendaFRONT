import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { seguridadGuard } from './guard/seguridad.guard';
import { AjustesComponent } from './components/inicio/ajustes/ajustes.component';
import { RolesComponent } from './components/roles/roles.component';
import { CrearrolesComponent } from './components/roles/crearroles/crearroles.component';
import { ListarusuariosComponent } from './components/usuarios/listarusuarios/listarusuarios.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'inicio',
    component: InicioComponent,
    canActivate: [seguridadGuard],
    data: { roles: ['Consultor'] },
  },
  {
    path: 'ajustes',
    component: AjustesComponent,
    canActivate: [seguridadGuard],
    data: { roles: ['Consultor'] },
  },
  {
    path: 'roles',
    component: RolesComponent,
    canActivate: [seguridadGuard],
    data: { roles: ['Consultor'] },
  },
  {
     path: 'roles/nuevo',
     component: CrearrolesComponent,
     canActivate: [seguridadGuard],
     data: { roles: ['Consultor'] },
  },
  {
    path: 'usuarios',
    component: ListarusuariosComponent,
    canActivate: [seguridadGuard],
    data: { roles: ['Consultor'] },
  },
];

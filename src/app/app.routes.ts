import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { seguridadGuard } from './guard/seguridad.guard';
import { AjustesComponent } from './components/inicio/ajustes/ajustes.component';
import { RolesComponent } from './components/roles/roles.component';
import { CrearrolesComponent } from './components/roles/crearroles/crearroles.component';
import { ListarusuariosComponent } from './components/usuarios/listarusuarios/listarusuarios.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { CrearusuariosComponent } from './components/usuarios/crearusuarios/crearusuarios.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { CrearclientesComponent } from './components/clientes/crearclientes/crearclientes.component';

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
    component: UsuariosComponent,
    canActivate: [seguridadGuard],
    data: { roles: ['Consultor'] },
  },
  {
    path: 'usuarios/nuevo',
    component: CrearusuariosComponent,
    canActivate: [seguridadGuard],
    data: { roles: ['Consultor'] },
  },
   {
   path: 'clientes',
   component: ClientesComponent,
   canActivate: [seguridadGuard],
   data: { roles: ['Consultor'] },
 },
 {
   path: 'clientes/nuevo',
   component: CrearclientesComponent,
   canActivate: [seguridadGuard],
   data: { roles: ['Consultor'] },
 },
];

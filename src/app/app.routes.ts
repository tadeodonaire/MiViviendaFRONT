import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { seguridadGuard } from './guard/seguridad.guard';
import { AjustesComponent } from './components/inicio/ajustes/ajustes.component';
import { RolesComponent } from './components/roles/roles.component';
import { CrearrolesComponent } from './components/roles/crearroles/crearroles.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { CrearusuariosComponent } from './components/usuarios/crearusuarios/crearusuarios.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { CrearclientesComponent } from './components/clientes/crearclientes/crearclientes.component';
import { CreareditarentidadesfinancierasComponent } from './components/entidades-financieras/creareditarentidadesfinancieras/creareditarentidadesfinancieras.component';
import { EntidadesFinancierasComponent } from './components/entidades-financieras/entidades-financieras.component';
import { B, S } from '@angular/cdk/keycodes';
import { BonosReglasComponent } from './components/bonos-reglas/bonos-reglas.component';
import { CreareditarbonosreglasComponent } from './components/bonos-reglas/creareditarbonosreglas/creareditarbonosreglas.component';
import { PropiedadesComponent } from './components/propiedades/propiedades.component';
import { CrearpropiedadesComponent } from './components/propiedades/crearpropiedades/crearpropiedades.component';
import { SimulacionesComponent } from './components/simulaciones/simulaciones.component';
import { CreareditarsimulacionesComponent } from './components/simulaciones/creareditarsimulaciones/creareditarsimulaciones.component';

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
  {
    path: 'entidadfinanciera',
    component: EntidadesFinancierasComponent,
    canActivate: [seguridadGuard],
    data: { roles: ['Consultor'] },
  },
  {
    path: 'entidadfinanciera/nuevo',
    component: CreareditarentidadesfinancierasComponent,
    canActivate: [seguridadGuard],
    data: { roles: ['Consultor'] },
  },
  {
    path: 'bonosreglas',
    component: BonosReglasComponent,
    canActivate: [seguridadGuard],
    data: { roles: ['Consultor'] },
  },
  {
    path: 'bonosreglas/nuevo',
    component: CreareditarbonosreglasComponent,
    canActivate: [seguridadGuard],
    data: { roles: ['Consultor'] },
  },
  {
    path: 'propiedades',
    component: PropiedadesComponent,
    canActivate: [seguridadGuard],
    data: { roles: ['Consultor'] },
  },
  {
    path: 'propiedades/nuevo',
    component: CrearpropiedadesComponent,
    canActivate: [seguridadGuard],
    data: { roles: ['Consultor'] },
  },
  {
    path: 'simulaciones',
    component: SimulacionesComponent,
    canActivate: [seguridadGuard],
    data: { roles: ['Consultor'] },
  },
  {
    path: 'simulaciones/nuevo',
    component: CreareditarsimulacionesComponent,
    canActivate: [seguridadGuard],
    data: { roles: ['Consultor'] },
  },
];

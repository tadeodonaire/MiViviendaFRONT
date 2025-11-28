import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { seguridadGuard } from './guard/seguridad.guard';
import { AjustesComponent } from './components/inicio/ajustes/ajustes.component';
import { RolesComponent } from './components/roles/roles.component';
import { CrearrolesComponent } from './components/roles/crearroles/crearroles.component';
import { CreareditarentidadesfinancierasComponent } from './components/entidades-financieras/creareditarentidadesfinancieras/creareditarentidadesfinancieras.component';
import { EntidadesFinancierasComponent } from './components/entidades-financieras/entidades-financieras.component';

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
];

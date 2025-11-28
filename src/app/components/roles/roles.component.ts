import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarrolesComponent } from './listarroles/listarroles.component';

@Component({
  selector: 'app-roles',
  imports: [RouterOutlet, ListarrolesComponent],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent {
constructor(public route: ActivatedRoute) {}
}

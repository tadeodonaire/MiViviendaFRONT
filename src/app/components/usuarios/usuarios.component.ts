import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from "../../../../node_modules/@angular/router/router_module.d-Bx9ArA6K";
import { ListarusuariosComponent } from "./listarusuarios/listarusuarios.component";

@Component({
  selector: 'app-usuarios',
  imports: [RouterOutlet, ListarusuariosComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  constructor(public route: ActivatedRoute) {}
}

import { Component } from '@angular/core';
import { ListarusuariosComponent } from "./listarusuarios/listarusuarios.component";
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  imports: [RouterOutlet, ListarusuariosComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  constructor(public route: ActivatedRoute) {}

  
}

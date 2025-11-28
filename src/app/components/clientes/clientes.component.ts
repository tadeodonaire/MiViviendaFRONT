import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from "@angular/router";
import { ListarclientesComponent } from "./listarclientes/listarclientes.component";

@Component({
  selector: 'app-clientes',
  imports: [RouterModule, ListarclientesComponent],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {
   constructor(public route: ActivatedRoute) {}
}

import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from "@angular/router";
import { ListarpropiedadesComponent } from "./listarpropiedades/listarpropiedades.component";

@Component({
  selector: 'app-propiedades',
  imports: [RouterModule, ListarpropiedadesComponent],
  templateUrl: './propiedades.component.html',
  styleUrl: './propiedades.component.css'
})
export class PropiedadesComponent {
  constructor(public route: ActivatedRoute) {}
}

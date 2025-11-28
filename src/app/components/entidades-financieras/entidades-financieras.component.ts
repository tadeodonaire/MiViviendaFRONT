import { Component } from '@angular/core';
import { ListarentidadesfinancierasComponent } from "./listarentidadesfinancieras/listarentidadesfinancieras.component";
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-entidades-financieras',
  imports: [RouterOutlet, ListarentidadesfinancierasComponent],
  templateUrl: './entidades-financieras.component.html',
  styleUrl: './entidades-financieras.component.css'
})
export class EntidadesFinancierasComponent {
constructor(public route: ActivatedRoute) {}
}

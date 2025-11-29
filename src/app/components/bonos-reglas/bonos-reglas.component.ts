import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ListarclientesComponent } from '../clientes/listarclientes/listarclientes.component';
import { ListarBonosReglasComponent } from './listarbonosreglas/listarbonosreglas.component';

@Component({
  selector: 'app-bonos-reglas',
  imports: [RouterModule, ListarBonosReglasComponent],
  templateUrl: './bonos-reglas.component.html',
  styleUrl: './bonos-reglas.component.css'
})
export class BonosReglasComponent {
   constructor(public route: ActivatedRoute) {}
}

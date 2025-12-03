import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [RouterOutlet],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  constructor(private router: Router) { }

  crearSimulacion() {
    this.router.navigate(['simulaciones/nuevo']);
  }

  verSimulaciones() {
    this.router.navigate(['simulaciones']);
  }

  verAjsutes() {
    this.router.navigate(['ajustes']);
  }

  
}

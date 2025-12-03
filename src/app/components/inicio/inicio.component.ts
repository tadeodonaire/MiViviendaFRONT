import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [RouterOutlet],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent {
  constructor(private router: Router) {}

  verAjustes() {
    this.router.navigate(['ajustes']);
  }

  verSimulaciones() {
    this.router.navigate(['versimulaciones']);
  }

  cerrarSesion() {
    localStorage.clear();
    sessionStorage.clear();

    this.router.navigate(['login']);
  }
}

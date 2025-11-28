import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-ajustes',
  imports: [RouterOutlet],
  templateUrl: './ajustes.component.html',
  styleUrl: './ajustes.component.css',
})
export class AjustesComponent {
  constructor(private router: Router) {}

  verRoles() {
    this.router.navigate(['roles']);
  }

  verUsuarios() {
    this.router.navigate(['usuarios']);
  }

  verClientes() {
  this.router.navigate(['clientes']);
}

  Regresar() {
    this.router.navigate(['inicio']);
  }
}

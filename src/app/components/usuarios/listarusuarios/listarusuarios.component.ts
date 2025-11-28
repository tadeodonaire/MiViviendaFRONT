import { Component } from '@angular/core';
import { Usuarios } from '../../../models/usuarios';
import { UsuariosService } from '../../../services/usuarios.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listarusuarios',
  imports: [CommonModule],
  templateUrl: './listarusuarios.component.html',
  styleUrl: './listarusuarios.component.css',
})
export class ListarusuariosComponent {
  usuarios: Usuarios[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private usuariosService: UsuariosService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsuarios();
  }

  private fetchUsuarios(): void {
    this.isLoading = true;
    this.usuariosService.list().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los usuarios.';
        this.isLoading = false;
      },
    });
  }

  // Placeholder para cuando implementes el crear
  onAgregar(): void {
    this.router.navigate(['/usuarios/nuevo']);
  }

  onBack(): void {
    this.router.navigate(['ajustes']);
  }
}

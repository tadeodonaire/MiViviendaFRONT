import { Component } from '@angular/core';
import { Clientes } from '../../../models/clientes';
import { ClientesService } from '../../../services/clientes.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listarclientes',
  imports: [CommonModule],
  templateUrl: './listarclientes.component.html',
  styleUrl: './listarclientes.component.css',
})
export class ListarclientesComponent {
  clientes: Clientes[] = [];
  isLoading = false;
  error: string | null = null;
  constructor(
    private clientesService: ClientesService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.fetchClientes();
  }
  private fetchClientes(): void {
    this.isLoading = true;
    this.clientesService.list().subscribe({
      next: (data) => {
        this.clientes = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los clientes.';
        this.isLoading = false;
      },
    });
  }
  // Placeholder para cuando implementes el crear
  onAgregar(): void {
    this.router.navigate(['/clientes/nuevo']);
  }
  onBack(): void {
    this.router.navigate(['ajustes']);
  }
}

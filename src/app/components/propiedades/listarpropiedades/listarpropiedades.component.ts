import { Component } from '@angular/core';
import { PropiedadesService } from '../../../services/propiedades.service';
import { Propiedades } from '../../../models/propiedades';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listarpropiedades',
  imports: [CommonModule],
  templateUrl: './listarpropiedades.component.html',
  styleUrl: './listarpropiedades.component.css',
})
export class ListarpropiedadesComponent {
  propiedades: Propiedades[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private propiedadesService: PropiedadesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchPropiedades();
  }

  private fetchPropiedades(): void {
    this.isLoading = true;
    this.propiedadesService.list().subscribe({
      next: (data) => {
        this.propiedades = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar las propiedades.';
        this.isLoading = false;
      },
    });
  }

  // Placeholder para cuando implementes el crear
  onAgregar(): void {
    this.router.navigate(['/propiedades/nuevo']);
  }

  onBack(): void {
    this.router.navigate(['ajustes']);
  }
}

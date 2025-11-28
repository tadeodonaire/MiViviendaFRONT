import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EntidadesFinancieras } from '../../../models/entidades-financieras';
import { EntidadesFinancierasService } from '../../../services/entidades-financieras.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listarentidadesfinancieras',
  imports: [CommonModule],
  templateUrl: './listarentidadesfinancieras.component.html',
  styleUrl: './listarentidadesfinancieras.component.css'
})
export class ListarentidadesfinancierasComponent {
  entidades: EntidadesFinancieras[] = [];
  isLoading = false;
  error: string | null = null;

  private money = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 });
  private pct = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 2 });

  constructor(
    private service: EntidadesFinancierasService,
    private router: Router
  ) { }

  ngOnInit(): void { this.fetch(); }

  private fetch(): void {
    this.isLoading = true;
    this.service.list().subscribe({
      next: (data) => { this.entidades = data; this.isLoading = false; },
      error: () => { this.error = 'No se pudieron cargar las entidades.'; this.isLoading = false; }
    });
  }

  // Navegación (ajusta rutas si usas otras)
  onBack(): void { this.router.navigate(['entidadfinanciera']); }
  onAgregar(): void { this.router.navigate(['entidadfinanciera/nuevo']); }

  // Helpers para llaves en minúsculas del backend (teamin/teamax)
  getTeaMin(e: any): number | undefined { return e.TEAmin ?? e.teamin; }
  getTeaMax(e: any): number | undefined { return e.TEAmax ?? e.teamax; }

  // Formateadores
  formatTea(v?: number): string {
    if (v === null || v === undefined || isNaN(+v)) return '%';
    // si viene como fracción (0.081), pásalo a %
    const val = v > 0 && v < 1 ? v * 100 : v;
    return `${this.pct.format(val)}%`;
  }

  formatMoney(v?: number): string {
    if (v === null || v === undefined || isNaN(+v)) return '—';
    return this.money.format(v);
  }

  formatPlazo(min?: number, max?: number): string {
    if (!min && !max) return '—';
    if (min && max) return `${min} – ${max} años`;
    return `${min ?? max} años`;
  }

  // Mostrar el valor tal cual viene en BD, con 3 decimales
  formatSeguro(val?: number | null): string {
    if (val === null || val === undefined) return '—';
    return `${val.toFixed(3)}%`;   // 0.075 -> "0.075%", 0.24 -> "0.240%"
  }

}
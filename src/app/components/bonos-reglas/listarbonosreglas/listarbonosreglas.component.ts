import { Component, OnInit } from '@angular/core';
import { BonosReglas } from '../../../models/bonos-reglas';
import { BonosReglasService } from '../../../services/bonos-reglas.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listarbonosreglas',
  imports: [CommonModule],
  templateUrl: './listarbonosreglas.component.html',
  styleUrl: './listarbonosreglas.component.css'
})
export class ListarBonosReglasComponent implements OnInit {
  reglas: BonosReglas[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private service: BonosReglasService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.isLoading = true;
    this.service.list().subscribe({
      next: (data) => { this.reglas = data; this.isLoading = false; },
      error: () => { this.error = 'No se pudieron cargar las reglas.'; this.isLoading = false; }
    });
  }

  // Navegación
  onBack(): void { this.router.navigate(['/ajustes']); }           // ajusta si tu ruta es otra
  onAgregar(): void { this.router.navigate(['/bonosreglas/nuevo']); } // opcional

  // Helpers de formato
  formatMoney(v?: number | null): string {
    if (v == null) return '—';
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 }).format(v);
  }
  formatRange(min?: number | null, max?: number | null): string {
    if (min == null && max == null) return '—';
    if (min != null && max != null) return `${this.formatMoney(min)} – ${this.formatMoney(max)}`;
    if (min != null) return `≥ ${this.formatMoney(min)}`;
    return `≤ ${this.formatMoney(max!)}`;
  }
  formatIngresoMax(v?: number | null): string {
    if (v == null || v === 0) return '—';
    return this.formatMoney(v);
  }
}
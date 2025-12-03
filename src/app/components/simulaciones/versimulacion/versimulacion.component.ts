import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { SimulacionConCronogramaResponse, SimulacionCronogramaDTO } from '../../../models/simulacion-respuesta';
import { ActivatedRoute, Router } from '@angular/router';
import { SimulacionesService } from '../../../services/simulaciones.service';

@Component({
  selector: 'app-versimulacion',
  imports: [CommonModule],
  templateUrl: './versimulacion.component.html',
  styleUrl: './versimulacion.component.css'
})
export class VerSimulacionComponent implements OnInit {
  loading = signal(true);
  error = signal<string | null>(null);
  data = signal<SimulacionConCronogramaResponse | null>(null);

  // totales
  tInteres = computed(() => this.sum('interes'));
  tAmort = computed(() => this.sum('amortizacion'));
  tSegDesg = computed(() => this.sum('seguroDesgravamen'));
  tSegInm = computed(() => this.sum('seguroInmueble'));
  tCuotaBase = computed(() => this.sum('cuota'));
  tCuotaTot = computed(() => this.sum('cuotaTotal'));
  tFlujo = computed(() => this.sum('flujo'));

  trackByPeriodo = (_: number, r: SimulacionCronogramaDTO) => r.periodo;

  constructor(
    private route: ActivatedRoute,
    private simSrv: SimulacionesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const state = history.state?.hoja as SimulacionConCronogramaResponse | undefined;
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // 1) si vengo del formulario con state -> úsalo
    if (state && state.simulacion?.simulacion_id) {
      this.data.set(state);
      this.loading.set(false);
      return;
    }

    // 2) si entro directo por URL -> pide al backend
    if (!Number.isFinite(id)) {
      this.error.set('ID de simulación inválido');
      this.loading.set(false);
      return;
    }

    this.simSrv.getHoja(id).subscribe({
      next: (resp) => { this.data.set(resp); this.loading.set(false); },
      error: () => { this.error.set('No se pudo cargar la hoja.'); this.loading.set(false); }
    });
  }

  private sum(field: keyof SimulacionCronogramaDTO): number {
    const rows = this.data()?.cronograma ?? [];
    return +rows.reduce((acc, r) => acc + (Number(r[field] ?? 0)), 0).toFixed(2);
  }

  imprimir() { window.print(); }

  exportCSV() {
    const hoja = this.data();
    if (!hoja) return;
    const rows = hoja.cronograma;
    const headers = ['Per', 'Saldo inicial', 'Interés', 'Amortización', 'Cuota', 'Seg. desgrav.', 'Seg. inmueble', 'Cuota total', 'Saldo final'];
    const lines = [
      headers.join(','),
      ...rows.map(r => [
        r.periodo, r.saldoInicial, r.interes, r.amortizacion,
        r.cuota, r.seguroDesgravamen, r.seguroInmueble, r.cuotaTotal, r.saldoFinal
      ].join(','))
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `hoja-simulacion-${hoja.simulacion.simulacion_id}.csv`;
    a.click(); URL.revokeObjectURL(url);
  }

  volver() { this.router.navigate(['/inicio']); }
}
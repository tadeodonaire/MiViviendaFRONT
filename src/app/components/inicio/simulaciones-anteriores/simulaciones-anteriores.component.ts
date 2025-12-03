import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClientesService } from '../../../services/clientes.service';
import { VerSimulacionesDTO } from '../../../models/ver-simulacionesDTO';

interface SimJson {
  simulacion_id: number;
  precio_venta?: number;
  precio_inmueble?: number;
  nombre_inmueble?: string;
}

interface UICliente {
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  ingresosMensuales: number;
  moneda: string;
  sims: SimJson[];
  expanded?: boolean;
}

@Component({
  selector: 'app-simulaciones-anteriores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './simulaciones-anteriores.component.html',
  styleUrls: ['./simulaciones-anteriores.component.css']
})
export class SimulacionesAnterioresComponent implements OnInit {
  private clientesSrv = inject(ClientesService);
  private router = inject(Router);

  loading = false;
  items: UICliente[] = [];

  ngOnInit(): void {
    this.cargar();
  }

  private parseSims(raw: string | any): SimJson[] {
    if (!raw) return [];
    try {
      const arr = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  cargar(): void {
    this.loading = true;
    this.clientesSrv.ver().subscribe({
      next: (rows: VerSimulacionesDTO[]) => {
        const mapped: UICliente[] = rows.map(r => ({
          id: r.id,
          nombre: r.nombre,
          apellido: r.apellido,
          dni: r.dni,
          ingresosMensuales: r.ingresosMensuales,
          moneda: r.moneda,
          sims: this.parseSims(r.simulaciones),
          expanded: false
        })).filter(c => c.sims.length > 0);

        this.items = mapped;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  toggle(item: UICliente) {
    item.expanded = !item.expanded;
  }

  verSimulacion(sim: SimJson) {
    // Redirige a la página de detalle o simulador
    this.router.navigate(['/versimulaciones', sim.simulacion_id]);
  }

  volverMenu() {
    this.router.navigate(['/inicio']); // Ajusta al nombre real de tu ruta de menú
  }

  monedaSimbolo(moneda?: string): string {
    return moneda === 'USD' ? '$' : 'S/';
  }

  nombreDeSimulacion(sim: SimJson): string {
    return sim?.nombre_inmueble?.trim()
      ? sim.nombre_inmueble
      : `Simulación ${sim.simulacion_id}`;
  }

  get isEmpty(): boolean {
    return !this.loading && this.items.length === 0;
  }
}
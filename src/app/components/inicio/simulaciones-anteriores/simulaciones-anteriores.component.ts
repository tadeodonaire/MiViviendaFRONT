import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // importa RouterModule para routerLink si lo usas
import { ClientesService } from '../../../services/clientes.service';
import { VerSimulacionesDTO } from '../../../models/ver-simulacionesDTO';
import { SimulacionesService } from '../../../services/simulaciones.service';
import { HttpClient } from '@angular/common/http';
import {
  SimulacionConCronogramaResponse,
  SimulacionCronogramaDTO,
} from '../../../models/simulacion-respuesta';
import { Simulaciones } from '../../../models/simulaciones';
import { environment } from '../../../../environments/environments';

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
  imports: [CommonModule, RouterModule],
  templateUrl: './simulaciones-anteriores.component.html',
  styleUrls: ['./simulaciones-anteriores.component.css'],
})
export class SimulacionesAnterioresComponent implements OnInit {
  private clientesSrv = inject(ClientesService);
  private simsSrv = inject(SimulacionesService);
  private http = inject(HttpClient);
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
        const mapped: UICliente[] = rows
          .map((r) => ({
            id: r.id,
            nombre: r.nombre,
            apellido: r.apellido,
            dni: r.dni,
            ingresosMensuales: r.ingresosMensuales,
            moneda: r.moneda,
            sims: this.parseSims(r.simulaciones),
            expanded: false,
          }))
          .filter((c) => c.sims.length > 0);

        this.items = mapped;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  toggle(item: UICliente) {
    item.expanded = !item.expanded;
  }

  // === AL PULSAR "Ver simulación" ===

  verSimulacion(sim: SimJson) {
    this.router.navigate(['/simulaciones', Number(sim.simulacion_id)]);
  }

  volverMenu() {
    this.router.navigate(['/inicio']);
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

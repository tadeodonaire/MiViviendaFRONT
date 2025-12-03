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
    const id = Number(sim?.simulacion_id);
    if (!Number.isFinite(id)) return;

    // 1) Pide la HOJA aquí
    this.simsSrv.getHoja(id).subscribe({
      next: (hoja: SimulacionConCronogramaResponse) => {
        // 2) Navega pasando la hoja por state
        this.router.navigate(['/simulaciones', id], { state: { hoja } });
      },
      error: () => {
        // 3) Fallback: navega sin state (el detalle intentará por URL)
        this.router.navigate(['/simulaciones', id]);
      },
    });
  }

  // ===== Fallback: trae la simulación simple y reconstruye la hoja en el front =====
  private fallbackBuildAndNavigate(id: number) {
    const base = environment.base; // ej. 'http://localhost:8089'
    this.http.get<Simulaciones>(`${base}/simulaciones/${id}`).subscribe({
      next: (sim) => {
        const hoja = this.buildHojaFromSim(sim);
        this.router.navigate(['/simulaciones', id], { state: { hoja } });
      },
      error: () => {
        // último recurso: navegar sin state (el componente de detalle intentará por URL)
        this.router.navigate(['/simulaciones', id]);
      },
    });
  }

  // ========= RECONSTRUCCIÓN EN EL FRONT (igual que la lógica de cálculo) =========
  private buildHojaFromSim(sim: Simulaciones): SimulacionConCronogramaResponse {
    const precioVenta =
      sim.precioVenta || sim.propiedades_inmueble_id?.precioInmueble || 0;
    const cuotaInicial = sim.cuotaInicial || 0;

    const bonoMonto = sim.bonoAplica
      ? sim.bonoTipo?.toUpperCase() === 'PORCENTAJE'
        ? +(precioVenta * (sim.bonoMonto || 0)).toFixed(2) // si se guarda 0.xx
        : +(sim.bonoMonto || 0).toFixed(2)
      : 0;

    let P = +(precioVenta - cuotaInicial - bonoMonto).toFixed(2);
    if (P < 0) P = 0;

    const m = sim.frecuenciaPago || 12;
    const anios = sim.tiempoAnios || 20;
    const n = Math.max(1, m * anios);

    const tea = sim.valorTasa > 1 ? sim.valorTasa / 100 : sim.valorTasa || 0; // fracción 0.xx
    const i = Math.pow(1 + tea, 1 / m) - 1;

    const cuota =
      P === 0 || i === 0
        ? 0
        : +((P * (i * Math.pow(1 + i, n))) / (Math.pow(1 + i, n) - 1)).toFixed(
            2
          );

    // seguros (entidad guarda %: desgravamen mensual, inmueble anual)
    const segDesgPeriodoFrac = ((sim.seguroDesgravamen || 0) / 100) * (12 / m);
    const segBienPeriodoFrac = (sim.seguroInmueble || 0) / 100 / m;

    const baseAsegurada = +(precioVenta * 1.0).toFixed(2); // ajusta si tienes cobertura tope

    const filas: SimulacionCronogramaDTO[] = [];
    let saldo = P;
    const g = sim.cantidadGracia || 0;
    const tipoGracia = (sim.tipoGracia || 'SIN_GRACIA').toUpperCase();

    for (let t = 1; t <= n; t++) {
      const saldoIni = +saldo.toFixed(2);
      const interes = +(saldoIni * i).toFixed(2);

      let cuotaPeriodo = 0,
        amort = 0,
        saldoFin = saldoIni;

      if (tipoGracia === 'TOTAL' && t <= g) {
        cuotaPeriodo = 0;
        amort = 0;
        saldoFin = +(saldoIni + interes).toFixed(2);
      } else if (tipoGracia === 'PARCIAL' && t <= g) {
        cuotaPeriodo = interes;
        amort = 0;
        saldoFin = saldoIni;
      } else {
        cuotaPeriodo = cuota;
        amort = +(cuotaPeriodo - interes).toFixed(2);
        if (t === n) {
          amort = saldoIni;
          cuotaPeriodo = +(interes + amort).toFixed(2);
        }
        saldoFin = +(saldoIni - amort).toFixed(2);
      }

      const segDesg = +(saldoIni * segDesgPeriodoFrac).toFixed(2);
      const segInm = +(baseAsegurada * segBienPeriodoFrac).toFixed(2);
      const cuotaTotal = +(cuotaPeriodo + segDesg + segInm).toFixed(2);

      filas.push({
        periodo: t,
        saldoInicial: saldoIni,
        interes,
        amortizacion: amort,
        cuota: cuotaPeriodo,
        seguroDesgravamen: segDesg,
        seguroInmueble: segInm,
        cuotaTotal,
        saldoFinal: saldoFin,
      } as any);

      saldo = saldoFin;
    }

    return {
      simulacion: {
        simulacion_id: (sim as any).simulacion_id,
        precioVenta,
        cuotaInicial,
        montoPrestamo: P,
        moneda: sim.moneda || 'PEN',
        tiempoAnios: anios,
        frecuenciaPago: m,
        tipoAnio: sim.tipoAnio || 360,
        tipoGracia: sim.tipoGracia || 'SIN_GRACIA',
        cantidadGracia: g,
        seguroDesgravamen: sim.seguroDesgravamen || 0,
        seguroInmueble: sim.seguroInmueble || 0,
        propiedades_inmueble_id: sim.propiedades_inmueble_id,
        entidades_financieras_entidadFinanciera_id:
          sim.entidades_financieras_entidadFinanciera_id,
        tipoTasa: 'TEA',
        valorTasa: tea,
        cuotaFija: cuota,
        bonoAplica: !!sim.bonoAplica,
        bonoTipo: sim.bonoTipo || '',
        bonoMonto: bonoMonto,
        bono_Reglas_reglas_id: sim.bono_Reglas_reglas_id,
        costos: sim.costos || [],
      } as any,
      cronograma: filas,
    };
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

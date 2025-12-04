export type Moneda = 'PEN' | 'USD';
export type TipoGracia = 'SIN_GRACIA' | 'TOTAL' | 'PARCIAL';

export type CostoTipo = 'INICIAL' | 'RECURRENTE';
export type CostoPeriodicidad = 'POR_CUOTA' | 'MENSUAL' | 'ANUAL';

export interface CostoAdicionalReq {
  nombreCosto: string;
  valor: number;               // S/.
  tipo: CostoTipo;             // 'INICIAL' | 'RECURRENTE'
  periodicidad?: CostoPeriodicidad; // solo si tipo === 'RECURRENTE'
}

export interface SimulacionRequest {
  propiedadId: number;
  entidadFinancieraId: number;
  moneda: 'PEN' | 'USD';   
  precioVenta: number;
  cuotaInicial: number;
  tiempoAnios: number;
  frecuenciaPago: number;
  tipoAnio: 360 | 365;
  tipoGracia: TipoGracia;
  cantidadGracia: number | null;
  aplicarBono: boolean;
  bonoTipo?: string | null;
  tasaEfectivaAnual: number | null;
  costos?: CostoAdicionalReq[];
  tasaDescuentoAnual?: number | null;
  bonoReglaId?: number | null;
}

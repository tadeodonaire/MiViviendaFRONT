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

  moneda: Moneda;

  // En tu back NO es opcional: si quieres que use el precio de la propiedad, envía 0
  precioVenta: number;

  cuotaInicial: number;
  tiempoAnios: number;
  frecuenciaPago: number;
  tipoAnio: 360 | 365;

  tipoGracia: TipoGracia;
  cantidadGracia: number | null;

  aplicarBono: boolean;
  // puedes enviar null si no eliges
  bonoTipo: string | null;
  // porcentaje (p.ej. 10.5) o fracción (0.105). Envía null para usar la mínima de la entidad
  tasaEfectivaAnual: number | null;

  // Debe calzar con Costes_adicionalesDTO del back
  costos?: CostoAdicionalReq[];
}

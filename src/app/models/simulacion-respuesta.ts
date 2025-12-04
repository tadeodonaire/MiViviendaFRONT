import { EntidadesFinancieras } from "./entidades-financieras";
import { Propiedades } from "./propiedades";
import { Simulaciones } from "./simulaciones";

export interface SimulacionRespuesta {
    simulacion_id: number;
    precioVenta: number;
    cuotaInicial: number;
    montoPrestamo: number;
    moneda: string;
    tiempoAnios: number;
    frecuenciaPago: number;      // m
    tipoAnio: number;
    tipoGracia: 'SIN_GRACIA' | 'TOTAL' | 'PARCIAL';
    cantidadGracia: number | null;
    seguroDesgravamen: number;   // % mensual en back
    seguroInmueble: number;      // % anual en back
    propiedades_inmueble_id: Propiedades;
    entidades_financieras_entidadFinanciera_id: EntidadesFinancieras;
    tipoTasa: 'TEA';
    valorTasa: number;           // fracción anual (0.081, etc.)
    cuotaFija: number;           // “francesa sin seguros” (informativo)
    bonoAplica: boolean;
    bonoTipo: string;
    bonoMonto: number;
    bono_Reglas_reglas_id: any | null;
    costos?: Array<{ nombreCosto: string; valor: number }>;
}

export interface SimulacionCronogramaDTO {
    simulacionCronograma_id?: number;   // opcional
    periodo: number;
    saldoInicial: number;
    saldoInicialIndexado: number;
    interes: number;
    cuota: number;               // “cuota (inc SegDes)” según regla Interbank, o 0/Interés en gracia
    amortizacion: number;
    seguroDesgravamen: number;   // varía con saldo
    seguroInmueble: number;      // prorrateado del 100% del PV
    cuotaTotal: number;          // = cuota + seguroInmueble
    saldoFinal: number;
    flujo: number;               // ver fórmula más abajo
}

export interface SimulacionConCronogramaResponse {
    simulacion: Simulaciones;
    cronograma: SimulacionCronogramaDTO[];
    van: number;
    tirPeriodo: number; // % por periodo (mensual, trimestral, etc.)
    tcea: number;       // % anual
}
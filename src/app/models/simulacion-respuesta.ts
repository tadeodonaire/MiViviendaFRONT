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
    frecuenciaPago: number;
    tipoAnio: number;
    tipoGracia: string;
    cantidadGracia: number | null;
    seguroDesgravamen: number;
    seguroInmueble: number;
    propiedades_inmueble_id: Propiedades;
    entidades_financieras_entidadFinanciera_id: EntidadesFinancieras;
    tipoTasa: string;            // "TEA"
    valorTasa: number;           // fracción anual
    cuotaFija: number;
    bonoAplica: boolean;
    bonoTipo: string;
    bonoMonto: number;
    // si el back te devuelve los costos, puedes tiparlos así:
    costos?: Array<{ nombreCosto: string; valor: number }>;
}

export interface SimulacionCronogramaDTO {
    simulacionCronograma_id?: number; // no viene de BD, así que opcional
    periodo: number;
    saldoInicial: number;
    saldoInicialIndexado: number;
    interes: number;
    cuota: number;
    amortizacion: number;
    seguroDesgravamen: number;
    seguroInmueble: number;
    cuotaTotal: number;
    saldoFinal: number;
}

export interface SimulacionConCronogramaResponse {
    simulacion: Simulaciones;
    cronograma: SimulacionCronogramaDTO[];
}
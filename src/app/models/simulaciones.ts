import { BonosReglas } from "./bonos-reglas";
import { CostesAdicionales } from "./costes-adicionales";
import { EntidadesFinancieras } from "./entidades-financieras";
import { Propiedades } from "./propiedades";

export class Simulaciones {
    simulacion_id: number = 0;
    precioVenta: number = 0;
    cuotaInicial: number = 0;
    montoPrestamo: number = 0;             // calculado
    moneda: string = '';                    // "PEN" | "USD"
    tiempoAnios: number = 0;               // años del crédito
    frecuenciaPago: number = 0;            // 12 mensual, 6 bimestral, etc.
    tipoAnio: number = 0;                  // 360 o 365
    tipoGracia: string = '';                // "SIN_GRACIA" | "TOTAL" | "PARCIAL"
    cantidadGracia: number = 0;             // número de periodos de gracia
    seguroDesgravamen: number = 0;
    seguroInmueble: number = 0;

    propiedades_inmueble_id: Propiedades = new Propiedades();
    entidades_financieras_entidadFinanciera_id: EntidadesFinancieras = new EntidadesFinancieras();

    tipoTasa: string = '';                  // "TEA"
    valorTasa: number = 0;                 // TEA normalizada (0.10 = 10%)
    cuotaFija: number = 0;                 // opcional

    bonoAplica: boolean = false;
    bonoTipo: string = '';               // "PORCENTAJE" | "MONTO_FIJO"
    bonoMonto: number = 0;

    bono_Reglas_reglas_id: BonosReglas = new BonosReglas();

    costos: CostesAdicionales[] = [];
}

import { Simulaciones } from "./simulaciones";

export class SimulacionCronograma {
    simulacionCronograma_id: number = 0;
    periodo: number = 0;
    saldoInicial: number = 0;
    saldoInicialIndexado: number = 0;
    interes: number = 0;
    cuota: number = 0;
    amortizacion: number = 0;
    seguroDesgravamen:  number = 0;
    seguroInmueble: number = 0;
    saldoFinal: number = 0;
    cuotaTotal: number = 0;
    simulaciones_simulacion_id: Simulaciones = new Simulaciones();
}

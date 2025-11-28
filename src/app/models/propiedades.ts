import { Clientes } from "./clientes";

export class Propiedades {
    inmueble_id: number = 0;
    nombreInmueble: string = '';
    areaInmueble: number = 0;
    direccionInmueble: string = '';
    precioInmueble: number = 0;
    clientes_cliente_id: Clientes = new Clientes();
}

import { Usuarios } from "./usuarios";

export class Clientes {
    cliente_id: number = 0;
    nombre: string = '';
    apellido: string = '';
    correo: string = '';
    dni: number = 0;
    ingresosMensuales: number = 0;
    moneda: string = '';
    usuarios_usuario_id: Usuarios = new Usuarios();
}

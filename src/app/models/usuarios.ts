import { Roles } from "./roles";

export class Usuarios {
    usuario_id: number = 0;
    username: string = '';
    password: string = '';
    activo: boolean = false;
    creado_en: Date = new Date();
    roles_rol_id: Roles = new Roles();
}

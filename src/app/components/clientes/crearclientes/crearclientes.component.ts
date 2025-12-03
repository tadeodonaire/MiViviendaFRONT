import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Clientes } from '../../../models/clientes';
import { Usuarios } from '../../../models/usuarios';
import { ClientesService } from '../../../services/clientes.service';
import { Router, RouterModule } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crearclientes',
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './crearclientes.component.html',
  styleUrl: './crearclientes.component.css'
})
export class CrearclientesComponent {
 form: FormGroup = new FormGroup({});
 clientes: Clientes = new Clientes();
 listaUsuarios: Usuarios[] = [];
 constructor(
   private formBuilder: FormBuilder,
   private cS: ClientesService,
   private router: Router,
   private uS: UsuariosService
 ) {}
 ngOnInit(): void {
   this.form = this.formBuilder.group({
     nombre: ['', Validators.required],
     apellido: ['', Validators.required],
     correo: ['', Validators.required],
     dni: ['', Validators.required],
     ingresosMensuales: ['', Validators.required],
     moneda: ['', Validators.required],
     usuario: ['', Validators.required],
   });
   this.uS.list().subscribe((data) => {
     this.listaUsuarios = data;
   });
 }
   aceptar() {
    if (this.form.valid) {
      // Campos simples
      this.clientes.nombre = this.form.value.nombre;
      this.clientes.apellido = this.form.value.apellido;
      this.clientes.correo = this.form.value.correo;
      this.clientes.dni = Number(this.form.value.dni);
      this.clientes.ingresosMensuales = Number(this.form.value.ingresosMensuales);
      this.clientes.moneda = this.form.value.moneda; // "USD" | "EUR" | "SOL"

      // ⚠️ Construir el objeto Usuarios a partir del ID seleccionado
      const usuarioId = Number(this.form.value.usuario);
      this.clientes.usuarios_usuario_id = { usuario_id: usuarioId } as Usuarios;

      this.cS.insert(this.clientes).subscribe(() => {
        // refresco opcional de usuarios
        this.uS.list().subscribe((data) => this.uS.setList(data));
        this.router.navigate(['clientes']);
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
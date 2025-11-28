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
     usuarios_usuario_id: ['', Validators.required],
   });
   this.uS.list().subscribe((data) => {
     this.listaUsuarios = data;
   });
 }
 aceptar() {
   if (this.form.valid) {
    this.clientes.nombre = this.form.value.nombre;
    this.clientes.apellido = this.form.value.apellido;
    this.clientes.correo = this.form.value.correo;
    this.clientes.dni = this.form.value.dni;
    this.clientes.ingresosMensuales = this.form.value.ingresosMensuales;
    this.clientes.moneda = this.form.value.moneda;
    this.clientes.usuarios_usuario_id = this.form.value.husuarios_usuario_id;
    this.cS.insert(this.clientes).subscribe(() => {
       this.uS.list().subscribe((data) => {
         this.uS.setList(data);
       });
     });
     this.router.navigate(['clientes']);
   }
 }
}

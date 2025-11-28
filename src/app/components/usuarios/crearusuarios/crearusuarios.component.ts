import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuarios } from '../../../models/usuarios';
import { Roles } from '../../../models/roles';
import { UsuariosService } from '../../../services/usuarios.service';
import { Router, RouterModule } from '@angular/router';
import { RolesService } from '../../../services/roles.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-crearusuarios',
  imports: [CommonModule,MatFormFieldModule,ReactiveFormsModule,MatButtonModule,RouterModule],
  templateUrl: './crearusuarios.component.html',
  styleUrl: './crearusuarios.component.css'
})
export class CrearusuariosComponent implements OnInit{
  form: FormGroup = new FormGroup({});
  usuarios: Usuarios = new Usuarios();
  listaRoles: Roles[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private uS: UsuariosService,
    private router: Router,
    private rS: RolesService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      activo: ['', Validators.required],
      creado_en: ['', Validators.required],
      rol: ['', Validators.required],
    });
    this.rS.list().subscribe((data) => {
      this.listaRoles = data;
    });
  }
  aceptar() {
    if (this.form.valid) {
      this.usuarios.username = this.form.value.username;
      this.usuarios.password = this.form.value.password;
      this.usuarios.activo = this.form.value.activo;
      this.usuarios.creado_en = this.form.value.creado_en;
      this.usuarios.roles_rol_id.rol_id = this.form.value.rol;

      this.uS.insert(this.usuarios).subscribe(() => {
        this.uS.list().subscribe((data) => {
          this.uS.setList(data);
        });
      });

      this.router.navigate(['usuarios']);
    }
  }
}

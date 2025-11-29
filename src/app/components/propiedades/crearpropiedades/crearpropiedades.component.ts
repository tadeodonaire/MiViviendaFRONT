import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Propiedades } from '../../../models/propiedades';
import { Clientes } from '../../../models/clientes';
import { PropiedadesService } from '../../../services/propiedades.service';
import { Router, RouterModule } from '@angular/router';
import { ClientesService } from '../../../services/clientes.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crearpropiedades',
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './crearpropiedades.component.html',
  styleUrl: './crearpropiedades.component.css',
})
export class CrearpropiedadesComponent {
  form: FormGroup = new FormGroup({});
  propiedades: Propiedades = new Propiedades();
  listaClientes: Clientes[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private pS: PropiedadesService,
    private router: Router,
    private cS: ClientesService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombreInmueble: ['', Validators.required],
      areaInmueble: ['', Validators.required],
      direccionInmueble: ['', Validators.required],
      precioInmueble: ['', Validators.required],
      clientes_cliente_id: ['', Validators.required],
    });
    this.cS.list().subscribe((data) => {
      this.listaClientes = data;
    });
  }
  aceptar() {
    if (this.form.valid) {
      this.propiedades.nombreInmueble = this.form.value.nombreInmueble;
      this.propiedades.areaInmueble = this.form.value.areaInmueble;
      this.propiedades.direccionInmueble = this.form.value.direccionInmueble;
      this.propiedades.precioInmueble = this.form.value.precioInmueble;
      this.propiedades.clientes_cliente_id = this.form.value.clientes_cliente_id;
      this.pS.insert(this.propiedades).subscribe(() => {
        this.pS.list().subscribe((data) => {
          this.pS.setList(data);
        });
      });

      this.router.navigate(['propiedades']);
    }
  }
}

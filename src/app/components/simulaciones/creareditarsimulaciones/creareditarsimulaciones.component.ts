import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Moneda, SimulacionRequest, TipoGracia } from '../../../models/simulacion-request';
import { CommonModule } from '@angular/common';
import { Clientes } from '../../../models/clientes';
import { Propiedades } from '../../../models/propiedades';
import { EntidadesFinancieras } from '../../../models/entidades-financieras';
import { ClientesService } from '../../../services/clientes.service';
import { PropiedadesService } from '../../../services/propiedades.service';
import { EntidadesFinancierasService } from '../../../services/entidades-financieras.service';
import { SimulacionesService } from '../../../services/simulaciones.service';
import { Router } from '@angular/router';

type SimForm = FormGroup<{
  clienteId: FormControl<number | null>;
  propiedadId: FormControl<number | null>;
  entidadFinancieraId: FormControl<number | null>;

  moneda: FormControl<Moneda>;
  precioVenta: FormControl<number | null>;
  cuotaInicial: FormControl<number | null>;
  tiempoAnios: FormControl<number | null>;
  frecuenciaPago: FormControl<number | null>;
  tipoAnio: FormControl<360 | 365>;

  tipoGracia: FormControl<TipoGracia>;
  cantidadGracia: FormControl<number | null>;

  aplicarBono: FormControl<boolean>;
  bonoTipo: FormControl<string | null>;
  tasaEfectivaAnual: FormControl<number | null>;

  costos: FormArray<FormGroup<{ nombreCosto: FormControl<string>, valor: FormControl<number | null> }>>;
}>;

@Component({
  selector: 'app-creareditarsimulaciones',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './creareditarsimulaciones.component.html',
  styleUrl: './creareditarsimulaciones.component.css'
})
export class CreareditarsimulacionesComponent {
  form: SimForm;

  // data
  clientes: Clientes[] = [];
  propiedadesAll: Propiedades[] = [];
  propiedadesFiltradas: Propiedades[] = [];
  entidades: EntidadesFinancieras[] = [];

  isSaving = false;
  error: string | null = null;

  // combos
  frecuencias = [12, 6, 4, 2, 1]; // mensual, bimestral, trimestral, semestral, anual
  aniosBase: Array<360 | 365> = [360, 365];
  tiposGracia: TipoGracia[] = ['SIN_GRACIA', 'TOTAL', 'PARCIAL'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cliSrv: ClientesService,
    private propSrv: PropiedadesService,
    private entSrv: EntidadesFinancierasService,
    private simSrv: SimulacionesService,
  ) {
    this.form = this.fb.group({
      clienteId: this.fb.control<number | null>(null, Validators.required),
      propiedadId: this.fb.control<number | null>(null, Validators.required),
      entidadFinancieraId: this.fb.control<number | null>(null, Validators.required),

      moneda: this.fb.nonNullable.control<Moneda>('PEN', Validators.required),
      precioVenta: this.fb.control<number | null>(null), // 0 o null => back usa el de la propiedad
      cuotaInicial: this.fb.control<number | null>(0, [Validators.min(0)]),
      tiempoAnios: this.fb.control<number | null>(15, [Validators.required, Validators.min(1)]),
      frecuenciaPago: this.fb.control<number | null>(12, [Validators.required]),
      tipoAnio: this.fb.nonNullable.control<360 | 365>(360, Validators.required),

      tipoGracia: this.fb.nonNullable.control<TipoGracia>('SIN_GRACIA', Validators.required),
      cantidadGracia: this.fb.control<number | null>({ value: null, disabled: true }, [Validators.min(0)]),

      aplicarBono: this.fb.nonNullable.control<boolean>(false),
      bonoTipo: this.fb.control<string | null>(null),
      tasaEfectivaAnual: this.fb.control<number | null>(null), // null => usar TEA mínima de la entidad

      costos: this.fb.array<FormGroup<{ nombreCosto: FormControl<string>, valor: FormControl<number | null> }>>([])
    });

    // listeners
    this.form.get('clienteId')!.valueChanges.subscribe(cliId => {
      this.onClienteChange(cliId ?? null);
    });

    this.form.get('propiedadId')!.valueChanges.subscribe(pid => {
      const p = this.propiedadesFiltradas.find(x => x.inmueble_id === pid);
      if (p) {
        this.form.get('precioVenta')!.setValue(p.precioInmueble); // prefill
      }
    });

    this.form.get('tipoGracia')!.valueChanges.subscribe(tg => {
      const c = this.form.get('cantidadGracia')!;
      if (tg === 'SIN_GRACIA') {
        c.disable();
        c.setValue(null);
      } else {
        c.enable();
      }
    });
  }

  get costosFA() {
    return this.form.controls.costos;
  }

  addCosto() {
    this.costosFA.push(
      this.fb.group({
        nombreCosto: this.fb.nonNullable.control<string>(''),
        valor: this.fb.control<number | null>(0, [Validators.min(0)])
      })
    );
  }
  removeCosto(i: number) {
    this.costosFA.removeAt(i);
  }

  ngOnInit(): void {
    // clientes del usuario autenticado
    this.cliSrv.listMine().subscribe({
      next: data => this.clientes = data,
      error: () => this.error = 'No se pudo cargar clientes.'
    });

    // todas las propiedades (filtraremos localmente por cliente)
    this.propSrv.list().subscribe({
      next: data => this.propiedadesAll = data,
      error: () => this.error = 'No se pudo cargar propiedades.'
    });

    // entidades
    this.entSrv.list().subscribe({
      next: data => this.entidades = data,
      error: () => this.error = 'No se pudieron cargar entidades financieras.'
    });
  }

  private onClienteChange(cliId: number | null) {
    if (cliId == null) {
      this.propiedadesFiltradas = [];
      this.form.get('propiedadId')!.reset();
      return;
    }
    this.propiedadesFiltradas = this.propiedadesAll.filter(
      p => p.clientes_cliente_id?.cliente_id === cliId
    );
    // reset propiedad al cambiar cliente
    this.form.get('propiedadId')!.reset();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    this.error = null;

    const v = this.form.getRawValue(); // incluye cantidadGracia si está habilitada

    const payload: SimulacionRequest = {
      propiedadId: v.propiedadId!,
      entidadFinancieraId: v.entidadFinancieraId!,
      moneda: v.moneda,                        // 'PEN'
      precioVenta: v.precioVenta == null ? 0 : Number(v.precioVenta), // 0 => usa de la propiedad
      cuotaInicial: Number(v.cuotaInicial || 0),
      tiempoAnios: Number(v.tiempoAnios),
      frecuenciaPago: Number(v.frecuenciaPago),
      tipoAnio: v.tipoAnio,
      tipoGracia: v.tipoGracia,
      cantidadGracia: v.tipoGracia === 'SIN_GRACIA' ? 0 : (v.cantidadGracia ?? 0),
      aplicarBono: !!v.aplicarBono,
      bonoTipo: v.aplicarBono ? (v.bonoTipo || null) : null,
      tasaEfectivaAnual: v.tasaEfectivaAnual == null || v.tasaEfectivaAnual === 0
        ? null
        : Number(v.tasaEfectivaAnual),
      costos: this.costosFA.controls.map((c) => {
        const raw = c.getRawValue(); // <- evita el string | undefined
        return {
          nombreCosto: raw.nombreCosto,
          valor: Number(raw.valor ?? 0),
        };
      }),
    };

    this.simSrv.crear(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/simulaciones']); // ajusta ruta de retorno si difiere
      },
      error: (e) => {
        console.error(e);
        this.isSaving = false;
        this.error = 'No se pudo crear la simulación.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/simulaciones']);
  }
}
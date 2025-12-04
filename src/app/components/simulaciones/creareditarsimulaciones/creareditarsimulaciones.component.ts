import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CostoPeriodicidad, CostoTipo, Moneda, SimulacionRequest, TipoGracia } from '../../../models/simulacion-request';
import { CommonModule } from '@angular/common';
import { Clientes } from '../../../models/clientes';
import { Propiedades } from '../../../models/propiedades';
import { EntidadesFinancieras } from '../../../models/entidades-financieras';
import { ClientesService } from '../../../services/clientes.service';
import { PropiedadesService } from '../../../services/propiedades.service';
import { EntidadesFinancierasService } from '../../../services/entidades-financieras.service';
import { SimulacionesService } from '../../../services/simulaciones.service';
import { Router } from '@angular/router';
import { SimulacionConCronogramaResponse, SimulacionCronogramaDTO } from '../../../models/simulacion-respuesta';
import { Simulaciones } from '../../../models/simulaciones';

import { debounceTime, filter } from 'rxjs/operators';

type CostoFG = FormGroup<{
  nombreCosto: FormControl<string | null>;
  valor: FormControl<number | null>;
  tipo: FormControl<CostoTipo | null>;
  periodicidad: FormControl<CostoPeriodicidad | null>;
}>;

type FSim = FormGroup<{
  clienteId: FormControl<number | null>;
  propiedadId: FormControl<number | null>;
  entidadFinancieraId: FormControl<number | null>;
  moneda: FormControl<'PEN' | 'USD' | null>;
  precioVenta: FormControl<number | null>;
  cuotaInicial: FormControl<number | null>;
  tiempoAnios: FormControl<number | null>;
  frecuenciaPago: FormControl<number | null>;
  tipoAnio: FormControl<360 | 365 | null>;
  tipoGracia: FormControl<'SIN_GRACIA' | 'TOTAL' | 'PARCIAL' | null>;
  cantidadGracia: FormControl<number | null>;
  aplicarBono: FormControl<boolean | null>;
  bonoTipo: FormControl<string | null>;
  tasaEfectivaAnual: FormControl<number | null>;
  costos: FormArray<CostoFG>;
  tasaDescuentoAnual: FormControl<number | null>;
}>;


@Component({
  selector: 'app-creareditarsimulaciones',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './creareditarsimulaciones.component.html',
  styleUrl: './creareditarsimulaciones.component.css'
})
export class CreareditarsimulacionesComponent implements OnInit {
  form: FSim;

  // combos
  clientes: Clientes[] = [];
  entidades: EntidadesFinancieras[] = [];
  propiedades: Propiedades[] = [];
  propiedadesFiltradas: Propiedades[] = [];

  frecuencias = [12, 6, 4, 2, 1] as const;
  aniosBase: (360 | 365)[] = [360, 365];
  tiposGracia: TipoGracia[] = ['SIN_GRACIA', 'TOTAL', 'PARCIAL'];

  tiposCosto: CostoTipo[] = ['INICIAL', 'RECURRENTE'];
  periodicidades: CostoPeriodicidad[] = ['POR_CUOTA', 'MENSUAL', 'ANUAL'];

  // flags/resultados
  isSaving = false;
  error: string | null = null;
  showCronograma = false;
  cronograma: SimulacionCronogramaDTO[] = [];
  simulacion!: Simulaciones;

  // datos dependientes
  entidadSel?: EntidadesFinancieras;
  propSel?: Propiedades;

  // límites dinámicos
  lockPrice = true;                  // ← deja el precio en solo lectura
  minCuotaSoles = 0;
  maxCuotaSoles = 0;                 // = precio
  teaRange = { min: 0, max: 0 };
  plazoRange = { min: 1, max: 40 };
  maxGracia = 0;

  constructor(
    private fb: FormBuilder,
    private simSrv: SimulacionesService,
    private clientesSrv: ClientesService,
    private propSrv: PropiedadesService,
    private entSrv: EntidadesFinancierasService,
    private router: Router
  ) {
    this.form = this.fb.group({
      clienteId: this.fb.control<number | null>(null, { validators: [Validators.required], nonNullable: false }),
      propiedadId: this.fb.control<number | null>(null, { validators: [Validators.required], nonNullable: false }),
      entidadFinancieraId: this.fb.control<number | null>(null, { validators: [Validators.required], nonNullable: false }),
      moneda: this.fb.control<'PEN' | 'USD' | null>('PEN', { validators: [Validators.required], nonNullable: false }),
      precioVenta: this.fb.control<number | null>(null),
      cuotaInicial: this.fb.control<number | null>(0, { validators: [Validators.required], updateOn: 'blur' }),
      tiempoAnios: this.fb.control<number | null>(15, { validators: [Validators.required], updateOn: 'blur' }),
      frecuenciaPago: this.fb.control<number | null>(12, { validators: [Validators.required], nonNullable: false }),
      tipoAnio: this.fb.control<360 | 365 | null>(360, { validators: [Validators.required], nonNullable: false }),
      tipoGracia: this.fb.control<'SIN_GRACIA' | 'TOTAL' | 'PARCIAL' | null>('SIN_GRACIA', { validators: [Validators.required], nonNullable: false }),
      cantidadGracia: this.fb.control<number | null>(null),
      aplicarBono: this.fb.control<boolean | null>(false),
      bonoTipo: this.fb.control<string | null>(null),
      tasaEfectivaAnual: this.fb.control<number | null>(null, { updateOn: 'blur' }),
      costos: this.fb.array<CostoFG>([]),
      tasaDescuentoAnual: this.fb.control<number | null>(25, {
        updateOn: 'blur'
      })
    });

  }

  ngOnInit(): void {
    // Carga de combos
    this.clientesSrv.list().subscribe(cs => this.clientes = cs);
    this.entSrv.list().subscribe(es => this.entidades = es);
    this.propSrv.list().subscribe(ps => { this.propiedades = ps; this.refiltrarPropiedades(); });

    // Reacciones
    this.form.get('clienteId')!.valueChanges.subscribe(() => {
      this.form.get('propiedadId')!.reset(null);
      this.refiltrarPropiedades();
    });

    // Aplica estado inicial de gracia
    this.toggleGracia(this.form.get('tipoGracia')!.value);
    this.form.get('tipoGracia')!.valueChanges.subscribe(v => this.toggleGracia(v));

    this.wireRestrictions();
  }

  // util: clamp
  private clamp(v: number | null | undefined, min: number, max: number): number {
    const n = Number(v ?? 0);
    if (Number.isNaN(n)) return min;
    return Math.min(Math.max(n, min), max);
  }

  // Filtra las propiedades según el cliente seleccionado
  private refiltrarPropiedades(): void {
    const cliId = this.form.get('clienteId')!.value;
    this.propiedadesFiltradas = cliId
      ? this.propiedades.filter(p => p.clientes_cliente_id?.cliente_id === cliId)
      : this.propiedades;
  }

  private wireRestrictions(): void {
    // PROPIEDAD → set precio y límites dependientes
    this.form.get('propiedadId')!.valueChanges
      .pipe(filter(id => !!id))
      .subscribe(id => {
        this.propSel = this.propiedades.find(p => p.inmueble_id === id);
        const precio = this.propSel?.precioInmueble ?? 0;
        this.form.get('precioVenta')!.setValue(precio, { emitEvent: false });
        this.applyCuotaLimits();     // min/max en función de entidad + precio
        this.applyGraceMax();        // max = años × frecuencia
      });

    // ENTIDAD → ranges (TEA, plazo) + cuota mínima
    this.form.get('entidadFinancieraId')!.valueChanges
      .pipe(filter(id => !!id))
      .subscribe(id => {
        this.entidadSel = this.entidades.find(e => e.entidadFinanciera_id === id);

        // TEA
        this.teaRange.min = this.entidadSel?.TEAmin ?? 0;
        this.teaRange.max = this.entidadSel?.TEAmax ?? 0;
        const teaCtrl = this.form.get('tasaEfectivaAnual')!;
        teaCtrl.setValidators([Validators.min(this.teaRange.min), Validators.max(this.teaRange.max)]);
        // sugerir TEAmin si está vacío
        if ((teaCtrl.value == null || teaCtrl.value === undefined) && this.teaRange.min > 0) {
          teaCtrl.setValue(this.teaRange.min, { emitEvent: false });
        }
        teaCtrl.updateValueAndValidity({ emitEvent: false });

        // Plazo
        this.plazoRange.min = this.entidadSel?.plazoMin ?? 1;
        this.plazoRange.max = this.entidadSel?.plazoMax ?? 40;
        const plazoCtrl = this.form.get('tiempoAnios')!;
        plazoCtrl.setValidators([Validators.required, Validators.min(this.plazoRange.min), Validators.max(this.plazoRange.max)]);
        // Clampea si está fuera
        plazoCtrl.setValue(this.clamp(plazoCtrl.value, this.plazoRange.min, this.plazoRange.max), { emitEvent: false });
        plazoCtrl.updateValueAndValidity({ emitEvent: false });

        // Recalcular cuota mínima
        this.applyCuotaLimits();
      });

    // PRECIO/PLAZO/FRECUENCIA → recalcular dependencias
    this.form.get('precioVenta')!.valueChanges.pipe(debounceTime(50)).subscribe(() => this.applyCuotaLimits());
    this.form.get('tiempoAnios')!.valueChanges.pipe(debounceTime(50)).subscribe(() => this.applyGraceMax());
    this.form.get('frecuenciaPago')!.valueChanges.pipe(debounceTime(50)).subscribe(() => this.applyGraceMax());

    // TEA clamp al volar
    this.form.get('tasaEfectivaAnual')!.valueChanges.subscribe(v => {
      if (this.teaRange.min === 0 && this.teaRange.max === 0) return;
      const cl = this.clamp(v, this.teaRange.min, this.teaRange.max);
      if (cl !== v) this.form.get('tasaEfectivaAnual')!.setValue(cl, { emitEvent: false });
    });

    // Plazo clamp si lo fuerzan
    this.form.get('tiempoAnios')!.valueChanges.subscribe(v => {
      const cl = this.clamp(v, this.plazoRange.min, this.plazoRange.max);
      if (cl !== v) this.form.get('tiempoAnios')!.setValue(cl, { emitEvent: false });
    });

    // Cuota inicial clamp contra [min, max]
    this.form.get('cuotaInicial')!.valueChanges.subscribe(v => {
      const cl = this.clamp(v, this.minCuotaSoles, this.maxCuotaSoles);
      if (cl !== v) this.form.get('cuotaInicial')!.setValue(cl, { emitEvent: false });
    });
  }

  private toggleGracia(tipo: TipoGracia | null) {
    const cg = this.form.get('cantidadGracia')!;
    if (tipo === 'SIN_GRACIA' || !tipo) {
      cg.reset();
      cg.disable({ emitEvent: false });
    } else {
      cg.enable({ emitEvent: false });
      cg.setValidators([Validators.min(0), Validators.max(this.maxGracia)]);
      cg.updateValueAndValidity({ emitEvent: false });
      // clamp si estaba fuera
      if (cg.value != null) {
        const cl = this.clamp(cg.value, 0, this.maxGracia);
        if (cl !== cg.value) cg.setValue(cl, { emitEvent: false });
      }
    }
  }

  private applyCuotaLimits(): void {
    const precio = Number(this.form.get('precioVenta')!.value ?? 0);
    const pctMin = Number(this.entidadSel?.cuotaInicialMin ?? 0); // %
    this.minCuotaSoles = precio > 0 ? +(precio * pctMin / 100).toFixed(2) : 0;
    this.maxCuotaSoles = Math.max(0, precio);

    const ctrl = this.form.get('cuotaInicial')!;
    ctrl.setValidators([Validators.required, Validators.min(this.minCuotaSoles), Validators.max(this.maxCuotaSoles)]);
    // clamp inmediato
    ctrl.setValue(this.clamp(ctrl.value, this.minCuotaSoles, this.maxCuotaSoles), { emitEvent: false });
    ctrl.updateValueAndValidity({ emitEvent: false });
  }

  private applyGraceMax(): void {
    const anios = Number(this.form.get('tiempoAnios')!.value ?? 0);
    const freq = Number(this.form.get('frecuenciaPago')!.value ?? 12);
    this.maxGracia = Math.max(0, anios * freq);

    const cg = this.form.get('cantidadGracia')!;
    if (cg.enabled) {
      cg.setValidators([Validators.min(0), Validators.max(this.maxGracia)]);
      cg.setValue(this.clamp(cg.value, 0, this.maxGracia), { emitEvent: false });
      cg.updateValueAndValidity({ emitEvent: false });
    }
  }

  // === costos ===
  get costosFA(): FormArray<CostoFG> {
    return this.form.get('costos') as FormArray<CostoFG>;
  }

  addCosto(): void {
    const fg = this.fb.group({
      nombreCosto: this.fb.control<string | null>(null),
      valor: this.fb.control<number | null>(null, [Validators.min(0)]),
      tipo: this.fb.control<CostoTipo | null>('INICIAL'),
      periodicidad: this.fb.control<CostoPeriodicidad | null>('POR_CUOTA')
    });
    // habilita/deshabilita periodicidad según tipo
    fg.get('tipo')!.valueChanges.subscribe(t => {
      const per = fg.get('periodicidad')!;
      if (t === 'INICIAL') { per.disable({ emitEvent: false }); }
      else { per.enable({ emitEvent: false }); }
    });
    // estado inicial
    fg.get('periodicidad')!.disable({ emitEvent: false });
    this.costosFA.push(fg);
  }

  removeCosto(i: number): void { this.costosFA.removeAt(i); }

  // ===== wiring con tipos en callbacks =====
  private wireReactions(): void {
    // Propiedad -> autollenar precio y recalcular mínimos
    this.form.get('propiedadId')!.valueChanges.subscribe((id: number | null) => {
      this.propSel = this.propiedades.find(p => p.inmueble_id === id);
      const precio = this.propSel?.precioInmueble ?? 0;
      this.form.get('precioVenta')!.setValue(precio, { emitEvent: false });
      this.recalcMinCuota();
      this.recalcMaxGracia();
    });

    // Entidad -> TEA, plazo y mínimo de cuota
    this.form.get('entidadFinancieraId')!.valueChanges.subscribe((id: number | null) => {
      this.entidadSel = this.entidades.find(e => e.entidadFinanciera_id === id);
      this.teaRange.min = this.entidadSel?.TEAmin ?? 0;
      this.teaRange.max = this.entidadSel?.TEAmax ?? 0;

      const teaCtrl = this.form.get('tasaEfectivaAnual')!;
      teaCtrl.setValidators([Validators.min(this.teaRange.min), Validators.max(this.teaRange.max)]);
      if (!teaCtrl.value && this.teaRange.min > 0) teaCtrl.setValue(this.teaRange.min, { emitEvent: false });
      teaCtrl.updateValueAndValidity({ emitEvent: false });

      this.plazoRange.min = this.entidadSel?.plazoMin ?? 1;
      this.plazoRange.max = this.entidadSel?.plazoMax ?? 40;

      const plazoCtrl = this.form.get('tiempoAnios')!;
      plazoCtrl.setValidators([Validators.required, Validators.min(this.plazoRange.min), Validators.max(this.plazoRange.max)]);
      plazoCtrl.updateValueAndValidity({ emitEvent: false });

      this.recalcMinCuota();
    });

    // Cambios que afectan gracia/cuota
    this.form.get('precioVenta')!.valueChanges.subscribe(() => this.recalcMinCuota());
    this.form.get('tiempoAnios')!.valueChanges.subscribe(() => this.recalcMaxGracia());
    this.form.get('frecuenciaPago')!.valueChanges.subscribe(() => this.recalcMaxGracia());

    this.form.get('tipoGracia')!.valueChanges.subscribe((tg: 'SIN_GRACIA' | 'TOTAL' | 'PARCIAL' | null) => {
      const c = this.form.get('cantidadGracia')!;
      if (tg === 'SIN_GRACIA') {
        c.reset(); c.disable({ emitEvent: false });
      } else {
        c.enable({ emitEvent: false });
        c.setValidators([Validators.min(0), Validators.max(this.maxGracia)]);
        c.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  private recalcMinCuota(): void {
    const precio = Number(this.form.get('precioVenta')!.value ?? 0);
    const pct = Number(this.entidadSel?.cuotaInicialMin ?? 0);
    this.minCuotaSoles = precio > 0 ? +(precio * pct / 100).toFixed(2) : 0;

    const cuotaCtrl = this.form.get('cuotaInicial')!;
    cuotaCtrl.setValidators([Validators.required, Validators.min(this.minCuotaSoles)]);
    cuotaCtrl.updateValueAndValidity({ emitEvent: false });
  }

  private recalcMaxGracia(): void {
    const anios = Number(this.form.get('tiempoAnios')!.value ?? 0);
    const freq = Number(this.form.get('frecuenciaPago')!.value ?? 12);
    this.maxGracia = Math.max(0, anios * freq);

    const c = this.form.get('cantidadGracia')!;
    c.setValidators([Validators.min(0), Validators.max(this.maxGracia)]);
    c.updateValueAndValidity({ emitEvent: false });
  }

  // ===== request/submit =====
  private buildPayload(): SimulacionRequest {
    const v = this.form.value;
    const cantGracia = v.tipoGracia === 'SIN_GRACIA' ? null : (v.cantidadGracia ?? null);
    const costos = (v.costos ?? [])
      .map(c => ({
        nombreCosto: String(c?.nombreCosto ?? '').trim(),
        valor: Number(c?.valor ?? 0),
        tipo: (c?.tipo ?? 'INICIAL') as CostoTipo,
        periodicidad: (c?.tipo === 'RECURRENTE' ? (c?.periodicidad ?? 'POR_CUOTA') : undefined) as any
      }))
      .filter(c => c.nombreCosto.length > 0 && !Number.isNaN(c.valor));

    return {
      propiedadId: Number(v.propiedadId),
      entidadFinancieraId: Number(v.entidadFinancieraId),
      moneda: (v.moneda ?? 'PEN'),
      precioVenta: Number(v.precioVenta ?? 0),
      cuotaInicial: Number(v.cuotaInicial ?? 0),
      tiempoAnios: Number(v.tiempoAnios ?? 0),
      frecuenciaPago: Number(v.frecuenciaPago ?? 12),
      tipoAnio: (v.tipoAnio ?? 360),
      tipoGracia: (v.tipoGracia ?? 'SIN_GRACIA'),
      cantidadGracia: cantGracia,
      aplicarBono: Boolean(v.aplicarBono),
      bonoTipo: (v.bonoTipo && v.bonoTipo.trim().length ? v.bonoTipo.trim() : null),
      tasaEfectivaAnual: (v.tasaEfectivaAnual ?? null),
      costos: costos.length ? costos : undefined,
      tasaDescuentoAnual: (v.tasaDescuentoAnual ?? null)
    };
  }


  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const payload = this.buildPayload();
    this.isSaving = true; this.error = null;

    this.simSrv.crear(payload).subscribe({
      next: (resp: SimulacionConCronogramaResponse) => {
        this.router.navigate(['/simulaciones', resp.simulacion.simulacion_id], { state: { hoja: resp } });
        this.isSaving = false;
        this.simulacion = resp.simulacion;
        this.cronograma = resp.cronograma;
        this.showCronograma = true;
      },
      error: (e) => {
        console.error(e);
        this.isSaving = false;
        this.error = 'No se pudo crear la simulación.';
      }
    });
  }

  cancel(): void { this.router.navigate(['/inicio']); }
}

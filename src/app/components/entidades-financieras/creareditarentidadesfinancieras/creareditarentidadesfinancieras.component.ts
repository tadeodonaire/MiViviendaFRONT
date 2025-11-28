import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EntidadesFinancieras } from '../../../models/entidades-financieras';
import { Router } from '@angular/router';
import { EntidadesFinancierasService } from '../../../services/entidades-financieras.service';

type EFForm = FormGroup<{
  nombre: FormControl<string>;
  valorCotizacionMax: FormControl<number | null>;
  cuotaInicialMin: FormControl<number | null>;
  TEAmin: FormControl<number | null>;
  TEAmax: FormControl<number | null>;
  precioMin: FormControl<number | null>;
  precioMax: FormControl<number | null>;
  plazoMin: FormControl<number | null>;
  plazoMax: FormControl<number | null>;
  seguroDesgravamen: FormControl<number | null>;
  seguroInmueble: FormControl<number | null>;
}>;

@Component({
  selector: 'app-creareditarentidadesfinancieras',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './creareditarentidadesfinancieras.component.html',
  styleUrl: './creareditarentidadesfinancieras.component.css'
})
export class CreareditarentidadesfinancierasComponent {
  isSaving = false;
  error: string | null = null;

  form: EFForm;

  constructor(
    private fb: FormBuilder,
    private efService: EntidadesFinancierasService,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        nombre: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(80)]),
        valorCotizacionMax: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
        cuotaInicialMin: this.fb.control<number | null>(null, [Validators.required, Validators.min(0), Validators.max(100)]),
        TEAmin: this.fb.control<number | null>(null, [Validators.required, Validators.min(0), Validators.max(100)]),
        TEAmax: this.fb.control<number | null>(null, [Validators.required, Validators.min(0), Validators.max(100)]),
        precioMin: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
        precioMax: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
        plazoMin: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
        plazoMax: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
        seguroDesgravamen: this.fb.control<number | null>(null, [Validators.required, Validators.min(0), Validators.max(100)]),
        seguroInmueble: this.fb.control<number | null>(null, [Validators.required, Validators.min(0), Validators.max(100)]),
      },
      { validators: [this.priceRange, this.plazoRange] }
    );
  }

  get f() { return this.form.controls; }

  private priceRange = (fg: FormGroup) => {
    const a = fg.get('precioMin')?.value ?? null;
    const b = fg.get('precioMax')?.value ?? null;
    return a != null && b != null && b >= a ? null : { priceRange: true };
  };
  private plazoRange = (fg: FormGroup) => {
    const a = fg.get('plazoMin')?.value ?? null;
    const b = fg.get('plazoMax')?.value ?? null;
    return a != null && b != null && b >= a ? null : { plazoRange: true };
  };

  onBack(): void {
    this.router.navigate(['entidadfinanciera']);
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isSaving = true;

    const v = this.form.value;

    // 👇 OJO: usar "teamin"/"teamax" como espera el backend
    const payload: any = {
      entidadFinanciera_id: 0,
      nombre: v.nombre!,
      valorCotizacionMax: Number(v.valorCotizacionMax),
      cuotaInicialMin: Number(v.cuotaInicialMin),

      teamin: Number(v.TEAmin),   // <-- clave correcta
      teamax: Number(v.TEAmax),   // <-- clave correcta

      precioMin: Number(v.precioMin),
      precioMax: Number(v.precioMax),
      plazoMin: Number(v.plazoMin),
      plazoMax: Number(v.plazoMax),
      seguroDesgravamen: Number(v.seguroDesgravamen),
      seguroInmueble: Number(v.seguroInmueble),
    };

    this.efService.insert(payload).subscribe({
      next: () => {
        this.efService.list().subscribe(ls => this.efService.setList(ls));
        this.isSaving = false;
        this.router.navigate(['entidadfinanciera']);
      },
      error: (e) => { console.error(e); this.error = 'No se pudo guardar la entidad.'; this.isSaving = false; }
    });
  }
}
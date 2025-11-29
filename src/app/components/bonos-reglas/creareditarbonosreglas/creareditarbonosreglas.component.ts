import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BonosReglas } from '../../../models/bonos-reglas';
import { BonosReglasService } from '../../../services/bonos-reglas.service';
import { Router } from '@angular/router';

type ReglaForm = FormGroup<{
  nombre: FormControl<string>;
  moneda: FormControl<string>;
  precioMin: FormControl<number | null>;
  precioMax: FormControl<number | null>;
  ingresoMax: FormControl<number | null>;
  monto: FormControl<number | null>;
}>;

@Component({
  selector: 'app-creareditarbonosreglas',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './creareditarbonosreglas.component.html',
  styleUrl: './creareditarbonosreglas.component.css'
})
export class CreareditarbonosreglasComponent {
  isSaving = false;
  error: string | null = null;

  form: ReglaForm;

  constructor(
    private fb: FormBuilder,
    private service: BonosReglasService,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        nombre: this.fb.nonNullable.control('BBP', [Validators.required, Validators.maxLength(25)]),
        moneda: this.fb.nonNullable.control('PEN', [Validators.required, Validators.maxLength(10)]),
        precioMin: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
        precioMax: this.fb.control<number | null>(null, [Validators.min(0)]),       // opcional (NULL = sin tope)
        ingresoMax: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
        monto: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)])
      },
      { validators: [this.priceRange] }
    );
  }

  get f() { return this.form.controls; }

  private priceRange = (fg: FormGroup) => {
    const min = fg.get('precioMin')?.value as number | null;
    const max = fg.get('precioMax')?.value as number | null;
    if (min == null) return { priceRange: true };
    if (max == null) return null;           // sin tope: válido
    return max >= min ? null : { priceRange: true };
  };

  onBack(): void {
    this.router.navigate(['bonosreglas']); // ajusta si tu ruta difiere
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSaving = true;

    const v = this.form.value;
    const payload: any = {
      bonoRegla_id: 0,
      nombre: v.nombre!,
      moneda: v.moneda!,
      precioMin: Number(v.precioMin),
      // si está vacío, enviamos null (importante para tu query que usa "precio_max IS NULL")
      precioMax: v.precioMax === null || v.precioMax === undefined || v.precioMax === ('' as any)
        ? null
        : Number(v.precioMax),
      ingresoMax: Number(v.ingresoMax),
      monto: Number(v.monto)
    } as Partial<BonosReglas>;

    this.service.insert(payload as BonosReglas).subscribe({
      next: () => {
        this.service.list().subscribe(ls => this.service.setList(ls));
        this.isSaving = false;
        this.router.navigate(['bonosreglas']);
      },
      error: (e) => {
        console.error(e);
        this.error = 'No se pudo guardar la regla de bono.';
        this.isSaving = false;
      }
    });
  }
}
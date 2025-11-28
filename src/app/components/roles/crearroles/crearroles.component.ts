import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RolesService } from '../../../services/roles.service';
import { Router } from '@angular/router';
import { Roles } from '../../../models/roles';

type RolForm = FormGroup<{
  nombre: FormControl<string>;
  descripcion: FormControl<string>;
}>;

@Component({
  selector: 'app-crearroles',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crearroles.component.html',
  styleUrl: './crearroles.component.css'
})
export class CrearrolesComponent {
  isSaving = false;
  error: string | null = null;

  // ✅ inicializa el form en el constructor (evita “fb usado antes de inicializar”)
  form: RolForm;

  constructor(
    private fb: FormBuilder,
    private rolesService: RolesService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: this.fb.nonNullable.control('', {
        validators: [Validators.required, Validators.maxLength(50)]
      }),
      descripcion: this.fb.nonNullable.control('', {
        validators: [Validators.maxLength(200)]
      }),
    });
  }

  // comodín para el template
  get f() { return this.form.controls; }

  onBack(): void {
    this.router.navigate(['roles']);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSaving = true;

    const payload: Roles = {
      rol_id: 0,
      nombre: this.f.nombre.value.trim(),
      descripcion: this.f.descripcion.value.trim()
    };

    this.rolesService.insert(payload).subscribe({
      next: () => {
        // refresca la lista para cualquier suscriptor
        this.rolesService.list().subscribe(ls => this.rolesService.setList(ls));
        this.isSaving = false;
        this.router.navigate(['roles']);
      },
      error: (e) => {
        console.error(e);
        this.isSaving = false;
        this.error = 'No se pudo guardar el rol.';
      }
    });
  }
}
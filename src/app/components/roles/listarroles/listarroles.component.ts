import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Roles } from '../../../models/roles';
import { RolesService } from '../../../services/roles.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listarroles',
  imports: [CommonModule, FormsModule],
  templateUrl: './listarroles.component.html',
  styleUrl: './listarroles.component.css'
})
export class ListarrolesComponent {
    roles: Roles[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private rolesService: RolesService,
    private router: Router,
  ) {}

  ngOnInit(): void { this.fetchRoles(); }

  private fetchRoles(): void {
    this.isLoading = true;
    this.rolesService.list().subscribe({
      next: (data) => { this.roles = data; this.isLoading = false; },
      error: () => { this.error = 'No se pudieron cargar los roles.'; this.isLoading = false; }
    });
  }

  // Placeholder para cuando implementes el crear
  onAgregar(): void {}
  
  onBack(): void {
      this.router.navigate(['ajustes']);
  }
}
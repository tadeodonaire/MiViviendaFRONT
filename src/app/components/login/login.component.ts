import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { JwtRequest } from '../../models/jwt-request';


@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  isLoading = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
  ) { }

  username: string = '';
  password: string = '';
  mensaje: string = '';

  ngOnInit(): void { }

  onLogin() {
    this.isLoading = true;

    let request = new JwtRequest();
    request.username = this.username;
    request.password = this.password;

    this.loginService.login(request).subscribe(
      (data: any) => {
        this.isLoading = false;
        if (data.jwttoken) {
          sessionStorage.setItem('token', data.jwttoken);
          console.log("✅ Token guardado:", data.jwttoken);
          this.router.navigate(['inicio']);
        } else {
          console.error("❌ No se recibió un token válido del backend.");
          this.mensaje = 'Error en la autenticación';
        }
      },
      () => {
        this.isLoading = false;
        this.mensaje = 'Credenciales incorrectas';
      }
    );
  }

  private getUsuarios(): any[] {
    const usuariosStr = localStorage.getItem('usuarios');
    return usuariosStr ? JSON.parse(usuariosStr) : [];
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
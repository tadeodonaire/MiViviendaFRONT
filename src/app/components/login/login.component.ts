import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { JwtRequest } from '../../models/jwt-request';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  hidePassword: boolean = true;
  loading: boolean = false;
  constructor(
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  username: string = '';
  password: string = '';
  mensaje: string = '';
  ngOnInit(): void {}
  login() {
    if (!this.username || !this.password) {
      this.snackBar.open('Por favor, completa todos los campos', 'Aviso', {
        duration: 2000,
      });
      return;
    }

    this.loading = true; // Mostrar spinner
    let request = new JwtRequest();
    request.username = this.username;
    request.password = this.password;
    this.loginService
      .login(request)
      .subscribe(
        (data: any) => {
          sessionStorage.setItem('token', data.jwttoken);
          this.router.navigate(['ajustes']).then(() => {
            window.location.reload();
          });
        },
        (error) => {
          this.mensaje = 'Ingresaste mal la contraseña o el usuario';
          this.snackBar.open(this.mensaje, 'Aviso', { duration: 2000 });
        }
      )
      .add(() => {
        this.loading = false;
      });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}

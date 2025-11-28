import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtRequest } from '../models/jwt-request';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private jwtHelper = new JwtHelperService(); // Evitamos instanciarlo en cada método

  constructor(private http: HttpClient, private router: Router) {}

  // 🔑 Iniciar sesión
  login(request: JwtRequest) {
    return this.http.post(`http://localhost:8089/login`, request);
  }
  
  // 🔍 Verificar si el usuario está autenticado
  verificar(): boolean {
    const token = sessionStorage.getItem('token');
    return !!token; // Devuelve true si hay token, false si no
  }

  // 🔐 Cerrar sesión con verificación del token
  logout(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      console.log('Token expirado:', this.jwtHelper.isTokenExpired(token));
    }
    
    console.log('Cerrando sesión...');
    sessionStorage.clear(); // Elimina todos los datos de sessionStorage de una vez
    this.router.navigate(['/login']);
  }
  

  showRole(): string | null {
    const decodedToken = this.decodeToken();
    if (!decodedToken) {
      console.warn("⚠️ No se pudo obtener el rol porque el token es inválido o no existe.");
      return null;
    }
    console.log("✅ Rol obtenido:", decodedToken.role);
    return decodedToken.role;
  }
  
  // 👤 Obtener el nombre de usuario (username)
  showUser(): string | null {
    const decodedToken = this.decodeToken();
    return decodedToken?.sub || null;
  }

  // 🔄 Obtener el usuario actual guardado en sessionStorage
  getCurrentUser(): any {
    const user = sessionStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  // 🕵️‍♂️ Método privado para decodificar el token
  private decodeToken(): any {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.warn('⚠️ No hay token disponible en sessionStorage.');
      return null;
    }

    try {
      return this.jwtHelper.decodeToken(token);
    } catch (error) {
      console.error('❌ Error al decodificar el token:', error);
      return null;
    }
  }
}

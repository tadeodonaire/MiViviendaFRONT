import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Simulaciones } from '../models/simulaciones';
import { SimulacionRequest } from '../models/simulacion-request';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class SimulacionesService {
  private url = `${base_url}/simulaciones`;

  constructor(private http: HttpClient) { }

  crear(req: SimulacionRequest) {
    return this.http.post<Simulaciones>(`${this.url}/crear`, req);
  }
}
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Simulaciones } from '../models/simulaciones';
import { SimulacionRequest } from '../models/simulacion-request';
import { SimulacionConCronogramaResponse } from '../models/simulacion-respuesta';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class SimulacionesService {
  private url = `${base_url}/simulaciones`;

  constructor(private http: HttpClient) { }

  crear(req: SimulacionRequest): Observable<SimulacionConCronogramaResponse> {
    return this.http.post<SimulacionConCronogramaResponse>(`${this.url}/crear`, req);
  }

  // simulaciones.service.ts
  // Traer (recalcular en BE) una hoja por ID para “Simulaciones anteriores”
  getHoja(id: number): Observable<SimulacionConCronogramaResponse> {
    // OJO: sin repetir 'simulaciones'
    return this.http.get<SimulacionConCronogramaResponse>(`${this.url}/${id}/hoja`);
  }
  

}
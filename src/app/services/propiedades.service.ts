import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Propiedades } from '../models/propiedades';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class PropiedadesService {
  private url = `${base_url}/propiedades`;
  private listaCambio = new Subject<Propiedades[]>();
  constructor(private http: HttpClient) {}
  list() {
    return this.http.get<Propiedades[]>(this.url);
  }
  insert(p: Propiedades) {
    return this.http.post(this.url, p);
  }
  setList(listaNueva: Propiedades[]) {
    this.listaCambio.next(listaNueva);
  }
  getList() {
    return this.listaCambio.asObservable();
  }
  listId(id: number) {
    return this.http.get<Propiedades>(`${this.url}/${id}`);
  }
  update(p: Propiedades) {
    return this.http.put(this.url, p);
  }
  deleteR(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}

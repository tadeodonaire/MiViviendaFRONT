import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Clientes } from '../models/clientes';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/internal/Subject';

const base_url = environment.base;


@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private url = `${base_url}/clientes`;
  private listaCambio = new Subject<Clientes[]>();
  constructor(private http: HttpClient) {}
  list() {
    return this.http.get<Clientes[]>(this.url);
  }
  insert(c: Clientes) {
    return this.http.post(this.url, c);
  }
  setList(listaNueva: Clientes[]) {
    this.listaCambio.next(listaNueva);
  }
  getList() {
    return this.listaCambio.asObservable();
  }
  listId(id: number) {
    return this.http.get<Clientes>(`${this.url}/${id}`);
  }
  update(c: Clientes) {
    return this.http.put(this.url, c);
  }
  deleteR(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Usuarios } from '../models/usuarios';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private url = `${base_url}/usuarios`;
  private listaCambio = new Subject<Usuarios[]>();
  constructor(private http: HttpClient) {}
  list() {
    return this.http.get<Usuarios[]>(this.url);
  }
  insert(u: Usuarios) {
    return this.http.post(this.url, u);
  }
  setList(listaNueva: Usuarios[]) {
    this.listaCambio.next(listaNueva);
  }
  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Usuarios>(`${this.url}/${id}`);
  }
  update(u: Usuarios) {
    return this.http.put(this.url, u);
  }
  deleteR(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}

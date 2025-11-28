import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Subject } from 'rxjs';
import { Roles } from '../models/roles';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private url = `${base_url}/roles`;
  private listaCambio = new Subject<Roles[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Roles[]>(this.url);
  }

  insert(r: Roles) {
    return this.http.post(this.url, r);
  }

  setList(listaNueva: Roles[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }
  
  listId(id: number) {
    return this.http.get<Roles>(`${this.url}/${id}`);
  }

  update(rol: Roles) {
    return this.http.put(this.url, rol);
  }

  deleteR(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
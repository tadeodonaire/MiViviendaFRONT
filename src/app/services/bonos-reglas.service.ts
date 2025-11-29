import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { BonosReglas } from '../models/bonos-reglas';
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
}) export class BonosReglasService {
  private url = `${base_url}/bonos_reglas`;
  private listaCambio = new Subject<BonosReglas[]>();
  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<BonosReglas[]>(this.url);
  }
  insert(c: BonosReglas) {
    return this.http.post(this.url, c);
  }
  setList(listaNueva: BonosReglas[]) {
    this.listaCambio.next(listaNueva);
  }
  getList() {
    return this.listaCambio.asObservable();
  }
  listId(id: number) {
    return this.http.get<BonosReglas>(`${this.url}/${id}`);
  }
  update(c: BonosReglas) {
    return this.http.put(this.url, c);
  }
  deleteR(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
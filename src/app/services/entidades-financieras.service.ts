import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { map, Subject } from 'rxjs';
import { EntidadesFinancieras } from '../models/entidades-financieras';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class EntidadesFinancierasService {

  private url = `${base_url}/entidades_financieras`;
  private listaCambio = new Subject<EntidadesFinancieras[]>();

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<any[]>(this.url).pipe(
      map(rows => rows.map(r => ({
        ...r,
        // adapta nombres del backend a tu modelo
        TEAmin: r.TEAmin ?? r.teamin ?? 0,
        TEAmax: r.TEAmax ?? r.teamax ?? 0,
      }) as EntidadesFinancieras))
    );
  }

  insert(r: EntidadesFinancieras) {
    return this.http.post(this.url, r);
  }

  setList(listaNueva: EntidadesFinancieras[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<EntidadesFinancieras>(`${this.url}/${id}`);
  }

  update(rol: EntidadesFinancieras) {
    return this.http.put(this.url, rol);
  }

  deleteR(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
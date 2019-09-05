import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Clases
import { Matricula } from '../clases/index';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {

  private APIUrl = 'http://localhost:3000/api/Matriculas';

  constructor( private http: HttpClient ) { }

  // MATRICULAMOS A UN ALUMNO EN UN GRUPO NUEVO
  POST_Matricula(matricula: Matricula): Observable<Matricula> {
    return this.http.post<Matricula>(this.APIUrl, matricula);
  }

  // OBTENEMOS LA MATRICULA DE UN ALUMNO EN UN GRUPO NUEVO
  GET_MatriculasDelGrupo(grupoId: number): Observable<Matricula[]> {
    return this.http.get<Matricula[]>(this.APIUrl + '?filter[where][grupoId]=' + grupoId);
  }

  // OBTENEMOS LA MATRICULA CONCRETA DE UN ALUMNO EN UN GRUPO
  GET_MatriculaAlumno(alumnoId: number, grupoId: number): Observable<Matricula> {
    return this.http.get<Matricula>(this.APIUrl + '?filter[where][grupoId]=' + grupoId + '&filter[where][alumnoId]=' + alumnoId);
  }

  // BORRAMOS LA MATRICULA DEL ALUMNO EN EL GRUPO
  DELETE_Matricula(matriculaId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrl + '/' + matriculaId);
  }

}

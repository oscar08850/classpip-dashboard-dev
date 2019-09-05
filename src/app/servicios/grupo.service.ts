import { Injectable } from '@angular/core';
import { Grupo, Alumno, AsignacionEquipo } from '../clases/index';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  private APIUrl = 'http://localhost:3000/api/Grupos';
  private APIUrlProfesor = 'http://localhost:3000/api/Profesores';

  grupoSeleccionado: any = [];
  grupoId: number;
  listaAlumnos: any = [];


  // asginacionEquipo: any = [];

  constructor( private http: HttpClient ) { }


  // PERMITE CREAR UN GRUPO AL PROFESOR. DEVOLVEMOS UN OBSERVABLE GRUPO PARA SABER EL IDENTIFICADOR DEL GRUPO QUE ACABAMOS
  // DE CREAR POR SI DECIDIMOS TIRAR UN PASO HACIA ATRÁS EN EL MOMENTO DE CREAR Y MODIFICAR EL NOMBRE O LA DESCRIPCIÓN
  POST_Grupo(grupo: Grupo, profesorId: number): Observable<Grupo> {
    return this.http.post<Grupo>(this.APIUrlProfesor + '/' + profesorId + '/grupos', grupo);
  }

  // CUANDO EDITAMOS UN GRUPO LE PASAMOS EL NUEVO MODELO DEL GRUPO, EL IDENTIFICADOR DEL PROFESOR Y EL GRUPO EN CONCRETO
  // QUE QUEREMOS EDITAR
  PUT_Grupo(grupo: Grupo, profesorId: number, grupoId: number): Observable<Grupo> {
    return this.http.put<Grupo>(this.APIUrlProfesor + '/' + profesorId + '/grupos/' + grupoId, grupo);
  }

  // EN LOS PARÁMETROS DE ENTRADA INDICAMOS EL GRUPO DETERMINADO (grupoId) QUE QUEREMOS ELIMINAR DE UN PROFESOR DETERMINADO
  // (profesorId)
  DELETE_Grupo(profesorId: number, grupoId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlProfesor + '/' + profesorId + '/grupos/' + grupoId);
  }

  // NOS DEVUELVE UN ARRAY CON LOS GRUPOS DEL PROFESOR
  GET_GruposDelProfesor(profesorId: number): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(this.APIUrlProfesor + '/' + profesorId + '/grupos');
  }


  // FUNCIONES PARA ENVIAR Y RECIBIR DATOS ENTRE COMPONENTES

  // ESTA ES LA FUNCION QUE HAY QUE LLAMAR PARA ENVIAR AL PROFESOR QUE HA INICIADO SESIÓN
  EnviarGrupoAlServicio(grupo: any) {
    this.grupoSeleccionado = grupo;
  }

  // ESTA ES LA QUE HAY QUE LLAMAR PARA RECOGER EL PROFESOR EN OTRO COMPONENTE
  RecibirGrupoDelServicio(): any {
    return this.grupoSeleccionado;
  }

  EnviarGrupoIdAlServicio( grupoId: number) {
    this.grupoId = grupoId;
  }

  RecibirGrupoIdDelServicio(): number {
    return this.grupoId;
  }

  EnviarAlumnosGrupoAlServicio(alumnos: any) {
    this.listaAlumnos = alumnos;
  }

  RecibirAlumnosGrupoDelServicio(): any {
    return this.listaAlumnos;
  }

}

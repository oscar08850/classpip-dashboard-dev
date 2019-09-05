import { Injectable } from '@angular/core';
import {Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';


// Clases
import { Equipo, Alumno, AsignacionEquipo } from '../clases/index';

@Injectable({
  providedIn: 'root'
})
export class EquipoService {

  private APIUrl = 'http://localhost:3000/api/Equipos';
  private APIUrlGrupos = 'http://localhost:3000/api/Grupos';
  private APIURLLogosEquipos = 'http://localhost:3000/api/imagenes/LogosEquipos';
  equipo: Equipo;


  constructor( private http: HttpClient ) { }

  // CREAMOS UN NUEVO EQUIPO DENTRO DEL GRUPO
  POST_Equipo(equipo: Equipo, grupoId: number): Observable<Equipo> {
    return this.http.post<Equipo>(this.APIUrlGrupos + '/' + grupoId + '/equipos', equipo);
  }

  // PONEMOS UN LOGO AL EQUIPO
  POST_LogoEquipo(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIURLLogosEquipos + '/upload', formData);
  }

  // SE USA PARA EDITAR UN EQUIPO
  PUT_Equipo(equipo: Equipo, grupoId: number, equipoId: number): Observable<Equipo> {
    return this.http.put<Equipo>(this.APIUrlGrupos + '/' + grupoId + '/equipos/' + equipoId, equipo);
  }

  // OBTENEMOS LOS EQUIPOS DEL GRUPO
  GET_EquiposDelGrupo(grupoId: number): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.APIUrlGrupos + '/' + grupoId + '/equipos');
  }

  // OBTENEMOS EL LOGO DE UN EQUIPO CONCRETO
  GET_LogoEquipo(logoEquipo: string): Observable<any> {
    return this.http.get<any>(this.APIURLLogosEquipos + '/download/' + logoEquipo);
  }

  // ELIMINAMOS UN EQUIPO EN CONCRETO DEL GRUPO
  DELETE_EquipoDelGrupo(equipo: Equipo): Observable<any> {
    return this.http.delete<any>(this.APIUrlGrupos + '/' + equipo.grupoId + '/equipos/' + equipo.id);
  }

  // OBTENEMOS LOS ALUMNOS QUE PERTENECEN A UN EQUIPO
  GET_AlumnosEquipo(equipoId: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.APIUrl + '/' + equipoId + '/alumnos');
  }

  // RECUPERAMOS LAS ASIGNACIONES (COMO LA INSCRIPCIÓN DEL ALUMNO AL EQUIPO) DE UN GRUPO DETERMINADO
  GET_AsignacionesEquipoDelGrupo(grupoId: number): Observable<AsignacionEquipo[]> {
    return this.http.get<AsignacionEquipo[]>(this.APIUrlGrupos + '/' + grupoId + '/asignacionEquipos');
  }

  // ASIGNAR ALUMNOS A UN EQUIPO
  POST_AlumnoEquipo(asignacionEquipos: AsignacionEquipo, grupoId: number): Observable<AsignacionEquipo> {
    return this.http.post<AsignacionEquipo>(this.APIUrlGrupos + '/' + grupoId + '/asignacionEquipos', asignacionEquipos);
  }

  // BUSCA Y ELIMINA A UN ALUMNO DE UN EQUIPO (BORRA ASIGNACIONEQUIPO)
  DELETE_AlumnoEquipo(asignacionEquipo: AsignacionEquipo): Observable<any> {
    return this.http.delete<any>(this.APIUrlGrupos + '/' + asignacionEquipo.grupoId + '/asignacionEquipos/'
    + asignacionEquipo.id);
  }

  // DEVUELVE LA ASIGNACIÓN CONCRETA DE UN ALUMNO EN UN EQUIPO
  GET_AsignacionEquipoAlumno(alumnoId: number, equipoId: number, grupoId: number): Observable<AsignacionEquipo> {
    return this.http.get<AsignacionEquipo>(this.APIUrlGrupos + '/' + grupoId + '/asignacionEquipos?filter[where][equipoId]=' + equipoId +
    '&filter[where][alumnoId]=' + alumnoId);
  }

  // EDITA UNA ASIGNACIÓN DE UN ALUMNO EN UN EQUIPO. SE PUEDE UTILIZAR PARA MOVER ALUMNOS DE EQUIPO.
  PUT_AsignacionEquipoAlumno(asignacionEquipo: AsignacionEquipo, grupoId: number, asignacionEquipoId: number):
  Observable<AsignacionEquipo> {
    return this.http.put<AsignacionEquipo>(this.APIUrlGrupos + '/' + grupoId + '/asignacionEquipos/' +
    asignacionEquipoId, asignacionEquipo);
  }

  // DEVUELVE UN ARRAY CON LAS ASIGNACIONES DE UN EQUIPO CONCRETO
  GET_AsignacionesDelEquipo(equipo: Equipo): Observable<AsignacionEquipo[]> {
    console.log('Entro a buscar' );
    return this.http.get<AsignacionEquipo[]>(this.APIUrlGrupos + '/' + equipo.grupoId + '/asignacionEquipos?filter[where][equipoId]='
     + equipo.id);
  }




  // FUNCIONES PARA ENVIAR Y RECIBIR DATOS ENTRE COMPONENTES

  EnviarEquipoAlServicio(equipo: any) {
    this.equipo = equipo;
  }

  RecibirEquipoDelServicio(): any {
    return this.equipo;
  }
}

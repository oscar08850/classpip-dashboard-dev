import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Juego, AlumnoJuegoDeColeccion, AsignacionPuntosJuego, Nivel, EquipoJuegoDeColeccion, Alumno, Equipo, Punto,
         Album, AlbumEquipo, HistorialPuntosEquipo, TablaEquipoJuegoDePuntos, Cromo } from '../clases/index';

@Injectable({
  providedIn: 'root'
})
export class JuegoService {

  constructor( private http: HttpClient ) { }

  private APIUrlGrupos = 'http://localhost:3000/api/Grupos';


  juegoSeleccionado: Juego;

  alumnosDelJuego: Alumno[];
  equiposDelJuego: Equipo[];


  inscripcionAlumno: AlumnoJuegoDeColeccion;
  inscripcionEquipo: EquipoJuegoDeColeccion;


  // OBTENEMOS LOS JUEGO DE COLECCIÓN DEL GRUPO
  GET_JuegoDeColeccion(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeColeccions');
  }

  // OBTENEMOS LOS JUEGO DE COMPETICIÓN DEL GRUPO
  GET_JuegoDeCompeticion(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeCompeticions');
  }

  // CREAMOS UN NUEVO JUEGO DE COLECCIÓN EN EL GRUPO
  POST_JuegoDeColeccion(juego: Juego, grupoId: number): Observable<Juego> {
    return this.http.post<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeColeccions', juego);
  }

  // CREAMOS UN NUEVO JUEGO DE COMPETICIÓN EN EL GRUPO
  POST_JuegoDeCompeticion(juego: Juego, grupoId: number): Observable<Juego> {
    return this.http.post<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeCompeticions', juego);
  }

  // EDITAMOS UN JUEGO DE COLECCIÓN
  PUT_JuegoDeColeccion(juego: Juego, grupoId: number, juegoId: number): Observable<Juego> {
    return this.http.put<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeColeccions/' + juegoId, juego);
  }





  // FUNCIONES PARA ENVIAR Y RECIBIR DATOS ENTRE COMPONENTES

  // ESTA ES LA FUNCION QUE HAY QUE LLAMAR PARA ENVIAR EL JUEGO SELECIONADO
  EnviarJuegoAlServicio(juego: any) {
    this.juegoSeleccionado = juego;
  }

  // ESTA ES LA QUE HAY QUE LLAMAR PARA RECOGER EL JUEGO EN OTRO COMPONENTE
  RecibirJuegoDelServicio(): any {
    return this.juegoSeleccionado;
  }

  EnviarAlumnoJuegoAlServicio(alumnos: any) {
    this.alumnosDelJuego = alumnos;
  }

  RecibirAlumnoJuegoDelServicio() {
    return this.alumnosDelJuego;
  }

  EnviarEquipoJuegoAlServicio(equipos: any) {
    this.equiposDelJuego = equipos;
  }

  RecibirEquipoJuegoDelServicio() {
    return this.equiposDelJuego;
  }

  EnviarInscripcionAlServicio(inscripcionAlumno: any) {
    this.inscripcionAlumno = inscripcionAlumno;
  }

  RecibirInscripcionAlumnoDelServicio() {
    return this.inscripcionAlumno;
  }

  EnviarInscripcionEquipoAlServicio(inscripcionEquipo: any) {
    this.inscripcionEquipo = inscripcionEquipo;
  }

  RecibirInscripcionEquipoDelServicio() {
    return this.inscripcionEquipo;
  }

}

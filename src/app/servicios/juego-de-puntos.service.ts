import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Juego, AlumnoJuegoDePuntos, AsignacionPuntosJuego, Nivel, EquipoJuegoDePuntos, Alumno, Equipo, Punto,
         TablaAlumnoJuegoDePuntos, HistorialPuntosAlumno, HistorialPuntosEquipo, TablaEquipoJuegoDePuntos } from '../clases/index';

@Injectable({
  providedIn: 'root'
})
export class JuegoDePuntosService {

  constructor( private http: HttpClient ) { }

  private APIUrlGrupos = 'http://localhost:3000/api/Grupos';
  private APIURLPuntosJuego = 'http://localhost:3000/api/AsignacionPuntosJuego';
  private APIUrlAlumnoJuego = 'http://localhost:3000/api/AlumnoJuegosDePuntos';
  private APIUrlEquipoJuego = 'http://localhost:3000/api/EquiposJuegosDePuntos';
  private APIRURLJuegoDePuntos = 'http://localhost:3000/api/JuegosDePuntos';
  private APIURLImagenNivel = 'http://localhost:3000/api/imagenes/imagenNivel';
  private APIURLAlumnoJuegoDePuntos = 'http://localhost:3000/api/AlumnoJuegosDePuntos';
  private APIURLHistorialPuntosAlumno = 'http://localhost:3000/api/HistorialesPuntosAlumno';

  private APIURLEquiposJuegoDePuntos = 'http://localhost:3000/api/EquiposJuegosDePuntos';
  private APIURLHistorialPuntosEquipo = 'http://localhost:3000/api/HistorialesPuntosEquipo';

  rankingJuegoDePunto: TablaAlumnoJuegoDePuntos[];
  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDePuntos[];

  rankingEquipoJuegoDePuntos: TablaEquipoJuegoDePuntos[];
  listaEquiposOrdenadaPorPuntos: EquipoJuegoDePuntos[];

  inscripcionAlumnoJuego: AlumnoJuegoDePuntos;
  inscripcionEquipoJuego: EquipoJuegoDePuntos;


  puntos: Punto[];
  niveles: Nivel[];

  posicion: number;


  // DEVUELVE LOS JUEGOS DE PUNTOS DEL GRUPO QUE PASAMOS COMO PARÁMETRO
  GET_JuegoDePuntos(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/juegoDePuntos');
  }

  // CREA UN NUEVO JUEGO DE PUNTOS
  POST_JuegoDePuntos(juego: Juego, grupoId: number): Observable<Juego> {
    return this.http.post<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDePuntos', juego);
  }

  // SELECCIONAMOS LOS PUNTOS QUE FORMARÁN PARTE DEL JUEGO
  POST_AsignacionPuntoJuego(asignacionPuntoJuego: AsignacionPuntosJuego) {
    return this.http.post<AsignacionPuntosJuego>(this.APIURLPuntosJuego, asignacionPuntoJuego);
  }

  // INSCRIBIMOS A LOS ALUMNOS AL JUEGO DE PUNTOS
  POST_AlumnoJuegoDePuntos(alumnoJuegoDePuntos: AlumnoJuegoDePuntos) {
    return this.http.post<AlumnoJuegoDePuntos>(this.APIUrlAlumnoJuego, alumnoJuegoDePuntos);
  }

  // INSCRIBIMOS A LOS EQUIPOS AL JUEGO DE PUNTOS
  POST_EquipoJuegoDePuntos(equipoJuegoDePuntos: EquipoJuegoDePuntos) {
    return this.http.post<EquipoJuegoDePuntos>(this.APIUrlEquipoJuego, equipoJuegoDePuntos);
  }

  // CREAMOS NIVELES PARA UN JUEGO DE PUNTOS DETERMINADO
  POST_Nivel(nivel: Nivel, juegoDePuntosId: number) {
    return this.http.post<Nivel>(this.APIRURLJuegoDePuntos + '/' + juegoDePuntosId + '/nivels', nivel);
  }

  // ASIGNAMOS FOTOS A UN NIVEL (ES OPCIONAL)
  POST_ImagenNivel(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIURLImagenNivel + '/upload', formData);
  }

  // OBTENEMOS LOS ALUMNOS QUE FORMAN PARTE DEL JUEGO DE PUNTOS
  GET_AlumnosJuegoDePuntos(juegoDePuntosId: number): Observable<Alumno[]> {
    console.log('Voy a por los alumnos');
    return this.http.get<Alumno[]>(this.APIRURLJuegoDePuntos + '/' + juegoDePuntosId + '/alumnos');
  }

  // OBTENEMOS LOS EQUIPOS QUE FORMAN PARTE DEL JUEGO DE PUNTOS
  GET_EquiposJuegoDePuntos(juegoDePuntosId: number): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.APIRURLJuegoDePuntos + '/' + juegoDePuntosId + '/equipos');
  }

  // OBTENEMOS LOS PUNTOS QUE FORMAN PARTE DEL JUEGO DE PUNTOS
  GET_PuntosJuegoDePuntos(juegoDePuntosId: number): Observable<Punto[]> {
    return this.http.get<Punto[]>(this.APIRURLJuegoDePuntos + '/' + juegoDePuntosId + '/puntos');
  }

  // OBTENEMOS LOS NIVELES QUE FORMAN PARTE DEL JUEGO DE PUNTOS
  GET_NivelesJuegoDePuntos(juegoDePuntosId: number): Observable<Nivel[]> {
    return this.http.get<Nivel[]>(this.APIRURLJuegoDePuntos + '/' + juegoDePuntosId + '/nivels');
  }

  // OBTENEMOS LA INSCRIPCIÓN ESPECÍFICA DE UN ALUMNO CONCRETO EN UN JUEGO DE PUNTOS CONCRETO.
  GET_InscripcionAlumnoJuegoDePuntos(alumnoId: number, juegoDePuntosId: number): Observable<AlumnoJuegoDePuntos> {
    return this.http.get<AlumnoJuegoDePuntos>(this.APIURLAlumnoJuegoDePuntos + '?filter[where][alumnoId]=' + alumnoId
    + '&filter[where][juegoDePuntosId]=' + juegoDePuntosId);
  }

  // NOS DEVUELVE LAS INCRIPCIONES DE TODOS LOS ALUMNOS DE UN JUEGO DE PUNTOS
  GET_InscripcionesAlumnoJuegoDePuntos(juegoDePuntosId: number): Observable<AlumnoJuegoDePuntos[]> {
    return this.http.get<AlumnoJuegoDePuntos[]>(this.APIURLAlumnoJuegoDePuntos + '?filter[where][juegoDePuntosId]=' + juegoDePuntosId);
  }

  // NOS DEVUELVE LAS INCRIPCIONES DE TODOS LOS EQUIPOS DE UN JUEGO DE PUNTOS
  GET_InscripcionesEquipoJuegoDePuntos(juegoDePuntosId: number): Observable<EquipoJuegoDePuntos[]> {
    return this.http.get<EquipoJuegoDePuntos[]>(this.APIURLEquiposJuegoDePuntos + '?filter[where][juegoDePuntosId]=' + juegoDePuntosId);
  }

  // EDITAMOS LA INSCRIPCIÓN DEL ALUMNO EN EL JUEGO DE PUNTOS PARA PONER PUNTOS, YA QUE ÉSTA INCRIPCIÓN TAMBIÉN CONTIENE LOS PUNTOS TOTALES
  PUT_PuntosJuegoDePuntos( alumnoJuegoDePuntos: AlumnoJuegoDePuntos, alumnoJuegoDePuntosId: number): Observable<AlumnoJuegoDePuntos> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<AlumnoJuegoDePuntos>(this.APIURLAlumnoJuegoDePuntos + '/' + alumnoJuegoDePuntosId, alumnoJuegoDePuntos);
  }

  // EDITAMOS LA INSCRIPCIÓN DEL EQUIPO EN EL JUEGO DE PUNTOS PARA PONER PUNTOS, YA QUE ÉSTA INCRIPCIÓN TAMBIÉN CONTIENE LOS PUNTOS TOTALES
  // tslint:disable-next-line:max-line-length
  PUT_PuntosEquiposJuegoDePuntos( equipoJuegoDePuntos: EquipoJuegoDePuntos, equipoJuegoDePuntosId: number): Observable<EquipoJuegoDePuntos> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<EquipoJuegoDePuntos>(this.APIURLEquiposJuegoDePuntos + '/' + equipoJuegoDePuntosId, equipoJuegoDePuntos);
  }

  // REGISTRAMOS LA FECHA EN QUE DAMOS UN PUNTO A UN ALUMNO, SU VALOR, EL TIPO DE PUNTO
  POST_HistorialPuntosAlumno(historial: HistorialPuntosAlumno): Observable<HistorialPuntosAlumno> {
    return this.http.post<HistorialPuntosAlumno>(this. APIURLHistorialPuntosAlumno, historial);
  }

  // REGISTRAMOS LA FECHA EN QUE DAMOS UN PUNTO A UN EQUIPO, SU VALOR, EL TIPO DE PUNTO
  POST_HistorialPuntosEquipo(historial: HistorialPuntosEquipo): Observable<HistorialPuntosEquipo> {
    return this.http.post<HistorialPuntosEquipo>(this. APIURLHistorialPuntosEquipo, historial);
  }

  // OBTENEMOS EL HISTORIAL DE UN ALUMNO POR TIPO DE PUNTO
  GET_HistorialDeUnPunto(alumnoJuegoDePuntosId: number, puntoId: number): Observable<HistorialPuntosAlumno[]> {
    return this.http.get<HistorialPuntosAlumno[]>(this.APIURLHistorialPuntosAlumno + '?filter[where][alumnoJuegoDePuntosId]='
     + alumnoJuegoDePuntosId + '&filter[where][puntoId]=' + puntoId);
  }

  // OBTENEMOS EL HISTORIAL DE UN EQUIPO POR TIPO DE PUNTO
  GET_HistorialDeUnPuntoEquipo(equipoJuegoDePuntosId: number, puntoId: number): Observable<HistorialPuntosEquipo[]> {
    return this.http.get<HistorialPuntosEquipo[]>(this.APIURLHistorialPuntosEquipo + '?filter[where][equipoJuegoDePuntosId]='
     + equipoJuegoDePuntosId + '&filter[where][puntoId]=' + puntoId);
  }

  // OBTENEMOS EL HISTORIAL TOTAL DE PUNTOS DEL ALUMNO
  GET_HistorialPuntosAlumno(alumnoJuegoDePuntosId: number): Observable<HistorialPuntosAlumno[]> {
    return this.http.get<HistorialPuntosAlumno[]>(this.APIURLHistorialPuntosAlumno + '?filter[where][alumnoJuegoDePuntosId]='
     + alumnoJuegoDePuntosId);
  }

  // ELIMINAMOS UNA ASIGNACIÓN DE PUNTO A UN ALUMNO
  DELETE_PuntosAlumno(historialPuntosAlumnoId: number): Observable<HistorialPuntosAlumno[]> {
    return this.http.delete<HistorialPuntosAlumno[]>(this.APIURLHistorialPuntosAlumno + '/' + historialPuntosAlumnoId);
  }

  // OBTENEMOS EL HISTORIAL TOTAL DE PUNTOS DEL EQUIPO
  GET_HistorialPuntosEquipo(equipoJuegoDePuntosId: number): Observable<HistorialPuntosEquipo[]> {
    return this.http.get<HistorialPuntosEquipo[]>(this.APIURLHistorialPuntosEquipo + '?filter[where][equipoJuegoDePuntosId]='
     + equipoJuegoDePuntosId);
  }

  // ELIMINAMOS UNA ASIGNACIÓN DE PUNTO A UN EQUIPO
  DELETE_PuntosEquipo(historialPuntosEquipoId: number): Observable<HistorialPuntosEquipo[]> {
    return this.http.delete<HistorialPuntosEquipo[]>(this.APIURLHistorialPuntosEquipo + '/' + historialPuntosEquipoId);
  }

  // CAMBIA EL ESTADO DEL JUEGO DE COLECCIÓN DE ACTIVO A INACTIVO O VICEVERSA
  PUT_EstadoJuegoDePuntos(juegoDePuntos: Juego, juegoDePuntosId: number, grupoId: number): Observable<Juego> {
    return this.http.put<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDePuntos/' + juegoDePuntosId, juegoDePuntos);
  }

  // ELIMINA EL JUEGO DE COLECCIÓN QUE PASAMOS COMO PARÁMETRO
  DELETE_JuegoDePuntos(juegoDePuntosId: number, grupoId: number): Observable<Juego> {
    return this.http.delete<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDePuntos/' + juegoDePuntosId);
  }




  // FUNCIONES PARA ENVIAR Y RECIBIR DATOS ENTRE COMPONENTES

  EnviarListaOrdenadaJuegoPuntosAlServicio(lista: any) {
    this.listaAlumnosOrdenadaPorPuntos = lista;
  }

  RecibirListaOrdenadaJuegoPuntosDelServicio(): any {
    return this.listaAlumnosOrdenadaPorPuntos;
  }

  EnviarRankingJuegoPuntosAlServicio(ranking: any) {
    this.rankingJuegoDePunto = ranking;
  }

  RecibirRankingJuegoPuntosDelServicio(): any {
    return this.rankingJuegoDePunto;
  }

  EnviarListaEquiposOrdenadaJuegoPuntosAlServicio(lista: any) {
    this.listaEquiposOrdenadaPorPuntos = lista;
  }

  RecibirListaEquiposOrdenadaJuegoPuntosDelServicio(): any {
    return this.listaEquiposOrdenadaPorPuntos;
  }

  EnviarRankingEquipoJuegoPuntosAlServicio(ranking: any) {
    this.rankingEquipoJuegoDePuntos = ranking;
  }

  RecibirRankingEquipoJuegoPuntosDelServicio(): any {
    return this.rankingEquipoJuegoDePuntos;
  }

  EnviarPuntosAlServicio(puntos: any) {
    this.puntos = puntos;
  }

  RecibirPuntosDelServicio(): any {
    return this.puntos;
  }

  EnviarNivelesAlServicio(niveles: any) {
    this.niveles = niveles;
  }

  RecibirNivelesDelServicio(): any {
    return this.niveles;
  }

  EnviarPosicionAlServicio(posicion: any) {
    this.posicion = posicion;
  }

  RecibirPosicionDelServicio(): any {
    return this.posicion;
  }

  EnviarInscripcionAlServicio(alumnoJuegoPuntos: any) {
    this.inscripcionAlumnoJuego = alumnoJuegoPuntos;
  }

  RecibirInscripcionDelServicio(): any {
    return this.inscripcionAlumnoJuego;
  }

  EnviarInscripcionEquipoAlServicio(inscripcionEquipoJuego: any) {
    this.inscripcionEquipoJuego = inscripcionEquipoJuego;
  }

  RecibirInscripcionEquipoDelServicio(): any {
    return this.inscripcionEquipoJuego;
  }
}

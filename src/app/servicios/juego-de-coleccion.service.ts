import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Juego, AlumnoJuegoDeColeccion, EquipoJuegoDeColeccion, Alumno, Equipo,
         Album, AlbumEquipo, Cromo } from '../clases/index';

@Injectable({
  providedIn: 'root'
})
export class JuegoDeColeccionService {

  constructor( private http: HttpClient ) { }

  private APIUrlGrupos = 'http://localhost:3000/api/Grupos';

  private APIURLAlumnoJuegoDeColeccion = 'http://localhost:3000/api/AlumnosJuegoDeColeccion';
  private APIURLEquipoJuegoDeColeccion = 'http://localhost:3000/api/EquiposJuegoDeColeccion';

  private APIRURLJuegoDeColeccion = 'http://localhost:3000/api/JuegosDeColeccion';

  private APIRURLAlbum = 'http://localhost:3000/api/Albumes';
  private APIRURLAlbumEquipo = 'http://localhost:3000/api/albumsEquipo';



  // INSCRIBIMOS AL ALUMNO EN EL JUEGO DE COLECCIÓN
  POST_AlumnoJuegoDeColeccion(alumnoJuegoDeColeccion: AlumnoJuegoDeColeccion) {
    return this.http.post<AlumnoJuegoDeColeccion>(this.APIURLAlumnoJuegoDeColeccion, alumnoJuegoDeColeccion);
  }

  // INCRIBIMOS AL EQUIPO EN EL JUEGO DE COLECCIÓN
  POST_EquipoJuegoDeColeccion(equipoJuegoDeColeccion: EquipoJuegoDeColeccion) {
    return this.http.post<EquipoJuegoDeColeccion>(this.APIURLEquipoJuegoDeColeccion, equipoJuegoDeColeccion);
  }

  // DEVUELVE LOS ALUMNOS QUE FORMAN PARTE DE UN JUEGO DE COLECCIÓN DETERMINADO
  GET_AlumnosJuegoDeColeccion(juegoDeColeccionId: number): Observable<Alumno[]> {
    console.log('Voy a por los alumnos');
    return this.http.get<Alumno[]>(this.APIRURLJuegoDeColeccion + '/' + juegoDeColeccionId + '/alumnos');
  }

  // DEVUELVE LOS EQUIPOS QUE FORMAN PARTE DE UN JUEGO DE COLECCIÓN DETERMINADO
  GET_EquiposJuegoDeColeccion(juegoDeColeccionId: number): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.APIRURLJuegoDeColeccion + '/' + juegoDeColeccionId + '/equipos');
  }

  // DEVUELVE UN ARRAY CON LAS INCRIPCIONES DE LOS ALUMNOS A UN JUEGO DE COLECCIÓN DETERMINADO
  GET_InscripcionesAlumnoJuegoDeColeccion(juegoDeColeccionId: number): Observable<AlumnoJuegoDeColeccion[]> {
    return this.http.get<AlumnoJuegoDeColeccion[]>(this.APIURLAlumnoJuegoDeColeccion + '?filter[where][juegoDeColeccionId]='
    + juegoDeColeccionId);
  }

  // DEVUELVE UN ARRAY CON LAS INCRIPCIONES DE LOS EQUIPOS A UN JUEGO DE COLECCIÓN DETERMINADO
  GET_InscripcionesEquipoJuegoDeColeccion(juegoDeColeccionId: number): Observable<EquipoJuegoDeColeccion[]> {
    return this.http.get<EquipoJuegoDeColeccion[]>(this.APIURLEquipoJuegoDeColeccion + '?filter[where][juegoDeColeccionId]='
    + juegoDeColeccionId);
  }

  // ASIGNAMOS UN NUEVO CROMO PARA EL ÁLBUM DEL ALUMNO
  POST_AsignarCromoAlumno(album: Album) {
    return this.http.post<Album>(this.APIRURLAlbum, album);
  }

  // ASIGNAMOS UN NUEVO CROMO PARA EL ÁLBUM DEL EQUIPO
  POST_AsignarCromoEquipo(album: AlbumEquipo) {
    return this.http.post<AlbumEquipo>(this.APIRURLAlbumEquipo, album);
  }

  // NOS DEVUELVE LOS CROMOS QUE TIENE UN ALUMNO CONCRETO EN UN JUEGO DE COLECCIÓN CONCRETO, YA QUE EL ALUMNOJUEGODECOLECCIÓN RELACIONA
  // EL ID DEL ALUMNO Y EL ID DEL JUEGO DE COLECCIÓN
  GET_CromosAlumno(alumnoJuegoDeColeccionId: number): Observable<Cromo[]> {
    return this.http.get<Cromo[]>(this.APIURLAlumnoJuegoDeColeccion + '/' + alumnoJuegoDeColeccionId + '/cromos');
  }

  // NOS DEVUELVE LOS CROMOS QUE TIENE UN EQUIPO CONCRETO EN UN JUEGO DE COLECCIÓN CONCRETO
  GET_CromosEquipo(equipoJuegoDeColeccionId: number): Observable<Cromo[]> {
    return this.http.get<Cromo[]>(this.APIURLEquipoJuegoDeColeccion + '/' + equipoJuegoDeColeccionId + '/cromos');
  }

  // CAMBIA EL ESTADO DEL JUEGO DE COLECCIÓN DE ACTIVO A INACTIVO O VICEVERSA
  PUT_EstadoJuegoDeColeccion(juegoDeColeccion: Juego, juegoDeColeccionId: number, grupoId: number): Observable<Juego> {
    return this.http.put<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeColeccions/' + juegoDeColeccionId, juegoDeColeccion);
  }

  // ELIMINA EL JUEGO DE COLECCIÓN QUE PASAMOS COMO PARÁMETRO
  DELETE_JuegoDeColeccion(juegoDeColeccionId: number, grupoId: number): Observable<Juego> {
    return this.http.delete<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeColeccions/' + juegoDeColeccionId);
  }
}

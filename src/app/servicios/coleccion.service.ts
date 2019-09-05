import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// CLASES
import { Coleccion, Cromo } from '../clases/index';
import { core } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class ColeccionService {

  private APIUrl = 'http://localhost:3000/api/Colecciones';
  private APIUrlProfesor = 'http://localhost:3000/api/Profesores';
  private APIURLImagenColeccion = 'http://localhost:3000/api/imagenes/ImagenColeccion';
  private APIURLImagenCromo = 'http://localhost:3000/api/imagenes/ImagenCromo';
  private APIRURLColecciones = 'http://localhost:3000/api/Colecciones';

  coleccion: Coleccion;
  cromo: Cromo;
  cromosColeccion: any = [];
  cromosAlumno: any = [];

  constructor(private http: HttpClient ) { }

  // HACE UN POST DE UNA NUEVA COLECCIÓN AL PROFESOR
  POST_Coleccion(coleccion: Coleccion, profesorId: number): Observable<Coleccion> {
    return this.http.post<Coleccion>(this.APIUrlProfesor + '/' + profesorId + '/coleccions', coleccion);
  }

  // PONE UNA IMÁGEN A LA COLECCIÓN
  POST_ImagenColeccion(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIURLImagenColeccion + '/upload', formData);
  }

  // SE USA PARA EDITAR LA COLECCIÓN DEL PROFESOR. AMBOS IDENTIFICADORES LOS PASAMOS COMO PARÁMETRO
  PUT_Coleccion(coleccion: Coleccion, profesorId: number, coleccionId: number): Observable<Coleccion> {
    return this.http.put<Coleccion>(this.APIUrlProfesor + '/' + profesorId + '/coleccions/' + coleccionId, coleccion);
  }

  // ELIMINAMOS LA COLECCIÓN CUYO IDENTIFICADOR PASAMOS COMO PARÁMETRO
  DELETE_Coleccion(coleccionId: number, profesorId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlProfesor + '/' + profesorId + '/coleccions/' + coleccionId);
  }

  // OBTENEMOS UN ARRAY CON LAS COLECCIONES DEL PROFESOR
  GET_ColeccionesDelProfesor(profesorId: number): Observable<Coleccion[]> {
    return this.http.get<Coleccion[]>(this.APIUrlProfesor + '/' + profesorId + '/coleccions');
  }

  // OBTENEMOS UN ARRAY DE CROMOS DE LA COLECCIÓN
  GET_CromosColeccion(coleccionId: number): Observable<Cromo[]> {
    return this.http.get<Cromo[]>(this.APIUrl + '/' + coleccionId + '/cromos');
  }

  // AGREGAMOS UN NUEVO CROMO A UNA COLECCIÓN DETERMINADA
  POST_CromoColeccion(cromo: Cromo, coleccionId: number): Observable<Cromo> {
    return this.http.post<Cromo>(this.APIUrl + '/' + coleccionId + '/cromos', cromo);
  }

  // EDITAMOS UN CROMO EN CONCRETO DE UNA COLECCIÓN DETERMINADA
  PUT_CromoColeccion(cromo: Cromo, coleccionId: number, cromoId: number): Observable<Cromo> {
    return this.http.put<Cromo>(this.APIUrl + '/' + coleccionId + '/cromos/' + cromoId, cromo);
  }

  // PONEMOS UNA IMAGEN AL CROMO
  POST_ImagenCromo(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIURLImagenCromo + '/upload', formData);
  }

  // ELIMINAMOS UN CROMO DETERMINADO DE UNA COLECCIÓN CONCRETA
  DELETE_Cromo(cromoId: number, coleccionId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrl + '/' + coleccionId + '/cromos/' + cromoId);
  }

  // OBTENEMOS LA COLECCIÓN CUYO IDENTIFICADOR PASAMOS COMO PARÁMETRO
  GET_Coleccion(coleccionId: number): Observable<Coleccion> {
    return this.http.get<Coleccion>(this.APIRURLColecciones + '/' + coleccionId);
  }




  // FUNCIONES PARA ENVIAR Y RECIBIR DATOS ENTRE COMPONENTES

  EnviarColeccionAlServicio(coleccion: any) {
    this.coleccion = coleccion;
  }

  RecibirColeccionDelServicio(): any {
    console.log('voy a enviar la coleccion');
    console.log(this.coleccion);
    return this.coleccion;
  }

  EnviarCromosColeccionAlServicio(cromos: any) {
    this.cromosColeccion = cromos;
  }

  RecibirCromosColeccionDelServicio(): any {
    return this.cromosColeccion;
  }

  EnviarCromosAlumnoAlServicio(cromos: any) {
    this.cromosAlumno = cromos;
  }

  RecibirCromosAlumnoDelServicio(): any {
    return this.cromosAlumno;
  }

  EnviarCromoAlServicio(cromo: any) {
    this.cromo = cromo;
  }

  RecibirCromoDelServicio(): any {
    return this.cromo;
  }
}

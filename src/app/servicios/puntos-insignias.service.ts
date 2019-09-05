import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable } from 'rxjs';

// clase
import { Punto, Insignia } from '../clases/index';

@Injectable({
  providedIn: 'root'
})
export class PuntosInsigniasService {

  private APIUrlProfesor = 'http://localhost:3000/api/Profesores';

  private APIURLImagenInsignia = 'http://localhost:3000/api/imagenes/ImagenInsignia';
  punto: Punto;
  insignia: Insignia;

  constructor( private http: HttpClient ) { }

  // PARA CREAR UN PUNTO NUEVO DEL PROFESOR
  POST_Punto(punto: Punto, profesorId: number): Observable<Punto> {
    return this.http.post<Punto>(this.APIUrlProfesor + '/' + profesorId + '/puntos', punto);
  }

  // PARA EDITAR UN PUNTO DEL PROFESOR
  PUT_Punto(punto: Punto, profesorId: number, puntoId: number): Observable<Punto> {
    return this.http.put<Punto>(this.APIUrlProfesor + '/' + profesorId + '/puntos/' + puntoId, punto);
  }

  // PARA BORRAR UN PUNTO DEL PROFESOR
  DELETE_Punto(puntoId: number, profesorId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlProfesor + '/' + profesorId + '/puntos/' + puntoId);
  }

  // PARA CREAR UNA INSIGNIA NUEVO DEL PROFESOR
  POST_Insignia(insignia: Insignia, profesorId: number): Observable<Insignia> {
    return this.http.post<Insignia>(this.APIUrlProfesor + '/' + profesorId + '/insignia', insignia);
  }

  // PARA EDITAR UNA INSIGNIA DEL PROFESOR
  PUT_Insignia(insignia: Insignia, profesorId: number, insigniaId: number): Observable<Insignia> {
    return this.http.put<Insignia>(this.APIUrlProfesor + '/' + profesorId + '/insignia/' + insigniaId, insignia);
  }

  // PARA BORRAR UNA INSIGNIA DEL PROFESOR
  DELETE_Insignia(insigniaId: number, profesorId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlProfesor + '/' + profesorId + '/insignia/' + insigniaId);
  }

  // PARA PONER UNA IMAGEN A UNA INSIGNIA
  POST_ImagenInsignia(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIURLImagenInsignia + '/upload', formData);
  }

  // DEVUELVE LOS PUNTOS CREADOS POR EL PROFESOR
  GET_Puntos(profesorId: number): Observable<Punto[]> {
    return this.http.get<Punto[]>(this.APIUrlProfesor + '/' + profesorId + '/puntos');
  }

  // DEVUELVE LAS INSIGNIAS CREADAS POR EL PROFESOR
  GET_Insignias(profesorId: number): Observable<Insignia[]> {
    return this.http.get<Insignia[]>(this.APIUrlProfesor + '/' + profesorId + '/insignia');
  }

  // DEVUELVE LA IMAGEN CORRESPONDIENTE A CADA INSIGNIA
  GET_ImagenInsignia(ImagenInsignia: string): Observable<any> {
    return this.http.get<any>(this.APIURLImagenInsignia + '/download/' + ImagenInsignia);
  }




  // FUNCIONES PARA ENVIAR Y RECIBIR DATOS ENTRE COMPONENTES
  EnviarPuntoAlServicio(punto: any) {
    this.punto = punto;
  }

  RecibirPuntoDelServicio(): any {
    return this.punto;
  }

  EnviarInsigniaAlServicio(insignia: any) {
    this.insignia = insignia;
  }

  RecibirInsigniaDelServicio(): any {
    return this.insignia;
  }
}

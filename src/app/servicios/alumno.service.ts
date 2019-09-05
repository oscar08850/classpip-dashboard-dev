import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// CLASES
import { Alumno } from '../clases/index';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  // URLs que utilizaremos
  private APIUrl = 'http://localhost:3000/api/Alumnos';
  private APIUrlGrupos = 'http://localhost:3000/api/Grupos';
  private APIUrlProfesor = 'http://localhost:3000/api/Profesores';

  private APIURLImagenAlumno = 'http://localhost:3000/api/imagenes/imagenAlumno';


  listaAlumnos: any = [];
  alumno: any;

  constructor(private http: HttpClient) { }

  // ASIGNAR ALUMNOS A UN PROFESOR
  POST_AlumnosAlProfesor(alumno: Alumno, profesorId: number): Observable<Alumno> {
    return this.http.post<Alumno>(this.APIUrlProfesor + '/' + profesorId + '/alumnos', alumno);
  }

  // NOS DEVUELVE LOS ALUMNOS DEL GRUPO CUYO IDENTIFICADOR PASAMOS COMO PARÁMETRO
  GET_AlumnosDelGrupo(grupoId: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.APIUrlGrupos + '/' + grupoId + '/alumnos');
  }

  // BUSCA SI HAY ALGUN ALUMNO EN LA BASE DE DATOS CON ESE NOMBRE Y APELLIDOS
  GET_AlumnoConcreto(alumno: Alumno, ProfesorId: number): Observable<Alumno> {
    console.log('Entro a buscar a ' + alumno.Nombre + ' ' + alumno.PrimerApellido + ' ' + alumno.SegundoApellido );
    return this.http.get<Alumno>(this.APIUrlProfesor + '/' + ProfesorId + '/alumnos?filter[where][Nombre]=' + alumno.Nombre +
    '&filter[where][PrimerApellido]=' + alumno.PrimerApellido + '&filter[where][SegundoApellido]=' + alumno.SegundoApellido);
  }

  // NOS DEVUELVE EL ALUMNO CUYO IDENTIFICADOR PASAMOS COMO PARÁMETRO
  GET_Alumno(alumnoId: number): Observable<Alumno> {
    return this.http.get<Alumno>(this.APIUrl + '/' + alumnoId);
  }

  // PONEMOS UNA FOTO DEL ALUMNO. POR DEFECTO SE LE ASIGNARÁ UNA. SI SE QUIERE CAMBIAR HABRÁ QUE HACER LA FUNCIÓN PUT
  POST_ImagenAlumno(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIURLImagenAlumno + '/upload', formData);
  }



  // SERVICIOS PARA ENVIAR Y RECIBIR DATOS ENTRE COMPONENTES

  EnviarListaAlumnosAlServicio(alumnos: any) {
    this.listaAlumnos = alumnos;
  }

  RecibirListaAlumnosDelServicio(): any {
    return this.listaAlumnos;
  }

  EnviarAlumnoAlServicio(alumno: any) {
    this.alumno = alumno;
  }

  RecibirAlumnoDelServicio() {
    return this.alumno;
  }





}

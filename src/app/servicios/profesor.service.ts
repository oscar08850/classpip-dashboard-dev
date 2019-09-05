import { Injectable } from '@angular/core';
import {Observable, Subject , of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Clases
import { Profesor, Grupo, Alumno } from '../clases/index';
import { TouchSequence } from 'selenium-webdriver';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {

  private APIUrl = 'http://localhost:3000/api/Profesores';
  public profesor: Profesor;
  profesorActual: any = [];
  profesorId: number;

  constructor( private http: HttpClient ) { }


  // FUNCIÓN TEMPORAL DE AUTENTIFICAR (PARA SIMPLIFICAR AHORA)
  AutentificarProfesor(nombre: string, apellido: string): Observable<Profesor> {
    console.log('Entro a mostrar a ' + nombre + ' ' + apellido);
    return this.http.get<Profesor>(this.APIUrl + '?filter[where][Nombre]=' + nombre + '&filter[where][Apellido]=' + apellido);
  }



  // FUNCIONES PARA ENVIAR Y RECIBIR DATOS ENTRE COMPONENTES

  // ESTA ES LA FUNCION QUE HAY QUE LLAMAR PARA ENVIAR AL PROFESOR QUE HA INICIADO SESIÓN
  EnviarProfesorAlServicio(profesor: any) {
    this.profesorActual = profesor;
  }

  // ESTA ES LA QUE HAY QUE LLAMAR PARA RECOGER EL PROFESOR EN OTRO COMPONENTE
  RecibirProfesorDelServicio(): any {
    return this.profesorActual;
  }

  EnviarProfesorIdAlServicio( profesorId: number) {
    this.profesorId = profesorId;
  }

  RecibirProfesorIdDelServicio(): number {
    return this.profesorId;
  }

}

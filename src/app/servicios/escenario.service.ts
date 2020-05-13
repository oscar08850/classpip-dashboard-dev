import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// CLASES

import { core } from '@angular/compiler';
import { Escenario } from '../clases/Escenario';
import { PuntoGeolocalizable } from '../clases/PuntoGeolocalizable';


@Injectable({
  providedIn: 'root'
})
export class EscenarioService {

  private APIUrl = 'http://localhost:3000/api/Escenarios';
  private APIUrlProfesor = 'http://localhost:3000/api/Profesores';
  private APIRURLEscenarios = 'http://localhost:3000/api/Escenarios';

  escenario: Escenario;
  puntogeolocalizable: PuntoGeolocalizable;
  puntosgeolocalizablesEscenario: any = [];
  cromosAlumno: any = [];

  constructor(private http: HttpClient ) { }

  // HACE UN POST DE UNA NUEVA COLECCIÓN AL PROFESOR
  POST_Escenario(escenario: Escenario, profesorId: number): Observable<Escenario> {
    return this.http.post<Escenario>(this.APIUrlProfesor + '/' + profesorId + '/escenarios', escenario);
  }

  // SE USA PARA EDITAR LA COLECCIÓN DEL PROFESOR. AMBOS IDENTIFICADORES LOS PASAMOS COMO PARÁMETRO
  PUT_Escenario(escenario: Escenario, profesorId: number, idescenario: number): Observable<Escenario> {
    return this.http.put<Escenario>(this.APIUrlProfesor + '/' + profesorId + '/escenarios/' + idescenario, escenario);
  }

  // ELIMINAMOS LA COLECCIÓN CUYO IDENTIFICADOR PASAMOS COMO PARÁMETRO
  DELETE_Escenario(idescenario: number, profesorId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlProfesor + '/' + profesorId + '/escenarios/' + idescenario);
  }

  // OBTENEMOS UN ARRAY CON LAS COLECCIONES DEL PROFESOR
  GET_EscenariosDelProfesor(profesorId: number): Observable<Escenario[]> {
    return this.http.get<Escenario[]>(this.APIUrlProfesor + '/' + profesorId + '/escenarios');
  }

  // OBTENEMOS UN ARRAY DE CROMOS DE LA COLECCIÓN
  GET_PuntosGeolocalizablesEscenarioColeccion(idescenario: number): Observable<PuntoGeolocalizable[]> {
    return this.http.get<PuntoGeolocalizable[]>(this.APIUrl + '/' + idescenario + '/puntosgeolocalizables');
  }

  // AGREGAMOS UN NUEVO CROMO A UNA COLECCIÓN DETERMINADA
  POST_PuntoGeolocalizableEscenario(puntogeolocalizable: PuntoGeolocalizable, idescenario: number): Observable<PuntoGeolocalizable> {
    return this.http.post<PuntoGeolocalizable>(this.APIUrl + '/' + idescenario + '/puntosgeolocalizables', puntogeolocalizable);
  }

  // EDITAMOS UN CROMO EN CONCRETO DE UNA COLECCIÓN DETERMINADA
  PUT_PuntoGeolocalizableEscenario(puntogeolocalizable: PuntoGeolocalizable, idescenario: number, idpuntogeolocalizable: number): Observable<PuntoGeolocalizable> {
    return this.http.put<PuntoGeolocalizable>(this.APIUrl + '/' + idescenario + '/puntosgeolocalizables/' + idpuntogeolocalizable, puntogeolocalizable);
  }

  // ELIMINAMOS UN CROMO DETERMINADO DE UNA COLECCIÓN CONCRETA
  DELETE_PuntoGeolocalizable(idpuntogeolocalizable: number, idescenario: number): Observable<any> {
    return this.http.delete<any>(this.APIUrl + '/' + idescenario + '/puntosgeolocalizables/' + idpuntogeolocalizable);
  }

  // OBTENEMOS LA COLECCIÓN CUYO IDENTIFICADOR PASAMOS COMO PARÁMETRO
  GET_Escenario(idescenario: number): Observable<Escenario> {
    return this.http.get<Escenario>(this.APIRURLEscenarios + '/' + idescenario);
  }



  // FUNCIONES PARA ENVIAR Y RECIBIR DATOS ENTRE COMPONENTES

  EnviarEscenarioAlServicio(escenario: any) {
    this.escenario = escenario;
  }

  RecibirEscenarioDelServicio(): any {
    console.log('voy a enviar la coleccion');
    console.log(this.escenario);
    return this.escenario;
  }

  EnviarPuntosGeolocalizablesEscenarioAlServicio(puntosgeolocalizables: any) {
    this.puntosgeolocalizablesEscenario = puntosgeolocalizables;
  }

  RecibirPuntosGeolocalizabelesEscenarioDelServicio(): any {
    return this.puntosgeolocalizablesEscenario;
  }

  EnviarPuntoGeolocalizableAlServicio(puntogeolocalizable: any) {
    this.puntogeolocalizable = puntogeolocalizable;
  }

  RecibirCromoDelServicio(): any {
    return this.puntogeolocalizable;
  }
}

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

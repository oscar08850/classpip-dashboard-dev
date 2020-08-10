// para hacer esto he usado el tutorial:
// https://codingblast.com/chat-application-angular-socket-io/
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import * as URL from '../URLs/urls';

@Injectable({
  providedIn: 'root'
})
export class ComServerService {

  private socket;

  constructor() {
  }
  public Conectar() {
    this.socket = io(URL.Servidor);
    this.socket.emit ('dash');
  }

  public EsperoRespuestasJuegoDeCuestionario = () => {
    return Observable.create((observer) => {
        this.socket.on('respuestaJuegoDeCuestionario', (alumnoId) => {
            observer.next(alumnoId);
        });
    });
  }
  public EsperoModificacionAvatar = () => {
    return Observable.create((observer) => {
        this.socket.on('modificacionAvatar', (inscripcion) => {
            console.log ('llega notificacion');
            observer.next(inscripcion);
        });
    });
  }

}



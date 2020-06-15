// para hacer esto he usado el tutorial:
// https://codingblast.com/chat-application-angular-socket-io/
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComServerService {
  private url = 'http://localhost:8080';
  private socket;

  constructor() {
  }
  public Conectar() {
    this.socket = io(this.url);
    this.socket.emit ('dash');
  }

  public EsperoRespuestasJuegoDeCuestionarip = () => {
    return Observable.create((observer) => {
        this.socket.on('respuestaJuegoDeCuestionario', (alumnoId) => {
            observer.next(alumnoId);
        });
    });
  }

}



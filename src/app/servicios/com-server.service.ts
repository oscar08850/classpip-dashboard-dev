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

  public EsperoRespuestasJuegoDeCuestionario (): any {
    return Observable.create((observer) => {
        this.socket.on('respuestaJuegoDeCuestionario', (alumnoId) => {
            console.log ('Respuesta cuestionaro ' + alumnoId);
            observer.next(alumnoId);
        });
    });
  }
  public EsperoModificacionAvatar(): any {
    return Observable.create((observer) => {
        this.socket.on('modificacionAvatar', (inscripcion) => {
            console.log ('llega notificacion');
            observer.next(inscripcion);
        });
    });
  }

  // Votación de un juego Uno A Todos
  public EsperoVotacion(): any {
    return Observable.create((observer) => {
        this.socket.on('notificarVotacion', (votacion) => {
            console.log ('llega notificacion');
            observer.next(votacion);
        });
    });
  }

  // votaciones de un juego Todos A Uno
  // El parámetro votación NO tienen ninguna información relevante
  public EsperoVotaciones(): any  {
    return Observable.create((observer) => {
        this.socket.on('notificarVotaciones', (votacion) => {
            console.log ('llega notificacion');
            observer.next(votacion);
        });
    });
  }

  public EnviarNotificacionIndividual(alumnoDestinatarioId: number, mensajeAEnviar: string) {
    console.log ('dentro del servicio para enviar notificación al alumno');
    this.socket.emit ('notificacionIndividual' , {alumnoId: alumnoDestinatarioId, mensaje: mensajeAEnviar});
  }

  public EnviarNotificacionEquipo(equipoDestinatarioId: number, mensajeAEnviar: string) {
    console.log ('dentro del servicio para enviar notificación al equipo');
    this.socket.emit ('notificacionEquipo' , {equipoId: equipoDestinatarioId, mensaje: mensajeAEnviar});
  }

  public EnviarNotificacionGrupo(grupoDestinatarioId: number, mensajeAEnviar: string) {
    console.log ('dentro del servicio para enviar notificación al grupo');
    this.socket.emit ('notificacionGrupo' , {grupoId: grupoDestinatarioId, mensaje: mensajeAEnviar});
  }

  public RecordarContrasena(emailRec: string, nombreRec: string, contrasenaRec: string) {
    console.log ('dentro del servicio para recordar contraseña');
    // Me conecto momentaneamente para enviarle al servidor la contraseña que debe enviar por email
    this.socket = io(URL.Servidor);
    this.socket.emit ('recordarContraseña' , {email: emailRec, nombre: nombreRec, contrasena: contrasenaRec});
    // Me desconecto
    this.socket.emit('forceDisconnect');
  }


}



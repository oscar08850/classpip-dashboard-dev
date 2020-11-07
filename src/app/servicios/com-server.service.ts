// para hacer esto he usado el tutorial:
// https://codingblast.com/chat-application-angular-socket-io/
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import * as URL from '../URLs/urls';
import { Alumno, Profesor} from '../clases/index';

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

  public Desonectar() {
    this.socket.emit ('desconectarDash');
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

  public RecordarContrasena(profesor: Profesor) {
    console.log ('dentro del servicio para recordar contraseña');
    // Me conecto momentaneamente para enviarle al servidor la contraseña que debe enviar por email
    this.socket = io(URL.Servidor);
    this.socket.emit ('recordarContraseña' , {email: profesor.email, nombre: profesor.NombreUsuario, contrasena: profesor.Password});
    // Me desconecto
    this.socket.emit('forceDisconnect');
  }

  public EnviarInfoRegistroAlumno(profesor: Profesor, alumno: Alumno) {
    // El profesor ha dado de alta a un alumno. Le enviamos un email para darle la información
    console.log ('voy a enviar info al alumno ');
    console.log (alumno);
    this.socket.emit ('enviarInfoRegistroAlumno' , {p: profesor, a: alumno});
  }

  public EsperoNickNames(): any  {
    return Observable.create((observer) => {
        this.socket.on('nickNameJuegoRapido', (nick) => {
            console.log ('recibo nick: ' + nick);
            observer.next(nick);
        });
    });
  }

  public EsperoRespuestasEncuestaRapida(): any  {
    return Observable.create((observer) => {
        this.socket.on('respuestaEncuestaRapida', (respuesta) => {
            observer.next(respuesta);
        });
    });
  }


  public EsperoRespuestasVotacionRapida(): any  {
    return Observable.create((observer) => {
        this.socket.on('respuestaVotacionRapida', (respuesta) => {
            console.log ('ya tengo votacion');
            console.log (respuesta);
            observer.next(respuesta);
        });
    });
  }

  public EsperoRespuestasCuestionarioRapido(): any  {
    return Observable.create((observer) => {
        this.socket.on('respuestaCuestionarioRapido', (respuesta) => {
            console.log ('ya tengo respuesta');
            console.log (respuesta);
            observer.next(respuesta);
        });
    });
  }

  public EsperoTurnos(clave: string): any  {
    console.log ('voy a esperar turnos en');
    console.log ('turnoElegido:' + clave);
    return Observable.create((observer) => {
        this.socket.on('turnoElegido:' + clave, (info) => {
            console.log ('ya tengo respuesta');
            console.log (info);
            observer.next(info);
        });
    });
  }

  public NotificarTurnoCogido(claveJuego: string, turnoElegido: any) {
    this.socket.emit ('notificacionTurnoCogido' , {clave: claveJuego, turno: turnoElegido});

  }

  public NotificarTurnoNuevo(claveJuego: string, turnoNuevo: any) {
    this.socket.emit ('notificacionTurnoNuevo' , {clave: claveJuego, turno: turnoNuevo});

  }





}



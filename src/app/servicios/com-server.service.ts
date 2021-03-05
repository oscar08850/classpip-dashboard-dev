// para hacer esto he usado el tutorial:
// https://codingblast.com/chat-application-angular-socket-io/
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import * as URL from '../URLs/urls';
import { Alumno, Profesor } from '../clases/index';

@Injectable({
  providedIn: 'root'
})
export class ComServerService {

  notificacionconectar = 'dash conectado';
  private socket;
  private url = URL.Servidor;
  constructor() {
  }

 

  public Conectar(profesorId) {
    this.socket = io(this.url);
    this.socket.emit('dash', this.notificacionconectar);
    this.socket.emit ('conectarDash', profesorId);
  }

  public ConectarCuentos() {
    this.socket = io(this.url);
    this.socket.emit('dash', this.notificacionconectar);
    
  }



  public EsperoRespuestasJuegoDeCuestionario(): any {
    return Observable.create((observer) => {
      this.socket.on('respuestaJuegoDeCuestionario', (alumnoId) => {
        console.log('Respuesta cuestionaro ' + alumnoId);
        observer.next(alumnoId);
      });

    });
  }  

  public Desonectar(profesorId: number) {
    this.socket.emit('desconectarDash', profesorId);
  }


  public EsperoModificacionAvatar(): any {
    return Observable.create((observer) => {
      this.socket.on('modificacionAvatar', (inscripcion) => {
        console.log('llega notificacion');
        observer.next(inscripcion);
      });
    });
  }

  // Votación de un juego Uno A Todos
  public EsperoVotacion(): any {
    return Observable.create((observer) => {
      this.socket.on('notificarVotacion', (votacion) => {
        console.log('llega notificacion');
        observer.next(votacion);
      });
    });
  }

  // votaciones de un juego Todos A Uno
  // El parámetro votación NO tienen ninguna información relevante
  public EsperoVotaciones(): any {
    return Observable.create((observer) => {
      this.socket.on('notificarVotaciones', (votacion) => {
        console.log('llega notificacion');
        observer.next(votacion);
      });
    });
  }

  /////////////este es el mio///////////////////
  public Esperovotacionconcurso(): any {
    return Observable.create((observer) => {
      this.socket.on('notificacionvotardash', (notificacionvotardash) => {
        console.log('ha llegado la notificación de votar llega notificacion');
        observer.next(notificacionvotardash);
      });
    });
  }
  /////////////este ya no es el mio///////////////////

  public EnviarNotificacionIndividual(alumnoDestinatarioId: number, mensajeAEnviar: string) {
    console.log('dentro del servicio para enviar notificación al alumno');
    this.socket.emit('notificacionIndividual', { alumnoId: alumnoDestinatarioId, mensaje: mensajeAEnviar });
  }

  public EnviarNotificacionEquipo(equipoDestinatarioId: number, mensajeAEnviar: string) {
    console.log('dentro del servicio para enviar notificación al equipo');
    this.socket.emit('notificacionEquipo', { equipoId: equipoDestinatarioId, mensaje: mensajeAEnviar });
  }

  public EnviarNotificacionGrupo(grupoDestinatarioId: number, mensajeAEnviar: string) {
    console.log('dentro del servicio para enviar notificación al grupo');
    this.socket.emit('notificacionGrupo', { grupoId: grupoDestinatarioId, mensaje: mensajeAEnviar });
  }

  public RecordarContrasena(profesor: Profesor) {
    console.log('dentro del servicio para recordar contraseña');
    // Me conecto momentaneamente para enviarle al servidor la contraseña que debe enviar por email
    this.socket = io(URL.Servidor);
    this.socket.emit('recordarContraseña', { email: profesor.email, nombre: profesor.NombreUsuario, contrasena: profesor.Password });
    // Me desconecto
    this.socket.emit('forceDisconnect');
  }

  public EnviarInfoRegistroAlumno(profesor: Profesor, alumno: Alumno) {
    // El profesor ha dado de alta a un alumno. Le enviamos un email para darle la información
    console.log('voy a enviar info al alumno ');
    console.log(alumno);
    this.socket.emit('enviarInfoRegistroAlumno', { p: profesor, a: alumno });
  }

  public EsperoNickNames(): any {
    return Observable.create((observer) => {
      this.socket.on('nickNameJuegoRapido', (nick) => {
        console.log('recibo nick: ' + nick);
        observer.next(nick);
      });
    });
  }

  public EsperoRespuestasEncuestaRapida(): any {
    return Observable.create((observer) => {
      this.socket.on('respuestaEncuestaRapida', (respuesta) => {
        console.log('respuesta en comserver');
        console.log(respuesta);
        observer.next(respuesta);
      });
    });
  }


  public EsperoRespuestasVotacionRapida(): any {
    return Observable.create((observer) => {
      this.socket.on('respuestaVotacionRapida', (respuesta) => {
        console.log('ya tengo votacion');
        console.log(respuesta);
        observer.next(respuesta);
      });
    });
  }

  public EsperoRespuestasCuestionarioRapido(): any {
    return Observable.create((observer) => {
      this.socket.on('respuestaCuestionarioRapido', (respuesta) => {
        console.log('ya tengo respuesta');
        console.log(respuesta);
        observer.next(respuesta);
      });
    });
  }

  public EsperoTurnos(): any {
    return Observable.create((observer) => {
      this.socket.on('turnoElegido', (info) => {
        console.log('ya tengo respuesta');
        console.log(info);
        observer.next(info);
      });
    });
  }

  public NotificarTurnoCogido(claveJuego: string, turnoElegido: any) {
    this.socket.emit('notificacionTurnoCogido', { clave: claveJuego, turno: turnoElegido });

  }

  public NotificarTurnoNuevo(claveJuego: string, turnoNuevo: any) {
    this.socket.emit('notificacionTurnoNuevo', { clave: claveJuego, turno: turnoNuevo });

  }

  //Función para testeo conexión a servidor
  public AvanzarPregunta(grupoDestinatarioId: number) {
    // Cuando apretemos el boton, queremos que avance a la siguiente pregunta en el mv.
    console.log ('voy a avanzar la pregunta');
    this.socket.emit ('avanzarPregunta', {grupoId: grupoDestinatarioId});
  }

  //MÉTODOS NECESARIOS, PARA LA INTERACCIÓN DASHBOARD-SERVER, EN LA MODALIDAD KAHOOT

  public EsperoRespuestasCuestionarioKahoot(): any  {
    return Observable.create((observer) => {
        this.socket.on('respuestaAlumnoKahoot', (respuesta) => {
            console.log ('ya tengo respuesta');
            console.log (respuesta);
            observer.next(respuesta);
        });
    });
  }

  //Método que espera recibir la conexión del alumno para reflejarlo en la tabla de resumen
  public EsperoConexionesCuestionarioKahoot(): any  {
    return Observable.create((observer) => {
        this.socket.on('conexionAlumnoKahoot', (respuesta) => {
            console.log ('Alumno conectado al juego');
            console.log (respuesta);
            observer.next(respuesta);
        });
    });
  }

  public EsperoConfirmacionPreparadoKahoot(): any {
    return Observable.create((observer) => {
      this.socket.on('confirmacionPreparadoParaKahoot', (nick) => {
          console.log ('recibo nick: ' + nick);
          observer.next(nick);
      });
    });
  }

  public NotificarLanzarSiguientePregunta(claveJuego: string, info: any) {
    this.socket.emit ('lanzarSiguientePregunta' , {clave: claveJuego, opcionesDesordenadas: info});

  }

  public NotificarResultadoFinalKahoot(claveJuego: string, res: any) {
    this.socket.emit ('resultadoFinalKahoot' , {clave: claveJuego, resultado: res});

  }
  public EsperoRespuestasCuestionarioKahootRapido(): any  {
    return Observable.create((observer) => {
        this.socket.on('respuestaAlumnoKahootRapido', (respuesta) => {
            console.log ('recibo respuesta kahoot ');
            console.log (respuesta);
            observer.next(respuesta);
        });
    });
  }




}







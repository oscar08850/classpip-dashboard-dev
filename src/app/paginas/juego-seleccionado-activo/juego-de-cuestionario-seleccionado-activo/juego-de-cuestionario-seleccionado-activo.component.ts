import { Component, OnInit } from '@angular/core';
import { Juego, Alumno, Pregunta, Cuestionario, EquipoJuegoDeCuestionario, Equipo, TablaEquipoJuegoDeCuestionario } from 'src/app/clases';
import { AlumnoJuegoDeCuestionario } from 'src/app/clases/AlumnoJuegoDeCuestionario';
import { TablaAlumnoJuegoDeCuestionario } from 'src/app/clases/TablaAlumnoJuegoDeCuestionario';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { SesionService, PeticionesAPIService, CalculosService, ComServerService } from 'src/app/servicios';
import { JuegoDeCuestionario } from 'src/app/clases/JuegoDeCuestionario';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
// tslint:disable-next-line:max-line-length
import { InformacionJuegoDeCuestionarioDialogComponent } from './informacion-juego-de-cuestionario-dialog/informacion-juego-de-cuestionario-dialog.component';

import { Howl } from 'howler';
import { ActivatedRoute,NavigationExtras, Router} from '@angular/router';
import { Subscription } from 'rxjs';
import * as URL from '../../../URLs/urls';

@Component({
  selector: 'app-juego-de-cuestionario-seleccionado-activo',
  templateUrl: './juego-de-cuestionario-seleccionado-activo.component.html',
  styleUrls: ['./juego-de-cuestionario-seleccionado-activo.component.scss']
})
export class JuegoDeCuestionarioSeleccionadoActivoComponent implements OnInit {

  // Juego de Cuestionario saleccionado
  juegoSeleccionado: any;

  // Recuperamos la informacion del juego
  alumnosDelJuego: Alumno[];
  equiposDelJuego: Equipo[];

  // Lista de los alumnos ordenada segun su nota
  listaAlumnosOrdenadaPorNota: AlumnoJuegoDeCuestionario[];
  listaEquiposOrdenadaPorNota: EquipoJuegoDeCuestionario[];
  rankingAlumnosPorNota: TablaAlumnoJuegoDeCuestionario[];

  rankingEquiposPorNota: TablaEquipoJuegoDeCuestionario[];

  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estas segura/o que quieres desactivar: ';

  // tslint:disable-next-line:no-inferrable-types
  mensajeFinalizar: string = 'Estas segura/o de que quieres finalizar: ';

  // Orden conlumnas de la tabla
  displayedColumnsAlumnos: string[] = ['nombreAlumno', 'primerApellido', 'segundoApellido', 'nota', ' '];
  displayedColumnsAlumnosKahoot: string[] = ['nombreAlumno', 'primerApellido', 'segundoApellido', 'conexion'];
  displayedColumnsEquipos: string[] = ['nombreEquipo', 'nota', ' '];
  
  dataSourceAlumno;
  dataSourceEquipo;
  dataSourceAlumnosConectados;
  dataSourceEquiposConectados;

  // tslint:disable-next-line:no-inferrable-types

  alumnosQueHanContestado: any[];
  alumnoIdKahoot: number;
  conexionKahoot: boolean = false;

  //Lista para tratado de conexiones
  alumnosConectados: any[];
  listaAlumnos: any[];
  equiposConectados: any[];
  listaEquipos: any[];

//////////////////////////////////

  participantes: any[];
  respuestas: any[] = [];
  cuestionario: Cuestionario;
  preguntas: Pregunta[];
  histogramaAciertos: number[] = [];

  mostrarParticipantes = true;
  informacionPreparada = false;
  profesorId: number;
  numeroRespuestas = 0;
  numeroParticipantes = 0;
  clasificacion: any [];
  dataSource;
  displayedColumns: string[] = ['nick', 'nota'];
  categoriasEjeX;
  grafico;
  donuts: any[] = [];
  misDonuts: any[] = [];
  sonido = true;
  ficheroGenerado = false;
  ///////////////////////////////
  mostrarCuentaAtras = false;
  interval;
  cuentaAtras: number;
  interval2;
  cuentaAtras2: number;
  mostrarSiguientePregunta = false;
  preguntaAMostrar: Pregunta;
  siguientePregunta = 0;
  mostrarBotonLanzarPregunta = true;
  imagenesPreguntas: any[];
  imagenPreguntaAMostrar: string;
  contadorRespuestasKahoot: number;
  subscripcion: Subscription;
  opcionesDesordenadas: any[];

  displayedColumnsKahoot: string[] = ['nombre', 'primerApellido', 'incremento', 'puntos'];
  dataSourceKahoot;
  finKahoot = false;
  respuestasPreguntaActual: any[];
  donutsKahoot: any[] = [];


  constructor(  public dialog: MatDialog,
                public sesion: SesionService,
                public peticionesAPI: PeticionesAPIService,
                public calculos: CalculosService,
                public comServer: ComServerService,
                private location: Location,
                private router: Router) { }

  ngOnInit() {
    // El juego de cuestionario puede ser de modalidad clásica o kahoot
    // El en caso de modalidad clasica, puede ser individual o en equipo

    
    const sound = new Howl({
      src: ['/assets/got-it-done.mp3']
    });

    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log(this.juegoSeleccionado.Modalidad);

    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.alumnosConectados = [];
      this.listaAlumnos = [];

      // Este procedimiento prepara la lista alumnosDelJuego (que son los que participan en el juego)
      // y una lista que se llama alumnosConectados en la que cada item contiene el alumno y un boolean que indica si está conectado (necesario para
      // la modalidad Kahoot)
      this.AlumnosDelJuego();

      // Aqui traemos el cuestionario, las preguntas y el histograma de aciertos
      // Para cada pregunta preparamos la imagen si la tiene y el donut que usaremos para mostrar las respuestas
      this.PreparaInfo();

      if (this.juegoSeleccionado.Modalidad === 'Kahoot') {

        // Cada alumno que quiera participar en el Kahoot enviara una notificación de que está preparado, enviando su identificador de alumno
        this.comServer.EsperoConfirmacionPreparadoKahoot()
        .subscribe((alId) => {
          // el participante está listo para empezar el kahoot. Tomo nota de esto
          const alum = this.alumnosConectados.find (al => al.alumno.id === alId);
          alum.conectado = true;
          // Actualizo la tabla de conectados (aparecerá el simbolo verde al lado del nombre del alumno)
          this.dataSourceAlumnosConectados = new MatTableDataSource(this.alumnosConectados);

          // Añado al alumno a la lista de alumnos que participan en el juego. En esa lista tendo los datos para hacer el seguimiento del juego
          this.listaAlumnos.push ( {
            alumno: alum.alumno,
            incremento: 0,  // indica cuántos puntos suma con la última respuesta
            puntos: 0,
            aciertos: 0 // esto es para el histograma
          })
        });
      }
    } else {
 
      // Hacemos lo mismo pero ahora con los equipos
      this.equiposConectados = [];
      this.listaEquipos = [];

      this.EquiposDelJuego();

      this.PreparaInfo();

    }

    if (this.juegoSeleccionado.Modalidad === 'Clásico' && this.juegoSeleccionado.Modo === 'Individual') {
      // Si el juego es Clásico directamente espero la respuesta a todas las preguntas del cuestionario
      // La notificación que me llega contiene:
      //  id del alumno
      //  nota obtenida 
      //  tiempo empleado
      this.comServer.EsperoRespuestasJuegoDeCuestionario()
      .subscribe((alumno: any) => {
          sound.play();
         
          // Añado la información a la tabla con el ranking, que vuelvo a ordenar
          const al = this.rankingAlumnosPorNota.filter (a => a.id === alumno.id )[0];
          al.nota = alumno.nota;
          al.tiempoEmpleado = alumno.tiempo;
          al.contestado = true;

          // tslint:disable-next-line:only-arrow-functions
          this.rankingAlumnosPorNota = this.rankingAlumnosPorNota.sort(function(a, b) {
            if (b.nota !== a.nota) {
              return b.nota - a.nota;
            } else {
              // en caso de empate en la nota, gana el que empleó menos tiempo
              return a.tiempoEmpleado - b.tiempoEmpleado;
            }
          });
          this.dataSourceAlumno = new MatTableDataSource(this.rankingAlumnosPorNota);
      });
    }
    
    if (this.juegoSeleccionado.Modalidad === 'Clásico' && this.juegoSeleccionado.Modo === 'Equipos') {
      // Si el juego es Clásico directamente espero la respuesta a todas las preguntas del cuestionario
      // La notificación que me llega contiene:
      //  id del equipo
      //  nota obtenida 
      //  tiempo empleado
      // Sin embargo, si algun miembro del equipo ya ha contestado la respuesta se ignora

      this.comServer.EsperoRespuestasEquipoJuegoDeCuestionario()
      .subscribe((equipo: any) => {

          // Añado la información a la tabla con el ranking, que vuelvo a ordenar
          const eq = this.rankingEquiposPorNota.filter (a => a.id === equipo.id )[0];
          if (!eq.contestado) {
            sound.play();
            eq.nota = equipo.nota;
            eq.tiempoEmpleado = equipo.tiempo;
            eq.contestado = true;
  
            // tslint:disable-next-line:only-arrow-functions
            this.rankingEquiposPorNota = this.rankingEquiposPorNota.sort(function(a, b) {
              if (b.nota !== a.nota) {
                return b.nota - a.nota;
              } else {
                // en caso de empate en la nota, gana el que empleó menos tiempo
                return a.tiempoEmpleado - b.tiempoEmpleado;
              }
            });
            this.dataSourceEquipo = new MatTableDataSource(this.rankingEquiposPorNota);
          }
      });
    }

  }

  
  PreparaInfo() {
    this.peticionesAPI.DameCuestionario (this.juegoSeleccionado.cuestionarioId)
    .subscribe (cuestionario => {
      this.cuestionario = cuestionario;

      this.peticionesAPI.DamePreguntasCuestionario (this.cuestionario.id)
      .subscribe ( preguntas => {
        this.preguntas = preguntas;
        // preparo el histograma
        this.histogramaAciertos = Array(this.preguntas.length + 1).fill(0);
        


        this.imagenesPreguntas = [];

          
        this.preguntas.forEach (pregunta => {
          // preparo la imagen de la pregunta
          this.imagenesPreguntas.push(URL.ImagenesPregunta + pregunta.Imagen);

          // preparo un donut para representar las respuestas
          let miDonut: any;
          miDonut = [];
          // preparo los datos del donut
          // primero meto el tipo de pregunta
          miDonut.push ( { preguntaId: pregunta.id, Tipo: pregunta.Tipo});
          if (pregunta.Tipo === 'Cuatro opciones') {
            miDonut.push ( { respuesta: pregunta.RespuestaCorrecta, cont: 0});
            miDonut.push ( { respuesta: pregunta.RespuestaIncorrecta1, cont: 0});
            miDonut.push ( { respuesta: pregunta.RespuestaIncorrecta2, cont: 0});
            miDonut.push ( { respuesta: pregunta.RespuestaIncorrecta3, cont: 0});
            // esto es para el caso de respuesta en blando
            miDonut.push ( { respuesta: '-', cont: 0});

          } else if (pregunta.Tipo === 'Respuesta abierta') {
            miDonut.push ( { respuesta: pregunta.RespuestaCorrecta, cont: 0});
            miDonut.push ( { respuesta: 'Otras respuestas', cont: 0});
            // esto es para el caso de respuesta en blando
            miDonut.push ( { respuesta: '-', cont: 0});
          } else if (pregunta.Tipo === 'Verdadero o falso') {
            miDonut.push ( { respuesta: pregunta.RespuestaCorrecta, cont: 0});
            miDonut.push ( { respuesta: 'Mal', cont: 0});
            // esto es para el caso de respuesta en blando
            miDonut.push ( { respuesta: '-', cont: 0});
          } else {
            miDonut.push ( { respuesta: 'Emparejamientos correctos', cont: 0});
            miDonut.push ( { respuesta: 'Otros emparejamientos incorrectos', cont: 0});
            // esto es para el caso de respuesta en blando
            miDonut.push ( { respuesta: '-', cont: 0});
          }

          this.misDonuts.push (miDonut);
        });

        // Si el juego es Clásico entonces puede que haya respuestas (alumnos que ya han respondido con anterioridad)
        // Parece que lo razonable sería que si un alumno ya ha contestado su respuesta esté en su inscripción y no en el modelo
        // del juego. Si embargo, la cosa está hecha asi. En su inscripción está la nota que sacó y el tiempo que tardo.
        this.respuestas = this.juegoSeleccionado.Respuestas;
        if (!this.respuestas) {
          this.respuestas = [];
        } else {
          this.numeroRespuestas = this.respuestas.length;
          this.numeroParticipantes = this.numeroRespuestas;

          if (this.numeroRespuestas !== 0) {
            this.PrepararHitogramaYDonutsIniciales();
            this.PrepararGraficos();
          }
        }
      });
    });

  }

  // HaContestado(alumnoId: number): boolean {
  //   console.log ('voy a ver si ha contestado ' + alumnoId);
  //   if (this.alumnosQueHanContestado.find (alumno => alumno.id === alumnoId) === undefined) {
  //     console.log ('No');
  //     return false;
  //   } else {
  //     console.log ('SI');
  //     return true;
  //   }
  // }


  AlumnosDelJuego() {
    this.peticionesAPI.DameAlumnosJuegoDeCuestionario(this.juegoSeleccionado.id)
    .subscribe(alumnosJuego => {
      this.alumnosDelJuego = alumnosJuego;
      this.alumnosDelJuego.forEach(al => {
        this.alumnosConectados.push({
          alumno: al,
          conectado: false
        })
      })

      // Preparo la tabla en la que se irán viendo los alumnos que se van conectando
      this.dataSourceAlumnosConectados = new MatTableDataSource(this.alumnosConectados);
      this.RecuperarInscripcionesAlumnoJuego();
    });
  }

  RecuperarInscripcionesAlumnoJuego() {
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeCuestionario(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorNota = inscripciones;
      // En el caso de que el cuestionario sea clásico y algunos alumnos hayan contestado, entonces en la propia inscripción
      // está la nota que sacó el alumno y el tiempo que empleó en contestar. Asi que ordeno la lista segun nota y tiempo (en caso de misma nota)
      // tslint:disable-next-line:only-arrow-functions
      this.listaAlumnosOrdenadaPorNota = this.listaAlumnosOrdenadaPorNota.sort(function(a, b) {
        if (b.Nota !== a.Nota) {
          return b.Nota - a.Nota;
        } else {
          // en caso de empate en la nota, gana el que empleó menos tiempo
          return a.TiempoEmpleado - b.TiempoEmpleado;
        }
      });
      console.log ('inscripciones');
      console.log (this.listaAlumnosOrdenadaPorNota);
      this.TablaClasificacionTotal();
    });
  }

  TablaClasificacionTotal() {
    // Ahora preparo la tabla para mostrar la clasificación. Básicamente, junto en la misma tabla nombre del alumno con la nota
    this.rankingAlumnosPorNota = this.calculos.PrepararTablaRankingCuestionario(this.listaAlumnosOrdenadaPorNota,
      this.alumnosDelJuego);
    this.dataSourceAlumno = new MatTableDataSource(this.rankingAlumnosPorNota);
  }

  
  EquiposDelJuego() {
    this.peticionesAPI.DameEquiposJuegoDeCuestionario(this.juegoSeleccionado.id)
    .subscribe(equiposJuego => {
      this.equiposDelJuego = equiposJuego;
      this.equiposDelJuego.forEach(eq => {
        this.equiposConectados.push({
          equipo: eq,
          conectado: false
        });
      });

      // Preparo la tabla en la que se irán viendo los alumnos que se van conectando
      this.dataSourceEquiposConectados = new MatTableDataSource(this.equiposConectados);
      this.RecuperarInscripcionesEquipoJuego();
    });
  }

  RecuperarInscripcionesEquipoJuego() {
    this.peticionesAPI.DameInscripcionesEquipoJuegoDeCuestionario(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaEquiposOrdenadaPorNota = inscripciones;
      // En el caso de que el cuestionario sea clásico y algunos equipos hayan contestado, entonces en la propia inscripción
      // está la nota que sacó el alumno y el tiempo que empleó en contestar. Asi que ordeno la lista segun nota y tiempo (en caso de misma nota)
      // tslint:disable-next-line:only-arrow-functions
      this.listaEquiposOrdenadaPorNota = this.listaEquiposOrdenadaPorNota.sort(function(a, b) {
        if (b.Nota !== a.Nota) {
          return b.Nota - a.Nota;
        } else {
          // en caso de empate en la nota, gana el que empleó menos tiempo
          return a.TiempoEmpleado - b.TiempoEmpleado;
        }
      });
      console.log ('inscripciones');
      console.log (this.listaEquiposOrdenadaPorNota);
      this.TablaClasificacionTotalEquipos();
    });
  }

  TablaClasificacionTotalEquipos() {
    // Ahora preparo la tabla para mostrar la clasificación. Básicamente, junto en la misma tabla nombre del equipo con la nota
    this.rankingEquiposPorNota = this.calculos.PrepararTablaRankingEquiposCuestionario(this.listaEquiposOrdenadaPorNota,
      this.equiposDelJuego);
    this.dataSourceEquipo = new MatTableDataSource(this.rankingEquiposPorNota);
  }

  

  // DesactivarJuego() {
  //   // tslint:disable-next-line:max-line-length
  //   this.peticionesAPI.ModificaJuegoDeCuestionario(new JuegoDeCuestionario(this.juegoSeleccionado.NombreJuego, this.juegoSeleccionado.Tipo, this.juegoSeleccionado.Modalidad, this.juegoSeleccionado.PuntuacionCorrecta,
  //     this.juegoSeleccionado.PuntuacionIncorrecta, this.juegoSeleccionado.Presentacion, false, this.juegoSeleccionado.JuegoTerminado,
  //     // tslint:disable-next-line:max-line-length
  //     this.juegoSeleccionado.profesorId, this.juegoSeleccionado.grupoId, this.juegoSeleccionado.cuestionarioId), this.juegoSeleccionado.id, this.juegoSeleccionado.grupoId)
  //     .subscribe(res => {
  //       this.location.back();
  //     });
  // }

  AbrirDialogoConfirmacionDesactivar(): void {

    Swal.fire({
      title: 'Desactivar',
      text: "Estas segura/o de que quieres desactivar: " + this.juegoSeleccionado.Tipo,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'

    }).then((result) => {
      if (result.value) {
        this.juegoSeleccionado.JuegoActivo = false;
        this.peticionesAPI.ModificaJuegoDeCuestionario (this.juegoSeleccionado, this.juegoSeleccionado.id)
        .subscribe (() => {
          Swal.fire('Desactivado', this.juegoSeleccionado.Tipo + ' Desactivado correctamente', 'success');
          this.location.back();
        })

      }
    });
  }

 
  AbrirDialogoConfirmacionFinalizar(): void {

    Swal.fire({
      title: 'Finalizar',
      text: "Estas segura/o de que quieres finalizar: " + this.juegoSeleccionado.Tipo,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'

    }).then((result) => {
      if (result.value) {
        this.juegoSeleccionado.JuegoActivo = false;
        this.juegoSeleccionado.JuegoTerminado = true;
        this.peticionesAPI.ModificaJuegoDeCuestionario (this.juegoSeleccionado, this.juegoSeleccionado.id)
        .subscribe (() => {
          Swal.fire('Finalizado', this.juegoSeleccionado.Tipo + ' Finalizado correctamente', 'success');
          this.location.back();
        });
      }
    });
  }

  AbrirDialogoInformacionJuego(): void {
    const dialogRef = this.dialog.open(InformacionJuegoDeCuestionarioDialogComponent, {
      width: '45%',
      height: '60%',
      position: {
        top: '0%'
      }
    });
  }

  // AvanzarPregunta(){
  //   this.comServer.AvanzarPregunta(this.juegoSeleccionado.grupoId);
  // }

  applyFilter(filterValue: string) {
    this.dataSourceAlumno.filter = filterValue.trim().toLowerCase();
  }


  // En el juego de Kahoot desde el Dash se van lanzando las preguntas una a una
  LanzarPregunta() {
    this.mostrarBotonLanzarPregunta = false;
    this.mostrarCuentaAtras = true;

    this.preguntaAMostrar = this.preguntas [this.siguientePregunta];
    this.imagenPreguntaAMostrar = this.imagenesPreguntas[this.siguientePregunta];

    this.opcionesDesordenadas = [];
    // El el caso de 'Cuatro opciones' o 'Emparejamiento' desordeno las opciones y se las envio a todos
    // los alumnos. En el resto de casos la info es irrelevante
    if (this.preguntaAMostrar.Tipo === 'Cuatro opciones') {
      this.opcionesDesordenadas.push (this.preguntaAMostrar.RespuestaCorrecta);
      this.opcionesDesordenadas.push (this.preguntaAMostrar.RespuestaIncorrecta1);
      this.opcionesDesordenadas.push (this.preguntaAMostrar.RespuestaIncorrecta2);
      this.opcionesDesordenadas.push (this.preguntaAMostrar.RespuestaIncorrecta3);
      this.DesordenarVector (this.opcionesDesordenadas);
    } else if (this.preguntaAMostrar.Tipo === 'Emparejamiento') {
      this.preguntaAMostrar.Emparejamientos.forEach (pareja => {
        this.opcionesDesordenadas.push (pareja.r);
      });
      this.DesordenarVector (this.opcionesDesordenadas);
    }

    // Notifico a todos los conectados que deben mostrar la siguiente pregunta al alumno, con las opciones en el orden indicado

    this.comServer.NotificarLanzarSiguientePreguntaGrupo (this.juegoSeleccionado.grupoId, this.opcionesDesordenadas);

    // Empezamos la cuenta atrás
    this.cuentaAtras = 3;
    this.interval = setInterval(() => {
      this.cuentaAtras--;
      if (this.cuentaAtras === 0) {
        clearInterval(this.interval);

        // Mostrar la pregunta siguiente
        this.mostrarSiguientePregunta = true;
        this.mostrarCuentaAtras = false;
        this.contadorRespuestasKahoot = 0;
        this.respuestasPreguntaActual = [];
        // En el campo incremento pondre los puntos que saca cada alumno al responder a la pregunta
        this.listaAlumnos.forEach (alumno => alumno.incremento = 0);

        // Describo lo que haré cuando reciba cada respuesta
        this.subscripcion = this.comServer.EsperoRespuestasCuestionarioKahootGrupo ()
        .subscribe( respuesta => {
          // La respuesta es undefined si respondió en blanco. En caso contrario la estructura es la siguiente siguiente:
          //    alumnoId
          //    puntosObtenidos
          //    respuesta (Es un vector que contiene en la primera posición la respuesta en el caso de "Cuatro opciones", "Verdadero o
          //    falso" o "Respuesta abierta". En el caso de "Emparejamientos" contiene las partes derecha de las parejas. Está undefined
          //    su el participante la dejó sin contestar).
          //
    
          this.respuestasPreguntaActual.push (respuesta);

          // Actualizo la lista de alumnos con este resultado
          const alumno = this.listaAlumnos.find (a => a.alumno.id === respuesta.alumnoId);
          console.log ('alumno ', alumno);
          if (respuesta !== undefined) {
            alumno.incremento = respuesta.puntosObtenidos;
            alumno.puntos = alumno.puntos + respuesta.puntosObtenidos;
          }

          this.contadorRespuestasKahoot++;

        });
        // Empezamos la cuenta atrás del tiempo para responder a la pregunta
        this.cuentaAtras2 = this.juegoSeleccionado.TiempoLimite;
        this.interval2 = setInterval(() => {
          this.cuentaAtras2--;
          if (this.cuentaAtras2 === 0) {
                // Se acabo el tiempo
                clearInterval(this.interval2);
                // Ya no recibo más respuesas
                this.subscripcion.unsubscribe();
                // Ordeno la lista
                this.listaAlumnos = this.listaAlumnos.sort(function(a, b) {
                  return b.puntos - a.puntos;
                });
      
                this.dataSourceKahoot =  new MatTableDataSource (this.listaAlumnos);

                // se acabo el tiempo
                // voy a ver cuántos no han respondido
                const sinRespuesta = this.listaAlumnos.length - this.contadorRespuestasKahoot;
                // ahora introduzco tantas respuestas en blanco como gente sin responder
                for (let i = 0; i < sinRespuesta; i++) {
                  this.respuestasPreguntaActual.push (undefined);
                }
                // preparo el donut que muestra las respuestas de la pregunta actual
                this.MostrarDonut (this.preguntaAMostrar, this.respuestasPreguntaActual );


                this.respuestas.push (this.respuestasPreguntaActual);
                this.mostrarSiguientePregunta = false;
                this.mostrarBotonLanzarPregunta = true;
                this.siguientePregunta++;

                if (this.siguientePregunta === this.preguntas.length) {
                  Swal.fire('Ya no hay más preguntas', '', 'success');
                  this.finKahoot = true;

                  // Envio a todos los jugadores la lista con el resultado
                  this.comServer.NotificarResultadoFinalKahootGrupo (this.juegoSeleccionado.grupoId, this.listaAlumnos);

                  // QUIZA AQUI SERIA EL MOMENTO DE GUARDAR LAS NOTAS EN LAS INSCRIPCIONES DE LOS ALUMNOS
                  // Y tambien las respuestas (que están en "respuestas") en el modelo del juego
                  this.PrepararHistogramaKahoot ();
                }

          }
        }, 1000);
      }
    }, 1000);
  }




DesordenarVector(vector: any[]) {
  // genera una permutación aleatoria de los elementos del vector

  let currentIndex = vector.length;
  let temporaryValue;
  let randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = vector[currentIndex];
    vector[currentIndex] = vector[randomIndex];
    vector[randomIndex] = temporaryValue;
  }
  console.log ('he terminado');
}


MostrarDonut (pregunta: Pregunta,  respuestas: any[]) {
  // Selecciono el donut correspondiente a la pregunta
  const miDonut = this.misDonuts.find (elemento => elemento[0].preguntaId === pregunta.id);
  if (pregunta.Tipo === 'Emparejamiento') {
    respuestas.forEach (r => {
      if (r === undefined || r.respuesta === undefined) {
        // respuesta en blanco
        miDonut[3].cont++;
      } else if (r.puntosObtenidos > 0) {
        // acierto
        miDonut[1].cont++; // respuesta correcta
      } else {
        // fallo
        miDonut[2].cont++; // fallo
      }
    });
  } else if (pregunta.Tipo === 'Cuatro opciones') {
    respuestas.forEach (r => {
      if (r === undefined) {
        miDonut[5].cont++; // respuesta en blanco
      } else {miDonut.filter (entrada => entrada.respuesta === r.respuesta[0])[0].cont++;
       }
    });
  } else {
    respuestas.forEach (r => {
      if (r === undefined) {
        miDonut[3].cont++;  // respuesta en blanco
      } else if (pregunta.RespuestaCorrecta === r.respuesta[0]) {
        miDonut[1].cont++;  // respuesta correcta
      } else if (r.respuesta[0] === '-') {
        miDonut[3].cont++;  // respuesta en blanco
      } else {
        miDonut[2].cont++;  // respuesta mal
      }
    });
  }

  if (miDonut[0].Tipo === 'Cuatro opciones') {
      const datos = [
        // las respuestas correctas siempre en verde
        {value: miDonut[1].cont, name: miDonut[1].respuesta, itemStyle: {color: 'green'}},
        {value: miDonut[2].cont, name: miDonut[2].respuesta, itemStyle: {color: 'rgb(50,50,50)'}},
        {value: miDonut[3].cont, name: miDonut[3].respuesta, itemStyle: {color: 'rgb(100,100,100)'}},
        {value: miDonut[4].cont, name: miDonut[4].respuesta, itemStyle: {color: 'rgb(125,125,125)'}},
        {value: miDonut[5].cont, name: 'No contesta ' , itemStyle: {color: 'rgb(150,150,150)'}}
      ];
      const  donut = {
        title: {
          // text: 'Respuesta correcta',
          // subtext: miDonut[1].respuesta ,
          // left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{c} alumnos <br/> ({d}%)'
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: datos
            }
        ]
      };
      this.donuts.push (donut);
    } else if (miDonut[0].Tipo === 'Respuesta abierta') {
      const datos = [
        // las respuestas correctas siempre en verde
        {value: miDonut[1].cont, name: miDonut[1].respuesta, itemStyle: {color: 'green'}},
        {value: miDonut[2].cont, name: 'Otras respuestas', itemStyle: {color: 'rgb(50,50,50)'}},
        {value: miDonut[3].cont, name: 'No contesta ' , itemStyle: {color: 'rgb(150,150,150)'}}
      ];
      const  donut = {
        title: {
          // text: 'Respuesta correcta',
          // subtext: miDonut[1].respuesta ,
          // left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{c} alumnos <br/> ({d}%)'
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: datos
            }
        ]
      };
      this.donuts.push (donut);
    } else if (miDonut[0].Tipo === 'Verdadero o falso') {
      const datos = [
        // las respuestas correctas siempre en verde
        {value: miDonut[1].cont, name: miDonut[1].respuesta, itemStyle: {color: 'green'}},
        {value: miDonut[2].cont, name: 'Mal', itemStyle: {color: 'rgb(50,50,50)'}},
        {value: miDonut[3].cont, name: 'No contesta ' , itemStyle: {color: 'rgb(150,150,150)'}}
      ];
      const  donut = {
        title: {
          // text: 'Respuesta correcta',
          // subtext: 'Respuesta correcta: ' + miDonut[1].respuesta ,
          // left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{c} alumnos <br/> ({d}%)'
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: datos
            }
        ]
      };
      this.donuts.push (donut);
    } else {
      const datos = [
        // las respuestas correctas siempre en verde
        {value: miDonut[1].cont, name: 'Emparejamientos correctos', itemStyle: {color: 'green'}},
        {value: miDonut[2].cont, name: 'Otros emparejamientos incorrectos', itemStyle: {color: 'rgb(50,50,50)'}},
        {value: miDonut[3].cont, name: 'No contesta ' , itemStyle: {color: 'rgb(150,150,150)'}}
      ];
      const  donut = {
        title: {
          // text: 'Respuesta correcta',
          // subtext: miDonut[1].respuesta ,
          // left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{c} alumnos <br/> ({d}%)'
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: datos
            }
        ]
      };
      this.donuts.push (donut);

    }
}

PrepararHistogramaKahoot () {
  console.log ('voy a preparar histograma');
  console.log (this.respuestas);

  for (let i = 0; i < this.preguntas.length; i++) {
    const pregunta = this.preguntas[i];
    const respuestasPregunta = this.respuestas [i];

    if (pregunta.Tipo === 'Emparejamiento') {
      // Recorro todas las respuestas a esa pregunta y computo el posible acierto al
      // nick correspondiente
      respuestasPregunta.forEach (r => {
        if (r !== undefined && r.respuesta !== undefined) {
          let n = 0;
          for (let j = 0; j < pregunta.Emparejamientos.length; j++) {
            if (pregunta.Emparejamientos[j].r === r.respuesta[j]) {
              n++;
            }
          }
          if (n === pregunta.Emparejamientos.length) {
            this.listaAlumnos.find (al => al.alumno.id === r.alumnoId).aciertos++;
          }
        }
      });

    } else {
      // Para cualquier otro tipo de pregunta
      respuestasPregunta.forEach (r => {
        if (r !== undefined && pregunta.RespuestaCorrecta === r.respuesta[0]) {
          this.listaAlumnos.find (al => al.alumno.id === r.alumnoId).aciertos++;
        }
      });
    }
  }
  this.histogramaAciertos = Array(this.preguntas.length + 1).fill (0);

  this.listaAlumnos.forEach (alumno => {
    this.histogramaAciertos[alumno.aciertos]++;
  });
  // Histograda de número de aciertos
  this.categoriasEjeX = [];
  for (let n = 0; n < this.histogramaAciertos.length ; n++) {
    this.categoriasEjeX.push (n.toString());
  }


  this.grafico = {
    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: 'aciertos: {b}  <br/>{c}'
    },
    grid: {
      left: '20%',
      right: '20%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        name: '# aciertos',
        data: this.categoriasEjeX,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [{
      type: 'value',
      name: '# alumnos'
    }],
    series: [{
      type: 'bar',
      barWidth: '60%',
      data: this.histogramaAciertos,
    }]
  };




}


MostrarBotonSiguientePregunta (): boolean {
  if ((this.siguientePregunta > 0) && (this.siguientePregunta < this.preguntas.length)) {
    return true;
  } else {
    return false;
  }
}

// Esto es para cuando el juego ya tenia respuestas de otras sesiones

  PrepararHitogramaYDonutsIniciales() {



    this.respuestas.forEach (respuesta => {

      let aciertos = 0;
      for (let i = 0; i < respuesta.respuestas.Preguntas.length; i++) {
        const pregunta = this.preguntas.filter (p => p.id === respuesta.respuestas.Preguntas[i])[0];
        const donut = this.misDonuts.filter (elemento => elemento[0].preguntaId === pregunta.id)[0];
        if (pregunta.Tipo === 'Emparejamiento') {
          // primero actualizamos el histograma
          if (respuesta.respuestas.Respuestas[i] !== undefined) {
            let n = 0;
            for (let j = 0; j < pregunta.Emparejamientos.length; j++) {
              if (pregunta.Emparejamientos[j].r === respuesta.respuestas.Respuestas[i][j]) {
                n++;
              }
            }
            if (n === pregunta.Emparejamientos.length) {
              aciertos++;
              donut[1].cont++; // respuesta correcta
            } else {
              donut[2].cont++; // respuesta incorecta
            }
          } else {
            donut[3].cont++; // respuesta en blanco
          }

        } else if (pregunta.Tipo === 'Cuatro opciones') {
          // actualizo histograma
          if (pregunta.RespuestaCorrecta === respuesta.respuestas.Respuestas[i][0]) {
            aciertos++;
          }
          donut.filter (entrada => entrada.respuesta === respuesta.respuestas.Respuestas[i][0])[0].cont++;
        } else {
          console.log ('pregunta de respuesta abierta o verdadero o falso');
          if (pregunta.RespuestaCorrecta === respuesta.respuestas.Respuestas[i][0]) {
            aciertos++;
            donut[1].cont++;  // respuesta correcta
          } else if (respuesta.respuestas.Respuestas[i][0] === '-') {
              donut[3].cont++;  // respuesta en blanco
            } else {
              donut[2].cont++;  // respuesta mal
            }
        }
      }
      this.histogramaAciertos[aciertos]++;
      this.clasificacion.push ({
        nick: respuesta.nick,
        nota: respuesta.respuestas.Nota,
        tiempo: respuesta.respuestas.Tiempo
      });

      // tslint:disable-next-line:only-arrow-functions
      this.clasificacion = this.clasificacion.sort(function(a, b) {
        if (b.nota !== a.nota) {
          return b.nota - a.nota;
        } else {
          // en caso de empate en la nota, gana el que empleó menos tiempo
          return a.tiempo - b.tiempo;
        }
      });
    });


    this.dataSource = new MatTableDataSource(this.clasificacion);


  }


  PrepararGraficos() {

    // Histograda de número de aciertos
    this.categoriasEjeX = [];
    for (let n = 0; n < this.histogramaAciertos.length ; n++) {
      this.categoriasEjeX.push (n.toString());
    }


    this.grafico = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: 'aciertos: {b}  <br/>{c}'
      },
      grid: {
        left: '20%',
        right: '20%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          name: 'Número de aciertos',
          data: this.categoriasEjeX,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [{
        type: 'value',
        name: 'Número de participantes'
      }],
      series: [{
        type: 'bar',
        barWidth: '60%',
        data: this.histogramaAciertos,
      }]
    };

    // ahora los donuts
    this.donuts = [];
    let i = 1;
    this.misDonuts.forEach (miDonut => {
      if (miDonut[0].Tipo === 'Cuatro opciones') {
        const datos = [
          // las respuestas correctas siempre en verde
          {value: miDonut[1].cont, name: miDonut[1].respuesta, itemStyle: {color: 'green'}},
          {value: miDonut[2].cont, name: miDonut[2].respuesta, itemStyle: {color: 'rgb(50,50,50)'}},
          {value: miDonut[3].cont, name: miDonut[3].respuesta, itemStyle: {color: 'rgb(100,100,100)'}},
          {value: miDonut[4].cont, name: miDonut[4].respuesta, itemStyle: {color: 'rgb(125,125,125)'}},
          {value: miDonut[5].cont, name: 'No contesta ' , itemStyle: {color: 'rgb(150,150,150)'}}
        ];
        const  donut = {
          title: {
            text: 'Pregunta ' + i++,
            subtext: 'Respuesta correcta: ' + miDonut[1].respuesta ,
            left: 'center'
          },
          tooltip: {
              trigger: 'item',
              formatter: '{c} participantes <br/> ({d}%)'
          },
          series: [
              {
                  name: '',
                  type: 'pie',
                  radius: ['50%', '70%'],
                  avoidLabelOverlap: false,
                  label: {
                      show: false,
                      position: 'center'
                  },
                  emphasis: {
                      label: {
                          show: true,
                          fontSize: '30',
                          fontWeight: 'bold'
                      }
                  },
                  labelLine: {
                      show: false
                  },
                  data: datos
              }
          ]
        };
        this.donuts.push (donut);
      } else if (miDonut[0].Tipo === 'Respuesta abierta') {
        const datos = [
          // las respuestas correctas siempre en verde
          {value: miDonut[1].cont, name: miDonut[1].respuesta, itemStyle: {color: 'green'}},
          {value: miDonut[2].cont, name: 'Otras respuestas', itemStyle: {color: 'rgb(50,50,50)'}},
          {value: miDonut[3].cont, name: 'No contesta ' , itemStyle: {color: 'rgb(150,150,150)'}}
        ];
        const  donut = {
          title: {
            text: 'Pregunta ' + i++,
            subtext: 'Respuesta correcta: ' + miDonut[1].respuesta ,
            left: 'center'
          },
          tooltip: {
              trigger: 'item',
              formatter: '{c} participantes <br/> ({d}%)'
          },
          series: [
              {
                  name: '',
                  type: 'pie',
                  radius: ['50%', '70%'],
                  avoidLabelOverlap: false,
                  label: {
                      show: false,
                      position: 'center'
                  },
                  emphasis: {
                      label: {
                          show: true,
                          fontSize: '30',
                          fontWeight: 'bold'
                      }
                  },
                  labelLine: {
                      show: false
                  },
                  data: datos
              }
          ]
        };
        this.donuts.push (donut);
      } else if (miDonut[0].Tipo === 'Verdadero o falso') {
        const datos = [
          // las respuestas correctas siempre en verde
          {value: miDonut[1].cont, name: miDonut[1].respuesta, itemStyle: {color: 'green'}},
          {value: miDonut[2].cont, name: 'Mal', itemStyle: {color: 'rgb(50,50,50)'}},
          {value: miDonut[3].cont, name: 'No contesta ' , itemStyle: {color: 'rgb(150,150,150)'}}
        ];
        const  donut = {
          title: {
            text: 'Pregunta ' + i++,
            subtext: 'Respuesta correcta: ' + miDonut[1].respuesta ,
            left: 'center'
          },
          tooltip: {
              trigger: 'item',
              formatter: '{c} participantes <br/> ({d}%)'
          },
          series: [
              {
                  name: '',
                  type: 'pie',
                  radius: ['50%', '70%'],
                  avoidLabelOverlap: false,
                  label: {
                      show: false,
                      position: 'center'
                  },
                  emphasis: {
                      label: {
                          show: true,
                          fontSize: '30',
                          fontWeight: 'bold'
                      }
                  },
                  labelLine: {
                      show: false
                  },
                  data: datos
              }
          ]
        };
        this.donuts.push (donut);
      } else {
        const datos = [
          // las respuestas correctas siempre en verde
          {value: miDonut[1].cont, name: 'Emparejamientos correctos', itemStyle: {color: 'green'}},
          {value: miDonut[2].cont, name: 'Otros emparejamientos incorrectos', itemStyle: {color: 'rgb(50,50,50)'}},
          {value: miDonut[3].cont, name: 'No contesta ' , itemStyle: {color: 'rgb(150,150,150)'}}
        ];
        const  donut = {
          title: {
            text: 'Pregunta ' + i++,
            subtext: 'Respuesta correcta: ' + miDonut[1].respuesta ,
            left: 'center'
          },
          tooltip: {
              trigger: 'item',
              formatter: '{c} participantes <br/> ({d}%)'
          },
          series: [
              {
                  name: '',
                  type: 'pie',
                  radius: ['50%', '70%'],
                  avoidLabelOverlap: false,
                  label: {
                      show: false,
                      position: 'center'
                  },
                  emphasis: {
                      label: {
                          show: true,
                          fontSize: '30',
                          fontWeight: 'bold'
                      }
                  },
                  labelLine: {
                      show: false
                  },
                  data: datos
              }
          ]
        };
        this.donuts.push (donut);
      }
      i++;
    });

  }



}

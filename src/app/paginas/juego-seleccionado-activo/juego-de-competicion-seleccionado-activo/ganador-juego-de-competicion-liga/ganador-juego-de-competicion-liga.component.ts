import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

// Clases
import { Juego, Jornada, TablaJornadas, EnfrentamientoLiga, TablaAlumnoJuegoDeCompeticion,
  TablaEquipoJuegoDeCompeticion,
  AlumnoJuegoDeCompeticionLiga,
  EquipoJuegoDeCompeticionLiga, Alumno, Equipo, AlumnoJuegoDePuntos,
  EquipoJuegoDePuntos, AlumnoJuegoDeCuestionario} from '../../../../clases/index';

// Services
import { SesionService, CalculosService, PeticionesAPIService } from '../../../../servicios/index';
import {MatTableDataSource} from '@angular/material/table';

import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { analyzeAndValidateNgModules } from '@angular/compiler';

export interface Asignacion {
  modo: string;
  id: number;
}

const ModoAsignacion: Asignacion[] = [
  {modo: 'Manualmente', id: 1},
  {modo: 'Aleatoriamente', id: 2},
  {modo: 'Según resultados de un juego', id: 3}
];

@Component({
  selector: 'app-ganador-juego-de-competicion-liga',
  templateUrl: './ganador-juego-de-competicion-liga.component.html',
  styleUrls: ['./ganador-juego-de-competicion-liga.component.scss']
})
export class GanadorJuegoDeCompeticionLigaComponent implements OnInit {

  /* Estructura necesaria para determinar que filas son las que se han seleccionado */
  selectionUno = new SelectionModel<any>(true, []);
  selectionDos = new SelectionModel<any>(true, []);
  selectionTres = new SelectionModel<any>(true, []);
  botonAsignarAleatorioDesactivado = true;
  botonAsignarManualDesactivado = true;
  botonAsignarJuegoDesactivado = true;

  // enfrentamientosSeleccionadosColumnaUno: EnfrentamientoLiga[] = [];
  // enfrentamientosSeleccionadosColumnaDos: EnfrentamientoLiga[] = [];
  // enfrentamientosSeleccionadosColumnaTres: EnfrentamientoLiga[] = [];
  // equiposSeleccionadosUno: any[] = [];
  // equiposSeleccionadosDos: any[] = [];
  // equiposSeleccionadosTres: any[] = [];


  modoAsignacion: Asignacion[] = ModoAsignacion;

  // avisoMasDeUnGanadorMarcadoUnoDos = false;
  // avisoMasDeUnGanadorMarcadoUnoEmpate = false;
  // avisoMasDeUnGanadorMarcadoDosEmpate = false;

  // Juego De CompeticionLiga seleccionado
  juegoSeleccionado: Juego;
  numeroTotalJornadas: number;
  jornadasDelJuego: Jornada[];
  JornadasCompeticion: TablaJornadas[] = [];
  jornadaId: number;
  juegoDisponibleSeleccionadoID: number;
  juegoDisponibleSeleccionado: Juego;
  modoAsignacionId: number;


  // Información de la tabla: Muestra el JugadorUno, JugadorDos, Ganador, JornadaDeCompeticionLigaId y id
  EnfrentamientosJornadaSeleccionada: EnfrentamientoLiga[] = [];


  resultados: number [] = [];


  // Alumnos y Equipos del Juego
  listaAlumnosClasificacion: TablaAlumnoJuegoDeCompeticion[] = [];
  listaEquiposClasificacion: TablaEquipoJuegoDeCompeticion[] = [];
  // alumnosJuegoDeCompeticionLiga: AlumnoJuegoDeCompeticionLiga[] = [];
  // equiposJuegoDeCompeticionLiga: EquipoJuegoDeCompeticionLiga[] = [];
  // alumnosDelJuego: Alumno[];
  // equiposDelJuego: Equipo[];

  listaAlumnosJuegoDePuntos: AlumnoJuegoDePuntos[];
  listaEquiposJuegoDePuntos: EquipoJuegoDePuntos[];
  listaAlumnosJuegoDeCuestionario: AlumnoJuegoDeCuestionario[];
  juegosDisponibles: Juego[];
  juegosActivosPuntosModo: Juego[];
  NumeroDeJuegoDePuntos: number;
  // AlumnoJuegoDeCompeticionLigaId: number;

  dataSourceTablaGanadorIndividual;
  dataSourceTablaGanadorEquipo;


  // displayedColumnsAlumno: string[] = ['select1', 'nombreJugadorUno', 'select2', 'nombreJugadorDos', 'select3', 'Empate'];
  displayedColumnsAlumno: string[] = ['select1', 'nombreJugadorUno', 'select2', 'nombreJugadorDos', 'select3', 'Empate'];

  asignados: boolean;

  constructor( public sesion: SesionService,
               public location: Location,
               public calculos: CalculosService,
               public peticionesAPI: PeticionesAPIService) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.numeroTotalJornadas = this.juegoSeleccionado.NumeroTotalJornadas;
    const datos = this.sesion.DameDatosJornadas();
    this.JornadasCompeticion = datos.JornadasCompeticion;
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.listaAlumnosClasificacion = this.sesion.DameTablaAlumnoJuegoDeCompeticion();
    } else {
      this.listaEquiposClasificacion = this.sesion.DameTablaEquipoJuegoDeCompeticion();
    } // Selecciono los juegos entre los que puedo elegir para decidir resultados
    // Son los juegos de puntos (tanto activos como acabados) y los juegos de cuestionario acabados
    this.juegosDisponibles = this.sesion.DameJuegosDePuntos().filter (juego => juego.Modo === this.juegoSeleccionado.Modo);
    // tslint:disable-next-line:max-line-length
    this.juegosDisponibles = this.juegosDisponibles.concat (this.sesion.DameJuegosDeCuestionariosAcabados());
    console.log ('Juegos para elegir ganadores ');
    console.log (this.juegosDisponibles);
    this.asignados = false;
  }

  ////////////////// FUNCIONES PARA OBTENER LOS DATOS NECESARIOS //////////////////////////
  ObtenerEnfrentamientosDeCadaJornada(jornadaId: number) {
    this.peticionesAPI.DameEnfrentamientosDeCadaJornadaLiga(jornadaId)
    .subscribe(enfrentamientos => {
      this.EnfrentamientosJornadaSeleccionada = enfrentamientos;
      this.ConstruirTablaElegirGanador();
    });
  }

  // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen
  RecuperarInscripcionesAlumnosJuegoPuntos() {
    console.log ('voy a por las inscripciones ' + Number(this.juegoDisponibleSeleccionadoID));
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDePuntos(Number(this.juegoDisponibleSeleccionadoID))
    .subscribe(inscripciones => {
      this.listaAlumnosJuegoDePuntos = inscripciones;
      console.log (this.listaAlumnosJuegoDePuntos);
    });
  }

  // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen
  RecuperarInscripcionesEquiposJuegoPuntos() {
    console.log ('vamos por las inscripciones ' + Number(this.juegoDisponibleSeleccionadoID));
    this.peticionesAPI.DameInscripcionesEquipoJuegoDePuntos(Number(this.juegoDisponibleSeleccionadoID))
    .subscribe(inscripciones => {
      this.listaEquiposJuegoDePuntos = inscripciones;
      console.log(this.listaEquiposJuegoDePuntos);
      console.log ('ya tengo las inscripciones');
    });
  }

  RecuperarInscripcionesAlumnosJuegoCuestionario() {
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeCuestionario(this.juegoDisponibleSeleccionadoID)
    .subscribe(inscripciones => {
      this.listaAlumnosJuegoDeCuestionario = inscripciones;
    });
  }

  Disputada(jornadaId): boolean {
      return this.JornadasCompeticion.filter (jornada => jornada.id === Number(jornadaId))[0].Disputada;
  }

  ConstruirTablaElegirGanador() {
    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('Estoy en ConstruirTablaElegirGanador() alumnos');
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {
        // tslint:disable-next-line:max-line-length
        const JugadorUno = this.listaAlumnosClasificacion.filter (alumno => alumno.id === this.EnfrentamientosJornadaSeleccionada[i].JugadorUno )[0];
        // tslint:disable-next-line:max-line-length
        this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno = JugadorUno.nombre + ' ' + JugadorUno.primerApellido + ' ' + JugadorUno.segundoApellido;
        // tslint:disable-next-line:max-line-length
        const JugadorDos = this.listaAlumnosClasificacion.filter (alumno => alumno.id === this.EnfrentamientosJornadaSeleccionada[i].JugadorDos)[0];
        // tslint:disable-next-line:max-line-length
        this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos = JugadorDos.nombre + ' ' + JugadorDos.primerApellido + ' ' + JugadorDos.segundoApellido;
      }
      console.log(this.EnfrentamientosJornadaSeleccionada);
      this.dataSourceTablaGanadorIndividual = new MatTableDataSource(this.EnfrentamientosJornadaSeleccionada);
      console.log('El dataSource es:');
      console.log(this.dataSourceTablaGanadorIndividual.data);

      // Ahora vamos a marcar los resultados en caso de que la jornada se haya disputado ya


      if (this.Disputada (this.jornadaId)) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {
          if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === this.EnfrentamientosJornadaSeleccionada[i].JugadorUno) {
            this.selectionUno.select(this.dataSourceTablaGanadorIndividual.data[i]);
          } else if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === this.EnfrentamientosJornadaSeleccionada[i].JugadorDos) {
            this.selectionDos.select(this.dataSourceTablaGanadorIndividual.data[i]);
          } else if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === 0) {
            this.selectionTres.select(this.dataSourceTablaGanadorIndividual.data[i]);
          }
        }
      }

    } else {
      console.log('Estoy en ConstruirTablaElegirGanador() equipos');
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {
         // tslint:disable-next-line:max-line-length
         const EquipoUno = this.listaEquiposClasificacion.filter (equipo => equipo.id === this.EnfrentamientosJornadaSeleccionada[i].JugadorUno )[0];
         // tslint:disable-next-line:max-line-length
         this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno = EquipoUno.nombre;
         // tslint:disable-next-line:max-line-length
         const EquipoDos = this.listaEquiposClasificacion.filter (equipo => equipo.id === this.EnfrentamientosJornadaSeleccionada[i].JugadorDos)[0];
         // tslint:disable-next-line:max-line-length
         this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos = EquipoDos.nombre;
      }
      console.log(this.EnfrentamientosJornadaSeleccionada);
      this.dataSourceTablaGanadorEquipo = new MatTableDataSource(this.EnfrentamientosJornadaSeleccionada);
      console.log('El dataSource es:');
      console.log(this.dataSourceTablaGanadorEquipo.data);
      if (this.Disputada (this.jornadaId)) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {
          if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === this.EnfrentamientosJornadaSeleccionada[i].JugadorUno) {
            this.selectionUno.select(this.dataSourceTablaGanadorEquipo.data[i]);
          } else if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === this.EnfrentamientosJornadaSeleccionada[i].JugadorDos) {
            this.selectionDos.select(this.dataSourceTablaGanadorEquipo.data[i]);
          } else if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === 0) {
            this.selectionTres.select(this.dataSourceTablaGanadorEquipo.data[i]);
          }
        }
      }

    }
  }

  ActualizarTablaClasificacion() {
    console.log('Estoy en ActualizarTablaClasificacion()');
    const jornadaActualizada = this.JornadasCompeticion.filter (jornada => jornada.id === Number(this.jornadaId))[0];
    jornadaActualizada.Disputada = true;
    for (let i = 0; i < this.JornadasCompeticion.length; i++) {
      if (this.JornadasCompeticion[i].id === Number(this.jornadaId)) {
        this.JornadasCompeticion[i] = jornadaActualizada;
      }
    }
  }

  //////// FUNCIONES PARA CONTROLAR LOS BOTONES Y LOS CHECKBOX ////////////////////////////


  // Esta función se ejecuta al seleccionar el modo de asignación
  SeleccionaModo() {
    console.log ('SeleccionaModo' + this.modoAsignacionId);
    // activamos el boton correspondiente si se eligió manual ao aleatorio
    if (Number(this.modoAsignacionId) === 1) { // Manual
        this.botonAsignarAleatorioDesactivado = true;
        this.botonAsignarManualDesactivado = false;
        this.botonAsignarJuegoDesactivado = true;
    } else if (Number(this.modoAsignacionId) === 2) { // Aleatorio
        this.botonAsignarManualDesactivado = true;
        this.botonAsignarAleatorioDesactivado = false;
        this.botonAsignarJuegoDesactivado = true;
    // Si se elijió asignación por juego de puntos y no hay juego de puntos para elegir se muestra una alarma
    // Si  hay juego de puntos no se hace nada porque ya aparecerá automáticamente el selector del juego
      } else if ((Number(this.modoAsignacionId) === 3) && (this.juegosDisponibles.length === 0)) { // JuegoPuntos
        this.botonAsignarManualDesactivado = true;
        this.botonAsignarAleatorioDesactivado = true;
        this.botonAsignarJuegoDesactivado = true;
        console.log ('Aviso');
        Swal.fire('Cuidado', 'No hay juegos finalizados disponibles para este grupo', 'warning');
      } else {
        console.log ('Salgo');
        console.log ('juegos disponibles');
        console.log (this.juegosDisponibles);
      }
  }

  // Me traigo el juego elegido para decidir los resultados de la jornada
  TraerJuegoDisponibleSeleccionado() {
    this.ObtenerEnfrentamientosDeCadaJornada(this.jornadaId);
    this.botonAsignarManualDesactivado = true;
    this.botonAsignarAleatorioDesactivado = true;
    this.botonAsignarJuegoDesactivado = false;
    console.log ('ID del juego seleccionado ' + this.juegoDisponibleSeleccionadoID);
    console.log (this.juegosDisponibles);
    this.juegoDisponibleSeleccionado = this.juegosDisponibles.filter (juego => juego.id === Number (this.juegoDisponibleSeleccionadoID))[0];
    console.log ('ya he seleccionado el juego');
    console.log (this.juegoDisponibleSeleccionado);
    if ( this.juegoDisponibleSeleccionado.Tipo === 'Juego De Puntos') {
      if (this.juegoSeleccionado.Modo === 'Individual') {
        this.RecuperarInscripcionesAlumnosJuegoPuntos();
      } else {
        this.RecuperarInscripcionesEquiposJuegoPuntos();
      }
    } else {
      // Tiene que ser de cuestionario, y de momento solo hay individual
      this.RecuperarInscripcionesAlumnosJuegoCuestionario();
    }
  }

  /* Esta función decide si los botones deben estar activos (si se ha seleccionado la jornada)
     o si debe estar desactivado (si no se ha seleccionado la jornada) */
  SeleccionaJornada() {
      console.log('Estoy en actualizar botón');
      // if (this.Disputada (this.jornadaId)) {
      //   this.ObtenerEnfrentamientosDeCadaJornada(this.jornadaId);
      // }
      this.ObtenerEnfrentamientosDeCadaJornada(this.jornadaId);
      console.log(this.modoAsignacionId);
      if (this.modoAsignacionId === undefined || this.jornadaId === undefined) {
        this.botonAsignarAleatorioDesactivado = true;
        this.botonAsignarManualDesactivado = true;
        this.botonAsignarJuegoDesactivado = true;
      } else if (Number(this.modoAsignacionId) === 1) { // Manual
        console.log('Modo manual');
        this.botonAsignarAleatorioDesactivado = true;
        this.botonAsignarManualDesactivado = false;
        this.botonAsignarJuegoDesactivado = true;
        this.ObtenerEnfrentamientosDeCadaJornada(this.jornadaId);
      } else if (Number(this.modoAsignacionId) === 2) { // Aleatorio
        console.log('Modo aleatorio');
        this.botonAsignarManualDesactivado = true;
        this.botonAsignarAleatorioDesactivado = false;
        this.botonAsignarJuegoDesactivado = true;
        this.ObtenerEnfrentamientosDeCadaJornada(this.jornadaId);
      } else if (Number(this.modoAsignacionId) === 3 && this.juegosDisponibles.length !== 0) { // JuegoPuntos
        console.log('Modo puntos');
        this.botonAsignarManualDesactivado = true;
        this.botonAsignarAleatorioDesactivado = true;
        this.botonAsignarJuegoDesactivado = false;
        this.ObtenerEnfrentamientosDeCadaJornada(this.jornadaId);
        this.ActualizarBotonJuego();
      } else if (Number(this.modoAsignacionId) === 3 && this.juegosDisponibles.length === 0) { // JuegoPuntos
        this.botonAsignarManualDesactivado = true;
        this.botonAsignarAleatorioDesactivado = true;
        this.botonAsignarJuegoDesactivado = true;
        Swal.fire('Cuidado', 'No hay juegos disponibles para este este grupo', 'warning');
      }
  }

  ActualizarBotonJuego() {
    this.juegoDisponibleSeleccionado = this.juegosDisponibles.filter (juego => juego.id === Number (this.juegoDisponibleSeleccionadoID))[0];
    console.log ('ya he seleccionado el juego');
    console.log (this.juegoDisponibleSeleccionado);
    if ( this.juegoDisponibleSeleccionado.Tipo === 'Juego De Puntos') {
      if (this.juegoSeleccionado.Modo === 'Individual') {
        this.RecuperarInscripcionesAlumnosJuegoPuntos();
      } else {
        this.RecuperarInscripcionesEquiposJuegoPuntos();
      }
    } else {
      // Tiene que ser de cuestionario, y de momento solo hay individual
      this.RecuperarInscripcionesAlumnosJuegoCuestionario();
    }
  }

  // Cuando marco una casilla desmarco las otras casillas de esa fila
   Verificar(row, n) {
    if (n === 1) {
      this.selectionDos.deselect(row);
      this.selectionTres.deselect(row);
    }
    if (n === 2) {
      this.selectionUno.deselect(row);
      this.selectionTres.deselect(row);
    }
    if (n === 3) {
      this.selectionUno.deselect(row);
      this.selectionDos.deselect(row);
    }
  }


  // Me traigo el juego elegido para decidir los resultados de la jornada
  // TraerJuegoDisponibleSeleccionado() {
  //   this.botonAsignarManualDesactivado = true;
  //   this.botonAsignarAleatorioDesactivado = true;
  //   this.botonAsignarPuntosDesactivado = false;
  //   console.log ('ID del juego seleccionado ' + this.juegoDisponibleSeleccionadoID);
  //   console.log (this.juegosDisponibles);
  // tslint:disable-next-line:max-line-length
  //   this.juegoDisponibleSeleccionado = this.juegosDisponibles.filter (juego => juego.id === Number (this.juegoDisponibleSeleccionadoID))[0];
  //   console.log ('ya he seleccionado el juego');
  //   console.log (this.juegoDisponibleSeleccionado);
  //   if ( this.juegoDisponibleSeleccionado.Tipo === 'Juego De Puntos') {
  //     if (this.juegoSeleccionado.Modo === 'Individual') {
  //       this.RecuperarInscripcionesAlumnosJuegoPuntos();
  //     } else {
  //       this.RecuperarInscripcionesEquiposJuegoPuntos();
  //     }
  //   } else {
  //     // Tiene que ser de cuestionario, y de momento solo hay individual
  //     this.RecuperarInscripcionesAlumnosJuegoCuestionario();
  //   }
  // }

  ////////////// FUNCIONES PARA ASIGNAR LOS RESULTADOS ///////////////////////////

  AsignarGanadorManualmente() {
    // tslint:disable-next-line:no-inferrable-types
    let error: boolean = false;
    const resultados: number[] = [];
    let dataSource: any;
    if (this.juegoSeleccionado.Modo === 'Individual') {
      dataSource = this.dataSourceTablaGanadorIndividual;
    } else {
      dataSource = this.dataSourceTablaGanadorEquipo;
    }
      // tslint:disable-next-line:prefer-for-of
    dataSource.data.forEach (row => {
        if (this.selectionUno.isSelected(row)) {
              resultados.push (1);
        } else  if (this.selectionDos.isSelected(row)) {
              resultados.push (2);
        } else if (this.selectionTres.isSelected(row)) {
              resultados.push (0);
        } else {

              Swal.fire('Cuidado', 'No se han seleccionado resultados para todos los enfrentamientos de la jornada', 'warning');
              error = true;
        }
    });
    console.log(resultados);
    console.log('resultados');

    if (!error) {
      this.calculos.AsignarResultadosJornadaLiga(this.juegoSeleccionado , this.jornadaId, resultados);
      this.ActualizarTablaClasificacion();
      Swal.fire('Enhorabuena', 'Resutados asignados manualmente', 'success');
      this.asignados = true;

    }

  }

  AsignarGanadorAleatoriamente() {
    // tslint:disable-next-line:prefer-for-of
    const resultados: number[] = [];
    for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {
      const random = Math.random();
      console.log('Random ' + i + ' = ' + random);
      if (random < 0.33) {
        resultados.push (1);
        if (this.juegoSeleccionado.Modo === 'Individual') {
          this.selectionUno.select(this.dataSourceTablaGanadorIndividual.data[i]);
        } else {
          this.selectionUno.select(this.dataSourceTablaGanadorEquipo.data[i]);
        }

      } else if (random > 0.66) {
        resultados.push (2);
        if (this.juegoSeleccionado.Modo === 'Individual') {
          this.selectionDos.select(this.dataSourceTablaGanadorIndividual.data[i]);
        } else {
          this.selectionDos.select(this.dataSourceTablaGanadorEquipo.data[i]);
        }

      } else {
        resultados.push (0);
        if (this.juegoSeleccionado.Modo === 'Individual') {
          this.selectionTres.select(this.dataSourceTablaGanadorIndividual.data[i]);
        } else {
          this.selectionTres.select(this.dataSourceTablaGanadorEquipo.data[i]);
        }
      }
    }

    this.calculos.AsignarResultadosJornadaLiga(this.juegoSeleccionado , this.jornadaId, resultados);
    this.ActualizarTablaClasificacion();
    Swal.fire('Enhorabuena', 'Resutados asignados aleatoriamente', 'success');
    this.asignados = true;

  }

  AsignarGanadoresJuegoDisponibleSeleccionado() {
    const resultados: number [] = [];

    if (this.juegoDisponibleSeleccionado.Tipo === 'Juego De Puntos') {

      if (this.juegoDisponibleSeleccionado.Modo === 'Individual') {

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {

          // Saco al jugador uno de la lista de participantes del juego de puntos
          // tslint:disable-next-line:max-line-length

          // tslint:disable-next-line:max-line-length
          const JugadorUno = this.listaAlumnosJuegoDePuntos.filter (a => a.alumnoId === Number (this.EnfrentamientosJornadaSeleccionada[i].JugadorUno))[0];
          // tslint:disable-next-line:max-line-length
          const JugadorDos = this.listaAlumnosJuegoDePuntos.filter (a => a.alumnoId === Number (this.EnfrentamientosJornadaSeleccionada[i].JugadorDos))[0];

          if (JugadorUno.PuntosTotalesAlumno > JugadorDos.PuntosTotalesAlumno) {
            resultados.push (1);
            this.selectionUno.select(this.dataSourceTablaGanadorIndividual.data[i]);

          } else  if (JugadorUno.PuntosTotalesAlumno < JugadorDos.PuntosTotalesAlumno) {
            resultados.push (2);
            this.selectionDos.select(this.dataSourceTablaGanadorIndividual.data[i]);

          } else {
            resultados.push (0);
            this.selectionTres.select(this.dataSourceTablaGanadorIndividual.data[i]);
          }
        }
      } else {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {

          // Saco al jugador uno de la lista de participantes del juego de puntos
          // tslint:disable-next-line:max-line-length
          const equipoUno = this.listaEquiposJuegoDePuntos.filter (a => a.equipoId === this.EnfrentamientosJornadaSeleccionada[i].JugadorUno)[0];
          // tslint:disable-next-line:max-line-length
          const equipoDos = this.listaEquiposJuegoDePuntos.filter (a => a.equipoId === this.EnfrentamientosJornadaSeleccionada[i].JugadorDos)[0];

          if (equipoUno.PuntosTotalesEquipo > equipoDos.PuntosTotalesEquipo) {
            resultados.push (1);
            this.selectionUno.select(this.dataSourceTablaGanadorEquipo.data[i]);

          } else  if (equipoUno.PuntosTotalesEquipo < equipoDos.PuntosTotalesEquipo) {
            resultados.push (2);
            this.selectionDos.select(this.dataSourceTablaGanadorEquipo.data[i]);

          } else {
            resultados.push (0);
            this.selectionTres.select(this.dataSourceTablaGanadorEquipo.data[i]);
          }
        }
      }
    } else {
      // El juego elegido es de cuestionario
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {

        // Saco al jugador uno de la lista de participantes del juego de puntos
        // tslint:disable-next-line:max-line-length

        // tslint:disable-next-line:max-line-length
        const JugadorUno = this.listaAlumnosJuegoDeCuestionario.filter (a => a.alumnoId === Number (this.EnfrentamientosJornadaSeleccionada[i].JugadorUno))[0];
        // tslint:disable-next-line:max-line-length
        const JugadorDos = this.listaAlumnosJuegoDeCuestionario.filter (a => a.alumnoId === Number (this.EnfrentamientosJornadaSeleccionada[i].JugadorDos))[0];

        if (JugadorUno.Nota > JugadorDos.Nota) {
          resultados.push (1);
          this.selectionUno.select(this.dataSourceTablaGanadorIndividual.data[i]);

        } else  if (JugadorUno.Nota < JugadorDos.Nota) {
          resultados.push (2);
          this.selectionDos.select(this.dataSourceTablaGanadorIndividual.data[i]);

        } else {
          resultados.push (0);
          this.selectionTres.select(this.dataSourceTablaGanadorIndividual.data[i]);
        }
      }
    }
    this.calculos.AsignarResultadosJornadaLiga(this.juegoSeleccionado , this.jornadaId, resultados);
    this.ActualizarTablaClasificacion();
    // Swal.fire('Resutados asignados', 'Enhorabuena', 'success');
    Swal.fire('Enhorabuena', 'Resutados asignados mediante juego de puntos', 'success');
    this.asignados = true;
  }



  goBack() {
    if (this.jornadaId === undefined) {
      this.location.back();
    } else if (!this.asignados && !this.Disputada(this.jornadaId)) {
      Swal.fire({
        title: '¿Estas seguro?',
        text: 'No has realizado la asignación',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, estoy seguro'
      }).then((result) => {
        if (result.value) {
          this.location.back();
        }
      });
    } else {
      this.location.back();
    }
  }

   ///////////////////////////////////////////////////  MEDIANTE JUEGO DE PUNTOS  /////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////  MANUALMENTE  /////////////////////////////////////////////////////////

  /* Esta función decide si los botones deben estar activos (si se ha seleccionado la jornada)
     o si debe estar desactivado (si no se ha seleccionado la jornada) */
  // ActualizarBotonManual() {
  //   console.log('Estoy en actualizar botón');
  //   console.log(this.jornadaId);
  //   // if ((this.selection.selected.length === 0) || this.jornadaId === undefined) {
  //   if (this.jornadaId === undefined) {
  //     this.botonAsignarManualDesactivado = true;
  //   } else {
  //     this.botonAsignarManualDesactivado = false;
  //     this.ObtenerEnfrentamientosDeCadaJornada(this.jornadaId);
  //   }
  //   console.log(this.botonAsignarAleatorioDesactivado);
  // }

  // ------------------------------------------------ Metodología antigua ------------------------------------------------------- //
  // RevisarMultipleSeleccion() {
  //   console.log('Selección en ColumnaUno');
  //   console.log(this.enfrentamientosSeleccionadosColumnaUno);
  //   console.log('Selección en ColumnaDos');
  //   console.log(this.enfrentamientosSeleccionadosColumnaDos);
  //   console.log('Selección en ColumnaTres');
  //   console.log(this.enfrentamientosSeleccionadosColumnaTres);

  //   this.avisoMasDeUnGanadorMarcadoDosEmpate = false;
  //   this.avisoMasDeUnGanadorMarcadoUnoDos = false;
  //   this.avisoMasDeUnGanadorMarcadoUnoEmpate = false;

  //   // Segundo miramos si solo hay una selección por enfrentamiento
  //   // tslint:disable-next-line:prefer-for-of
  //   for (let i = 0; i < this.enfrentamientosSeleccionadosColumnaUno.length; i++) {
  //     // tslint:disable-next-line:prefer-for-of
  //     for (let j = 0; j < this.enfrentamientosSeleccionadosColumnaDos.length; j++) {
  //       if (this.enfrentamientosSeleccionadosColumnaUno[i].id === this.enfrentamientosSeleccionadosColumnaDos[j].id) {
  //           this.avisoMasDeUnGanadorMarcadoUnoDos = true;
  //           console.log('Hay alguna selección con ganadorUno y ganadorDos, poner el sweatalert');
  //           console.log(this.enfrentamientosSeleccionadosColumnaDos[j]);
  //           console.log(this.enfrentamientosSeleccionadosColumnaUno[i].id);
  //       }
  //     }
  //     // tslint:disable-next-line:prefer-for-of
  //     for (let k = 0; k < this.enfrentamientosSeleccionadosColumnaTres.length; k++) {
  //       if (this.enfrentamientosSeleccionadosColumnaUno[i].id === this.enfrentamientosSeleccionadosColumnaTres[k].id) {
  //           this.avisoMasDeUnGanadorMarcadoUnoEmpate = true;
  //           console.log('Hay alguna selección con ganadorUno y Empate, poner el sweatalert');
  //           console.log(this.enfrentamientosSeleccionadosColumnaUno[i]);
  //           console.log(this.enfrentamientosSeleccionadosColumnaTres[k].id);
  //       }
  //     }
  //   }

  //   // tslint:disable-next-line:prefer-for-of
  //   for (let i = 0; i < this.enfrentamientosSeleccionadosColumnaDos.length; i++) {
  //     // tslint:disable-next-line:prefer-for-of
  //     for (let j = 0; j < this.enfrentamientosSeleccionadosColumnaTres.length; j++) {
  //       if (this.enfrentamientosSeleccionadosColumnaDos[i].id === this.enfrentamientosSeleccionadosColumnaTres[j].id) {
  //           this.avisoMasDeUnGanadorMarcadoUnoEmpate = true;
  //           console.log('Hay alguna selección con ganadorDos y Empate, poner sweatalert');
  //           console.log(this.enfrentamientosSeleccionadosColumnaDos[i]);
  //           console.log(this.enfrentamientosSeleccionadosColumnaTres[j].id);
  //       }
  //     }
  //   }

  //   // tslint:disable-next-line:max-line-length
  //   console.log('avisoMasDeUnGanadorMarcadoUnoEmpate = ' + this.avisoMasDeUnGanadorMarcadoUnoEmpate);
  //   console.log('avisoMasDeUnGanadorMarcadoDosEmpate = ' + this.avisoMasDeUnGanadorMarcadoDosEmpate);
  //   console.log('avisoMasDeUnGanadorMarcadoUnoDos = ' + this.avisoMasDeUnGanadorMarcadoUnoDos);

  //   if (this.avisoMasDeUnGanadorMarcadoDosEmpate === false && this.avisoMasDeUnGanadorMarcadoUnoDos === false
  //     && this.avisoMasDeUnGanadorMarcadoUnoEmpate === false) {
  //       return false;
  //   } else {
  //       return true;
  //   }
  // }

  // AsignarGanadorManualmenteAntigua() {
  //   let Resultados: {
  //     buenos: string
  //     malos: string
  //   } = {buenos: '', malos: 'os enfrentamientos: '};
  //   /////////////////////////////////////////////////////   INDIVIDUAL   //////////////////////////////////////////////////
  //   if (this.juegoSeleccionado.Modo === 'Individual') {
  //     const seleccionMultiple = this.calculos.RevisarMultipleSeleccion(this.enfrentamientosSeleccionadosColumnaUno,
  //                                                                      this.enfrentamientosSeleccionadosColumnaDos,
  //                                                                      this.enfrentamientosSeleccionadosColumnaTres);

  //     if (seleccionMultiple === false) {
  //           // -------------------------------- GANADOR UNO ----------------------------------- //
  //           if (this.enfrentamientosSeleccionadosColumnaUno.length > 0) {
  //             Resultados = this.calculos.AsignarGanadorIndividual(this.enfrentamientosSeleccionadosColumnaUno,
  //                                                                              this.EnfrentamientosJornadaSeleccionada,
  //                                                                              this.listaAlumnosClasificacion,
  //                                                                              this.alumnosJuegoDeCompeticionLiga,
  //                                                                              this.juegoSeleccionado, 1, Resultados);
  //           }


  //           // -------------------------------- GANADOR DOS ----------------------------------- //
  //           if (this.enfrentamientosSeleccionadosColumnaDos.length > 0) {
  //             Resultados = this.calculos.AsignarGanadorIndividual(this.enfrentamientosSeleccionadosColumnaDos,
  //                                                                 this.EnfrentamientosJornadaSeleccionada,
  //                                                                 this.listaAlumnosClasificacion,
  //                                                                 this.alumnosJuegoDeCompeticionLiga,
  //                                                                 this.juegoSeleccionado, 2, Resultados);
  //           }


  //           // ----------------------------------- EMPATE ------------------------------------- //
  //           if (this.enfrentamientosSeleccionadosColumnaTres.length > 0) {
  //             Resultados = this.calculos.AsignarEmpateIndividual(this.enfrentamientosSeleccionadosColumnaTres,
  //                                                   this.EnfrentamientosJornadaSeleccionada,
  //                                                   this.listaAlumnosClasificacion,
  //                                                   this.alumnosJuegoDeCompeticionLiga,
  //                                                   this.juegoSeleccionado, Resultados);
  //           }
  //           console.log('Resultados buenos: ' + Resultados.buenos);
  //           console.log('Resultados malos: ' + Resultados.malos);

  //           if (Resultados.buenos !== '' && Resultados.malos === 'os enfrentamientos: ') {
  //             console.log('Los Resultados son: ' + Resultados.buenos);
  //             Swal.fire(Resultados.buenos, 'Estos son los resultados', 'success');
  //           } else if (Resultados.buenos === '' && Resultados.malos !== 'os enfrentamientos: ') {
  //             Swal.fire('L' + Resultados.malos + ' ya tienen asignado un gandaor',
  //             'No se ha podido asignar ganador a estos enfrentamientos', 'error');
  //           } else if (Resultados.buenos !== '' && Resultados.malos !== 'os enfrentamientos: ') {
  //             Swal.fire(Resultados.buenos, 'No se ha podido asignar ganador a l' + Resultados.malos +
  //                       ' porque ya tienen asignado un gandaor. ', 'success');
  //           } else if (Resultados.buenos === '' && Resultados.malos === 'os enfrentamientos: ') {
  //             Swal.fire('No se ha seleccionado ningún ganador', '', 'error');
  //           }
  //     } else {
  //         Swal.fire('Hay más de una selección en alguno de los enfrentamientos', ' No se ha podido realizar esta acción', 'error');
  //         console.log('Hay más de una selección en alguno de los enfrentamientos');
  //     }///////////////////////////////////////////////////////   EQUIPOS   ////////////////////////////////////////////////////
  //   } else {
  //     const seleccionMultiple = this.calculos.RevisarMultipleSeleccion(this.enfrentamientosSeleccionadosColumnaUno,
  //                                                                      this.enfrentamientosSeleccionadosColumnaDos,
  //                                                                      this.enfrentamientosSeleccionadosColumnaTres);
  //     console.log(seleccionMultiple);
  //     if (seleccionMultiple === false) {
  //           // -------------------------------- GANADOR UNO ----------------------------------- //
  //           if (this.enfrentamientosSeleccionadosColumnaUno.length > 0) {
  //             console.log('Estoy dentro de seleccionados columna uno');
  //             Resultados = this.calculos.AsignarGanadorEquipos(this. enfrentamientosSeleccionadosColumnaUno,
  //                                                              this.EnfrentamientosJornadaSeleccionada,
  //                                                              this.listaEquiposClasificacion,
  //                                                              this.equiposJuegoDeCompeticionLiga,
  //                                                              this.juegoSeleccionado, 1, Resultados);
  //           }

  //           // -------------------------------- GANADOR DOS ----------------------------------- //
  //           if (this.enfrentamientosSeleccionadosColumnaDos.length > 0) {
  //             this.calculos.AsignarGanadorEquipos(this. enfrentamientosSeleccionadosColumnaDos, this.EnfrentamientosJornadaSeleccionada,
  //                                                 this.listaEquiposClasificacion,
  //                                                 this.equiposJuegoDeCompeticionLiga,
  //                                                 this.juegoSeleccionado, 2, Resultados);
  //           }

  //           // ----------------------------------- EMPATE ------------------------------------- //
  //           if (this.enfrentamientosSeleccionadosColumnaTres.length > 0) {
  //             this.calculos.AsignarEmpateEquipos(this.enfrentamientosSeleccionadosColumnaTres,
  //                                               this.EnfrentamientosJornadaSeleccionada,
  //                                               this.listaEquiposClasificacion,
  //                                               this.equiposJuegoDeCompeticionLiga,
  //                                               this.juegoSeleccionado, Resultados) ;
  //           }
  //           console.log('Resultados buenos: ' + Resultados.buenos);
  //           console.log('Resultados malos: ' + Resultados.malos);

  //           if (Resultados.buenos !== '' && Resultados.malos === 'os enfrentamientos: ') {
  //             console.log('Los Resultados son: ' + Resultados.buenos);
  //             Swal.fire(Resultados.buenos, 'Estos son los resultados', 'success');
  //           } else if (Resultados.buenos === '' && Resultados.malos !== 'os enfrentamientos: ') {
  //             Swal.fire('L' + Resultados.malos + ' ya tienen asignado un gandaor',
  //             'No se ha podido asignar ganador a estos enfrentamientos', 'error');
  //           } else if (Resultados.buenos !== '' && Resultados.malos !== 'os enfrentamientos: ') {
  //             Swal.fire(Resultados.buenos, 'No se ha podido asignar ganador a l' + Resultados.malos +
  //                       ' porque ya tienen asignado un gandaor. ', 'success');
  //           } else if (Resultados.buenos === '' && Resultados.malos === 'os enfrentamientos: ') {
  //             Swal.fire('No se ha seleccionado ningún ganador', '', 'error');
  //           }
  //     } else {
  //       Swal.fire('Hay más de una selección en alguno de los enfrentamientos', ' No se ha podido realizar esta acción', 'error');
  //       console.log('Hay más de una selección en alguno de los enfrentamientos');
  //     }
  //   }
  // }

  // AddToListGanadorUno() {
  //   if (this.juegoSeleccionado.Modo === 'Individual') {
  //     // tslint:disable-next-line:prefer-for-of
  //     for ( let i = 0; i < this.dataSourceTablaGanadorIndividual.data.length; i++) {
  //       if (this.selectionUno.isSelected(this.dataSourceTablaGanadorIndividual.data[i]))  {
  //         const indexOfUnselected = this.enfrentamientosSeleccionadosColumnaUno.indexOf(this.dataSourceTablaGanadorIndividual.data[i]);
  //         if (indexOfUnselected === -1) {
  //           this.enfrentamientosSeleccionadosColumnaUno.push(this.dataSourceTablaGanadorIndividual.data[i]);
  //         } else {
  //           this.enfrentamientosSeleccionadosColumnaUno.splice(indexOfUnselected, 1);
  //         }
  //         this.selectionUno.deselect(this.dataSourceTablaGanadorIndividual.data[i]);
  //       }
  //     }
  //   } else {
  //     // tslint:disable-next-line:prefer-for-of
  //     for ( let j = 0; j < this.dataSourceTablaGanadorEquipo.data.length; j++) {
  //       if (this.selectionUno.isSelected(this.dataSourceTablaGanadorEquipo.data[j])) {
  //         console.log ('Gana el 1');
  //         const indexOfUnselected = this.enfrentamientosSeleccionadosColumnaUno.indexOf(this.dataSourceTablaGanadorEquipo.data[j]);
  //         if (indexOfUnselected === -1) {
  //           this.enfrentamientosSeleccionadosColumnaUno.push(this.dataSourceTablaGanadorEquipo.data[j]);
  //         } else {
  //           this.enfrentamientosSeleccionadosColumnaUno.splice(indexOfUnselected, 1);
  //         }
  //         this.selectionUno.deselect(this.dataSourceTablaGanadorEquipo.data[j]);
  //       }
  //     }
  //   }
  // }

  // AddToListGanadorDos() {
  //   if (this.juegoSeleccionado.Modo === 'Individual') {
  //     // tslint:disable-next-line:prefer-for-of
  //     for ( let i = 0; i < this.dataSourceTablaGanadorIndividual.data.length; i++) {
  //       if (this.selectionDos.isSelected(this.dataSourceTablaGanadorIndividual.data[i]))  {
  //         const indexOfUnselected = this.enfrentamientosSeleccionadosColumnaDos.indexOf(this.dataSourceTablaGanadorIndividual.data[i]);
  //         if (indexOfUnselected === -1) {
  //           this.enfrentamientosSeleccionadosColumnaDos.push(this.dataSourceTablaGanadorIndividual.data[i]);
  //         } else {
  //           this.enfrentamientosSeleccionadosColumnaDos.splice(indexOfUnselected, 1);
  //         }
  //         this.selectionDos.deselect(this.dataSourceTablaGanadorIndividual.data[i]);
  //       }
  //     }
  //   } else {
  //     // tslint:disable-next-line:prefer-for-of
  //     for ( let i = 0; i < this.dataSourceTablaGanadorEquipo.data.length; i++) {
  //       if (this.selectionDos.isSelected(this.dataSourceTablaGanadorEquipo.data[i]))  {
  //         const indexOfUnselected = this.enfrentamientosSeleccionadosColumnaDos.indexOf(this.dataSourceTablaGanadorEquipo.data[i]);
  //         if (indexOfUnselected === -1) {
  //           this.enfrentamientosSeleccionadosColumnaDos.push(this.dataSourceTablaGanadorEquipo.data[i]);
  //         } else {
  //           this.enfrentamientosSeleccionadosColumnaDos.splice(indexOfUnselected, 1);
  //         }
  //         this.selectionDos.deselect(this.dataSourceTablaGanadorEquipo.data[i]);
  //       }
  //     }
  //   }
  // }

  // AddToListGanadorTres() {
  //   if (this.juegoSeleccionado.Modo === 'Individual') {
  //     // tslint:disable-next-line:prefer-for-of
  //     for ( let i = 0; i < this.dataSourceTablaGanadorIndividual.data.length; i++) {
  //       if (this.selectionTres.isSelected(this.dataSourceTablaGanadorIndividual.data[i]))  {
  //         const indexOfUnselected = this.enfrentamientosSeleccionadosColumnaTres.indexOf(this.dataSourceTablaGanadorIndividual.data[i]);
  //         if (indexOfUnselected === -1) {
  //           this.enfrentamientosSeleccionadosColumnaTres.push(this.dataSourceTablaGanadorIndividual.data[i]);
  //         } else {
  //           this.enfrentamientosSeleccionadosColumnaTres.splice(indexOfUnselected, 1);
  //         }
  //         this.selectionTres.deselect(this.dataSourceTablaGanadorIndividual.data[i]);
  //       }
  //     }
  //   } else {
  //     // tslint:disable-next-line:prefer-for-of
  //     for ( let i = 0; i < this.dataSourceTablaGanadorEquipo.data.length; i++) {
  //       if (this.selectionTres.isSelected(this.dataSourceTablaGanadorEquipo.data[i]))  {
  //         const indexOfUnselected = this.enfrentamientosSeleccionadosColumnaTres.indexOf(this.dataSourceTablaGanadorEquipo.data[i]);
  //         if (indexOfUnselected === -1) {
  //           this.enfrentamientosSeleccionadosColumnaTres.push(this.dataSourceTablaGanadorEquipo.data[i]);
  //         } else {
  //           this.enfrentamientosSeleccionadosColumnaTres.splice(indexOfUnselected, 1);
  //         }
  //         this.selectionTres.deselect(this.dataSourceTablaGanadorEquipo.data[i]);
  //       }
  //     }
  //   }
  // }


  // /* Para averiguar si todas las filas están seleccionadas */
  // IsAllSelectedUno() {
  //   let numSelected = 0;
  //   let numRows = 0;
  //   // console.log('Estoy en IsAllSelectedUno()');
  //   if (this.juegoSeleccionado.Modo === 'Individual') {
  //     numSelected = this.selectionUno.selected.length;
  //     numRows = this.dataSourceTablaGanadorIndividual.data.length;
  //   } else {
  //     numSelected = this.selectionUno.selected.length;
  //     numRows = this.dataSourceTablaGanadorEquipo.data.length;
  //   }
  //   // console.log('this.selectionUno es:');
  //   // console.log(this.selectionUno);
  //   return numSelected === numRows;
  // }



  // /* Cuando se clica en el checkbox de cabecera hay que ver si todos los
  //   * checkbox estan acivados, en cuyo caso se desactivan todos, o si hay alguno
  //   * desactivado, en cuyo caso se activan todos */
  // MasterToggleUno() {
  //   if (this.IsAllSelectedUno()) {
  //     this.selectionUno.clear(); // Desactivamos todos
  //     // this.enfrentamientosSeleccionadosColumnaUno = [];
  //     // console.log('Los enfrentamientos con ganadorDos son (individual): ');
  //     // console.log(this.enfrentamientosSeleccionadosColumnaUno);
  //   } else {
  //     // activamos todos
  //     if (this.juegoSeleccionado.Modo === 'Individual') {
  //       this.dataSourceTablaGanadorIndividual.data.forEach(row => {
  //         this.selectionUno.select(row);
  //        // this.enfrentamientosSeleccionadosColumnaUno.push(row);
  //       });
  //       console.log('Los enfrentamientos con ganadorDos son (individual): ');
  //       console.log(this.enfrentamientosSeleccionadosColumnaUno);
  //     } else {
  //       this.dataSourceTablaGanadorEquipo.data.forEach(row => {
  //         this.selectionUno.select(row);
  //        // this.enfrentamientosSeleccionadosColumnaUno.push(row);
  //       });
  //       console.log('Los enfrentamientos con ganadorDos son (equipo): ');
  //       console.log(this.enfrentamientosSeleccionadosColumnaUno);
  //     }
  //   }
  // }

  /* Para averiguar si todas las filas están seleccionadas */
  // IsAllSelectedDos() {
  //   let numSelected = 0;
  //   let numRows = 0;
  //   // console.log('Estoy en IsAllSelectedUno()');
  //   if (this.juegoSeleccionado.Modo === 'Individual') {
  //     numSelected = this.selectionDos.selected.length;
  //     numRows = this.dataSourceTablaGanadorIndividual.data.length;
  //   } else {
  //     numSelected = this.selectionDos.selected.length;
  //     numRows = this.dataSourceTablaGanadorEquipo.data.length;
  //   }
  //   // console.log('this.selectionUno es:');
  //   // console.log(this.selectionUno);
  //   return numSelected === numRows;
  // }

  // /* Cuando se clica en el checkbox de cabecera hay que ver si todos los
  //   * checkbox estan acivados, en cuyo caso se desactivan todos, o si hay alguno
  //   * desactivado, en cuyo caso se activan todos */
  // MasterToggleDos() {
  //   if (this.IsAllSelectedDos()) {
  //     this.selectionDos.clear(); // Desactivamos todos
  //     // this.enfrentamientosSeleccionadosColumnaDos = [];
  //     console.log('Los enfrentamientos con ganadorDos son (individual): ');
  //     console.log(this.enfrentamientosSeleccionadosColumnaDos);
  //   } else {
  //     // activamos todos
  //     if (this.juegoSeleccionado.Modo === 'Individual') {
  //       this.dataSourceTablaGanadorIndividual.data.forEach(row => {
  //         this.selectionDos.select(row);
  //         // this.enfrentamientosSeleccionadosColumnaDos.push(row);
  //       });
  //       console.log('Los enfrentamientos con ganadorDos son (individual): ');
  //       console.log(this.enfrentamientosSeleccionadosColumnaDos);
  //     } else {
  //       this.dataSourceTablaGanadorEquipo.data.forEach(row => {
  //         this.selectionDos.select(row);
  //         // this.enfrentamientosSeleccionadosColumnaDos.push(row);
  //       });
  //       console.log('Los enfrentamientos con ganadorDos son (equipo): ');
  //       console.log(this.enfrentamientosSeleccionadosColumnaDos);
  //     }
  //   }
  // }

  // /* Para averiguar si todas las filas están seleccionadas */
  // IsAllSelectedTres() {
  //   let numSelected = 0;
  //   let numRows = 0;
  //   // console.log('Estoy en IsAllSelectedUno()');
  //   if (this.juegoSeleccionado.Modo === 'Individual') {
  //     numSelected = this.selectionTres.selected.length;
  //     numRows = this.dataSourceTablaGanadorIndividual.data.length;
  //   } else {
  //     numSelected = this.selectionTres.selected.length;
  //     numRows = this.dataSourceTablaGanadorEquipo.data.length;
  //   }
  //   // console.log('this.selectionUno es:');
  //   // console.log(this.selectionUno);
  //   return numSelected === numRows;
  // }

  // /* Cuando se clica en el checkbox de cabecera hay que ver si todos los
  //   * checkbox estan acivados, en cuyo caso se desactivan todos, o si hay alguno
  //   * desactivado, en cuyo caso se activan todos */
  // MasterToggleTres() {
  //   if (this.IsAllSelectedTres()) {
  //     this.selectionTres.clear(); // Desactivamos todos
  //     // this.enfrentamientosSeleccionadosColumnaTres = [];
  //     console.log('Los enfrentamientos con ganadorTres son (individual): ');
  //     console.log(this.enfrentamientosSeleccionadosColumnaTres);
  //   } else {
  //     // activamos todos
  //     if (this.juegoSeleccionado.Modo === 'Individual') {
  //       this.dataSourceTablaGanadorIndividual.data.forEach(row => {
  //         this.selectionTres.select(row);
  //         // this.enfrentamientosSeleccionadosColumnaTres.push(row);
  //       });
  //       console.log('Los enfrentamientos con ganadorTres son (individual): ');
  //       console.log(this.enfrentamientosSeleccionadosColumnaTres);
  //     } else {
  //       this.dataSourceTablaGanadorEquipo.data.forEach(row => {
  //         this.selectionTres.select(row);
  //         // this.enfrentamientosSeleccionadosColumnaTres.push(row);
  //       });
  //       console.log('Los enfrentamientos con ganadorTres son (equipo): ');
  //       console.log(this.enfrentamientosSeleccionadosColumnaTres);
  //     }
  //   }
  // }

  // // ------------------------------------------------ Metodología nueva ------------------------------------------------------- //
  // AddResultadosColumnaTres() {
  //   if (this.juegoSeleccionado.Modo === 'Individual') {
  //     this.dataSourceTablaGanadorIndividual.data.forEach (row => {

  //       if (this.selectionTres.isSelected(row)) {
  //             console.log ('empate');
  //             this.resultados.push (0);
  //             this.selectionTres.clear();
  //       }

  //     });
  //     console.log('resultados');
  //     console.log(this.resultados);
  //   }
  // }
  // AddResultadosColumnaDos() {
  //   if (this.juegoSeleccionado.Modo === 'Individual') {
  //     this.dataSourceTablaGanadorIndividual.data.forEach (row => {

  //       if (this.selectionDos.isSelected(row)) {
  //             console.log ('Gana el 2');
  //             this.resultados.push (2);
  //             this.selectionDos.clear();
  //       }

  //     });
  //     console.log('resultados');
  //     console.log(this.resultados);
  //   }
  // }

  // AddResultadosColumnaUno() {
  //   if (this.juegoSeleccionado.Modo === 'Individual') {
  //     this.dataSourceTablaGanadorIndividual.data.forEach (row => {

  //       if (this.selectionUno.isSelected(row)) {
  //             console.log ('Gana el 1');
  //             this.resultados.push (1);
  //             this.selectionUno.clear();
  //       }

  //     });
  //     console.log('resultados');
  //     console.log(this.resultados);
  //   }

  //   // if (this.juegoSeleccionado.Modo === 'Individual') {
  //   //   this.dataSourceTablaGanadorIndividual.data.forEach(row => {

  //   //     if (this.selectionUno.isSelected(row)) {
  //   //       const indexOfUnselected = this.enfrentamientosSeleccionadosColumnaUno.indexOf(row);
  //   //       if (indexOfUnselected === -1) {
  //   //         this.enfrentamientosSeleccionadosColumnaUno.push(row);
  //   //         this.resultados[indexOfUnselected] = 1;
  //   //       } else {
  //   //         this.enfrentamientosSeleccionadosColumnaUno.splice(indexOfUnselected, 1);
  //   //         this.resultados[indexOfUnselected] = -1;
  //   //       }

  //   //     } else if (this.selectionDos.isSelected(row)) {
  //   //       const indexOfUnselected = this.enfrentamientosSeleccionadosColumnaDos.indexOf(row);
  //   //       if (indexOfUnselected === -1) {
  //   //         this.enfrentamientosSeleccionadosColumnaDos.push(row);
  //   //         // this.resultados.push (2);
  //   //         this.resultados[indexOfUnselected] = 2;
  //   //       } else {
  //   //         this.enfrentamientosSeleccionadosColumnaDos.splice(indexOfUnselected, 1);
  //   //         this.resultados[indexOfUnselected] = -1;
  //   //       }

  //   //     } else if (this.selectionTres.isSelected(row)) {
  //   //       const indexOfUnselected = this.enfrentamientosSeleccionadosColumnaTres.indexOf(row);
  //   //       if (indexOfUnselected === -1) {
  //   //         this.enfrentamientosSeleccionadosColumnaTres.push(row);
  //   //         this.resultados[indexOfUnselected] = 0;
  //   //       } else {
  //   //         this.enfrentamientosSeleccionadosColumnaTres.splice(indexOfUnselected, 1);
  //   //         this.resultados[indexOfUnselected] = -1;
  //   //       }
  //   //     }
  //   //   });
  //   // }
  // }


}

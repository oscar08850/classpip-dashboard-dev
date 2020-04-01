import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

// Clases
import { Juego, Jornada, TablaJornadas, TablaAlumnoJuegoDeCompeticion,
         TablaEquipoJuegoDeCompeticion, TablaClasificacionJornada, AlumnoJuegoDeCompeticionFormulaUno,
         EquipoJuegoDeCompeticionFormulaUno, AlumnoJuegoDePuntos, EquipoJuegoDePuntos,
         Alumno} from '../../../../clases/index';

// Servicio
import { SesionService , CalculosService, PeticionesAPIService } from '../../../../servicios/index';
import { forEach } from '@angular/router/src/utils/collection';
import { MatTableDataSource } from '@angular/material';

import Swal from 'sweetalert2';

import { identifierModuleUrl } from '@angular/compiler';

export interface Asignacion {
  modo: string;
  id: number;
}

const ModoAsignacion: Asignacion[] = [
  {modo: 'Manualmente', id: 1},
  {modo: 'Aleatoriamente', id: 2},
  {modo: 'Juego de Puntos', id: 3},
];

@Component({
  selector: 'app-ganadores-juego-formula-uno',
  templateUrl: './ganadores-juego-formula-uno.component.html',
  styleUrls: ['./ganadores-juego-formula-uno.component.scss']
})
export class GanadoresJuegoDeCompeticionFormulaUnoComponent implements OnInit {
  [x: string]: any;

  // Juego De CompeticionLiga seleccionado
  juegoSeleccionado: Juego;
  numeroTotalJornadas: number;
  jornadasDelJuego: Jornada[];
  JornadasCompeticion: TablaJornadas[] = [];
  tablaJornadaSelccionada: TablaJornadas;
  jornadaId: number;

  jornadaTieneGanadores: boolean;
  textoParticipantesPuntuan: string;
  isDisabledAnadirGanadores = true; // Activa/Desactiva botón añadir masivamente ganadores

  modoAsignacion: Asignacion[] = ModoAsignacion;
  modoAsignacionId: number;
  botonAsignarAleatorioDesactivado = true;
  botonAsignarManualDesactivado = true;
  botonAsignarPuntosDesactivado = true;

  manualmente = false;
  aleatoriamente = true;

  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeCompeticionFormulaUno[];
  listaEquiposOrdenadaPorPuntos: EquipoJuegoDeCompeticionFormulaUno[];

  participantesIndividualPuntuan: AlumnoJuegoDeCompeticionFormulaUno[] = [];
  participantesEquipoPuntuan: EquipoJuegoDeCompeticionFormulaUno[] = [];
  ganadoresFormulaUnoId: number[] = [];

  juegosActivosPuntos: Juego[];
  juegosActivosPuntosModo: Juego[];
  NumeroDeJuegoDePuntos: number;
  juegodePuntosSeleccionadoID: number;
  listaAlumnosOrdenadaPorPuntosJuegoDePuntos: AlumnoJuegoDePuntos[];
  listaEquiposOrdenadaPorPuntosJuegoDePuntos: EquipoJuegoDePuntos[];

  listaAlumnosClasificacion: TablaAlumnoJuegoDeCompeticion[] = [];
  listaEquiposClasificacion: TablaEquipoJuegoDeCompeticion[] = [];
  datosClasificacionJornada: {participante: string[];
                              puntos: number[];
                              posicion: number[];
                              participanteId: number[];
                             };

  TablaClasificacionJornadaSeleccionada: TablaClasificacionJornada[];


  // Columnas Tabla
  displayedColumns: string[] = ['posicion', 'participante', 'puntos'];
  columnas: string[] = ['participante', 'pon'];
  columnasPos: string[] = ['posicion','participante', 'quita'];

  dataSourceClasificacionJornada;
  dataSourceGanadores;
  ganadores: any[] = [];

  constructor(public sesion: SesionService,
              public location: Location,
              public calculos: CalculosService,
              public peticionesAPI: PeticionesAPIService) { }


  ngOnInit() {
    console.log('Estoy en ngOnInit de ganadores formula uno');
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.numeroTotalJornadas = this.juegoSeleccionado.NumeroTotalJornadas;
    console.log('Juego seleccionado: ');
    console.log(this.juegoSeleccionado);
    console.log('Número total de jornadas: ');
    console.log(this.numeroTotalJornadas);
    const datos = this.sesion.DameDatosJornadas();
    this.JornadasCompeticion = datos.JornadasCompeticion;
    this.jornadasDelJuego = datos.jornadas;
    this.listaAlumnosClasificacion = this.sesion.DameTablaAlumnoJuegoDeCompeticion();
    console.log('tabla alumnos clasificación:');
    console.log(this.listaAlumnosClasificacion);
    this.listaEquiposClasificacion = this.sesion.DameTablaEquipoJuegoDeCompeticion();
    console.log('tabla equipos clasificación:');
    console.log(this.listaEquiposClasificacion);
    this.listaAlumnosOrdenadaPorPuntos = this.sesion.DameInscripcionAlumno();
    this.listaEquiposOrdenadaPorPuntos = this.sesion.DameInscripcionEquipo();
    this.jornadaTieneGanadores = true;
    this.juegosActivosPuntos = this.sesion.DameJuegosDePuntosActivos();
    let z = 0;
    this.juegosActivosPuntosModo = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.juegosActivosPuntos.length; i++) {
        if (this.juegosActivosPuntos[i].Modo === this.juegoSeleccionado.Modo) {
          this.juegosActivosPuntosModo[z] = this.juegosActivosPuntos[i];
          z++;
        }
    }
  }

  AgregarGanador(participante) {
    if (this.ganadores.length === this.juegoSeleccionado.NumeroParticipantesPuntuan) {
      Swal.fire('Cuidado', 'Ya has asignado a todos los alumnos que puntuan', 'warning');
    } else {
      this.ganadores.push (participante);
      // tslint:disable-next-line:max-line-length
      this.TablaClasificacionJornadaSeleccionada = this.TablaClasificacionJornadaSeleccionada.filter(alumno => alumno.id !== participante.id);
      this.dataSourceClasificacionJornada = new MatTableDataSource(this.TablaClasificacionJornadaSeleccionada);
      this.dataSourceGanadores = new MatTableDataSource (this.ganadores);
    }
  }
  QuitarGanador(participante){
    this.TablaClasificacionJornadaSeleccionada.push (participante);
    this.TablaClasificacionJornadaSeleccionada.sort((a, b) => a.participante.localeCompare(b.participante));
    this.dataSourceClasificacionJornada = new MatTableDataSource(this.TablaClasificacionJornadaSeleccionada);
    this.ganadores = this.ganadores.filter (alumno => alumno.id !== participante.id);
    this.dataSourceGanadores = new MatTableDataSource (this.ganadores);
    console.log (this.ganadores);
  }

  AsignarGanadoresManual() {
    if (this.ganadores.length < this.juegoSeleccionado.NumeroParticipantesPuntuan) {
      Swal.fire('Cuidado', 'Aún falta asignar alumnos que puntúan', 'warning');
    } else {
      const jornadaSeleccionada = this.calculos.ObtenerJornadaSeleccionada(Number(this.jornadaId), this.jornadasDelJuego);
      let i = 0;
      const participantesPuntuan = [];
      while (i < this.juegoSeleccionado.NumeroParticipantesPuntuan) {
        participantesPuntuan.push(this.ganadores[i].id);
        i++;
      }
      this.calculos.AsignarResultadosJornadaF1(this.juegoSeleccionado, jornadaSeleccionada, participantesPuntuan);
    }

  }
  ObtenerClasificaciónDeCadaJornada() {
    console.log('Estoy en ObtenerClasificaciónDeCadaJornada');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.JornadasCompeticion.length; i++) {
      const JornadasCompeticionId = this.JornadasCompeticion[i].id;
      if (JornadasCompeticionId === Number(this.jornadaId)) {
        this.tablaJornadaSelccionada = this.JornadasCompeticion[i];
      }
    }
    console.log(this.tablaJornadaSelccionada);
    console.log('El id de la jornada seleccionada es: ' + this.tablaJornadaSelccionada.id);
    if (this.tablaJornadaSelccionada.GanadoresFormulaUno === undefined) {
      console.log ('No tiene ganadores');
      this.datosClasificacionJornada = this.calculos.ClasificacionJornada(this.juegoSeleccionado, this.listaAlumnosClasificacion,
                                                                          this.listaEquiposClasificacion,
                                                                          undefined,
                                                                          undefined);
    } else {
      console.log ('Si tiene ganadores');
      this.datosClasificacionJornada = this.calculos.ClasificacionJornada(this.juegoSeleccionado, this.listaAlumnosClasificacion,
                                                                          this.listaEquiposClasificacion,
                                                                          this.tablaJornadaSelccionada.GanadoresFormulaUno.nombre,
                                                                          this.tablaJornadaSelccionada.GanadoresFormulaUno.id);
    }
    this.ConstruirTablaClasificaciónJornada();
  }

  ConstruirTablaClasificaciónJornada() {
    console.log ('Aquí tendré la tabla de clasificación, los participantes ordenados son:');
    console.log(this.datosClasificacionJornada.participante);
    console.log(this.datosClasificacionJornada.puntos);
    console.log(this.datosClasificacionJornada.posicion);
    console.log('ParticipanteId:');
    console.log(this.datosClasificacionJornada.participanteId);
    console.log('Puntos del juego: ');
    console.log(this.juegoSeleccionado.Puntos);
    console.log ('AAAAAA');
    console.log (this.datosClasificacionJornada);
    this.TablaClasificacionJornadaSeleccionada = this.calculos.PrepararTablaRankingJornadaFormulaUno(this.datosClasificacionJornada);
    console.log ('BBBBBBB');
    console.log (this.TablaClasificacionJornadaSeleccionada);
    this.dataSourceClasificacionJornada = new MatTableDataSource(this.TablaClasificacionJornadaSeleccionada);
    console.log(this.dataSourceClasificacionJornada);
  }

  ActualizarTablaClasificacion(juegoSeleccionado: Juego, participantesPuntuan: number[]) {
    console.log('Estoy en ActualizarTablaClasificacion()');
    console.log('Hay ' + this.TablaClasificacionJornadaSeleccionada.length +
                ' participantes en la TablaClasificacionJornadaSeleccionada');

    const puntosDelJuego: number[] = [];
    juegoSeleccionado.Puntos.forEach(punto => { puntosDelJuego.push(punto); });
    console.log(participantesPuntuan);

// ----------------------------------------------------Para actualizar la TablaJornada----------------------------------------------- //
    // const TablaJornadaActualizada = this.JornadasCompeticion.filter(tablaJornada => tablaJornada.id === Number(this.jornadaId))[0];
    // console.log('La TablaJornada que hay que actualizar es: ');
    // console.log(TablaJornadaActualizada);
    // TablaJornadaActualizada.GanadoresFormulaUno.id = participantesPuntuan;
    // TablaJornadaActualizada.GanadoresFormulaUno.nombre =  ;
// ---------------------------------------------------------------------------------------------------------------------------- //

    for (let x = 0; x < participantesPuntuan.length; x++) {
      // tslint:disable-next-line:prefer-for-of
      for (let y = 0; y < this.TablaClasificacionJornadaSeleccionada.length; y++) {
        if (this.TablaClasificacionJornadaSeleccionada[y].id === participantesPuntuan[x]) {
          this.TablaClasificacionJornadaSeleccionada[y].puntos = puntosDelJuego[x];
          console.log('puntos de la jornada del participande con id: ' + this.TablaClasificacionJornadaSeleccionada[y].id + ' = ' +
                      juegoSeleccionado.Puntos[x]);
        }
      }
    }

    // Ordenamos la tabla de mayor a menor puntos
    // tslint:disable-next-line:only-arrow-functions
    this.TablaClasificacionJornadaSeleccionada = this.TablaClasificacionJornadaSeleccionada.sort(function(obj1, obj2) {
      return obj2.puntos - obj1.puntos;
    });

    // Actualizamos las posiciones
    // tslint:disable-next-line:prefer-for-of
    for (let z = 0; z < this.TablaClasificacionJornadaSeleccionada.length; z++) {
       this.TablaClasificacionJornadaSeleccionada[z].posicion = z + 1;
    }
    this.dataSourceClasificacionJornada = new MatTableDataSource(this.TablaClasificacionJornadaSeleccionada);
    console.log('La TablaClasificacionJornadaSeleccionada actualizada queda: ');
    console.log(this.TablaClasificacionJornadaSeleccionada);

  }

  Disputada(jornadaId): boolean {
    return this.calculos.JornadaF1TieneGanadores(jornadaId, this.jornadasDelJuego);
  }

//////////////////////////////////////// FUNCIONES PARA CONTROLAR LOS BOTONES Y LOS CHECKBOX //////////////////////////////////
  ActualizarBoton() {
    console.log('777777777777777777Estoy en actualizar botón');
    console.log(this.jornadaId);
    if (this.Disputada (this.jornadaId)) {
      console.log ('Disputada');
      this.ObtenerClasificaciónDeCadaJornada();
    }
    if (this.modoAsignacionId === undefined || this.jornadaId === undefined) {
      this.botonAsignarAleatorioDesactivado = true;
      this.botonAsignarManualDesactivado = true;
      this.botonAsignarPuntosDesactivado = true;
    } else if (Number(this.modoAsignacionId) === 1) { // Manual
      console.log('Modo manual');
      this.botonAsignarAleatorioDesactivado = true;
      this.botonAsignarManualDesactivado = false;
      this.botonAsignarPuntosDesactivado = true;
      this.ObtenerClasificaciónDeCadaJornada();
      this.TablaClasificacionJornadaSeleccionada.sort((a, b) => a.participante.localeCompare(b.participante));
    } else if (Number(this.modoAsignacionId) === 2) { // Aleatorio
      console.log('Modo aleatorio');
      this.botonAsignarManualDesactivado = true;
      this.botonAsignarAleatorioDesactivado = false;
      this.botonAsignarPuntosDesactivado = true;
      this.ObtenerClasificaciónDeCadaJornada();
    } else if (Number(this.modoAsignacionId) === 3 && this.juegodePuntosSeleccionadoID !== undefined) { // JuegoPuntos
      console.log('Modo puntos');
      this.botonAsignarManualDesactivado = true;
      this.botonAsignarAleatorioDesactivado = true;
      this.botonAsignarPuntosDesactivado = false;
      this.ActualizarBotonPuntos();
      this.ObtenerClasificaciónDeCadaJornada();
    } else if (Number(this.modoAsignacionId) === 3 && this.juegodePuntosSeleccionadoID === undefined) { // JuegoPuntos
      this.botonAsignarManualDesactivado = true;
      this.botonAsignarAleatorioDesactivado = true;
      this.botonAsignarPuntosDesactivado = true;
    }
  }

  ActualizarBotonPuntos() {
    console.log(this.juegosActivosPuntosModo);
    console.log(this.juegodePuntosSeleccionadoID);

        // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.juegosActivosPuntosModo.length; i++) {
          console.log('Entro en el for');
          console.log(this.juegosActivosPuntosModo[i].id);
          console.log(this.juegodePuntosSeleccionadoID);
          console.log(this.juegosActivosPuntosModo[i].id === Number(this.juegodePuntosSeleccionadoID));
          if (this.juegosActivosPuntosModo[i].id === Number(this.juegodePuntosSeleccionadoID)) {
          console.log('Entro en el if');
          console.log(this.juegosActivosPuntosModo[i].Modo);
            // Vamos a buscar a los alumnos o equipos con sus repectivos puntos
          if (this.juegosActivosPuntosModo[i].Modo === 'Individual') {
              this.NumeroDeJuegoDePuntos = i;
              this.RecuperarInscripcionesAlumnoJuego();
              console.log(this.listaAlumnosOrdenadaPorPuntosJuegoDePuntos);
            } else {
              this.NumeroDeJuegoDePuntos = i;
              this.RecuperarInscripcionesEquiposJuego();
              console.log(this.listaEquiposOrdenadaPorPuntosJuegoDePuntos);
            }
          console.log('Alumnos');
          console.log(this.listaAlumnosOrdenadaPorPuntosJuegoDePuntos);
          console.log('Equipo');
          console.log(this.listaEquiposOrdenadaPorPuntosJuegoDePuntos);
          }
        }
  }

  HaPuntuado(participante: AlumnoJuegoDeCompeticionFormulaUno) {
    let haPuntuado: boolean;
    haPuntuado = false;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.participantesIndividualPuntuan.length; i++) {
      if (this.participantesIndividualPuntuan[i].AlumnoId === participante.AlumnoId) {
        haPuntuado = true;
      }
    }
    return haPuntuado;
  }

  // Funciones para AsignarMasivoManualmente parte HTML
  LimpiarCamposTexto() {
    this.textoParticipantesPuntuan = undefined;
    this.isDisabledAnadirGanadores = true;
  }

  DisabledTexto() {

    if (this.textoParticipantesPuntuan === undefined) {
      this.isDisabledAnadirGanadores = true;
    } else {
      this.isDisabledAnadirGanadores = false;
    }
  }


//////////////////////////////////////// FUNCIONES PARA RECUPERAR INSCRIPCIONES JUEGO DE PUTNOS //////////////////////////////////
  // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen
  RecuperarInscripcionesAlumnoJuego() {
    console.log ('voy a por las inscripciones ' + Number(this.juegodePuntosSeleccionadoID));
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDePuntos(this.juegodePuntosSeleccionadoID)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorPuntosJuegoDePuntos = inscripciones;
      // ordena la lista por puntos
      // tslint:disable-next-line:only-arrow-functions
      this.listaAlumnosOrdenadaPorPuntosJuegoDePuntos = this.listaAlumnosOrdenadaPorPuntosJuegoDePuntos.sort(function(obj1, obj2) {
        return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
      });
      console.log ('ya tengo las inscripciones');
      console.log (this.listaAlumnosOrdenadaPorPuntosJuegoDePuntos);
    });
  }

    // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen
  RecuperarInscripcionesEquiposJuego() {

    console.log ('vamos por las inscripciones ' + Number(this.juegodePuntosSeleccionadoID));
    this.peticionesAPI.DameInscripcionesEquipoJuegoDePuntos(this.juegodePuntosSeleccionadoID)
    .subscribe(inscripciones => {
      this.listaEquiposOrdenadaPorPuntosJuegoDePuntos = inscripciones;
      console.log(this.listaEquiposOrdenadaPorPuntosJuegoDePuntos);

      // ordenamos por puntos
      // tslint:disable-next-line:only-arrow-functions
      this.listaEquiposOrdenadaPorPuntosJuegoDePuntos = this.listaEquiposOrdenadaPorPuntosJuegoDePuntos.sort(function(obj1, obj2) {
        return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;
      });
      console.log ('ya tengo las inscripciones');
      console.log (this.listaEquiposOrdenadaPorPuntosJuegoDePuntos);
    });
  }


  ///////////////////////////////////////////////////  ALEATORIAMENTE  /////////////////////////////////////////////////////////
  AsignarAleatoriamente() {

    console.log('Estoy en AsignarAleatoriamente');
    console.log('this.jornadaId = ' + this.jornadaId);
    const participantesPuntuan: number[] = [];
    const jornadaTieneGanadores = this.calculos.JornadaF1TieneGanadores(this.jornadaId, this.jornadasDelJuego);
    console.log('Puntos del juego');
    console.log(this.juegoSeleccionado.Puntos);
    if (jornadaTieneGanadores === false) {
      console.log('Este juego No tiene ganadores asignados');
      const jornadaSeleccionada = this.calculos.ObtenerJornadaSeleccionada(Number(this.jornadaId), this.jornadasDelJuego);

      // Elegimos aleatoriamente los participantes que puntúan
      if (this.juegoSeleccionado.Modo === 'Individual') {
        console.log('Estoy en elegir participantes que puntúan aleatoriamente individual');
        this.ganadoresFormulaUnoId = [];
        const numeroParticipantesPuntuan = this.juegoSeleccionado.NumeroParticipantesPuntuan;
        const participantes: AlumnoJuegoDeCompeticionFormulaUno[] = [];
        this.listaAlumnosOrdenadaPorPuntos.forEach(alumno => participantes.push(alumno));

        let i = 0;
        // let posicion = 0;
        // Elegimos los ganadores aleatoriamente y los ponemos en una lista: participantesPuntuan y los id en la lista ganadoresFormulaUnoId
        while (i < numeroParticipantesPuntuan) {
          console.log('Elegimos el ganador ' + (i + 1));
          const numeroParticipantes = participantes.length;
          const elegido = Math.floor(Math.random() * numeroParticipantes);
          const AlumnoId = participantes[elegido].AlumnoId;
          participantes.splice(elegido, 1);
          participantesPuntuan.push(AlumnoId);
          i++;
        }
      } else {
        console.log('Estoy en elegir participantes que puntúan aleatoriamente equipo');
        this.ganadoresFormulaUnoId = [];
        const numeroParticipantesPuntuan = this.juegoSeleccionado.NumeroParticipantesPuntuan;
        const participantes: EquipoJuegoDeCompeticionFormulaUno[] = [];
        this.listaEquiposOrdenadaPorPuntos.forEach(equipo => participantes.push(equipo));

        let i = 0;
        // Elegimos los ganadores aleatoriamente y los ponemos en una lista: participantesPuntuan y los id en la lista ganadoresFormulaUnoId
        while (i < numeroParticipantesPuntuan) {
          const numeroParticipantes = participantes.length;
          const elegido = Math.floor(Math.random() * numeroParticipantes);
          const EquipoId = participantes[elegido].EquipoId;
          participantes.splice(elegido, 1);
          participantesPuntuan.push(EquipoId);
          i++;
        }
      }
      console.log('Los id de los participantes que puntúanson: ');
      console.log(participantesPuntuan);

      // Si tengo todos los participantes que puntúan actualizo la base de datos
      if (participantesPuntuan.length === this.juegoSeleccionado.Puntos.length) {
        this.calculos.AsignarResultadosJornadaF1(this.juegoSeleccionado, jornadaSeleccionada, participantesPuntuan);
        Swal.fire('Resutados asignados', 'Enhorabuena', 'success');

        // Actualizamos la tabla de la clasificación de la jornada
        this.ActualizarTablaClasificacion(this.juegoSeleccionado, participantesPuntuan);
        this.ConstruirTablaClasificaciónJornada();
        this.ActualizarBoton();
      } else {
        console.log('Se ha producido un error: participantesPuntuan.length !== this.juegoSeleccionado.Puntos.length');
      }
    } else {
      console.log('Este juego ya tiene ganadores asignados');
      Swal.fire('Este juego ya tiene ganadores asignados', ' No se ha podido realizar esta acción', 'error');
    }
  }

  AsignarMasivoManualmente() {

    console.log('Estoy en AsignarMasivoManualmente()');
    console.log('this.jornadaId = ' + this.jornadaId);
    let participantesPuntuanId: number[] = [];
    const jornadaTieneGanadores = this.calculos.JornadaF1TieneGanadores(this.jornadaId, this.jornadasDelJuego);
    console.log('Puntos del juego');
    console.log(this.juegoSeleccionado.Puntos);
    if (jornadaTieneGanadores === false) {
      console.log('Este juego No tiene ganadores asignados');
      const jornadaSeleccionada = this.calculos.ObtenerJornadaSeleccionada(Number(this.jornadaId), this.jornadasDelJuego);

      // Cogemos los participantes que puntúan de la lista introducida por el profesor
      const lineas: string[] = this.textoParticipantesPuntuan.split('\n');
      console.log ('Numero de lineas ' + lineas.length);
      console.log(lineas.length + ' === ' + this.juegoSeleccionado.NumeroParticipantesPuntuan);
      if (lineas.length === this.juegoSeleccionado.NumeroParticipantesPuntuan ||
          lineas.length > this.juegoSeleccionado.NumeroParticipantesPuntuan) {

            // Creamos una listas de strings que debe contener nombre apellido1 apellido2 (Individual) o nombre (Equipo)
            const participantesPuntuanNombre: string[] = this.calculos.GanadoresMasivamenteNombre(lineas, this.juegoSeleccionado);
            console.log('ganadoresNombre.length = ' + participantesPuntuanNombre.length);

            if (participantesPuntuanNombre.length === this.juegoSeleccionado.NumeroParticipantesPuntuan) {
              console.log('this.ganadoresNombre.length === this.juegoSeleccionado.NumeroParticipantesPuntuan');

              // Comparamos los nombres con los nombres de la TablaClasificacion --> guardamos los id en participantesPuntuan
              participantesPuntuanId = this.calculos.GanadoresMasivamenteId(participantesPuntuanNombre, this.listaAlumnosClasificacion,
                                                                   this.listaEquiposClasificacion, this.juegoSeleccionado);
              console.log('Los id de los participantes que puntúanson: ');
              console.log(participantesPuntuanId);

              // Actualizamos la base de datos
              this.AsignarManualmente(jornadaSeleccionada, participantesPuntuanId);

            } else {
              // tslint:disable-next-line:max-line-length
              console.log('Se ha producido un error: participantesPuntuanNombre.length !== this.juegoSeleccionado.NumeroParticipantesPuntuan');
            }
      } else {
        console.log('Esta jornada tiene ' + this.juegoSeleccionado.NumeroParticipantesPuntuan +
                    ' participantes que puntúan, pero solo se han introducido ' + lineas.length);
        Swal.fire('Esta jornada tiene ' + this.juegoSeleccionado.NumeroParticipantesPuntuan +
                  ' participantes que puntúan, pero solo se han introducido ' + lineas.length,
                  ' No se ha podido realizar esta acción', 'error');
      }
    } else {
      console.log('Este juego ya tiene ganadores asignados');
      Swal.fire('Este juego ya tiene ganadores asignados', ' No se ha podido realizar esta acción', 'error');
    }
  }

  AsignarGanadorJuegoPuntos() {
    console.log('Estoy en AsignarJuegoMedianteJuegoPuntos --> AsignarGanadorJuegoPuntos()');
    const jornadaTieneGanadores = this.calculos.JornadaF1TieneGanadores(this.jornadaId, this.jornadasDelJuego);
    console.log('Puntos del juego');
    console.log(this.juegoSeleccionado.Puntos);
    if (jornadaTieneGanadores === false) {
      console.log('Este juego NO tiene ganadores asignados');
      const jornadaSeleccionada = this.calculos.ObtenerJornadaSeleccionada(Number(this.jornadaId), this.jornadasDelJuego);

      // Determinamos los participantes que puntúan a partir de la clasificación del juego de puntos
      const participantesPuntuan: number[] = this.ElegirGanadoresF1MedianteJuegoDepuntos(this.juegoSeleccionado,
                                                                                        this.listaAlumnosOrdenadaPorPuntosJuegoDePuntos,
                                                                                        this.listaEquiposOrdenadaPorPuntosJuegoDePuntos);
      console.log('Finalmente los participantes que puntúan mediante el juego de puntos son: ');
      console.log(participantesPuntuan);

      // Si tengo todos los participantes que puntúan actualizo la base de datos
      if (participantesPuntuan.length === this.juegoSeleccionado.Puntos.length) {
        this.calculos.AsignarResultadosJornadaF1(this.juegoSeleccionado, jornadaSeleccionada, participantesPuntuan);
        Swal.fire('Resutados asignados', 'Enhorabuena', 'success');

        // Actualizamos la tabla de la clasificación de la jornada
        this.ActualizarTablaClasificacion(this.juegoSeleccionado, participantesPuntuan);
        this.ObtenerClasificaciónDeCadaJornada();
      } else {
        console.log('Se ha producido un error: participantesPuntuan.length !== this.juegoSeleccionado.Puntos.length');
      }
    } else {
      console.log('Este juego tiene ganadores asignados');
      Swal.fire('Este juego ya tiene ganadores asignados', ' No se ha podido realizar esta acción', 'error');
    }
  }

  // Función a la que hay que llamar para que los resultados de la jornada se actualicen en la base de datos en MANUALMENTE
  AsignarManualmente(jornadaSeleccionada: Jornada, participantesPuntuan: number[]) {
    if (participantesPuntuan.length === this.juegoSeleccionado.NumeroParticipantesPuntuan) {
      this.calculos.AsignarResultadosJornadaF1(this.juegoSeleccionado, jornadaSeleccionada, participantesPuntuan);
      Swal.fire('Resutados asignados', 'Enhorabuena', 'success');
    } else {
      // tslint:disable-next-line:max-line-length
      console.log('Se ha producido un error: participantesPuntuanId.length !== this.juegoSeleccionado.NumeroParticipantesPuntuan');
    }
  }

  // Función a la que hay que llamar para obtener los participantes que puntúan mediante JUEGO DE PUTNOS
  ElegirGanadoresF1MedianteJuegoDepuntos(juegoSeleccionado: Juego, listaAlumnosOrdenadaPorPuntosJuegoDePuntos: AlumnoJuegoDePuntos[],
                                         listaEquiposOrdenadaPorPuntosJuegoDePuntos: EquipoJuegoDePuntos[]) {
    console.log('this.jornadaId = ' + this.jornadaId);
    const participantesPuntuanId: number[] = [];
    const participantes = [];
    const numeroParticipantesPuntuan = juegoSeleccionado.NumeroParticipantesPuntuan;
    console.log('Este juego No tiene ganadores asignados');
    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('La lista de participantes ordenada según el juego de puntos es la siguiente: ');
      console.log(this.listaAlumnosOrdenadaPorPuntosJuegoDePuntos);
      let i = 0;
      while (i < numeroParticipantesPuntuan) {
        participantesPuntuanId.push(listaAlumnosOrdenadaPorPuntosJuegoDePuntos[i].alumnoId);
        i++;
      }
    } else {
      console.log('La lista de participantes ordenada según el juego de puntos es la siguiente: ');
      console.log(this.listaEquiposOrdenadaPorPuntosJuegoDePuntos);
      let i = 0;
      while (i < numeroParticipantesPuntuan) {
        participantesPuntuanId.push(listaEquiposOrdenadaPorPuntosJuegoDePuntos[i].equipoId);
        i++;
      }
    }
    return participantesPuntuanId;
  }


  goBack() {
    this.location.back();
  }

}

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

  dataSourceClasificacionJornada;

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

  ActualizarBoton() {
    console.log('Estoy en actualizar botón');
    console.log(this.modoAsignacionId);
    if (this.modoAsignacionId === undefined || this.jornadaId === undefined) {
      this.botonAsignarAleatorioDesactivado = true;
      this.botonAsignarManualDesactivado = true;
      this.botonAsignarPuntosDesactivado = true;
    } else if (Number(this.modoAsignacionId) === 1) { // Manual
      console.log('Modo manual');
      this.botonAsignarAleatorioDesactivado = true;
      this.botonAsignarManualDesactivado = false;
      this.botonAsignarPuntosDesactivado = true;
    } else if (Number(this.modoAsignacionId) === 2) { // Aleatorio
      console.log('Modo aleatorio');
      this.botonAsignarManualDesactivado = true;
      this.botonAsignarAleatorioDesactivado = false;
      this.botonAsignarPuntosDesactivado = true;
      this.TieneGanadores(this.jornadaId);
      this.ObtenerClasificaciónDeCadaJornada();
    } else if (Number(this.modoAsignacionId) === 3 && this.juegodePuntosSeleccionadoID !== undefined) { // JuegoPuntos
      console.log('Modo aleatorio');
      this.botonAsignarManualDesactivado = true;
      this.botonAsignarAleatorioDesactivado = true;
      this.botonAsignarPuntosDesactivado = false;
      this.ActualizarBotonPuntos();
      this.TieneGanadores(this.jornadaId);
      this.ObtenerClasificaciónDeCadaJornada();
    } else if (Number(this.modoAsignacionId) === 3 && this.juegodePuntosSeleccionadoID !== undefined) { // JuegoPuntos
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
      this.datosClasificacionJornada = this.calculos.ClasificacionJornada(this.juegoSeleccionado, this.listaAlumnosClasificacion,
                                                                          this.listaEquiposClasificacion,
                                                                          undefined,
                                                                          undefined);
    } else {
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
    this.TablaClasificacionJornadaSeleccionada = this.calculos.PrepararTablaRankingJornadaFormulaUno(this.datosClasificacionJornada);
    this.dataSourceClasificacionJornada = new MatTableDataSource(this.TablaClasificacionJornadaSeleccionada);
    console.log(this.dataSourceClasificacionJornada.data);
  }


  // Consultas a la API
  ActualizarGanadoresJornada() {
    // Hacemos el put para editar el juego con los GanadoresFormulaUno
      // tslint:disable-next-line:prefer-for-of
      for (let m = 0; m < this.jornadasDelJuego.length; m++) {
        if (this.jornadasDelJuego[m].id === Number(this.jornadaId)) {
          const jornadaActualizada: Jornada = this.jornadasDelJuego[m];
          jornadaActualizada.GanadoresFormulaUno = this.ganadoresFormulaUnoId;
          this.peticionesAPI.PonGanadoresJornadasDeCompeticionFormulaUno(jornadaActualizada)
          .subscribe(jornada => {
            console.log('La jornada actualizada queda: ');
            console.log(jornada);
            this.ActualizarPuntosGanadoresJornada();
          });
        }
      }
  }

  ActualizarPuntosGanadoresJornada() {
    console.log('Estoy en ActualizarPuntosGanadoresJornada()');
    // Hacemos el put de los ganadores para actualizar los puntos en la base de datos
    if (this.juegoSeleccionado.Modo === 'Individual') {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.participantesIndividualPuntuan.length; i++) {
      this.peticionesAPI.PonPuntosAlumnosGanadoresJornadasDeCompeticionFormulaUno(this.participantesIndividualPuntuan[i])
      .subscribe(participante => {
        console.log('Se ha actualizado en la base de datos el alumno: ');
        console.log(participante);
      });
      }
    } else {
      console.log('Estoy en ActualizarPuntosGanadoresJornada() equipos');
      console.log('participantesEquipoPuntuan: ');
      console.log(this.participantesEquipoPuntuan);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.participantesEquipoPuntuan.length; i++) {
        this.peticionesAPI.PonPuntoEquiposGanadoresJornadasDeCompeticionFormulaUno(this.participantesEquipoPuntuan[i])
        .subscribe(participante => {
          console.log('Se ha actualizado en la base de datos el equipo: ');
          console.log(participante);
        });
        }
    }
  }


  // Funciones para AsignarAleatoriamente
  GanadoresAleatoriamente(juegoSeleccionado: Juego, listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeCompeticionFormulaUno[],
                          listaEquiposOrdenadaPorPuntos: EquipoJuegoDeCompeticionFormulaUno[]) {
    if (juegoSeleccionado.Modo === 'Individual') {
      console.log('Estoy en asignar aleatoriamente individual');
      this.ganadoresFormulaUnoId = [];
      this.participantesIndividualPuntuan = [];
      const numeroParticipantesPuntuan = juegoSeleccionado.NumeroParticipantesPuntuan;
      const participantes: AlumnoJuegoDeCompeticionFormulaUno[] = listaAlumnosOrdenadaPorPuntos;
      let i = 0;
      let posicion = 0;
      // Elegimos los ganadores aleatoriamente y los ponemos en una lista: participantesPuntuan y los id en la lista ganadoresFormulaUnoId
      while (i < numeroParticipantesPuntuan) {
        const numeroParticipantes = participantes.length;
        const elegido = Math.floor(Math.random() * numeroParticipantes);
        const AlumnoId = participantes[elegido].AlumnoId;
        const puntosTotales = participantes[elegido].PuntosTotalesAlumno + juegoSeleccionado.Puntos[posicion];
        posicion = posicion + 1;
        const id = participantes[elegido].id;
        const ganador = new AlumnoJuegoDeCompeticionFormulaUno(AlumnoId, juegoSeleccionado.id, puntosTotales, id);
        this.participantesIndividualPuntuan.push(ganador);
        participantes.splice(elegido, 1);
        this.ganadoresFormulaUnoId.push(AlumnoId);
        i++;
      }
      console.log('Los participantes que puntúan son: ');
      console.log(this.participantesIndividualPuntuan);
    } else {
      console.log('Estoy en asignar aleatoriamente equipo');
      this.ganadoresFormulaUnoId = [];
      this.participantesEquipoPuntuan = [];
      const numeroParticipantesPuntuan = juegoSeleccionado.NumeroParticipantesPuntuan;
      const participantes: EquipoJuegoDeCompeticionFormulaUno[] = listaEquiposOrdenadaPorPuntos;
      let i = 0;
      let posicion = 0;
      // Elegimos los ganadores aleatoriamente y los ponemos en una lista: participantesEquipoPuntuan y
      // los id en la lista ganadoresFormulaUnoId
      while (i < numeroParticipantesPuntuan) {
        const numeroParticipantes = participantes.length;
        const elegido = Math.floor(Math.random() * numeroParticipantes);
        const EquipoId = participantes[elegido].EquipoId;
        const puntosTotales = participantes[elegido].PuntosTotalesEquipo + juegoSeleccionado.Puntos[posicion];
        posicion = posicion + 1;
        const id = participantes[elegido].id;
        const ganador = new EquipoJuegoDeCompeticionFormulaUno(EquipoId, juegoSeleccionado.id, puntosTotales, id);
        this.participantesEquipoPuntuan.push(ganador);
        participantes.splice(elegido, 1);
        this.ganadoresFormulaUnoId.push(EquipoId);
        i++;
      }
      console.log('Los participantes que puntúan son: ');
      console.log(this.participantesEquipoPuntuan);
    }
    console.log('Los id de los ganadores de la jornada son:');
    console.log(this.ganadoresFormulaUnoId);
  }

  ActualizarTablaClasificacion(juegoSeleccionado: Juego, participantesIndividualPuntuan: AlumnoJuegoDeCompeticionFormulaUno[],
                               participantesEquipoPuntuan: EquipoJuegoDeCompeticionFormulaUno[]) {
    console.log('Hay ' + this.TablaClasificacionJornadaSeleccionada.length +
                ' participantes en la TablaClasificacionJornadaSeleccionada');
    if (juegoSeleccionado.Modo === 'Individual') {
      // tslint:disable-next-line:prefer-for-of
      for (let x = 0; x < participantesIndividualPuntuan.length; x++) {
        // tslint:disable-next-line:prefer-for-of
        for (let y = 0; y < this.TablaClasificacionJornadaSeleccionada.length; y++) {
          if (this.TablaClasificacionJornadaSeleccionada[y].id === participantesIndividualPuntuan[x].AlumnoId) {
            this.TablaClasificacionJornadaSeleccionada[y].puntos = this.juegoSeleccionado.Puntos[x];
          }
        }
      }
      // tslint:disable-next-line:only-arrow-functions
      this.TablaClasificacionJornadaSeleccionada = this.TablaClasificacionJornadaSeleccionada.sort(function(obj1, obj2) {
        return obj2.puntos - obj1.puntos;
      });
    } else {
      // tslint:disable-next-line:prefer-for-of
      for (let x = 0; x < participantesEquipoPuntuan.length; x++) {
        // tslint:disable-next-line:prefer-for-of
        for (let y = 0; y < this.TablaClasificacionJornadaSeleccionada.length; y++) {
          if (this.TablaClasificacionJornadaSeleccionada[y].id === participantesEquipoPuntuan[x].EquipoId) {
            this.TablaClasificacionJornadaSeleccionada[y].puntos = this.juegoSeleccionado.Puntos[x];
          }
        }
      }
      // tslint:disable-next-line:only-arrow-functions
      this.TablaClasificacionJornadaSeleccionada = this.TablaClasificacionJornadaSeleccionada.sort(function(obj1, obj2) {
        return obj2.puntos - obj1.puntos;
      });
    }
    // tslint:disable-next-line:prefer-for-of
    for (let z = 0; z < this.TablaClasificacionJornadaSeleccionada.length; z++) {
       this.TablaClasificacionJornadaSeleccionada[z].posicion = z + 1;
    }
    this.dataSourceClasificacionJornada = new MatTableDataSource(this.TablaClasificacionJornadaSeleccionada);
    console.log('La TablaClasificacionJornadaSeleccionada actualizada queda: ');
    console.log(this.TablaClasificacionJornadaSeleccionada);
  }

  StringGanadores(juegoSeleccionado: Juego, participantesIndividualPuntuan: AlumnoJuegoDeCompeticionFormulaUno[],
                  participantesEquipoPuntuan: EquipoJuegoDeCompeticionFormulaUno[]) {
    let ganadores = '';
    if (juegoSeleccionado.Modo === 'Individual') {
      // tslint:disable-next-line:prefer-for-of
      for (let k = 0; k < participantesIndividualPuntuan.length; k++) {
      // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.datosClasificacionJornada.participanteId.length; j++) {
          // tslint:disable-next-line:max-line-length
          if (this.datosClasificacionJornada.participanteId[j] === participantesIndividualPuntuan[k].AlumnoId) {
            ganadores = ganadores + '\n' + this.datosClasificacionJornada.participante[j];
          }
        }
      }
    } else {
      // tslint:disable-next-line:prefer-for-of
      for (let k = 0; k < participantesEquipoPuntuan.length; k++) {
        // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < this.datosClasificacionJornada.participanteId.length; j++) {
            // tslint:disable-next-line:max-line-length
            if (this.datosClasificacionJornada.participanteId[j] === participantesEquipoPuntuan[k].EquipoId) {
              ganadores = ganadores + '\n' + this.datosClasificacionJornada.participante[j];
            }
          }
        }
    }
    return ganadores;
  }

  AsignarAleatoriamente() {
    console.log('Estoy en AsignarAleatoriamente');
    const jornadaTieneGanadores = this.TieneGanadores(Number(this.jornadaId));
    console.log('Tiene Ganadores = ' + jornadaTieneGanadores);
    console.log('Puntos del juego');
    console.log(this.juegoSeleccionado.Puntos);
    if (jornadaTieneGanadores === false) {
      // Elegimos los ganadores aleatoriamente y los ponemos en una lista: participantesPuntuan y los id en la lista ganadoresFormulaUnoId
      this.GanadoresAleatoriamente(this.juegoSeleccionado, this.listaAlumnosOrdenadaPorPuntos, this.listaEquiposOrdenadaPorPuntos);
      // Actualizamos TablaClasificacionJornadaSeleccionada
      this.ActualizarTablaClasificacion(this.juegoSeleccionado, this.participantesIndividualPuntuan, this.participantesEquipoPuntuan);
      // Sweetalert con los ganadores
      const ganadores = this.StringGanadores(this.juegoSeleccionado, this.participantesIndividualPuntuan, this.participantesEquipoPuntuan);
      Swal.fire(ganadores, ' Enhorabuena', 'success');
      this.ActualizarGanadoresJornada();
    } else {
      console.log('Este juego ya tiene ganadores asignados');
    }
  }

  // Funciones para AsignarManualmente parte HTML
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

  // Funciones para AsignarManualmenteMasivo --> ResgistroMasivoClasificacion()
  GanadoresMasivamenteNombre(lineas: string[]) {
    const nombresClasificacion: string[] = [];
    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('GanadoresMasivamente() Individual');
      console.log('TablaClasificacionJornadaSeleccionada: ');
      console.log(this.listaAlumnosClasificacion);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < lineas.length; i++) {
          const trozos: string[] = lineas[i].split(';');
          if (trozos.length === 3) {
            console.log('Bien introducido');
            const nombreClasificacion = trozos[0] + ' ' + trozos[1] + ' ' + trozos[2];
            nombresClasificacion.push(nombreClasificacion);
          }
      }
    } else {
      console.log('GanadoresMasivamente() Equipo');
      console.log('TablaClasificacionJornadaSeleccionada: ');
      console.log(this.listaEquiposClasificacion);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < lineas.length; i++) {
        console.log('Bien introducido');
        const nombreClasificacion = lineas[i];
        nombresClasificacion.push(nombreClasificacion);
      }
    }
    console.log('nombresClasificacion:');
    console.log(nombresClasificacion);
    return nombresClasificacion;
  }

  GanadoresMasivamenteId(ganadoresNombre: string[]) {
    const numeroParticipantesPuntuan = this.juegoSeleccionado.NumeroParticipantesPuntuan;
    this.ganadoresFormulaUnoId = [];
    if (this.juegoSeleccionado.Modo === 'Individual') {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < ganadoresNombre.length; i++) {
        let encontrado = false;
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.listaAlumnosClasificacion.length; j++) {
          if (ganadoresNombre[i] === this.listaAlumnosClasificacion[j].nombre + ' '
                                     + this.listaAlumnosClasificacion[j].primerApellido + ' '
                                     + this.listaAlumnosClasificacion[j].segundoApellido) {
            encontrado = true;
            this.ganadoresFormulaUnoId.push(this.listaAlumnosClasificacion[j].id);
          }
        }
        if (encontrado === false) {
          console.log('Alguno de los nombres introducidos no se corresponde con ninguno de los alumnos del grupo');
          this.ganadoresFormulaUnoId = [];
        }
      }
    } else {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < ganadoresNombre.length; i++) {
          let encontrado = false;
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < this.listaEquiposClasificacion.length; j++) {
            if (ganadoresNombre[i] === this.listaEquiposClasificacion[j].nombre) {
              encontrado = true;
              this.ganadoresFormulaUnoId.push(this.listaEquiposClasificacion[j].id);
            }
          }
          if (encontrado === false) {
            console.log('Alguno de los nombres introducidos no se corresponde con ninguno de los equipos del grupo');
            this.ganadoresFormulaUnoId = [];
          }
        }
    }
    return this.ganadoresFormulaUnoId;
  }

  ListaParticipantesPuntuanActualizados() {
    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('Estoy en ListaParticipantesPuntuanActualizados() Individual');
      this.participantesIndividualPuntuan = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.ganadoresFormulaUnoId.length; i++) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.listaAlumnosOrdenadaPorPuntos.length; j++) {
          if (this.ganadoresFormulaUnoId[i] === this.listaAlumnosOrdenadaPorPuntos[j].AlumnoId) {
            this.listaAlumnosOrdenadaPorPuntos[j].PuntosTotalesAlumno = this.listaAlumnosOrdenadaPorPuntos[j].PuntosTotalesAlumno
                                                                        + this.juegoSeleccionado.Puntos[i];
            this.participantesIndividualPuntuan.push(this.listaAlumnosOrdenadaPorPuntos[j]);
          }
        }
      }
      console.log('participantesIndividualPuntuan');
      console.log(this.participantesIndividualPuntuan);
    } else {
      this.participantesEquipoPuntuan = [];
      console.log('Estoy en ListaParticipantesPuntuanActualizados() Equipo');
      console.log('ganadoresFormulaUnoId');
      console.log(this.ganadoresFormulaUnoId);
      this.participantesEquipoPuntuan = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.ganadoresFormulaUnoId.length; i++) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.listaEquiposOrdenadaPorPuntos.length; j++) {
          if (this.ganadoresFormulaUnoId[i] === this.listaEquiposOrdenadaPorPuntos[j].EquipoId) {
            this.listaEquiposOrdenadaPorPuntos[j].PuntosTotalesEquipo = this.listaEquiposOrdenadaPorPuntos[j].PuntosTotalesEquipo
                                                                        + this.juegoSeleccionado.Puntos[i];
            this.participantesEquipoPuntuan.push(this.listaEquiposOrdenadaPorPuntos[j]);
          }
        }
      }
    }
    console.log('participantesEquipoPuntuan');
    console.log(this.participantesEquipoPuntuan);
  }

  RegistroMasivoClasificacion() {
    console.log('Estoy en RegistroMasivoClasificacion');
    const jornadaTieneGanadores = this.TieneGanadores(Number(this.jornadaId));
    console.log('Tiene Ganadores = ' + jornadaTieneGanadores);
    console.log('Puntos del juego');
    console.log(this.juegoSeleccionado.Puntos);
    if (jornadaTieneGanadores === false) {
      const lineas: string[] = this.textoParticipantesPuntuan.split('\n');
      console.log ('Numero de lineas ' + lineas.length);
      console.log(lineas.length + ' === ' + this.juegoSeleccionado.NumeroParticipantesPuntuan);
      if (lineas.length === this.juegoSeleccionado.NumeroParticipantesPuntuan ||
          lineas.length > this.juegoSeleccionado.NumeroParticipantesPuntuan) {
            // Crear una listas de strings que debe contener nombre apellido1 apellido2 (Individual) o nombre (Equipo)
            const ganadoresNombre: string[] = this.GanadoresMasivamenteNombre(lineas);
            // Comparar los nombres con los nombres de la TablaClasificacion --> guardar los id en ganadoresFormulaUnoId
            this.ganadoresFormulaUnoId = this.GanadoresMasivamenteId(ganadoresNombre);
            if (this.ganadoresFormulaUnoId.length === this.juegoSeleccionado.NumeroParticipantesPuntuan) {
              // Rellenamos lista participantesIndividualPuntuan/participantesEquipoPuntuan con los Alumno/Equipo actualizados
              this.ListaParticipantesPuntuanActualizados();
              // Actualizamos ganadores en la jornada
              this.ActualizarGanadoresJornada();
            }
      } else {
        console.log('Esta jornada tiene ' + this.juegoSeleccionado.NumeroParticipantesPuntuan +
                    ' participantes que puntúan, pero solo se han introducido ' + lineas.length);
      }
    } else {
      console.log('Esta jornada ya tiene ganadores asignados');
    }
    // this.LimpiarCamposTexto();
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

  TieneGanadores(jornadaId: number) {
    this.jornadaTieneGanadores = false;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.jornadasDelJuego.length; i++) {
      if (this.jornadasDelJuego[i].id === Number(jornadaId)) {
        if (this.jornadasDelJuego[i].GanadoresFormulaUno !== undefined) {
          this.jornadaTieneGanadores = true;
        }
      }
    }
    return this.jornadaTieneGanadores;
  }

  goBack() {
    this.location.back();
  }

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

  AsignarGanadorJuegoPuntos() {
    console.log('Estoy en AsignarJuegoPuntos');
    const jornadaTieneGanadores = this.TieneGanadores(Number(this.jornadaId));
    console.log('Tiene Ganadores = ' + jornadaTieneGanadores);
    console.log('Puntos del juego');
    console.log(this.juegoSeleccionado.Puntos);
    if (jornadaTieneGanadores === false) {
      // Elegimos los ganadores y los ponemos en una lista: participantesPuntuan y los id en la lista ganadoresFormulaUnoId
      this.GanadoresJuegoDePuntos(this.juegoSeleccionado, this.listaAlumnosOrdenadaPorPuntos, this.listaEquiposOrdenadaPorPuntos);
      // Actualizamos TablaClasificacionJornadaSeleccionada
      this.ActualizarTablaClasificacion(this.juegoSeleccionado, this.participantesIndividualPuntuan, this.participantesEquipoPuntuan);
      // Sweetalert con los ganadores
      const ganadores = this.StringGanadores(this.juegoSeleccionado, this.participantesIndividualPuntuan, this.participantesEquipoPuntuan);
      Swal.fire(ganadores, ' Enhorabuena', 'success');
      this.ActualizarGanadoresJornada();
    } else {
      console.log('Este juego ya tiene ganadores asignados');
    }
  }

  GanadoresJuegoDePuntos(juegoSeleccionado: Juego, listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeCompeticionFormulaUno[],
                         listaEquiposOrdenadaPorPuntos: EquipoJuegoDeCompeticionFormulaUno[]) {
    if (juegoSeleccionado.Modo === 'Individual') {
    console.log('Estoy en asignar Puntos individual');
    this.ganadoresFormulaUnoId = [];
    const numeroParticipantesPuntuan = juegoSeleccionado.NumeroParticipantesPuntuan;
    const participantes: AlumnoJuegoDeCompeticionFormulaUno[] = listaAlumnosOrdenadaPorPuntos;
    let i = 0;
    let elegido = 0;
    let posicion = 0;
    // Elegimos los ganadores aleatoriamente y los ponemos en una lista: participantesPuntuan y los id en la lista ganadoresFormulaUnoId
    while (i < numeroParticipantesPuntuan) {
    // tslint:disable-next-line:prefer-for-of
    for (let w = 0; w < participantes.length; w++) {
      if (participantes[w].AlumnoId === this.listaAlumnosOrdenadaPorPuntosJuegoDePuntos[i].alumnoId) {
        elegido = w;
      }
    }

    const AlumnoId = participantes[elegido].AlumnoId;
    const puntosTotales = participantes[elegido].PuntosTotalesAlumno + juegoSeleccionado.Puntos[posicion];
    posicion = posicion + 1;
    const id = participantes[elegido].id;
    const ganador = new AlumnoJuegoDeCompeticionFormulaUno(AlumnoId, juegoSeleccionado.id, puntosTotales, id);
    this.participantesIndividualPuntuan.push(ganador);
    this.ganadoresFormulaUnoId.push(AlumnoId);
    i++;
    }
    console.log('Los participantes que puntúan son: ');
    console.log(this.participantesIndividualPuntuan);
    } else {
    console.log('Estoy en asignar aleatoriamente equipo');
    this.ganadoresFormulaUnoId = [];
    this.participantesEquipoPuntuan = [];
    const numeroParticipantesPuntuan = juegoSeleccionado.NumeroParticipantesPuntuan;
    const participantes: EquipoJuegoDeCompeticionFormulaUno[] = listaEquiposOrdenadaPorPuntos;
    let i = 0;
    let posicion = 0;
    let elegido = 0;
    // Elegimos los ganadores aleatoriamente y los ponemos en una lista: participantesEquipoPuntuan y
    // los id en la lista ganadoresFormulaUnoId
    while (i < numeroParticipantesPuntuan) {
    // tslint:disable-next-line:prefer-for-of
    for (let w = 0; w < participantes.length; w++) {
      if (participantes[w].EquipoId === this.listaEquiposOrdenadaPorPuntosJuegoDePuntos[i].equipoId) {
        elegido = w;
      }
    }
    const EquipoId = participantes[elegido].EquipoId;
    const puntosTotales = participantes[elegido].PuntosTotalesEquipo + juegoSeleccionado.Puntos[posicion];
    posicion = posicion + 1;
    const id = participantes[elegido].id;
    const ganador = new EquipoJuegoDeCompeticionFormulaUno(EquipoId, juegoSeleccionado.id, puntosTotales, id);
    this.participantesEquipoPuntuan.push(ganador);
    this.ganadoresFormulaUnoId.push(EquipoId);
    i++;
    }
    console.log('Los participantes que puntúan son: ');
    console.log(this.participantesEquipoPuntuan);
    }
    console.log('Los id de los ganadores de la jornada son:');
    console.log(this.ganadoresFormulaUnoId);
    }

    // LimpiarParametros() {
    //   this.botonAsignarManualDesactivado = true;
    //   this.botonAsignarAleatorioDesactivado = true;
    //   this.botonAsignarPuntosDesactivado = true;
    //   this.listaAlumnosOrdenadaPorPuntosJuegoDePuntos = [];
    //   this.listaEquiposOrdenadaPorPuntosJuegoDePuntos = [];
    //   this.NumeroDeJuegoDePuntos = undefined;
    //   this.datosClasificacionJornada = undefined;
    //   this.participantesIndividualPuntuan = undefined;
    //   this.participantesEquipoPuntuan = undefined;
    //   console.log('Parametros Limpiados Correctamente');

    // }

}

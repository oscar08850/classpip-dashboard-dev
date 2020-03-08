import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

// Clases
import { Juego, Jornada, TablaJornadas, TablaAlumnoJuegoDeCompeticion,
         TablaEquipoJuegoDeCompeticion, TablaClasificacionJornada, AlumnoJuegoDeCompeticionFormulaUno,
         EquipoJuegoDeCompeticionFormulaUno,
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
];

@Component({
  selector: 'app-ganadores-juego-de-competicion-formula-uno',
  templateUrl: './ganadores-juego-de-competicion-formula-uno.component.html',
  styleUrls: ['./ganadores-juego-de-competicion-formula-uno.component.scss']
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

  modoAsignacion: Asignacion[] = ModoAsignacion;
  modoAsignacionId: number;
  botonAsignarAleatorioDesactivado = true;
  botonAsignarManualDesactivado = true;

  manualmente = false;
  aleatoriamente = true;

  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeCompeticionFormulaUno[];
  listaEquiposOrdenadaPorPuntos: EquipoJuegoDeCompeticionFormulaUno[];

  participantesIndividualPuntuan: AlumnoJuegoDeCompeticionFormulaUno[] = [];
  participantesEquipoPuntuan: EquipoJuegoDeCompeticionFormulaUno[] = [];
  ganadoresFormulaUnoId: number[] = [];

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
  }

  ActualizarBoton() {
    console.log('Estoy en actualizar botón');
    console.log(this.modoAsignacionId);
    if (this.modoAsignacionId === undefined || this.jornadaId === undefined) {
      this.botonAsignarAleatorioDesactivado = true;
      this.botonAsignarManualDesactivado = true;
    } else if (Number(this.modoAsignacionId) === 1) { // Manual
      console.log('Modo manual');
      this.botonAsignarAleatorioDesactivado = true;
      this.botonAsignarManualDesactivado = false;
    } else if (Number(this.modoAsignacionId) === 2) { // Aleatorio
      console.log('Modo aleatorio');
      this.botonAsignarManualDesactivado = true;
      this.botonAsignarAleatorioDesactivado = false;
      this.TieneGanadores(this.jornadaId);
      this.ObtenerClasificaciónDeCadaJornada();
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

  // AsignarAleatoriamente() {
  //   console.log('Estoy en AsignarAleatoriamente');
  //   const jornadaTieneGanadores = this.TieneGanadores(Number(this.jornadaId));
  //   console.log('Tiene Ganadores = ' + jornadaTieneGanadores);
  //   console.log('Puntos del juego');
  //   console.log(this.juegoSeleccionado.Puntos);
  //   if (jornadaTieneGanadores === false && this.juegoSeleccionado.Modo === 'Individual') {
  //     console.log('Estoy en asignar aleatoriamente individual');
  //     const numeroParticipantesPuntuan = this.juegoSeleccionado.NumeroParticipantesPuntuan;
  //     const participantes: AlumnoJuegoDeCompeticionFormulaUno[] = this.listaAlumnosOrdenadaPorPuntos;
  //     let i = 0;
  //     let posicion = 0;
  //     // Elegimos los ganadores aleatoriamente y los ponemos en una lista: participantesPuntuan
  //     while (i < numeroParticipantesPuntuan) {
  //       const numeroParticipantes = participantes.length;
  //       const elegido = Math.floor(Math.random() * numeroParticipantes);
  //       const AlumnoId = participantes[elegido].AlumnoId;
  //       this.ganadoresFormulaUnoId.push(AlumnoId);
  //       console.log('ganadoresFormulaUno:');
  //       console.log(this.ganadoresFormulaUnoId);
  //       const puntosTotales = participantes[elegido].PuntosTotalesAlumno + this.juegoSeleccionado.Puntos[posicion];
  //       posicion = posicion + 1;
  //       const id = participantes[elegido].id;
  //       const ganador = new AlumnoJuegoDeCompeticionFormulaUno(AlumnoId, this.juegoSeleccionado.id, puntosTotales, id);
  //       // Hacemos el put de los ganadores para actualizar los puntos en la base de datos
  //       this.peticionesAPI.PonPuntosAlumnosGanadoresJornadasDeCompeticionFormulaUno(ganador)
  //       .subscribe(participante => {
  //         console.log('Se ha actualizado en la base de datos el alumno: ');
  //         console.log(participante);
  //         if (i === numeroParticipantes - 1) {
  //           this.ActualizarGanadoresJornada();
  //         }
  //       });
  //       this.participantesIndividualPuntuan.push(ganador);
  //       participantes.splice(elegido, 1);
  //       i++;
  //     }
  //     console.log('Los participantes que puntúan son: ');
  //     console.log(this.participantesIndividualPuntuan);

  //     // Ponemos los id de los ganadores en la lista GanadoresFormulaUno para después guardarlo en la Jornada en la base de datos
  //     let ganadores = '';
  //     // let posicion = 0;
  //     // tslint:disable-next-line:prefer-for-of
  //     for (let k = 0; k < this.participantesIndividualPuntuan.length; k++) {
  //       // tslint:disable-next-line:prefer-for-of
  //       for (let j = 0; j < this.datosClasificacionJornada.participanteId.length; j++) {
  //         // tslint:disable-next-line:max-line-length
  //         if (this.datosClasificacionJornada.participanteId[j] === this.participantesIndividualPuntuan[k].AlumnoId) {
  //           ganadores = ganadores + '\n' + this.datosClasificacionJornada.participante[j];
  //           // this.ganadoresFormulaUnoId.push(this.datosClasificacionJornada.participanteId[j]);
  //         }
  //       }
  //     }

  //     // Actualizamos TablaClasificacionJornadaSeleccionada
  //     console.log('Hay ' + this.TablaClasificacionJornadaSeleccionada.length +
  //                 ' participantes en la TablaClasificacionJornadaSeleccionada');
  //     // tslint:disable-next-line:prefer-for-of
  //     for (let x = 0; x < this.TablaClasificacionJornadaSeleccionada.length; x++) {
  //       // tslint:disable-next-line:prefer-for-of
  //       for (let y = 0; y < this.participantesIndividualPuntuan.length; y++) {
  //         if (this.TablaClasificacionJornadaSeleccionada[x].id === this.participantesIndividualPuntuan[y].id) {
  //           this.TablaClasificacionJornadaSeleccionada[x].puntos = this.participantesIndividualPuntuan[y].PuntosTotalesAlumno;
  //         }
  //       }
  //     }
  //     // tslint:disable-next-line:only-arrow-functions
  //     this.TablaClasificacionJornadaSeleccionada = this.TablaClasificacionJornadaSeleccionada.sort(function(obj1, obj2) {
  //       return obj2.puntos - obj1.puntos;
  //     });
  //     this.dataSourceClasificacionJornada = new MatTableDataSource(this.TablaClasificacionJornadaSeleccionada);
  //     console.log('La TablaClasificacionJornadaSeleccionada actualizada queda: ');
  //     console.log(this.TablaClasificacionJornadaSeleccionada);
  //     Swal.fire(ganadores, ' Enhorabuena', 'success');
  //     console.log('Los ganadores de la jornada son:');
  //     console.log(this.ganadoresFormulaUnoId);
  //   } else if (jornadaTieneGanadores === false && this.juegoSeleccionado.Modo !== 'Individual') {
  //     console.log('Estoy en asignar aleatorio equipo');
  //     const numeroParticipantesPuntuan = this.juegoSeleccionado.NumeroParticipantesPuntuan;
  //     const participantes: EquipoJuegoDeCompeticionFormulaUno[] = this.listaEquiposOrdenadaPorPuntos;
  //     let i = 0;

  //     // Elegimos los ganadores aleatoriamente y los ponemos en una lista: participantesPuntuan
  //     while (i < numeroParticipantesPuntuan) {
  //       const numeroParticipantes = participantes.length;
  //       const elegido = Math.floor(Math.random() * numeroParticipantes);
  //       this.participantesEquipoPuntuan.push(this.listaEquiposOrdenadaPorPuntos[elegido]);
  //       participantes.splice(elegido, 1);
  //       i++;
  //     }
  //     console.log('Los participantes que puntúan son: ');
  //     console.log(this.participantesIndividualPuntuan);
  //     let ganadores = '';
  //     // tslint:disable-next-line:prefer-for-of
  //     for (let k = 0; k < this.participantesIndividualPuntuan.length; k++) {
  //       // tslint:disable-next-line:prefer-for-of
  //       for (let j = 0; j < this.datosClasificacionJornada.participanteId.length; j++) {
  //         // tslint:disable-next-line:max-line-length
  //         if (this.juegoSeleccionado.Modo === 'Individual' && this.datosClasificacionJornada.participanteId[j] ===
                                                              // this.participantesIndividualPuntuan[k].AlumnoId) {
  //           ganadores = ganadores + '\n' + this.datosClasificacionJornada.participante[j];
  //         }
  //       }
  //     }
  //     Swal.fire(ganadores, ' Enhorabuena', 'success');
  //   } else {
  //     console.log('Esta jornada ya tiene ganadores asignados');
  //   }
  // }
  GanadoresAleatoriamente(juegoSeleccionado: Juego, listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeCompeticionFormulaUno[],
                          listaEquiposOrdenadaPorPuntos: EquipoJuegoDeCompeticionFormulaUno[]) {
    if (juegoSeleccionado.Modo === 'Individual') {
      console.log('Estoy en asignar aleatoriamente individual');
      this.ganadoresFormulaUnoId = [];
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
            this.TablaClasificacionJornadaSeleccionada[y].puntos = participantesIndividualPuntuan[x].PuntosTotalesAlumno;
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
            this.TablaClasificacionJornadaSeleccionada[y].puntos = participantesEquipoPuntuan[x].PuntosTotalesEquipo;
          }
        }
      }
      // tslint:disable-next-line:only-arrow-functions
      this.TablaClasificacionJornadaSeleccionada = this.TablaClasificacionJornadaSeleccionada.sort(function(obj1, obj2) {
        return obj2.puntos - obj1.puntos;
      });
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

  AsignarAleatoriamente2() {
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

  AsignarAleatoriamente() {
    console.log('Estoy en AsignarAleatoriamente');
    const jornadaTieneGanadores = this.TieneGanadores(Number(this.jornadaId));
    console.log('Tiene Ganadores = ' + jornadaTieneGanadores);
    console.log('Puntos del juego');
    console.log(this.juegoSeleccionado.Puntos);
    if (jornadaTieneGanadores === false && this.juegoSeleccionado.Modo === 'Individual') {
      console.log('Estoy en asignar aleatoriamente individual');
      const numeroParticipantesPuntuan = this.juegoSeleccionado.NumeroParticipantesPuntuan;
      const participantes: AlumnoJuegoDeCompeticionFormulaUno[] = this.listaAlumnosOrdenadaPorPuntos;
      let i = 0;
      let posicion = 0;
      // Elegimos los ganadores aleatoriamente y los ponemos en una lista: participantesPuntuan y los id en la lista ganadoresFormulaUnoId
      while (i < numeroParticipantesPuntuan) {
        const numeroParticipantes = participantes.length;
        const elegido = Math.floor(Math.random() * numeroParticipantes);
        const AlumnoId = participantes[elegido].AlumnoId;
        const puntosTotales = participantes[elegido].PuntosTotalesAlumno + this.juegoSeleccionado.Puntos[posicion];
        posicion = posicion + 1;
        const id = participantes[elegido].id;
        const ganador = new AlumnoJuegoDeCompeticionFormulaUno(AlumnoId, this.juegoSeleccionado.id, puntosTotales, id);
        this.participantesIndividualPuntuan.push(ganador);
        participantes.splice(elegido, 1);
        this.ganadoresFormulaUnoId.push(AlumnoId);
        i++;
      }
      console.log('Los participantes que puntúan son: ');
      console.log(this.participantesIndividualPuntuan);

      // Actualizamos TablaClasificacionJornadaSeleccionada
      console.log('Hay ' + this.TablaClasificacionJornadaSeleccionada.length +
                  ' participantes en la TablaClasificacionJornadaSeleccionada');
      // tslint:disable-next-line:prefer-for-of
      for (let x = 0; x < this.TablaClasificacionJornadaSeleccionada.length; x++) {
        // tslint:disable-next-line:prefer-for-of
        for (let y = 0; y < this.participantesIndividualPuntuan.length; y++) {
          if (this.TablaClasificacionJornadaSeleccionada[x].id === this.participantesIndividualPuntuan[y].id) {
            this.TablaClasificacionJornadaSeleccionada[x].puntos = this.participantesIndividualPuntuan[y].PuntosTotalesAlumno;
          }
        }
      }
      // tslint:disable-next-line:only-arrow-functions
      this.TablaClasificacionJornadaSeleccionada = this.TablaClasificacionJornadaSeleccionada.sort(function(obj1, obj2) {
        return obj2.puntos - obj1.puntos;
      });
      this.dataSourceClasificacionJornada = new MatTableDataSource(this.TablaClasificacionJornadaSeleccionada);

      // Sweetalert con los ganadores
      let ganadores = '';
      // let posicion = 0;
      // tslint:disable-next-line:prefer-for-of
      for (let k = 0; k < this.participantesIndividualPuntuan.length; k++) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.datosClasificacionJornada.participanteId.length; j++) {
          // tslint:disable-next-line:max-line-length
          if (this.datosClasificacionJornada.participanteId[j] === this.participantesIndividualPuntuan[k].AlumnoId) {
            ganadores = ganadores + '\n' + this.datosClasificacionJornada.participante[j];
          }
        }
      }
      Swal.fire(ganadores, ' Enhorabuena', 'success');

      console.log('La TablaClasificacionJornadaSeleccionada actualizada queda: ');
      console.log(this.TablaClasificacionJornadaSeleccionada);
      console.log('Los id de los ganadores de la jornada son:');
      console.log(this.ganadoresFormulaUnoId);
      this.ActualizarGanadoresJornada();
    } else if (jornadaTieneGanadores === false && this.juegoSeleccionado.Modo !== 'Individual') {
      console.log('Estoy en asignar aleatorio equipo');
      const numeroParticipantesPuntuan = this.juegoSeleccionado.NumeroParticipantesPuntuan;
      const participantes: EquipoJuegoDeCompeticionFormulaUno[] = this.listaEquiposOrdenadaPorPuntos;
      let i = 0;

      // Elegimos los ganadores aleatoriamente y los ponemos en una lista: participantesPuntuan
      while (i < numeroParticipantesPuntuan) {
        const numeroParticipantes = participantes.length;
        const elegido = Math.floor(Math.random() * numeroParticipantes);
        this.participantesEquipoPuntuan.push(this.listaEquiposOrdenadaPorPuntos[elegido]);
        participantes.splice(elegido, 1);
        i++;
      }
      console.log('Los participantes que puntúan son: ');
      console.log(this.participantesIndividualPuntuan);
      let ganadores = '';
      // tslint:disable-next-line:prefer-for-of
      for (let k = 0; k < this.participantesIndividualPuntuan.length; k++) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.datosClasificacionJornada.participanteId.length; j++) {
          // tslint:disable-next-line:max-line-length
          if (this.juegoSeleccionado.Modo === 'Individual' && this.datosClasificacionJornada.participanteId[j] === this.participantesIndividualPuntuan[k].AlumnoId) {
            ganadores = ganadores + '\n' + this.datosClasificacionJornada.participante[j];
          }
        }
      }
      Swal.fire(ganadores, ' Enhorabuena', 'success');
    } else {
      console.log('Esta jornada ya tiene ganadores asignados');
    }
  }

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
}

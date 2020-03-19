import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

// Clases
import { Juego, Jornada, TablaJornadas, EnfrentamientoLiga, TablaAlumnoJuegoDeCompeticion,
  TablaEquipoJuegoDeCompeticion,
  AlumnoJuegoDeCompeticionLiga,
  EquipoJuegoDeCompeticionLiga, Alumno, Equipo, AlumnoJuegoDePuntos, EquipoJuegoDePuntos} from '../../../../clases/index';

// Services
import { SesionService, CalculosService, PeticionesAPIService } from '../../../../servicios/index';
import {MatTableDataSource} from '@angular/material/table';

import { Location } from '@angular/common';
import Swal from 'sweetalert2';


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

  enfrentamientosSeleccionadosColumnaUno: EnfrentamientoLiga[] = [];
  enfrentamientosSeleccionadosColumnaDos: EnfrentamientoLiga[] = [];
  enfrentamientosSeleccionadosColumnaTres: EnfrentamientoLiga[] = [];
  equiposSeleccionadosUno: any[] = [];
  equiposSeleccionadosDos: any[] = [];
  equiposSeleccionadosTres: any[] = [];

  avisoMasDeUnGanadorMarcadoUnoDos = false;
  avisoMasDeUnGanadorMarcadoUnoEmpate = false;
  avisoMasDeUnGanadorMarcadoDosEmpate = false;

  // Juego De CompeticionLiga seleccionado
  juegoSeleccionado: Juego;
  numeroTotalJornadas: number;
  jornadasDelJuego: Jornada[];
  JornadasCompeticion: TablaJornadas[] = [];
  jornadaId: number;
  juegodePuntosSeleccionadoID: number;

  // Información de la tabla: Muestra el JugadorUno, JugadorDos, Ganador, JornadaDeCompeticionLigaId y id
  EnfrentamientosJornadaSeleccionada: EnfrentamientoLiga[] = [];

  // Alumnos y Equipos del Juego
  listaAlumnosClasificacion: TablaAlumnoJuegoDeCompeticion[] = [];
  listaEquiposClasificacion: TablaEquipoJuegoDeCompeticion[] = [];
  alumnosJuegoDeCompeticionLiga: AlumnoJuegoDeCompeticionLiga[] = [];
  equiposJuegoDeCompeticionLiga: EquipoJuegoDeCompeticionLiga[] = [];
  alumnosDelJuego: Alumno[];
  equiposDelJuego: Equipo[];
  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDePuntos[];

  listaEquiposOrdenadaPorPuntos: EquipoJuegoDePuntos[];
  juegosActivosPuntos: Juego[];
  juegosActivosPuntosModo: Juego[];
  NumeroDeJuegoDePuntos: number;
  AlumnoJuegoDeCompeticionLigaId: number;

  dataSourceTablaGanadorIndividual;
  dataSourceTablaGanadorEquipo;

  // displayedColumnsAlumno: string[] = ['select1', 'nombreJugadorUno', 'select2', 'nombreJugadorDos', 'select3', 'Empate'];
  displayedColumnsAlumno: string[] = ['select1', 'nombreJugadorUno', 'select2', 'nombreJugadorDos', 'select3', 'Empate'];

  constructor( public sesion: SesionService,
               public location: Location,
               public calculos: CalculosService,
               public peticionesAPI: PeticionesAPIService) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.numeroTotalJornadas = this.juegoSeleccionado.NumeroTotalJornadas;
    console.log('Juego seleccionado: ');
    console.log(this.juegoSeleccionado);
    console.log('Número total de jornadas: ');
    console.log(this.numeroTotalJornadas);
    const datos = this.sesion.DameDatosJornadas();
    this.JornadasCompeticion = datos.JornadasCompeticion;
    console.log('Jornadas Competicion: ');
    // Teniendo la tabla de Jornadas puedo sacar los enfrentamientos de cada jornada accediendo a la api
    console.log(this.JornadasCompeticion);
    this.listaAlumnosClasificacion = this.sesion.DameTablaAlumnoJuegoDeCompeticion();
    this.listaEquiposClasificacion = this.sesion.DameTablaEquipoJuegoDeCompeticion();
    console.log(this.listaAlumnosClasificacion);
    this.alumnosJuegoDeCompeticionLiga = this.sesion.DameInscripcionAlumno();
    this.equiposJuegoDeCompeticionLiga = this.sesion.DameInscripcionEquipo();
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

  ObtenerEnfrentamientosDeCadaJornada(jornadaId: number) {
    console.log('Estoy en ObtenerEnfrentamientosDeCadaJornada()');
    console.log('El id de la jornada seleccionada es: ' + jornadaId);
    this.peticionesAPI.DameEnfrentamientosDeCadaJornadaLiga(jornadaId)
    .subscribe(enfrentamientos => {
      this.EnfrentamientosJornadaSeleccionada = enfrentamientos;
      console.log('Los enfrentamientos de esta jornada son: ');
      console.log(this.EnfrentamientosJornadaSeleccionada);
      console.log('Ya tengo los enfrentamientos de la jornada, ahora tengo que mostrarlos en una tabla');
      this.ConstruirTablaElegirGanador();
    });
  }

  ConstruirTablaElegirGanador() {
    console.log ('Estoy en ConstruitTablaElegirGanador(), los enfrentamientos son:');
    console.log(this.EnfrentamientosJornadaSeleccionada);
    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('Estoy en ConstruirTablaElegirGanador() alumnos');
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.listaAlumnosClasificacion.length; j++) {
          if (this.EnfrentamientosJornadaSeleccionada[i].JugadorUno === this.listaAlumnosClasificacion[j].id) {
            this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno = this.listaAlumnosClasificacion[j].nombre + ' ' +
                                                                          this.listaAlumnosClasificacion[j].primerApellido + ' ' +
                                                                          this.listaAlumnosClasificacion[j].segundoApellido;
            if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === this.listaAlumnosClasificacion[j].id) {
              this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = this.listaAlumnosClasificacion[j].nombre + ' ' +
                                                                                  this.listaAlumnosClasificacion[j].primerApellido + ' ' +
                                                                                  this.listaAlumnosClasificacion[j].segundoApellido;
            } else if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === 0) {
                this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = 'Empate';
            } else if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === undefined) {
                this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = '-';
            }
          } else if (this.EnfrentamientosJornadaSeleccionada[i].JugadorDos === this.listaAlumnosClasificacion[j].id) {
              this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos = this.listaAlumnosClasificacion[j].nombre + ' ' +
                                                                            this.listaAlumnosClasificacion[j].primerApellido + ' ' +
                                                                            this.listaAlumnosClasificacion[j].segundoApellido;
              if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === this.listaAlumnosClasificacion[j].id) {
                this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = this.listaAlumnosClasificacion[j].nombre + ' ' +
                                                                                    this.listaAlumnosClasificacion[j].primerApellido + ' ' +
                                                                                    this.listaAlumnosClasificacion[j].segundoApellido;
              } else if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === 0) {
                  this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = 'Empate';
              } else if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === undefined) {
                  this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = '-';
              }
          }
        }
      }
      console.log(this.EnfrentamientosJornadaSeleccionada);
      this.dataSourceTablaGanadorIndividual = new MatTableDataSource(this.EnfrentamientosJornadaSeleccionada);
      console.log('El dataSource es:');
      console.log(this.dataSourceTablaGanadorIndividual.data);

    } else {
      console.log('Estoy en ConstruirTablaElegirGanador() equipos');
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.listaEquiposClasificacion.length; j++) {
          if (this.EnfrentamientosJornadaSeleccionada[i].JugadorUno === this.listaEquiposClasificacion[j].id) {
            this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno = this.listaEquiposClasificacion[j].nombre;
            if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === this.listaEquiposClasificacion[j].id) {
              this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = this.listaEquiposClasificacion[j].nombre;
            } else if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === 0) {
                this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = 'Empate';
            } else if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === undefined) {
              this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = '-';
          }
          } else if (this.EnfrentamientosJornadaSeleccionada[i].JugadorDos === this.listaEquiposClasificacion[j].id) {
              this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos = this.listaEquiposClasificacion[j].nombre;
              if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === this.listaEquiposClasificacion[j].id) {
                this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = this.listaEquiposClasificacion[j].nombre;
              } else if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === 0) {
                this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = 'Empate';
              } else if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === undefined) {
                this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = '-';
            }
          }
        }
      }
      console.log(this.EnfrentamientosJornadaSeleccionada);
      this.dataSourceTablaGanadorEquipo = new MatTableDataSource(this.EnfrentamientosJornadaSeleccionada);
      console.log('El dataSource es:');
      console.log(this.dataSourceTablaGanadorEquipo.data);
    }
  }

  ///////////////////////////////////////////////////  ALEATORIAMENTE  /////////////////////////////////////////////////////////
  /* Esta función decide si los botones deben estar activos (si se ha seleccionado la jornada)
     o si debe estar desactivado (si no se ha seleccionado la jornada) */
  ActualizarBotonAleatorio() {
    console.log('Estoy en actualizar botón');
    // Lo primero borramos las listas de ganadores:
    console.log('Voy a borrar las listas de ganadores');
    this.enfrentamientosSeleccionadosColumnaUno = [];
    this.enfrentamientosSeleccionadosColumnaDos = [];
    this.enfrentamientosSeleccionadosColumnaTres = [];
    console.log(this.jornadaId);
    // if ((this.selection.selected.length === 0) || this.jornadaId === undefined) {
    if (this.jornadaId === undefined) {
      this.botonAsignarAleatorioDesactivado = true;
    } else {
      this.botonAsignarAleatorioDesactivado = false;
      this.ObtenerEnfrentamientosDeCadaJornada(this.jornadaId);
    }
    console.log('botonAsignarAleatorioDesactivado = ' + this.botonAsignarAleatorioDesactivado);
  }

  AsignarGanadorAleatoriamente() {
    console.log('Estoy en AsignarGanadorAleatoriamente()');
    console.log('La lista de enfrentamientos de esta Jornada es: ');
    console.log(this.EnfrentamientosJornadaSeleccionada);
    let Resultados = '';
    let Asignados = 'os enfrentamientos: ';
    const listaEnfrentamientosActualizados: EnfrentamientoLiga[] = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {
      if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === undefined) {
        const Random = Math.random();
        console.log('Random ' + i + ' = ' + Random);
        if (Random < 0.33) {
          this.EnfrentamientosJornadaSeleccionada[i].Ganador = this.EnfrentamientosJornadaSeleccionada[i].JugadorUno;
          this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno;
          console.log('El ganador del enfrentamiento ' + this.EnfrentamientosJornadaSeleccionada[i].id + ' es: '
                      + this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno);
          console.log(this.EnfrentamientosJornadaSeleccionada[i]);
          Resultados = Resultados + '\n' + 'Ganador: ' + this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno;
          listaEnfrentamientosActualizados.push(this.EnfrentamientosJornadaSeleccionada[i]);
        } else if (Random > 0.33 && Random < 0.66) {
          this.EnfrentamientosJornadaSeleccionada[i].Ganador = this.EnfrentamientosJornadaSeleccionada[i].JugadorDos;
          this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos;
          console.log('El ganador del enfrentamiento ' + this.EnfrentamientosJornadaSeleccionada[i].id + ' es: '
                      + this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos);
          console.log(this.EnfrentamientosJornadaSeleccionada[i]);
          Resultados = Resultados + '\n' + 'Ganador: ' + this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos;
          listaEnfrentamientosActualizados.push(this.EnfrentamientosJornadaSeleccionada[i]);
        } else if (Random > 0.66) {
          this.EnfrentamientosJornadaSeleccionada[i].Ganador = 0;
          this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = 'Empate';
          console.log('El enfrentamiento ' + this.EnfrentamientosJornadaSeleccionada[i].id + ' ha quedado en empate: ');
          console.log(this.EnfrentamientosJornadaSeleccionada[i]);
          Resultados = Resultados + '\n' + 'Empate';
          listaEnfrentamientosActualizados.push(this.EnfrentamientosJornadaSeleccionada[i]);
        }
        const enfrentamiento = new EnfrentamientoLiga(this.EnfrentamientosJornadaSeleccionada[i].JugadorUno,
                                                      this.EnfrentamientosJornadaSeleccionada[i].JugadorDos,
                                                      this.EnfrentamientosJornadaSeleccionada[i].Ganador,
                                                      this.EnfrentamientosJornadaSeleccionada[i].JornadaDeCompeticionLigaId,
                                                      undefined, undefined,
                                                      this.EnfrentamientosJornadaSeleccionada[i].id);
        this.peticionesAPI.PonGanadorDelEnfrentamiento(enfrentamiento).subscribe();
      } else {
        console.log('Este enfrentamiento ya tiene asignado un ganador: ');
        console.log(this.EnfrentamientosJornadaSeleccionada[i].nombreGanador);
        Asignados = Asignados + (i + 1) + 'º ' ;
      }

    }
    if (Resultados !== '' && Asignados === 'os enfrentamientos: ') {
      console.log('La lista de enfrentamientos actualizados queda: ');
      console.log(listaEnfrentamientosActualizados);
      console.log('Los Resultados son: ' + Resultados);
      Swal.fire(Resultados, 'Estos son los resultados', 'success');
    } else if (Resultados === '' && Asignados !== '') {
      Swal.fire('L' + Asignados + ' ya tienen asignado un gandaor',
      'No se ha podido asignar ganador a estos enfrentamientos', 'error');
    } else if (Resultados !== '' && Asignados !== '') {
      Swal.fire(Resultados, 'No se ha podido asignar ganador a l' + Asignados + 'porque ya tienen asignado un gandaor. ',
                'success');
    }

    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('Este Juego es Individual');
      this.AsignarPuntosAlumnosGanadorAleatoriamente(listaEnfrentamientosActualizados, this.alumnosJuegoDeCompeticionLiga);
    } else {
      console.log('Este Juego es por Equipos');
      this.AsignarPuntosEquiposGanadorAleatoriamente(listaEnfrentamientosActualizados, this.equiposJuegoDeCompeticionLiga);
    }
  }

  AsignarPuntosAlumnosGanadorAleatoriamente(listaEnfrentamientosActualizados: EnfrentamientoLiga[],
                                            alumnosJuegoDeCompeticionLiga: AlumnoJuegoDeCompeticionLiga[]) {
    console.log('Estoy en AsignarGanadorAlumnosAleatoriamente()');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < listaEnfrentamientosActualizados.length; i++) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < alumnosJuegoDeCompeticionLiga.length; j++) {
        if (listaEnfrentamientosActualizados[i].Ganador === alumnosJuegoDeCompeticionLiga[j].AlumnoId) {
          alumnosJuegoDeCompeticionLiga[j].PuntosTotalesAlumno = alumnosJuegoDeCompeticionLiga[j].PuntosTotalesAlumno + 3;
          console.log('El alumno ganador actualizado queda: ');
          console.log(alumnosJuegoDeCompeticionLiga[j]);
        } else if (listaEnfrentamientosActualizados[i].Ganador === 0) {
          if (listaEnfrentamientosActualizados[i].JugadorUno === alumnosJuegoDeCompeticionLiga[j].AlumnoId) {
            console.log('Ya tengo el JugadorUno del enfrentamiento ' + listaEnfrentamientosActualizados[i].id
                         + ', voy a sumarle un punto y actualizar la BD');
            alumnosJuegoDeCompeticionLiga[j].PuntosTotalesAlumno = alumnosJuegoDeCompeticionLiga[j].PuntosTotalesAlumno + 1;
          } else if (listaEnfrentamientosActualizados[i].JugadorDos === alumnosJuegoDeCompeticionLiga[j].AlumnoId) {
            console.log('Ya tengo el JugadorDos del enfrentamiento ' + listaEnfrentamientosActualizados[i].id
                          + ', voy a sumarle un punto y actualizar la BD');
            alumnosJuegoDeCompeticionLiga[j].PuntosTotalesAlumno = alumnosJuegoDeCompeticionLiga[j].PuntosTotalesAlumno + 1;
          }
        }
        this.peticionesAPI.PonPuntosAlumnoGanadorJuegoDeCompeticionLiga(alumnosJuegoDeCompeticionLiga[j])
        .subscribe();
      }
    }
  }

  AsignarPuntosEquiposGanadorAleatoriamente(listaEnfrentamientosActualizados: EnfrentamientoLiga[],
                                            equiposJuegoDeCompeticionLiga: EquipoJuegoDeCompeticionLiga[]) {
    console.log('Estoy en AsignarGanadorAlumnosAleatoriamente()');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < listaEnfrentamientosActualizados.length; i++) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < equiposJuegoDeCompeticionLiga.length; j++) {
        if (listaEnfrentamientosActualizados[i].Ganador === equiposJuegoDeCompeticionLiga[j].EquipoId) {
          equiposJuegoDeCompeticionLiga[j].PuntosTotalesEquipo = equiposJuegoDeCompeticionLiga[j].PuntosTotalesEquipo + 3;
          console.log('El alumno ganador actualizado queda: ');
          console.log(equiposJuegoDeCompeticionLiga[j]);
        } else if (listaEnfrentamientosActualizados[i].Ganador === 0) {
          if (listaEnfrentamientosActualizados[i].JugadorUno === equiposJuegoDeCompeticionLiga[j].EquipoId) {
            console.log('Ya tengo el JugadorUno del enfrentamiento ' + listaEnfrentamientosActualizados[i].id
                         + ', voy a sumarle un punto y actualizar la BD');
            equiposJuegoDeCompeticionLiga[j].PuntosTotalesEquipo = equiposJuegoDeCompeticionLiga[j].PuntosTotalesEquipo + 1;
          } else if (listaEnfrentamientosActualizados[i].JugadorDos === equiposJuegoDeCompeticionLiga[j].EquipoId) {
            console.log('Ya tengo el JugadorDos del enfrentamiento ' + listaEnfrentamientosActualizados[i].id
                          + ', voy a sumarle un punto y actualizar la BD');
            equiposJuegoDeCompeticionLiga[j].PuntosTotalesEquipo = equiposJuegoDeCompeticionLiga[j].PuntosTotalesEquipo + 1;
          }
        }
        this.peticionesAPI.PonPuntosEquipoGanadorJuegoDeCompeticionLiga(equiposJuegoDeCompeticionLiga[j])
        .subscribe();
      }
    }
  }

  ///////////////////////////////////////////////////  MANUALMENTE  /////////////////////////////////////////////////////////

  /* Esta función decide si los botones deben estar activos (si se ha seleccionado la jornada)
     o si debe estar desactivado (si no se ha seleccionado la jornada) */
  ActualizarBotonManual() {
    console.log('Estoy en actualizar botón');
    console.log(this.jornadaId);
    // if ((this.selection.selected.length === 0) || this.jornadaId === undefined) {
    if (this.jornadaId === undefined) {
      this.botonAsignarManualDesactivado = true;
    } else {
      this.botonAsignarManualDesactivado = false;
      this.ObtenerEnfrentamientosDeCadaJornada(this.jornadaId);
    }
    console.log(this.botonAsignarAleatorioDesactivado);
  }

  RevisarMultipleSeleccion() {
    console.log('Selección en ColumnaUno');
    console.log(this.enfrentamientosSeleccionadosColumnaUno);
    console.log('Selección en ColumnaDos');
    console.log(this.enfrentamientosSeleccionadosColumnaDos);
    console.log('Selección en ColumnaTres');
    console.log(this.enfrentamientosSeleccionadosColumnaTres);

    this.avisoMasDeUnGanadorMarcadoDosEmpate = false;
    this.avisoMasDeUnGanadorMarcadoUnoDos = false;
    this.avisoMasDeUnGanadorMarcadoUnoEmpate = false;

    // Segundo miramos si solo hay una selección por enfrentamiento
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.enfrentamientosSeleccionadosColumnaUno.length; i++) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < this.enfrentamientosSeleccionadosColumnaDos.length; j++) {
        if (this.enfrentamientosSeleccionadosColumnaUno[i].id === this.enfrentamientosSeleccionadosColumnaDos[j].id) {
            this.avisoMasDeUnGanadorMarcadoUnoDos = true;
            console.log('Hay alguna selección con ganadorUno y ganadorDos, poner el sweatalert');
            console.log(this.enfrentamientosSeleccionadosColumnaDos[j]);
            console.log(this.enfrentamientosSeleccionadosColumnaUno[i].id);
        }
      }
      // tslint:disable-next-line:prefer-for-of
      for (let k = 0; k < this.enfrentamientosSeleccionadosColumnaTres.length; k++) {
        if (this.enfrentamientosSeleccionadosColumnaUno[i].id === this.enfrentamientosSeleccionadosColumnaTres[k].id) {
            this.avisoMasDeUnGanadorMarcadoUnoEmpate = true;
            console.log('Hay alguna selección con ganadorUno y Empate, poner el sweatalert');
            console.log(this.enfrentamientosSeleccionadosColumnaUno[i]);
            console.log(this.enfrentamientosSeleccionadosColumnaTres[k].id);
        }
      }
    }

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.enfrentamientosSeleccionadosColumnaDos.length; i++) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < this.enfrentamientosSeleccionadosColumnaTres.length; j++) {
        if (this.enfrentamientosSeleccionadosColumnaDos[i].id === this.enfrentamientosSeleccionadosColumnaTres[j].id) {
            this.avisoMasDeUnGanadorMarcadoUnoEmpate = true;
            console.log('Hay alguna selección con ganadorDos y Empate, poner sweatalert');
            console.log(this.enfrentamientosSeleccionadosColumnaDos[i]);
            console.log(this.enfrentamientosSeleccionadosColumnaTres[j].id);
        }
      }
    }

    // tslint:disable-next-line:max-line-length
    console.log('avisoMasDeUnGanadorMarcadoUnoEmpate = ' + this.avisoMasDeUnGanadorMarcadoUnoEmpate);
    console.log('avisoMasDeUnGanadorMarcadoDosEmpate = ' + this.avisoMasDeUnGanadorMarcadoDosEmpate);
    console.log('avisoMasDeUnGanadorMarcadoUnoDos = ' + this.avisoMasDeUnGanadorMarcadoUnoDos);

    if (this.avisoMasDeUnGanadorMarcadoDosEmpate === false && this.avisoMasDeUnGanadorMarcadoUnoDos === false
      && this.avisoMasDeUnGanadorMarcadoUnoEmpate === false) {
        return false;
    } else {
        return true;
    }
  }

  AsignarGanadorManualmente() {
    /////////////////////////////////////////////////////   INDIVIDUAL   //////////////////////////////////////////////////
    if (this.juegoSeleccionado.Modo === 'Individual') {
      const seleccionMultiple = this.calculos.RevisarMultipleSeleccion(this.enfrentamientosSeleccionadosColumnaUno,
                                                                       this.enfrentamientosSeleccionadosColumnaDos,
                                                                       this.enfrentamientosSeleccionadosColumnaTres);

      if (seleccionMultiple === false) {
            // -------------------------------- GANADOR UNO ----------------------------------- //
            if (this.enfrentamientosSeleccionadosColumnaUno.length > 0) {
              this.calculos.AsignarGanadorIndividual(this.enfrentamientosSeleccionadosColumnaUno, this.EnfrentamientosJornadaSeleccionada,
                                                     this.listaAlumnosClasificacion, this.alumnosJuegoDeCompeticionLiga,
                                                     this.juegoSeleccionado, 1);
            }


            // -------------------------------- GANADOR DOS ----------------------------------- //
            if (this.enfrentamientosSeleccionadosColumnaDos.length > 0) {
              this.calculos.AsignarGanadorIndividual(this.enfrentamientosSeleccionadosColumnaDos, this.EnfrentamientosJornadaSeleccionada,
                                                     this.listaAlumnosClasificacion, this.alumnosJuegoDeCompeticionLiga,
                                                     this.juegoSeleccionado, 2);
            }


            // ----------------------------------- EMPATE ------------------------------------- //
            if (this.enfrentamientosSeleccionadosColumnaTres.length > 0) {
              this.calculos.AsignarEmpateIndividual(this.enfrentamientosSeleccionadosColumnaTres,
                                                    this.EnfrentamientosJornadaSeleccionada,
                                                    this.listaAlumnosClasificacion,
                                                    this.alumnosJuegoDeCompeticionLiga,
                                                    this.juegoSeleccionado, 0);
            }
      } else {
          Swal.fire('Hay más de una selección en alguno de los enfrentamientos', ' No se ha podido realizar esta acción', 'error');
          console.log('Hay más de una selección en alguno de los enfrentamientos');
      }///////////////////////////////////////////////////////   EQUIPOS   ////////////////////////////////////////////////////
    } else {
      const seleccionMultiple = this.calculos.RevisarMultipleSeleccion(this.enfrentamientosSeleccionadosColumnaUno,
                                                                       this.enfrentamientosSeleccionadosColumnaDos,
                                                                       this.enfrentamientosSeleccionadosColumnaTres);
      console.log(seleccionMultiple);
      if (seleccionMultiple === false) {
        // -------------------------------- GANADOR UNO ----------------------------------- //
        if (this.enfrentamientosSeleccionadosColumnaUno.length > 0) {
          console.log('Estoy dentro de seleccionados columna uno');
          this.calculos.AsignarGanadorEquipos(this. enfrentamientosSeleccionadosColumnaUno, this.EnfrentamientosJornadaSeleccionada,
                                               this.listaEquiposClasificacion,
                                               this.equiposJuegoDeCompeticionLiga,
                                               this.juegoSeleccionado, 1);
        }

        // -------------------------------- GANADOR DOS ----------------------------------- //
        if (this.enfrentamientosSeleccionadosColumnaDos.length > 0) {
          this.calculos.AsignarGanadorEquipos(this. enfrentamientosSeleccionadosColumnaDos, this.EnfrentamientosJornadaSeleccionada,
                                               this.listaEquiposClasificacion,
                                               this.equiposJuegoDeCompeticionLiga,
                                               this.juegoSeleccionado, 2);
        }

        // ----------------------------------- EMPATE ------------------------------------- //
        if (this.enfrentamientosSeleccionadosColumnaTres.length > 0) {
          this.calculos.AsignarEmpateEquipos(this.enfrentamientosSeleccionadosColumnaTres,
                                             this.EnfrentamientosJornadaSeleccionada,
                                             this.listaEquiposClasificacion,
                                             this.equiposJuegoDeCompeticionLiga,
                                             this.juegoSeleccionado, 0) ;
        }
      } else {
        Swal.fire('Hay más de una selección en alguno de los enfrentamientos', ' No se ha podido realizar esta acción', 'error');
        console.log('Hay más de una selección en alguno de los enfrentamientos');
      }
    }
  }

  AddToListGanadorUno() {
    if (this.juegoSeleccionado.Modo === 'Individual') {
      // tslint:disable-next-line:prefer-for-of
      for ( let i = 0; i < this.dataSourceTablaGanadorIndividual.data.length; i++) {
        if (this.selectionUno.isSelected(this.dataSourceTablaGanadorIndividual.data[i]))  {
          const indexOfUnselected = this.enfrentamientosSeleccionadosColumnaUno.indexOf(this.dataSourceTablaGanadorIndividual.data[i]);
          if (indexOfUnselected === -1) {
            this.enfrentamientosSeleccionadosColumnaUno.push(this.dataSourceTablaGanadorIndividual.data[i]);
          } else {
            this.enfrentamientosSeleccionadosColumnaUno.splice(indexOfUnselected, 1);
          }
          this.selectionUno.deselect(this.dataSourceTablaGanadorIndividual.data[i]);
        }
      }
    } else {
      // tslint:disable-next-line:prefer-for-of
      for ( let j = 0; j < this.dataSourceTablaGanadorEquipo.data.length; j++) {
        if (this.selectionUno.isSelected(this.dataSourceTablaGanadorEquipo.data[j])) {
          const indexOfUnselected = this.enfrentamientosSeleccionadosColumnaUno.indexOf(this.dataSourceTablaGanadorEquipo.data[j]);
          if (indexOfUnselected === -1) {
            this.enfrentamientosSeleccionadosColumnaUno.push(this.dataSourceTablaGanadorEquipo.data[j]);
          } else {
            this.enfrentamientosSeleccionadosColumnaUno.splice(indexOfUnselected, 1);
          }
          this.selectionUno.deselect(this.dataSourceTablaGanadorEquipo.data[j]);
        }
      }
    }
  }

  AddToListGanadorDos() {
    if (this.juegoSeleccionado.Modo === 'Individual') {
      // tslint:disable-next-line:prefer-for-of
      for ( let i = 0; i < this.dataSourceTablaGanadorIndividual.data.length; i++) {
        if (this.selectionDos.isSelected(this.dataSourceTablaGanadorIndividual.data[i]))  {
          const indexOfUnselected = this.enfrentamientosSeleccionadosColumnaDos.indexOf(this.dataSourceTablaGanadorIndividual.data[i]);
          if (indexOfUnselected === -1) {
            this.enfrentamientosSeleccionadosColumnaDos.push(this.dataSourceTablaGanadorIndividual.data[i]);
          } else {
            this.enfrentamientosSeleccionadosColumnaDos.splice(indexOfUnselected, 1);
          }
          this.selectionDos.deselect(this.dataSourceTablaGanadorIndividual.data[i]);
        }
      }
    } else {
      // tslint:disable-next-line:prefer-for-of
      for ( let i = 0; i < this.dataSourceTablaGanadorEquipo.data.length; i++) {
        if (this.selectionDos.isSelected(this.dataSourceTablaGanadorEquipo.data[i]))  {
          const indexOfUnselected = this.enfrentamientosSeleccionadosColumnaDos.indexOf(this.dataSourceTablaGanadorEquipo.data[i]);
          if (indexOfUnselected === -1) {
            this.enfrentamientosSeleccionadosColumnaDos.push(this.dataSourceTablaGanadorEquipo.data[i]);
          } else {
            this.enfrentamientosSeleccionadosColumnaDos.splice(indexOfUnselected, 1);
          }
          this.selectionDos.deselect(this.dataSourceTablaGanadorEquipo.data[i]);
        }
      }
    }
  }

  AddToListGanadorTres() {
    if (this.juegoSeleccionado.Modo === 'Individual') {
      // tslint:disable-next-line:prefer-for-of
      for ( let i = 0; i < this.dataSourceTablaGanadorIndividual.data.length; i++) {
        if (this.selectionTres.isSelected(this.dataSourceTablaGanadorIndividual.data[i]))  {
          const indexOfUnselected = this.enfrentamientosSeleccionadosColumnaTres.indexOf(this.dataSourceTablaGanadorIndividual.data[i]);
          if (indexOfUnselected === -1) {
            this.enfrentamientosSeleccionadosColumnaTres.push(this.dataSourceTablaGanadorIndividual.data[i]);
          } else {
            this.enfrentamientosSeleccionadosColumnaTres.splice(indexOfUnselected, 1);
          }
          this.selectionTres.deselect(this.dataSourceTablaGanadorIndividual.data[i]);
        }
      }
    } else {
      // tslint:disable-next-line:prefer-for-of
      for ( let i = 0; i < this.dataSourceTablaGanadorEquipo.data.length; i++) {
        if (this.selectionTres.isSelected(this.dataSourceTablaGanadorEquipo.data[i]))  {
          const indexOfUnselected = this.enfrentamientosSeleccionadosColumnaTres.indexOf(this.dataSourceTablaGanadorEquipo.data[i]);
          if (indexOfUnselected === -1) {
            this.enfrentamientosSeleccionadosColumnaTres.push(this.dataSourceTablaGanadorEquipo.data[i]);
          } else {
            this.enfrentamientosSeleccionadosColumnaTres.splice(indexOfUnselected, 1);
          }
          this.selectionTres.deselect(this.dataSourceTablaGanadorEquipo.data[i]);
        }
      }
    }
  }

  /* Para averiguar si todas las filas están seleccionadas */
  IsAllSelectedUno() {
    let numSelected = 0;
    let numRows = 0;
    // console.log('Estoy en IsAllSelectedUno()');
    if (this.juegoSeleccionado.Modo === 'Individual') {
      numSelected = this.selectionUno.selected.length;
      numRows = this.dataSourceTablaGanadorIndividual.data.length;
    } else {
      numSelected = this.selectionUno.selected.length;
      numRows = this.dataSourceTablaGanadorEquipo.data.length;
    }
    // console.log('this.selectionUno es:');
    // console.log(this.selectionUno);
    return numSelected === numRows;
  }

  /* Cuando se clica en el checkbox de cabecera hay que ver si todos los
    * checkbox estan acivados, en cuyo caso se desactivan todos, o si hay alguno
    * desactivado, en cuyo caso se activan todos */
  MasterToggleUno() {
    if (this.IsAllSelectedUno()) {
      this.selectionUno.clear(); // Desactivamos todos
      this.enfrentamientosSeleccionadosColumnaUno = [];
      console.log('Los enfrentamientos con ganadorDos son (individual): ');
      console.log(this.enfrentamientosSeleccionadosColumnaUno);
    } else {
      // activamos todos
      if (this.juegoSeleccionado.Modo === 'Individual') {
        this.dataSourceTablaGanadorIndividual.data.forEach(row => {
          this.selectionUno.select(row);
          this.enfrentamientosSeleccionadosColumnaUno.push(row);
        });
        console.log('Los enfrentamientos con ganadorDos son (individual): ');
        console.log(this.enfrentamientosSeleccionadosColumnaUno);
      } else {
        this.dataSourceTablaGanadorEquipo.data.forEach(row => {
          this.selectionUno.select(row);
          this.enfrentamientosSeleccionadosColumnaUno.push(row);
        });
        console.log('Los enfrentamientos con ganadorDos son (equipo): ');
        console.log(this.enfrentamientosSeleccionadosColumnaUno);
      }
    }
  }

  /* Para averiguar si todas las filas están seleccionadas */
  IsAllSelectedDos() {
    let numSelected = 0;
    let numRows = 0;
    // console.log('Estoy en IsAllSelectedUno()');
    if (this.juegoSeleccionado.Modo === 'Individual') {
      numSelected = this.selectionDos.selected.length;
      numRows = this.dataSourceTablaGanadorIndividual.data.length;
    } else {
      numSelected = this.selectionDos.selected.length;
      numRows = this.dataSourceTablaGanadorEquipo.data.length;
    }
    // console.log('this.selectionUno es:');
    // console.log(this.selectionUno);
    return numSelected === numRows;
  }

  /* Cuando se clica en el checkbox de cabecera hay que ver si todos los
    * checkbox estan acivados, en cuyo caso se desactivan todos, o si hay alguno
    * desactivado, en cuyo caso se activan todos */
  MasterToggleDos() {
    if (this.IsAllSelectedDos()) {
      this.selectionDos.clear(); // Desactivamos todos
      this.enfrentamientosSeleccionadosColumnaDos = [];
      console.log('Los enfrentamientos con ganadorDos son (individual): ');
      console.log(this.enfrentamientosSeleccionadosColumnaDos);
    } else {
      // activamos todos
      if (this.juegoSeleccionado.Modo === 'Individual') {
        this.dataSourceTablaGanadorIndividual.data.forEach(row => {
          this.selectionDos.select(row);
          this.enfrentamientosSeleccionadosColumnaDos.push(row);
        });
        console.log('Los enfrentamientos con ganadorDos son (individual): ');
        console.log(this.enfrentamientosSeleccionadosColumnaDos);
      } else {
        this.dataSourceTablaGanadorEquipo.data.forEach(row => {
          this.selectionDos.select(row);
          this.enfrentamientosSeleccionadosColumnaDos.push(row);
        });
        console.log('Los enfrentamientos con ganadorDos son (equipo): ');
        console.log(this.enfrentamientosSeleccionadosColumnaDos);
      }
    }
  }

  /* Para averiguar si todas las filas están seleccionadas */
  IsAllSelectedTres() {
    let numSelected = 0;
    let numRows = 0;
    // console.log('Estoy en IsAllSelectedUno()');
    if (this.juegoSeleccionado.Modo === 'Individual') {
      numSelected = this.selectionTres.selected.length;
      numRows = this.dataSourceTablaGanadorIndividual.data.length;
    } else {
      numSelected = this.selectionTres.selected.length;
      numRows = this.dataSourceTablaGanadorEquipo.data.length;
    }
    // console.log('this.selectionUno es:');
    // console.log(this.selectionUno);
    return numSelected === numRows;
  }

  /* Cuando se clica en el checkbox de cabecera hay que ver si todos los
    * checkbox estan acivados, en cuyo caso se desactivan todos, o si hay alguno
    * desactivado, en cuyo caso se activan todos */
  MasterToggleTres() {
    if (this.IsAllSelectedTres()) {
      this.selectionTres.clear(); // Desactivamos todos
      this.enfrentamientosSeleccionadosColumnaTres = [];
      console.log('Los enfrentamientos con ganadorTres son (individual): ');
      console.log(this.enfrentamientosSeleccionadosColumnaTres);
    } else {
      // activamos todos
      if (this.juegoSeleccionado.Modo === 'Individual') {
        this.dataSourceTablaGanadorIndividual.data.forEach(row => {
          this.selectionTres.select(row);
          this.enfrentamientosSeleccionadosColumnaTres.push(row);
        });
        console.log('Los enfrentamientos con ganadorTres son (individual): ');
        console.log(this.enfrentamientosSeleccionadosColumnaTres);
      } else {
        this.dataSourceTablaGanadorEquipo.data.forEach(row => {
          this.selectionTres.select(row);
          this.enfrentamientosSeleccionadosColumnaTres.push(row);
        });
        console.log('Los enfrentamientos con ganadorTres son (equipo): ');
        console.log(this.enfrentamientosSeleccionadosColumnaTres);
      }
    }
  }

  ///////////////////////////////////////////////////  MEDIANTE JUEGO DE PUNTOS  /////////////////////////////////////////////////////////
  ActualizarBotonJuego() {
    console.log('Estoy en actualizar botón');
    if (this.jornadaId === undefined || this.juegodePuntosSeleccionadoID === undefined) {
      this.botonAsignarJuegoDesactivado = true;
    } else {
      this.botonAsignarJuegoDesactivado = false;
    }
    console.log('botonAsignarJuegoDesactivado = ' + this.botonAsignarJuegoDesactivado);
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
              console.log(this.listaAlumnosOrdenadaPorPuntos);
            } else {
              this.NumeroDeJuegoDePuntos = i;
              this.RecuperarInscripcionesEquiposJuego();
              console.log(this.listaEquiposOrdenadaPorPuntos);
            }
          console.log('Alumnos');
          console.log(this.listaAlumnosOrdenadaPorPuntos);
          console.log('Equipo');
          console.log(this.listaEquiposOrdenadaPorPuntos);
          }
        }
  }

  AsignarGanadorJuegoPuntos() {
    console.log('Entramos en Asignar ganador puntos');
    console.log(this.juegosActivosPuntosModo);
    console.log(this.juegodePuntosSeleccionadoID);
    const listaEnfrentamientosActualizados: EnfrentamientoLiga[] = [];
    let JugadorUno: AlumnoJuegoDePuntos;
    let JugadorDos: AlumnoJuegoDePuntos;
    let JugadorUnoEq: EquipoJuegoDePuntos;
    let JugadorDosEq: EquipoJuegoDePuntos;
    let Resultados = '';
    let Asignados = 'os enfrentamientos: ';
    console.log('Ya he salido del primer if y del primer FOR');
    console.log(this.NumeroDeJuegoDePuntos);
    console.log(this.juegosActivosPuntosModo[this.NumeroDeJuegoDePuntos].Modo);
    if (this.juegosActivosPuntosModo[this.NumeroDeJuegoDePuntos].Modo === 'Individual') {
      console.log('Estoy en AsignarGanadorJuegoPuntos()');
      console.log('La lista de enfrentamientos de esta Jornada es: ');
      console.log(this.EnfrentamientosJornadaSeleccionada);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {
        if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === undefined) {
          // Para cada enfrentamiento
          // tslint:disable-next-line:prefer-for-of
          for (let y = 0; y < this.listaAlumnosOrdenadaPorPuntos.length; y++) {
            // Busco a los jugadores del enfrentamiento en la lista de participantes del juego de puntos
            if (this.listaAlumnosOrdenadaPorPuntos[y].alumnoId === this.EnfrentamientosJornadaSeleccionada[i].JugadorUno) {
              // Saco al jugador uno de la lista de participantes del juego de puntos
              JugadorUno = this.listaAlumnosOrdenadaPorPuntos[y];
              console.log('Jugador uno ' + JugadorUno);

              if (this.EnfrentamientosJornadaSeleccionada[i].JugadorUno === this.EnfrentamientosJornadaSeleccionada[i].JugadorDos) {
                JugadorDos = this.listaAlumnosOrdenadaPorPuntos[y];
                console.log('Jugador dos ' + JugadorDos);
              }
            } else if (this.listaAlumnosOrdenadaPorPuntos[y].alumnoId === this.EnfrentamientosJornadaSeleccionada[i].JugadorDos) {
              // Saco al jugador dos de la lista de participantes del juego de puntos
              JugadorDos = this.listaAlumnosOrdenadaPorPuntos[y];
              console.log('Jugador dos ' + JugadorDos);
            }
          }
          console.log(JugadorUno);
          console.log(JugadorDos);
          if (JugadorUno.PuntosTotalesAlumno > JugadorDos.PuntosTotalesAlumno) {
              console.log('Ha ganado el Jugador uno');

              this.EnfrentamientosJornadaSeleccionada[i].Ganador = this.EnfrentamientosJornadaSeleccionada[i].JugadorUno;
              this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno;
              Resultados = Resultados + '\n' + 'Ganador: ' + this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno;
              console.log('El ganador del enfrentamiento ' + this.EnfrentamientosJornadaSeleccionada[i].id + ' es: '
              + this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno);
              console.log(this.EnfrentamientosJornadaSeleccionada[i]);
              listaEnfrentamientosActualizados.push(this.EnfrentamientosJornadaSeleccionada[i]);
          } else if (JugadorUno.PuntosTotalesAlumno < JugadorDos.PuntosTotalesAlumno) {
              console.log('Ha ganado el Jugador dos');
              this.EnfrentamientosJornadaSeleccionada[i].Ganador = this.EnfrentamientosJornadaSeleccionada[i].JugadorDos;
              this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos;
              Resultados = Resultados + '\n' + 'Ganador: ' + this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos;
              console.log('El ganador del enfrentamiento ' + this.EnfrentamientosJornadaSeleccionada[i].id + ' es: '
              + this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos);
              console.log(this.EnfrentamientosJornadaSeleccionada[i]);
              listaEnfrentamientosActualizados.push(this.EnfrentamientosJornadaSeleccionada[i]);
          } else {
              console.log('Empate');
              this.EnfrentamientosJornadaSeleccionada[i].Ganador = 0;
              this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = 'Empate';
              console.log('El enfrentamiento ' + this.EnfrentamientosJornadaSeleccionada[i].id + ' ha quedado en empate: ');
              Resultados = Resultados + '\n' + 'Empate';
              console.log(this.EnfrentamientosJornadaSeleccionada[i]);
              listaEnfrentamientosActualizados.push(this.EnfrentamientosJornadaSeleccionada[i]);
          }
          const enfrentamiento = new EnfrentamientoLiga(this.EnfrentamientosJornadaSeleccionada[i].JugadorUno,
                                                        this.EnfrentamientosJornadaSeleccionada[i].JugadorDos,
                                                        this.EnfrentamientosJornadaSeleccionada[i].Ganador,
                                                        this.EnfrentamientosJornadaSeleccionada[i].JornadaDeCompeticionLigaId,
                                                        undefined, undefined,
                                                        this.EnfrentamientosJornadaSeleccionada[i].id);
          this.peticionesAPI.PonGanadorDelEnfrentamiento(enfrentamiento).subscribe();
        } else {
          console.log('Este enfrentamiento ya tiene asignado un ganador: ');
          console.log(this.EnfrentamientosJornadaSeleccionada[i].nombreGanador);
          Asignados = Asignados + (i + 1) + 'º ' ;
        }
      }

      if (Resultados !== '' && Asignados === 'os enfrentamientos: ') {
        console.log('La lista de enfrentamientos actualizados queda: ');
        console.log(listaEnfrentamientosActualizados);
        console.log('Los Resultados son: ' + Resultados);
        Swal.fire(Resultados, 'Estos son los resultados', 'success');
      } else if (Resultados === '' && Asignados !== '') {
        Swal.fire('L' + Asignados + ' ya tienen asignado un gandaor',
        'No se ha podido asignar ganador a estos enfrentamientos', 'error');
      } else if (Resultados !== '' && Asignados !== '') {
        Swal.fire(Resultados, 'No se ha podido asignar ganador a l' + Asignados + 'porque ya tienen asignado un gandaor. ',
                  'success');
      }

      console.log('La lista de enfrentamientos actualizados queda: ');
      console.log(listaEnfrentamientosActualizados);
      console.log('Este Juego es Individual');
      this.AsignarPuntosAlumnosGanadorAleatoriamente(listaEnfrentamientosActualizados, this.alumnosJuegoDeCompeticionLiga);

    } else {
      console.log('Estoy en AsignarGanadorJuegoPuntos() por equipos');
      console.log('La lista de enfrentamientos de esta Jornada es: ');
      console.log(this.EnfrentamientosJornadaSeleccionada);

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {
        if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === undefined) {
          // Para cada enfrentamiento
          // tslint:disable-next-line:prefer-for-of
          for (let y = 0; y < this.listaEquiposOrdenadaPorPuntos.length; y++) {
            // Busco a los jugadores del enfrentamiento en la lista de participantes del juego de puntos
            if (this.listaEquiposOrdenadaPorPuntos[y].equipoId === this.EnfrentamientosJornadaSeleccionada[i].JugadorUno) {
              // Saco al jugador uno de la lista de participantes del juego de puntos
              JugadorUnoEq = this.listaEquiposOrdenadaPorPuntos[y];
              console.log('Jugador uno ' + JugadorUnoEq);
              if (this.EnfrentamientosJornadaSeleccionada[i].JugadorUno === this.EnfrentamientosJornadaSeleccionada[i].JugadorDos) {
                JugadorDosEq = this.listaEquiposOrdenadaPorPuntos[y];
                console.log('Jugador dos IFF ' + JugadorDosEq);
              }
            } else if (this.listaEquiposOrdenadaPorPuntos[y].equipoId === this.EnfrentamientosJornadaSeleccionada[i].JugadorDos) {
              // Saco al jugador dos de la lista de participantes del juego de puntos
              JugadorDosEq = this.listaEquiposOrdenadaPorPuntos[y];
              console.log('Jugador dos ' + JugadorDosEq);
            }
          }
          if (JugadorUnoEq.PuntosTotalesEquipo > JugadorDosEq.PuntosTotalesEquipo) {
              console.log('Ha ganado el Jugador uno');

              this.EnfrentamientosJornadaSeleccionada[i].Ganador = this.EnfrentamientosJornadaSeleccionada[i].JugadorUno;
              this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno;
              Resultados = Resultados + '\n' + 'Ganador: ' + this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno;
              console.log('El ganador del enfrentamiento ' + this.EnfrentamientosJornadaSeleccionada[i].id + ' es: '
              + this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno);
              console.log(this.EnfrentamientosJornadaSeleccionada[i]);
              listaEnfrentamientosActualizados.push(this.EnfrentamientosJornadaSeleccionada[i]);
          } else if (JugadorUnoEq.PuntosTotalesEquipo < JugadorDosEq.PuntosTotalesEquipo) {
              console.log('Ha ganado el Jugador dos');
              this.EnfrentamientosJornadaSeleccionada[i].Ganador = this.EnfrentamientosJornadaSeleccionada[i].JugadorDos;
              this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos;
              Resultados = Resultados + '\n' + 'Ganador: ' + this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos;
              console.log('El ganador del enfrentamiento ' + this.EnfrentamientosJornadaSeleccionada[i].id + ' es: '
              + this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos);
              console.log(this.EnfrentamientosJornadaSeleccionada[i]);
              listaEnfrentamientosActualizados.push(this.EnfrentamientosJornadaSeleccionada[i]);
          } else {
              console.log('Empate');
              this.EnfrentamientosJornadaSeleccionada[i].Ganador = 0;
              this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = 'Empate';
              console.log('El enfrentamiento ' + this.EnfrentamientosJornadaSeleccionada[i].id + ' ha quedado en empate: ');
              Resultados = Resultados + '\n' + 'Empate';
              console.log(this.EnfrentamientosJornadaSeleccionada[i]);
              listaEnfrentamientosActualizados.push(this.EnfrentamientosJornadaSeleccionada[i]);
          }
          const enfrentamiento = new EnfrentamientoLiga(this.EnfrentamientosJornadaSeleccionada[i].JugadorUno,
                                                        this.EnfrentamientosJornadaSeleccionada[i].JugadorDos,
                                                        this.EnfrentamientosJornadaSeleccionada[i].Ganador,
                                                        this.EnfrentamientosJornadaSeleccionada[i].JornadaDeCompeticionLigaId,
                                                        undefined, undefined,
                                                        this.EnfrentamientosJornadaSeleccionada[i].id);
          this.peticionesAPI.PonGanadorDelEnfrentamiento(enfrentamiento).subscribe();

        } else {
          console.log('Este enfrentamiento ya tiene asignado un ganador: ');
          console.log(this.EnfrentamientosJornadaSeleccionada[i].nombreGanador);
          Asignados = Asignados + (i + 1) + 'º ' ;
        }
      }

      if (Resultados !== '' && Asignados === 'os enfrentamientos: ') {
        console.log('La lista de enfrentamientos actualizados queda: ');
        console.log(listaEnfrentamientosActualizados);
        console.log('Los Resultados son: ' + Resultados);
        Swal.fire(Resultados, 'Estos son los resultados', 'success');
      } else if (Resultados === '' && Asignados !== '') {
        Swal.fire('L' + Asignados + ' ya tienen asignado un gandaor',
        'No se ha podido asignar ganador a estos enfrentamientos', 'error');
      } else if (Resultados !== '' && Asignados !== '') {
        Swal.fire(Resultados, 'No se ha podido asignar ganador a l' + Asignados + 'porque ya tienen asignado un gandaor. ',
                  'success');
      }

      console.log('La lista de enfrentamientos actualizados queda: ');
      console.log(listaEnfrentamientosActualizados);
      console.log('Este Juego es por Equipos');
      this.AsignarPuntosEquiposGanadorAleatoriamente(listaEnfrentamientosActualizados, this.equiposJuegoDeCompeticionLiga);
    }

  }

  // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen
  RecuperarInscripcionesAlumnoJuego() {
    console.log ('voy a por las inscripciones ' + Number(this.juegodePuntosSeleccionadoID));
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDePuntos(Number(this.juegodePuntosSeleccionadoID))
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorPuntos = inscripciones;
      console.log (this.listaAlumnosOrdenadaPorPuntos);
    });
  }

  // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen
  RecuperarInscripcionesEquiposJuego() {

    console.log ('vamos por las inscripciones ' + Number(this.juegodePuntosSeleccionadoID));
    this.peticionesAPI.DameInscripcionesEquipoJuegoDePuntos(Number(this.juegodePuntosSeleccionadoID))
    .subscribe(inscripciones => {
      this.listaEquiposOrdenadaPorPuntos = inscripciones;
      console.log(this.listaEquiposOrdenadaPorPuntos);
      console.log ('ya tengo las inscripciones');

    });
  }



  goBack() {
    this.location.back();
  }

}

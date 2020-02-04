import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

// Clases
import { Juego, Jornada, TablaJornadas, EnfrentamientoLiga, TablaAlumnoJuegoDeCompeticion,
  TablaEquipoJuegoDeCompeticion} from '../../../../clases/index';

// Services
import { SesionService, CalculosService, PeticionesAPIService } from '../../../../servicios/index';
import {MatTableDataSource} from '@angular/material/table';

import { Location } from '@angular/common';
import swal from 'sweetalert';


@Component({
  selector: 'app-ganador-juego-de-competicion-liga',
  templateUrl: './ganador-juego-de-competicion-liga.component.html',
  styleUrls: ['./ganador-juego-de-competicion-liga.component.scss']
})
export class GanadorJuegoDeCompeticionLigaComponent implements OnInit {

  /* Estructura necesaria para determinar que filas son las que se han seleccionado */
  selection = new SelectionModel<any>(true, []);
  botonAsignarDesactivado = true;

  // Juego De CompeticionLiga seleccionado
  juegoSeleccionado: Juego;
  numeroTotalJornadas: number;
  jornadasDelJuego: Jornada[];
  JornadasCompeticion: TablaJornadas[] = [];
  jornadaId: number;

  // Información de la tabla: Muestra el JugadorUno, JugadorDos, Ganador, JornadaDeCompeticionLigaId y id
  EnfrentamientosJornadaSeleccionada: EnfrentamientoLiga[] = [];

  // Alumnos y Equipos del Juego
  listaAlumnosClasificacion: TablaAlumnoJuegoDeCompeticion[] = [];
  listaEquiposClasificacion: TablaEquipoJuegoDeCompeticion[] = [];

  dataSourceTablaGanadorIndividual;
  dataSourceTablaGanadorEquipo;

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
  }

  /* Esta función decide si los botones deben estar activos (si se ha seleccionado la jornada)
     o si debe estar desactivado (si no se ha seleccionado la jornada) */
  ActualizarBoton() {
    console.log('Estoy en actualizar botón');
    console.log(this.jornadaId);
    // if ((this.selection.selected.length === 0) || this.jornadaId === undefined) {
    if (this.jornadaId === undefined) {
      this.botonAsignarDesactivado = true;
    } else {
      this.botonAsignarDesactivado = false;
      this.ObtenerEnfrentamientosDeCadaJornada(this.jornadaId);
    }
    console.log(this.botonAsignarDesactivado);
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
      console.log('Estoy en ConstruirTablaElegirGanador() equipos');
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
      this.AsignarGanadorAlumnos();

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
      this.dataSourceTablaGanadorEquipo = new MatTableDataSource(this.EnfrentamientosJornadaSeleccionada);
      this.AsignarGanadorEquipos();
    }
  }

  AsignarGanadorAlumnos() {
    console.log('Estoy en AsignarGanadorAlumnos()');
    // tslint:disable-next-line:prefer-for-of
    for ( let i = 0; i < this.dataSourceTablaGanadorIndividual.data.length; i++) {
      console.log('hola');
      if (this.selection.isSelected(this.dataSourceTablaGanadorIndividual.data[i])) {
        console.log(this.dataSourceTablaGanadorIndividual.data[i]);
      }
    }
  }

  AsignarGanadorEquipos() {
    console.log('Estoy en AsignarGanadorEquipos()');
  }


  /* Para averiguar si todas las filas están seleccionadas */
  IsAllSelected() {
    const numSelected = this.selection.selected.length;
    console.log('numSelected = ' + numSelected);
    const numRows = this.dataSourceTablaGanadorIndividual.data.length;
    console.log('numRows=' + numRows);
    return numSelected === numRows;
  }

  /* Cuando se clica en el checkbox de cabecera hay que ver si todos los
    * checkbox estan acivados, en cuyo caso se desactivan todos, o si hay alguno
    * desactivado, en cuyo caso se activan todos */

  MasterToggle() {
    if (this.IsAllSelected()) {
      this.selection.clear(); // Desactivamos todos
    } else {
      // activamos todos
      this.dataSourceTablaGanadorIndividual.data.forEach(row => this.selection.select(row));
    }
  }

  goBack() {
    this.location.back();
  }

}

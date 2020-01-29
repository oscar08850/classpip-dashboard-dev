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


  displayedColumnsAlumno: string[] = ['nombreJugadorUno', 'nombreJugadorDos', 'Empate'];
  // displayedColumnsAlumno: string[] = ['select', 'nombreJugadorUno', 'nombreJugadorDos', 'nombreGanador'];

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
  }

  /* Esta función decide si los botones deben estar activos (si se ha seleccionado la jornada)
     o si debe estar desactivado (si no se ha seleccionado la jornada) */
  ActualizarBoton() {
    console.log(this.jornadaId);
    // if ((this.selection.selected.length === 0) || this.jornadaId === undefined) {
    if (this.jornadaId === undefined) {
      this.botonAsignarDesactivado = true;
    } else {
      this.botonAsignarDesactivado = false;
    }
    console.log(this.botonAsignarDesactivado);
  }


  ObtenerEnfrentamientosDeCadaJornada(jornadaSeleccionada: TablaJornadas) {
    console.log('Estoy en ObtenerEnfrentamientosDeCadaJornada()');
    console.log('El id de la jornada seleccionada es: ' + jornadaSeleccionada.id);
    this.peticionesAPI.DameEnfrentamientosDeCadaJornadaLiga(jornadaSeleccionada.id)
    .subscribe(enfrentamientos => {
      this.EnfrentamientosJornadaSeleccionada = enfrentamientos;
      console.log('Los enfrentamientos de esta jornada son: ');
      console.log(this.EnfrentamientosJornadaSeleccionada);
      console.log('Ya tengo los enfrentamientos de la jornada, ahora tengo que mostrarlos en una tabla');
    });
  }
  goBack() {
    this.location.back();
  }

}

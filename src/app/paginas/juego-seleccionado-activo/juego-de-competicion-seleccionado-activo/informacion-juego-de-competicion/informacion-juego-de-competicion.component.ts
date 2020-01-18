import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

// Clases
import { Juego, Jornada, TablaJornadas, EnfrentamientoLiga } from '../../../../clases/index';

// Servicio
import { SesionService , CalculosService, PeticionesAPIService } from '../../../../servicios/index';
import { forEach } from '@angular/router/src/utils/collection';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-informacion-juego-de-competicion',
  templateUrl: './informacion-juego-de-competicion.component.html',
  styleUrls: ['./informacion-juego-de-competicion.component.scss']
})
export class InformacionJuegoDeCompeticionComponent implements OnInit {

  // Juego De CompeticionLiga seleccionado
  juegoSeleccionado: Juego;
  numeroTotalJornadas: number;
  jornadasDelJuego: Jornada[];
  JornadasCompeticion: TablaJornadas[] = [];

  // Información de la tabla: Muestra el JugadorUno, JugadorDos, Ganador, JornadaDeCompeticionLigaId y id
  EnfrentamientosJornadaSeleccionada: EnfrentamientoLiga[] = [];

  // Columnas Tabla
  displayedColumnsEnfrentamientos: string[] = ['JugadorUno', 'JugadorDos', 'Ganador'];

  dataSourceEnfrentamientoIndividual;
  dataSourceEnfrentamientoEquipo;

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
  }

  ObtenerEnfrentamientosDeCadaJornada(jornadaSeleccionada: TablaJornadas) {
    console.log('El id de la jornada seleccionada es: ' + jornadaSeleccionada.id);
    this.peticionesAPI.DameEnfrentamientosDeCadaJornadaLiga(jornadaSeleccionada.id)
    .subscribe(enfrentamientos => {
      this.EnfrentamientosJornadaSeleccionada = enfrentamientos;
      console.log('Los enfrentamientos de esta jornada son: ');
      console.log(this.EnfrentamientosJornadaSeleccionada);
      console.log('Ya tengo los enfrentamientos de la jornada, ahora tengo que mostrarlos en una tabla');
      this.ConstruirTablaEnfrentamientos();
    });
  }

  ConstruirTablaEnfrentamientos() {
    console.log ('Aquí tendré la tabla de enfrentamientos, los enfrentamientos sonc:');
    console.log(this.EnfrentamientosJornadaSeleccionada);
    console.log('Distinción entre Individual y equipos');
    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log(this.EnfrentamientosJornadaSeleccionada);
      this.dataSourceEnfrentamientoIndividual = new MatTableDataSource(this.EnfrentamientosJornadaSeleccionada);

    } else {
      console.log('Estoy en ConstruirTablaEnfrentamientos() equipos');
      console.log(this.EnfrentamientosJornadaSeleccionada);
      this.dataSourceEnfrentamientoEquipo = new MatTableDataSource(this.EnfrentamientosJornadaSeleccionada);

    }
  }

  goBack() {
    this.location.back();
  }

}

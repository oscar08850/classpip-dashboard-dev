import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

// Clases
import { Juego, Jornada, TablaJornadas, EnfrentamientoLiga, TablaAlumnoJuegoDeCompeticion,
         TablaEquipoJuegoDeCompeticion} from '../../../../clases/index';

// Servicio
import { SesionService , CalculosService, PeticionesAPIService } from '../../../../servicios/index';
import { forEach } from '@angular/router/src/utils/collection';
import { MatTableDataSource } from '@angular/material';
import { identifierModuleUrl } from '@angular/compiler';

@Component({
  selector: 'app-informacion-juego-formula-uno-inactivo',
  templateUrl: './informacion-juego-formula-uno-inactivo.component.html',
  styleUrls: ['./informacion-juego-formula-uno-inactivo.component.scss']
})
export class InformacionJuegoDeCompeticionFormulaUnoInactivoComponent implements OnInit {

  // Juego De CompeticionLiga seleccionado
  juegoSeleccionado: Juego;
  numeroTotalJornadas: number;
  jornadasDelJuego: Jornada[];
  JornadasCompeticion: TablaJornadas[] = [];

  // Información de la tabla: Muestra el JugadorUno, JugadorDos, Ganador, JornadaDeCompeticionLigaId y id
  EnfrentamientosJornadaSeleccionada: EnfrentamientoLiga[] = [];

  listaAlumnosClasificacion: TablaAlumnoJuegoDeCompeticion[] = [];
  listaEquiposClasificacion: TablaEquipoJuegoDeCompeticion[] = [];

  // Columnas Tabla
  displayedColumnsEnfrentamientos: string[] = ['nombreJugadorUno', 'nombreJugadorDos', 'nombreGanador'];

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
    this.listaAlumnosClasificacion = this.sesion.DameTablaAlumnoJuegoDeCompeticion();
    this.listaEquiposClasificacion = this.sesion.DameTablaEquipoJuegoDeCompeticion();
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
      this.dataSourceEnfrentamientoIndividual = new MatTableDataSource(this.EnfrentamientosJornadaSeleccionada);

    } else {
      console.log('Estoy en ConstruirTablaEnfrentamientos() equipos');
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
      this.dataSourceEnfrentamientoEquipo = new MatTableDataSource(this.EnfrentamientosJornadaSeleccionada);
      console.log('La tabla de enfrentamientos por equipos queda: ');
      console.log(this.dataSourceEnfrentamientoEquipo.data);

    }
  }

  goBack() {
    this.location.back();
  }

}

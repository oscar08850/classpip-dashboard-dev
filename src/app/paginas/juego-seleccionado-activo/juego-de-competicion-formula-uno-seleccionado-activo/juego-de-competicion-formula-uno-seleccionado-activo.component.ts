import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';

// Clases
import {Juego, Alumno, Equipo, AlumnoJuegoDeCompeticionFormulaUno,
        EquipoJuegoDeCompeticionFormulaUno, TablaAlumnoJuegoDeCompeticion, TablaEquipoJuegoDeCompeticion} from '../../../clases/index';

// Servicio
import { SesionService, PeticionesAPIService, CalculosService } from '../../../servicios/index';

// Imports para abrir diálogo y swal
import { MatDialog } from '@angular/material';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-juego-de-competicion-formula-uno-seleccionado-activo',
  templateUrl: './juego-de-competicion-formula-uno-seleccionado-activo.component.html',
  styleUrls: ['./juego-de-competicion-formula-uno-seleccionado-activo.component.scss']
})
export class JuegoDeCompeticionFormulaUnoSeleccionadoActivoComponent implements OnInit {
  // Juego De Competicion Formula Uno seleccionado
  juegoSeleccionado: Juego;

  // Recupera la informacion del juego, los alumnos o los equipos
  alumnosDelJuego: Alumno[];
  equiposDelJuego: Equipo[];

  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeCompeticionFormulaUno[];
  listaEquiposOrdenadaPorPuntos: EquipoJuegoDeCompeticionFormulaUno[];

  rankingIndividualFormulaUno: TablaAlumnoJuegoDeCompeticion[] = [];
  rankingEquiposFormulaUno: TablaEquipoJuegoDeCompeticion[] = [];

  datasourceAlumno;
  datasourceEquipo;

  constructor(public dialog: MatDialog,
              public sesion: SesionService,
              public peticionesAPI: PeticionesAPIService,
              public calculos: CalculosService,
              private location: Location) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log(this.juegoSeleccionado);

    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.AlumnosDelJuego();
    } else {
      this.EquiposDelJuego();
    }
  }

  // Recupera los alumnos que pertenecen al juego
  AlumnosDelJuego() {
    console.log ('Vamos a pos los alumnos');
    this.peticionesAPI.DameAlumnosJuegoDeCompeticionFormulaUno(this.juegoSeleccionado.id)
    .subscribe(alumnosJuego => {
      console.log ('Ya tengo los alumnos');
      console.log(alumnosJuego);
      this.alumnosDelJuego = alumnosJuego;
      this.RecuperarInscripcionesAlumnoJuego();
    });
  }

  EquiposDelJuego() {
    console.log ('Vamos a pos los equipos');
    this.peticionesAPI.DameEquiposJuegoDeCompeticionFormulaUno(this.juegoSeleccionado.id)
    .subscribe(equiposJuego => {
      console.log ('ya tengo los equipos');
      this.equiposDelJuego = equiposJuego;
      this.RecuperarInscripcionesEquiposJuego();
    });
  }

  RecuperarInscripcionesAlumnoJuego() {
    console.log ('vamos por las inscripciones ' + this.juegoSeleccionado.id);
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeCompeticionFormulaUno(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorPuntos = inscripciones;
      // ordena la lista por puntos
      // tslint:disable-next-line:only-arrow-functions
      this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2) {
        return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
      });
      console.log ('ya tengo las inscripciones: ');
      this.TablaClasificacionTotal();
    });
  }

  RecuperarInscripcionesEquiposJuego() {
    console.log ('vamos por las inscripciones ' + this.juegoSeleccionado.id);
    this.peticionesAPI.DameInscripcionesEquipoJuegoDeCompeticionFormulaUno(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaEquiposOrdenadaPorPuntos = inscripciones;
      console.log(this.listaEquiposOrdenadaPorPuntos);

      // ordenamos por puntos
      // tslint:disable-next-line:only-arrow-functions
      this.listaEquiposOrdenadaPorPuntos = this.listaEquiposOrdenadaPorPuntos.sort(function(obj1, obj2) {
        return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;
      });
      console.log ('ya tengo las inscripciones');
      this.TablaClasificacionTotal();
    });
  }

  TablaClasificacionTotal() {

    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.rankingIndividualFormulaUno = this.calculos.PrepararTablaRankingIndividualFormulaUno (this.listaAlumnosOrdenadaPorPuntos,
                                                                                                 this.alumnosDelJuego);
      this.datasourceAlumno = new MatTableDataSource(this.rankingIndividualFormulaUno);
      console.log ('Ya tengo la tabla');
      console.log(this.datasourceAlumno.data);

    } else {

      this.rankingEquiposFormulaUno = this.calculos.PrepararTablaRankingEquipoFormulaUno (this.listaEquiposOrdenadaPorPuntos,
                                                                                          this.equiposDelJuego);
      this.datasourceEquipo = new MatTableDataSource(this.rankingEquiposFormulaUno);
      console.log('Ya tengo la tabla');
      console.log(this.datasourceEquipo);

    }
  }

}

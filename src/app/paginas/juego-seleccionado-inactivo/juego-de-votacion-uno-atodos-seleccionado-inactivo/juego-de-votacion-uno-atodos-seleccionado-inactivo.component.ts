import { Component, OnInit } from '@angular/core';
import { SesionService, PeticionesAPIService, CalculosService } from '../../../servicios/index';
import Swal from 'sweetalert2';
import {JuegoDeVotacionUnoATodos, Alumno, AlumnoJuegoDeVotacionUnoATodos, TablaAlumnoJuegoDeVotacionUnoATodos} from '../../../clases/index';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';

@Component({
  selector: 'app-juego-de-votacion-uno-atodos-seleccionado-inactivo',
  templateUrl: './juego-de-votacion-uno-atodos-seleccionado-inactivo.component.html',
  styleUrls: ['./juego-de-votacion-uno-atodos-seleccionado-inactivo.component.scss']
})
export class JuegoDeVotacionUnoATodosSeleccionadoInactivoComponent implements OnInit {
  juegoSeleccionado: JuegoDeVotacionUnoATodos;
  alumnosDelJuego: Alumno[];
  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeVotacionUnoATodos[];
  rankingIndividualJuegoDeVotacionUnoATodos: TablaAlumnoJuegoDeVotacionUnoATodos[] = [];
  datasourceAlumno;

  displayedColumnsAlumnos: string[] = ['posicion', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'puntos'];
  constructor(
    public sesion: SesionService,
    public peticionesAPI: PeticionesAPIService,
    public calculos: CalculosService,
    private location: Location
  ) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log(this.juegoSeleccionado);

    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.AlumnosDelJuego();
    } else {
      console.log ('aun no funciona la modalidad por equipos');
    }
  }

  // Recupera los alumnos que pertenecen al juego
  AlumnosDelJuego() {
      console.log ('Vamos a pos los alumnos');
      this.peticionesAPI.DameAlumnosJuegoDeVotacionUnoATodos(this.juegoSeleccionado.id)
      .subscribe(alumnosJuego => {
        console.log ('Ya tengo los alumnos');
        console.log(alumnosJuego);
        this.alumnosDelJuego = alumnosJuego;
        this.RecuperarInscripcionesAlumnoJuego();
      });
  }

  RecuperarInscripcionesAlumnoJuego() {
    console.log ('vamos por las inscripciones ' + this.juegoSeleccionado.id);
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeVotacionUnoATodos(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorPuntos = inscripciones;
      // ordena la lista por puntos
      // tslint:disable-next-line:only-arrow-functions
      this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2) {
        return obj2.puntosTotales - obj1.puntosTotales;
      });
      this.TablaClasificacionTotal();
    });
  }

  TablaClasificacionTotal() {

    if (this.juegoSeleccionado.Modo === 'Individual') {
      // tslint:disable-next-line:max-line-length
      this.rankingIndividualJuegoDeVotacionUnoATodos = this.calculos.PrepararTablaRankingIndividualVotacionUnoATodos (
        this.listaAlumnosOrdenadaPorPuntos,
        this.alumnosDelJuego,
        this.juegoSeleccionado.Puntos);
      // tslint:disable-next-line:only-arrow-functions
      this.rankingIndividualJuegoDeVotacionUnoATodos = this.rankingIndividualJuegoDeVotacionUnoATodos.sort(function(obj1, obj2) {
        return obj2.puntos - obj1.puntos;
      });
      this.datasourceAlumno = new MatTableDataSource(this.rankingIndividualJuegoDeVotacionUnoATodos);

    } else {
      console.log ('la modalidad en equipo aun no está operativa');

    }
  }

  Eliminar() {
    Swal.fire({
      title: '¿Seguro que quieres eliminar el juego de votación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {
        // Primero elimino las inscripciones
        let cont = 0;
        this.listaAlumnosOrdenadaPorPuntos.forEach (inscripcion => {
          this.peticionesAPI.BorraInscripcionAlumnoJuegoDeVotacionUnoATodos (inscripcion.id)
          .subscribe(() => {
            cont++;
            if (cont === this.listaAlumnosOrdenadaPorPuntos.length) {
              // Ya están todas las inscripciones eliminadas
              // ahora elimino el juego
              this.peticionesAPI.BorraJuegoDeVotacionUnoATodos (this.juegoSeleccionado.id)
              .subscribe(() => {
                Swal.fire('El juego se ha eliminado correctamente');
                this.location.back();
              });
            }
          });
        });
      }
    });
  }

  Reactivar() {
    Swal.fire({
      title: '¿Seguro que quieres activar el juego de votación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {

        this.juegoSeleccionado.JuegoActivo = true;
        this.peticionesAPI.CambiaEstadoJuegoDeVotacionUnaATodos (this.juegoSeleccionado)
        .subscribe(res => {
            if (res !== undefined) {
              Swal.fire('El juego se ha activado correctamente');
              this.location.back();
            }
        });
      }
    });
  }

}

import { Component, OnInit } from '@angular/core';

import { SesionService, PeticionesAPIService, CalculosService } from '../../../servicios/index';
import Swal from 'sweetalert2';
import {JuegoDeVotacionTodosAUno, Alumno, AlumnoJuegoDeVotacionTodosAUno, TablaAlumnoJuegoDeVotacionTodosAUno} from '../../../clases/index';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';

@Component({
  selector: 'app-juego-de-votacion-todos-auno-seleccionado-inactivo',
  templateUrl: './juego-de-votacion-todos-auno-seleccionado-inactivo.component.html',
  styleUrls: ['./juego-de-votacion-todos-auno-seleccionado-inactivo.component.scss']
})
export class JuegoDeVotacionTodosAUnoSeleccionadoInactivoComponent implements OnInit {
  juegoSeleccionado: any;
  alumnosDelJuego: Alumno[];
  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeVotacionTodosAUno[];
  rankingIndividualJuegoDeVotacionTodosAUno: TablaAlumnoJuegoDeVotacionTodosAUno[] = [];
  datasourceAlumno;
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
      this.peticionesAPI.DameAlumnosJuegoDeVotacionTodosAUno(this.juegoSeleccionado.id)
      .subscribe(alumnosJuego => {
        console.log ('Ya tengo los alumnos');
        console.log(alumnosJuego);
        this.alumnosDelJuego = alumnosJuego;
        this.RecuperarInscripcionesAlumnoJuego();
      });
  }

  RecuperarInscripcionesAlumnoJuego() {
    console.log ('vamos por las inscripciones ' + this.juegoSeleccionado.id);
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeVotacionTodosAUno(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorPuntos = inscripciones;
      // ordena la lista por puntos
      // tslint:disable-next-line:only-arrow-functions
      // this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2) {
      //   return obj2.puntosTotales - obj1.puntosTotales;
      // });
      // this.TablaClasificacionTotal();
    });
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
          this.peticionesAPI.BorraInscripcionAlumnoJuegoDeVotacionTodosAUno (inscripcion.id)
          .subscribe(() => {
            cont++;
            if (cont === this.listaAlumnosOrdenadaPorPuntos.length) {
              // Ya están todas las inscripciones eliminadas
              // ahora elimino el juego
              this.peticionesAPI.BorraJuegoDeVotacionTodosAUno (this.juegoSeleccionado.id)
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
        this.peticionesAPI.CambiaEstadoJuegoDeVotacionTodosAUno (this.juegoSeleccionado)
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

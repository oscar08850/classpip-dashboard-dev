import { Component, OnInit } from '@angular/core';
// Servicio
import { SesionService, PeticionesAPIService, CalculosService, ComServerService } from '../../../servicios/index';
import Swal from 'sweetalert2';
// Clases
import {JuegoDeVotacionUnoATodos, Alumno, AlumnoJuegoDeVotacionUnoATodos, TablaAlumnoJuegoDeVotacionUnoATodos} from '../../../clases/index';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
import { Howl } from 'howler';

@Component({
  selector: 'app-juego-de-votacion-uno-atodos-seleccionado-activo',
  templateUrl: './juego-de-votacion-uno-atodos-seleccionado-activo.component.html',
  styleUrls: ['./juego-de-votacion-uno-atodos-seleccionado-activo.component.scss']
})
export class JuegoDeVotacionUnoATodosSeleccionadoActivoComponent implements OnInit {
  juegoSeleccionado: any;
  alumnosDelJuego: Alumno[];
  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeVotacionUnoATodos[];
  rankingIndividualJuegoDeVotacionUnoATodos: TablaAlumnoJuegoDeVotacionUnoATodos[] = [];
  datasourceAlumno;

  displayedColumnsAlumnos: string[] = ['posicion', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'puntos', 'incremento', ' '];
  interval;

  constructor(
              public sesion: SesionService,
              public peticionesAPI: PeticionesAPIService,
              public calculos: CalculosService,
              private comServer: ComServerService,
              private location: Location) { }


  ngOnInit() {
    const sound = new Howl({
      src: ['/assets/got-it-done.mp3']
    });
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log(this.juegoSeleccionado);

    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.AlumnosDelJuego();
    } else {
      console.log ('aun no funciona la modalidad por equipos');
    }
    this.comServer.EsperoVotacion()
    .subscribe((res: any) => {
        sound.play();
        console.log ('llega votacion');
        console.log (res.votacion);
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < res.votacion.Votos.length; i++) {
          const votado = this.rankingIndividualJuegoDeVotacionUnoATodos.filter (al => al.id === res.votacion.Votos[i].alumnoId)[0];
          console.log ('votado');
          console.log (votado);
          votado.puntos = votado.puntos + res.votacion.Votos[i].puntos;
          votado.incremento = res.votacion.Votos[i].puntos;
        }
        // Tomo nota de que el alumno ya ha votado
        this.rankingIndividualJuegoDeVotacionUnoATodos.filter (al => al.id === res.votacion.alumnoId)[0].votado = true;
        console.log ('ranking');
        console.log (this.rankingIndividualJuegoDeVotacionUnoATodos);
        // tslint:disable-next-line:only-arrow-functions
        this.rankingIndividualJuegoDeVotacionUnoATodos = this.rankingIndividualJuegoDeVotacionUnoATodos.sort(function(obj1, obj2) {
          return obj2.puntos - obj1.puntos;
        });
        this.datasourceAlumno = new MatTableDataSource(this.rankingIndividualJuegoDeVotacionUnoATodos);

        // Haremos que se muestren los incrementos de esa votaciñón durante 5 segundos
        this.interval = setInterval(() => {
          this.rankingIndividualJuegoDeVotacionUnoATodos.forEach (al => al.incremento = 0);
          clearInterval(this.interval);
        }, 5000);
    });
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
        this.alumnosDelJuego);
      // tslint:disable-next-line:only-arrow-functions
      this.rankingIndividualJuegoDeVotacionUnoATodos = this.rankingIndividualJuegoDeVotacionUnoATodos.sort(function(obj1, obj2) {
        return obj2.puntos - obj1.puntos;
      });
      console.log (this.rankingIndividualJuegoDeVotacionUnoATodos);
      this.datasourceAlumno = new MatTableDataSource(this.rankingIndividualJuegoDeVotacionUnoATodos);

    } else {
      console.log ('la modalidad en equipo aun no está operativa');

    }
  }

  VotacionFinalizada() {
    // Miro si todos han votado
    let cont = 0;
    this.rankingIndividualJuegoDeVotacionUnoATodos.forEach (al => {if (al.votado) { cont++; } });
    return (cont === this.rankingIndividualJuegoDeVotacionUnoATodos.length);
  }

  DesactivarJuego() {
    Swal.fire({
      title: '¿Seguro que quieres desactivar el juego de votación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {
        // Primero registro las puntuaciones definitivas de cada alumno
        this.listaAlumnosOrdenadaPorPuntos.forEach (alumno => {
          alumno.puntosTotales = this.rankingIndividualJuegoDeVotacionUnoATodos.filter (al => al.id === alumno.alumnoId)[0].puntos;
          this.peticionesAPI.ModificaInscripcionAlumnoJuegoDeVotacionUnoATodos (alumno).subscribe();
        });

        this.juegoSeleccionado.JuegoActivo = false;
        this.peticionesAPI.CambiaEstadoJuegoDeVotacionUnaATodos (this.juegoSeleccionado)
        .subscribe(res => {
            if (res !== undefined) {
              console.log(res);
              console.log('juego desactivado');
              Swal.fire('El juego se ha desactivado correctamente');
              this.location.back();
            }
        });
      }
    });
  }

  applyFilter(filterValue: string) {
    this.datasourceAlumno.filter = filterValue.trim().toLowerCase();
  }

}

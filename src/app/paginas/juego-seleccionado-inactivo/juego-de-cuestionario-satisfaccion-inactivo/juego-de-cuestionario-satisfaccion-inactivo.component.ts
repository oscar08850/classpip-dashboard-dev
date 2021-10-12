import { Component, OnInit } from '@angular/core';
import { SesionService, PeticionesAPIService, CalculosService } from '../../../servicios/index';
import Swal from 'sweetalert2';
import {Alumno, AlumnoJuegoDeCuestionarioSatisfaccion } from 'src/app/clases';
import { Location } from '@angular/common';

@Component({
  selector: 'app-juego-de-cuestionario-satisfaccion-inactivo',
  templateUrl: './juego-de-cuestionario-satisfaccion-inactivo.component.html',
  styleUrls: ['./juego-de-cuestionario-satisfaccion-inactivo.component.scss']
})
export class JuegoDeCuestionarioSatisfaccionInactivoComponent implements OnInit {
  juegoSeleccionado: any;
  alumnosDelJuego: Alumno[];
  inscripcionesAlumnosJuegoDeCuestionarioSatisfaccion: AlumnoJuegoDeCuestionarioSatisfaccion[];


  constructor(
    public sesion: SesionService,
    public peticionesAPI: PeticionesAPIService,
    public calculos: CalculosService,
    private location: Location
  ) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.AlumnosDelJuego();
  }

  // Recupera los alumnos que pertenecen al juego
  AlumnosDelJuego() {
    console.log ('Vamos a pos los alumnos');
    this.peticionesAPI.DameAlumnosJuegoDeCuestionarioSatisfaccion(this.juegoSeleccionado.id)
    .subscribe(alumnosJuego => {
      console.log ('Ya tengo los alumnos');
      console.log(alumnosJuego);
      this.alumnosDelJuego = alumnosJuego;
      this.RecuperarInscripcionesAlumnoJuego();
    });
  }


  RecuperarInscripcionesAlumnoJuego() {
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeCuestionarioSatisfaccion(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.inscripcionesAlumnosJuegoDeCuestionarioSatisfaccion = inscripciones;
      console.log ('tengo las inscripciones ');
      console.log (this.inscripcionesAlumnosJuegoDeCuestionarioSatisfaccion);
    });
  }


  Eliminar2() {
    Swal.fire({
      title: '¿Seguro que quieres eliminar el juego?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {
        // Primero elimino las inscripciones
        let cont = 0;
        this.inscripcionesAlumnosJuegoDeCuestionarioSatisfaccion.forEach (inscripcion => {
          this.peticionesAPI.BorraInscripcionAlumnoJuegoDeCuestionarioSatisfaccion(inscripcion.id)
          .subscribe(() => {
            cont++;
            if (cont === this.inscripcionesAlumnosJuegoDeCuestionarioSatisfaccion.length) {
              // Ya están todas las inscripciones eliminadas
              // ahora elimino el juego
              this.peticionesAPI.BorraJuegoDeCuestionarioSatisfaccion (this.juegoSeleccionado.id)
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

  
  Eliminar() {
    Swal.fire({
      title: '¿Seguro que quieres eliminar el juego?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then(async (result) => {
      if (result.value) {
        // Primero elimino las inscripciones
        await this.calculos.EliminarJuegoDeCuestionarioDeSatisfaccion (this.juegoSeleccionado)
        Swal.fire('El juego se ha eliminado correctamente');
        this.location.back();
      }
    });
  }

  Reactivar() {
    Swal.fire({
      title: '¿Seguro que quieres activar el juego?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {

        this.juegoSeleccionado.JuegoActivo = true;
        this.peticionesAPI.CambiaEstadoJuegoDeCuestionarioSatisfaccion (this.juegoSeleccionado)
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

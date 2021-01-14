import { Component, OnInit } from '@angular/core';
import { SesionService, PeticionesAPIService, CalculosService } from '../../../servicios/index';
import Swal from 'sweetalert2';
import { Juego, Alumno, AlumnoJuegoDeAvatar } from 'src/app/clases';
import { Location } from '@angular/common';

@Component({
  selector: 'app-juego-de-avatar-seleccionado-inactivo',
  templateUrl: './juego-de-avatar-seleccionado-inactivo.component.html',
  styleUrls: ['./juego-de-avatar-seleccionado-inactivo.component.scss']
})
export class JuegoDeAvatarSeleccionadoInactivoComponent implements OnInit {

  juegoSeleccionado: Juego;
  alumnosDelJuego: Alumno[];
  inscripcionesAlumnosJuegodeAvatar: AlumnoJuegoDeAvatar[];

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
    this.peticionesAPI.DameAlumnosJuegoDeAvatar(this.juegoSeleccionado.id)
    .subscribe(alumnosJuego => {
      console.log ('Ya tengo los alumnos');
      console.log(alumnosJuego);
      this.alumnosDelJuego = alumnosJuego;
      this.RecuperarInscripcionesAlumnoJuego();
    });
}


RecuperarInscripcionesAlumnoJuego() {
  this.peticionesAPI.DameInscripcionesAlumnoJuegoDeAvatar(this.juegoSeleccionado.id)
  .subscribe(inscripciones => {
    this.inscripcionesAlumnosJuegodeAvatar = inscripciones;
  });
}


  Eliminar() {
    Swal.fire({
      title: '¿Seguro que quieres eliminar el juego de avatar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {
        // Primero elimino las inscripciones
        let cont = 0;
        this.inscripcionesAlumnosJuegodeAvatar.forEach (inscripcion => {
          // Si hay un fichero de voz lo borro
          if (inscripcion.Voz) {
            this.peticionesAPI.BorraAudioAvatar (inscripcion.Voz).subscribe();
          }
          this.peticionesAPI.BorraInscripcionAlumnoJuegoDeAvatar (inscripcion.id)
          .subscribe(() => {
            cont++;
            if (cont === this.inscripcionesAlumnosJuegodeAvatar.length) {
              // Ya están todas las inscripciones eliminadas
              // ahora elimino el juego
              this.peticionesAPI.BorraJuegoDeAvatar (this.juegoSeleccionado.id)
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
      title: '¿Seguro que quieres activar el juego de avatar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {

        this.juegoSeleccionado.JuegoActivo = true;
        this.peticionesAPI.CambiaEstadoJuegoDeAvatar (this.juegoSeleccionado)
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

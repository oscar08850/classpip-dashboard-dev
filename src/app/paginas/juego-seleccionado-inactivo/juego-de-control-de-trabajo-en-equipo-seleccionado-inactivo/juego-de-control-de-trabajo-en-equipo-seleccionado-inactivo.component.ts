import { Component, OnInit } from '@angular/core';
import { SesionService, PeticionesAPIService, CalculosService } from 'src/app/servicios';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { AlumnoJuegoDeControlDeTrabajoEnEquipo } from 'src/app/clases';

@Component({
  selector: 'app-juego-de-control-de-trabajo-en-equipo-seleccionado-inactivo',
  templateUrl: './juego-de-control-de-trabajo-en-equipo-seleccionado-inactivo.component.html',
  styleUrls: ['./juego-de-control-de-trabajo-en-equipo-seleccionado-inactivo.component.scss']
})
export class JuegoDeControlDeTrabajoEnEquipoSeleccionadoInactivoComponent implements OnInit {

  juegoSeleccionado: any;
  inscripciones: AlumnoJuegoDeControlDeTrabajoEnEquipo[];
  constructor(
    public sesion: SesionService,
    public peticionesAPI: PeticionesAPIService,
    public calculos: CalculosService,
    private location: Location
  ) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.peticionesAPI.DameInscripcionesAlumnosJuegoDeControlDeTrabajoEnEquipo (this.juegoSeleccionado.id)
    .subscribe (res => {
      this.inscripciones = res;
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
    }).then((result) => {
      if (result.value) {
        // Primero elimino las inscripciones
        let cont = 0;
        this.inscripciones.forEach (inscripcion => {
          this.peticionesAPI.BorrarInscripcionAlumnoJuegoDeControlDeTrabajoEnEquipo(inscripcion.id)
          .subscribe(() => {
            cont++;
            if (cont === this.inscripciones.length) {
              // Ya están todas las inscripciones eliminadas
              // ahora elimino el juego
              this.peticionesAPI.BorrarJuegoDeControlDeTrabajoEnEquipo (this.juegoSeleccionado.id)
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
      title: '¿Seguro que quieres activar el juego?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {

        this.juegoSeleccionado.JuegoActivo = true;
        this.peticionesAPI.CambiaEstadoJuegoDeControlDeTrabajoEnEquipo (this.juegoSeleccionado)
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

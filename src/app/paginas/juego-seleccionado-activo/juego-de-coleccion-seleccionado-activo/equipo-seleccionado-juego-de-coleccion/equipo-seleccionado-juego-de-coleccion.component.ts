import { Component, OnInit } from '@angular/core';
import { ResponseContentType, Http, Response } from '@angular/http';

import { Alumno, Equipo, Juego, EquipoJuegoDeColeccion, Cromo } from '../../../../clases/index';

// Services
import { JuegoService, JuegoDeColeccionService, AlumnoService, EquipoService, ColeccionService } from '../../../../servicios/index';

// Imports para abrir diálogo
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogoConfirmacionComponent } from '../../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';

@Component({
  selector: 'app-equipo-seleccionado-juego-de-coleccion',
  templateUrl: './equipo-seleccionado-juego-de-coleccion.component.html',
  styleUrls: ['./equipo-seleccionado-juego-de-coleccion.component.scss']
})
export class EquipoSeleccionadoJuegoDeColeccionComponent implements OnInit {

  juegoSeleccionado: Juego;
  equipo: Equipo;

  equipoJuegoDeColeccion: EquipoJuegoDeColeccion;

  // imagen
  imagenPerfil: string;

  alumnosEquipo: Alumno[];

  inscripcionEquipo: EquipoJuegoDeColeccion;

  ListaCromos: Cromo[];
  cromo: Cromo;

  imagenCromoArray: string[] = [];

  constructor( private juegoService: JuegoService,
               private equipoService: EquipoService,
               private http: Http,
               private juegoDeColeccionService: JuegoDeColeccionService,
               private coleccionService: ColeccionService) { }

  ngOnInit() {
    this.equipo = this.equipoService.RecibirEquipoDelServicio();
    this.juegoSeleccionado = this.juegoService.RecibirJuegoDelServicio();
    this.inscripcionEquipo = this.juegoService.RecibirInscripcionEquipoDelServicio();
    this.CromosDelEquipo();
    this.GET_ImagenPerfil();
  }

  GET_ImagenPerfil() {

    if (this.equipo.FotoEquipo !== undefined ) {
      this.http.get('http://localhost:3000/api/imagenes/LogosEquipos/download/' + this.equipo.FotoEquipo,
      { responseType: ResponseContentType.Blob })
      .subscribe(response => {

        const blob = new Blob([response.blob()], { type: 'image/jpg'});

        const reader = new FileReader();
        reader.addEventListener('load', () => {
          this.imagenPerfil = reader.result.toString();
        }, false);

        if (blob) {
          reader.readAsDataURL(blob);
        }
      });
    }

  }

  CromosDelEquipo() {
    this.juegoDeColeccionService.GET_CromosEquipo(this.inscripcionEquipo.id)
    .subscribe(cromos => {
      this.ListaCromos = cromos;
      this.coleccionService.EnviarCromosAlumnoAlServicio(this.ListaCromos);
      this.OrdenarCromos();
      this.GET_ImagenCromo();
      console.log(this.ListaCromos);

    });
  }

  // Ordena los cromos por nombre. Asi es más fácil identificar los cromos que tengo
  OrdenarCromos() {
    this.ListaCromos.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
  }

  GET_ImagenCromo() {

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.ListaCromos.length; i++) {

      this.cromo = this.ListaCromos[i];

      if (this.cromo.Imagen !== undefined ) {

        // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
        this.http.get('http://localhost:3000/api/imagenes/ImagenCromo/download/' + this.cromo.Imagen,
        { responseType: ResponseContentType.Blob })
        .subscribe(response => {
          const blob = new Blob([response.blob()], { type: 'image/jpg'});

          const reader = new FileReader();
          reader.addEventListener('load', () => {
            this.imagenCromoArray[i] = reader.result.toString();
          }, false);

          if (blob) {
            reader.readAsDataURL(blob);
          }

        });
      }
    }
  }
}

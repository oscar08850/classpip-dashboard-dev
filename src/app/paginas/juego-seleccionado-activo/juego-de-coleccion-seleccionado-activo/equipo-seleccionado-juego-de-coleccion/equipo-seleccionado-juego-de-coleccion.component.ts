import { Component, OnInit } from '@angular/core';
import { ResponseContentType, Http, Response } from '@angular/http';

import { Alumno, Equipo, Juego, EquipoJuegoDeColeccion, Cromo } from '../../../../clases/index';


// Services
import { SesionService, PeticionesAPIService, CalculosService } from '../../../../servicios/index';

import { Location } from '@angular/common';

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

  listaCromos: Cromo[];
  listaCromosSinRepetidos: any [];
  cromo: Cromo;

  imagenCromoArray: string[] = [];

  constructor( private sesion: SesionService,
               private peticionesAPI: PeticionesAPIService,
               private calculos: CalculosService,
               private http: Http,
               public location: Location
               ) { }

  ngOnInit() {
    this.equipo = this.sesion.DameEquipo();
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.inscripcionEquipo = this.sesion.DameInscripcionEquipo();
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
    this.peticionesAPI.DameCromosEquipo(this.inscripcionEquipo.id)
    .subscribe(cromos => {
      this.listaCromos = cromos;
      this.listaCromosSinRepetidos = this.calculos.GeneraListaSinRepetidos(this.listaCromos);
      this.sesion.TomaCromos(this.listaCromos);
      this.listaCromos.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
      this.GET_ImagenesCromos();

    });
  }



  GET_ImagenesCromos() {

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.listaCromosSinRepetidos.length; i++) {

      this.cromo = this.listaCromosSinRepetidos[i].cromo;

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
  goBack() {
    this.location.back();
  }

}

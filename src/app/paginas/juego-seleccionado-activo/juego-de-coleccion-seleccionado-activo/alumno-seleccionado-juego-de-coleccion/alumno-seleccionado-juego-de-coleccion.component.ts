import { Component, OnInit } from '@angular/core';
import { ResponseContentType, Http, Response } from '@angular/http';
import {Sort} from '@angular/material/sort';

import { Alumno, Equipo, Juego, AlumnoJuegoDeColeccion, EquipoJuegoDeColeccion,
  Album, AlbumEquipo, Coleccion, Cromo } from '../../../../clases/index';

import { SesionService, PeticionesAPIService, CalculosService } from '../../../../servicios/index';
import { Location } from '@angular/common';

@Component({
  selector: 'app-alumno-seleccionado-juego-de-coleccion',
  templateUrl: './alumno-seleccionado-juego-de-coleccion.component.html',
  styleUrls: ['./alumno-seleccionado-juego-de-coleccion.component.scss']
})
export class AlumnoSeleccionadoJuegoDeColeccionComponent implements OnInit {

  inscripcionAlumno: AlumnoJuegoDeColeccion;

  alumno: Alumno;

  juegoSeleccionado: Juego;

  listaCromos: Cromo[];
  listaCromosSinRepetidos: any[];
  cromo: Cromo;

  imagenCromoArray: string[] = [];

  // imagen
  imagenPerfil: string;

  constructor(
               private sesion: SesionService,
               private peticionesAPI: PeticionesAPIService,
               private calculos: CalculosService,
               private location: Location,
               private http: Http
  ) {}

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();

    this.inscripcionAlumno = this.sesion.DameInscripcionAlumno();
    this.alumno = this.sesion.DameAlumno();
    this.CromosDelAlumno();
    this.GET_ImagenPerfil();


  }

  // Busca el logo que tiene el nombre del alumno.ImagenPerfil y lo carga en imagenPerfil
  GET_ImagenPerfil() {

    if (this.alumno.ImagenPerfil !== undefined ) {
      this.http.get('http://localhost:3000/api/imagenes/imagenAlumno/download/' + this.alumno.ImagenPerfil,
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


  CromosDelAlumno() {
    this.peticionesAPI.DameCromosAlumno(this.inscripcionAlumno.id)
    .subscribe(cromos => {
      this.listaCromos = cromos;

      // esta es la lista que se mostrará al usuario, sin cromos repetidos y con una
      // indicación de cuantas veces se repite cada cromo
      this.listaCromosSinRepetidos = this.calculos.GeneraListaSinRepetidos(this.listaCromos);
      this.sesion.TomaCromos(this.listaCromos);
      this.listaCromos.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
      this.GET_ImagenesCromos();
    });
  }


  GET_ImagenesCromos() {

    // Me traigo la lista de imagenes de los cromos sin repetición
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

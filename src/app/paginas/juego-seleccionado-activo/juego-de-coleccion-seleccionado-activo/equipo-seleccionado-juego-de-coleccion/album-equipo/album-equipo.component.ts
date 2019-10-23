import { Component, OnInit } from '@angular/core';
import { ResponseContentType, Http, Response } from '@angular/http';

// Clases
import { Cromo, Coleccion, AlbumDelAlumno } from '../../../../../clases/index';

// Servicios
import { SesionService, PeticionesAPIService } from '../../../../../servicios/index';

import { Location } from '@angular/common';

@Component({
  selector: 'app-album-equipo',
  templateUrl: './album-equipo.component.html',
  styleUrls: ['./album-equipo.component.scss']
})
export class AlbumEquipoComponent implements OnInit {

  coleccion: Coleccion;
  cromosColeccion: Cromo[];

  imagenCromoArray: string[] = [];

  cromo: Cromo;

  cromosEquipo: Cromo[];

  AlbumDelEquipo: AlbumDelAlumno[] = [];
  equipo: any;

  constructor(  private sesion: SesionService,
                private peticionesAPI: PeticionesAPIService,
                public location: Location,
                private http: Http) { }

  ngOnInit() {

    this.equipo = this.sesion.DameEquipo();
    this.coleccion = this.sesion.DameColeccion();
    this.cromosEquipo = this.sesion.DameCromos();
    this.CromosDeLaColeccion(this.coleccion);
  }

  // Le pasamos la coleccion y buscamos la imagen que tiene y sus cromos
  CromosDeLaColeccion(coleccion: Coleccion) {

    // Una vez tenemos el logo del equipo seleccionado, buscamos sus alumnos
    console.log('voy a mostrar los cromos de la coleccion ' + coleccion.id);

    // Busca los cromos dela coleccion en la base de datos
    this.peticionesAPI.DameCromosColeccion(coleccion.id)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.cromosColeccion = res;
        this.cromosColeccion.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
        this.GET_ImagenesCromos();
        this.PreparaAlbum();
        console.log(res);
      } else {
        console.log('No hay cromos en esta coleccion');
        this.cromosColeccion = undefined;
      }
    });
  }

  // Busca la imagen que tiene el nombre del cromo.Imagen y lo carga en imagenCromo
  GET_ImagenesCromos() {

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.cromosColeccion.length; i++) {

      let cromo: Cromo;
      cromo = this.cromosColeccion[i];

      if (cromo.Imagen !== undefined ) {
        // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
        this.http.get('http://localhost:3000/api/imagenes/ImagenCromo/download/' + cromo.Imagen,
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

  PreparaAlbum() {

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.cromosColeccion.length; i++) {

      this.cromo = this.cromosEquipo.filter(res => res.id === this.cromosColeccion[i].id)[0];


      if (this.cromo !== undefined) {
        console.log('Tengo ' + this.cromo.Nombre);
        this.AlbumDelEquipo[i] = new AlbumDelAlumno(this.cromosColeccion[i].Nombre, this.cromosColeccion[i].Imagen,
          this.cromosColeccion[i].Probabilidad, this.cromosColeccion[i].Nivel, true);

      } else {
        console.log('No tengo ' + this.cromosColeccion[i].Nombre);
        this.AlbumDelEquipo[i] = new AlbumDelAlumno(this.cromosColeccion[i].Nombre, this.cromosColeccion[i].Imagen,
          this.cromosColeccion[i].Probabilidad, this.cromosColeccion[i].Nivel, false);
      }
    }
  }
  goBack() {
    this.location.back();
  }



}

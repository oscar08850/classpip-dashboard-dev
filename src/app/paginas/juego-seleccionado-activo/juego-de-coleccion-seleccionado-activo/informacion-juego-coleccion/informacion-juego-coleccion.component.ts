import { Component, OnInit } from '@angular/core';
import { ResponseContentType, Http, Response } from '@angular/http';

// Clases
import { Cromo, Coleccion } from '../../../../clases/index';

// Servicios
import { ColeccionService } from '../../../../servicios/index';

@Component({
  selector: 'app-informacion-juego-coleccion',
  templateUrl: './informacion-juego-coleccion.component.html',
  styleUrls: ['./informacion-juego-coleccion.component.scss']
})
export class InformacionJuegoColeccionComponent implements OnInit {

  coleccion: Coleccion;
  cromosColeccion: Cromo[];

  cromo: Cromo;
  imagenCromoArray: string[] = [];

  nombreColeccion: string;
  // imagen coleccion
  imagenColeccion: string;
  nombreImagenColeccion: string;
  file: File;

  // tslint:disable-next-line:ban-types
  imagenCambiada: Boolean = false;

  // PARA DIÁLOGO DE CONFIRMACIÓN
  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres eliminar el equipo llamado: ';

  constructor( private coleccionService: ColeccionService,
               private http: Http) { }

  ngOnInit() {
    this.coleccion = this.coleccionService.RecibirColeccionDelServicio();

    this.nombreColeccion = this.coleccion.Nombre;

    this.CromosEImagenDeLaColeccion(this.coleccion);
    // Cargo el imagen de la coleccion
    this.GET_Imagen();
  }

  // Busca la imagen que tiene el nombre del coleccion.ImagenColeccion y lo carga en imagenColeccion
  GET_Imagen() {

    if (this.coleccion.ImagenColeccion !== undefined ) {
      // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
      this.http.get('http://localhost:3000/api/imagenes/ImagenColeccion/download/' + this.coleccion.ImagenColeccion,
      { responseType: ResponseContentType.Blob })
      .subscribe(response => {
        const blob = new Blob([response.blob()], { type: 'image/jpg'});

        const reader = new FileReader();
        reader.addEventListener('load', () => {
          this.imagenColeccion = reader.result.toString();
        }, false);

        if (blob) {
          reader.readAsDataURL(blob);
        }
    });

    }
  }

  // Le pasamos la coleccion y buscamos la imagen que tiene y sus cromos
 CromosEImagenDeLaColeccion(coleccion: Coleccion) {

  console.log('entro a buscar cromos y foto');
  console.log(coleccion.ImagenColeccion);
  // Si la coleccion tiene una foto (recordemos que la foto no es obligatoria)
  if (coleccion.ImagenColeccion !== undefined) {

    // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
    this.http.get('http://localhost:3000/api/imagenes/ImagenColeccion/download/' + coleccion.ImagenColeccion,
    { responseType: ResponseContentType.Blob })
    .subscribe(response => {
      const blob = new Blob([response.blob()], { type: 'image/jpg'});

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.imagenColeccion = reader.result.toString();
      }, false);

      if (blob) {
        reader.readAsDataURL(blob);
      }
    });

    // Sino la imagenColeccion será undefined para que no nos pinte la foto de otro equipo préviamente seleccionado
  } else {
    this.imagenColeccion = undefined;
  }


  // Una vez tenemos el logo del equipo seleccionado, buscamos sus alumnos
  console.log('voy a mostrar los cromos de la coleccion ' + coleccion.id);

  // Busca los cromos dela coleccion en la base de datos
  this.coleccionService.GET_CromosColeccion(coleccion.id)
  .subscribe(res => {
    if (res[0] !== undefined) {
      this.cromosColeccion = res;
      this.GET_ImagenCromo();
      console.log(res);
    } else {
      console.log('No hay cromos en esta coleccion');
      this.cromosColeccion = undefined;
    }
  });
}

 // Busca la imagen que tiene el nombre del cromo.Imagen y lo carga en imagenCromo
 GET_ImagenCromo() {

  // tslint:disable-next-line:prefer-for-of
for (let i = 0; i < this.cromosColeccion.length; i++) {

  this.cromo = this.cromosColeccion[i];

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

prueba() {
  console.log(this.coleccion);
}
}

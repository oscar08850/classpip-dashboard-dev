import { Component, OnInit } from '@angular/core';
import {SesionService, PeticionesAPIService, CalculosService} from '../../../../servicios/index';
import { AlumnoJuegoDeAvatar, Alumno } from 'src/app/clases';
import { Location } from '@angular/common';


@Component({
  selector: 'app-mostrar-avatar-alumno',
  templateUrl: './mostrar-avatar-alumno.component.html',
  styleUrls: ['./mostrar-avatar-alumno.component.scss']
})
export class MostrarAvatarAlumnoComponent implements OnInit {

  alumno: Alumno;
  inscripcionAlumnoJuegoAvatar: AlumnoJuegoDeAvatar;
  imagenSilueta: string;
  complemento1: string;
  complemento2: string;
  complemento3: string;
  complemento4: string;
  anchogrande: '450px';
  altogrande: '486px';

  constructor(
    private location: Location,
    private calculos: CalculosService,
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService ) { }

  ngOnInit() {
    this.alumno = this.sesion.DameAlumno();
    this.inscripcionAlumnoJuegoAvatar = this.sesion.DameAlumnoJuegoAvatar();
    this.TraerImagenesAvatar ();
  }
  TraerImagenesAvatar() {
    // voy a traer la imagen de la silueta
    this.peticionesAPI.DameImagenAvatar (this.inscripcionAlumnoJuegoAvatar.Silueta)
    .subscribe(res => {
      const blobSilueta = new Blob([res.blob()], { type: 'image/jpg'});
      const readerSilueta = new FileReader();
      readerSilueta.addEventListener('load', () => {
          // lo que se hace a continuación es para obtener el ancho y alto de la imagen
        // de la silueta

        this.imagenSilueta = readerSilueta.result.toString();

          // Y ahora vamos apor los complementos
        this.peticionesAPI.DameImagenAvatar (this.inscripcionAlumnoJuegoAvatar.Complemento1)
          .subscribe(response => {
            const blob = new Blob([response.blob()], { type: 'image/jpg'});
            const reader = new FileReader();
            reader.addEventListener('load', () => {
              // Creo la imagen que incorporaré al avatar
              const imagen = this.CreaImagen (reader.result.toString());
              document.getElementById('imagenAvatar').appendChild(imagen);
            }, false);
            if (blob) {
              reader.readAsDataURL(blob);
            }
          });
        this.peticionesAPI.DameImagenAvatar (this.inscripcionAlumnoJuegoAvatar.Complemento2)
          .subscribe(response => {
            const blob = new Blob([response.blob()], { type: 'image/jpg'});
            const reader = new FileReader();
            reader.addEventListener('load', () => {
              const imagen = this.CreaImagen (reader.result.toString());
              document.getElementById('imagenAvatar').appendChild(imagen);
            }, false);
            if (blob) {
              reader.readAsDataURL(blob);
            }
          });
        this.peticionesAPI.DameImagenAvatar (this.inscripcionAlumnoJuegoAvatar.Complemento3)
          .subscribe(response => {
            const blob = new Blob([response.blob()], { type: 'image/jpg'});
            const reader = new FileReader();
            reader.addEventListener('load', () => {
              const imagen = this.CreaImagen (reader.result.toString());
              document.getElementById('imagenAvatar').appendChild(imagen);
            }, false);
            if (blob) {
              reader.readAsDataURL(blob);
            }
          });
        this.peticionesAPI.DameImagenAvatar (this.inscripcionAlumnoJuegoAvatar.Complemento4)
          .subscribe(response => {
            const blob = new Blob([response.blob()], { type: 'image/jpg'});
            const reader = new FileReader();
            reader.addEventListener('load', () => {
              const imagen = this.CreaImagen (reader.result.toString());
              document.getElementById('imagenAvatar').appendChild(imagen);
            }, false);
            if (blob) {
              reader.readAsDataURL(blob);
            }
          });
      }, false);

      if (blobSilueta) {
        readerSilueta.readAsDataURL(blobSilueta);
      }
    });
  }
  CreaImagen(imagenString: string): any {
    const imagen = document.createElement('img');
    imagen.style.left = '0px';
    imagen.style.top = '0px';
    imagen.style.position = 'absolute';
    imagen.style.zIndex = '1';
    imagen.style.width = '450px';
    imagen.style.height = '486px';
    // // muestro la imagen grande
    // imagen.setAttribute ('width', this.anchogrande);
    // imagen.setAttribute ('height', this.altogrande );
    // Coloco el nombre del fichero en el que está la imagen
    imagen.src =  imagenString;
    return imagen;
  }

  // // Esta función se ejecuta en cuanto se pone la imagen de la silueta en su sitio
  // Ajusta(img) {
  //   img.setAttribute ('width', this.anchogrande);
  //   img.setAttribute ('height', this.altogrande );
  // }

  goBack() {
    this.location.back();
  }

}

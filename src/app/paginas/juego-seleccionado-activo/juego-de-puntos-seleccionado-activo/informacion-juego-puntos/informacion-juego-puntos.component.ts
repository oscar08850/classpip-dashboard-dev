import { Component, OnInit } from '@angular/core';
import { ResponseContentType, Http, Response } from '@angular/http';

import { Alumno, Equipo, Juego, Punto, Nivel, AlumnoJuegoDePuntos, EquipoJuegoDePuntos,
  TablaAlumnoJuegoDePuntos, HistorialPuntosAlumno } from '../../../../clases/index';

// Services
import { JuegoService, JuegoDePuntosService } from '../../../../servicios/index';

@Component({
  selector: 'app-informacion-juego-puntos',
  templateUrl: './informacion-juego-puntos.component.html',
  styleUrls: ['./informacion-juego-puntos.component.scss']
})
export class InformacionJuegoPuntosComponent implements OnInit {

  nivelesDelJuego: Nivel;
  puntosDelJuego: Punto;
  imagenNivel: string;

  displayedColumns: string[] = ['nombre', 'descripcion'];

  constructor( private juegoService: JuegoService,
               private juegoDePuntosService: JuegoDePuntosService,
               private http: Http ) { }

  ngOnInit() {

    this.nivelesDelJuego = this.juegoDePuntosService.RecibirNivelesDelServicio();
    this.puntosDelJuego = this.juegoDePuntosService.RecibirPuntosDelServicio();
    console.log(this.nivelesDelJuego);
    console.log(this.puntosDelJuego);

  }

  // Le pasamos el nivel y buscamos el logo que tiene
  ObtenerNivel(nivel: Nivel) {

    console.log('entro a buscar nivel y foto');
    console.log(nivel);
    // Si el equipo tiene una foto (recordemos que la foto no es obligatoria)
    if (nivel.Imagen !== undefined) {

      // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
      this.http.get('http://localhost:3000/api/imagenes/imagenNivel/download/' + nivel.Imagen,
      { responseType: ResponseContentType.Blob })
      .subscribe(response => {
        const blob = new Blob([response.blob()], { type: 'image/jpg'});

        const reader = new FileReader();
        reader.addEventListener('load', () => {
          this.imagenNivel = reader.result.toString();
        }, false);

        if (blob) {
          reader.readAsDataURL(blob);
        }
      });

      // Sino la imagenLogo será undefined para que no nos pinte la foto de otro equipo préviamente seleccionado
    } else {
      this.imagenNivel = undefined;
    }
  }

}

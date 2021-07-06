import { Component, OnInit ,Output, EventEmitter} from '@angular/core';
import { PeticionesAPIService } from '../../../servicios/peticiones-api.service';
import { SesionService } from '../../../servicios/sesion.service';
import { ImagenToBackend } from '../../../clases/clasesParaLibros/imagenGuardada';


@Component({
  selector: 'app-asigna-especial-juego-libros',
  templateUrl: './asigna-especial-juego-libros.component.html',
  styleUrls: ['./asigna-especial-juego-libros.component.scss']
})
export class AsignaEspecialJuegoLibrosComponent implements OnInit {
  @Output() emisorRecursoCargado = new EventEmitter <any>();



  listaRecursos: any[] = [];
  recursoId: Number;
  recursoCargadoPregunta: any = false;
  recursoCargado: any;

  listaFotosPersonajes: any[] = [];
  listaFotosFondos: any[] = [];
  listaFotosObjetos: any[] = [];

  recurosId: any;





  constructor(public API: PeticionesAPIService, public sesion: SesionService) { }


  ngOnInit() {

    this.recurosId = localStorage.getItem('idRecursoLibros');
    localStorage.removeItem('idRecursoLibros');


    this.traeRecurso();

  }

  traeRecurso() {

    this.API.recuperarRecursosLibro(this.sesion.DameProfesor().id, this.recurosId)
      .subscribe((res) => {
        this.recursoCargado = res;
        this.traeImagenesRecursoLibro();
      }, (err) => {

      })

  }

  setAll(imagen: ImagenToBackend) {
    var imagenBack = this.recursoCargado.imagenes[imagen.positionlista];
    imagenBack.especial = !imagenBack.especial;
    this.recursoCargado.imagenes[imagen.positionlista] = imagenBack;
  }


  putRecuros() {


    this.emisorRecursoCargado.emit(this.recursoCargado);


  }

  traeImagenesRecursoLibro() {


    this.listaFotosPersonajes = [];
    this.listaFotosFondos = [];
    this.listaFotosObjetos = [];

    this.recursoCargadoPregunta = true;

    var i = 0;
    this.recursoCargado.imagenes.forEach(element => {

      this.API.getImagenesRecurso(this.recursoCargado.carpeta, element.nombre)
        .subscribe((res) => {

          const blob = new Blob([res.blob()], { type: 'image/png' });
          const reader = new FileReader();

          reader.addEventListener('load', () => {

            var foto = null;
            foto = reader.result.toString();
            var fotoProps = new ImagenToBackend();
            fotoProps.url = foto;
            fotoProps.tipo = element.tipo;
            fotoProps.nombre = element.nombre;
            fotoProps.especial = element.especial;
            fotoProps.positionlista = i;

            if (element.tipo == "fondo") {
              this.listaFotosFondos.push(fotoProps);
              i++;
            }
            else if (element.tipo == "personaje") {
              this.listaFotosPersonajes.push(fotoProps);
              i++;

            }
            else if (element.tipo == "objeto") {
              this.listaFotosObjetos.push(fotoProps); i++;

            }

          }, false);

          if (blob) {
            reader.readAsDataURL(blob);
          }


        }, (err) => {

          console.log(err);
        })

    });

  }

}
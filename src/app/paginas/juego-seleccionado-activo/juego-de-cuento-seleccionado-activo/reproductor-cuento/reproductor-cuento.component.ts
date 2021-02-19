import { Component, OnInit } from '@angular/core';
import { SesionClase, TablaHistorialPuntosAlumno } from 'src/app/clases';
import { PeticionesAPIService, SesionService } from 'src/app/servicios';
import { Router } from '@angular/router';


@Component({
  selector: 'app-reproductor-cuento',
  templateUrl: './reproductor-cuento.component.html',
  styleUrls: ['./reproductor-cuento.component.scss']
})
export class ReproductorCuentoComponent implements OnInit {

  constructor(private sesion: SesionService, private peticionesAPI: PeticionesAPIService, private router: Router) { }

  idLibro: any;
  listaEscenas: any = [];
  tiempo: any;
  libro: any;
  listaFondos: any = [];
  fotoimagen: any;
  listaFotos: any = [];

  fotoPosicion: any = 0;
  fotoToShow: any = '../../../../../assets/reproductor/negro.png';
  intervalId;

  listaAudios: any = [];
  tipoAudio: any = "frame";
  audioFrame: any;

  listaFondosAudio: any = [];
  listaTextos: any[] = [];

  textoFrame: any = "";
  numeroDeFrame = 0;
  listacompleja = [];

  showButtonAudioFrame: any = false;
  showButtonFondoFrame: any = false;


  get_duration_interval: any;
  tiempoDeReproduccion: any = 1000;

  url = 'http://localhost:3000/api/imagenes/';
  ngOnInit() {

    this.idLibro = this.sesion.getIdLibro();

    this.damelibro();
    this.numeroDeFrame = 0;

  }

  damelibro() {


    this.peticionesAPI.dameunlibro(this.idLibro)
      .subscribe(res => {
        console.log(res);
        this.libro = res;
        this.dameEscenas()

      });


  }

  dameEscenas() {

    this.peticionesAPI.dameEscenasLibro(this.idLibro)
      .subscribe(res => {
        console.log(res);

        if (res.tipoAudio == "frame") {
          this.showButtonAudioFrame = true;
        }
        else if (res.tipoAudio != "frame") {
          if (res.urlAudioFondo != "no") {
            var audio = this.url + this.libro.titulo + "/download/" + res.urlAudioFondo;

            this.listaFondosAudio.push(audio);
            this.showButtonFondoFrame = true;
          }
          else (res.urlAudioFondo == "no")
          {
            this.listaFondosAudio.push("");
          }
        }

        res.forEach(element => {
          this.listaEscenas.push(element);
          this.tiempo = element.duracionFrame;
        });
        this.dameFrames3();
      });


  }


  dameFrames3() {

    this.listaEscenas.forEach(element => {
      var id = element.id;

      this.peticionesAPI.getFramesByEscenaId(id)
        .subscribe(res => {
          var lista = [];
          console.log(res);

          res.forEach(element => {
            element.contador = this.numeroDeFrame;
            lista.push(element);
            this.numeroDeFrame++;

          });
          this.obtenerFrames2(lista);
        });


    });

  }

  obtenerFrames2(lista) {

    /////////////////cambiar var contenedor///////////////////////////
    var contenedor = this.libro.titulo;
    lista.forEach(element => {

      var objetolista = {
        frame: '',
        escena: String,
        audio: '',
        numero: Number,
        duracion: Number,
        texto: ''

      }

      this.peticionesAPI.getImagen(element.portadaFrame, contenedor)
        .subscribe((res) => {
          const blob = new Blob([res.blob()], { type: 'image/png' });

          const reader = new FileReader();
          reader.onloadend = (event) => {
            if (reader.error) {
              console.log(reader.error)
            } else {

              this.fotoimagen = reader.result.toString();
              this.listaFotos.push(this.fotoimagen);
              objetolista.frame = this.fotoimagen;
              objetolista.audio = element.audioUrl;
              objetolista.escena = element.escenaid;
              objetolista.numero = element.contador;
              objetolista.duracion = element.duracionAudio;
              objetolista.texto = element.textos;

              if (objetolista.audio != '') {
                var audio = this.url + this.libro.titulo + "/download/" + objetolista.audio;
                // this.audioFrame = audio;
                objetolista.audio = audio;
                // var audio =  this.url + this.libro.titulo + "/download/" + objetolista.audio;
                // objetolista.audio = audio;
              }

              this.listacompleja.push(objetolista);
              this.listacompleja.sort((a, b) => a.numero - b.numero);

            }
          };

          if (blob) {
            reader.readAsDataURL(blob);
          }
        });
    });

  }


  dameFrames() {

    this.listaEscenas.forEach(element => {
      var id = element.id;



      this.peticionesAPI.getFramesByEscenaId(id)
        .subscribe(res => {
          var lista = [];
          console.log(res);

          var audio = '';


          res.forEach(element => {
            lista.push(element);
            audio = '';
            if (this.showButtonAudioFrame == true) {
              audio = this.url + this.libro.titulo + "/download/" + element.audioUrl;
              this.listaAudios.push(audio);
            }
          });
          this.obtenerFrames(lista, audio);
        });


    });

  }
  obtenerFrames(lista, au) {

    /////////////////cambiar var contenedor///////////////////////////
    var contenedor = this.libro.titulo;
    lista.forEach(element => {

      this.listaFondos.push(element.portadaFrame);


      this.peticionesAPI.getImagen(element.portadaFrame, contenedor)
        .subscribe((res) => {
          const blob = new Blob([res.blob()], { type: 'image/png' });

          const reader = new FileReader();
          reader.addEventListener('load', () => {

            this.fotoimagen = reader.result.toString();
            this.listaFotos.push(this.fotoimagen);
            this.listaTextos.push(element.textos);

          }, false);

          if (blob) {
            reader.readAsDataURL(blob);
          }
        });
    });

  }




  play() {
    this.get_duration_interval = setInterval(() => {
      this.fotoDerechaAutoPlay();

    }, this.tiempoDeReproduccion);
  }

  pause() {

    if (this.get_duration_interval) {
      clearInterval(this.get_duration_interval);

    }
  }

  fotoIzquierda() {

    clearInterval(this.get_duration_interval);
    this.fotoPosicion--;

    if (this.fotoPosicion != this.listaFotos.length) {
      this.fotoToShow = this.listacompleja[this.fotoPosicion].frame;
      if (this.listacompleja[this.fotoPosicion].texto != undefined) {
        this.textoFrame = this.listacompleja[this.fotoPosicion].texto;
      }
      else {
        this.textoFrame = '';

      }
      if (this.listacompleja[this.fotoPosicion].audio != '') {
        this.audioFrame = this.listacompleja[this.fotoPosicion].audio;

      }
      else {
        this.audioFrame = '';
      }

    }

  }

  fotoDerecha() {

    clearInterval(this.get_duration_interval);
    this.fotoPosicion++;

    if (this.fotoPosicion != this.listaFotos.length) {
      this.fotoToShow = this.listacompleja[this.fotoPosicion].frame;
      if (this.listacompleja[this.fotoPosicion].texto != undefined) {
        this.textoFrame = this.listacompleja[this.fotoPosicion].texto;
      }
      else {
        this.textoFrame = '';

      }
      if (this.listacompleja[this.fotoPosicion].audio != '') {
        this.audioFrame = this.listacompleja[this.fotoPosicion].audio;

      }
      else {
        this.audioFrame = '';
      }

    }
  }

  fotoDerechaAutoPlay() {
    clearInterval(this.get_duration_interval);
    this.fotoPosicion++;

    if (this.fotoPosicion != this.listaFotos.length) {
      this.fotoToShow = this.listacompleja[this.fotoPosicion].frame;
      if (this.listacompleja[this.fotoPosicion].texto != undefined) {
        this.textoFrame = this.listacompleja[this.fotoPosicion].texto;
      }
      else {
        this.textoFrame = '';

      }
      if (this.listacompleja[this.fotoPosicion].audio != '') {
        this.audioFrame = this.listacompleja[this.fotoPosicion].audio;
        this.tiempoDeReproduccion = 1000 * this.listacompleja[this.fotoPosicion].duracion;
      }
      else {
        this.audioFrame = '';
        this.tiempoDeReproduccion = 1000 * 10;
      }
      this.play();
    }
  }

  stop() {

    if (this.get_duration_interval) {
      clearInterval(this.get_duration_interval);
    }
    this.tiempoDeReproduccion=1000;
    this.fotoPosicion = 0;
    this.textoFrame = '';
    this.audioFrame = '';
    this.fotoToShow = '../../../../../assets/reproductor/negro.png';

  }
}

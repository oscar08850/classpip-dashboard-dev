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

showButtonAudioFrame: any = false;
showButtonFondoFrame: any = false;

url = 'http://localhost:3000/api/imagenes/';
  ngOnInit() {

    this.idLibro = this.sesion.getIdLibro();

    this.damelibro();

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

        if(res.tipoAudio == "frame")
     {
        this.showButtonAudioFrame = true;
     }
     else if (res.tipoAudio != "frame")
     {
        if(res.urlAudioFondo != "no")
        {
          var audio =  this.url + this.libro.titulo + "/download/" + res.urlAudioFondo;

          this.listaFondosAudio.push(audio);
          this.showButtonFondoFrame = true;
        }
        else(res.urlAudioFondo == "no")
        {
          this.listaFondosAudio.push("");
        }
     }

        res.forEach(element => {
          this.listaEscenas.push(element);
          this.tiempo = element.duracionFrame;
        });
        this.dameFrames();
      });


  }

  dameFrames() {

    this.listaEscenas.forEach(element => {
      var id = element.id;


     
      this.peticionesAPI.getFramesByEscenaId(id)
        .subscribe(res => {
          var lista = [];
          console.log(res);
     
  
          res.forEach(element => {
            lista.push(element);
            if(this.showButtonAudioFrame == true)
            {
              var audio =  this.url + this.libro.titulo + "/download/" + element.audioUrl;
              this.listaAudios.push(audio);
            }
          });
          this.obtenerFrames(lista);
        });


    });

  }
  obtenerFrames(lista) {

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

  


play()
{
  this.intervalId = setInterval(() =>
  {
    this.fotoToShow = this.listaFotos[this.fotoPosicion];
    this.audioFrame = this.listaAudios[this.fotoPosicion];
    this.textoFrame = this.listaTextos[this.fotoPosicion];
    if(this.fotoPosicion < this.listaFotos.length)
    {
    this.fotoPosicion = this.fotoPosicion + 1;
    
    }
    else {
      this.fotoPosicion = 0;
      this.fotoToShow = this.listaFotos[this.fotoPosicion];
      this.textoFrame = this.listaTextos[this.fotoPosicion];

    }

  }, 2000);
}

pause()
{

  clearInterval(this.intervalId);

}

fotoIzquierda()
{

  if(this.fotoPosicion == this.listaFotos.length)
{
  this.fotoPosicion = this.listaFotos.length - 2;

}

  if(this.fotoPosicion != -1)
  {
    this.fotoToShow = this.listaFotos[this.fotoPosicion];
    this.audioFrame = this.listaAudios[this.fotoPosicion];
    this.textoFrame = this.listaTextos[this.fotoPosicion];

    this.fotoPosicion = this.fotoPosicion - 1;

  }

  


}

fotoDerecha()
{

  if(this.fotoPosicion == -1)
  {
    this.fotoPosicion = 1;
  
  }

  if(this.fotoPosicion != this.listaFotos.length)
  {
    this.fotoToShow = this.listaFotos[this.fotoPosicion];
    this.audioFrame = this.listaAudios[this.fotoPosicion];
    this.textoFrame = this.listaTextos[this.fotoPosicion];


    this.fotoPosicion = this.fotoPosicion + 1;

  }

 
}

stop(){

  this.fotoPosicion = 0;
  clearInterval(this.intervalId);

 this.fotoToShow = '../../../../../assets/reproductor/negro.png';



}
}

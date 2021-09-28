import { Component, OnInit } from '@angular/core';
import { PeticionesAPIService } from '../../servicios/peticiones-api.service';
import { SesionService } from '../../servicios/sesion.service';
import { ImagenToBackend } from '../../clases/clasesParaJuegoDeCuentos/ImagenGuardada';



@Component({
  selector: 'app-mis-recursos-cuento',
  templateUrl: './mis-recursos-cuento.component.html',
  styleUrls: ['./mis-recursos-cuento.component.scss']
})
export class MisRecursosCuentoComponent implements OnInit {


  listaRecursos: any[] = [];
  recursoId: Number;
  recursoCargadoPregunta: any = false;
  recursoCargado: any;

  listaFotosPersonajes: any[] = [];
  listaFotosFondos: any[] = [];
  listaFotosObjetos: any[] = [];





  constructor(public API: PeticionesAPIService, public sesion: SesionService) { }


  ngOnInit() {

    this.recuperarListaRecursos();
  }


  /**
   * Recupera la lista de recursos del profesor
   */
  async recuperarListaRecursos() {
    this.listaRecursos = [];

   var xwdadwa =await this.API.recuperarListaRecursos(this.sesion.DameProfesor().id)
      .subscribe((res) => {
        console.log(this.sesion.DameProfesor().id);
        this.listaRecursos = res;
        console.log(this.listaRecursos);
      }, (err) => {

      })
  }




/**
 * Trae las imagenas del recursos Cuento subida por el profesor.
 */
  traeImagenesRecursoLibro(){


    this.listaFotosPersonajes = [];
    this.listaFotosFondos  = [];
    this.listaFotosObjetos = [];

    this.recursoCargadoPregunta = true;
    this.recursoCargado = this.listaRecursos.filter (recuro => recuro.id === Number(this.recursoId))[0];

    this.recursoCargado.imagenes.forEach(element => {
      
      this.API.getImagenesRecurso(this.recursoCargado.carpeta, element.nombre)
      .subscribe((res)=>{
        
        const blob = new Blob([res.blob()], { type: 'image/png' });
        const reader = new FileReader();

        reader.addEventListener('load', () => {

          var foto = null;
          foto = reader.result.toString();
          var fotoProps = new ImagenToBackend();
          fotoProps.url = foto;
          if(element.especial == true)
          {
            fotoProps.especial = "Especial"
          }
          else
          {
            fotoProps.especial == ""
          }

          fotoProps.nombre = element.nombre


          if (element.tipo == "fondo")
          {
            this.listaFotosFondos.push(fotoProps);
          }
          else if (element.tipo == "personaje")
          {
            this.listaFotosPersonajes.push(fotoProps);

          }
          else if (element.tipo == "objeto")
          {
            this.listaFotosObjetos.push(fotoProps);

          }

        }, false);

        if (blob) {
          reader.readAsDataURL(blob);
        }


      }, (err)=>{

        console.log(err);
      })

    });
    
  }

}

import { Component, OnInit } from '@angular/core';
import { SesionClase, TablaHistorialPuntosAlumno } from 'src/app/clases';
import { PeticionesAPIService, SesionService } from 'src/app/servicios';
import { Router } from '@angular/router';

import { ImagenToBackend } from 'src/app/clases/clasesParaJuegoDeCuentos/ImagenGuardada';
import { Location } from '@angular/common';


@Component({
  selector: 'app-reproductor-cuento',
  templateUrl: './reproductor-cuento.component.html',
  styleUrls: ['./reproductor-cuento.component.scss']
})
export class ReproductorCuentoComponent implements OnInit {

  constructor(private sesion: SesionService, private peticionesAPI: PeticionesAPIService, private router: Router, private location: Location ) { }

  listaEscenasVisor: any[] = [];
  listaEscenasVisor2: any[] = [];
  recursoCargadoPregunta: any = false;
  recursoCargado: any;
  contador: number;


  async ngOnInit() {
    await this.obtengoImagenesEscenas();
    await this.traeImagenesRecursoLibro()

    this.contador=0;
  }

  
  /**
   * Avanzamos a la siguiente escena
   */
   avanzar(){
    if(this.contador < this.listaEscenasVisor2.length-1) this.contador++;
    console.log("Escena: "+this.contador)
  }

  /**
   * Retrocedemos de escena
   */
  retroceder(){
    if(this.contador > 0) this.contador--;
    console.log("Escena: "+this.contador)
  }

  /**
   * Volvemos a la pantalla  juego-de-cuento-seleccionado-activo
   */
  goBack() {
    this.location.back();
  }

  /**
   * Obtenemos las imagenes de escena que se encuentran en el contenedor del cuento creado por el alumno
   */
  async obtengoImagenesEscenas()
  {
    console.log("nombre contenedor:  "+this.sesion.getContenedor);
    //let contenedor = this.sesion.getContenedor();
    this.listaEscenasVisor = await this.peticionesAPI.obtenerImagenesEscena(this.sesion.getContenedor()).toPromise();
    console.log("llegado");
    console.log(this.listaEscenasVisor);
  }

  /**
   * Traemos las escenas a formato url y las asignamos la la lista this.listaEscenasVisor2[]
   */
  traeImagenesRecursoLibro(){
  

    this.listaEscenasVisor2 = [];
  
  
    this.recursoCargadoPregunta = true;
    console.log('This');
    console.log('id: ')

    this.listaEscenasVisor.forEach(async element => {
        
      let res = await this.peticionesAPI.getEscenasDeRecurso(this.sesion.getContenedor(), element.name).toPromise()
  
      const blob = new Blob([res.blob()], { type: 'image/png' });
        const reader = new FileReader();
  
        reader.addEventListener('load',  () => {
          let elementNombre: string;
          var foto = null;
          foto = reader.result.toString();
          var fotoProps = new ImagenToBackend();
          fotoProps.url = foto;
         
         
          elementNombre=element.name;
          element.name=elementNombre.split(".",1); 
          fotoProps.nombre = element.name
  
  
  
          this.listaEscenasVisor2.push(fotoProps);
          
          //Se ordenan las escenas, ya que a veces nos llegan desordenadas desde la API
          this.listaEscenasVisor2.sort(function(a,b){
            console.log("wdawdada          "+a.nombre)
            return a.nombre-b.nombre;
          })
          
          console.log("wdawdadad"+ this.listaEscenasVisor2[0].nombre)
  
        });
  
        if (blob) {
          reader.readAsDataURL(blob);
        }
  
  
  
    });
  
    console.log(this.listaEscenasVisor2);
    console.log('end')
  
  }
}

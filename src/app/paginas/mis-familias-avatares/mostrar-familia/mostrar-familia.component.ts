import { Component, OnInit } from '@angular/core';
import { SesionService, CalculosService, PeticionesAPIService } from '../../../servicios';
import { FamiliaAvatares } from 'src/app/clases';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-mostrar-familia',
  templateUrl: './mostrar-familia.component.html',
  styleUrls: ['./mostrar-familia.component.scss']
})
export class MostrarFamiliaComponent implements OnInit {

  familiaId: number;
  familiaCargada = false;
  familiaElegida: FamiliaAvatares;

  imagenSilueta: string;
  imagenesComplemento1: string[];
  imagenesComplemento2: string[];
  imagenesComplemento3: string[];
  imagenesComplemento4: string[];

  hayComplementoPuesto: boolean[];
  complementoPuesto: any[];

  ancho = '150px';
  alto = '162px';
  dobleancho = '300px';
  doblealto = '324px';


  constructor(
        private peticionesAPI: PeticionesAPIService,
        private sesion: SesionService,
        private location: Location,
        private router: Router
  ) { }

  ngOnInit() {
    this.familiaElegida = this.sesion.DameFamilia ();
    this.hayComplementoPuesto = Array(4).fill(false);
    this.complementoPuesto = Array(4);
    this.TraeImagenesFamilia();
  }

  CreaImagen(numeroComplemento, opcion, stringImagen): any {
    // Crea la imagen que hay que colocar
    // numeroComplemento va de 1 a 4
    // opción empieza en 0
     const imagen = document.createElement('img'); // creo una imagen
     // Cada imagen tendrá un identificador que será el número de complento seguido del numero de opción
     // de complemento (por ejemplo, 13 sería el identificador de la tercera opción del primer complemento de )
     imagen.id = numeroComplemento * 10 + (opcion + 1); // coloco el identificador
     // La posición es relativa dentro del bloque
     imagen.style.position = 'alsolute';
     // Las imagenes se apilan según el orden indicado por el número de complemento
     imagen.style.zIndex = numeroComplemento;

     // Coloco el nombre del fichero en el que está la imagen
     imagen.src =  stringImagen;

     // Mostramos la imagen en tamaño normal

     imagen.setAttribute('width', this.ancho);
     imagen.setAttribute('height', this.alto);


     // Le añado la función que hay que ejecutar cuando se haga click
     // en la imagen.
     // La función tiene 8 parámetros:
     //    el identificador de la imagen
     //    el número de complemento (0, 1, 2, 3)
     //    el vector de booleanos que me dice qué complementos están ya puestos sobre la silueta
     //    el vector con los complementos ya puestos en la silueta
     //    los cuatro strings que contienen el ancho, alto, ancho doble y alto doble
     // tslint:disable-next-line:only-arrow-functions
     imagen.onclick = (function(elementoId, numComplemento, hayComplementoPuesto, complementoPuesto, ancho, alto, dobleancho, doblealto) {
         // tslint:disable-next-line:only-arrow-functions
         return function() {

           console.log ('voy a colocar el elemento ' + elementoId);

           if (hayComplementoPuesto[numComplemento]) {
             // si ya hay un complemento sobre la silueta del tipo elegido
             // entonces lo tengo que quitar de la silueta y volverlo a la zona de complemento

             // obtendo el id de la imagen
             const id = complementoPuesto[numComplemento].id;
             console.log ('saco el elemento ' + id);
             // tslint:disable-next-line:no-shadowed-variable
             const elemento = document.getElementById(id);
             // La voy a visualizar a tamaño normal

             console.log ('antes ');
             console.log (elemento);
             elemento.setAttribute('width', ancho);
             elemento.setAttribute('height', alto);

             console.log ('despues ');
             console.log (elemento);
             elemento.style.position = 'relative';
             // Coloco la imagen en la zona de complementos correspondiente
             document.getElementById('imagenesComplementos' + numComplemento)
             .appendChild(elemento);
             hayComplementoPuesto[numComplemento] = false;
           }
          //  // veo cuantos complementos hay ya puestos
          //  let cont = 0;
          //  hayComplementoPuesto.forEach (hay => { if (hay) { cont++; }});
           // para colocar el complemento elegido necesito la altura de la silueta
          //  const altura = document.getElementById('silueta').clientHeight;
           console.log ('voy a colocar el elemento ' + elementoId);
           // obtengo el complemento elegido
           const elemento = document.getElementById(elementoId);
           // lo coloco sobre la silueta, ampliando el tamaño
           elemento.style.left = '0px';
           elemento.style.top =  '0px';
           elemento.style.position = 'absolute';
           elemento.setAttribute('width', dobleancho);
           elemento.setAttribute('height', doblealto);
           console.log (elemento);
           document.getElementById('imagenAvatar')
           .appendChild(elemento);
           // guardo el complemento puesto
           hayComplementoPuesto[numComplemento] = true;
           complementoPuesto[numComplemento] = elemento;
       };
       // estos son los parámetros realies que pasaré a la función cuando se haga clic sobre el complemento
     // tslint:disable-next-line:max-line-length
     })(imagen.id, numeroComplemento, this.hayComplementoPuesto, this.complementoPuesto, this.ancho, this.alto, this.dobleancho, this.doblealto);

     return imagen;
  }

  QuitarComplemento(numeroComplemento) {
    if (this.hayComplementoPuesto[numeroComplemento]) {
      // si ya hay un complemento sobre la silueta del tipo elegido
      // entonces lo tengo que quitar de la silueta y volverlo a la zona de complementos

      const id = this.complementoPuesto[numeroComplemento].id;
      // tslint:disable-next-line:no-shadowed-variable
      const elemento = document.getElementById(id);
      elemento.setAttribute('width', this.ancho);
      elemento.setAttribute('height', this.alto);
      elemento.style.position = 'relative';
      // Coloco la imagen en la zona de complementos correspondiente
      document.getElementById('imagenesComplementos' + numeroComplemento)
      .appendChild(elemento);
      this.hayComplementoPuesto[numeroComplemento] = false;
    }
  }



  TraeImagenesFamilia() {

    // Borro los complementos que pueda haber sobre la silueta
    this.hayComplementoPuesto = Array(4).fill(false);
    const myNode = document.getElementById('imagenAvatar');
    if (myNode != null) {
      // Borro todos los hijos menos el primero que es la silueta
      for ( let i = myNode.children.length; i > 1; i--) {
       myNode.removeChild(myNode.childNodes[i]);
     }
    }

    this.familiaCargada = false;
      // Traigo la imagen de la silueta
    this.peticionesAPI.DameImagenAvatar (this.familiaElegida.Silueta)
     .subscribe(response => {
       const blob = new Blob([response.blob()], { type: 'image/jpg'});

       const reader = new FileReader();
       reader.addEventListener('load', () => {
         this.imagenSilueta = reader.result.toString();
       }, false);


       if (blob) {
         reader.readAsDataURL(blob);
       }
     });


    this.TraerImagenesComplementos();
   }

   TraerImagenesComplementos() {

     // Vamos a por las imagenes de cada uno de los complementos

     // Borro los complementos que pudiera haber caragacos (de una familia anterior)
     const comp1 = document.getElementById('imagenesComplementos1');
     if (comp1 !== null) {
       while (comp1.firstChild) {
         comp1.removeChild(comp1.lastChild);
       }
     }
     let cont1 = 0;
     this.familiaElegida.Complemento1.forEach (imagenComplemento => {
       this.peticionesAPI.DameImagenAvatar (imagenComplemento)
       .subscribe(response => {
         const blob = new Blob([response.blob()], { type: 'image/jpg'});
         const reader = new FileReader();
         reader.addEventListener('load', () => {
             // Creo la imagen del complemento
             const imagen = this.CreaImagen (1, cont1, reader.result.toString());
             // Ahora coloco la imagen creada en la zona de complementos que le toca
             document.getElementById('imagenesComplementos1').appendChild(imagen);


             cont1++;
         }, false);

         if (blob) {
           reader.readAsDataURL(blob);
         }
       });
     });
      // Borro los complementos que pudiera haber caragacos (de una familia anterior)
     const comp2 = document.getElementById('imagenesComplementos2');
     if (comp2 !== null) {
        while (comp2.firstChild) {
          comp2.removeChild(comp2.lastChild);
        }
     }

     let cont2 = 0;
     this.familiaElegida.Complemento2.forEach (imagenComplemento => {
        this.peticionesAPI.DameImagenAvatar (imagenComplemento)
        .subscribe(response => {
          const blob = new Blob([response.blob()], { type: 'image/jpg'});
          const reader = new FileReader();
          reader.addEventListener('load', () => {
             // Creo la imagen del complemento
              const imagen = this.CreaImagen (2, cont2, reader.result.toString());
              // Ahora coloco la imagen creada en la zona de complementos que le toca
              document.getElementById('imagenesComplementos2').appendChild(imagen);
              cont2++;
          }, false);
          if (blob) {
            reader.readAsDataURL(blob);
          }
        });
     });

      // Borro los complementos que pudiera haber caragacos (de una familia anterior)
     const comp3 = document.getElementById('imagenesComplementos3');
     if (comp3 !== null) {
        while (comp3.firstChild) {
          comp3.removeChild(comp3.lastChild);
        }
      }
     let cont3 = 0;
     this.familiaElegida.Complemento3.forEach (imagenComplemento => {
         this.peticionesAPI.DameImagenAvatar (imagenComplemento)
         .subscribe(response => {
           const blob = new Blob([response.blob()], { type: 'image/jpg'});
           const reader = new FileReader();
           reader.addEventListener('load', () => {
               // Creo la imagen del complemento
               const imagen = this.CreaImagen (3, cont3, reader.result.toString());
               // Ahora coloco la imagen creada en la zona de complementos que le toca
               document.getElementById('imagenesComplementos3').appendChild(imagen);
               cont3++;
           }, false);
           if (blob) {
             reader.readAsDataURL(blob);
           }
         });
     });
     // Borro los complementos que pudiera haber caragacos (de una familia anterior)
     const comp4 = document.getElementById('imagenesComplementos4');
     if (comp4 !== null) {
       while (comp4.firstChild) {
         comp4.removeChild(comp4.lastChild);
       }
     }
     let cont4 = 0;
     this.familiaElegida.Complemento4.forEach (imagenComplemento => {
          this.peticionesAPI.DameImagenAvatar (imagenComplemento)
          .subscribe(response => {
            const blob = new Blob([response.blob()], { type: 'image/jpg'});
            const reader = new FileReader();
            reader.addEventListener('load', () => {
               // Creo la imagen del complemento
                const imagen = this.CreaImagen (4, cont4, reader.result.toString());
                // Ahora coloco la imagen creada en la zona de complementos que le toca
                document.getElementById('imagenesComplementos4').appendChild(imagen);
                cont4++;
            }, false);
            if (blob) {
              reader.readAsDataURL(blob);
            }
          });
     });

     this.familiaCargada = true;
   }


  goBack() {
    this.location.back();
  }
}

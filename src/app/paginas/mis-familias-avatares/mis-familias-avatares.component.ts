import { Component, OnInit } from '@angular/core';
import { SesionService, CalculosService, PeticionesAPIService } from '../../servicios';
import { FamiliaAvatares } from 'src/app/clases';

@Component({
  selector: 'app-mis-familias-avatares',
  templateUrl: './mis-familias-avatares.component.html',
  styleUrls: ['./mis-familias-avatares.component.scss']
})
export class MisFamiliasAvataresComponent implements OnInit {

  listaFamilias: FamiliaAvatares[];
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

  ancho;
  alto;
  dobleancho;
  doblealto;



  constructor( private peticionesAPI: PeticionesAPIService,
               private sesion: SesionService
  ) { }

  ngOnInit() {
    this.hayComplementoPuesto = Array(4).fill(false);
    this.complementoPuesto = Array(4);
    this.peticionesAPI.DameFamiliasAvataresProfesor (this.sesion.DameProfesor().id)
    .subscribe (lista => this.listaFamilias = lista);
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
     imagen.style.position = 'relative';
     imagen.style.zIndex = '1';
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

           if (hayComplementoPuesto[numComplemento]) {
             // si ya hay un complemento sobre la silueta del tipo elegido
             // entonces lo tengo que quitar de la silueta y volverlo a la zona de complemento

             // obtendo el id de la imagen
             const id = complementoPuesto[numComplemento].id;
             // tslint:disable-next-line:no-shadowed-variable
             const elemento = document.getElementById(id);
             // La voy a visualizar a tamaño normal

             elemento.setAttribute('width', ancho);
             elemento.setAttribute('height', alto);
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

           // obtengo el complemento elegido
           const elemento = document.getElementById(elementoId);
           // lo coloco sobre la silueta, ampliando el tamaño
           elemento.style.left = '0px';
           elemento.style.top =  '0px';
           elemento.setAttribute('width', dobleancho);
           elemento.setAttribute('height', doblealto);
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
    this.familiaElegida = this.listaFamilias.filter (familia => familia.id === Number(this.familiaId))[0];
    // Traigo la imagen de la silueta
    this.peticionesAPI.DameImagenAvatar (this.familiaElegida.Silueta)
    .subscribe(response => {
      const blob = new Blob([response.blob()], { type: 'image/jpg'});

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.imagenSilueta = reader.result.toString();
        // Lo siguiente es para conseguir el tamaño de la silueta
        const imagen = new Image();
        imagen.src = reader.result.toString();
        console.log ('ya he cargado la silueta');
        imagen.onload = () => {
          this.ancho = imagen.width.toString();
          this.alto = imagen.height.toString();
          this.dobleancho = (imagen.width * 2).toString();
          this.doblealto = (imagen.height * 2).toString();
          this.TraerImagenesComplementos();

        };
      }, false);


      if (blob) {
        reader.readAsDataURL(blob);
      }
    });
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
         comp2.removeChild(comp1.lastChild);
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


  PonDoble(img) {
    img.setAttribute ('width', this.dobleancho);
    img.setAttribute ('height', this.doblealto );
  }
}

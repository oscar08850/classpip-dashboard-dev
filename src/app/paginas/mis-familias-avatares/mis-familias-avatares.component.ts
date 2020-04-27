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
     imagen.style.left = (10 * opcion) + 'px';
     imagen.style.top = '0px';
     // La posición es relativa dentro del bloque
     imagen.style.position = 'relative';
     imagen.style.zIndex = '1';
     // Coloco el nombre del fichero en el que está la imagen
     imagen.src =  stringImagen;


     // Le añado la función que hay que ejecutar cuando se haga click
     // en la imagen.
     // La función tiene 4 parámetros:
     //    el identificador de la imagen
     //    el número de complemento (0, 1, 2, 3)
     //    el vector de booleanos que me dice qué complementos están ya puestos sobre la silueta
     //    el vector con los complementos ya puestos en la silueta

     // tslint:disable-next-line:only-arrow-functions
     imagen.onclick = (function(elementoId, numComplemento, hayComplementoPuesto, complementoPuesto) {
         // tslint:disable-next-line:only-arrow-functions
         return function() {
           console.log ('han clicado' + elementoId);
           if (hayComplementoPuesto[numComplemento]) {
             // si ya hay un complemento sobre la silueta del tipo elegido
             // entonces lo tengo que quitar de la silueta y volverlo a la zona de complementos

             const id = complementoPuesto[numComplemento].id;
             const n = id % 10;

             // Primero obtengo el complemento puesta a partir de su id
             console.log ('voy a quitar complemento ' + id);
             // tslint:disable-next-line:no-shadowed-variable
             const elemento = document.getElementById(id);
             // A partir del id obtengo también el número de opcion del complemento puesto
             // coloco el complemento puesto en la zona de complementos
             elemento.style.left = 10 * (n - 1) + 'px';
             elemento.style.top = '0px';
             // Le restituyo el tamaño original
             elemento.setAttribute('width', '120');
             elemento.setAttribute('height', '140');
             elemento.style.position = 'relative';
             // Coloco la imagen en la zona de complementos correspondiente
             document.getElementById('imagenesComplementos' + numComplemento)
             .appendChild(elemento);
             hayComplementoPuesto[numComplemento] = false;
           }

           // veo cuantos complementos hay ya puestos
           let cont = 0;
           hayComplementoPuesto.forEach (hay => { if (hay) { cont++; }});
           // para colocar el complemento elegido necesito la altura de la silueta
           const altura = document.getElementById('silueta').clientHeight;

           // obtengo el complemento elegido
           const elemento = document.getElementById(elementoId);
           // lo coloco sobre la silueta, ampliando el tamaño
           elemento.style.left = '0px';
          // elemento.style.top =  '-' + altura + 'px';
          // elemento.style.top =  -280 * (cont + 1) + 'px';
           elemento.style.top =  '0px';
           elemento.setAttribute('width', '240');
           elemento.setAttribute('height', '280');
           elemento.style.position = 'absolute';
           document.getElementById('imagenAvatar')
           .appendChild(elemento);
           console.log ('pongo' + elemento.id);
           // guardo el complemento puesto
           hayComplementoPuesto[numComplemento] = true;
           complementoPuesto[numComplemento] = elemento;
       };
     })(imagen.id, numeroComplemento, this.hayComplementoPuesto, this.complementoPuesto);

     return imagen;
  }

  QuitarComplemento(numeroComplemento) {
    console.log ('quito complemento ' + numeroComplemento);
    if (this.hayComplementoPuesto[numeroComplemento]) {
      // si ya hay un complemento sobre la silueta del tipo elegido
      // entonces lo tengo que quitar de la silueta y volverlo a la zona de complementos

      const id = this.complementoPuesto[numeroComplemento].id;
      const n = id % 10;

      // Primero obtengo el complemento puesta a partir de su id
      console.log ('voy a quitar complemento ' + id);
      // tslint:disable-next-line:no-shadowed-variable
      const elemento = document.getElementById(id);
      // A partir del id obtengo también el número de opcion del complemento puesto
      // coloco el complemento puesto en la zona de complementos
      elemento.style.left = 10 * (n - 1) + 'px';
      elemento.style.top = '0px';
      // Le restituyo el tamaño original
      elemento.setAttribute('width', '120');
      elemento.setAttribute('height', '140');
      elemento.style.position = 'relative';
      // Coloco la imagen en la zona de complementos correspondiente
      document.getElementById('imagenesComplementos' + numeroComplemento)
      .appendChild(elemento);
      this.hayComplementoPuesto[numeroComplemento] = false;
    }
  }

  TraeImagenesFamilia() {
    console.log ('Voy a traer imagenes de la familia ' + this.familiaId);
    this.familiaElegida = this.listaFamilias.filter (familia => familia.id === Number(this.familiaId))[0];
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

    // Vamos a por las imagenes de cada uno de los complementos
    let cont1 = 0;
    this.familiaElegida.Complemento1.forEach (imagenComplemento => {
      this.peticionesAPI.DameImagenAvatar (imagenComplemento)
      .subscribe(response => {
        const blob = new Blob([response.blob()], { type: 'image/jpg'});
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            // Ahora coloco la imagen en su sitio
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

    let cont2 = 0;
    this.familiaElegida.Complemento2.forEach (imagenComplemento => {
       this.peticionesAPI.DameImagenAvatar (imagenComplemento)
       .subscribe(response => {
         const blob = new Blob([response.blob()], { type: 'image/jpg'});
         const reader = new FileReader();
         reader.addEventListener('load', () => {
             // Ahora coloco la imagen en su sitio
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

    let cont3 = 0;
    this.familiaElegida.Complemento3.forEach (imagenComplemento => {
        this.peticionesAPI.DameImagenAvatar (imagenComplemento)
        .subscribe(response => {
          const blob = new Blob([response.blob()], { type: 'image/jpg'});
          const reader = new FileReader();
          reader.addEventListener('load', () => {
              // Ahora coloco la imagen en su sitio
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

    let cont4 = 0;
    this.familiaElegida.Complemento4.forEach (imagenComplemento => {
         this.peticionesAPI.DameImagenAvatar (imagenComplemento)
         .subscribe(response => {
           const blob = new Blob([response.blob()], { type: 'image/jpg'});
           const reader = new FileReader();
           reader.addEventListener('load', () => {
               // Ahora coloco la imagen en su sitio
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


}

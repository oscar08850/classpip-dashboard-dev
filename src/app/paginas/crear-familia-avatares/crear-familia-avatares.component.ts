import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FamiliaAvatares } from 'src/app/clases';
import Swal from 'sweetalert2';

import { SesionService, PeticionesAPIService, CalculosService } from '../../servicios/index';

@Component({
  selector: 'app-crear-familia-avatares',
  templateUrl: './crear-familia-avatares.component.html',
  styleUrls: ['./crear-familia-avatares.component.scss']
})
export class CrearFamiliaAvataresComponent implements OnInit {


  nombreFormGroup: FormGroup;
  complemento1FormGroup: FormGroup;
  complemento2FormGroup: FormGroup;
  complemento3FormGroup: FormGroup;
  complemento4FormGroup: FormGroup;

  botonAvanzarAPaso2Desactivado = true;


  fileSilueta: File;
  imagenSilueta: string;
  imagenSiluetaCargada = false;


  fileComplemento: File [][];
  //imagenComplementoCargada: boolean[];
  imagenComplementoCargada = false;

  imagenComplemento: string[];

  cont;
  familiaAvatares: FamiliaAvatares;
  activarCargaComplemento1 = false;
  activarCargaComplemento2 = false;
  activarCargaComplemento3 = false;
  activarCargaComplemento4 = false;

  alturaSilueta;

  imagen;
  file;

  constructor(
    private formBuilder: FormBuilder,
    private peticionesAPI: PeticionesAPIService,
    private sesion: SesionService
  ) { }

  ngOnInit() {
   // Indico los campos que tendrá cada uno de los dos formularios que se usan en el stepper
    this.nombreFormGroup = this.formBuilder.group({
      nombreFamilia: ['', Validators.required]
    });
    this.complemento1FormGroup = this.formBuilder.group({
      nombreComplemento1: ['', Validators.required]
    });
    this.complemento2FormGroup = this.formBuilder.group({
      nombreComplemento2: ['', Validators.required]
    });
    this.complemento3FormGroup = this.formBuilder.group({
      nombreComplemento3: ['', Validators.required]
    });
    this.complemento4FormGroup = this.formBuilder.group({
      nombreComplemento4: ['', Validators.required]
    });

    this.fileComplemento = Array(4).fill([]);
    this.imagenComplemento = Array(4).fill(undefined);
    //this.imagenComplementoCargada = Array(4).fill(false);
    this.cont = Array(4).fill(0);


  }




  // MIRO SI HAY ALGO SIMULTÁNEAMENTE EN EL NOMBRE Y LA EDAD
  GuardarNombreFamilia() {
    if (this.nombreFormGroup.value.nombreFamilia === '') {
      // Si alguno de los valores es igual a nada, entonces estará desactivado
      this.botonAvanzarAPaso2Desactivado = true;
    } else {
      // Si ambos son diferentes a nulo, estará activado.
      this.botonAvanzarAPaso2Desactivado = false;
      this.familiaAvatares = new FamiliaAvatares (this.nombreFormGroup.value.nombreFamilia);
      this.familiaAvatares.Complemento1 = [];
      this.familiaAvatares.Complemento2 = [];
      this.familiaAvatares.Complemento3 = [];
      this.familiaAvatares.Complemento4 = [];
      console.log ('activo');
    }
  }


   GuardarNombreComplemento1() {
    if (this.complemento1FormGroup.value.nombreComplemento1 === '') {
      this.activarCargaComplemento1 = false;
    } else {
      this.activarCargaComplemento1 = true;
      this.familiaAvatares.NombreComplemento1 =  this.complemento1FormGroup.value.nombreComplemento1;
    }
  }


  GuardarNombreComplemento2() {
    if (this.complemento2FormGroup.value.nombreComplemento2 === '') {
      this.activarCargaComplemento2 = false;
    } else {
      this.activarCargaComplemento2 = true;
      this.familiaAvatares.NombreComplemento2 =  this.complemento2FormGroup.value.nombreComplemento2;
    }
  }

  GuardarNombreComplemento3() {
    if (this.complemento3FormGroup.value.nombreComplemento3 === '') {
      this.activarCargaComplemento3 = false;
    } else {
      this.activarCargaComplemento3 = true;
      this.familiaAvatares.NombreComplemento3 =  this.complemento3FormGroup.value.nombreComplemento3;
    }
  }


  GuardarNombreComplemento4() {
    if (this.complemento4FormGroup.value.nombreComplemento4 === '') {
      this.activarCargaComplemento4 = false;
    } else {
      this.activarCargaComplemento4 = true;
      this.familiaAvatares.NombreComplemento4 =  this.complemento4FormGroup.value.nombreComplemento4;
    }
  }



   // MIRO SI HAY ALGO SIMULTÁNEAMENTE EN EL NOMBRE Y LA EDAD



  ActivarInputSilueta() {
    console.log('Activar input');
    document.getElementById('inputSilueta').click();
  }

  // onChange(evt:any){
  //   this.percentDone = 100;
  //   this.uploadSuccess = true;
  //   let image:any = evt.target.files[0];
  //   this.size = image.size;
  //   let fr = new FileReader();
  //   fr.onload = () => { // when file has loaded
  //    var img = new Image();

  //    img.onload = () => {
  //        this.width = img.width;
  //        this.height = img.height;
  //    };

  //    img.src = fr.result; // This is the data URL
  //   };

  CargarImagenSilueta($event) {
    this.fileSilueta = $event.target.files[0];
    this.familiaAvatares.Silueta = this.fileSilueta.name;

    const reader = new FileReader();
    reader.readAsDataURL(this.fileSilueta);
    reader.onload = () => {
      const img = new Image();
      this.imagenSiluetaCargada = true;
      this.imagenSilueta = reader.result.toString();
    };
  }
  CargarImagenComplemento(n, $event) {
    if (this.cont[n] === 5) {
      Swal.fire('No puedes elegir más de 5 opciones para un complemento', ' ', 'error');

    } else {
      this.file = $event.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = () => {
        this.imagenComplementoCargada = true;

        // Guardamos la imagen aqui para mostrarla en la pantalla
        this.imagenComplemento[n] = (reader.result.toString());

        this.MostrarComplemento(n);

        console.log ('Complemento cargado');
      };
    }

  }

  CargarImagenComplemento2(n, $event) {

    if (this.cont[n] === 5) {
      Swal.fire('No puedes elegir más de 5 opciones para un complemento', ' ', 'error');

    } else {
      const file = $event.target.files[0];
      this.fileComplemento[n].push (file);
      if (n === 0) {
        this.familiaAvatares.Complemento1.push (file.name);
      } else if (n === 1) {
        this.familiaAvatares.Complemento2.push (file.name);
      } else if (n === 2) {
        this.familiaAvatares.Complemento3.push (file.name);
      } else {
        this.familiaAvatares.Complemento4.push (file.name);
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imagenComplementoCargada[n] = true;

        // Guardamos la imagen aqui para mostrarla en la pantalla
        this.imagenComplemento[n] = (reader.result.toString());

        this.cont[n]++;
        this.MostrarComplemento(n);

        console.log ('Complemento cargado');
      };
    }
  }

  ActivarInputComplemento1() {
    document.getElementById('inputComplemento1').click();
  }

  ActivarInputComplemento2() {
    document.getElementById('inputComplemento2').click();
  }
  ActivarInputComplemento3() {
    document.getElementById('inputComplemento3').click();
  }

  ActivarInputComplemento4() {
    document.getElementById('inputComplemento4').click();
  }


  MostrarComplemento(n) {
      // Coloco una nueva opcion para el complemento (n+1)

      this.imagen = document.createElement('img'); // creo una imagen
      // Cada imagen tendrá un identificador que será el número de complento seguido del numero de opción
      // de complemento (por ejemplo, 13 sería el identificador de la tercera opción del primer complemento de )
      this.imagen.id = (n + 1) * 10 + this.cont[n] + 1; // coloco el identificador



      this.imagen.style.left = '0px';
      // Por alguna razon que no entiendo el top tiene que ser negativo, con la misma magnitud
      // que la altura de la figura de la silueta.
      const altura = document.getElementById('silueta').clientHeight;
      this.imagen.style.top = '-' + altura + 'px';
      // La posición es relativa dentro del bloque
      this.imagen.style.position = 'relative';
      this.imagen.style.zIndex = '1';


      // Coloco el nombre del fichero en el que está la imagen
      this.imagen.src =  this.imagenComplemento[n];


      // Le añado la función que hay que ejecutar cuando se haga click
      // en la imagen.
      // La función tiene 3 parámetros: el identificador de la imagen
      // sobre la que se ha clicado, el indice y el estado.
      // El estado me dice si esa imagen está colocada ya sobre el avator
      // o no.
      // imagen.onclick = (function(elemento, i, estado) {
      //     return function () {
      //       console.log ('Elemento ' + elemento);
      //       console.log ('Id ' + i);
      //       console.log ('Estado ' + estado);

      //       if (estado) {
      //         // Si la imagen está sobre el avatar entonces cuando se clica
      //         // hay que regresarla a su posición original en el bloque de elementos
      //         document.getElementById(elemento).style.left = i * 120 + 'px';
      //         document.getElementById(elemento).style.top = '0px';
      //         document.getElementById('elementos')
      //          .appendChild(document.getElementById(elemento));
      //         estado = false;
      //       } else {
      //         // Si la imagen no está en el avatar hay que moverla al avatar
      //         document.getElementById(elemento).style.left = '0px';
      //         document.getElementById(elemento).style.top = '0px';
      //         document.getElementById('avatar')
      //         .appendChild(document.getElementById(elemento));
      //         estado = true;
      //       }
      //     };
      // })(this.elementos.pelos[i].identificador, i, this.estadoPelo[i]); //Estos son los
      // // parametros reales que le paso a la función

      // Coloco la imagen sobre la silueta
      if (n === 0) {
        document.getElementById('muestracomplemento1').appendChild(this.imagen);
      } else if (n === 1) {
        document.getElementById('muestracomplemento2').appendChild(this.imagen);
      } else if (n === 2) {
        document.getElementById('muestracomplemento3').appendChild(this.imagen);
      } else {
        document.getElementById('muestracomplemento4').appendChild(this.imagen);
      }

  }

  AceptarComplemento(n) {
    // Guardamos el fichero y movemos la imagen de la silueta al grupo de opciones

    this.fileComplemento[n].push (this.file);
    this.imagen.style.left = 10 * (this.cont[n] - 1) + 'px';
    this.imagen.style.top = '0px';
    if (n === 0) {
      document.getElementById('muestracomplemento1').appendChild(this.imagen);
      document.getElementById('complementos1').appendChild(this.imagen);
      this.familiaAvatares.Complemento1.push (this.file.name);
   } else if (n === 1) {
      document.getElementById('muestracomplemento2').appendChild(this.imagen);
      document.getElementById('complementos2').appendChild(this.imagen);
      this.familiaAvatares.Complemento2.push (this.file.name);
   } else if (n === 2) {
      document.getElementById('muestracomplemento3').appendChild(this.imagen);
      document.getElementById('complementos3').appendChild(this.imagen);
      this.familiaAvatares.Complemento3.push (this.file.name);
   } else {
      document.getElementById('muestracomplemento4').appendChild(this.imagen);
      document.getElementById('complementos4').appendChild(this.imagen);
      this.familiaAvatares.Complemento4.push (this.file.name);
   }
    this.imagenComplementoCargada = false;
  }

  RechazarComplemento(n) {
    // Eliminamos la imagen de la silueta

    if (n === 0) {
     document.getElementById('muestracomplemento1').removeChild(this.imagen);
    } else if (n === 1) {
      document.getElementById('muestracomplemento2').removeChild(this.imagen);
    } else if (n === 2) {
      document.getElementById('muestracomplemento3').removeChild(this.imagen);
    } else {
      document.getElementById('muestracomplemento4').removeChild(this.imagen);
    }
    this.imagenComplementoCargada = false;

  }

  RegistrarFamiliaAvatares() {
    console.log ('ya tenemos la familia');
    console.log (this.familiaAvatares);
    Swal.fire({
      title: '¿Seguro que quieres registrar esta familia de avatares?',
      text: 'La operación no podrá deshaceerse',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {
        // guardamos la imagen de la silueta
        const siluetaData: FormData = new FormData();
        siluetaData.append(this.fileSilueta.name, this.fileSilueta);
        this.peticionesAPI.PonImagenAvatar(siluetaData)
          .subscribe();

        // ahora guardamos las imagenes de los complementos
        for (let i = 0; i < 4 ; i++) {
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < this.fileComplemento[i].length; j++){
            const imagen = this.fileComplemento[i][j];
            const complementoData: FormData = new FormData();
            complementoData.append(imagen.name, imagen);
            this.peticionesAPI.PonImagenAvatar(complementoData)
              .subscribe();
          }
        }
        this.peticionesAPI.CreaFamiliaAvatares (this.familiaAvatares, this.sesion.DameProfesor().id)
        .subscribe (() =>  Swal.fire('La familia de avatares se ha registrado correctamente')
        );
      }
    });
  }

  Reiniciar() {
    this.nombreFormGroup.reset();
    this.complemento1FormGroup.reset();
    this.complemento2FormGroup.reset();
    this.complemento3FormGroup.reset();
    this.complemento4FormGroup.reset();

    this.fileComplemento = [];
    this.fileComplemento[0] = [];
    this.fileComplemento[1] = [];
    this.fileComplemento[2] = [];
    this.fileComplemento[3] = [];

    this.fileComplemento = Array(4).fill([]);
    this.imagenComplemento = Array(4).fill(undefined);
    //this.imagenComplementoCargada = Array(4).fill(false);
    this.cont = Array(4).fill(0);

    this.activarCargaComplemento1 = false;
    this.activarCargaComplemento2 = false;
    this.activarCargaComplemento3 = false;
    this.activarCargaComplemento4 = false;
  }

}


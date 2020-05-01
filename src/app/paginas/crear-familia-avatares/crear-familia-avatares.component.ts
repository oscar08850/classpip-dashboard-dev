import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FamiliaAvatares } from 'src/app/clases';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

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
  imagenComplementoCargada = false;

  imagenComplemento: string[];

  cont;
  familiaAvatares: FamiliaAvatares;
  activarCargaComplemento1 = false;
  activarCargaComplemento2 = false;
  activarCargaComplemento3 = false;
  activarCargaComplemento4 = false;

  muestraSeleccionarComplemento1 = false;
  muestraSeleccionarComplemento2 = false;
  muestraSeleccionarComplemento3 = false;
  muestraSeleccionarComplemento4 = false;

  alturaSilueta;

  imagen;
  file;

  dobleancho: string;
  doblealto: string;
  ancho: string;
  alto: string;


  constructor(
    private formBuilder: FormBuilder,
    private peticionesAPI: PeticionesAPIService,
    private sesion: SesionService,
    private location: Location
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
    this.cont = Array(4).fill(0);
  }



  GuardarNombreFamilia() {
    if (this.nombreFormGroup.value.nombreFamilia === '') {
      this.botonAvanzarAPaso2Desactivado = true;
    } else {
      this.botonAvanzarAPaso2Desactivado = false;
      this.familiaAvatares = new FamiliaAvatares (this.nombreFormGroup.value.nombreFamilia);
      this.familiaAvatares.Complemento1 = [];
      this.familiaAvatares.Complemento2 = [];
      this.familiaAvatares.Complemento3 = [];
      this.familiaAvatares.Complemento4 = [];
    }
  }


   GuardarNombreComplemento1() {
    if (this.complemento1FormGroup.value.nombreComplemento1 === '') {
      this.activarCargaComplemento1 = false;
    } else {
      this.activarCargaComplemento1 = true;
      this.muestraSeleccionarComplemento1 = true;
      this.familiaAvatares.NombreComplemento1 =  this.complemento1FormGroup.value.nombreComplemento1;
    }
  }


  GuardarNombreComplemento2() {
    if (this.complemento2FormGroup.value.nombreComplemento2 === '') {
      this.activarCargaComplemento2 = false;
    } else {
      this.activarCargaComplemento2 = true;
      this.muestraSeleccionarComplemento2 = true;
      this.familiaAvatares.NombreComplemento2 =  this.complemento2FormGroup.value.nombreComplemento2;
    }
  }

  GuardarNombreComplemento3() {
    if (this.complemento3FormGroup.value.nombreComplemento3 === '') {
      this.activarCargaComplemento3 = false;
    } else {
      this.activarCargaComplemento3 = true;
      this.muestraSeleccionarComplemento3 = true;
      this.familiaAvatares.NombreComplemento3 =  this.complemento3FormGroup.value.nombreComplemento3;
    }
  }


  GuardarNombreComplemento4() {
    if (this.complemento4FormGroup.value.nombreComplemento4 === '') {
      this.activarCargaComplemento4 = false;
    } else {
      this.activarCargaComplemento4 = true;
      this.muestraSeleccionarComplemento4 = true;
      this.familiaAvatares.NombreComplemento4 =  this.complemento4FormGroup.value.nombreComplemento4;
    }
  }

  ActivarInputSilueta() {
    document.getElementById('inputSilueta').click();
  }

  CargarImagenSilueta($event) {
    this.fileSilueta = $event.target.files[0];
    this.familiaAvatares.Silueta = this.fileSilueta.name;

    const reader = new FileReader();
    reader.readAsDataURL(this.fileSilueta);
    reader.onload = () => {

      // lo que se hace a continuación es para obtener el ancho y alto de la imagen
      // de la silueta
      const imagen = new Image();
      imagen.src = reader.result.toString();
      imagen.onload = () => {
        // Necesitaré el ancho y alto y el doble del ancho y del alto
        this.ancho = imagen.width.toString();
        this.alto = imagen.height.toString();
        this.dobleancho = (imagen.width * 2).toString();
        this.doblealto = (imagen.height * 2).toString();
      };
      this.imagenSiluetaCargada = true;
      this.imagenSilueta = reader.result.toString();

    };
}

  // Cuando se carge la imagen se activará esta función para hacer que esa imagen
  // se muestre en tamaño grande
  PonDoble(img) {
        img.setAttribute ('width', this.dobleancho);
        img.setAttribute ('height', this.doblealto );
  }


  CargarImagenComplemento(n, $event) {
    if (this.cont[n] === 5) {
      Swal.fire('No puedes elegir más de 5 opciones para un complemento', ' ', 'error');

    } else {
      this.file = $event.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = () => {
        this.imagenComplemento[n] = (reader.result.toString());
        this.MostrarComplemento(n);
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
      this.imagen.style.top = '0px';
      this.imagen.style.position = 'absolute';
      this.imagen.style.zIndex = '1';
      // al coloar la imagen sobre la silueta debe verse con tamaño doble
      this.imagen.width = this.dobleancho;
      this.imagen.height = this.doblealto;

      // Coloco el nombre del fichero en el que está la imagen
      this.imagen.src =  this.imagenComplemento[n];

      // Coloco la imagen sobre la silueta
      if (n === 0) {
        document.getElementById('muestracomplemento1').appendChild(this.imagen);
        this.muestraSeleccionarComplemento1 = false;
      } else if (n === 1) {
        document.getElementById('muestracomplemento2').appendChild(this.imagen);
        this.muestraSeleccionarComplemento2 = false;
      } else if (n === 2) {
        document.getElementById('muestracomplemento3').appendChild(this.imagen);
        this.muestraSeleccionarComplemento3 = false;
      } else {
        document.getElementById('muestracomplemento4').appendChild(this.imagen);
        this.muestraSeleccionarComplemento4 = false;
      }

  }

  AceptarComplemento(n) {
    // Guardamos el fichero y movemos la imagen de la silueta al grupo de opciones

    this.fileComplemento[n].push (this.file);
    this.imagen.style.left = '0px';
    this.imagen.style.top = '0px';
    this.imagen.style.position = 'relative';

    // La mostraremos con tamaño normal
    this.imagen.width = this.ancho;
    this.imagen.height = this.alto;
    if (n === 0) {
      document.getElementById('complementos1').appendChild(this.imagen);
      this.familiaAvatares.Complemento1.push (this.file.name);
      this.muestraSeleccionarComplemento1 = true;
   } else if (n === 1) {
      document.getElementById('complementos2').appendChild(this.imagen);
      this.familiaAvatares.Complemento2.push (this.file.name);
      this.muestraSeleccionarComplemento2 = true;
   } else if (n === 2) {
      document.getElementById('complementos3').appendChild(this.imagen);

      this.familiaAvatares.Complemento3.push (this.file.name);
      this.muestraSeleccionarComplemento3 = true;
   } else {
      document.getElementById('complementos4').appendChild(this.imagen);
      this.familiaAvatares.Complemento4.push (this.file.name);
      this.muestraSeleccionarComplemento4 = true;
   }

  }

  RechazarComplemento(n) {
    // Eliminamos la imagen de la silueta

    if (n === 0) {
     document.getElementById('muestracomplemento1').removeChild(this.imagen);
     this.muestraSeleccionarComplemento1 = true;
    } else if (n === 1) {
      document.getElementById('muestracomplemento2').removeChild(this.imagen);
      this.muestraSeleccionarComplemento2 = true;
    } else if (n === 2) {
      document.getElementById('muestracomplemento3').removeChild(this.imagen);
      this.muestraSeleccionarComplemento3 = true;
    } else {
      document.getElementById('muestracomplemento4').removeChild(this.imagen);
      this.muestraSeleccionarComplemento4 = true;
    }


  }

  RegistrarFamiliaAvatares() {
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
        .subscribe (() => {
          Swal.fire('La familia de avatares se ha registrado correctamente');
          this.location.back();
        });
      }
    });
  }

  Reiniciar() {
    this.nombreFormGroup.reset();
    this.complemento1FormGroup.reset();
    this.complemento2FormGroup.reset();
    this.complemento3FormGroup.reset();
    this.complemento4FormGroup.reset();


    this.fileComplemento = Array(4).fill([]);
    this.imagenComplemento = Array(4).fill(undefined);
    this.cont = Array(4).fill(0);

    this.imagenSiluetaCargada = false;
    this.imagenSilueta = undefined;

    this.imagenComplementoCargada = false;

    this.activarCargaComplemento1 = false;
    this.activarCargaComplemento2 = false;
    this.activarCargaComplemento3 = false;
    this.activarCargaComplemento4 = false;

    this.muestraSeleccionarComplemento1 = false;
    this.muestraSeleccionarComplemento2 = false;
    this.muestraSeleccionarComplemento3 = false;
    this.muestraSeleccionarComplemento4 = false;
  }

}


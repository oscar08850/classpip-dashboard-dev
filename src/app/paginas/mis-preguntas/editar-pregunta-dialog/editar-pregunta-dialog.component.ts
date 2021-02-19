import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { CalculosService, PeticionesAPIService } from 'src/app/servicios';
import { Location } from '@angular/common';
import { Coleccion, Pregunta } from 'src/app/clases';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import * as URL from '../../../URLs/urls';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-editar-pregunta-dialog',
  templateUrl: './editar-pregunta-dialog.component.html',
  styleUrls: ['./editar-pregunta-dialog.component.scss']
})
export class EditarPreguntaDialogComponent implements OnInit {

  preguntaEditar: Pregunta;
  profesorId: number;
  // Para comprovar valor de cada uno de los campos
  myForm: FormGroup;

  // PROPIEDADES PREGUNTA
  titulo: string;
  pregunta: string;
  tematica: string;
  respuestaCorrecta: string;
  respuestaIncorrecta1: string;
  respuestaIncorrecta2: string;
  respuestaIncorrecta3: string;
  feedbackCorrecto: string;
  feedbackIncorrecto: string;
  imagenPregunta: string;

  // variables necesarias para la carga de la foto
  filePregunta: File;
  nombreFicheroImagen: string;
  imagenAnterior: string;


  // PARA SABER SI TENEMOS TODOS LOS CAMPOS RELLENADOS
  hayCambios: Boolean = false;

  constructor(public dialog: MatDialog,
              private router: Router,
              public location: Location,
              private peticionesAPI: PeticionesAPIService,
              private calculos: CalculosService,
              private _formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<EditarPreguntaDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.preguntaEditar = this.data.pregunta;

    this.profesorId = this.data.profesorId;
    console.log ("ya tengo la pregunta");
    console.log (this.preguntaEditar);
    if (this.preguntaEditar.Imagen !== undefined) {
      this.imagenPregunta = URL.ImagenesPregunta + this.preguntaEditar.Imagen ;
      // Sino la imagenColeccion será undefined para que no nos pinte la foto de otro equipo préviamente seleccionado
    } else {
      this.imagenPregunta = undefined;
    }

  }
  ActivarGuardar () {
    this.hayCambios = true;
  }



  // COGEMOS LOS VALORES NUEVOS Y LOS GUARDAMOS EN LA PREGUNTA
  GuardarPregunta() {
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.ModificaPregunta(this.preguntaEditar, this.profesorId, this.preguntaEditar.id )
    .subscribe((res) => {
      if (res != null) {
        // si hemos cambiado la imagen de la pregunta, borramos la anterior y guardamos la nueva
        if (this.filePregunta) {
          const imagenPreguntaData: FormData = new FormData();
          imagenPreguntaData.append(this.filePregunta.name, this.filePregunta);
          this.peticionesAPI.PonImagenPregunta(imagenPreguntaData)
          .subscribe();
          this.peticionesAPI.BorrarImagenPregunta (this.imagenAnterior)
          .subscribe();

        }
        Swal.fire('Pregunta editada correctamente', 'Bien hecho', 'success');
        this.hayCambios = false;
        this.goBack();
      } else {
        Swal.fire('Alerta', 'Hay algun problema con el servidor intentelo mas tarde', 'error');
      }
    });

  }

  // VUELTA A MIS PREGUNTAS
  VolverMisPreguntas() {
    this.location.back();
  }

  // CUANDO PULSAMOS EN EL BOTON CANCELAR
  goBack() {
    if (this.hayCambios) {
      Swal.fire({
        title: '¿Seguro que quieres salir?',
        text: 'Hay cambios que no has salvado',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, estoy seguro'
      }).then((result) => {
        if (result.value) {
          this.dialogRef.close();
        }
      });

    } else {
    this.dialogRef.close();
    }
  }

  EliminarPareja(i) {
    this.preguntaEditar.Emparejamientos.splice (i, 1);
    this.hayCambios = true;
  }
  NuevoEmparejamiento () {
    this.preguntaEditar.Emparejamientos.push ({
      l: '',
      r: ''
    });
    this.hayCambios = true;
  }


  ActivarInputImagen() {
    document.getElementById('inputImagenPregunta').click();
  }

  // Evento que nos permite cargar una imagen y guardarla en el atributo imagenPregunta
  CargarImagenPregunta($event) {
    this.filePregunta = $event.target.files[0];

    this.calculos.NombreFicheroImagenPreguntaRepetido ( this.filePregunta.name)
    .subscribe (repetido => {
      if (repetido) {
        Swal.fire('Error', 'Ya hay un fichero en la base de datos con el mismo nombre', 'error');
      } else {
        this.imagenAnterior =  this.preguntaEditar.Imagen;
        this.preguntaEditar.Imagen = this.filePregunta.name;
        this.hayCambios = true;
        const imagenPreguntaData: FormData = new FormData();
        imagenPreguntaData.append(this.filePregunta.name, this.filePregunta);
        this.peticionesAPI.PonImagenPregunta(imagenPreguntaData)
        .subscribe(res => {
          this.imagenPregunta = URL.ImagenesPregunta +  this.preguntaEditar.Imagen ;
        });
        console.log ('voy a borrar la imagen anterior');
        console.log (this.imagenAnterior);
        this.peticionesAPI.BorrarImagenPregunta (this.imagenAnterior)
        .subscribe();

      }
    });
  }

}

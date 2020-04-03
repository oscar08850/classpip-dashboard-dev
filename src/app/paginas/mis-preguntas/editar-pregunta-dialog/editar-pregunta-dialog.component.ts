import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { PeticionesAPIService } from 'src/app/servicios';
import { Location } from '@angular/common';
import { Pregunta } from 'src/app/clases';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-pregunta-dialog',
  templateUrl: './editar-pregunta-dialog.component.html',
  styleUrls: ['./editar-pregunta-dialog.component.scss']
})
export class EditarPreguntaDialogComponent implements OnInit {

  preguntaEditar: Pregunta;
  profesorId: number;
  //Para comprovar valor de cada uno de los campos
  myForm: FormGroup;

  //PROPIEDADES PREGUNTA
  titulo: string;
  pregunta: string;
  tematica: string;
  respuestaCorrecta: string;
  respuestaIncorrecta1: string;
  respuestaIncorrecta2: string;
  respuestaIncorrecta3: string;
  feedbackCorrecto: string;
  feedbackIncorrecto: string;

  //PARA SABER SI TENEMOS TODOS LOS CAMPOS RELLENADOS
  isDisabled: Boolean = true;

  constructor(public dialog: MatDialog,
              private router: Router,
              public location: Location,
              private peticionesAPI: PeticionesAPIService,
              private _formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<EditarPreguntaDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.myForm = this._formBuilder.group({
      titulo: ['', Validators.required],
      pregunta: ['', Validators.required],
      tematica: ['', Validators.required],
      respuestaCorrecta: ['', Validators.required],
      respuestaIncorrecta1: ['', Validators.required],
      respuestaIncorrecta2: ['', Validators.required],
      respuestaIncorrecta3: ['', Validators.required],
      feedbackCorrecto: ['', Validators.required],
      feedbackIncorrecto: ['', Validators.required]
    })

    this.preguntaEditar = this.data.pregunta;
    this.profesorId = this.data.profesorId;

    this.titulo = this.data.pregunta.Titulo;
    this.pregunta = this.data.pregunta.Pregunta;
    this.tematica = this.data.pregunta.Tematica;
    this.respuestaCorrecta = this.data.pregunta.RespuestaCorrecta;
    this.respuestaIncorrecta1 = this.data.pregunta.RespuestaIncorrecta1;
    this.respuestaIncorrecta2 = this.data.pregunta.RespuestaIncorrecta2;
    this.respuestaIncorrecta3 = this.data.pregunta.RespuestaIncorrecta3;
    this.feedbackCorrecto = this.data.pregunta.FeedbackCorrecto;
    this.feedbackIncorrecto = this.data.pregunta.FeedbackIncorrecto;
  }

  //COGEMOS LOS VALORES NUEVOS Y LOS GUARDAMOS EN LA PREGUNTA
  GuardarPregunta() {
    this.peticionesAPI.ModificaPregunta(new Pregunta (this.titulo, this.pregunta, this.tematica, this.respuestaCorrecta, this.respuestaIncorrecta1, this.respuestaIncorrecta2, this.respuestaIncorrecta3, this.feedbackCorrecto, this.feedbackIncorrecto), this.profesorId, this.preguntaEditar.id )
    .subscribe((res) => {
      if(res != null) {
        Swal.fire('Pregunta editada correctamente', 'Bien hecho', 'success');
        this.goBack();
      }else{
        Swal.fire('Alerta', 'Hay algun problema con el servidor intenelo mas tarde', 'error');
      }
    })

  }

  // VUELTA A MIS PREGUNTAS
  VolverMisPreguntas() {
    this.location.back();
  }

  //CUANDO PULSAMOS EN EL BOTON CANCELAR
  goBack() {
    this.dialogRef.close();
  }

  // MIRO SI TODOS LOS PARAMETROS DE PREGUNTA ESTAN RELLENADOS
  Disabled() {
    if (this.myForm.value.titulo === '' || this.myForm.value.pregunta === '' || this.myForm.value.tematica === '' ||
    this.myForm.value.respuestaCorrecta === '' || this.myForm.value.respuestaIncorrecta1 === '' ||
     this.myForm.value.respuestaIncorrecta2 === '' || this.myForm.value.respuestaIncorrecta3 === '' ||
      this.myForm.value.feedbackCorrecto === '' || this.myForm.value.feedbackIncorrecto === '') {
      // Si alguno de los valores es igual a nada, entonces estará desactivado
      this.isDisabled = true;
    } else {
      // Si ambos son diferentes a nulo, estará activado.
      this.isDisabled = false;
    }
  }
}

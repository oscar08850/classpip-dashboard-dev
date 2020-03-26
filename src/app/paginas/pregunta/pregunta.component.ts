import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.component.html',
  styleUrls: ['./pregunta.component.scss']
})
export class PreguntaComponent implements OnInit {

  myForm: FormGroup;

  myForm2: FormGroup;

  // Para saber si el botón está habilitado o no
  // tslint:disable-next-line:ban-types
  isDisabled: Boolean = true;
  isDisabled2: Boolean = true;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog, 
              public sesion: SesionService,
              public peticionesAPI: PeticionesAPIService,
              private _formBuilder: FormBuilder) { }

  ngOnInit() {

    this.myForm = this._formBuilder.group({
      tituloPregunta: ['', Validators.required],
      preguntaPregunta: ['', Validators.required],
      tematicaPregunta: ['', Validators.required]
    })

    this.myForm2 = this._formBuilder.group({
      respuestaCorrecta: ['', Validators.required],
      respuestaIncorrecta1: ['', Validators.required],
      respuestaIncorrecta2: ['', Validators.required],
      respuestaIncorrecta3: ['', Validators.required],
      feedbackCorrecto: ['', Validators.required],
      feedbackIncorrecto: ['', Validators.required]
    })
  }

  // MIRO SI HAY ALGO SIMULTÁNEAMENTE EN EL TITULO, PREGUNTA Y LA TEMATICA
  Disabled() {
    if (this.myForm.value.tituloPregunta === '' || this.myForm.value.preguntaPregunta === '' || this.myForm.value.tematicaPregunta === '') {
      // Si alguno de los valores es igual a nada, entonces estará desactivado
      this.isDisabled = true;
    } else {
      // Si ambos son diferentes a nulo, estará activado.
      this.isDisabled = false;
    }
  }

  // MIRO SI HAY ALGO SIMULTÁNEAMENTE EN EL TODAS LAS RESPUESTAS Y EN LOS FEEDBACKS
  Disabled2() {
    if (this.myForm2.value.respuestaCorrecta === '' || this.myForm2.value.respuestaIncorrecta1 === '' ||
     this.myForm2.value.respuestaIncorrecta2 === '' || this.myForm2.value.respuestaIncorrecta3 === '' ||
      this.myForm2.value.feedbackCorrecto === '' || this.myForm2.value.feedbackIncorrecto === '') {
      // Si alguno de los valores es igual a nada, entonces estará desactivado
      this.isDisabled2 = true;
    } else {
      // Si ambos son diferentes a nulo, estará activado.
      this.isDisabled2 = false;
    }
  }
}

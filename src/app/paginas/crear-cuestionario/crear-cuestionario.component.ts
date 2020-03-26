import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';

@Component({
  selector: 'app-crear-cuestionario',
  templateUrl: './crear-cuestionario.component.html',
  styleUrls: ['./crear-cuestionario.component.scss']
})
export class CrearCuestionarioComponent implements OnInit {

  // Para el stepper
  myForm: FormGroup;

  // Para saber si el botón está habilitado o no
  // tslint:disable-next-line:ban-types
  isDisabled: Boolean = true;
    
  constructor(private route: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog,
              public sesion: SesionService,
              public peticionesAPI: PeticionesAPIService,
              private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.myForm = this._formBuilder.group({
      tituloCuestionario: ['', Validators.required],
      descripcionCuestionario: ['', Validators.required]
    })
  }

  // MIRO SI HAY ALGO SIMULTÁNEAMENTE EN EL NOMBRE Y LA DESCRIPCIÓN
  Disabled() {
    if (this.myForm.value.tituloCuestionario === '' || this.myForm.value.descripcionCuestionario === '') {
      // Si alguno de los valores es igual a nada, entonces estará desactivado
      this.isDisabled = true;
    } else {
      // Si ambos son diferentes a nulo, estará activado.
      this.isDisabled = false;
    }
  }
}

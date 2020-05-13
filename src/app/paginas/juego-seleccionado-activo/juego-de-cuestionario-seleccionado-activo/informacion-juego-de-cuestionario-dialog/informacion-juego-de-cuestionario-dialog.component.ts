import { Component, OnInit, Inject } from '@angular/core';
import { Juego } from 'src/app/clases';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PeticionesAPIService, SesionService } from 'src/app/servicios';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JuegoDeCuestionario } from 'src/app/clases/JuegoDeCuestionario';

@Component({
  selector: 'app-informacion-juego-de-cuestionario-dialog',
  templateUrl: './informacion-juego-de-cuestionario-dialog.component.html',
  styleUrls: ['./informacion-juego-de-cuestionario-dialog.component.scss']
})
export class InformacionJuegoDeCuestionarioDialogComponent implements OnInit {

  juegoSeleccionado: Juego;

  // Propiedades del juego
  NombreJuego: string;
  PuntuacionCorrecta: number;
  PuntuacionIncorrecta: number;
  Presentacion: string;
  JuegoActivo: boolean;
  JuegoTerminado: boolean;
  cuestionarioId: number;
  profesorId: number;

  // Se usará para el selector de modo de asignación de ganadores
  Presentaciones: string[] = ['Mismo orden para todos',
  'Preguntas desordenadas',
  'Preguntas y respuestas desordenadas'
  ];

  TituloCuestionario: string;

  myForm: FormGroup;

  // PARA SABER SI TENEMOS TODOS LOS CAMPOS RELLENADOS
  // tslint:disable-next-line:ban-types
  isDisabled: Boolean = true;

  constructor(public dialog: MatDialog,
              private router: Router,
              public location: Location,
              private peticionesAPI: PeticionesAPIService,
              public sesion: SesionService,
              // tslint:disable-next-line:variable-name
              private _formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<InformacionJuegoDeCuestionarioDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.NombreJuego = this.juegoSeleccionado.NombreJuego;
    this.PuntuacionCorrecta = this.juegoSeleccionado.PuntuacionCorrecta;
    this.PuntuacionIncorrecta = this.juegoSeleccionado.PuntuacionIncorrecta;
    this.Presentacion = this.juegoSeleccionado.Presentacion;
    this.JuegoActivo = this.juegoSeleccionado.JuegoActivo;
    this.JuegoTerminado = this.juegoSeleccionado.JuegoTerminado;
    this.cuestionarioId = this.juegoSeleccionado.cuestionarioId;
    this.profesorId = this.juegoSeleccionado.profesorId;

    this.myForm = this._formBuilder.group({
      NombreJuego: ['', Validators.required],
      PuntuacionCorrecta: ['', Validators.required],
      PuntuacionIncorrecta: ['', Validators.required],
      Presentacion: ['', Validators.required],
    });

    this.peticionesAPI.DameCuestionario(this.cuestionarioId)
    .subscribe(res => {
      this.TituloCuestionario = res.Titulo;
    });
  }

  // COGEMOS LOS VALORES NUEVOS Y LOS GUARDAMOS EN EL JUEGO
  GuardarCambios() {
    this.peticionesAPI.ModificaJuegoDeCuestionario(new JuegoDeCuestionario(this.NombreJuego, this.PuntuacionCorrecta,
      this.PuntuacionIncorrecta, this.Presentacion, this.JuegoActivo, this.JuegoTerminado,
      this.profesorId, this.juegoSeleccionado.grupoId, this.cuestionarioId), this.juegoSeleccionado.id, this.juegoSeleccionado.grupoId)
      .subscribe(() => {
        this.location.back();
      });

  }

  // Cuando pulsamos en el boton volver
  goBack() {
    this.dialogRef.close();
  }

  Disabled() {
    // tslint:disable-next-line:max-line-length
    if (this.myForm.value.NombreJuego === '' || this.myForm.value.PuntuacionCorrecta === '' || this.myForm.value.PuntuacionIncorrecta === '' ||
    // tslint:disable-next-line:max-line-length
    (this.myForm.value.Presentacion === this.juegoSeleccionado.Presentacion && this.myForm.value.NombreJuego === this.juegoSeleccionado.NombreJuego &&
      // tslint:disable-next-line:max-line-length
      this.myForm.value.PuntuacionCorrecta.toString() === this.juegoSeleccionado.PuntuacionCorrecta.toString() && this.myForm.value.PuntuacionIncorrecta.toString() === this.juegoSeleccionado.PuntuacionIncorrecta.toString())) {
      // Si alguno de los valores es igual a nada, entonces estará desactivado
      this.isDisabled = true;
    } else {
      // Si ambos son diferentes a nulo, estará activado.
      this.isDisabled = false;
    }
  }
}

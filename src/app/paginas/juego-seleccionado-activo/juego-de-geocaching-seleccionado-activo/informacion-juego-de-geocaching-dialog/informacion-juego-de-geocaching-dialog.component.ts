import { Component, OnInit, Inject } from '@angular/core';
import { Juego } from 'src/app/clases';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Location, NumberSymbol } from '@angular/common';
import { PeticionesAPIService, SesionService } from 'src/app/servicios';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JuegoDeGeocaching } from 'src/app/clases/JuegoDeGeocaching';

@Component({
  selector: 'app-informacion-juego-de-geocaching-dialog',
  templateUrl: './informacion-juego-de-geocaching-dialog.component.html',
  styleUrls: ['./informacion-juego-de-geocaching-dialog.component.scss']
})
export class InformacionJuegoDeGeocachingDialogComponent implements OnInit {

  juegoSeleccionado: Juego;

  // Propiedades del juego
  NombreJuego: string;
  PuntuacionCorrecta: number;
  PuntuacionIncorrecta: number;
  PuntuacionCorrectaBonus: number;
  PuntuacionIncorrectaBonus: number;
  PreguntasBasicas: number[];
  PreguntasBonus: number[];
  Presentacion: string;
  JuegoActivo: boolean;
  JuegoTerminado: boolean;
  idescenario: number;
  profesorId: number;
  Tipo: string;


  TituloEscenario: string;

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
              public dialogRef: MatDialogRef<InformacionJuegoDeGeocachingDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.NombreJuego = this.juegoSeleccionado.NombreJuego;
    this.PuntuacionCorrecta = this.juegoSeleccionado.PuntuacionCorrecta;
    this.PuntuacionIncorrecta = this.juegoSeleccionado.PuntuacionIncorrecta;
    this.PuntuacionCorrectaBonus = this.juegoSeleccionado.PuntuacionCorrectaBonus;
    this.PuntuacionIncorrectaBonus = this.juegoSeleccionado.PuntuacionIncorrectaBonus;
    this.PreguntasBasicas = this.juegoSeleccionado.PreguntasBasicas;
    this.PreguntasBonus = this.juegoSeleccionado.PreguntasBonus;
    this.JuegoActivo = this.juegoSeleccionado.JuegoActivo;
    this.JuegoTerminado = this.juegoSeleccionado.JuegoTerminado;
    this.idescenario = this.juegoSeleccionado.idescenario;
    this.profesorId = this.juegoSeleccionado.profesorId;
    this.Tipo = this.juegoSeleccionado.Tipo;

    this.myForm = this._formBuilder.group({
      NombreJuego: ['', Validators.required],
      PuntuacionCorrecta: ['', Validators.required],
      PuntuacionIncorrecta: ['', Validators.required],
      PuntuacionCorrectaBonus: ['', Validators.required],
      PuntuacionIncorrectaBonus: ['', Validators.required],
    });

    this.peticionesAPI.DameEscenario(this.idescenario)
    .subscribe(res => {
      this.TituloEscenario = res.Mapa;
    });
  }

  // COGEMOS LOS VALORES NUEVOS Y LOS GUARDAMOS EN EL JUEGO
  GuardarCambios() {
    this.peticionesAPI.ModificaJuegoDeGeocaching(new JuegoDeGeocaching(this.NombreJuego, this.Tipo, this.PuntuacionCorrecta,
      // tslint:disable-next-line:max-line-length
      this.PuntuacionIncorrecta, this.PuntuacionCorrectaBonus, this.PuntuacionIncorrectaBonus, this.PreguntasBasicas, this.PreguntasBonus, this.JuegoActivo, this.JuegoTerminado,
      this.profesorId, this.juegoSeleccionado.grupoId, this.idescenario), this.juegoSeleccionado.id, this.juegoSeleccionado.grupoId)
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
    (this.myForm.value.NombreJuego === this.juegoSeleccionado.NombreJuego &&
      // tslint:disable-next-line:max-line-length
      this.myForm.value.PuntuacionCorrecta.toString() === this.juegoSeleccionado.PuntuacionCorrecta.toString() && this.myForm.value.PuntuacionIncorrecta.toString() === this.juegoSeleccionado.PuntuacionIncorrecta.toString() &&
      // tslint:disable-next-line:max-line-length
      this.myForm.value.PuntuacionIncorrecta.toString() === this.juegoSeleccionado.PuntuacionIncorrecta.toString() && this.myForm.value.PuntuacionCorrectaBonus.toString() === this.juegoSeleccionado.PuntuacionCorrectaBonus.toString() &&
      // tslint:disable-next-line:max-line-length
      this.myForm.value.PuntuacionIncorrectaBonus.toString() === this.juegoSeleccionado.PuntuacionIncorrectaBonus.toString())) {
      // Si alguno de los valores es igual a nada, entonces estará desactivado
      this.isDisabled = true;
    } else {
      // Si ambos son diferentes a nulo, estará activado.
      this.isDisabled = false;
    }
  }
}

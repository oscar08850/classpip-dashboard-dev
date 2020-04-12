import { Component, OnInit, Inject } from '@angular/core';
import { Juego } from 'src/app/clases';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PeticionesAPIService, SesionService } from 'src/app/servicios';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-informacion-juego-de-cuestionario-dialog',
  templateUrl: './informacion-juego-de-cuestionario-dialog.component.html',
  styleUrls: ['./informacion-juego-de-cuestionario-dialog.component.scss']
})
export class InformacionJuegoDeCuestionarioDialogComponent implements OnInit {

  juegoSeleccionado: Juego;

  //Propiedades del juego
  NombreJuego: string;
  PuntuacionCorrecta: number;
  PuntuacionIncorrecta: number;
  Presentacion: string;
  JuegoActivo: boolean;
  JuegoTerminado: boolean;
  cuestionarioId: number;
  profesorId: number;

  TituloCuestionario: string;

  constructor(public dialog: MatDialog,
              private router: Router,
              public location: Location,
              private peticionesAPI: PeticionesAPIService,
              public sesion: SesionService,
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

    this.peticionesAPI.DameCuestionario(this.cuestionarioId)
    .subscribe(res =>{
      this.TituloCuestionario = res.Titulo;
    });
  }

  //Cuando pulsamos en el boton volver
  goBack() {
    this.dialogRef.close();
  }

}

import { Component, OnInit } from '@angular/core';
import {SesionService, PeticionesAPIService, CalculosService, ComServerService} from '../../../../servicios/index';
import { AlumnoJuegoDeAvatar, Alumno, JuegoDeAvatar } from 'src/app/clases';
import { Location } from '@angular/common';

import * as URL from '../../../../URLs/urls';
import { Howl } from 'howler';


@Component({
  selector: 'app-mostrar-avatar-alumno',
  templateUrl: './mostrar-avatar-alumno.component.html',
  styleUrls: ['./mostrar-avatar-alumno.component.scss']
})
export class MostrarAvatarAlumnoComponent implements OnInit {

  alumno: Alumno;
  inscripcionAlumnoJuegoAvatar: AlumnoJuegoDeAvatar;
  imagenSilueta: string;
  complemento1: string;
  complemento2: string;
  complemento3: string;
  complemento4: string;
  anchogrande: '450px';
  altogrande: '486px';
  interval;
  interval1;
  imagenesAvatares = URL.ImagenesAvatares;
  juegoSeleccionado: JuegoDeAvatar;
  inscripcionesAlumnosJuegoDeAvatar: AlumnoJuegoDeAvatar[];
  alumnosJuegoDeAvatar: Alumno[];
  listaAvatares: any[] = [];


  constructor(
    private location: Location,
    private calculos: CalculosService,
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    private comServer: ComServerService ) { }

  ngOnInit() {

    this.alumno = this.sesion.DameAlumno();
    this.inscripcionAlumnoJuegoAvatar = this.sesion.DameAlumnoJuegoAvatar();
    console.log ('ya tengo inscripcion');
    console.log (this.inscripcionAlumnoJuegoAvatar);
    this.juegoSeleccionado = this.sesion.DameJuegoAvatar();

  }

  goBack() {
    this.location.back();
  }

}

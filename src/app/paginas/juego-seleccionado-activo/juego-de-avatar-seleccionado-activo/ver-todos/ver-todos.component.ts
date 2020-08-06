import { Component, OnInit } from '@angular/core';
import {SesionService, PeticionesAPIService, CalculosService, ComServerService} from '../../../../servicios/index';
import { AlumnoJuegoDeAvatar, Alumno, JuegoDeAvatar } from 'src/app/clases';
import { Location } from '@angular/common';

import * as URL from '../../../../URLs/urls';
import { Howl } from 'howler';

@Component({
  selector: 'app-ver-todos',
  templateUrl: './ver-todos.component.html',
  styleUrls: ['./ver-todos.component.scss']
})
export class VerTodosComponent implements OnInit {

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
    const sound = new Howl({
      src: ['/assets/got-it-done.mp3']
    });
    this.juegoSeleccionado = this.sesion.DameJuegoAvatar();
    this.PrepararAvatares();
    this.comServer.EsperoModificacionAvatar()
    .subscribe((res: any) => {
        console.log ('llega modificación');
        console.log (res.inscripcion);
        console.log (this.inscripcionAlumnoJuegoAvatar);
        const pos = this.listaAvatares.findIndex (elem => elem.insc.id === res.inscripcion.id);
        // esta operación la tengo que hacer con un dalay (0 segundos bastan)
        // es de nuevo el caso de un getElementById de un elemento protegido con *ngIf
        // El delay hace que se invierta el ciclo y se ejecute el *ngIf antes
        // que el getElement
        this.interval1 = setInterval(() => {
          this.listaAvatares[pos].insc = res.inscripcion;
          console.log (this.listaAvatares);
          sound.play();
          // hago que la imagen parpadee 5 segundos
          const imagen = document.getElementById(pos.toString());
          imagen.setAttribute("class", "parpadea");
          this.interval = setInterval(() => {
            imagen.removeAttribute("class");
            clearInterval(this.interval);
          }, 5000);
          clearInterval(this.interval1);
        }, 0);
    });

  }

  PrepararAvatares() {
    // traemos las inscripciones y también los alumnos, porque quiero mostrar
    // el nombre de cada alumno

    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeAvatar(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.inscripcionesAlumnosJuegoDeAvatar = inscripciones;
      // traemos los alumnos (donde está el nombre)
      this.peticionesAPI.DameAlumnosJuegoDeAvatar(this.juegoSeleccionado.id)
      .subscribe(alumnos => {
        this.alumnosJuegoDeAvatar = alumnos;
        // Ahora preparo la lista con la inscripción y el nombre de los alumnos
        this.inscripcionesAlumnosJuegoDeAvatar.forEach (inscripcion => {
          // busco el alumno al que corresponde la inscripción
          const alumno = this.alumnosJuegoDeAvatar.filter (a => a.id === inscripcion.alumnoId )[0];

          const avatar = {
            insc: inscripcion,
            al: alumno,
            voz: URL.AudiosAvatares + inscripcion.Voz
          };
          this.listaAvatares.push (avatar);
        });
      });

    });
  }


  goBack() {
    this.location.back();
  }


  Play(voz){
    const audio = new Audio();
    audio.src = voz;
    audio.load();
    audio.play();
  }

}

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
  notavoz: HTMLAudioElement;

  sound;

  // tslint:disable-next-line:max-line-length
   options = ['$100', '$10', '$25', '$250', '$30', '$1000', '$1', '$200', '$45', '$500', '$5', '$20', 'Lose', '$1000000', 'Lose', '$350', '$5', '$99'];
  //options = ['uno', 'dos', 'tres', 'cuatro'];


  startAngle = 0;
  // arc = Math.PI / (this.options.length / 2);
  arc;
  spinTimeout = null;

  spinArcStart = 10;
  spinTime = 0;
  spinTimeTotal = 0;
  spinAngleStart;

  ctx;


constructor(
    private location: Location,
    private calculos: CalculosService,
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    private comServer: ComServerService ) { }

ngOnInit() {

    this.sound = new Howl({
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
          this.sound.play();
          // hago que la imagen parpadee 5 segundos
          const imagen = document.getElementById(pos.toString());
          imagen.setAttribute('class', 'parpadea');
          this.interval = setInterval(() => {
            imagen.removeAttribute('class');
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
        this.arc = Math.PI / (this.listaAvatares.length / 2);
        this.drawRouletteWheel();
      });

    });
  }


goBack() {
    this.location.back();
  }


Play(voz) {
  this.notavoz = new Audio();
  this.notavoz.src = voz;
  this.notavoz.load();
  this.notavoz.play();
}

Stop() {
  if(!this.notavoz.paused){
    this.notavoz.pause();
  }
}

  byte2Hex(n) {
    const nybHexString = '0123456789ABCDEF';
    // tslint:disable-next-line:no-bitwise
    return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
  }

 RGB2Color(r, g, b) {
    return '#' + this.byte2Hex(r) + this.byte2Hex(g) + this.byte2Hex(b);
  }

  getColor(item, maxitem) {
    const phase = 0;
    const center = 128;
    const width = 127;
    const frequency = Math.PI * 2 / maxitem;

    const red   = Math.sin(frequency * item + 2 + phase) * width + center;
    const green = Math.sin(frequency * item + 0 + phase) * width + center;
    const blue  = Math.sin(frequency * item + 4 + phase) * width + center;

    return this.RGB2Color(red, green, blue);
  }

drawRouletteWheel() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvas.getContext) {
      const outsideRadius = 200;
      const textRadius = 160;
      const insideRadius = 125;

      this.ctx = canvas.getContext('2d');
      this.ctx.clearRect(0, 0, 500, 500);

      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 2;

      this.ctx.font = 'bold 12px Helvetica, Arial';

      for (let i = 0; i < this.listaAvatares.length; i++) {
        const angle = this.startAngle + i * this.arc;
        // ctx.fillStyle = colors[i];
        // this.ctx.fillStyle = this.getColor(i, this.options.length);
        this.ctx.fillStyle = this.getColor(i, this.listaAvatares.length);

        this.ctx.beginPath();
        this.ctx.arc(250, 250, outsideRadius, angle, angle + this.arc, false);
        this.ctx.arc(250, 250, insideRadius, angle + this.arc, angle, true);
        this.ctx.stroke();
        this.ctx.fill();

        this.ctx.save();
        this.ctx.shadowOffsetX = -1;
        this.ctx.shadowOffsetY = -1;
        this.ctx.shadowBlur    = 0;
        this.ctx.shadowColor   = 'rgb(220,220,220)';
        this.ctx.fillStyle = 'black';
        this.ctx.translate(250 + Math.cos(angle + this.arc / 2) * textRadius,
                      250 + Math.sin(angle + this.arc / 2) * textRadius);
        this.ctx.rotate(angle + this.arc / 2 + Math.PI / 2);
        // const text = this.options[i];
        const text = this.listaAvatares[i].al.Nombre;
        this.ctx.fillText(text, -this.ctx.measureText(text).width / 2, 0);
        this.ctx.restore();
      }

      // Arrow
      this.ctx.fillStyle = 'black';
      this.ctx.beginPath();
      this.ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
      this.ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
      this.ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
      this.ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
      this.ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
      this.ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
      this.ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
      this.ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
      this.ctx.fill();
    }
  }

spin() {
    this.spinAngleStart = Math.random() * 10 + 10;
    this.spinTime = 0;
    this.spinTimeTotal = Math.random() * 3 + 4 * 1000;
    console.log ('voy a rotar');
    this.rotateWheel();
  }

rotateWheel() {
    console.log ('estoy');
    this.spinTime += 30;
    if (this.spinTime >= this.spinTimeTotal) {
      this.stopRotateWheel();
      return;
    }
    const spinAngle = this.spinAngleStart - this.easeOut(this.spinTime, 0, this.spinAngleStart, this.spinTimeTotal);
    this.startAngle += (spinAngle * Math.PI / 180);
    console.log ('estoy 2');
    this.drawRouletteWheel();
    console.log ('estoy 3');
    const that = this;
    // tslint:disable-next-line:space-before-function-paren
    // tslint:disable-next-line:only-arrow-functions
    this.spinTimeout =  setTimeout(function() {
          that.rotateWheel();
      }, 30);
    //this.spinTimeout = setTimeout('this.rotateWheel()', 30);
    console.log ('estoy 4');
  }

stopRotateWheel() {
    clearTimeout(this.spinTimeout);
    const degrees = this.startAngle * 180 / Math.PI + 90;
    const arcd = this.arc * 180 / Math.PI;
    const index = Math.floor((360 - degrees % 360) / arcd);
    this.ctx.save();
    this.ctx.font = 'bold 30px Helvetica, Arial';
    const text = this.listaAvatares[index].al.Nombre;
    this.ctx.fillText(text, 250 - this.ctx.measureText(text).width / 2, 250 + 10);
    // const text = this.options[index];
    // Resalto el avatar del elegido
    this.sound.play();
    this.interval1 = setInterval(() => {

      //this.sound.play();
      // hago que la imagen parpadee 5 segundos
      const imagen = document.getElementById(index.toString());
      imagen.setAttribute('class', 'parpadea');
      this.interval = setInterval(() => {
        imagen.removeAttribute('class');
        clearInterval(this.interval);
      }, 5000);
      clearInterval(this.interval1);
    }, 0);

    this.ctx.restore();
  }

easeOut(t, b, c, d) {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
  }

}

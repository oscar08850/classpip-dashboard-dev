import { Component, OnInit } from '@angular/core';
import {SesionService} from '../../../servicios';
import {JuegoDeEvaluacion} from '../../../clases/JuegoDeEvaluacion';

@Component({
  selector: 'app-juego-de-evaluacion-activo',
  templateUrl: './juego-de-evaluacion-activo.component.html',
  styleUrls: ['./juego-de-evaluacion-activo.component.scss']
})
export class JuegoDeEvaluacionActivoComponent implements OnInit {

  juego: JuegoDeEvaluacion;

  constructor(
    private sesion: SesionService
  ) { }

  ngOnInit() {
    this.juego = this.sesion.DameJuego() as unknown as JuegoDeEvaluacion;
    console.log(this.juego);
  }

}

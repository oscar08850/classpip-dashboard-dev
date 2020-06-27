import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SesionService } from 'src/app/servicios';
import { Juego } from 'src/app/clases';

@Component({
  selector: 'app-juego-seleccionado-preparado',
  templateUrl: './juego-seleccionado-preparado.component.html',
  styleUrls: ['./juego-seleccionado-preparado.component.scss']
})
export class JuegoSeleccionadoPreparadoComponent implements OnInit {

  juegoSeleccionado: Juego;

  constructor(  private sesion: SesionService,
                public location: Location ) { }


  ngOnInit() {
    console.log ('saco el juego');
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log (this.juegoSeleccionado);
  }

  goBack() {
    this.location.back();
  }

}

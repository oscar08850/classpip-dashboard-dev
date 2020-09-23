import { Component, OnInit } from '@angular/core';

// Clases
import { Juego } from '../../clases/index';
import { Location } from '@angular/common';

// Services
import { SesionService } from '../../servicios/index';

@Component({
  selector: 'app-juego-seleccionado-inactivo',
  templateUrl: './juego-seleccionado-inactivo.component.html',
  styleUrls: ['./juego-seleccionado-inactivo.component.scss']
})
export class JuegoSeleccionadoInactivoComponent implements OnInit {

  juegoSeleccionado: Juego;

  constructor(  private sesion: SesionService,
                public location: Location ) { }


  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
  }

  goBack() {
    this.location.back();
  }
}

import { Component, OnInit } from '@angular/core';

// Clases
import { Juego } from '../../clases/index';
import { Location } from '@angular/common';

// Services
import { SesionService } from '../../servicios/index';

@Component({
  selector: 'app-juego-seleccionado-activo',
  templateUrl: './juego-seleccionado-activo.component.html',
  styleUrls: ['./juego-seleccionado-activo.component.scss']
})
export class JuegoSeleccionadoActivoComponent implements OnInit {

  juegoSeleccionado: Juego;

  constructor( private sesion: SesionService,
               private location: Location ) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log ('juego seleccionado: ' + this.juegoSeleccionado.Tipo);

  }

  goBack() {
    this.location.back();
  }
}

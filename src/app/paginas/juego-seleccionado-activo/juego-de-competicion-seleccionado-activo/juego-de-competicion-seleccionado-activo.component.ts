import { Component, OnInit } from '@angular/core';

// Clases
import { Juego } from '../../../clases/index';

// Servicio
import {SesionService} from '../../../servicios/index';

@Component({
  selector: 'app-juego-de-competicion-seleccionado-activo',
  templateUrl: './juego-de-competicion-seleccionado-activo.component.html',
  styleUrls: ['./juego-de-competicion-seleccionado-activo.component.scss']
})
export class JuegoDeCompeticionSeleccionadoActivoComponent implements OnInit {

  juegoSeleccionado: Juego;

  constructor(private sesion: SesionService) {}

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log(this.juegoSeleccionado);
  }

}

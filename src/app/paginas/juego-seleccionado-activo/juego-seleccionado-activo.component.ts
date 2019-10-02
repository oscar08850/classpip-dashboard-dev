import { Component, OnInit } from '@angular/core';

// Clases
import { Juego } from '../../clases/index';

// Services
import { SesionService } from '../../servicios/index';

@Component({
  selector: 'app-juego-seleccionado-activo',
  templateUrl: './juego-seleccionado-activo.component.html',
  styleUrls: ['./juego-seleccionado-activo.component.scss']
})
export class JuegoSeleccionadoActivoComponent implements OnInit {

  juegoSeleccionado: Juego;

  constructor( private sesion: SesionService ) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log ('juego seleccionado: ' + this.juegoSeleccionado.Tipo);

  }


}

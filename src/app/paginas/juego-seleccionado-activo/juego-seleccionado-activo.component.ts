import { Component, OnInit } from '@angular/core';

// Clases
import { Juego } from '../../clases/index';

// Services
import { JuegoService } from '../../servicios/index';

@Component({
  selector: 'app-juego-seleccionado-activo',
  templateUrl: './juego-seleccionado-activo.component.html',
  styleUrls: ['./juego-seleccionado-activo.component.scss']
})
export class JuegoSeleccionadoActivoComponent implements OnInit {

  juegoSeleccionado: Juego;

  constructor( private juegoService: JuegoService ) { }

  ngOnInit() {
    this.juegoSeleccionado = this.juegoService.RecibirJuegoDelServicio();

  }


}

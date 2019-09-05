import { Component, OnInit } from '@angular/core';

// Clases
import { Juego } from '../../clases/index';

// Services
import { JuegoService } from '../../servicios/index';

@Component({
  selector: 'app-juego-seleccionado-inactivo',
  templateUrl: './juego-seleccionado-inactivo.component.html',
  styleUrls: ['./juego-seleccionado-inactivo.component.scss']
})
export class JuegoSeleccionadoInactivoComponent implements OnInit {

  juegoSeleccionado: Juego;

  constructor( private juegoService: JuegoService ) { }


  ngOnInit() {
    this.juegoSeleccionado = this.juegoService.RecibirJuegoDelServicio();
  }

}

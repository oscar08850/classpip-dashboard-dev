import { Component, OnInit } from '@angular/core';

// Clases
import {Juego} from '../../../clases/index';

// Servicio
import { SesionService, PeticionesAPIService, CalculosService } from '../../../servicios/index';

@Component({
  selector: 'app-juego-de-competicion-formula-uno-seleccionado-activo',
  templateUrl: './juego-de-competicion-formula-uno-seleccionado-activo.component.html',
  styleUrls: ['./juego-de-competicion-formula-uno-seleccionado-activo.component.scss']
})
export class JuegoDeCompeticionFormulaUnoSeleccionadoActivoComponent implements OnInit {
  // Juego De Competicion Formula Uno seleccionado
  juegoSeleccionado: Juego;

  constructor(public sesion: SesionService) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log(this.juegoSeleccionado);
  }

}

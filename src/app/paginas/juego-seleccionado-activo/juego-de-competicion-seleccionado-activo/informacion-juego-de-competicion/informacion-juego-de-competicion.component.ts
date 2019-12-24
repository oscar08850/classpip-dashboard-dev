import { Component, OnInit } from '@angular/core';

// Clases
import { Juego } from '../../../../clases/index';

// Servicio
import { SesionService } from '../../../../servicios/index';

@Component({
  selector: 'app-informacion-juego-de-competicion',
  templateUrl: './informacion-juego-de-competicion.component.html',
  styleUrls: ['./informacion-juego-de-competicion.component.scss']
})
export class InformacionJuegoDeCompeticionComponent implements OnInit {

  // Juego De CompeticionLiga seleccionado
  juegoSeleccionado: Juego;

  constructor(public sesion: SesionService) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log(this.juegoSeleccionado);

    // if (this.juegoSeleccionado.Modo === 'Individual') {
    //   this.AlumnosDelJuego();
    // }
  }

}

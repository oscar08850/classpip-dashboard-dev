import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

// Clases
import { Juego, Jornada } from '../../../../clases/index';

// Servicio
import { SesionService , CalculosService, PeticionesAPIService } from '../../../../servicios/index';

@Component({
  selector: 'app-informacion-juego-de-competicion',
  templateUrl: './informacion-juego-de-competicion.component.html',
  styleUrls: ['./informacion-juego-de-competicion.component.scss']
})
export class InformacionJuegoDeCompeticionComponent implements OnInit {

  // Juego De CompeticionLiga seleccionado
  juegoSeleccionado: Juego;
  numeroTotalJornadas: number;
  jornadasEstablecidas: Jornada[];
  jornadas: any[];

  constructor( public sesion: SesionService,
               public location: Location,
               public calculos: CalculosService,
               public peticionesAPI: PeticionesAPIService) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.numeroTotalJornadas = this.juegoSeleccionado.NumeroTotalJornadas;
    console.log(this.juegoSeleccionado);
    console.log(this.numeroTotalJornadas);
    this.jornadas = this.jornadasDelJuego();
  }

  jornadasDelJuego(): any {
    console.log('Vamos a por las jornadas');
    this.peticionesAPI.DameJornadasDeCompeticionLiga(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.jornadasEstablecidas = inscripciones;
      console.log('Las jornadas establecidas son: ');
      console.log(this.jornadasEstablecidas);
    });
    console.log('Las jornadas son: ' + this.jornadas);
    return this.jornadasEstablecidas;
  }

  goBack() {
    this.location.back();
  }

}

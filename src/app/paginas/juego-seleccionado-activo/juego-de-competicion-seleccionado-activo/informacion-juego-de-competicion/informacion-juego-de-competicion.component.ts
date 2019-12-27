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
    this.jornadasEstablecidas = this.jornadasEstablecidasDelJuego();
    console.log(this.jornadasEstablecidas);
    console.log(this.jornadasEstablecidas);
    console.log(this.jornadasEstablecidas);
    console.log('Vamos a por las jornadas establecidas y no establecidas');
    this.jornadas = this.DameListasJornadas (this.juegoSeleccionado, this.jornadasEstablecidas);
    console.log('Las jornadas son: ' + this.jornadas);
    return this.jornadas;
  }

  jornadasEstablecidasDelJuego(): Jornada[] {
    console.log('Vamos a por las jornadas establecidas');
    this.peticionesAPI.DameJornadasDeCompeticionLiga(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.jornadasEstablecidas = inscripciones;
      console.log('Las jornadas establecidas son: ');
      console.log(this.jornadasEstablecidas);
    });
    return this.jornadasEstablecidas;
  }

  public DameListasJornadas(juegoDeCompeticion: Juego, listaJornadasDelJuegoEstablecidas: Jornada[]): any {
    const listaJornadasDelJuego: any[] = listaJornadasDelJuegoEstablecidas;
    // Lista que  que contiene el numero de la jornada que queda por establecer
    const listaJornadasDelJuegoNoEstablecidas: number[] = [];
    const numeroJornadasEstablecidas: number = listaJornadasDelJuegoEstablecidas.length;
    let i = numeroJornadasEstablecidas;
    console.log('Hay ' + numeroJornadasEstablecidas + ' jornadas establecidas');
    while (i <= juegoDeCompeticion.NumeroTotalJornadas) {
            listaJornadasDelJuegoNoEstablecidas.push(i + 1);
            i ++;
        }
    console.log('Las Jornadas que quedan por establecer son: ');
    console.log(listaJornadasDelJuegoNoEstablecidas);

    listaJornadasDelJuego.push(listaJornadasDelJuegoNoEstablecidas);
    console.log('La lista de Jornadas queda: ');
    console.log(listaJornadasDelJuego);

    const resultado = { establecidas: listaJornadasDelJuegoEstablecidas,
                            noEstablecidas: listaJornadasDelJuegoNoEstablecidas,
                            todas: listaJornadasDelJuego};
    return listaJornadasDelJuego;
  }




  goBack() {
    this.location.back();
  }

}

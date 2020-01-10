import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

// Clases
import { Juego, Jornada, TablaJornadas, EnfrentamientoLiga } from '../../../../clases/index';

// Servicio
import { SesionService , CalculosService, PeticionesAPIService } from '../../../../servicios/index';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-informacion-juego-de-competicion',
  templateUrl: './informacion-juego-de-competicion.component.html',
  styleUrls: ['./informacion-juego-de-competicion.component.scss']
})
export class InformacionJuegoDeCompeticionComponent implements OnInit {

  // Juego De CompeticionLiga seleccionado
  juegoSeleccionado: Juego;
  numeroTotalJornadas: number;
  jornadasDelJuego: Jornada[];
  JornadasCompeticion: TablaJornadas[] = [];
  EnfrentamientosJornadaSeleccionada: EnfrentamientoLiga[] = [];

  constructor( public sesion: SesionService,
               public location: Location,
               public calculos: CalculosService,
               public peticionesAPI: PeticionesAPIService) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.numeroTotalJornadas = this.juegoSeleccionado.NumeroTotalJornadas;
    console.log('Juego seleccionado: ');
    console.log(this.juegoSeleccionado);
    console.log('Número total de jornadas: ');
    console.log(this.numeroTotalJornadas);
    const datos = this.sesion.DameDatosJornadas();
    this.JornadasCompeticion = datos.JornadasCompeticion;
    console.log('Jornadas Competicion: ');
    // Teniendo la tabla de Jornadas puedo sacar los enfrentamientos de cada jornada accediendo a la api
    console.log(this.JornadasCompeticion);
  }

  ObtenerEnfrentamientosDeCadaJornada(jornadaSeleccionada: TablaJornadas) {
    console.log('HTendré que pasr el id de la jornada para obtener los enfrentamientos y crear una tabla para cada uno');
    console.log('El id de la jornada seleccionada es: ' + jornadaSeleccionada.id);
    // tslint:disable-next-line:prefer-for-of
    this.peticionesAPI.DameEnfrentamientosDeJornadaLiga(jornadaSeleccionada.id)
    .subscribe(enfrentamientos => {
      this.EnfrentamientosJornadaSeleccionada = enfrentamientos;
      console.log('Los enfrentamientos de esta jornada son: ');
      console.log(this.EnfrentamientosJornadaSeleccionada);
    });
    // for (let i = 0; i < this.JornadasCompeticion.length; i ++) {
    //   this.peticionesAPI.DameEnfrentamientosDeJornadaLiga(this.JornadasCompeticion[i].id)
    //   .subscribe(enfrentamiento => {
    //     this.EnfrentamientoJornada = enfrentamiento;
    //     console.log('Las jornadas son: ');
    //     console.log(this.EnfrentamientoJornada);
    //   });
    // }
  }

  goBack() {
    this.location.back();
  }

}

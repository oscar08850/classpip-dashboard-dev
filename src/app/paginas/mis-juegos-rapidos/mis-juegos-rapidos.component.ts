import { Component, OnInit } from '@angular/core';
import {SesionService, PeticionesAPIService, CalculosService} from '../../servicios/index';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Profesor} from '../../clases/index';

import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-mis-juegos-rapidos',
  templateUrl: './mis-juegos-rapidos.component.html',
  styleUrls: ['./mis-juegos-rapidos.component.scss']
})
export class MisJuegosRapidosComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'tipo'];
  dataSource;
  juegosRapidos: any[] = [];

  profesor: Profesor;
  tabla: any [] = [];


  constructor(  private peticionesAPI: PeticionesAPIService,
                private sesion: SesionService,
                private calculos: CalculosService,
                private router: Router) { }

  ngOnInit() {

    this.profesor = this.sesion.DameProfesor();
    this.ObtenJuegosRapidos();

  }

  ObtenJuegosRapidos() {
    this.calculos.DameJuegosRapidos(this.profesor.id)
    .subscribe(juegos => {
      this.juegosRapidos = juegos;
      console.log ('ya tengo los juegos rapidos');
      console.log (this.juegosRapidos);
      this.dataSource = new MatTableDataSource(this.juegosRapidos);
    });
  }
  MostrarJuegoRapido(juego) {
    console.log ('Juego rapido');
    console.log (juego);
    this.sesion.TomaJuego(juego);
    if (juego.Tipo === 'Juego De Encuesta Rápida') {
      this.router.navigate(['/inicio/' + this.profesor.id + '/misJuegosRapidos/juegoDeEncuestaRapida']);
    } else  if (juego.Tipo === 'Juego De Votación Rápida') {
      this.router.navigate(['/inicio/' + this.profesor.id + '/misJuegosRapidos/juegoDeVotacionRapida']);
    } else  if (juego.Tipo === 'Juego De Cuestionario Rápido') {
      this.router.navigate(['/inicio/' + this.profesor.id + '/misJuegosRapidos/juegoDeCuestionarioRapido']);
    } else  if (juego.Tipo === 'Juego De Coger Turno Rápido') {
      this.router.navigate(['/inicio/' + this.profesor.id + '/misJuegosRapidos/juegoDeCogerTurnoRapido']);
    }
  }



}

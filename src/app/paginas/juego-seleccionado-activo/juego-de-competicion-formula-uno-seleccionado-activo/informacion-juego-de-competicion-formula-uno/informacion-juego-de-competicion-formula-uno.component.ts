import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

// Clases
import { Juego, Jornada, TablaJornadas, TablaAlumnoJuegoDeCompeticion,
         TablaEquipoJuegoDeCompeticion} from '../../../../clases/index';

// Servicio
import { SesionService , CalculosService, PeticionesAPIService } from '../../../../servicios/index';
import { forEach } from '@angular/router/src/utils/collection';
import { MatTableDataSource } from '@angular/material';
import { identifierModuleUrl } from '@angular/compiler';

@Component({
  selector: 'app-informacion-juego-de-competicion-formula-uno',
  templateUrl: './informacion-juego-de-competicion-formula-uno.component.html',
  styleUrls: ['./informacion-juego-de-competicion-formula-uno.component.scss']
})
export class InformacionJuegoDeCompeticionFormulaUnoComponent implements OnInit {

  // Juego De CompeticionLiga seleccionado
  juegoSeleccionado: Juego;
  numeroTotalJornadas: number;
  jornadasDelJuego: Jornada[];
  JornadasCompeticion: TablaJornadas[] = [];

  listaAlumnosClasificacion: TablaAlumnoJuegoDeCompeticion[] = [];
  listaEquiposClasificacion: TablaEquipoJuegoDeCompeticion[] = [];


  constructor(public sesion: SesionService,
              public location: Location,
              public calculos: CalculosService,
              public peticionesAPI: PeticionesAPIService) { }

  ngOnInit() {
    console.log('Estoy en ngOnInit de información formula uno');
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.numeroTotalJornadas = this.juegoSeleccionado.NumeroTotalJornadas;
    console.log('Juego seleccionado: ');
    console.log(this.juegoSeleccionado);
    console.log('Número total de jornadas: ');
    console.log(this.numeroTotalJornadas);
    const datos = this.sesion.DameDatosJornadas();
    this.JornadasCompeticion = datos.JornadasCompeticion;
    this.listaAlumnosClasificacion = this.sesion.DameTablaAlumnoJuegoDeCompeticion();
    console.log('tabla alumnos clasificación:');
    console.log(this.listaAlumnosClasificacion);
    this.listaEquiposClasificacion = this.sesion.DameTablaEquipoJuegoDeCompeticion();
    console.log('tabla equipos clasificación:');
    console.log(this.listaEquiposClasificacion);
  }

  ObtenerEnfrentamientosDeCadaJornada(jornadaSeleccionada: TablaJornadas) {
    console.log('El id de la jornada seleccionada es: ' + jornadaSeleccionada.id);
    const datos = this.calculos.ClasificaciónJornada(this.juegoSeleccionado, this.listaAlumnosClasificacion,
                                                     this.listaEquiposClasificacion, jornadaSeleccionada.GanadoresFormulaUno);
    console.log(datos.participante);
    console.log(datos.puntos);
      // this.ConstruirTablaEnfrentamientos();
  }

}

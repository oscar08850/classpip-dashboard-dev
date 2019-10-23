import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

import { Alumno, Equipo, Juego, Punto, Nivel, AlumnoJuegoDePuntos, EquipoJuegoDePuntos,
  TablaAlumnoJuegoDePuntos, HistorialPuntosAlumno, TablaEquipoJuegoDePuntos, HistorialPuntosEquipo } from '../../../../clases/index';

// Services
import { SesionService, CalculosService, PeticionesAPIService } from '../../../../servicios/index';
import {MatTableDataSource} from '@angular/material/table';

import { Location } from '@angular/common';

@Component({
  selector: 'app-asignar-puntos',
  templateUrl: './asignar-puntos.component.html',
  styleUrls: ['./asignar-puntos.component.scss']
})
export class AsignarPuntosComponent implements OnInit {
  puntoSeleccionadoId: number;
  tiposPuntosDelJuego: Punto[];
  /* Estructura necesaria para determinar que filas son las que se han seleccionado */
  selection = new SelectionModel<any>(true, []);
  // Muestra la posición del alumno, el nombre y los apellidos del alumno, los puntos y el nivel
  rankingJuegoDePuntos: TablaAlumnoJuegoDePuntos[] = [];

  // tslint:disable-next-line:no-inferrable-types
  valorPunto: number = 1;

  fechaAsignacionPunto: Date;
  fechaString: string;

  juegoSeleccionado: Juego;

  // Recupera la informacion del juego, los alumnos o los equipos, los puntos y los niveles del juego
  alumnosDelJuego: Alumno[];
  equiposDelJuego: Equipo[];
  nivelesDelJuego: Nivel[];
  aaaa: AlumnoJuegoDePuntos[];

  // Recoge la inscripción de un alumno en el juego ordenada por puntos
  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDePuntos[];
  listaEquiposOrdenadaPorPuntos: EquipoJuegoDePuntos[];


  rankingEquiposJuegoDePunto: TablaEquipoJuegoDePuntos[] = [];

  displayedColumnsAlumno: string[] = ['select', 'posicion', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'puntos', 'nivel'];
  // selection = new SelectionModel<TablaAlumnoJuegoDePuntos>(true, []);

  displayedColumnsEquipos: string[] = ['select', 'posicion', 'nombreEquipo', 'miembros', 'puntos', 'nivel'];
  selectionEquipos = new SelectionModel<TablaEquipoJuegoDePuntos>(true, []);

  seleccionados: boolean[];
  seleccionadosEquipos: boolean[];




  alumnosEquipo: Alumno[];

  // tslint:disable-next-line:ban-types
  isDisabled: Boolean = true;

  dataSource: any;
  botonTablaDesactivado = true;

  constructor(
               private sesion: SesionService,
               private peticionesAPI: PeticionesAPIService,
               public location: Location,
               private calculos: CalculosService ) { }

  ngOnInit() {
    const datos = this.sesion.DameDatosParaAsignarPuntos();
    console.log ('Datos ' + datos);
    this.tiposPuntosDelJuego = datos.tiposPuntosDelJuego;
    this.nivelesDelJuego = datos.nivelesDelJuego;
    this.alumnosDelJuego = datos.alumnosDelJuego;
    this.listaAlumnosOrdenadaPorPuntos = datos.listaAlumnosOrdenadaPorPuntos;
    this.rankingJuegoDePuntos = datos.rankingJuegoDePuntos;
    this.equiposDelJuego = datos.equiposDelJuego;
    console.log ('equipos ' + this.equiposDelJuego);

    this.listaEquiposOrdenadaPorPuntos = datos.listaEquiposOrdenadaPorPuntos;
    console.log ('lista ' + this.listaEquiposOrdenadaPorPuntos);

    // Por alguna razon tengo que recoger esto aparte, porque no lo devuelve
    // bien cuando le pido todos los datos.
    this.rankingEquiposJuegoDePunto = this.sesion.DameRankingEquipos();
    console.log ('renkign ' + this.rankingEquiposJuegoDePunto);



    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log ('juego seleccionado ' + this.juegoSeleccionado.Modo);

    // Ordena la lista de niveles por si el profesor no los creó de forma ascendente
     // tslint:disable-next-line:only-arrow-functions
    this.nivelesDelJuego = this.nivelesDelJuego.sort(function(obj1, obj2) {
      return obj1.PuntosAlcanzar - obj2.PuntosAlcanzar;
    });

    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.dataSource = new MatTableDataSource (this.rankingJuegoDePuntos);
    } else {
      this.dataSource = new MatTableDataSource (this.rankingEquiposJuegoDePunto);
    }
  }
  /* Para averiguar si todas las filas están seleccionadas */
  IsAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /* Cuando se clica en el checkbox de cabecera hay que ver si todos los
    * checkbox estan acivados, en cuyo caso se desactivan todos, o si hay alguno
    * desactivado, en cuyo caso se activan todos */

  MasterToggle() {
    if (this.IsAllSelected()) {
      this.selection.clear(); // Desactivamos todos
    } else {
      // activamos todos
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }
  /* Esta función decide si el boton debe estar activo (si hay al menos
  una fila seleccionada) o si debe estar desactivado (si no hay ninguna fila seleccionada) */
  /* En este caso para que esté activo también debe haber seleccionado el tipo de punto a asignar */
  ActualizarBotonTabla() {
    if ((this.selection.selected.length === 0) || (this.puntoSeleccionadoId === undefined)) {
      this.botonTablaDesactivado = true;
    } else {
      this.botonTablaDesactivado = false;
    }
  }


  AlumnosDelEquipo(equipo: Equipo) {

    this.peticionesAPI.DameAlumnosEquipo (equipo.id)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.alumnosEquipo = res;
        console.log(res);
      } else {
        console.log('No hay alumnos en este equipo');
        // Informar al usuario
        this.alumnosEquipo = undefined;
      }
    });
  }

  AsignarPuntos() {

    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('el juego es individual');
      this.AsignarPuntosAlumnos();
    } else {
      console.log('El juego es en equipo');
      this.AsignarPuntosEquipos();
    }

  }


  AsignarPuntosAlumnos() {
    // Tengo que hacer un recorrido diferente del dataSource porque necesito saber el
    // valor de i

    for ( let i = 0; i < this.dataSource.data.length; i++) {
      console.log ('Vuelta ' + i);


      // Buscamos los alumnos que hemos seleccionado
      if (this.selection.isSelected(this.dataSource.data[i]))  {
        console.log ('Voy a asignar ' + this.valorPunto + 'a ' + this.rankingJuegoDePuntos[i].nombre);
        this.calculos.AsignarPuntosAlumno ( this.listaAlumnosOrdenadaPorPuntos[i],
                                            this.nivelesDelJuego, this.valorPunto,
                                            this.puntoSeleccionadoId);
        this.rankingJuegoDePuntos[i].puntos = this.rankingJuegoDePuntos[i].puntos + this.valorPunto;
        if (this.listaAlumnosOrdenadaPorPuntos[i].nivelId !== undefined) {
          const nivel = this.nivelesDelJuego.filter (n => n.id === this.listaAlumnosOrdenadaPorPuntos[i].nivelId)[0];
          this.rankingJuegoDePuntos[i].nivel = nivel.Nombre;
        }

      }
      console.log ('ahora ' + this.rankingJuegoDePuntos[i]);
    }
    // tslint:disable-next-line:only-arrow-functions
    this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2) {
      return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
    });
    // tslint:disable-next-line:only-arrow-functions
    this.rankingJuegoDePuntos = this.rankingJuegoDePuntos.sort(function(obj1, obj2) {
      return obj2.puntos - obj1.puntos;
    });
    for (let i = 0; i < this.rankingJuegoDePuntos.length; i++) {
      this.rankingJuegoDePuntos[i].posicion = i + 1;
    }
    this.dataSource = new MatTableDataSource (this.rankingJuegoDePuntos);
    this.selection.clear();
    this.botonTablaDesactivado = true;
  }

  AsignarPuntosEquipos() {

    for (let i = 0; i < this.dataSource.data.length; i++) {

      // Buscamos los alumnos que hemos seleccionado
      if (this.selection.isSelected(this.dataSource.data[i]))  {
        this.calculos.AsignarPuntosEquipo (
                    this.listaEquiposOrdenadaPorPuntos[i],
                    this.nivelesDelJuego,
                    this.valorPunto,
                    this.puntoSeleccionadoId);

        this.rankingEquiposJuegoDePunto[i].puntos = this.rankingEquiposJuegoDePunto[i].puntos + this.valorPunto;
        if (this.listaEquiposOrdenadaPorPuntos[i].nivelId !== undefined) {
            const nivel = this.nivelesDelJuego.filter (n => n.id === this.listaEquiposOrdenadaPorPuntos[i].nivelId)[0];
            this.rankingEquiposJuegoDePunto[i].nivel = nivel.Nombre;
        }
      }
    }
    // tslint:disable-next-line:only-arrow-functions
    this.listaEquiposOrdenadaPorPuntos = this.listaEquiposOrdenadaPorPuntos.sort(function(obj1, obj2) {
      return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;
    });
    // tslint:disable-next-line:only-arrow-functions
    this.rankingEquiposJuegoDePunto = this.rankingEquiposJuegoDePunto.sort(function(obj1, obj2) {
      return obj2.puntos - obj1.puntos;
    });
    for ( let i = 0; i < this.rankingEquiposJuegoDePunto.length; i++) {
      this.rankingEquiposJuegoDePunto[i].posicion = i + 1;
    }
    this.dataSource = new MatTableDataSource (this.rankingEquiposJuegoDePunto);
    this.selection.clear();
    this.botonTablaDesactivado = true;
  }

  BotonDesactivado() {

    console.log('voy a ver si hay algo en los inputs');
    if (this.puntoSeleccionadoId !== undefined && this.valorPunto !== undefined && this.valorPunto !== null) {
      console.log('hay algo, disabled');
      this.isDisabled = false;
    } else {
      console.log('no hay nada');
      this.isDisabled = true;
    }
  }
   /* Esta función decide si el boton debe estar activo (si hay al menos
  una fila seleccionada) o si debe estar desactivado (si no hay ninguna fila seleccionada) */
  ActualizarBoton() {
    if (this.selection.selected.length === 0) {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
  }

  Disabled() {
    if (this.juegoSeleccionado.Modo === 'Individual') {

      if (this.seleccionados.filter(res => res === true)[0] !== undefined) {
        console.log('Hay alguno seleccionado');
        this.BotonDesactivado();
      } else {
        console.log('No hay alguno seleccionado');
        this.isDisabled = true;
      }

    } else {

      if (this.seleccionadosEquipos.filter(res => res === true)[0] !== undefined) {
        console.log('Hay alguno seleccionado');
        this.BotonDesactivado();
      } else {
        console.log('No hay alguno seleccionado');
        this.isDisabled = true;
      }
    }
  }

  goBack() {
    this.location.back();
  }

}

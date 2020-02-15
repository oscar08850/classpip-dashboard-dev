import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

import { Alumno, Equipo, Juego, Punto, Nivel, AlumnoJuegoDePuntos, EquipoJuegoDePuntos,
  TablaAlumnoJuegoDePuntos, HistorialPuntosAlumno, TablaEquipoJuegoDePuntos, HistorialPuntosEquipo } from '../../../../clases/index';

// Services
import { SesionService, CalculosService, PeticionesAPIService } from '../../../../servicios/index';
import {MatTableDataSource} from '@angular/material/table';

import { Location } from '@angular/common';
import swal from 'sweetalert';


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
  alumnoElegido: TablaAlumnoJuegoDePuntos;

  // tslint:disable-next-line:no-inferrable-types
  valorPunto: number = 1;

  fechaAsignacionPunto: Date;
  fechaString: string;

  juegoSeleccionado: Juego;

  // Recupera la informacion del juego, los alumnos o los equipos, los puntos y los niveles del juego
  alumnosDelJuego: Alumno[];
  equiposDelJuego: Equipo[];
  nivelesDelJuego: Nivel[];
  // Recoge la inscripción de un alumno en el juego ordenada por puntos
  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDePuntos[];
  listaEquiposOrdenadaPorPuntos: EquipoJuegoDePuntos[];

  rankingEquiposJuegoDePunto: TablaEquipoJuegoDePuntos[] = [];
  equipoElegido: TablaEquipoJuegoDePuntos;

  displayedColumnsAlumno: string[] = ['select', 'posicion', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'puntos', 'nivel'];
  // selection = new SelectionModel<TablaAlumnoJuegoDePuntos>(true, []);

  displayedColumnsEquipos: string[] = ['select', 'posicion', 'nombreEquipo', 'miembros', 'puntos', 'nivel'];
  selectionEquipos = new SelectionModel<TablaEquipoJuegoDePuntos>(true, []);

  seleccionados: boolean[];
  seleccionadosEquipos: boolean[];




  alumnosEquipo: Alumno[];

  // tslint:disable-next-line:ban-types
  isDisabled: Boolean = true;
  // tslint:disable-next-line:ban-types
  isDisabledAleatorio: Boolean = true;

  dataSource: any;
  botonAsignarDesactivado = true;
  botonAsignarAleatorioDesactivado = true;


  puntoAleatorioId: number;

  constructor(
               private sesion: SesionService,
               private peticionesAPI: PeticionesAPIService,
               public location: Location,
               private calculos: CalculosService ) { }

  ngOnInit() {
    const datos = this.sesion.DameDatosParaAsignarPuntos();
    console.log ('Datos ' + datos);
    this.puntoAleatorioId = datos.tiposPuntosDelJuego.filter (p => p.Nombre === 'Aleatorio')[0].id;

    // Elimino el tipo de punto aleatorio para que no salga entre los asignables
    // porque ese tipo de punto se asigna al pulsar el boton de asignación aleatoria
    this.tiposPuntosDelJuego = datos.tiposPuntosDelJuego.filter (p => p.Nombre !== 'Aleatorio');
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
  ActualizarBoton() {
    if ((this.selection.selected.length === 0) || (this.puntoSeleccionadoId === undefined)) {
      this.botonAsignarDesactivado = true;
    } else {
      this.botonAsignarDesactivado = false;
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
    console.log('Estoy en AsignarPuntos');

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
        console.log ('Niveles ' + this.nivelesDelJuego);

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
    this.botonAsignarDesactivado = true;
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
    this.botonAsignarDesactivado = true;
  }


  AsignarAleatorio() {
    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log ('Entramos');
      const numeroAlumnos = this.alumnosDelJuego.length;
      const elegido = Math.floor(Math.random() * numeroAlumnos);
      this.alumnoElegido = this.rankingJuegoDePuntos[elegido];

      this.calculos.AsignarPuntosAlumno ( this.listaAlumnosOrdenadaPorPuntos[elegido],
                                            this.nivelesDelJuego, this.valorPunto,
                                            this.puntoAleatorioId);
      this.rankingJuegoDePuntos[elegido].puntos = this.rankingJuegoDePuntos[elegido].puntos + this.valorPunto;
      if (this.listaAlumnosOrdenadaPorPuntos[elegido].nivelId !== undefined) {
          const nivel = this.nivelesDelJuego.filter (n => n.id === this.listaAlumnosOrdenadaPorPuntos[elegido].nivelId)[0];
          this.rankingJuegoDePuntos[elegido].nivel = nivel.Nombre;
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
      swal(this.alumnoElegido.nombre + ' ' + this.alumnoElegido.primerApellido, 'Enhorabuena', 'success');
    } else {
      const numeroEquipos = this.equiposDelJuego.length;
      const elegido = Math.floor(Math.random() * numeroEquipos);
      this.equipoElegido = this.rankingEquiposJuegoDePunto[elegido];

      this.calculos.AsignarPuntosEquipo ( this.listaEquiposOrdenadaPorPuntos[elegido],
                                            this.nivelesDelJuego, this.valorPunto,
                                            this.puntoAleatorioId);
      this.rankingEquiposJuegoDePunto[elegido].puntos = this.rankingEquiposJuegoDePunto[elegido].puntos + this.valorPunto;
      if (this.listaEquiposOrdenadaPorPuntos[elegido].nivelId !== undefined) {
          const nivel = this.nivelesDelJuego.filter (n => n.id === this.listaEquiposOrdenadaPorPuntos[elegido].nivelId)[0];
          this.rankingEquiposJuegoDePunto[elegido].nivel = nivel.Nombre;
      }

      // tslint:disable-next-line:only-arrow-functions
      this.listaEquiposOrdenadaPorPuntos = this.listaEquiposOrdenadaPorPuntos.sort(function(obj1, obj2) {
        return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;
      });
      // tslint:disable-next-line:only-arrow-functions
      this.rankingEquiposJuegoDePunto = this.rankingEquiposJuegoDePunto.sort(function(obj1, obj2) {
        return obj2.puntos - obj1.puntos;
      });
      for (let i = 0; i < this.rankingEquiposJuegoDePunto.length; i++) {
        this.rankingEquiposJuegoDePunto[i].posicion = i + 1;
      }
      this.dataSource = new MatTableDataSource (this.rankingEquiposJuegoDePunto);
      this.selection.clear();
      swal(this.equipoElegido.nombre + ' Enhorabuena', 'success');

    }
  }
  goBack() {
    this.location.back();
  }

}

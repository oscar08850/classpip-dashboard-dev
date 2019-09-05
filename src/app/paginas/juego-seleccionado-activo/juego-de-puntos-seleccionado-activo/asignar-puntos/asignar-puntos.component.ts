import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

import { Alumno, Equipo, Juego, Punto, Nivel, AlumnoJuegoDePuntos, EquipoJuegoDePuntos,
  TablaAlumnoJuegoDePuntos, HistorialPuntosAlumno, TablaEquipoJuegoDePuntos, HistorialPuntosEquipo } from '../../../../clases/index';

// Services
import { JuegoService, EquipoService, JuegoDePuntosService } from '../../../../servicios/index';

@Component({
  selector: 'app-asignar-puntos',
  templateUrl: './asignar-puntos.component.html',
  styleUrls: ['./asignar-puntos.component.scss']
})
export class AsignarPuntosComponent implements OnInit {

  fechaAsignacionPunto: Date;
  fechaString: string;

  juegoSeleccionado: Juego;

  // Recupera la informacion del juego, los alumnos o los equipos, los puntos y los niveles del juego
  alumnosDelJuego: Alumno[];
  equiposDelJuego: Equipo[];
  puntosDelJuego: Punto[];
  nivelesDelJuego: Nivel[];

  // Recoge la inscripción de un alumno en el juego ordenada por puntos
  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDePuntos[];
  listaEquiposOrdenadaPorPuntos: EquipoJuegoDePuntos[];

  // Muestra la posición del alumno, el nombre y los apellidos del alumno, los puntos y el nivel
  rankingJuegoDePuntos: TablaAlumnoJuegoDePuntos[] = [];

  rankingEquiposJuegoDePunto: TablaEquipoJuegoDePuntos[] = [];

  displayedColumnsAlumno: string[] = ['select', 'posicion', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'puntos', 'nivel'];
  selection = new SelectionModel<TablaAlumnoJuegoDePuntos>(true, []);

  displayedColumnsEquipos: string[] = ['select', 'posicion', 'nombreEquipo', 'miembros', 'puntos', 'nivel'];
  selectionEquipos = new SelectionModel<TablaEquipoJuegoDePuntos>(true, []);

  seleccionados: boolean[];
  seleccionadosEquipos: boolean[];

  puntoSeleccionadoId: number;

  // tslint:disable-next-line:no-inferrable-types
  valorPunto: number = 1;

  alumnosEquipo: Alumno[];

  // tslint:disable-next-line:ban-types
  isDisabled: Boolean = true;

  constructor( private juegoService: JuegoService,
               private equipoService: EquipoService,
               private juegoDePuntosService: JuegoDePuntosService ) { }

  ngOnInit() {

    this.juegoSeleccionado = this.juegoService.RecibirJuegoDelServicio();
    this.alumnosDelJuego = this.juegoService.RecibirAlumnoJuegoDelServicio();

    this.puntosDelJuego = this.juegoDePuntosService.RecibirPuntosDelServicio();
    this.nivelesDelJuego = this.juegoDePuntosService.RecibirNivelesDelServicio();
    this.listaAlumnosOrdenadaPorPuntos = this.juegoDePuntosService.RecibirListaOrdenadaJuegoPuntosDelServicio();

    this.rankingJuegoDePuntos = this.juegoDePuntosService.RecibirRankingJuegoPuntosDelServicio();
    this.seleccionados = Array(this.rankingJuegoDePuntos.length).fill(false);

    this.equiposDelJuego = this.juegoService.RecibirEquipoJuegoDelServicio();
    this.listaEquiposOrdenadaPorPuntos = this.juegoDePuntosService.RecibirListaEquiposOrdenadaJuegoPuntosDelServicio();
    this.rankingEquiposJuegoDePunto = this.juegoDePuntosService.RecibirRankingEquipoJuegoPuntosDelServicio();
    console.log(this.equiposDelJuego);
    console.log(this.listaEquiposOrdenadaPorPuntos);
    console.log(this.rankingEquiposJuegoDePunto);

    this.seleccionadosEquipos = Array(this.rankingEquiposJuegoDePunto.length).fill(false);
    console.log(this.seleccionadosEquipos);

    // Ordena la lista de niveles por si el profesor no los creó de forma ascendente
    this.OrdenarNiveles();
  }

  // Funciones para tabla
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {

    const numSelected = this.selection.selected.length;
    const numRows = this.rankingJuegoDePuntos.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.rankingJuegoDePuntos.forEach(row => {
          this.selection.select(row);
        });
  }

  toggleCheckbox(row) {
    this.selection.toggle(row);
    row.selected = !row.selected;
    console.log(row);
    console.log(this.selection.toggle(row));

  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: TablaAlumnoJuegoDePuntos): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  // Pone a true o false la posición del vector seleccionados que le pasamos (i) en función de su estado
  Seleccionar(i: number) {

    if (!this.selection.isSelected(this.rankingJuegoDePuntos[i]) === true) {
      this.seleccionados[i] = true;
    } else {
      this.seleccionados[i] = false;
    }
    console.log(this.seleccionados);
    this.Disabled();
  }

  // Pone a true or false todo el vector seleccionado
  SeleccionarTodos() {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.rankingJuegoDePuntos.length; i++) {

      if (!this.isAllSelected() === true) {
        this.seleccionados[i] = true;
        this.BotonDesactivado();
      } else {
        this.seleccionados[i] = false;
        this.isDisabled = true;
      }

    }
    console.log(this.seleccionados);
  }

  isAllSelectedEquipos() {

    const numSelected = this.selectionEquipos.selected.length;
    const numRows = this.rankingEquiposJuegoDePunto.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selectionEquipos. */
  masterToggleEquipos() {
    this.isAllSelectedEquipos() ?
        this.selectionEquipos.clear() :
        this.rankingEquiposJuegoDePunto.forEach(row => {
          this.selectionEquipos.select(row);
        });
  }

  toggleCheckboxEquipo(row) {
    this.selectionEquipos.toggle(row);
    row.selected = !row.selected;
    console.log(row);
    console.log(this.selectionEquipos.toggle(row));

  }

  /** The label for the checkbox on the passed row */
  checkboxLabelEquipo(row?: TablaEquipoJuegoDePuntos): string {
    if (!row) {
      return `${this.isAllSelectedEquipos() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionEquipos.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  // Pone a true o false la posición del vector seleccionados que le pasamos (i) en función de su estado
  SeleccionarEquipo(i: number) {

    if (!this.selectionEquipos.isSelected(this.rankingEquiposJuegoDePunto[i]) === true) {
      this.seleccionadosEquipos[i] = true;
    } else {
      this.seleccionadosEquipos[i] = false;
    }

    this.Disabled();
  }

  // Pone a true or false todo el vector seleccionado
  SeleccionarTodosEquipos() {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.rankingEquiposJuegoDePunto.length; i++) {

      if (!this.isAllSelectedEquipos() === true) {
        this.seleccionadosEquipos[i] = true;
        // Como se que todos estarán seleccionados, debo ver si ya he seleccionado el punto y el valor
        this.BotonDesactivado();
      } else {
        this.seleccionadosEquipos[i] = false;
        this.isDisabled = true;
      }

    }
    console.log(this.seleccionadosEquipos);
  }

  AsignarPuntos() {

    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('el juego es individual');
      this.AsignarPuntosAlumnos();

    } else {
      console.log('El juego es en equipo');
      this.AsignarPuntosEquipos();
    }

    this.selection.clear();
    this.selectionEquipos.clear();
    this.isDisabled = true;
    this.seleccionados = Array(this.rankingJuegoDePuntos.length).fill(false);
    this.seleccionadosEquipos = Array(this.rankingEquiposJuegoDePunto.length).fill(false);
  }

  AsignarPuntosAlumnos() {

    for (let i = 0; i < this.seleccionados.length; i++) {

      // Buscamos los alumnos que hemos seleccionado
      if (this.seleccionados [i]) {

        let alumno: TablaAlumnoJuegoDePuntos;
        alumno = this.rankingJuegoDePuntos[i];
        console.log(alumno.nombre + ' seleccionado');

        let nivel: Nivel;
        let siguienteNivel: Nivel;
        nivel = this.BuscarNivelActual(this.listaAlumnosOrdenadaPorPuntos[i].nivelId);

        // Si el alumno ya ha alcanzado algun nivel, buscamos cual es el siguiente nivel del que ya tiene. Sino el siguiente
        // nivel será el primero
        if (this.listaAlumnosOrdenadaPorPuntos[i].nivelId !== undefined) {
          console.log('Si hay un nivel, buscamos el siguiente nivel');

          if (nivel.id !== this.nivelesDelJuego[this.nivelesDelJuego.length - 1].id) {
            siguienteNivel = this.BuscarSiguienteNivel(this.listaAlumnosOrdenadaPorPuntos[i].nivelId);
          } else {
            console.log('Ya hemos alcanzado el nivel maximo, no buscamos el siguiente nivel');
          }

        } else {
          console.log('El siguiente nivel es el primer nivel');
          siguienteNivel = this.nivelesDelJuego[0];
        }

        let nuevosPuntos: number;
        nuevosPuntos = this.listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno + this.valorPunto;

        // Comprobamos si subimos de nivel o no

        if (nivel !== undefined ) {
          if (nivel.id !== this.nivelesDelJuego[this.nivelesDelJuego.length - 1].id) {
            console.log('No estoy en el ultimo nivel, busco el siguiente nivel y miro si subo nivel o no');

            if (nuevosPuntos >= siguienteNivel.PuntosAlcanzar) {

              console.log('Voy a subir de nivel');
              nivel = siguienteNivel;
            } else {

              console.log('mantengo el nivel');
              if (this.listaAlumnosOrdenadaPorPuntos[i].nivelId !== undefined) {
                nivel = this.BuscarNivelActual(this.listaAlumnosOrdenadaPorPuntos[i].nivelId);
              }
            }
          } else {
            console.log('estoy maximo nivel, que es el siguiente');
            nivel = this.BuscarNivelActual(this.listaAlumnosOrdenadaPorPuntos[i].nivelId);
            console.log(nivel);
          }
        } else {

          if (nuevosPuntos >= siguienteNivel.PuntosAlcanzar) {

            console.log('Voy a subir de nivel');
            nivel = siguienteNivel;
          } else {

            console.log('mantengo el nivel');
            if (this.listaAlumnosOrdenadaPorPuntos[i].nivelId !== undefined) {
              nivel = this.BuscarNivelActual(this.listaAlumnosOrdenadaPorPuntos[i].nivelId);
            }
          }
        }

        // tslint:disable-next-line:curly

        if (nivel !== undefined) {
          this.juegoDePuntosService.PUT_PuntosJuegoDePuntos(new AlumnoJuegoDePuntos (this.listaAlumnosOrdenadaPorPuntos[i].alumnoId,
          this.listaAlumnosOrdenadaPorPuntos[i].juegoDePuntosId, nuevosPuntos, nivel.id),
          this.listaAlumnosOrdenadaPorPuntos[i].id).subscribe( res => {
            console.log(res);
            this.listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno = nuevosPuntos;
            this.listaAlumnosOrdenadaPorPuntos[i].nivelId = nivel.id;

            this.rankingJuegoDePuntos[i].puntos = nuevosPuntos;
            this.rankingJuegoDePuntos[i].nivel = nivel.Nombre;
            this.fechaAsignacionPunto = new Date();
            this.fechaString = this.fechaAsignacionPunto.toLocaleDateString() + '  ' + this.fechaAsignacionPunto.toLocaleTimeString();
            // tslint:disable-next-line:max-line-length
            this.POST_HistorialAlumno(this.valorPunto, this.puntoSeleccionadoId, this.listaAlumnosOrdenadaPorPuntos[i].id, this.fechaString);
            this.OrdenarListaPorPuntos();
            this.OrdenarRankingPorPuntos();
          });
        } else {

          this.juegoDePuntosService.PUT_PuntosJuegoDePuntos(new AlumnoJuegoDePuntos (this.listaAlumnosOrdenadaPorPuntos[i].alumnoId,
          this.listaAlumnosOrdenadaPorPuntos[i].juegoDePuntosId, nuevosPuntos),
          this.listaAlumnosOrdenadaPorPuntos[i].id).subscribe( res => {
            console.log(res);
            this.listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno = nuevosPuntos;
            // this.listaAlumnosOrdenadaPorPuntos[i].nivelId = nivel.id;

            this.rankingJuegoDePuntos[i].puntos = nuevosPuntos;
            this.fechaAsignacionPunto = new Date();
            this.fechaString = this.fechaAsignacionPunto.toLocaleDateString() + '  ' + this.fechaAsignacionPunto.toLocaleTimeString();

            // tslint:disable-next-line:max-line-length
            this.POST_HistorialAlumno(this.valorPunto, this.puntoSeleccionadoId, this.listaAlumnosOrdenadaPorPuntos[i].id, this.fechaString);
            this.OrdenarListaPorPuntos();
            this.OrdenarRankingPorPuntos();
          });
        }
      }
    }

  }

  AsignarPuntosEquipos() {

    for (let i = 0; i < this.seleccionadosEquipos.length; i++) {

      // Buscamos los alumnos que hemos seleccionado
      if (this.seleccionadosEquipos[i]) {

        let equipo: TablaEquipoJuegoDePuntos;
        equipo = this.rankingEquiposJuegoDePunto[i];
        console.log(equipo.nombre + ' seleccionado');

        let nivel: Nivel;
        let siguienteNivel: Nivel;
        nivel = this.BuscarNivelActual(this.listaEquiposOrdenadaPorPuntos[i].nivelId);

        // Si el alumno ya ha alcanzado algun nivel, buscamos cual es el siguiente nivel del que ya tiene. Sino el siguiente
        // nivel será el primero
        if (this.listaEquiposOrdenadaPorPuntos[i].nivelId !== undefined) {
          console.log('Si hay un nivel, buscamos el siguiente nivel');

          if (nivel.id !== this.nivelesDelJuego[this.nivelesDelJuego.length - 1].id) {
            siguienteNivel = this.BuscarSiguienteNivel(this.listaEquiposOrdenadaPorPuntos[i].nivelId);
          } else {
            console.log('Ya hemos alcanzado el nivel maximo, no buscamos el siguiente nivel');
          }

        } else {
          console.log('El siguiente nivel es el primer nivel');
          siguienteNivel = this.nivelesDelJuego[0];
        }

        let nuevosPuntos: number;
        nuevosPuntos = this.listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo + this.valorPunto;

        // Comprobamos si subimos de nivel o no

        if (nivel !== undefined) {
          if (nivel !== undefined) {
            if (nivel.id !== this.nivelesDelJuego[this.nivelesDelJuego.length - 1].id) {
              console.log('No estoy en el ultimo nivel, busco el siguiente nivel y miro si subo nivel o no');

              if (nuevosPuntos >= siguienteNivel.PuntosAlcanzar) {

                console.log('Voy a subir de nivel');
                nivel = siguienteNivel;
              } else {

                console.log('mantengo el nivel');
                if (this.listaEquiposOrdenadaPorPuntos[i].nivelId !== undefined) {
                  nivel = this.BuscarNivelActual(this.listaEquiposOrdenadaPorPuntos[i].nivelId);
                }
              }
            } else {
              console.log('estoy maximo nivel, que es el siguiente');
              nivel = this.BuscarNivelActual(this.listaEquiposOrdenadaPorPuntos[i].nivelId);
              console.log(nivel);
            }
          }
        } else {
          if (nuevosPuntos >= siguienteNivel.PuntosAlcanzar) {

            console.log('Voy a subir de nivel');
            nivel = siguienteNivel;
          } else {

            console.log('mantengo el nivel');
            if (this.listaEquiposOrdenadaPorPuntos[i].nivelId !== undefined) {
              nivel = this.BuscarNivelActual(this.listaEquiposOrdenadaPorPuntos[i].nivelId);
            }
          }
        }

        // tslint:disable-next-line:curly

        if (nivel !== undefined) {
          this.juegoDePuntosService.PUT_PuntosEquiposJuegoDePuntos( new EquipoJuegoDePuntos(this.listaEquiposOrdenadaPorPuntos[i].equipoId,
            this.listaEquiposOrdenadaPorPuntos[i].juegoDePuntosId, nuevosPuntos, nivel.id), this.listaEquiposOrdenadaPorPuntos[i].id)
            .subscribe( res => {
              console.log(res);
              this.listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo = nuevosPuntos;
              this.listaEquiposOrdenadaPorPuntos[i].nivelId = nivel.id;

              this.rankingEquiposJuegoDePunto[i].puntos = nuevosPuntos;
              this.rankingEquiposJuegoDePunto[i].nivel = nivel.Nombre;

              this.fechaAsignacionPunto = new Date();
              this.fechaString = this.fechaAsignacionPunto.toLocaleDateString() + '  ' + this.fechaAsignacionPunto.toLocaleTimeString();

              // tslint:disable-next-line:max-line-length
              this.POST_HistorialEquipo(this.valorPunto, this.puntoSeleccionadoId, this.listaEquiposOrdenadaPorPuntos[i].id, this.fechaString);
              this.OrdenarListaEquiposPorPuntos();
              this.OrdenarRankingEquiposPorPuntos();
            });
          } else {

            // tslint:disable-next-line:max-line-length
            this.juegoDePuntosService.PUT_PuntosEquiposJuegoDePuntos( new EquipoJuegoDePuntos(this.listaEquiposOrdenadaPorPuntos[i].equipoId,
              this.listaEquiposOrdenadaPorPuntos[i].juegoDePuntosId, nuevosPuntos), this.listaEquiposOrdenadaPorPuntos[i].id)
              .subscribe( res => {
                console.log(res);
                this.listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo = nuevosPuntos;

                this.rankingEquiposJuegoDePunto[i].puntos = nuevosPuntos;

                this.fechaAsignacionPunto = new Date();
                this.fechaString = this.fechaAsignacionPunto.toLocaleDateString() + '  ' + this.fechaAsignacionPunto.toLocaleTimeString();

                // tslint:disable-next-line:max-line-length
                this.POST_HistorialEquipo(this.valorPunto, this.puntoSeleccionadoId, this.listaEquiposOrdenadaPorPuntos[i].id, this.fechaString);
                this.OrdenarListaEquiposPorPuntos();
                this.OrdenarRankingEquiposPorPuntos();
              });
          }
      }
    }

  }

  POST_HistorialAlumno(valorPunto: number, puntoId: number, alumnoJuegoDePuntos: number, fechaAsignacionPunto: string ) {

    console.log(fechaAsignacionPunto);
    // tslint:disable-next-line:max-line-length
    this.juegoDePuntosService.POST_HistorialPuntosAlumno(new HistorialPuntosAlumno (valorPunto, puntoId, alumnoJuegoDePuntos, fechaAsignacionPunto))
    .subscribe(res => console.log(res));
  }

  POST_HistorialEquipo(valorPunto: number, puntoId: number, equipoJuegoDePuntos: number, fechaAsignacionPunto: string) {
    // tslint:disable-next-line:max-line-length
    this.juegoDePuntosService.POST_HistorialPuntosEquipo(new HistorialPuntosEquipo (valorPunto, puntoId, equipoJuegoDePuntos, fechaAsignacionPunto))
    .subscribe(res => console.log(res));
  }

  // Recoge la lista y la ordena por puntos de mayor a menor
  OrdenarListaPorPuntos() {
    console.log('entro a ordenar lista');

    // tslint:disable-next-line:only-arrow-functions
    this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2) {
      return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
    });
    return this.listaAlumnosOrdenadaPorPuntos;
  }

  OrdenarListaEquiposPorPuntos() {
    console.log('entro a ordenar lista');

    // tslint:disable-next-line:only-arrow-functions
    this.listaEquiposOrdenadaPorPuntos = this.listaEquiposOrdenadaPorPuntos.sort(function(obj1, obj2) {
      return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;
    });
    return this.listaEquiposOrdenadaPorPuntos;
  }

  // Ordena el ranking por puntos
  OrdenarRankingPorPuntos() {
    console.log('entro a ordenar ranking');
    // tslint:disable-next-line:only-arrow-functions
    this.rankingJuegoDePuntos = this.rankingJuegoDePuntos.sort(function(obj1, obj2) {
      return obj2.puntos - obj1.puntos;
    });

    for (let i = 0; i < this.rankingJuegoDePuntos.length; i ++) {
      this.rankingJuegoDePuntos[i].posicion = i + 1;
    }
    this.rankingJuegoDePuntos = this.rankingJuegoDePuntos.filter(res => res.nombre !== '');
    return this.rankingJuegoDePuntos;
  }

  OrdenarRankingEquiposPorPuntos() {
    console.log('entro a ordenar ranking');
    // tslint:disable-next-line:only-arrow-functions
    this.rankingEquiposJuegoDePunto = this.rankingEquiposJuegoDePunto.sort(function(obj1, obj2) {
      return obj2.puntos - obj1.puntos;
    });

    for (let i = 0; i < this.rankingEquiposJuegoDePunto.length; i ++) {
      this.rankingEquiposJuegoDePunto[i].posicion = i + 1;
    }
    this.rankingEquiposJuegoDePunto = this.rankingEquiposJuegoDePunto.filter(res => res.nombre !== '');
    return this.rankingEquiposJuegoDePunto;
  }

  OrdenarNiveles() {

    // tslint:disable-next-line:only-arrow-functions
    this.nivelesDelJuego = this.nivelesDelJuego.sort(function(obj1, obj2) {
      return obj1.PuntosAlcanzar - obj2.PuntosAlcanzar;
    });
    return this.nivelesDelJuego;
  }

  BuscarSiguienteNivel(nivelId: number): Nivel {

    // tslint:disable-next-line:no-inferrable-types
    let encontrado: boolean = false;
    let i = 0;
    while ((i < this.nivelesDelJuego.length) && (encontrado === false)) {

      if (this.nivelesDelJuego[i].id === nivelId) {
        encontrado = true;
      }
      i = i + 1;
    }
    return this.nivelesDelJuego[i];
  }

  BuscarNivelActual(nivelId: number): Nivel {

    let nivel: Nivel;
    console.log(this.nivelesDelJuego.filter(res => res.id === nivelId)[0]);

    nivel = this.nivelesDelJuego.filter(res => res.id === nivelId)[0];

    return nivel;
  }

  AlumnosDelEquipo(equipo: Equipo) {
    console.log(equipo);

    this.equipoService.GET_AlumnosEquipo(equipo.id)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.alumnosEquipo = res;
        console.log(res);
      } else {
        console.log('No hay alumnos en este equipo');
        this.alumnosEquipo = undefined;
      }
    });
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
}

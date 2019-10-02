import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';

// Clases
import { Alumno, Equipo, Juego, Punto, Nivel, AlumnoJuegoDePuntos, EquipoJuegoDePuntos,
  TablaAlumnoJuegoDePuntos, TablaEquipoJuegoDePuntos } from '../../../clases/index';

// Services
import { JuegoService, EquipoService, AlumnoService, JuegoDePuntosService } from '../../../servicios/index';

// Imports para abrir diálogo y snackbar
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';



@Component({
  selector: 'app-juego-de-puntos-seleccionado-activo',
  templateUrl: './juego-de-puntos-seleccionado-activo.component.html',
  styleUrls: ['./juego-de-puntos-seleccionado-activo.component.scss']
})
export class JuegoDePuntosSeleccionadoActivoComponent implements OnInit {

  // Juego De Puntos seleccionado
  juegoSeleccionado: Juego;

  // Recupera la informacion del juego, los alumnos o los equipos, los puntos y los niveles del juego
  alumnosDelJuego: Alumno[];
  equiposDelJuego: Equipo[];
  puntosDelJuego: Punto[];
  nivelesDelJuego: Nivel[];

  listaSeleccionable: Punto[] = [];

  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres desactivar el ';

  // Recoge la inscripción de un alumno en el juego ordenada por puntos
  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDePuntos[];

  listaEquiposOrdenadaPorPuntos: EquipoJuegoDePuntos[];

  datasourceAlumno;
  datasourceEquipo;

  // Muestra la posición del alumno, el nombre y los apellidos del alumno, los puntos y el nivel
  rankingJuegoDePuntos: TablaAlumnoJuegoDePuntos[] = [];
  rankingJuegoDePuntosTotal: TablaAlumnoJuegoDePuntos[] = [];

  rankingEquiposJuegoDePuntos: TablaEquipoJuegoDePuntos[] = [];
  rankingEquiposJuegoDePuntosTotal: TablaEquipoJuegoDePuntos[] = [];

  puntoSeleccionadoId: number;

  displayedColumnsAlumnos: string[] = ['posicion', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'puntos', 'nivel', ' '];

  displayedColumnsEquipos: string[] = ['posicion', 'nombreEquipo', 'miembros', 'puntos', 'nivel', ' '];

  alumnosEquipo: Alumno[];

  constructor( private juegoService: JuegoService,
               private alumnoService: AlumnoService,
               private equipoService: EquipoService,
               private juegoDePuntosService: JuegoDePuntosService,
               public dialog: MatDialog,
               public snackBar: MatSnackBar,
               private location: Location ) { }

  ngOnInit() {

    this.juegoSeleccionado = this.juegoService.RecibirJuegoDelServicio();
    this.listaSeleccionable[0] =  new Punto('Totales');

    this.PuntosDelJuego();
    this.NivelesDelJuego();

    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.AlumnosDelJuego();
    } else {
      this.EquiposDelJuego();
    }
  }


  applyFilter(filterValue: string) {
    this.datasourceAlumno.filter = filterValue.trim().toLowerCase();
  }

  applyFilterEquipo(filterValue: string) {
    this.datasourceEquipo.filter = filterValue.trim().toLowerCase();
  }

  // Recupera los alumnos que pertenecen al juego
  AlumnosDelJuego() {
    this.juegoDePuntosService.GET_AlumnosJuegoDePuntos(this.juegoSeleccionado.id)
    .subscribe(alumnosJuego => {
      console.log(alumnosJuego);
      this.alumnosDelJuego = alumnosJuego;
      this.RecuperarInscripcionesAlumnoJuego();
    });
  }


  // Recupera los equipos que pertenecen al juego
  EquiposDelJuego() {
    this.juegoDePuntosService.GET_EquiposJuegoDePuntos(this.juegoSeleccionado.id)
    .subscribe(equiposJuego => {
      this.equiposDelJuego = equiposJuego;
      this.RecuperarInscripcionesEquiposJuego();
    });
  }


  // Recupera los puntos que se pueden asignar en el juego
  PuntosDelJuego() {
    this.juegoDePuntosService.GET_PuntosJuegoDePuntos(this.juegoSeleccionado.id)
    .subscribe(puntos => {
      this.puntosDelJuego = puntos;

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.puntosDelJuego.length; i ++) {
        this.listaSeleccionable.push(this.puntosDelJuego[i]);
      }
    });
  }


  // Recupera los niveles de los que dispone el juego
  NivelesDelJuego() {
    this.juegoDePuntosService.GET_NivelesJuegoDePuntos(this.juegoSeleccionado.id)
    .subscribe(niveles => {
      this.nivelesDelJuego = niveles;
      console.log(this.nivelesDelJuego);
    });
  }


  // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor
  RecuperarInscripcionesAlumnoJuego() {
    this.juegoDePuntosService.GET_InscripcionesAlumnoJuegoDePuntos(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorPuntos = inscripciones;
      this.OrdenarPorPuntos();
      this.TablaClasificacionTotal();
    });
  }


    // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor
  RecuperarInscripcionesEquiposJuego() {

    this.juegoDePuntosService.GET_InscripcionesEquipoJuegoDePuntos(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaEquiposOrdenadaPorPuntos = inscripciones;
      console.log(this.listaEquiposOrdenadaPorPuntos);
      this.OrdenarPorPuntosEquipos();
      this.TablaClasificacionTotal();
    });
  }
  // Recoge la lista y la ordena por puntos de mayor a menor
  OrdenarPorPuntos() {

    // tslint:disable-next-line:only-arrow-functions
    this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2) {
      return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
    });
    return this.listaAlumnosOrdenadaPorPuntos;
  }

  OrdenarPorPuntosEquipos() {

    // tslint:disable-next-line:only-arrow-functions
    this.listaEquiposOrdenadaPorPuntos = this.listaEquiposOrdenadaPorPuntos.sort(function(obj1, obj2) {
      return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;
    });
    return this.listaEquiposOrdenadaPorPuntos;
  }

  // En función del modo, recorremos la lisa de Alumnos o de Equipos y vamos rellenando el rankingJuegoDePuntos
  TablaClasificacionTotal() {

    if (this.juegoSeleccionado.Modo === 'Individual') {

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.listaAlumnosOrdenadaPorPuntos.length; i++) {
        let alumno: Alumno;
        let nivel: Nivel;

        alumno = this.BuscarAlumno(this.listaAlumnosOrdenadaPorPuntos[i].alumnoId);

        if (this.listaAlumnosOrdenadaPorPuntos[i].nivelId !== undefined) {
          console.log(this.listaAlumnosOrdenadaPorPuntos[i].alumnoId);
          nivel = this.BuscarNivel(this.listaAlumnosOrdenadaPorPuntos[i].nivelId);
          console.log(this.listaAlumnosOrdenadaPorPuntos[i].nivelId);
        }

        if (nivel !== undefined) {
          this.rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
            this.listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno, nivel.Nombre);

          this.rankingJuegoDePuntosTotal[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido,
            alumno.SegundoApellido, this.listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno, nivel.Nombre);
        } else {
          this.rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
            this.listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno);

          this.rankingJuegoDePuntosTotal[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido,
            alumno.SegundoApellido, this.listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno);
        }
      }

      this.datasourceAlumno = new MatTableDataSource(this.rankingJuegoDePuntos);

    } else {
          // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.listaEquiposOrdenadaPorPuntos.length; i++) {
        let equipo: Equipo;
        let nivel: Nivel;

        equipo = this.BuscarEquipo(this.listaEquiposOrdenadaPorPuntos[i].equipoId);

        if (this.listaEquiposOrdenadaPorPuntos[i].nivelId !== undefined) {
          console.log(this.listaEquiposOrdenadaPorPuntos[i].equipoId);
          nivel = this.BuscarNivel(this.listaEquiposOrdenadaPorPuntos[i].nivelId);
          console.log(this.listaEquiposOrdenadaPorPuntos[i].nivelId);
        }

        if (nivel !== undefined) {
          this.rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
            this.listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo, nivel.Nombre);

          this.rankingEquiposJuegoDePuntosTotal[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
            this.listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo, nivel.Nombre);
        } else {
          this.rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
            this.listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo);

          this.rankingEquiposJuegoDePuntosTotal[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
            this.listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo);
        }
      }

      this.datasourceEquipo = new MatTableDataSource(this.rankingEquiposJuegoDePuntos);
    }
  }

  BuscarAlumno(alumnoId: number): Alumno {

    let alumno: Alumno;
    // tslint:disable-next-line:no-unused-expression
    alumno = this.alumnosDelJuego.filter(res => res.id === alumnoId)[0];
    return alumno;
  }

  BuscarEquipo(equipoId: number): Equipo {

    let equipo: Equipo;
    // tslint:disable-next-line:no-unused-expression
    equipo = this.equiposDelJuego.filter(res => res.id === equipoId)[0];
    return equipo;
  }

  BuscarNivel(nivelId: number): Nivel {

    let nivel: Nivel;
    console.log(this.nivelesDelJuego.filter(res => res.id === nivelId)[0]);

    nivel = this.nivelesDelJuego.filter(res => res.id === nivelId)[0];

    return nivel;
  }

  Informacion() {
    this.juegoDePuntosService.EnviarPuntosAlServicio(this.puntosDelJuego);
    this.juegoDePuntosService.EnviarNivelesAlServicio(this.nivelesDelJuego);
  }

  AsignarPuntos() {
    // Para enviar la tabla de los puntos totales
    this.TablaClasificacionTotal();

    this.juegoDePuntosService.EnviarPuntosAlServicio(this.puntosDelJuego);
    this.juegoDePuntosService.EnviarNivelesAlServicio(this.nivelesDelJuego);



    this.juegoService.EnviarAlumnoJuegoAlServicio(this.alumnosDelJuego);
    this.juegoDePuntosService.EnviarListaOrdenadaJuegoPuntosAlServicio(this.listaAlumnosOrdenadaPorPuntos);
    this.juegoDePuntosService.EnviarRankingJuegoPuntosAlServicio(this.rankingJuegoDePuntos);

    this.juegoService.EnviarEquipoJuegoAlServicio(this.equiposDelJuego);
    this.juegoDePuntosService.EnviarListaEquiposOrdenadaJuegoPuntosAlServicio(this.listaEquiposOrdenadaPorPuntos);
    this.juegoDePuntosService.EnviarRankingEquipoJuegoPuntosAlServicio(this.rankingEquiposJuegoDePuntos);

  }

  AccederAlumno(alumno: TablaAlumnoJuegoDePuntos) {

    const alumnoSeleccionado = this.alumnosDelJuego.filter(res => res.Nombre === alumno.nombre &&
      res.PrimerApellido === alumno.primerApellido && res.SegundoApellido === alumno.segundoApellido);

    const posicion = this.rankingJuegoDePuntosTotal.filter(res => res.nombre === alumno.nombre &&
      res.primerApellido === alumno.primerApellido && res.segundoApellido === alumno.segundoApellido)[0].posicion;

    console.log('muestro posicion' + posicion);

    this.juegoDePuntosService.EnviarPosicionAlServicio(posicion);
    this.alumnoService.EnviarAlumnoAlServicio(alumnoSeleccionado);
    // tslint:disable-next-line:max-line-length
    this.juegoDePuntosService.EnviarInscripcionAlServicio(this.listaAlumnosOrdenadaPorPuntos.filter(res => res.alumnoId === alumnoSeleccionado[0].id));
    this.juegoDePuntosService.EnviarPuntosAlServicio(this.puntosDelJuego);
    this.juegoDePuntosService.EnviarNivelesAlServicio(this.nivelesDelJuego);
  }

  AccederEquipo(equipo: TablaEquipoJuegoDePuntos) {

    const equipoSeleccionado = this.equiposDelJuego.filter(res => res.Nombre === equipo.nombre);


    const posicion = this.rankingEquiposJuegoDePuntosTotal.filter(res => res.nombre === equipo.nombre)[0].posicion;
    console.log(posicion);
    this.juegoDePuntosService.EnviarPosicionAlServicio(posicion);
    this.equipoService.EnviarEquipoAlServicio(equipoSeleccionado);
    // tslint:disable-next-line:max-line-length
    this.juegoDePuntosService.EnviarInscripcionEquipoAlServicio(this.listaEquiposOrdenadaPorPuntos.filter(res => res.equipoId === equipoSeleccionado[0].id));
    this.juegoDePuntosService.EnviarPuntosAlServicio(this.puntosDelJuego);
    this.juegoDePuntosService.EnviarNivelesAlServicio(this.nivelesDelJuego);
  }

  MostrarRankingSeleccionado() {

    // Si es indefinido muestro la tabla del total de puntos
    if (this.puntosDelJuego.filter(res => res.id === Number(this.puntoSeleccionadoId))[0] === undefined) {

      console.log('Tabla del principio');
      this.TablaClasificacionTotal();

    } else {
      console.log('Voy a por la clasficiacion del punto');
      this.ClasificacionPorTipoDePunto();

    }
  }

  ClasificacionPorTipoDePunto() {

    if (this.juegoSeleccionado.Modo === 'Individual') {

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.listaAlumnosOrdenadaPorPuntos.length; i ++) {

        let alumno: Alumno;
        let nivel: Nivel;

        alumno = this.BuscarAlumno(this.listaAlumnosOrdenadaPorPuntos[i].alumnoId);

        if (this.listaAlumnosOrdenadaPorPuntos[i].nivelId !== undefined) {
          console.log(this.listaAlumnosOrdenadaPorPuntos[i].alumnoId);
          nivel = this.BuscarNivel(this.listaAlumnosOrdenadaPorPuntos[i].nivelId);
          console.log(this.listaAlumnosOrdenadaPorPuntos[i].nivelId);
        }

        this.juegoDePuntosService.GET_HistorialDeUnPunto(this.listaAlumnosOrdenadaPorPuntos[i].id, this.puntoSeleccionadoId)
        .subscribe(historial => {
          let puntos = 0;
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < historial.length; j ++) {
            puntos = puntos + historial[j].ValorPunto;
          }

          if (nivel !== undefined) {
            // tslint:disable-next-line:max-line-length
            this.rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
              puntos, nivel.Nombre);
          } else {
            // tslint:disable-next-line:max-line-length
            this.rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
              puntos);
          }

          if (i === this.listaAlumnosOrdenadaPorPuntos.length - 1 ) {
            this.OrdenarTablaPorPuntos();
          }
        });
      }
    } else {

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.listaEquiposOrdenadaPorPuntos.length; i ++) {

        let equipo: Equipo;
        let nivel: Nivel;

        equipo = this.BuscarEquipo(this.listaEquiposOrdenadaPorPuntos[i].equipoId);

        if (this.listaEquiposOrdenadaPorPuntos[i].nivelId !== undefined) {

          nivel = this.BuscarNivel(this.listaEquiposOrdenadaPorPuntos[i].nivelId);
        }

        this.juegoDePuntosService.GET_HistorialDeUnPuntoEquipo(this.listaEquiposOrdenadaPorPuntos[i].id, this.puntoSeleccionadoId)
        .subscribe(historial => {

          let puntos = 0;
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < historial.length; j ++) {
            puntos = puntos + historial[j].ValorPunto;
          }


          if (nivel !== undefined) {
            this.rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
              puntos, nivel.Nombre);
          } else {
            this.rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
              puntos);
          }

          if (i === this.listaEquiposOrdenadaPorPuntos.length - 1 ) {
            this.OrdenarTablaPorPuntos();
          }
        });
      }
    }


  }

  OrdenarTablaPorPuntos() {
    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('Voy a orddenar la tabla');
      // tslint:disable-next-line:only-arrow-functions
      this.rankingJuegoDePuntos = this.rankingJuegoDePuntos.sort(function(obj1, obj2) {
        return obj2.puntos - obj1.puntos;
      });
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.rankingJuegoDePuntos.length; i++) {
        this.rankingJuegoDePuntos[i].posicion = i + 1;
      }
      // this.rankingJuegoDePuntos = this.rankingJuegoDePuntos.filter(res => res.nombre !== '');
      this.datasourceAlumno = new MatTableDataSource(this.rankingJuegoDePuntos);
      return this.datasourceAlumno;

    } else {

      console.log('Voy a orddenar la tabla de equipos');
      // tslint:disable-next-line:only-arrow-functions
      this.rankingEquiposJuegoDePuntos = this.rankingEquiposJuegoDePuntos.sort(function(obj1, obj2) {
        return obj2.puntos - obj1.puntos;
      });
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.rankingEquiposJuegoDePuntos.length; i++) {
        this.rankingEquiposJuegoDePuntos[i].posicion = i + 1;
      }
      this.datasourceEquipo = new MatTableDataSource (this.rankingEquiposJuegoDePuntos);
      return this.datasourceEquipo;
    }

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

  DesactivarJuego() {
    console.log(this.juegoSeleccionado);
    this.juegoDePuntosService.PUT_EstadoJuegoDePuntos(new Juego (this.juegoSeleccionado.Tipo, this.juegoSeleccionado.Modo,
      undefined, false), this.juegoSeleccionado.id, this.juegoSeleccionado.grupoId).subscribe(res => {
        if (res !== undefined) {
          console.log(res);
          console.log('juego desactivado');
          this.location.back();
        }
      });
  }

  AbrirDialogoConfirmacionDesactivar(): void {

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        nombre: this.juegoSeleccionado.Tipo,
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.DesactivarJuego();
        this.snackBar.open(this.juegoSeleccionado.Tipo + ' desactivado correctamente', 'Cerrar', {
          duration: 2000,
        });
      }
    });
  }

  prueba2() {
    console.log(this.rankingJuegoDePuntos);
  }


}

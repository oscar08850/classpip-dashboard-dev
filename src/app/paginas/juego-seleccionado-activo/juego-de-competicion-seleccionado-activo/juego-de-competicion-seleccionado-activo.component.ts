import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
// Clases
import { Alumno, Equipo, Juego, TablaJornadas, AlumnoJuegoDeCompeticionLiga, EquipoJuegoDeCompeticionLiga,
         TablaAlumnoJuegoDeCompeticion, TablaEquipoJuegoDeCompeticion, Jornada, EnfrentamientoLiga } from '../../../clases/index';

// Servicio
import { SesionService, PeticionesAPIService, CalculosService } from '../../../servicios/index';

// Imports para abrir diálogo y swal
import { MatDialog } from '@angular/material';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-juego-de-competicion-seleccionado-activo',
  templateUrl: './juego-de-competicion-seleccionado-activo.component.html',
  styleUrls: ['./juego-de-competicion-seleccionado-activo.component.scss']
})
export class JuegoDeCompeticionSeleccionadoActivoComponent implements OnInit {

  // Juego De CompeticionLiga seleccionado
  juegoSeleccionado: Juego;

  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres desactivar el ';
  // Recupera la informacion del juego, los alumnos o los equipos del juego
  alumnosDelJuego: Alumno[];
  equiposDelJuego: Equipo[];
  alumnosDelEquipo: Alumno[];

  // Recoge la inscripción de un alumno en el juego ordenada por puntos
  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeCompeticionLiga[];
  listaEquiposOrdenadaPorPuntos: EquipoJuegoDeCompeticionLiga[];

  // Muestra la posición del alumno, el nombre y los apellidos del alumno y los puntos
  rankingAlumnoJuegoDeCompeticion: TablaAlumnoJuegoDeCompeticion[] = [];
  rankingEquiposJuegoDeCompeticion: TablaEquipoJuegoDeCompeticion[] = [];

  // Columnas Tabla
  // displayedColumnsAlumnos: string[] = ['posicion', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'partidosTotales',
  //                                      'partidosJugados', 'partidosGanados', 'partidosEmpatados', 'partidosPerdidos', 'puntos', ' '];
  displayedColumnsAlumnos: string[] = ['posicion', 'nombreAlumno', 'partidosTotales',
                                       'partidosJugados', 'partidosGanados', 'partidosEmpatados', 'partidosPerdidos', 'puntos'];
  displayedColumnsEquipos: string[] = ['posicion', 'nombreEquipo', 'miembros', 'partidosTotales', 'partidosJugados',
                                       'partidosGanados', 'partidosEmpatados', 'partidosPerdidos', 'puntos'];

  datasourceAlumno;
  datasourceEquipo;

  jornadas: Jornada[];
  JornadasCompeticion: TablaJornadas[] = [];
  // enfrentamientosDelJuego: EnfrentamientoLiga[] = [];
  enfrentamientosDelJuego: Array<Array<EnfrentamientoLiga>>;
  juegosActivosPuntos: Juego[] = [];

  constructor(  public dialog: MatDialog,
                public sesion: SesionService,
                public peticionesAPI: PeticionesAPIService,
                public calculos: CalculosService,
                private location: Location) {}

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log(this.juegoSeleccionado);
    this.DameJornadasDelJuegoDeCompeticionSeleccionado();
    this.DameJuegosdePuntosActivos();
  }


  DameJornadasDelJuegoDeCompeticionSeleccionado() {
    this.peticionesAPI.DameJornadasDeCompeticionLiga(this.juegoSeleccionado.id)
      .subscribe(inscripciones => {
        this.jornadas = inscripciones;
        console.log('Las jornadas son: ');
        console.log(this.jornadas);
        console.log('Vamos a por los enfrentamientos de cada jornada');
        this.DameEnfrentamientosDelJuego();
      });
  }

  DameEnfrentamientosDelJuego() {
    console.log('Estoy en DameEnfrentamientosDeLasJornadas()');
    let jornadasCounter = 0;
    this.enfrentamientosDelJuego = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.jornadas.length; i++) {
      this.enfrentamientosDelJuego[i] = [];
      this.peticionesAPI.DameEnfrentamientosDeCadaJornadaLiga(this.jornadas[i].id)
      .subscribe((enfrentamientosDeLaJornada: Array<EnfrentamientoLiga>) => {
        jornadasCounter++;
        console.log('Los enfrentamiendos de la jornadaId ' + this.jornadas[i].id + ' son: ');
        console.log(enfrentamientosDeLaJornada);
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < enfrentamientosDeLaJornada.length; j++) {
          this.enfrentamientosDelJuego[i][j] = new EnfrentamientoLiga();
          this.enfrentamientosDelJuego[i][j] = enfrentamientosDeLaJornada[j];
        }
        if (jornadasCounter === this.jornadas.length) {
          console.log('La lista final de enfrentamientos del juego es: ');
          console.log(this.enfrentamientosDelJuego);
          if (this.juegoSeleccionado.Modo === 'Individual') {
            this.AlumnosDelJuego();
          } else {
            this.EquiposDelJuego();
          }
        }
      });
    }
  }

  AlumnosDelJuego() {
    console.log ('Vamos a por los alumnos');
    console.log('Id juegoSeleccionado: ' + this.juegoSeleccionado.id);
    this.peticionesAPI.DameAlumnosJuegoDeCompeticionLiga(this.juegoSeleccionado.id)
    .subscribe(alumnosJuego => {
      console.log ('Ya tengo los alumnos: ' );
      console.log (alumnosJuego);
      this.alumnosDelJuego = alumnosJuego;
      this.RecuperarInscripcionesAlumnoJuego();
    });
  }

  EquiposDelJuego() {
    console.log ('Vamos a por los equipos');
    console.log('Id juegoSeleccionado: ' + this.juegoSeleccionado.id);
    this.peticionesAPI.DameEquiposJuegoDeCompeticionLiga(this.juegoSeleccionado.id)
    .subscribe(equiposJuego => {
      console.log ('ya tengo los equipos');
      console.log (equiposJuego);
      this.equiposDelJuego = equiposJuego;
      this.RecuperarInscripcionesEquiposJuego();
    });
  }

  AlumnosDelEquipo(equipo: Equipo) {
    console.log(equipo);

    this.peticionesAPI.DameAlumnosEquipo (equipo.id)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.alumnosDelEquipo = res;
        console.log('Los alumnos del equipo ' + equipo.id + ' son: ');
        console.log(res);
      } else {
        console.log('No hay alumnos en este equipo');
        // Informar al usuario
        this.alumnosDelEquipo = undefined;
      }
    });
  }

  AccederAlumno(alumno: TablaAlumnoJuegoDeCompeticion) {

    const alumnoSeleccionado = this.alumnosDelJuego.filter(res => res.Nombre === alumno.nombre &&
      res.PrimerApellido === alumno.primerApellido && res.SegundoApellido === alumno.segundoApellido)[0];

    const posicion = this.rankingAlumnoJuegoDeCompeticion.filter(res => res.nombre === alumno.nombre &&
      res.primerApellido === alumno.primerApellido && res.segundoApellido === alumno.segundoApellido)[0].posicion;

      // Informacion que se necesitara para ver la evolución del alumno, faltará la función DameDatosEvolucionAlumno..
    this.sesion.TomaDatosEvolucionAlumnoJuegoCompeticionLiga (
      posicion,
      alumnoSeleccionado,
      this.listaAlumnosOrdenadaPorPuntos.filter(res => res.AlumnoId === alumnoSeleccionado.id)[0]
    );
  }

  // Recupera los AlumnoJuegoDeCompeticionLiga del juegoSeleccionado.id ordenados por puntos de mayor a menor
  RecuperarInscripcionesAlumnoJuego() {
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeCompeticionLiga(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorPuntos = inscripciones;
      console.log ('AlumnosJuegoDeCompeticionLiga: ');
      console.log (this.listaAlumnosOrdenadaPorPuntos);
      // ordena la lista por puntos
      // tslint:disable-next-line:only-arrow-functions
      this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2) {
        console.log (obj2.PuntosTotalesAlumno + ' ; ' + obj1.PuntosTotalesAlumno);
        return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
      });
      console.log(this.listaAlumnosOrdenadaPorPuntos);
      this.TablaClasificacionTotal();
    });
  }

  // Recupera los EquipoJuegoDeCompeticionLiga del juegoSeleccionado.id ordenados por puntos de mayor a menor
  RecuperarInscripcionesEquiposJuego() {
    this.peticionesAPI.DameInscripcionesEquipoJuegoDeCompeticionLiga(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaEquiposOrdenadaPorPuntos = inscripciones;
      // ordena la lista por puntos
      // tslint:disable-next-line:only-arrow-functions
      this.listaEquiposOrdenadaPorPuntos = this.listaEquiposOrdenadaPorPuntos.sort(function(obj1, obj2) {
        console.log (obj2.PuntosTotalesEquipo + ' ; ' + obj1.PuntosTotalesEquipo);
        return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;
      });
      console.log(this.listaEquiposOrdenadaPorPuntos);
      this.TablaClasificacionTotal();
    });
  }

  // En función del modo (Individual/Equipos), recorremos la lisa de Alumnos o de Equipos y vamos rellenando el rankingJuegoDePuntos
  // ESTO DEBERIA IR AL SERVICIO DE CALCULO, PERO DE MOMENTO NO LO HAGO PORQUE SE GENERAN DOS TABLAS
  // Y NO COMPRENDO BIEN LA NECESIDAD DE LAS DOS

  TablaClasificacionTotal() {

    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.rankingAlumnoJuegoDeCompeticion = this.calculos.PrepararTablaRankingIndividualLiga (this.listaAlumnosOrdenadaPorPuntos,
                                                                                               this.alumnosDelJuego, this.jornadas,
                                                                                               this.enfrentamientosDelJuego);
      console.log ('Estoy en TablaClasificacionTotal(), la tabla que recibo desde calculos es:');
      console.log (this.rankingAlumnoJuegoDeCompeticion);
      this.datasourceAlumno = new MatTableDataSource(this.rankingAlumnoJuegoDeCompeticion);

    } else {
      this.rankingEquiposJuegoDeCompeticion = this.calculos.PrepararTablaRankingEquipoLiga (this.listaEquiposOrdenadaPorPuntos,
                                                                                            this.equiposDelJuego, this.jornadas,
                                                                                            this.enfrentamientosDelJuego);
      this.datasourceEquipo = new MatTableDataSource(this.rankingEquiposJuegoDeCompeticion);
      console.log('Estoy en TablaClasificacionTotal(), la tabla que recibo desde calculos es:');
      console.log (this.rankingEquiposJuegoDeCompeticion);
    }
  }

  applyFilter(filterValue: string) {
    this.datasourceAlumno.filter = filterValue.trim().toLowerCase();
  }

  applyFilterEquipo(filterValue: string) {
    this.datasourceEquipo.filter = filterValue.trim().toLowerCase();
  }

  editarjornadas() {

    console.log('Tomo las jornadas' + this.jornadas);
    console.log ('Aquí estará la información del juego');
    this.sesion.TomaJuego (this.juegoSeleccionado);
    this.JornadasCompeticion = this.calculos.DameTablaJornadasCompeticion( this.juegoSeleccionado, this.jornadas, undefined, undefined);
    console.log('Juego activo' + this.JornadasCompeticion);
    this.sesion.TomaDatosJornadas(
      this.jornadas,
      this.JornadasCompeticion);
  }

  DesactivarJuego() {
    console.log(this.juegoSeleccionado);
    this.peticionesAPI.CambiaEstadoJuegoDeCompeticionLiga(new Juego (this.juegoSeleccionado.Tipo, this.juegoSeleccionado.Modo,
      undefined, false, this.juegoSeleccionado.NumeroTotalJornadas, this.juegoSeleccionado.TipoJuegoCompeticion,
      this.juegoSeleccionado.NumeroParticipantesPuntuan, this.juegoSeleccionado.Puntos, this.juegoSeleccionado.NombreJuego),
      this.juegoSeleccionado.id, this.juegoSeleccionado.grupoId).subscribe(res => {
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
        Swal.fire('Desactivado', this.juegoSeleccionado.Tipo + ' desactivado correctamente', 'success');
      }
    });
  }

  Informacion(): void {

    console.log ('Aquí estará la información del juego');
    console.log ('Voy a por la información del juego seleccionado');
    this.sesion.TomaJuego (this.juegoSeleccionado);
    console.log('Tomo las jornadas' + this.jornadas);
    console.log('Los enfrentamientos del juego son: ');
    console.log(this.enfrentamientosDelJuego);
    this.JornadasCompeticion = this.calculos.DameTablaJornadasLiga(this.juegoSeleccionado, this.jornadas, this.enfrentamientosDelJuego);
    console.log('Las tablas JornadasCompeticionLiga son: ');
    console.log(this.JornadasCompeticion);
    // this.JornadasCompeticion = this.calculos.DameTablaJornadasCompeticion( this.juegoSeleccionado, this.jornadas, undefined, undefined);
    console.log ('Voy a por la información de las jornadas del juego');
    this.sesion.TomaDatosJornadas(this.jornadas,
                                      this.JornadasCompeticion);
    this.sesion.TomaTablaAlumnoJuegoDeCompeticion(this.rankingAlumnoJuegoDeCompeticion);
    this.sesion.TomaTablaEquipoJuegoDeCompeticion(this.rankingEquiposJuegoDeCompeticion);
  }

  seleccionarGanadorLiga(): void {
    console.log('Aquí estará el proceso para elegir el ganador');
    console.log ('Voy a por la información del juego seleccionado');
    this.sesion.TomaJuego (this.juegoSeleccionado);
    console.log('Tomo las jornadas' + this.jornadas);
    this.JornadasCompeticion = this.calculos.DameTablaJornadasCompeticion( this.juegoSeleccionado, this.jornadas, undefined, undefined);
    console.log ('Voy a por la información de las jornadas del juego');
    this.sesion.TomaDatosJornadas(this.jornadas,
                                  this.JornadasCompeticion);
    this.sesion.TomaTablaAlumnoJuegoDeCompeticion(this.rankingAlumnoJuegoDeCompeticion);
    this.sesion.TomaTablaEquipoJuegoDeCompeticion(this.rankingEquiposJuegoDeCompeticion);
    this.sesion.TomaInscripcionAlumno(this.listaAlumnosOrdenadaPorPuntos);
    this.sesion.TomaInscripcionEquipo(this.listaEquiposOrdenadaPorPuntos);
    this.sesion.TomaJuegosDePuntos(this.juegosActivosPuntos);
  }

  DameJuegosdePuntosActivos() {
    this.peticionesAPI.DameJuegoDePuntosGrupo(this.juegoSeleccionado.grupoId)
    .subscribe(juegosPuntos => {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < juegosPuntos.length; i++) {
        if (juegosPuntos[i].JuegoActivo === true) {
          this.juegosActivosPuntos.push(juegosPuntos[i]);
        }
      }
    });
    console.log('Juegos disponibles');
    console.log(this.juegosActivosPuntos);
    return this.juegosActivosPuntos;

  }
}

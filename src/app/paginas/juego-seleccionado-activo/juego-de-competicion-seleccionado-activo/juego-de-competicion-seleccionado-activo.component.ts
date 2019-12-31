import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
// Clases
// tslint:disable-next-line:max-line-length
import { Alumno, Juego, TablaJornadas, AlumnoJuegoDeCompeticionLiga, TablaAlumnoJuegoDeCompeticion, Jornada } from '../../../clases/index';

// Servicio
import { SesionService, PeticionesAPIService, CalculosService } from '../../../servicios/index';

// Imports para abrir diálogo y snackbar
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';


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

  // Recoge la inscripción de un alumno en el juego ordenada por puntos
  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeCompeticionLiga[];

  // Muestra la posición del alumno, el nombre y los apellidos del alumno y los puntos
  rankingJuegoDeCompeticion: TablaAlumnoJuegoDeCompeticion[] = [];

  // Columnas Tabla
  displayedColumnsAlumnos: string[] = ['posicion', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'puntos', ' '];

  jornadasEstablecidas: Jornada[];
  JornadasCompeticion: TablaJornadas[] = [];
  datasourceAlumno;
  datasourceEquipo;

  constructor(  public dialog: MatDialog,
                public snackBar: MatSnackBar,
                public sesion: SesionService,
                public peticionesAPI: PeticionesAPIService,
                public calculos: CalculosService,
                private location: Location) {}

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log(this.juegoSeleccionado);

    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.AlumnosDelJuego();
    }
    // Añadir opción equipo

    this.peticionesAPI.DameJornadasDeCompeticionLiga(this.juegoSeleccionado.id)
      .subscribe(inscripciones => {
        this.jornadasEstablecidas = inscripciones;
        console.log('Las jornadas son: ');
        console.log(this.jornadasEstablecidas);
      });


  }

  applyFilter(filterValue: string) {
    this.datasourceAlumno.filter = filterValue.trim().toLowerCase();
  }

  applyFilterEquipo(filterValue: string) {
    this.datasourceEquipo.filter = filterValue.trim().toLowerCase();
  }

  editarjornadas() {

    console.log('Tomo las jornadas' + this.jornadasEstablecidas);
    console.log ('Aquí estará la información del juego');
    this.sesion.TomaJuego (this.juegoSeleccionado);
    this.JornadasCompeticion = this.calculos.DameTablaJornadasLiga( this.juegoSeleccionado, this.jornadasEstablecidas);
    console.log('Juego activo' + this.JornadasCompeticion);
    this.sesion.TomaDatosParaJornadas(
      this.jornadasEstablecidas,
      this.JornadasCompeticion);
  }

  AlumnosDelJuego() {
    console.log ('Vamos a pos los alumnos');
    console.log('Id juegoSeleccionado: ' + this.juegoSeleccionado.id);
    this.peticionesAPI.DameAlumnosJuegoDeCompeticionLiga(this.juegoSeleccionado.id)
    .subscribe(alumnosJuego => {
      console.log ('Ya tengo los alumnos: ' );
      console.log (alumnosJuego);
      this.alumnosDelJuego = alumnosJuego;
      this.RecuperarInscripcionesAlumnoJuego();
    });
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

  // En función del modo (Individual/Equipos), recorremos la lisa de Alumnos o de Equipos y vamos rellenando el rankingJuegoDePuntos
  // ESTO DEBERIA IR AL SERVICIO DE CALCULO, PERO DE MOMENTO NO LO HAGO PORQUE SE GENERAN DOS TABLAS
  // Y NO COMPRENDO BIEN LA NECESIDAD DE LAS DOS
  TablaClasificacionTotal() {

    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.rankingJuegoDeCompeticion = this.calculos.PrepararTablaRankingIndividualCompeticion (
        this.listaAlumnosOrdenadaPorPuntos,
        this.alumnosDelJuego);
      console.log ('Ya tengo la tabla');
      console.log (this.rankingJuegoDeCompeticion);
      this.datasourceAlumno = new MatTableDataSource(this.rankingJuegoDeCompeticion);

    } else {  // Añadir caso Equipo

      // this.rankingEquiposJuegoDePuntos = this.calculos.PrepararTablaRankingEquipos (
      //   this.listaEquiposOrdenadaPorPuntos, this.equiposDelJuego, this.nivelesDelJuego
      // );
      // console.log ('ranking ' + this.rankingEquiposJuegoDePuntos);
      // this.datasourceEquipo = new MatTableDataSource(this.rankingEquiposJuegoDePuntos);

    }
  }

  DesactivarJuego() {
    console.log(this.juegoSeleccionado);
    this.peticionesAPI.CambiaEstadoJuegoDeCompeticionLiga(new Juego (this.juegoSeleccionado.Tipo, this.juegoSeleccionado.Modo,
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

  Informacion(): void {
    console.log ('Aquí estará la información del juego');
    this.sesion.TomaJuego (this.juegoSeleccionado);
  }

}

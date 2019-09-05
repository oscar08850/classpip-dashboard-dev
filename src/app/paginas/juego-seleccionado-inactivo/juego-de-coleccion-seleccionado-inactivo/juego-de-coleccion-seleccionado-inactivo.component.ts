import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';

// Clases
import { Alumno, Equipo, Juego, AlumnoJuegoDeColeccion, EquipoJuegoDeColeccion } from '../../../clases/index';

// Services
import { JuegoService, EquipoService, AlumnoService, JuegoDeColeccionService, ColeccionService} from '../../../servicios/index';

// Imports para abrir diálogo y snackbar
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { CompileShallowModuleMetadata } from '@angular/compiler';

@Component({
  selector: 'app-juego-de-coleccion-seleccionado-inactivo',
  templateUrl: './juego-de-coleccion-seleccionado-inactivo.component.html',
  styleUrls: ['./juego-de-coleccion-seleccionado-inactivo.component.scss']
})
export class JuegoDeColeccionSeleccionadoInactivoComponent implements OnInit {

  // Juego De Puntos seleccionado
  juegoSeleccionado: Juego;

  // Recupera la informacion del juego, los alumnos o los equipos, los puntos y los niveles del juego
  alumnosDelJuego: Alumno[];
  equiposDelJuego: Equipo[];

  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres desactivar el ';

  // tslint:disable-next-line:no-inferrable-types
  mensajeBorrar: string = 'Estás seguro/a de que quieres borrar el ';

  datasourceAlumno;
  datasourceEquipo;

  displayedColumnsAlumnos: string[] = ['nombreAlumno', 'primerApellido', 'segundoApellido', ' '];

  displayedColumnsEquipos: string[] = ['nombreEquipo', 'miembros', ' '];

  alumnosEquipo: Alumno[];

  inscripcionesAlumnos: AlumnoJuegoDeColeccion[];
  inscripcionesEquipos: EquipoJuegoDeColeccion[];

  constructor(private juegoService: JuegoService,
              private alumnoService: AlumnoService,
              private equipoService: EquipoService,
              private coleccionService: ColeccionService,
              private juegoDeColeccionService: JuegoDeColeccionService,
              public dialog: MatDialog,
              public snackBar: MatSnackBar,
              private location: Location) { }

  ngOnInit() {
    this.juegoSeleccionado = this.juegoService.RecibirJuegoDelServicio();


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
    this.juegoDeColeccionService.GET_AlumnosJuegoDeColeccion(this.juegoSeleccionado.id)
    .subscribe(alumnosJuego => {
      console.log(alumnosJuego);
      this.alumnosDelJuego = alumnosJuego;
      this.RecuperarInscripcionesAlumnoJuego();
      this.ColeccionDelJuego();
      this.juegoService.EnviarAlumnoJuegoAlServicio(this.alumnosDelJuego);
    });
  }

  // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor
  RecuperarInscripcionesAlumnoJuego() {
    this.juegoDeColeccionService.GET_InscripcionesAlumnoJuegoDeColeccion(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.inscripcionesAlumnos = inscripciones;
      console.log(this.inscripcionesAlumnos);
    });
  }

  // Recupera los equipos que pertenecen al juego
  EquiposDelJuego() {
    this.juegoDeColeccionService.GET_EquiposJuegoDeColeccion(this.juegoSeleccionado.id)
    .subscribe(equiposJuego => {
      this.equiposDelJuego = equiposJuego;
      console.log(equiposJuego);
      this.RecuperarInscripcionesEquiposJuego();
      this.ColeccionDelJuego();
      this.juegoService.EnviarEquipoJuegoAlServicio(this.equiposDelJuego);
    });
  }


    // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor
  RecuperarInscripcionesEquiposJuego() {

    this.juegoDeColeccionService.GET_InscripcionesEquipoJuegoDeColeccion(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.inscripcionesEquipos = inscripciones;
      console.log(this.inscripcionesEquipos);
      this.datasourceEquipo = new MatTableDataSource(this.equiposDelJuego);
      // this.OrdenarPorPuntosEquipos();
      // this.TablaClasificacionTotal();
    });
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


  AccederAlumno(alumno: Alumno) {

    this.alumnoService.EnviarAlumnoAlServicio(alumno);

    // tslint:disable-next-line:max-line-length
    this.juegoService.EnviarInscripcionAlServicio(this.inscripcionesAlumnos.filter(res => res.alumnoId === alumno.id)[0]);


  }


  AccederEquipo(equipo: Equipo) {

    this.equipoService.EnviarEquipoAlServicio(equipo);

    this.juegoService.EnviarInscripcionEquipoAlServicio(this.inscripcionesEquipos.filter(res => res.equipoId === equipo.id)[0]);

  }

  // Le enviaremos solo la colección del juego
  Informacion() {


  }

  ColeccionDelJuego() {
    this.coleccionService.GET_Coleccion(this.juegoSeleccionado.coleccionId)
    .subscribe(coleccion => {
      console.log('voy a enviar la coleccion');
      this.coleccionService.EnviarColeccionAlServicio(coleccion);
    });
  }

  ReactivarJuego() {
    console.log(this.juegoSeleccionado);
    this.juegoDeColeccionService.PUT_EstadoJuegoDeColeccion(new Juego (this.juegoSeleccionado.Tipo, this.juegoSeleccionado.Modo,
      undefined, true), this.juegoSeleccionado.id, this.juegoSeleccionado.grupoId).subscribe(res => {
        if (res !== undefined) {
          console.log(res);
          console.log('juego reactivado');
          this.location.back();
        }
      });
  }

  AbrirDialogoConfirmacionReactivar(): void {

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        nombre: this.juegoSeleccionado.Tipo,
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.ReactivarJuego();
        this.snackBar.open(this.juegoSeleccionado.Tipo + ' reactivado correctamente', 'Cerrar', {
          duration: 2000,
        });
      }
    });
  }

  EliminarJuego() {
    this.juegoDeColeccionService.DELETE_JuegoDeColeccion(this.juegoSeleccionado.id, this.juegoSeleccionado.grupoId)
    .subscribe(res => {
      console.log('Juego eliminado');
      this.location.back();
    });
  }

  AbrirDialogoConfirmacionEliminar(): void {

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensajeBorrar,
        nombre: this.juegoSeleccionado.Tipo,
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.EliminarJuego();
        this.snackBar.open(this.juegoSeleccionado.Tipo + ' eliminado correctamente', 'Cerrar', {
          duration: 2000,
        });
      }
    });
  }
}

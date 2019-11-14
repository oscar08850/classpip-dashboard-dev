import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { ResponseContentType, Http, Response } from '@angular/http';

// Imports para abrir diálogo y snackbar
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogoConfirmacionComponent } from '../../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';

import { Alumno, Equipo, Juego, AlumnoJuegoDeColeccion, EquipoJuegoDeColeccion,
 Album, AlbumEquipo, Coleccion, Cromo } from '../../../../clases/index';

// Services
import { JuegoService, EquipoService, ColeccionService, JuegoDeColeccionService } from '../../../../servicios/index';

import {SesionService, PeticionesAPIService, CalculosService} from '../../../../servicios/index';

import { Location } from '@angular/common';

@Component({
  selector: 'app-asignar-cromos',
  templateUrl: './asignar-cromos.component.html',
  styleUrls: ['./asignar-cromos.component.scss']
})
export class AsignarCromosComponent implements OnInit {

  fechaAsignacionCromo: Date;
  fechaString: string;

  juegoSeleccionado: Juego;

  datasourceAlumno;
  datasourceEquipo;
  dataSource;

  alumnosDelJuego: Alumno[];
  equiposDelJuego: Equipo[];

  coleccion: Coleccion;
  cromosColeccion: Cromo[];

  displayedColumnsAlumno: string[] = ['select', 'nombreAlumno', 'primerApellido', 'segundoApellido'];
  selection = new SelectionModel<Alumno>(true, []);

  displayedColumnsEquipos: string[] = ['select', 'nombreEquipo', 'miembros'];
  selectionEquipos = new SelectionModel<Equipo>(true, []);

  seleccionados: boolean[];
  seleccionadosEquipos: boolean[];

  cromoSeleccionadoId: number;
  cromoSeleccionado: Cromo;
  imagenCromoSeleccionado: string;

  alumnosEquipo: Alumno[];

  inscripcionesAlumnos: AlumnoJuegoDeColeccion[];
  inscripcionesEquipos: EquipoJuegoDeColeccion[];


  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres asignar este cromo';

  // tslint:disable-next-line:no-inferrable-types
  mensajeAleatorio: string = 'Estás seguro/a de que quieres asignar este número de cromos aleatoriamente';

  // tslint:disable-next-line:ban-types
  isDisabled: Boolean = true;


  // Para asignar cromos random
  probabilidadCromos: number[] = [];
  indexCromo: number;
  // tslint:disable-next-line:no-inferrable-types
  numeroCromosRandom: number = 1;
  botonTablaDesactivado = true;

  constructor( private juegoService: JuegoService,
               private equipoService: EquipoService,
               private coleccionService: ColeccionService,
               private sesion: SesionService,
               private peticionesAPI: PeticionesAPIService,
               private calculos: CalculosService,
               private juegoDeColeccionService: JuegoDeColeccionService,
               public dialog: MatDialog,
               private http: Http,
               public location: Location,
               public snackBar: MatSnackBar) { }

  ngOnInit() {

    this.coleccion = this.sesion.DameColeccion();
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log ('Ya estamos ' + this.coleccion);

    this.CromosColeccion();
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.alumnosDelJuego = this.sesion.DameAlumnosDelJuego();
      this.RecuperarInscripcionesAlumnoJuego();
      this.dataSource = new MatTableDataSource(this.alumnosDelJuego);
    } else {
      this.equiposDelJuego = this.sesion.DameEquiposDelJuego();
      this.RecuperarInscripcionesEquiposJuego();
      this.dataSource = new MatTableDataSource(this.equiposDelJuego);
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
  ActualizarBotonTabla() {
    if (this.selection.selected.length === 0) {
      this.botonTablaDesactivado = true;
    } else {
      this.botonTablaDesactivado = false;
    }
  }




  applyFilter(filterValue: string) {

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterEquipo(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  CromosColeccion() {
    // Busca los cromos dela coleccion en la base de datos
    this.peticionesAPI.DameCromosColeccion(this.coleccion.id)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.cromosColeccion = res;
        this.cromoSeleccionadoId = this.cromosColeccion[0].id;
        this.cromoSeleccionado = this.cromosColeccion[0];
        this.GET_ImagenCromo();

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.cromosColeccion.length; i ++) {
          if (this.cromosColeccion[i].Probabilidad === 'Muy Baja') {
            this.probabilidadCromos[i] = 3;

          } else if (this.cromosColeccion[i].Probabilidad === 'Baja') {

            this.probabilidadCromos[i] = 7;

          } else if (this.cromosColeccion[i].Probabilidad === 'Media') {

            this.probabilidadCromos[i] = 20;

          } else if (this.cromosColeccion[i].Probabilidad === 'Alta') {

            this.probabilidadCromos[i] = 30;

          } else {

            this.probabilidadCromos[i] = 40;

          }
        }

        console.log(res);
      } else {
        console.log('No hay cromos en esta coleccion');
        this.cromosColeccion = undefined;
      }
    });
  }

  TraeCromo() {
    // Cuando el usuario selecciona el cromo a asignar llamamos a esta función
    console.log(this.cromoSeleccionadoId);
    this.cromoSeleccionado = this.cromosColeccion.filter(res => res.id === Number(this.cromoSeleccionadoId))[0];
    console.log(this.cromosColeccion.filter(res => res.id === Number(this.cromoSeleccionadoId))[0]);
    this.GET_ImagenCromo();
  }

  // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor
  RecuperarInscripcionesAlumnoJuego() {
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeColeccion(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.inscripcionesAlumnos = inscripciones;
      console.log(this.inscripcionesAlumnos);
    });
  }

      // Recupera las inscripciones de los equipos en el juego y los puntos que tienen y los ordena de mayor a menor valor
  RecuperarInscripcionesEquiposJuego() {

    this.peticionesAPI.DameInscripcionesEquipoJuegoDeColeccion(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.inscripcionesEquipos = inscripciones;
      console.log(this.inscripcionesEquipos);
      this.datasourceEquipo = new MatTableDataSource(this.equiposDelJuego);
      // this.OrdenarPorPuntosEquipos();
      // this.TablaClasificacionTotal();
    });
  }

  AsignarCromo() {

    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('el juego es individual');
      this.AsignarCromoAlumnos(this.cromoSeleccionadoId);

    } else {
      console.log('El juego es en equipo');
      this.AsignarCromoEquipos(this.cromoSeleccionadoId);
    }


  }


  AsignarCromoAlumnos(cromoSeleccionado) {

    this.dataSource.data.forEach
    (row => {
                    if (this.selection.isSelected(row))  {
                      let alumno: Alumno;
                      alumno = row;
                      console.log(alumno.Nombre + ' seleccionado');

                      let alumnoJuegoDeColeccion: AlumnoJuegoDeColeccion;
                      alumnoJuegoDeColeccion = this.inscripcionesAlumnos.filter(res => res.alumnoId === alumno.id)[0];
                      console.log(alumnoJuegoDeColeccion);

                      this.peticionesAPI.AsignarCromoAlumno(new Album (alumnoJuegoDeColeccion.id, cromoSeleccionado))
                      .subscribe(res => {

                        console.log(res);

                      });

                    }
            }
    );
  }


  AsignarCromoEquipos(cromoSeleccionado) {

    this.dataSource.data.forEach
    (row => {
                if (this.selection.isSelected(row))  {

                        let equipo: Equipo;
                        equipo = row;
                        console.log(equipo.Nombre + ' seleccionado');

                        let equipoJuegoDeColeccion: EquipoJuegoDeColeccion;
                        equipoJuegoDeColeccion = this.inscripcionesEquipos.filter(res => res.equipoId === equipo.id)[0];
                        console.log(equipoJuegoDeColeccion);

                        this.peticionesAPI.AsignarCromoEquipo(new AlbumEquipo (equipoJuegoDeColeccion.id, cromoSeleccionado))
                        .subscribe(res => {

                          console.log(res);
                        });
                }
            }
    );
  }

  AsignarCromosAleatorios() {
    // const randomIndex = Math.floor(Math.random() * this.cromosColeccion.length);
    // console.log(randomIndex);
    // const randomCromo = this.cromosColeccion[randomIndex];
    // console.log(randomCromo);

    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('el juego es individual');
      this.AsignarCromosAleatoriosAlumno();

    } else {
      console.log('El juego es en equipo');
      this.AsignarCromosAleatoriosEquipo();
    }
  }


  AsignarCromosAleatoriosAlumno() {
    this.dataSource.data.forEach
    (row =>  {  if (this.selection.isSelected(row))  {
                this.calculos.AsignarCromosAleatoriosAlumno (
                  row, this.inscripcionesAlumnos, this.numeroCromosRandom, this.probabilidadCromos, this.cromosColeccion
                  );
                }
          });
  }

  AsignarCromosAleatoriosEquipo() {

    this.dataSource.data.forEach
    (row => {
              if (this.selection.isSelected(row))  {
                // tslint:disable-next-line:max-line-length
                this.calculos.AsignarCromosAleatoriosEquipo (row, this.inscripcionesEquipos, this.numeroCromosRandom, this.probabilidadCromos, this.cromosColeccion);
              }
    });
  }

  AlumnosDelEquipo(equipo: Equipo) {
    console.log(equipo);

    this.peticionesAPI.DameAlumnosEquipo(equipo.id)
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

  AbrirDialogoConfirmacionAsignarCromo(): void {

    let cromo: Cromo;
    cromo = this.cromosColeccion.filter(res => res.id === Number(this.cromoSeleccionadoId))[0];
    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',

      data: {
        mensaje: this.mensaje,
        nombre: cromo.Nombre
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.AsignarCromo();
        this.snackBar.open('Cromo asignado correctamente', 'Cerrar', {
          duration: 2000,
        });
      }
    });
  }

  AbrirDialogoConfirmacionAsignarCromosAleatorios(): void {

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensajeAleatorio,
        nombre: ''
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.AsignarCromosAleatorios();
        this.snackBar.open('Cromos asignados correctamente', 'Cerrar', {
          duration: 2000,
        });
      }
    });
  }

    // Busca la imagen que tiene el nombre del cromo.Imagen y lo carga en imagenCromo
    GET_ImagenCromo() {

      if (this.cromoSeleccionado.Imagen !== undefined ) {
        // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
        this.peticionesAPI.DameImagenCromo (this.cromoSeleccionado.Imagen)
        .subscribe(response => {
          const blob = new Blob([response.blob()], { type: 'image/jpg'});

          const reader = new FileReader();
          reader.addEventListener('load', () => {
            this.imagenCromoSeleccionado = reader.result.toString();
          }, false);

          if (blob) {
            reader.readAsDataURL(blob);
          }
      });
      }
  }
  goBack() {
    this.location.back();
  }

}

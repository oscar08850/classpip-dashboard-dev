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


  constructor( private juegoService: JuegoService,
               private equipoService: EquipoService,
               private coleccionService: ColeccionService,
               private juegoDeColeccionService: JuegoDeColeccionService,
               public dialog: MatDialog,
               private http: Http,
               public snackBar: MatSnackBar) { }

  ngOnInit() {

    this.coleccion = this.coleccionService.RecibirColeccionDelServicio();
    this.juegoSeleccionado = this.juegoService.RecibirJuegoDelServicio();

    this.CromosColeccion();
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.alumnosDelJuego = this.juegoService.RecibirAlumnoJuegoDelServicio();
      this.RecuperarInscripcionesAlumnoJuego();

      this.seleccionados = Array(this.alumnosDelJuego.length).fill(false);

      this.datasourceAlumno = new MatTableDataSource(this.alumnosDelJuego);
    } else {
      this.equiposDelJuego = this.juegoService.RecibirEquipoJuegoDelServicio();
      this.RecuperarInscripcionesEquiposJuego();
      this.seleccionadosEquipos = Array(this.equiposDelJuego.length).fill(false);
    }
  }

  applyFilter(filterValue: string) {
    this.datasourceAlumno.filter = filterValue.trim().toLowerCase();
  }

  applyFilterEquipo(filterValue: string) {
    this.datasourceEquipo.filter = filterValue.trim().toLowerCase();
  }

  CromosColeccion() {
    // Busca los cromos dela coleccion en la base de datos
    this.coleccionService.GET_CromosColeccion(this.coleccion.id)
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


// Funciones para tabla
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {

    const numSelected = this.selection.selected.length;
    const numRows = this.alumnosDelJuego.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.alumnosDelJuego.forEach(row => {
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
  checkboxLabel(row?: Alumno): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  // Pone a true o false la posición del vector seleccionados que le pasamos (i) en función de su estado
  Seleccionar(i: number) {

    if (!this.selection.isSelected(this.alumnosDelJuego[i]) === true) {
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
    for (let i = 0; i < this.alumnosDelJuego.length; i++) {

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
    const numRows = this.equiposDelJuego.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selectionEquipos. */
  masterToggleEquipos() {
    this.isAllSelectedEquipos() ?
        this.selectionEquipos.clear() :
        this.equiposDelJuego.forEach(row => {
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
  checkboxLabelEquipo(row?: Equipo): string {
    if (!row) {
      return `${this.isAllSelectedEquipos() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionEquipos.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  // Pone a true o false la posición del vector seleccionados que le pasamos (i) en función de su estado
  SeleccionarEquipo(i: number) {

    if (!this.selectionEquipos.isSelected(this.equiposDelJuego[i]) === true) {
      this.seleccionadosEquipos[i] = true;
    } else {
      this.seleccionadosEquipos[i] = false;
    }

    this.Disabled();
  }

  // Pone a true or false todo el vector seleccionado
  SeleccionarTodosEquipos() {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.equiposDelJuego.length; i++) {

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

  BotonDesactivado() {

    console.log('voy a ver si hemos seleccionado algun cromo');
    if (this.cromoSeleccionadoId !== undefined) {
      console.log('hay algo, disabled');
      this.isDisabled = false;
    } else {
      console.log('no hay nada');
      this.isDisabled = true;
    }
  }

  Disabled() {
    console.log(this.cromoSeleccionadoId);
    this.cromoSeleccionado = this.cromosColeccion.filter(res => res.id === Number(this.cromoSeleccionadoId))[0];
    console.log(this.cromosColeccion.filter(res => res.id === Number(this.cromoSeleccionadoId))[0]);
    this.GET_ImagenCromo();
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

  // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor
  RecuperarInscripcionesAlumnoJuego() {
    this.juegoDeColeccionService.GET_InscripcionesAlumnoJuegoDeColeccion(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.inscripcionesAlumnos = inscripciones;
      console.log(this.inscripcionesAlumnos);
    });
  }

      // Recupera las inscripciones de los equipos en el juego y los puntos que tienen y los ordena de mayor a menor valor
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

  AsignarCromo() {

    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('el juego es individual');
      this.AsignarCromoAlumnos(this.cromoSeleccionadoId);

    } else {
      console.log('El juego es en equipo');
      this.AsignarCromoEquipos(this.cromoSeleccionadoId);
    }

    this.selection.clear();
    this.selectionEquipos.clear();
    this.isDisabled = true;



  }

  AsignarCromoAlumnos(cromoSeleccionado) {

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.seleccionados.length; i++) {

       // Buscamos los alumnos que hemos seleccionado
       if (this.seleccionados [i]) {

        let alumno: Alumno;
        alumno = this.alumnosDelJuego[i];
        console.log(alumno.Nombre + ' seleccionado');

        let alumnoJuegoDeColeccion: AlumnoJuegoDeColeccion;
        alumnoJuegoDeColeccion = this.inscripcionesAlumnos.filter(res => res.alumnoId === alumno.id)[0];
        console.log(alumnoJuegoDeColeccion);

        this.juegoDeColeccionService.POST_AsignarCromoAlumno(new Album (alumnoJuegoDeColeccion.id, cromoSeleccionado))
        .subscribe(res => {

          console.log(res);

        });

       }
    }
    this.seleccionados = Array(this.alumnosDelJuego.length).fill(false);
  }

  AsignarCromoEquipos(cromoSeleccionado) {

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.seleccionadosEquipos.length; i++) {

       // Buscamos los alumnos que hemos seleccionado
       if (this.seleccionadosEquipos [i]) {

        let equipo: Equipo;
        equipo = this.equiposDelJuego[i];
        console.log(equipo.Nombre + ' seleccionado');

        let equipoJuegoDeColeccion: EquipoJuegoDeColeccion;
        equipoJuegoDeColeccion = this.inscripcionesEquipos.filter(res => res.equipoId === equipo.id)[0];
        console.log(equipoJuegoDeColeccion);

        this.juegoDeColeccionService.POST_AsignarCromoEquipo(new AlbumEquipo (equipoJuegoDeColeccion.id, cromoSeleccionado))
        .subscribe(res => {

          console.log(res);
        });
      }
    }

    this.seleccionadosEquipos = Array(this.equiposDelJuego.length).fill(false);
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

  randomIndex(
    probabilities: number[],
    randomGenerator: () => number = Math.random): number {

      // get the cumulative distribution function
      let acc = 0;
      const cdf = probabilities
          .map(v => acc += v) // running total [4,7,9,10]
          .map(v => v / acc); // normalize to max 1 [0.4,0.7,0.9,1]

      // pick a random number between 0 and 1
      const randomNumber = randomGenerator();

      // find the first index of cdf where it exceeds randomNumber
      // (findIndex() is in ES2015+)
      return cdf.findIndex(p => randomNumber < p);
  }

  AsignarCromosAleatoriosAlumno() {

    for (let i = 0; i < this.seleccionados.length; i++) {

      // Buscamos los alumnos que hemos seleccionado
      if (this.seleccionados [i]) {

        let alumno: Alumno;
        alumno = this.alumnosDelJuego[i];
        console.log(alumno.Nombre + ' seleccionado');

        let alumnoJuegoDeColeccion: AlumnoJuegoDeColeccion;
        alumnoJuegoDeColeccion = this.inscripcionesAlumnos.filter(res => res.alumnoId === alumno.id)[0];
        console.log(alumnoJuegoDeColeccion);

        // tslint:disable-next-line:prefer-const
        let hits = this.probabilidadCromos.map(x => 0);


        for (let k = 0; k < this.numeroCromosRandom; k++) {

          console.log('Voy a hacer el post del cromo ' + k);

          this.indexCromo = this.randomIndex(this.probabilidadCromos);
          hits[this.indexCromo]++;

          console.log(this.cromosColeccion[this.indexCromo].Nombre);

          this.juegoDeColeccionService.POST_AsignarCromoAlumno(new Album (alumnoJuegoDeColeccion.id,
             this.cromosColeccion[this.indexCromo].id)).subscribe(res => {

            console.log(res);

            this.selection.clear();
            this.selectionEquipos.clear();
            this.isDisabled = true;
            this.seleccionados = Array(this.alumnosDelJuego.length).fill(false);
          });

        }
        console.log(hits);
      }
    }
  }

  AsignarCromosAleatoriosEquipo() {

    for (let i = 0; i < this.seleccionadosEquipos.length; i++) {

      // Buscamos los alumnos que hemos seleccionado
      if (this.seleccionadosEquipos [i]) {

        let equipo: Equipo;
        equipo = this.equiposDelJuego[i];
        console.log(equipo.Nombre + ' seleccionado');

        let equipoJuegoDeColeccion: EquipoJuegoDeColeccion;
        equipoJuegoDeColeccion = this.inscripcionesEquipos.filter(res => res.equipoId === equipo.id)[0];
        console.log(equipoJuegoDeColeccion);

        // tslint:disable-next-line:prefer-const
        let hits = this.probabilidadCromos.map(x => 0);


        for (let k = 0; k < this.numeroCromosRandom; k++) {

          console.log('Voy a hacer el post del cromo ' + k);

          this.indexCromo = this.randomIndex(this.probabilidadCromos);
          hits[this.indexCromo]++;

          console.log(this.cromosColeccion[this.indexCromo].Nombre);

          this.juegoDeColeccionService.POST_AsignarCromoEquipo(new AlbumEquipo (equipoJuegoDeColeccion.id,
            this.cromosColeccion[this.indexCromo].id)).subscribe(res => {

            console.log(res);

            this.selection.clear();
            this.selectionEquipos.clear();
            this.isDisabled = true;
            this.seleccionadosEquipos = Array(this.equiposDelJuego.length).fill(false);
          });
        }
        console.log(hits);
      }
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
        this.http.get('http://localhost:3000/api/imagenes/ImagenCromo/download/' + this.cromoSeleccionado.Imagen,
        { responseType: ResponseContentType.Blob })
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

  prueba() {
    // const randomIndex = Math.floor(Math.random() * this.cromosColeccion.length);
    // console.log(randomIndex);
    // const randomCromo = this.cromosColeccion[randomIndex];
    // console.log(randomCromo);




        // tslint:disable-next-line:prefer-const
        let hits = this.probabilidadCromos.map(x => 0);


        for (let k = 0; k < 10000; k++) {


          this.indexCromo = this.randomIndex(this.probabilidadCromos);
          hits[this.indexCromo]++;


        }
        console.log(hits);
        for (let i = 0; i < this.probabilidadCromos.length; i++) {
          console.log('' + i + ': prob=' + this.cromosColeccion[i].Nombre +
            ', freq=' + (100 * hits[i] / 10000).toFixed(1));
      }
      }

}

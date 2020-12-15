import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

// Imports para abrir diálogo mostrar cromos
import { MatDialog } from '@angular/material';
import { DialogMostrarCromosComponent } from './dialog-mostrar-cromos/dialog-mostrar-cromos.component';

import { Coleccion, Juego, Alumno, Equipo} from 'src/app/clases/index';
// Services

   // Services
import { SesionService, PeticionesAPIService } from '../../../servicios/index';

@Component({
  selector: 'app-asignacion-coleccion-juego',
  templateUrl: './asignacion-coleccion-juego.component.html',
  styleUrls: ['./asignacion-coleccion-juego.component.scss']
})
export class AsignacionColeccionJuegoComponent implements OnInit {
  // Para comunicar el nombre de la colección seleccionada a componente padre
  @Output() emisorColeccion = new EventEmitter <Coleccion>();
  grupoId: number;
  profesorId: number;

  colecciones: Coleccion[];

  alumnos: Alumno[];
  equipos: Equipo[];

  datasourceColecciones;

  // tslint:disable-next-line:ban-types
  isDisabled: Boolean = true;

  displayedColumns: string[] = ['nombreColeccion', ' '];


  juego: Juego;

  // Para que al hacer click se quede la fila marcada
  selectedRowIndex = -1;

  coleccionSeleccionada: Coleccion;
  muestroPublicas = false;
  coleccionesPublicas: Coleccion[];

  constructor(
               private sesion: SesionService,
               private peticionesAPI: PeticionesAPIService,
               public dialog: MatDialog) { }

  ngOnInit() {

    this.profesorId = this.sesion.DameProfesor().id;
    this.grupoId = this.sesion.DameGrupo().id;
    this.alumnos = this.sesion.DameAlumnosGrupo();
    this.TraeEquiposDelGrupo();
    this.TraeListaDeColecciones();
    this.TraeColeccionesPublicas();
  }

  // RECUPERA LOS EQUIPOS DEL GRUPO
  TraeEquiposDelGrupo() {
    this.peticionesAPI.DameEquiposDelGrupo(this.grupoId)
    .subscribe(equipos => {
      if (equipos !== undefined) {
        this.equipos = equipos;
      } else {
        // Mensaje al usuario
        console.log('Este grupo aun no tiene equipos');
      }

    });
  }

  applyFilter(filterValue: string) {
    this.datasourceColecciones.filter = filterValue.trim().toLowerCase();
  }

  // Para que al hacer click se quede la fila marcada
  highlight(row) {
    this.selectedRowIndex = row.id;
  }

  TraeListaDeColecciones() {
    this.peticionesAPI.DameColeccionesDelProfesor(this.profesorId)
    .subscribe(colecciones => {
      if (colecciones !== undefined) {
        this.colecciones = colecciones;
        this.datasourceColecciones = new MatTableDataSource(this.colecciones);
      } else {
        // Mensaje al usuario
        console.log('Este profesor no tiene colecciones');
      }
    });
  }



  TraeColeccionesPublicas() {

    this.peticionesAPI.DameColeccionesPublicas()
    .subscribe (publicas => {
      // me quedo con los públicos de los demás
      const publicasDeOtros = publicas.filter (coleccion => coleccion.profesorId !== Number(this.profesorId));
      // traigo los profesores para añadir a los publicos el nombre del propietario
      this.peticionesAPI.DameProfesores ()
      .subscribe (profesores => {
        publicasDeOtros.forEach (coleccion => {
          const propietario = profesores.filter (profesor => profesor.id === coleccion.profesorId)[0];
          coleccion.Nombre = coleccion.Nombre + '(' + propietario.Nombre + ' ' + propietario.PrimerApellido + ')';
        });
        this.coleccionesPublicas = publicasDeOtros;

      });
    });
  }

  ColeccionSeleccionada(coleccion: Coleccion) {
    // Comunico el nombre de la colección seleccionada al padre
    this.coleccionSeleccionada = coleccion;
    this.emisorColeccion.emit (coleccion);
    this.isDisabled = false;
    console.log(this.coleccionSeleccionada);
  }


  AbrirDialogoMostrarCromos(coleccionSeleccionada: Coleccion): void {

    const dialogRef = this.dialog.open(DialogMostrarCromosComponent, {
      width: '1000px',
      maxHeight: '600px',
      data: {
        coleccion: coleccionSeleccionada
      }
    });
  }

  MostrarPublicas() {
    this.muestroPublicas = true;
    this.datasourceColecciones = new MatTableDataSource(this.colecciones.concat (this.coleccionesPublicas));
  }

  QuitarPublicas() {
    this.muestroPublicas = false;
    this.datasourceColecciones = new MatTableDataSource(this.colecciones);
  }


 }

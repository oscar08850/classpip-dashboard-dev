import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

// Imports para abrir diálogo mostrar cromos
import { MatDialog } from '@angular/material';

import { Coleccion, Juego, Alumno, Equipo} from 'src/app/clases/index';
// Services

   // Services
import { SesionService, PeticionesAPIService } from '../../../servicios/index';
import { SelectionModel } from '@angular/cdk/collections';

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

  
  displayedColumns: string[] = ['select', 'nombreColeccion'];
  selection = new SelectionModel<Coleccion>(true, []);


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
    console.log ('onInit de ASIGNACION');

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
    console.log ('voy a traer colecciones');
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
          if (propietario) {
            coleccion.Nombre = coleccion.Nombre + '(' + propietario.Nombre + ' ' + propietario.PrimerApellido + ')';
          }
        });
        this.coleccionesPublicas = publicasDeOtros;

      });
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

 
  HaSeleccionado() {
    if (this.selection.selected.length === 0) {
     return false;
    } else {
      return true;
    }
  }
  Marcar(row) {
    if (this.selection.isSelected(row)) {
      this.selection.deselect(row);
    } else {
      this.selection.clear();
      this.selection.select(row);
    }
  }

  AsignarColeccionAlJuego() {
    let coleccionSeleccionada;
    console.log ('Vamos a agregar LOS PUNTOS');
    const tiposDePuntosSeleccionados = [];
    this.datasourceColecciones.data.forEach ( row => {
      if (this.selection.isSelected(row)) {
        // tiposDePuntosSeleccionados.push (row);
        console.log ('hemos elegido ', row);
        coleccionSeleccionada = row;

      }
    });
    
    this.emisorColeccion.emit (coleccionSeleccionada);
    //   this.isDisabled = false;

 

  }



 }

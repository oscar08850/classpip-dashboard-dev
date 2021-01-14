import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

// Imports para abrir diálogo mostrar cromos
import { MatDialog, MatTabGroup } from '@angular/material';
import { Coleccion, Juego, Alumno, Equipo, AlumnoJuegoDeColeccion,
 EquipoJuegoDeColeccion,
 JuegoDeAvatar,
 FamiliaAvatares} from 'src/app/clases/index';

 /* Necesario para controlar qué filas están seleccionadas */
import {SelectionModel} from '@angular/cdk/collections';
// Services

   // Services
import { SesionService, PeticionesAPIService, CalculosService } from '../../../servicios/index';
@Component({
  selector: 'app-asignar-familias-juego-avatares',
  templateUrl: './asignar-familias-juego-avatares.component.html',
  styleUrls: ['./asignar-familias-juego-avatares.component.scss']
})
export class AsignarFamiliasJuegoAvataresComponent implements OnInit {

  // Para comunicar el nombre de la colección seleccionada a componente padre
  @Output() emisorFamiliasElegidas = new EventEmitter <number []>();
  grupoId: number;
  profesorId: number;

  familias: FamiliaAvatares[];
  familiasPublicas: FamiliaAvatares[];
  familiasElegidas: number[] = [];

  alumnos: Alumno[];
  equipos: Equipo[];

  datasource;

  // tslint:disable-next-line:ban-types
  isDisabled: Boolean = true;

  displayedColumns: string[] = ['select', 'nombreFamilia'];


  juego: JuegoDeAvatar;

  // Para que al hacer click se quede la fila marcada
  selectedRowIndex = -1;

  /* Estructura necesaria para determinar que filas son las que se han seleccionado */
  selection = new SelectionModel<any>(true, []);
  muestroPublicas = false;

  constructor(
               private sesion: SesionService,
               private peticionesAPI: PeticionesAPIService,
               public dialog: MatDialog) { }

  ngOnInit() {

    this.profesorId = this.sesion.DameProfesor().id;
    this.TraeFamilias();
    this.TraeFamiliasDeAvataresPublicas();
  }


  // Para que al hacer click se quede la fila marcada
  highlight(row) {
    this.selectedRowIndex = row.id;
  }

  TraeFamilias() {
    this.peticionesAPI.DameFamiliasAvataresProfesor(this.profesorId)
    .subscribe(familias => {
      if (familias !== undefined) {
        this.familias = familias;
        this.datasource = new MatTableDataSource(this.familias);
      } else {
        // Mensaje al usuario
        console.log('Este profesor no tiene colecciones');
      }
    });
  }

  TraeFamiliasDeAvataresPublicas() {

    this.peticionesAPI.DameFamiliasAvataresPublicas()
    .subscribe (publicas => {
      // me quedo con los públicos de los demás
      const publicasDeOtros = publicas.filter (familia => familia.profesorId !== Number(this.profesorId));
      // traigo los profesores para añadir a los publicos el nombre del propietario
      this.peticionesAPI.DameProfesores ()
      .subscribe (profesores => {
        publicasDeOtros.forEach (familia => {
          const propietario = profesores.filter (profesor => profesor.id === familia.profesorId)[0];
          familia.NombreFamilia = familia.NombreFamilia + '(' + propietario.Nombre + ' ' + propietario.Apellido + ')';
        });
        this.familiasPublicas = publicasDeOtros;

      });
    });
  }


  // AgregaFamilia(familia: FamiliaAvatares) {
  //   this.familiasElegidas.push (familia);
  // }
  AcabarSeleccion() {
      this.datasource.data.forEach
        (row => {
                  if (this.selection.isSelected(row))  {
                    this.familiasElegidas.push (row.id);
                  }
              }
        );
      this.emisorFamiliasElegidas.emit (this.familiasElegidas);
  }


  /* Para averiguar si todas las filas están seleccionadas */
  IsAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.datasource.data.length;
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
      this.datasource.data.forEach(row => this.selection.select(row));
    }
  }
  MostrarPublicas() {
    this.muestroPublicas = true;
    this.datasource = new MatTableDataSource(this.familias.concat (this.familiasPublicas));
  }

  QuitarPublicas() {
    this.muestroPublicas = false;
    this.datasource = new MatTableDataSource(this.familias);
  }


}

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

  constructor(
               private sesion: SesionService,
               private peticionesAPI: PeticionesAPIService,
               public dialog: MatDialog) { }

  ngOnInit() {

    this.profesorId = this.sesion.DameProfesor().id;
    this.TraeFamilias();

    this.grupoId = this.juego.grupoId;
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


  // /* Esta función decide si el boton debe estar activo (si hay al menos
  // una fila seleccionada) o si debe estar desactivado (si no hay ninguna fila seleccionada) */
  // ActualizarBotonTabla() {
  //   if (this.selection.selected.length === 0) {
  //     this.botonTablaDesactivado = true;
  //   } else {
  //     this.botonTablaDesactivado = false;
  //   }
  // }




}

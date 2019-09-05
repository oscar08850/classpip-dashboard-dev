import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';

// Clases
import { Grupo, Alumno } from '../../clases/index';

// Servicios
import { GrupoService, MatriculaService, AlumnoService } from '../../servicios/index';
// Imports para abrir diálogo agregar alumno/confirmar eliminar grupo
import { MatDialog, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-pasar-lista',
  templateUrl: './pasar-lista.component.html',
  styleUrls: ['./pasar-lista.component.scss']
})
export class PasarListaComponent implements OnInit {
  // PARÁMETROS QUE RECOGEMOS DEL COMPONENTE GRUPO
  grupoSeleccionado: Grupo;
  profesorId: number;
  alumnosGrupoSeleccionado: Alumno[];

  //
  alumnosSeleccionados: Alumno[];


  dataSource;

  displayedColumns: string[] = ['select', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'alumnoId'];
  selection = new SelectionModel<Alumno>(true, []);

  seleccionados: boolean[];


  constructor( private grupoService: GrupoService,
               private alumnoService: AlumnoService,
               public dialog: MatDialog,
               public snackBar: MatSnackBar,
               private location: Location) { }

  ngOnInit() {
    this.grupoSeleccionado = this.grupoService.RecibirGrupoDelServicio();
    this.profesorId = this.grupoSeleccionado.profesorId;
    this.alumnosGrupoSeleccionado = this.alumnoService.RecibirListaAlumnosDelServicio();
    console.log(this.grupoSeleccionado);
    console.log(this.profesorId);
    console.log(this.alumnosGrupoSeleccionado);

    if (this.alumnosGrupoSeleccionado !== undefined) {
      // Al principio no hay alumnos seleccionados para eliminar
      this.seleccionados = Array(this.alumnosGrupoSeleccionado.length).fill(false);
      this.dataSource = new MatTableDataSource(this.alumnosGrupoSeleccionado);
    }
  }

  // Filtro para alumnos
    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.alumnosGrupoSeleccionado.length;
      return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
      this.isAllSelected() ?
          this.selection.clear() :
          this.alumnosGrupoSeleccionado.forEach(row => {
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

      if (!this.selection.isSelected(this.alumnosGrupoSeleccionado[i]) === true) {
        this.seleccionados[i] = true;
      } else {
        this.seleccionados[i] = false;
      }
      console.log(this.seleccionados);
    }

    // Pone a true or false todo el vector seleccionado
    SeleccionarTodos() {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.alumnosGrupoSeleccionado.length; i++) {

        if (!this.isAllSelected() === true) {
          this.seleccionados[i] = true;
        } else {
          this.seleccionados[i] = false;
        }

      }
      console.log(this.seleccionados);
    }
}

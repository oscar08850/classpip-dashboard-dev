import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import Swal from 'sweetalert2';

// Clases
import { Grupo, Alumno } from '../../clases/index';

// Servicios

import { SesionService, PeticionesAPIService } from '../../servicios/index';
// Imports para abrir diálogo agregar alumno/confirmar eliminar grupo
import { MatDialog } from '@angular/material';
import { SummaryResolver } from '@angular/compiler';

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
  botonTablaDesactivado = true;
  //
  alumnosSeleccionados: Alumno[];

  alumnosElegido: Alumno;

  dataSource;
  mensaje: string = null;

  displayedColumns: string[] = ['select', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'alumnoId'];
  selection = new SelectionModel<Alumno>(true, []);



  constructor(
               public dialog: MatDialog,
               public location: Location,
               private sesion: SesionService) { }

  ngOnInit() {
    // Recupero de la sesión la información que necesito
    this.grupoSeleccionado = this.sesion.DameGrupo();
    this.profesorId = this.grupoSeleccionado.profesorId;
    this.alumnosGrupoSeleccionado = this.sesion.DameAlumnosGrupo();
    if (this.alumnosGrupoSeleccionado !== undefined) {
      // Al principio no hay alumnos seleccionados para eliminar
      this.dataSource = new MatTableDataSource(this.alumnosGrupoSeleccionado);
    }
  }

  // Filtro para alumnos
    applyFilter(filterValue: string) {

      console.log ('aplicamos filtro ' + filterValue);
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    /** Whether the number of selected elements matches the total number of rows. */
    IsAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.alumnosGrupoSeleccionado.length;
      return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    MasterToggle() {
      this.IsAllSelected() ?
          this.selection.clear() :
          this.alumnosGrupoSeleccionado.forEach(row => {
            this.selection.select(row);
          });
    }

  /* Esta función decide si el boton debe estar activo (si hay al menos
  una fila seleccionada) o si debe estar desactivado (si no hay ninguna fila seleccionada) */
  ActualizarBotonTabla() {
    if (this.selection.selected.length === 0) {
      this.botonTablaDesactivado = true;
    } else {
      this.botonTablaDesactivado = false;
    }
    this.mensaje = '';
  }
  ProcesarSeleccionados() {
    this.mensaje = 'Aun no hay nada que hacer con los seleccionados';
  }

  ElegirAleatoriamente() {
    console.log ('Entramos');
    const numeroAlumnos = this.alumnosGrupoSeleccionado.length;
    const elegido = Math.floor(Math.random() * numeroAlumnos);
    const alumnoElegido = this.alumnosGrupoSeleccionado[elegido];
    console.log ('Hemos elegido a ' + elegido);
    Swal.fire(alumnoElegido.Nombre + ' ' + alumnoElegido.PrimerApellido, 'Enhorabuena', 'success');
  }

  goBack() {
    this.location.back();
  }


}

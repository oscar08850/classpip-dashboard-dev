import { Component, OnInit } from '@angular/core';
// Servicios
import { SesionService, PeticionesAPIService, CalculosService  } from '../../servicios/index';

import { Location } from '@angular/common';
import { MatDialog } from '@angular/material';
// Clases
import { Alumno, Profesor } from '../../clases/index';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogoConfirmacionComponent } from '../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-alumnos',
  templateUrl: './mis-alumnos.component.html',
  styleUrls: ['./mis-alumnos.component.scss']
})
export class MisAlumnosComponent implements OnInit {

  misAlumnos: Alumno[];
  dataSource;
  profesor: Profesor;
  displayedColumns: string[] = ['select', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'alumnoId', ' '];
  selection = new SelectionModel<Alumno>(true, []);
  botonTablaDesactivado = true;

  mensaje = 'Confirma que quieres eliminar a: ';

  constructor(

    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
    public dialog: MatDialog,
    private location: Location) {
    }

  ngOnInit() {
    this.profesor = this.sesion.DameProfesor();
    this.DameTodosMisAlumnos();

  }

  DameTodosMisAlumnos() {

    this.peticionesAPI.DameTodosMisAlumnos(this.profesor.id)
    .subscribe(res => {

      if (res[0] !== undefined) {
        this.misAlumnos = res;
        this.dataSource = new MatTableDataSource(this.misAlumnos);
      } else {
        Swal.fire('Alerta', 'Aun no tienes ningún alumno', 'warning');
      }
    });
  }

  // Filtro de la tabla
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
  AbrirDialogoConfirmacionEliminarAlumno(alumno: Alumno): void {


    Swal.fire({
      title: 'Eliminar',
      text: "Confirma que quieres eliminar a: " + alumno.Nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'

    }).then((result) => {
      if (result.value) {
        this.EliminarAlumno(alumno);
        Swal.fire('Eliminado', alumno.Nombre + ' Eliminado correctamente', 'success');
      }
    })


  }


  EliminarAlumno(alumno: Alumno) {
    this.peticionesAPI.BorraAlumno (alumno.id)
    .subscribe (() => {
                  this.misAlumnos = this.misAlumnos.filter (a => a.id !== alumno.id);
                  this.dataSource = new MatTableDataSource(this.misAlumnos);
              }
    );
  }

  ProcesarSeleccionados() {
    Swal.fire('Información', 'Enviaré un email a los seleccionados', 'info');
  }
  goBack() {
    this.location.back();
  }


}

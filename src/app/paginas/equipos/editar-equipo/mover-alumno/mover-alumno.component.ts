import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { DialogoConfirmacionComponent } from '../../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';

import { Alumno, Equipo, AsignacionEquipo } from 'src/app/clases/index';

// Servicios
import { GrupoService, EquipoService, AlumnoService } from '../../../../servicios/index';

@Component({
  selector: 'app-mover-alumno',
  templateUrl: './mover-alumno.component.html',
  styleUrls: ['./mover-alumno.component.scss']
})
export class MoverAlumnoComponent implements OnInit {

  alumnosEquipo: Alumno[];
  equipo: Equipo;
  listaEquipos: Equipo[];

  equipoSeleccionadoId: number;
  equipoSeleccionadoNombre: string;

  displayedColumns: string[] = ['select', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'alumnoId'];
  selection = new SelectionModel<Alumno>(true, []);

  alumnosSeleccionados: boolean[];

  // PARA DIÁLOGO DE CONFIRMACIÓN
  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres mover el/los alumno/s al equipo llamado: ';


  constructor( public dialogRef: MatDialogRef<MoverAlumnoComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private equipoService: EquipoService,
               public dialog: MatDialog,
               public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.alumnosEquipo = this.data.alumnosEquipo;
    this.equipo = this.data.equipo;

    if (this.alumnosEquipo !== undefined) {
      // Al principio no hay alumnos seleccionados para eliminar
      this.alumnosSeleccionados = Array(this.alumnosEquipo.length).fill(false);
    }

    // Buscamos la lista de equipos del grupo para ponerlos en un seleccionable
    this.EquiposDelGrupo();
  }

  // Filtra la lista de los equipos para no incluir el equipo en el que nos encontramos, ya que es ilogico querer mover
  // los alumnos de un equipo al mismo equipo.
  ListaEquipos(): Equipo[] {
    this.listaEquipos = this.listaEquipos.filter(equipo => equipo.id !== this.equipo.id);
    return this.listaEquipos;
  }

  // REVISAR
  BuscarNombreEquipoSeleccionado(equipoId: number): string {

    this.equipoSeleccionadoNombre = this.listaEquipos.filter(equipo => equipo.id === Number(equipoId))[0].Nombre;
    return this.equipoSeleccionadoNombre;
  }

  // Busca los demás equipos que pertenecen al mismo grupo que el equipo que pasamos del componente editar-equipo
  EquiposDelGrupo() {
    console.log('Voy a listar los equipos');
    this.equipoService.GET_EquiposDelGrupo(this.equipo.grupoId)
    .subscribe(res => {
      if (res[0] !== undefined) {
        console.log('Voy a dar la lista de equipos');
        this.listaEquipos = res;
        this.ListaEquipos();
      } else {
        console.log('Este grupo no tiene equipos');
      }
    });
  }

  // LE PASAMOS EL IDENTIFICADOR DEL EQUIPO Y BUSCAMOS LOS ALUMNOS QUE TIENE. LA UTILIZAMOS PARA ACTUALIZAR LA TABLA
  AlumnosDelEquipo() {

    this.equipoService.GET_AlumnosEquipo(this.equipo.id)
    .subscribe(res => {
    if (res[0] !== undefined) {
      this.alumnosEquipo = res;
      this.alumnosSeleccionados = Array(this.alumnosEquipo.length).fill(false);
    } else {
      console.log('No hay alumnos en este grupo');
      this.alumnosEquipo = undefined;
      this.alumnosSeleccionados = [];
      }
    });
  }

  AbrirDialogoConfirmacionMoverAlumno(): void {

    this.BuscarNombreEquipoSeleccionado(this.equipoSeleccionadoId);
    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        nombre: this.equipoSeleccionadoNombre
      }
    });

    // Antes de cerrar recogeremos el resultado del diálogo: Borrar (true) o cancelar (false). Si confirmamos, borraremos
    // el equipo (función EliminarEquipo) y mostraremos un snackBar con el mensaje de que se ha eliminado correctamente.
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.MoverAlumno();
        this.snackBar.open('Alumnos movidos correctamente al equipo llamado: ' + this.equipoSeleccionadoNombre, 'Cerrar', {
          duration: 2000,
        });

      }
    });
  }

  MoverAlumno() {

    for (let i = 0; i < this.alumnosSeleccionados.length; i++) {

      if (this.alumnosSeleccionados [i]) {
        let alumno: Alumno;
        alumno = this.alumnosEquipo[i];
        console.log(alumno.Nombre + ' seleccionado');

        this.equipoService.GET_AsignacionEquipoAlumno(alumno.id, this.equipo.id, this.equipo.grupoId)
        .subscribe(asignacion => {
          console.log('Doy la asignacion de ' + alumno.Nombre);
          console.log(asignacion[0]);

          this.equipoService.PUT_AsignacionEquipoAlumno
          (new AsignacionEquipo(alumno.id, this.equipoSeleccionadoId), this.equipo.grupoId, asignacion[0].id)
          // tslint:disable-next-line:no-shadowed-variable
          .subscribe(asignacion => {
            console.log('Doy la nueva asignacion de ' + alumno.Nombre);
            console.log(asignacion);
            this.AlumnosDelEquipo();
          });

        });
      }
    }
    this.selection.clear();
  }


  prueba() {

    console.log(this.equipoSeleccionadoNombre);

  }


  // FUNCIONES PARA LA TABLA CON CHECKBOXs

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.alumnosEquipo.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.alumnosEquipo.forEach(row => {
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

    if (!this.selection.isSelected(this.alumnosEquipo[i]) === true) {
      this.alumnosSeleccionados[i] = true;
    } else {
      this.alumnosSeleccionados[i] = false;
    }
    console.log(this.alumnosSeleccionados);
  }

  // Pone a true or false todo el vector seleccionado
  SeleccionarTodos() {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.alumnosEquipo.length; i++) {

      if (!this.isAllSelected() === true) {
        this.alumnosSeleccionados[i] = true;
      } else {
        this.alumnosSeleccionados[i] = false;
      }

    }
    console.log(this.alumnosSeleccionados);
  }

}

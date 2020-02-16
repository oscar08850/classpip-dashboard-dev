import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';

import { DialogoConfirmacionComponent } from '../../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';

import { Alumno, Equipo, AsignacionEquipo } from 'src/app/clases/index';

// Servicios
import { GrupoService, EquipoService, AlumnoService } from '../../../../servicios/index';
import {SesionService, PeticionesAPIService, CalculosService} from '../../../../servicios/index';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-mover-alumno',
  templateUrl: './mover-alumno.component.html',
  styleUrls: ['./mover-alumno.component.scss']
})
export class MoverAlumnoComponent implements OnInit {

  alumnosEquipo: Alumno[];
  dataSource: MatTableDataSource<any>;
  equipo: Equipo;
  listaEquipos: Equipo[];

  equipoSeleccionadoId: number;
  equipoSeleccionadoNombre: string;

  displayedColumns: string[] = ['select', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'alumnoId'];
  selection = new SelectionModel<any>(true, []);


  // PARA DIÁLOGO DE CONFIRMACIÓN
  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres mover el/los alumno/s al equipo llamado: ';

  botonTablaDesactivado = true;

  constructor( public dialogRef: MatDialogRef<MoverAlumnoComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any,
               public dialog: MatDialog,
               public sesion: SesionService,
               public peticionesAPI: PeticionesAPIService) { }

  ngOnInit() {
    this.alumnosEquipo = this.data.alumnosEquipo;
    this.dataSource = new MatTableDataSource (this.alumnosEquipo);

    this.equipo = this.data.equipo;
    this.peticionesAPI.DameEquiposDelGrupo(this.equipo.grupoId)
    .subscribe(res => {
      if (res[0] !== undefined) {
        console.log('Voy a dar la lista de equipos');
        this.listaEquipos = res;
        // Preparamos la lista de equipos del grupo (excepto el implicado)
        // para ponerlos en un seleccionable
        this.listaEquipos = this.listaEquipos.filter(equipo => equipo.id !== this.equipo.id);
        } else {
          console.log('Este grupo no tiene equipos');
      }
    });
  }

  // LE PASAMOS EL IDENTIFICADOR DEL EQUIPO Y BUSCAMOS LOS ALUMNOS QUE TIENE. LA UTILIZAMOS PARA ACTUALIZAR LA TABLA
  AlumnosDelEquipo() {

    this.peticionesAPI.DameAlumnosEquipo(this.equipo.id)
    .subscribe(res => {
    if (res[0] !== undefined) {
      this.alumnosEquipo = res;
      console.log ('****' + this.alumnosEquipo);
    } else {
      // Mensaje al usuario
      console.log('No hay alumnos en este grupo');
      this.alumnosEquipo = undefined;
      }
    });
  }

  AbrirDialogoConfirmacionMoverAlumno(): void {

    // Busco el nombre del equipo seleccionado
    this.equipoSeleccionadoNombre = this.listaEquipos.filter(equipo => equipo.id === Number(this.equipoSeleccionadoId))[0].Nombre;

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        nombre: this.equipoSeleccionadoNombre
      }
    });

    // Antes de cerrar recogeremos el resultado del diálogo: Borrar (true) o cancelar (false). Si confirmamos, borraremos
    // el equipo (función EliminarEquipo) y mostraremos un Swal con el mensaje de que se ha eliminado correctamente.
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.MoverAlumno();
        Swal.fire('Movidos', 'Alumnos movidos correctamente al equipo: ' + this.equipoSeleccionadoNombre, 'success');

      }
    });
  }

  MoverAlumno() {
    // cambio de equipo a cada uno de los alumnos seleccionados

    this.dataSource.data.forEach
    (row => {
              if (this.selection.isSelected(row))  {
                let alumno: Alumno;
                alumno = row;
                this.peticionesAPI.DameAsignacionEquipoAlumno(alumno.id, this.equipo.id, this.equipo.grupoId)
                .subscribe(asignacion => {
                  console.log('Doy la asignacion de ' + alumno.Nombre);
                  console.log(asignacion[0]);
                  const nuevaAsignacion = new AsignacionEquipo(alumno.id, this.equipoSeleccionadoId);

                  this.peticionesAPI.ModificaAsignacionEquipoAlumno( nuevaAsignacion, this.equipo.grupoId, asignacion[0].id)
                  .subscribe(asig => {
                    console.log('Doy la nueva asignacion de ' + alumno.Nombre);
                    console.log(asig);
                    this.alumnosEquipo = this.alumnosEquipo.filter(al => al.Nombre !== alumno.Nombre);
                    this.dataSource = new MatTableDataSource (this.alumnosEquipo);
                  });
                });
              }
          }
    );
    this.selection.clear();
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



  /** Whether the number of selected elements matches the total number of rows. */
  IsAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.alumnosEquipo.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  MasterToggle() {
    this.IsAllSelected() ?
        this.selection.clear() :
        this.alumnosEquipo.forEach(row => {
          this.selection.select(row);
        });
  }
}

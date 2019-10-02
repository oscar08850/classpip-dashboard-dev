import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { AgregarAlumnoDialogComponent } from '../crear-grupo/agregar-alumno-dialog/agregar-alumno-dialog.component';
import { MatTableDataSource } from '@angular/material/table';

// Clases
import { Grupo, Alumno } from '../../clases/index';

// Servicios
import { GrupoService, MatriculaService, AlumnoService } from '../../servicios/index';

// Servicios
import { SesionService, PeticionesAPIService } from '../../servicios/index';


// Imports para abrir diálogo agregar alumno/confirmar eliminar grupo
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogoConfirmacionComponent } from '../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';



@Component({
  selector: 'app-editar-grupo',
  templateUrl: './editar-grupo.component.html',

  styleUrls: ['./editar-grupo.component.scss']
})
export class EditarGrupoComponent implements OnInit {

  // PARÁMETROS QUE RECOGEMOS DEL COMPONENTE GRUPO
  grupoSeleccionado: Grupo;
  profesorId: number;
  alumnosGrupoSeleccionado: Alumno[];

  // PROPIEDADES GRUPO
  nombreGrupo: string;
  descripcionGrupo: string;

  // PARÁMETROS PARA LA TABLA (FUENTE DE DATOS, COLUMNAS Y SELECCIÓN)
  dataSource;
  displayedColumns: string[] = ['select', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'alumnoId'];
  selection = new SelectionModel<any>(true, []);


  // MENSAJE QUE PASAMOS PARA CONFIRMAR QUE QUEREMOS BORRAR A LOS ALUMNOS
  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres eliminar a los alumnos del grupo llamado: ';

  /* Esta variable determina si el boton de la tabla está activo o no
    Debe estar activo si hay al menos un elemento de la lista seleccionado */
  botonTablaDesactivado = true;

  constructor( private grupoService: GrupoService,
               private matriculaService: MatriculaService,
               private alumnoService: AlumnoService,
               public dialog: MatDialog,
               public snackBar: MatSnackBar,
               public sesion: SesionService,
               public peticionesAPI: PeticionesAPIService,
               private location: Location) { }

  ngOnInit() {

    // Recogemos los parámetros del grupo del servicio
    this.grupoSeleccionado = this.sesion.DameGrupo();
    this.profesorId = this.grupoSeleccionado.profesorId;
    this.peticionesAPI.DameAlumnosGrupo (this.grupoSeleccionado.id)
    .subscribe (res => {
                          this.alumnosGrupoSeleccionado = res;
                          this.dataSource = new MatTableDataSource(this.alumnosGrupoSeleccionado);
                        }
                );


    // Inicio los parámetros de los inputs con los valores actuales
    this.nombreGrupo = this.grupoSeleccionado.Nombre;
    this.descripcionGrupo = this.grupoSeleccionado.Descripcion;

    // // Si el grupo tiene alumnos, creamos un vector de boolean de la misma longitud que los alumnos
    // // y creamos un datasource
    // if (this.alumnosGrupoSeleccionado !== undefined) {
    //   // Al principio no hay alumnos seleccionados para eliminar
    //   this.seleccionados = Array(this.alumnosGrupoSeleccionado.length).fill(false);
    //   this.dataSource = new MatTableDataSource(this.alumnosGrupoSeleccionado);
    // }
  }

  // Filtro para buscar alumnos de la tabla
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Funciones para selección
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

  // NOS PERMITE MODIFICAR EL NOMBRE Y LA DESCRIPCIÓN DEL GRUPO QUE ESTAMOS CREANDO
  ModificarGrupo() {
    this.peticionesAPI.ModificaGrupo(new Grupo(this.nombreGrupo, this.descripcionGrupo), this.profesorId, this.grupoSeleccionado.id)
    .subscribe((res) => {
      if (res != null) {
        // Recupero los nuevos parámetros del grupo
        this.grupoSeleccionado = res;

        // Vuelvo a enviar el grupo a la sesion
        this.sesion.TomaGrupo(this.grupoSeleccionado);
        this.snackBar.open('Grupo editado correctamente', 'Cerrar', {
          duration: 2000,
        });
        this.goBack();
      } else {
        console.log('fallo editando');
      }
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
  }




  // // LE PASAMOS EL IDENTIFICADOR DEL GRUPO Y BUSCAMOS LOS ALUMNOS QUE TIENE
  // AlumnosDelGrupo() {

  //   this.alumnoService.GET_AlumnosDelGrupo(this.grupoSeleccionado.id)
  //   .subscribe(res => {

  //     if (res[0] !== undefined) {

  //       this.alumnosGrupoSeleccionado = res;
  //       this.dataSource = new MatTableDataSource(this.alumnosGrupoSeleccionado);
  //       this.seleccionados = Array(this.alumnosGrupoSeleccionado.length).fill(false);

  //     } else {

  //       this.alumnosGrupoSeleccionado = undefined;
  //       this.seleccionados = [];

  //     }
  //   });
  // }

  // SI QUEREMOS AÑADIR ALUMNOS MANUALMENTE LO HAREMOS EN UN DIALOGO
  AbrirDialogoAgregarAlumnos(): void {
    const dialogRef = this.dialog.open(AgregarAlumnoDialogComponent, {
      width: '900px',
      maxHeight: '600px',
      // Le pasamos solo los id del grupo y profesor ya que es lo único que hace falta para vincular los alumnos
      data: {
        grupoId: this.grupoSeleccionado.id,
        profesorId: this.profesorId
      }
    });

    dialogRef.beforeClosed().subscribe(result => {
      this.peticionesAPI.DameAlumnosGrupo (this.grupoSeleccionado.id)
      .subscribe (res => {
                            this.alumnosGrupoSeleccionado = res;
                            console.log ('Grupo: ' + this.alumnosGrupoSeleccionado);
                            this.dataSource = new MatTableDataSource(this.alumnosGrupoSeleccionado);
                          }
                  );

      // // Antes de que se cierre actualizaré la lista de alumnos
      // this.AlumnosDelGrupo();
    });
  }


  // SI QUEREMOS BORRA UN GRUPO, ANTES NOS SALDRÁ UN AVISO PARA CONFIRMAR LA ACCIÓN COMO MEDIDA DE SEGURIDAD. ESTO SE HARÁ
  // MEDIANTE UN DIÁLOGO
  AbrirDialogoConfirmacionBorrar(): void {

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        nombre: this.grupoSeleccionado.Nombre,
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.BorrarAlumnos();
        this.snackBar.open('Alumnos eliminados correctamente', 'Cerrar', {
          duration: 2000,
        });
      }
    });
  }

  // Recorro el array de seleccionados y miro si lo borro o no.
  BorrarAlumnos() {
    this.dataSource.data.forEach
    (alumno => {
              if (this.selection.isSelected(alumno))  {
                  // Recupero la matrícula del alumno en este grupo
                  this.peticionesAPI.DameMatriculaAlumno (alumno.id, this.grupoSeleccionado.id)
                  .subscribe(matricula => {
                    // Una vez recupero la matrícula, la borro
                    this.peticionesAPI.BorraMatricula (matricula[0].id)
                    .subscribe(result => {
                      // Despues de borrar actualizo la lista que se muestra en la tabla
                      this.peticionesAPI.DameAlumnosGrupo (this.grupoSeleccionado.id)
                      .subscribe (res => {
                                            this.alumnosGrupoSeleccionado = res;
                                            this.dataSource = new MatTableDataSource(this.alumnosGrupoSeleccionado);
                                          }
                                  );
                    });
                  });

              }
            }
    );
    this.selection.clear();
    this.botonTablaDesactivado = true;
  }

  // NOS DEVOLVERÁ AL INICIO
  goBack() {
    this.location.back();
  }
}

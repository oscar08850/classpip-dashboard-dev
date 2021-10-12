import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { AgregarAlumnoDialogComponent } from '../crear-grupo/agregar-alumno-dialog/agregar-alumno-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
// Clases
import { Grupo, Alumno, FamiliaDeImagenesDePerfil } from '../../clases/index';


// Servicios
import { SesionService, PeticionesAPIService } from '../../servicios/index';


// Imports para abrir diálogo agregar alumno/confirmar eliminar grupo
import { MatDialog } from '@angular/material';
import { DialogoConfirmacionComponent } from '../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';

import * as URL from '../../URLs/urls';


@Component({
  selector: 'app-editar-grupo',
  templateUrl: './editar-grupo.component.html',

  styleUrls: ['./editar-grupo.component.scss']
})
export class EditarGrupoComponent implements OnInit {

  grupoSeleccionado: Grupo;
  profesorId: number;
  alumnosGrupoSeleccionado: Alumno[];

  // PROPIEDADES GRUPO
  nombreGrupo: string;
  descripcionGrupo: string;

  // PARÁMETROS PARA LA TABLA (FUENTE DE DATOS, COLUMNAS Y SELECCIÓN)
  dataSource;
  displayedColumns: string[] = ['select', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'alumnoId', 'imagen'];
  selection = new SelectionModel<any>(true, []);


  // MENSAJE QUE PASAMOS PARA CONFIRMAR QUE QUEREMOS BORRAR A LOS ALUMNOS
  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres eliminar a los alumnos del grupo llamado: ';

  /* Esta variable determina si el boton de la tabla está activo o no
    Debe estar activo si hay al menos un elemento de la lista seleccionado */
  botonTablaDesactivado = true;

  constructor(
               public dialog: MatDialog,
               public sesion: SesionService,
               public peticionesAPI: PeticionesAPIService,
               private location: Location) { }

  ngOnInit() {

    // Recogemos información de la sesión
    this.grupoSeleccionado = this.sesion.DameGrupo();
    this.profesorId = this.grupoSeleccionado.profesorId;
    this.peticionesAPI.DameAlumnosGrupo (this.grupoSeleccionado.id)
    .subscribe (res => {
                          this.alumnosGrupoSeleccionado = res;
                          // this.alumnosGrupoSeleccionado.forEach (alumno => {
                          //   if (alumno.ImagenPerfil) {
                          //     // añado la url para poder visualizar la imagen de perfil
                          //     alumno.ImagenPerfil = URL.ImagenesPerfil + alumno.ImagenPerfil;
                          //   }
                          // });

                          this.dataSource = new MatTableDataSource(this.alumnosGrupoSeleccionado);
                        }
                );


    // Inicio los parámetros de los inputs con los valores actuales
    this.nombreGrupo = this.grupoSeleccionado.Nombre;
    this.descripcionGrupo = this.grupoSeleccionado.Descripcion;
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
        Swal.fire('Guardado', 'Grupo editado correctamente', 'success');
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


  // SI QUEREMOS AÑADIR ALUMNOS MANUALMENTE LO HAREMOS EN UN DIALOGO
  AbrirDialogoAgregarAlumnos(): void {
    const dialogRef = this.dialog.open(AgregarAlumnoDialogComponent, {
      width: '50%',
      height: '80%',
      position: {
        top: '0%'
      },
      // Le pasamos solo los id del grupo y profesor ya que es lo único que hace falta para vincular los alumnos
      // En realidad el dialogo podría recuperar esta información de la sesión,
      // pero en el caso de los dialogos usamos el mecanismo de paso de parámetros porque es sencillo
      data: {
        grupoId: this.grupoSeleccionado.id,
        profesorId: this.profesorId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Cuando vuelvo de agragar alumnos vuelvo a traer los alumnos del grupo
      this.peticionesAPI.DameAlumnosGrupo (this.grupoSeleccionado.id)
      .subscribe (res => {
                            this.alumnosGrupoSeleccionado = res;

                            console.log ('Grupo: ' + this.alumnosGrupoSeleccionado);
                            this.dataSource = new MatTableDataSource(this.alumnosGrupoSeleccionado);
                          }
                  );

    });
  }


  // SI QUEREMOS BORRA UN GRUPO, ANTES NOS SALDRÁ UN AVISO PARA CONFIRMAR LA ACCIÓN COMO MEDIDA DE SEGURIDAD. ESTO SE HARÁ
  // MEDIANTE UN DIÁLOGO
  AbrirDialogoConfirmacionBorrar(): void {


    Swal.fire({
      title: '¿Seguro que quieres eliminar a esos alumnos del grupo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.BorrarAlumnos();
        Swal.fire('Eliminados', 'Alumnos eliminados correctamente', 'success');
      }
    });



    // const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
    //   height: '150px',
    //   data: {
    //     mensaje: this.mensaje,
    //     nombre: this.grupoSeleccionado.Nombre,
    //   }
    // });

    // dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    //   if (confirmed) {
    //     this.BorrarAlumnos();
    //     Swal.fire('Eliminados', 'Alumnos eliminados correctamente', 'success');
    //   }
    // });
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
                      this.alumnosGrupoSeleccionado = this.alumnosGrupoSeleccionado.filter (al => al.Nombre !== alumno.Nombre);
                      this.dataSource = new MatTableDataSource(this.alumnosGrupoSeleccionado);
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

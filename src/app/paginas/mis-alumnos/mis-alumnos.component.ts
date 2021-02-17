import { Component, OnInit } from '@angular/core';
// Servicios
import { SesionService, PeticionesAPIService, CalculosService  } from '../../servicios/index';

import { Location } from '@angular/common';
import { MatDialog } from '@angular/material';
// Clases
import { Alumno, Profesor, FamiliaDeImagenesDePerfil } from '../../clases/index';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogoConfirmacionComponent } from '../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';
// tslint:disable-next-line:max-line-length
import {AsignarFamiliaImagenesPerfilComponent} from '../mis-alumnos/asignar-familia-imagenes-perfil/asignar-familia-imagenes-perfil.component';

import * as URL from '../../URLs/urls';
// Clases

@Component({
  selector: 'app-mis-alumnos',
  templateUrl: './mis-alumnos.component.html',
  styleUrls: ['./mis-alumnos.component.scss']
})
export class MisAlumnosComponent implements OnInit {

  misAlumnos: Alumno[];
  dataSource;
  profesor: Profesor;
  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['select', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'alumnoId', 'imagen' , 'permisoCambio' , ' '];
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
        console.log ('Ya tengo alumnos');
        console.log (this.misAlumnos);
        // this.misAlumnos.forEach (alumno => {
        //   if (alumno.ImagenPerfil) {
        //     // añado la url para poder visualizar la imagen de perfil
        //     alumno.ImagenPerfil = URL.ImagenesPerfil + alumno.ImagenPerfil;
        //   }
        // });
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
  // ActualizarBotonTabla() {
  //   if (this.selection.selected.length === 0) {
  //     this.botonTablaDesactivado = true;
  //   } else {
  //     this.botonTablaDesactivado = false;
  //   }
  // }

  BotonesDesactivados() {
    if (this.selection.selected.length === 0) {
      return true;
    } else {
     return false;
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

 QuitarImagen() {
    console.log ('vamos a quitar imagenes');

    this.misAlumnos.forEach(alumno => {
      if (this.selection.isSelected(alumno)) {
        alumno.ImagenPerfil = undefined;
        this.peticionesAPI.ModificaAlumno (alumno)
        .subscribe(al => {
          console.log ('he modificado');
          console.log (al);
        });
      }
    });
    this.selection.clear();
  }

  AsignarImagenes(familia: FamiliaDeImagenesDePerfil) {
    if (familia !== undefined) {
      this.misAlumnos.forEach(alumno => {
        if (this.selection.isSelected(alumno)) {
          // Elijo la primera imagen que no haya sido asignada a ningun otro alumno
          // tslint:disable-next-line:max-line-length
          const imagen = familia.Imagenes.filter(img => !this.misAlumnos.some(a => a.ImagenPerfil === URL.ImagenesPerfil + img))[0];
          alumno.ImagenPerfil = URL.ImagenesPerfil + imagen;

          this.peticionesAPI.ModificaAlumno (alumno).subscribe();
          // Para mostrar la imagen de perfil necesitamos añadir la URL
          //alumno.ImagenPerfil =  URL.ImagenesPerfil + imagen;
        }
      });
    }
    this.selection.clear();
  }

  AsignarFamilia(): void {
    const dialogRef = this.dialog.open(AsignarFamiliaImagenesPerfilComponent, {
      height: '800px',
      width: '800px',
      data: 'vamos a entrar'
    });

    dialogRef.afterClosed().subscribe(familia => {
        this.AsignarImagenes(familia);
    });
  }

  CambiarPermisoCambioImagen () {

    this.misAlumnos.forEach(alumno => {
      if (this.selection.isSelected(alumno)) {
        alumno.PermisoCambioImagenPerfil =  !alumno.PermisoCambioImagenPerfil ;
        console.log ('voy a cambiar permiso de ');
        console.log (alumno);
        this.peticionesAPI.ModificaAlumno (alumno)
        .subscribe(al => {
          console.log ('he modificado');
          console.log (al);
        });
      }
    });
    this.selection.clear();

  }
  goBack() {
    this.location.back();
  }


}

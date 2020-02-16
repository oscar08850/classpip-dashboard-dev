import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';

// Clases
import { Grupo, Alumno } from '../../clases/index';

// Servicios
import { SesionService, PeticionesAPIService, CalculosService  } from '../../servicios/index';

// Imports para abrir diálogo confirmar eliminar grupo
import { MatDialog, } from '@angular/material';
import { DialogoConfirmacionComponent } from '../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.scss']
})
export class GrupoComponent implements OnInit {

  // PONEMOS LAS COLUMNAS DE LA TABLA Y LA LISTA QUE TENDRÁ LA INFORMACIÓN QUE QUEREMOS MOSTRAR
  displayedColumns: string[] = ['nombreAlumno', 'primerApellido', 'segundoApellido', 'alumnoId'];
  alumnosGrupoSeleccionado: Alumno[];
  dataSource;

  // Grupo en el que hemos entrado
  grupo: Grupo;
  profesorId: number;


  // Mensaje confirmación borrado
  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres eliminar el grupo llamado: ';


  constructor(
              private sesion: SesionService,
              private peticionesAPI: PeticionesAPIService,
              private calculos: CalculosService,
              public dialog: MatDialog,
              private location: Location) { }

  ngOnInit() {

    // Recupero de la sesión el grupo y el id del profesor (que está en el grupo)
    this.grupo = this.sesion.DameGrupo();
    this.profesorId = this.grupo.profesorId;

    // PEDIMOS LA LISTA DE ALUMNOS CUANDO INICIAMOS EL COMPONENTE
    this.AlumnosDelGrupo();

  }

  // Filtro de la tabla
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // LE PASAMOS EL IDENTIFICADOR DEL GRUPO Y BUSCAMOS LOS ALUMNOS QUE TIENE
  AlumnosDelGrupo() {

    this.peticionesAPI.DameAlumnosGrupo(this.grupo.id)
    .subscribe(res => {

      if (res[0] !== undefined) {
        this.alumnosGrupoSeleccionado = res;
        this.dataSource = new MatTableDataSource(this.alumnosGrupoSeleccionado);
      } else {
        console.log('No hay alumnos en este grupo');
      }
    });
  }
  EliminarGrupo() {
    // Para eliminar grupo hay muchas cosas que hacer. Estar en el servicio de calculos
    this.calculos.EliminarGrupo ().subscribe (this.goBack());
   // this.goBack();
  }

  // SI QUEREMOS BORRA UN GRUPO, ANTES NOS SALDRÁ UN AVISO PARA CONFIRMAR LA ACCIÓN COMO MEDIDA DE SEGURIDAD. ESTO SE HARÁ
  // MEDIANTE UN DIÁLOGO
  AbrirDialogoConfirmacionBorrar(): void {
    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        nombre: this.grupo.Nombre,
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.EliminarGrupo();
        Swal.fire('Eliminado', this.grupo.Nombre + ' eliminado correctamente', 'success');
      }
    });
  }

  // Guardamos los alumnos del grupo en la sesión porque los necesitaremos si saltamos a
  // equipos, pasar lista o juegos
  GuardarGrupo() {
    this.sesion.TomaAlumnosGrupo (this.alumnosGrupoSeleccionado);
  }
  // NOS DEVOLVERÁ AL INICIO
  goBack() {
    this.location.back();
  }
}

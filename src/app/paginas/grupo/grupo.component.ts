import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';

// Clases
import { Grupo, Alumno } from '../../clases/index';

// Servicios
import { GrupoService, AlumnoService, MatriculaService  } from '../../servicios/index';

// Imports para abrir diálogo confirmar eliminar grupo
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogoConfirmacionComponent } from '../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';


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
  grupoSeleccionado: Grupo;
  profesorId: number;


  // Mensaje confirmación borrado
  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres eliminar el grupo llamado: ';


  constructor( private grupoService: GrupoService,
               private matriculaService: MatriculaService,
               public dialog: MatDialog,
               public snackBar: MatSnackBar,
               private alumnoService: AlumnoService,
               private location: Location) { }

  ngOnInit() {

    // LE PIDO AL SERVICIO QUE ME DE LOS DATOS DEL PROFESOR QUE ME HAN ENVIADO
    this.grupoSeleccionado = this.grupoService.RecibirGrupoDelServicio();
    this.profesorId = this.grupoSeleccionado.profesorId;

    // PEDIMOS LA LISTA DE ALUMNOS CUANDO INICIAMOS EL COMPONENTE
    this.AlumnosDelGrupo();

  }

  // Filtro de la tabla
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // LE PASAMOS EL IDENTIFICADOR DEL GRUPO Y BUSCAMOS LOS ALUMNOS QUE TIENE
  AlumnosDelGrupo() {

    this.alumnoService.GET_AlumnosDelGrupo(this.grupoSeleccionado.id)
    .subscribe(res => {

      if (res[0] !== undefined) {
        this.alumnosGrupoSeleccionado = res;
        this.dataSource = new MatTableDataSource(this.alumnosGrupoSeleccionado);
      } else {
        console.log('No hay alumnos en este grupo');
      }
    });
  }

  // FUNCIONES DE LAS DIFERENTES OPCIONES QUE TENEMOS CON EL GRUPO
  EntrarPasarLista() {

    // ENVIO AL SERVICIO LOS PARÁMETROS QUE NECESITO
    this.grupoService.EnviarGrupoAlServicio(this.grupoSeleccionado);
    this.alumnoService.EnviarListaAlumnosAlServicio(this.alumnosGrupoSeleccionado);
  }

  // ENVIO AL SERVICIO LOS PARÁMETROS QUE NECESITO
  EntrarEditarGrupo() {
    this.grupoService.EnviarGrupoAlServicio(this.grupoSeleccionado);
    this.alumnoService.EnviarListaAlumnosAlServicio(this.alumnosGrupoSeleccionado);
  }

  // ENVIAMOS EL IDENTIFICADOR Y LOS ALUMNOS DEL GRUPO SELECCIONADO
  EntrarEquipos() {
    this.grupoService.EnviarGrupoIdAlServicio(this.grupoSeleccionado.id);
    this.grupoService.EnviarAlumnosGrupoAlServicio(this.alumnosGrupoSeleccionado);
  }

  // ENVIO AL SERVICIO LOS PARÁMETROS QUE NECESITO
  EntrarJuegos() {
    this.grupoService.EnviarGrupoIdAlServicio(this.grupoSeleccionado.id);
    this.grupoService.EnviarAlumnosGrupoAlServicio(this.alumnosGrupoSeleccionado);
  }

  // ESTA FUNCIÓN BORRARÁ EL GRUPO DE ID QUE PASEMOS DEL PROFESOR CON ID QUE PASEMOS Y VOLVERÁ A LA PÁGINA DE LISTAR
  // ACTUALIZANDO LA TABLA
  EliminarGrupo() {

    this.grupoService.DELETE_Grupo(this.profesorId, this.grupoSeleccionado.id)
    .subscribe(() => {

      this.EliminarMatriculas();
      this.goBack();
    });
  }

  // ESTA FUNCIÓN RECUPERA TODAS LAS MATRICULAS DEL GRUPO QUE VAMOS A BORRAR Y DESPUÉS LAS BORRA. ESTO LO HACEMOS PARA NO
  // DEJAR MATRICULAS QUE NO NOS SIRVEN EN LA BASE DE DATOS
  EliminarMatriculas() {

    // Pido las matrículas correspondientes al grupo que voy a borrar
    this.matriculaService.GET_MatriculasDelGrupo(this.grupoSeleccionado.id)
    .subscribe( matriculas => {
      if (matriculas[0] !== undefined) {

        // Una vez recibo las matriculas del grupo, las voy borrando una a una
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < matriculas.length; i++) {
          this.matriculaService.DELETE_Matricula(matriculas[i].id)
          .subscribe(() => {
              console.log('matricula borrada correctamente');
          });
        }
      } else {
        console.log('no hay matriculas');
      }

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
        this.EliminarGrupo();
        this.snackBar.open(this.grupoSeleccionado.Nombre + ' eliminado correctamente', 'Cerrar', {
          duration: 2000,
        });
      }
    });
  }

  // NOS DEVOLVERÁ AL INICIO
  goBack() {
    this.location.back();
  }
}

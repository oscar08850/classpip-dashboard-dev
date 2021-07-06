import { Component, OnInit } from '@angular/core';
import { SesionService, PeticionesAPIService, CalculosService } from 'src/app/servicios';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Location } from '@angular/common';
import { Pregunta, Profesor } from 'src/app/clases';
import Swal from 'sweetalert2';
import { DialogoConfirmacionComponent } from '../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { EditarPreguntaDialogComponent } from './editar-pregunta-dialog/editar-pregunta-dialog.component';

@Component({
  selector: 'app-mis-preguntas',
  templateUrl: './mis-preguntas.component.html',
  styleUrls: ['./mis-preguntas.component.scss']
})
export class MisPreguntasComponent implements OnInit {


  misPreguntas: Pregunta[];
  dataSource;
  profesor: Profesor;
  displayedColumns: string[] = ['titulo', 'pregunta', 'tematica', 'tipo', 'edit', ' '];

  mensaje = 'Confirmar que quieres eliminar la pregunta: ';

  constructor(  private sesion: SesionService,
                private peticionesAPI: PeticionesAPIService,
                public dialog: MatDialog,
                private calculos: CalculosService,
                private location: Location) { }

  ngOnInit() {
    this.profesor = this.sesion.DameProfesor();
    this.DameTodasMisPreguntas();
  }

  //Cogemos todas las preguntas del profesor para rellenar la tabla
  DameTodasMisPreguntas() {
    this.peticionesAPI.DameTodasMisPreguntas (this.profesor.id)
    .subscribe( res => {
      if (res[0] !== undefined) {
        this.misPreguntas = res;
        this.dataSource = new MatTableDataSource(this.misPreguntas);
      } else {
        Swal.fire('Alerta', 'Aun no tienes ninguna pregunta', 'warning');
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  AbrirDialogoEditarPregunta(pregunta: Pregunta): void {
    const dialogRef = this.dialog.open(EditarPreguntaDialogComponent, {
      width: '50%',
      height: '80%',
      position: {
        top: '0%'
      },
      //Pasamos los parametros necesarios
      data: {
        pregunta: pregunta,
        profesorId: this.profesor.id
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.DameTodasMisPreguntas();
    });
  }

  AbrirDialogoConfirmacionEliminarPregunta(pregunta: Pregunta): void {

    Swal.fire({
      title: 'Eliminar',
      text: "Confirma que quieres eliminar la pregunta: " + pregunta.Pregunta,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'

    }).then((result) => {
      if (result.value) {
        this.EliminarPregunta(pregunta);
        Swal.fire('Eliminado', pregunta.Pregunta + ' eliminada correctamente', 'success');
      }
    })


  }

  EliminarPregunta(pregunta: Pregunta) {
    this.sesion.TomaPregunta(pregunta);
    this.calculos.EliminarPregunta()
    .subscribe (() => {
      this.misPreguntas = this.misPreguntas.filter (a => a.id !== pregunta.id);
      this.dataSource = new MatTableDataSource(this.misPreguntas);
    });
  }
}

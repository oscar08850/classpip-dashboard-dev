import { Component, OnInit, Inject } from '@angular/core';
import { Pregunta, PreguntaDelCuestionario } from 'src/app/clases';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { PeticionesAPIService } from 'src/app/servicios';
import Swal from 'sweetalert2';
import { DialogMostrarCromosComponent } from '../../juego/asignacion-coleccion-juego/dialog-mostrar-cromos/dialog-mostrar-cromos.component';
import { Location } from '@angular/common';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';

@Component({
  selector: 'app-agregar-preguntas-dialog',
  templateUrl: './agregar-preguntas-dialog.component.html',
  styleUrls: ['./agregar-preguntas-dialog.component.scss']
})
export class AgregarPreguntasDialogComponent implements OnInit {

  //COLUMNAS DE LA TABLA Y LA LISTA CON LA INFORMACION NECESARIA
  displayedColumnsMisPreguntas: string[] = ['titulo', 'pregunta', 'tematica', ' '];
  dataSourceMisPreguntas;
  misPreguntas: Pregunta[] = []

  //COLUMNAS DE LA TABLA Y LA LISTA CON LA INFORMACION NECESARIA
  displayedColumnsPreguntasDelCuestionario: string[] = ['titulo', 'pregunta', 'tematica', ' '];
  dataSourcePreguntasDelCuestionario;
  preguntasDelCuestionario: Pregunta[] = []

  pregunta: Pregunta;

  cuestionarioId: number;
  profesorId: number;
  mensaje = 'Confirma que quieres quitar del cuestionario la pregunta: ';


  constructor(
              public dialog: MatDialog,
              public location: Location,
              private peticionesAPI: PeticionesAPIService,
              public dialogRef: MatDialogRef<AgregarPreguntasDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

    //GUARDAMOS LOS VALORES NECESARIOS QUE TENEMOS DEL COMPONENTE ANTERIOR
    this.cuestionarioId = this.data.cuestionarioId;
    this.profesorId = this.data.profesorId;

    this.peticionesAPI.DameTodasMisPreguntas (this.profesorId)
    .subscribe (res => {
      this.misPreguntas = res;
      this.misPreguntas.sort((a, b) => a.Tematica.localeCompare(b.Tematica));
      this.dataSourceMisPreguntas = new MatTableDataSource (this.misPreguntas);
    })

    this.peticionesAPI.DamePreguntasCuestionario (this.cuestionarioId)
    .subscribe ( res => {
      this.preguntasDelCuestionario = res;
      this.preguntasDelCuestionario.sort((a, b) => a.Tematica.localeCompare(b.Tematica));
      this.dataSourcePreguntasDelCuestionario = new MatTableDataSource (this.preguntasDelCuestionario);
    })

  }

  applyFilterMisPreguntas(filterValue: string){
    this.dataSourceMisPreguntas.filter = filterValue.trim().toLowerCase();
  }

  applyFilterPreguntasDelCuestionario(filterValue: string) {
    this.dataSourcePreguntasDelCuestionario.filter = filterValue.trim().toLowerCase();
  }

  AsignarPregunta(pregunta: Pregunta) {
    const found = this.preguntasDelCuestionario.find (a => a.Titulo === pregunta.Titulo && a.Pregunta === pregunta.Pregunta && a.Tematica === pregunta.Tematica);
    if (found === undefined){
      this.peticionesAPI.PreguntasEnCuestionario( new PreguntaDelCuestionario (pregunta.id, this.cuestionarioId))
      .subscribe();
  
      //Añadimos las preguntas a la lista
      this.preguntasDelCuestionario.push (pregunta);
      this.preguntasDelCuestionario.sort((a, b) => a.Tematica.localeCompare(b.Tematica));
      this.dataSourcePreguntasDelCuestionario = new MatTableDataSource (this.preguntasDelCuestionario);
  
      this.misPreguntas = this.misPreguntas.filter (a => a.Titulo !== pregunta.Titulo && a.Pregunta !== pregunta.Pregunta && a.Tematica !== pregunta.Tematica);
      this.dataSourceMisPreguntas = new MatTableDataSource (this.misPreguntas);
    }else {
      Swal.fire('Cuidado', 'Esta pregunta ya esta en el cuestionario', 'error');
    }  
  } 

  AbrirDialogoConfirmacionBorrar(pregunta: Pregunta): void {
    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        nombre: pregunta.Titulo
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.EliminarDelCuestionario(pregunta);
        Swal.fire('Eliminado', 'Pregunta eliminada correctamente', 'success');
      }
    });
  }

  EliminarDelCuestionario(pregunta: Pregunta){
    this.peticionesAPI.DamePreguntaDelCuestionario (pregunta.id, this.cuestionarioId)
    .subscribe((preguntaDelCuestionario) => {
      this.peticionesAPI.BorraPreguntaDelCuestionario (preguntaDelCuestionario[0].id)
      .subscribe (() => {
        this.preguntasDelCuestionario = this.preguntasDelCuestionario.filter(a => a.Titulo !== pregunta.Titulo && a.Pregunta !== pregunta.Pregunta && a.Tematica !== pregunta.Tematica);
        this.dataSourcePreguntasDelCuestionario = new MatTableDataSource (this.preguntasDelCuestionario);
        this.misPreguntas.push(pregunta);
        this.misPreguntas.sort((a, b) => a.Tematica.localeCompare(b.Tematica));
        this.dataSourceMisPreguntas = new MatTableDataSource (this.misPreguntas);
      });
    });
  }

  goBack() {
    this.dialogRef.close();
  }
}

import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogData} from '../evaluacion-dialogo/evaluacion-dialogo.component';
import {JuegoDeEvaluacion} from '../../../../clases/JuegoDeEvaluacion';

export interface DialogData {
  juego: JuegoDeEvaluacion;
  evaluadorId: number;
  evaluadoId: number;
}

@Component({
  selector: 'app-evaluacion-borrar-dialogo',
  templateUrl: './evaluacion-borrar-dialogo.component.html',
  styleUrls: ['./evaluacion-borrar-dialogo.component.scss']
})
export class EvaluacionBorrarDialogoComponent implements OnInit {

  isDeleting = false;

  constructor(
    public dialogRef: MatDialogRef<EvaluacionBorrarDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    console.log(this.data);
  }

  delete(): void {
    this.isDeleting = true;
  }

  close(): void {
    this.dialogRef.close();
  }

}

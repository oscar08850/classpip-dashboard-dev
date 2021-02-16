import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogData} from '../evaluacion-dialogo/evaluacion-dialogo.component';

@Component({
  selector: 'app-evaluacion-borrar-dialogo',
  templateUrl: './evaluacion-borrar-dialogo.component.html',
  styleUrls: ['./evaluacion-borrar-dialogo.component.scss']
})
export class EvaluacionBorrarDialogoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EvaluacionBorrarDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close();
  }

}

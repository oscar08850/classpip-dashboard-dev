import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  evaluadorId: number;
  evaluadoId: number;
}

@Component({
  selector: 'app-evaluacion-dialogo',
  templateUrl: './evaluacion-dialogo.component.html',
  styleUrls: ['./evaluacion-dialogo.component.scss']
})
export class EvaluacionDialogoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EvaluacionDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    console.log(this.data);
  }

}

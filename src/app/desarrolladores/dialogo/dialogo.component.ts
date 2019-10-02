import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-dialogo',
  templateUrl: './dialogo.component.html',
  styleUrls: ['./dialogo.component.scss']
})
export class DialogoComponent implements OnInit {
  myForm: FormGroup;
  opinion: string;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    // defino los campos del formulario (solo la opinión)
    this.myForm = this.formBuilder.group({
      opinion: ['', Validators.required]
    });
    // Recojo la opinión que recibo como parámetro
    this.opinion = this.data.op;

  }
  ModificarOpinion() {
    // Cierro el diálogo y retorno el resultado, que es la nueva opinión
    // a menos que no se haya escrito nada, en cuyo caso se retorna la opinión anterior
    if (this.myForm.value.opinion !== '') {
        this.dialogRef.close(this.myForm.value.opinion);
    } else {
        this.dialogRef.close(this.opinion);
    }

  }

}

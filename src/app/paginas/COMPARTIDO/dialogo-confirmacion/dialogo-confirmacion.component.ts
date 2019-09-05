import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialogo-confirmacion',
  templateUrl: './dialogo-confirmacion.component.html',
  styleUrls: ['./dialogo-confirmacion.component.scss']
})
export class DialogoConfirmacionComponent implements OnInit {

  // tslint:disable-next-line:no-inferrable-types
  mensaje: string;

  // Las opciones de este dialogo serán siempre Aceptar y Cancelar
  TextoBotonBorrar = 'Aceptar';
  TextoBotonCancelar = 'Cancelar';

  constructor( public dialogRef: MatDialogRef<string>,
               @Inject(MAT_DIALOG_DATA) public mensajeConfirmacion: any) {

                // El componente recibe un mensaje que le pasamos desde el componente que lo iniciamos
                if (mensajeConfirmacion) {
                  this.mensaje = mensajeConfirmacion.mensaje || this.mensaje;
                }
               }

  ngOnInit() {
  }


  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}

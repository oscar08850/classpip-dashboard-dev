import { Component, OnInit } from '@angular/core';
import { Cuestionario, CuestionarioSatisfaccion, Pregunta } from 'src/app/clases';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import { Location } from '@angular/common';
import { MatDialog, MatTableDataSource } from '@angular/material';
import Swal from 'sweetalert2';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-mostrar-cuestionario-satisfaccion',
  templateUrl: './mostrar-cuestionario-satisfaccion.component.html',
  styleUrls: ['./mostrar-cuestionario-satisfaccion.component.scss']
})
export class MostrarCuestionarioSatisfaccionComponent implements OnInit {

  cuestionarioSeleccionado: CuestionarioSatisfaccion;
  profesorId: number;
  titulo: string;
  descripcion: string;
  
  constructor(public dialog: MatDialog,
    public sesion: SesionService,
    public peticionesAPI: PeticionesAPIService,
    private location: Location) { }

  ngOnInit() {

    // Recogemos la informacion de la sesion
    this.cuestionarioSeleccionado = this.sesion.DameCuestionarioSatisfaccion();
    this.profesorId = this.sesion.DameProfesor().id;

  }
// Nos devolvera a mis cuestionarios
goBack() {
  this.location.back();
}
}

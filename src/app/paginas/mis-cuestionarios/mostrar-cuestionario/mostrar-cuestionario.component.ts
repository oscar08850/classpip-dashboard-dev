import { Component, OnInit } from '@angular/core';
import { Cuestionario, Pregunta } from 'src/app/clases';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import { Location } from '@angular/common';
import { MatDialog, MatTableDataSource } from '@angular/material';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mostrar-cuestionario',
  templateUrl: './mostrar-cuestionario.component.html',
  styleUrls: ['./mostrar-cuestionario.component.scss']
})
export class MostrarCuestionarioComponent implements OnInit {

  cuestinarioSeleccionado: Cuestionario;
  profesorId: number;
  preguntasCuestionarioSeleccionado: Pregunta[];

  //PROPIEDADES DEL CUESTIONARIO
  titulo: string;
  descripcion: string;

  //PARAMETROS DE LA TABLA
  dataSource;
  displayedColumns: string[] = ['tituloPregunta', 'preguntaPregunta', 'tematicaPregunta'];

  constructor(public dialog: MatDialog,
    public sesion: SesionService,
    public peticionesAPI: PeticionesAPIService,
    private location: Location) { }

  ngOnInit() {
    //Recogemos la informacion de la sesion
    this.cuestinarioSeleccionado = this.sesion.DameCuestionario();
    this.profesorId = this.sesion.DameProfesor().id;
    this.peticionesAPI.DamePreguntasCuestionario(this.cuestinarioSeleccionado.id)
    .subscribe((res) => {
      this.preguntasCuestionarioSeleccionado = res;
      this.dataSource = new MatTableDataSource(this.preguntasCuestionarioSeleccionado);
    });

    //Establecemos el valor que le corresponde a los inputs
    this.titulo = this.cuestinarioSeleccionado.Titulo;
    this.descripcion = this.cuestinarioSeleccionado.Descripcion;
  }

// Nos devolvera a mis cuestionarios
  goBack() {
    this.location.back();
  }
}

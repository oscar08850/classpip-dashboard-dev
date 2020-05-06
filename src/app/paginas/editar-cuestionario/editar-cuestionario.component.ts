import { Component, OnInit } from '@angular/core';
import { Cuestionario, Pregunta } from 'src/app/clases';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import { Location } from '@angular/common';
import { MatDialog, MatTableDataSource } from '@angular/material';
import Swal from 'sweetalert2';
import { AgregarPreguntasDialogComponent } from '../crear-cuestionario/agregar-preguntas-dialog/agregar-preguntas-dialog.component';

@Component({
  selector: 'app-editar-cuestionario',
  templateUrl: './editar-cuestionario.component.html',
  styleUrls: ['./editar-cuestionario.component.scss']
})
export class EditarCuestionarioComponent implements OnInit {

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

  //Filtro de busqueda de preguntas
  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ModificarCuestionario(){
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.ModificaCuestionario(new Cuestionario(this.titulo, this.descripcion), this.profesorId, this.cuestinarioSeleccionado.id)
    .subscribe((res) => {
      if(res != null) {
        Swal.fire('Guardado', 'Cuestionario editado correctamente', 'success');
        this.goBack();
      } else {
        console.log('Error guardando los cambios en el cuestionario');
      }
    });
  }

  AbrirDialogoAgregarPreguntas(){
    const dialogRef = this.dialog.open(AgregarPreguntasDialogComponent, {
      width: '50%',
      height: '80%',
      position: {
        top: '0%'
      },
      data: {
        cuestionarioId: this.cuestinarioSeleccionado.id,
        profesorId: this.profesorId
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      //Volvemos a rellenar los datos de la tabla con la nueva actualizacion de preguntas
      this.peticionesAPI.DamePreguntasCuestionario(this.cuestinarioSeleccionado.id)
      .subscribe((res) => {
        this.preguntasCuestionarioSeleccionado = res;
        this.dataSource = new MatTableDataSource(this.preguntasCuestionarioSeleccionado);
      });
    })
  }

  // Nos devolvera a mis cuestionarios
  goBack() {
    this.location.back();
  }
}

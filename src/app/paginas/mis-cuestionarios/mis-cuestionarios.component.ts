import { Component, OnInit } from '@angular/core';
import { Cuestionario, Profesor, Pregunta, PreguntaDelCuestionario } from 'src/app/clases';
import { SesionService, PeticionesAPIService, CalculosService } from 'src/app/servicios';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { DialogoConfirmacionComponent } from '../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-cuestionarios',
  templateUrl: './mis-cuestionarios.component.html',
  styleUrls: ['./mis-cuestionarios.component.scss']
})
export class MisCuestionariosComponent implements OnInit {

  misCuestionarios: Cuestionario[];
  dataSource;
  profesor: Profesor;
  displayedColumns: string[] = ['titulo', 'descripcion', 'edit', 'delete', 'copy'];

  mensaje = 'Confirmar que quieres eliminar el cuestionario: ';

  constructor(private sesion: SesionService,
              private router: Router,
              private peticionesAPI: PeticionesAPIService,
              public dialog: MatDialog,
              private location: Location,
              private calculos: CalculosService) { }

  ngOnInit() {
    this.profesor = this.sesion.DameProfesor();
    this.DameTodosMisCuestionarios();
  }

  //Dame todos los cuestionarios del profesor para rellenar la tabla
  DameTodosMisCuestionarios() {
    this.peticionesAPI.DameTodosMisCuestionarios(this.profesor.id)
    .subscribe ( res => {
      if (res[0] !== undefined) {
        this.misCuestionarios = res;
        this.dataSource = new MatTableDataSource(this.misCuestionarios);
      }else{
        Swal.fire('Alerta', 'Aun no tienes ningun cuestionario', 'warning');
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  AbrirDialogoConfirmacionEliminarCuestionario(cuestionario: Cuestionario): void {
    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        titulo: cuestionario.Titulo,
      }
    });
    dialogRef.afterClosed().subscribe((confirmed:boolean) => {
      this.EliminarCuestionario(cuestionario);
      Swal.fire('Eliminado', 'Cuestionario: ' + cuestionario.Titulo + ' eliminado correctamente', 'success');
    });
  }

  EliminarCuestionario(cuestionario: Cuestionario){
    this.sesion.TomaCuestionario (cuestionario);
    this.calculos.EliminarCuestionario()
    .subscribe (() => {
      this.misCuestionarios = this.misCuestionarios.filter (a => a.id !== cuestionario.id);
      this.dataSource = new MatTableDataSource(this.misCuestionarios )
    })
  }

  EditarCuestionario(cuestionario: Cuestionario) {
    this.sesion.TomaCuestionario(cuestionario);
    this.router.navigate(['/inicio/' + this.profesor.id + '/editarCuestionario']);
  }

  CrearCopia(cuestionario: Cuestionario) {
    console.log ('vamos a crear copia');
    let preguntas: Pregunta[];
    // primero traigo las preguntas del cuestionario que voy a copiar
    this.peticionesAPI.DamePreguntasCuestionario (cuestionario.id)
    .subscribe ( res => {
      preguntas = res;
      this.peticionesAPI.CreaCuestionario(new Cuestionario(cuestionario.Titulo + '(copia)', cuestionario.Descripcion), this.profesor.id)
      .subscribe (copia => {
        // ahora tengo que asignar las mismas preguntas al cuestionario copia
        preguntas.forEach (pregunta => {
          this.peticionesAPI.PreguntasEnCuestionario( new PreguntaDelCuestionario (pregunta.id, copia.id))
          .subscribe();
        });

        // Añado el cuestionario creado a la lista que se muestra
        this.misCuestionarios.push (copia);
        this.dataSource = new MatTableDataSource(this.misCuestionarios);
      });
    });
  }
}

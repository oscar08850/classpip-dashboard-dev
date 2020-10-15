import { Component, OnInit } from '@angular/core';
import { Cuestionario, Profesor, Pregunta, PreguntaDelCuestionario, CuestionarioSatisfaccion } from 'src/app/clases';
import { SesionService, PeticionesAPIService, CalculosService } from 'src/app/servicios';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { DialogoConfirmacionComponent } from '../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { Router } from '@angular/router';
import {DragDropModule} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-mis-cuestionarios-satisfaccion',
  templateUrl: './mis-cuestionarios-satisfaccion.component.html',
  styleUrls: ['./mis-cuestionarios-satisfaccion.component.scss']
})
export class MisCuestionariosSatisfaccionComponent implements OnInit {

  misCuestionariosDeSatisfaccion: CuestionarioSatisfaccion[];
  dataSource;
  profesor: Profesor;
  displayedColumns: string[] = ['titulo', 'descripcion', 'edit', 'delete', 'copy'];

  constructor(private sesion: SesionService,
              private router: Router,
              private peticionesAPI: PeticionesAPIService,
              public dialog: MatDialog,
              private location: Location,
              private calculos: CalculosService) { }

  ngOnInit() {
    this.profesor = this.sesion.DameProfesor();
    this.DameTodosMisCuestionariosDeSatisfaccion();
  }

  // Dame todos los cuestionarios del profesor para rellenar la tabla
  DameTodosMisCuestionariosDeSatisfaccion() {
    this.peticionesAPI.DameTodosMisCuestionariosSatisfaccion(this.profesor.id)
    .subscribe ( res => {
      if (res[0] !== undefined) {
        this.misCuestionariosDeSatisfaccion = res;
        this.dataSource = new MatTableDataSource(this.misCuestionariosDeSatisfaccion);
      } else {
        Swal.fire('Alerta', 'Aun no tienes ningun cuestionario de satisfaccion', 'warning');
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // AbrirDialogoConfirmacionEliminarCuestionario(cuestionario: Cuestionario): void {
  //   const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
  //     height: '150px',
  //     data: {
  //       mensaje: this.mensaje,
  //       titulo: cuestionario.Titulo,
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe((confirmed: boolean) => {
  //     this.EliminarCuestionario(cuestionario);
  //     Swal.fire('Eliminado', 'Cuestionario: ' + cuestionario.Titulo + ' eliminado correctamente', 'success');
  //   });
  // }

  // EliminarCuestionario(cuestionario: Cuestionario) {
  //   this.sesion.TomaCuestionario (cuestionario);
  //   this.calculos.EliminarCuestionario()
  //   .subscribe (() => {
  //     this.misCuestionarios = this.misCuestionarios.filter (a => a.id !== cuestionario.id);
  //     this.dataSource = new MatTableDataSource(this.misCuestionarios );
  //   });
  // }

  EditarCuestionarioSatisfaccion(cuestionario: CuestionarioSatisfaccion) {
    this.sesion.TomaCuestionarioSatisfaccion(cuestionario);
    this.router.navigate(['/inicio/' + this.profesor.id + '/editarCuestionarioDeSatisfaccion']);
  }

  EliminarCuestionarioDeSatisfaccion(cuestionario: CuestionarioSatisfaccion) {
    Swal.fire({
      title: '¿Seguro que quieres eliminar este cuestionario de satisfaccion?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {
        this.misCuestionariosDeSatisfaccion = this.misCuestionariosDeSatisfaccion.filter (elemento => elemento.id != cuestionario.id);
        this.dataSource = new MatTableDataSource(this.misCuestionariosDeSatisfaccion);
        this.peticionesAPI.BorraCuestionarioSatisfaccion (cuestionario.id)
        .subscribe(res => {
            if (res !== undefined) {
              Swal.fire('El cuestionario se ha eliminado correctamente');

            }
        });
      }
    });

  }

  CrearCopia(cuestionario: CuestionarioSatisfaccion) {
    console.log ('vamos a crear copia');
    const copia = new CuestionarioSatisfaccion(
      cuestionario.Titulo + '(copia)',
      cuestionario.Descripcion,
      cuestionario.Afirmaciones,
      cuestionario.PreguntasAbiertas,
      cuestionario.profesorId);


    this.peticionesAPI.CreaCuestionarioSatisfaccion(copia, this.profesor.id)
      .subscribe (nuevo => {
        // Añado el cuestionario creado a la lista que se muestra
        this.misCuestionariosDeSatisfaccion.push (nuevo);
        this.dataSource = new MatTableDataSource(this.misCuestionariosDeSatisfaccion);
      });
  }

}

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
  cuestionariosDeSatisfaccionPublicos: CuestionarioSatisfaccion[];
  dataSource;
  dataSourcePublicos;
  propietarios: string[];
  profesor: Profesor;
  displayedColumns: string[] = ['titulo', 'descripcion', 'iconos'];


  constructor(private sesion: SesionService,
              private router: Router,
              private peticionesAPI: PeticionesAPIService,
              public dialog: MatDialog,
              private location: Location,
              private calculos: CalculosService) { }

  ngOnInit() {
    this.profesor = this.sesion.DameProfesor();
    this.DameTodosMisCuestionariosDeSatisfaccion();
    this.DameTodosLosCuestionariosDeSatisfaccionPublicos();
  }

  // Dame todos los cuestionarios del profesor para rellenar la tabla
  DameTodosMisCuestionariosDeSatisfaccion() {
    this.peticionesAPI.DameTodosMisCuestionariosSatisfaccion(this.profesor.id)
    .subscribe ( res => {
      if (res[0] !== undefined) {
        this.misCuestionariosDeSatisfaccion = res;
        this.dataSource = new MatTableDataSource(this.misCuestionariosDeSatisfaccion);
      }
    });
  }

  DameTodosLosCuestionariosDeSatisfaccionPublicos() {
    // traigo todos los publicos excepto los del profesor
    this.peticionesAPI.DameCuestionariosSatisfaccionPublicos()
    .subscribe ( res => {
      console.log ('Ya tengo los cuestionarios');
      console.log (res);
      if (res[0] !== undefined) {
        this.cuestionariosDeSatisfaccionPublicos = res.filter (cuestionario => cuestionario.profesorId !== this.profesor.id);
        if (this.cuestionariosDeSatisfaccionPublicos.length === 0) {
          this.cuestionariosDeSatisfaccionPublicos = undefined;
        } else {
          this.dataSourcePublicos = new MatTableDataSource(this.cuestionariosDeSatisfaccionPublicos);
          this.propietarios = [];
          // Traigo profesores para preparar los nombres de los propietarios
          this.peticionesAPI.DameProfesores()
          .subscribe ( profesores => {
            this.cuestionariosDeSatisfaccionPublicos.forEach (cuestionario => {
              const propietario = profesores.filter (p => p.id === cuestionario.profesorId)[0];
              this.propietarios.push (propietario.Nombre + ' ' + propietario.PrimerApellido);
            });
          });
        }
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



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
        if (this.misCuestionariosDeSatisfaccion === undefined) {
          this.misCuestionariosDeSatisfaccion = [];
        }
        this.misCuestionariosDeSatisfaccion.push (nuevo);
        this.dataSource = new MatTableDataSource(this.misCuestionariosDeSatisfaccion);
        Swal.fire('OK', 'Se ha creado una copia privada del cuestionario', 'success');
      });
  }

  HazPublico(cuestionario: CuestionarioSatisfaccion) {
    cuestionario.Publico = true;
    this.peticionesAPI.ModificaCuestionarioSatisfaccion (cuestionario).subscribe();
  }


  HazPrivado(cuestionario: CuestionarioSatisfaccion) {
    cuestionario.Publico = false;
    this.peticionesAPI.ModificaCuestionarioSatisfaccion (cuestionario).subscribe();
  }

  // CrearCopiaPrivada(cuestionario: CuestionarioSatisfaccion) {
  //   const copia = new CuestionarioSatisfaccion (
  //     cuestionario.Titulo + '(copia)',
  //     cuestionario.Descripcion,
  //     cuestionario.Afirmaciones,
  //     cuestionario.PreguntasAbiertas,
  //     this.profesor.id
  //   );
  //   this.peticionesAPI.CreaCuestionarioSatisfaccion (copia, this.profesor.id)
  //   .subscribe (   res => {
  //       Swal.fire('La copia privada se ha creado correctamente');
  //       this.misCuestionariosDeSatisfaccion.push (res);
  //       this.dataSource = new MatTableDataSource(this.misCuestionariosDeSatisfaccion);
  //   });


  // }




}

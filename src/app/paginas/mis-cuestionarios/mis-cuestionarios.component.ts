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

  misCuestionarios: Cuestionario[] = [];
  cuestionariosPublicos: Cuestionario[];
  dataSource;
  dataSourcePublicos;
  profesor: Profesor;
  displayedColumns: string[] = ['titulo', 'descripcion', 'iconos'];
  displayedColumnsPublico: string[] = ['titulo', 'descripcion', 'copy'];


  propietarios: string[];


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
    this.DameTodosLosCuestionariosPublicos();
  }

  //Dame todos los cuestionarios del profesor para rellenar la tabla
  DameTodosMisCuestionarios() {
    this.peticionesAPI.DameTodosMisCuestionarios(this.profesor.id)
    .subscribe ( res => {
      if (res[0] !== undefined) {
        this.misCuestionarios = res;
        this.dataSource = new MatTableDataSource(this.misCuestionarios);
      } else {
        Swal.fire('Alerta', 'Aun no tienes ningun cuestionario', 'warning');
      }
    });
  }

  DameTodosLosCuestionariosPublicos() {
    // traigo todos los publicos excepto los del profesor
    this.peticionesAPI.DameCuestionariosPublicos()
    .subscribe ( res => {

      if (res[0] !== undefined) {
        this.cuestionariosPublicos = res.filter (cuestionario => cuestionario.profesorId !== this.profesor.id);
        if (this.cuestionariosPublicos.length === 0) {
          this.cuestionariosPublicos = undefined;
        } else {
          this.dataSourcePublicos = new MatTableDataSource(this.cuestionariosPublicos);
          this.propietarios = [];
          // Traigo profesores para preparar los nombres de los propietarios
          this.peticionesAPI.DameProfesores()
          .subscribe ( profesores => {
            this.cuestionariosPublicos.forEach (cuestionario => {
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

  AbrirDialogoConfirmacionEliminarCuestionario(cuestionario: Cuestionario): void {



    Swal.fire({
      title: 'Eliminar',
      text: "Estas segura/o de que quieres eliminar el cuestionario llamado: " +cuestionario.Titulo,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'

    }).then((result) => {
      if (result.value) {
        this.EliminarCuestionario(cuestionario);
        Swal.fire('Eliminado', 'Cuestionario: ' + cuestionario.Titulo + ' eliminado correctamente', 'success');

      }
    })

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
        Swal.fire('OK', 'Se ha creado una copia privada del cuestionario', 'success');
      });
    });
  }

  HazPublico(cuestionario: Cuestionario) {
    cuestionario.Publico = true;
    this.peticionesAPI.ModificaCuestionario (cuestionario, this.profesor.id, cuestionario.id).subscribe();
  }


  HazPrivado(cuestionario: Cuestionario) {
    cuestionario.Publico = false;
    this.peticionesAPI.ModificaCuestionario (cuestionario, this.profesor.id, cuestionario.id).subscribe();
  }

  CrearCopiaPrivada(cuestionario: Cuestionario) {

    const copia = new Cuestionario (
      cuestionario.Titulo + '(copia)',
      cuestionario.Descripcion,
      this.profesor.id
    );
    console.log ('voy a crear copia privada');
    this.peticionesAPI.CreaCuestionario (copia, this.profesor.id)
    .subscribe (   nuevo => {

        this.misCuestionarios.push (nuevo);
        this.dataSource = new MatTableDataSource(this.misCuestionarios);
        // Ahora tengo que hacer copia tambien de las preguntas de cuestionario
        this.peticionesAPI.DameAsignacionesPreguntasACuestionario (cuestionario.id)
        .subscribe ( asignaciones => {

          let cont = 0;
          asignaciones.forEach (asignacion => {
            asignacion.cuestionarioId = nuevo.id;
            asignacion.id = undefined;
            console.log (asignacion);
            this.peticionesAPI.PreguntasEnCuestionario (asignacion)
            .subscribe (() => {
              cont++;
              if (cont === asignaciones.length) {
                Swal.fire('La copia privada se ha creado correctamente');
              }
            });
          });

        });
    });


  }


}

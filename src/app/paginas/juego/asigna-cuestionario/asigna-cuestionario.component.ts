import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { Location } from '@angular/common';
import { PeticionesAPIService, SesionService } from 'src/app/servicios';
import { Cuestionario } from 'src/app/clases';
import Swal from 'sweetalert2';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-asigna-cuestionario',
  templateUrl: './asigna-cuestionario.component.html',
  styleUrls: ['./asigna-cuestionario.component.scss']
})
export class AsignaCuestionarioComponent implements OnInit {
// Para comunicar el cuestionario de satisfaccion elegido al componente padre
@Output() emisorCuestionarioElegido = new EventEmitter <number []>();

  // COLUMNAS DE LA TABLA DE LOS CUESTIONARIOS
  displayedColumns: string[] = ['select', 'titulo', 'descripcion'];
  dataSourceMisCuestionarios;
  selection = new SelectionModel<any>(true, []);
  misCuestionarios: Cuestionario[] = [];
  cuestionariosPublicos: Cuestionario[] = [];

  profesorId: number;
  mensaje = 'Confirmar que quieres escoger el cuestionario: ';
  muestroPublicos = false;

  constructor(
              private sesion: SesionService,
              private peticionesAPI: PeticionesAPIService) { }

  ngOnInit() {
    this.profesorId = this.sesion.DameProfesor().id;
    this.DameTodosMisCuestionarios();
  }


  DameTodosMisCuestionarios() {
    this.peticionesAPI.DameTodosMisCuestionarios(this.profesorId)
    .subscribe ( res => {
      if (res[0] !== undefined) {
        this.misCuestionarios = res;
        this.dataSourceMisCuestionarios = new MatTableDataSource(this.misCuestionarios);
      }
    });

    this.peticionesAPI.DameCuestionariosPublicos()
    .subscribe (publicos => {
      // me quedo con los públicos de los demás
      const publicosDeOtros = publicos.filter (cuestionario => cuestionario.profesorId !== Number(this.profesorId));
      this.peticionesAPI.DameProfesores ()
      .subscribe (profesores => {
        publicosDeOtros.forEach (publico => {
          const propietario = profesores.filter (profesor => profesor.id === publico.profesorId)[0];
          publico.Titulo = publico.Titulo + '(' + propietario.Nombre + ' ' + propietario.PrimerApellido + ')';
        });
        this.cuestionariosPublicos = publicosDeOtros;
        console.log ('ya tengo los cuestionarios publicos');
        console.log (this.cuestionariosPublicos);
      });
    });
  }

  applyFilter(filterValue: string) {
    this.dataSourceMisCuestionarios.filter = filterValue.trim().toLowerCase();
  }

  // AbrirDialogoConfirmacionAsignarCuestionario(cuestionario: Cuestionario): void {
  //   const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
  //     height: '150px',
  //     data: {
  //       mensaje: this.mensaje + cuestionario.Titulo,
  //       titulo: cuestionario.Titulo,
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe((confirmed: boolean) => {
  //     this.sesion.TomaCuestionario(cuestionario);
  //     this.dialogRef.close();
  //   });
  // }

  MostrarPublicos() {
    this.muestroPublicos = true;
    console.log ('voy a mostrar los cuestionarios publicos');
    console.log (this.cuestionariosPublicos);
    this.dataSourceMisCuestionarios = new MatTableDataSource(this.misCuestionarios.concat (this.cuestionariosPublicos));
  }

  QuitarPublicos() {
    this.muestroPublicos = false;
    this.dataSourceMisCuestionarios = new MatTableDataSource(this.misCuestionarios);
  }


  
  
  HaSeleccionado() {
    if (this.selection.selected.length === 0) {
     return false;
    } else {
      return true;
    }
  }
  Marcar(row) {
    if (this.selection.isSelected(row)) {
      this.selection.deselect(row);
    } else {
      this.selection.clear();
      this.selection.select(row);
    }
  }

  AcabarSeleccion() {
    console.log ('voy a cogerlo');
    const cuestionario = this.dataSourceMisCuestionarios.data.filter (row => this.selection.isSelected(row))[0];
    console.log (cuestionario);
    this.emisorCuestionarioElegido.emit (cuestionario);
  }
 
}

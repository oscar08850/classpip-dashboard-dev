import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { Location } from '@angular/common';
import { PeticionesAPIService, SesionService } from 'src/app/servicios';
import { Cuestionario } from 'src/app/clases';
import Swal from 'sweetalert2';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';

@Component({
  selector: 'app-asigna-cuestionario',
  templateUrl: './asigna-cuestionario.component.html',
  styleUrls: ['./asigna-cuestionario.component.scss']
})
export class AsignaCuestionarioComponent implements OnInit {

  // COLUMNAS DE LA TABLA DE LOS CUESTIONARIOS
  displayedColumnsMisCuestionarios: string[] = ['titulo', 'descripcion', ' '];
  dataSourceMisCuestionarios;
  misCuestionarios: Cuestionario[] = [];
  cuestionariosPublicos: Cuestionario[] = [];

  profesorId: number;
  mensaje = 'Confirmar que quieres escoger el cuestionario: ';
  muestroPublicos = false;

  constructor(public dialog: MatDialog,
              private sesion: SesionService,
              public location: Location,
              private peticionesAPI: PeticionesAPIService,
              public dialogRef: MatDialogRef<AsignaCuestionarioComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.profesorId = this.data.profesorId;
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

  AbrirDialogoConfirmacionAsignarCuestionario(cuestionario: Cuestionario): void {
    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje + cuestionario.Titulo,
        titulo: cuestionario.Titulo,
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      this.sesion.TomaCuestionario(cuestionario);
      this.dialogRef.close();
    });
  }

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
}

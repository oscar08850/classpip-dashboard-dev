import { Component, OnInit } from '@angular/core';
import { Cuestionario, Profesor } from 'src/app/clases';
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
  displayedColumns: string[] = ['titulo', 'descripcion', 'edit', ' '];

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

  applyFilter(filterValue: string){
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

  EditarCuestionario(cuestionario: Cuestionario){
    this.sesion.TomaCuestionario(cuestionario);
    this.router.navigate(['/inicio/' + this.profesor.id + '/editarCuestionario']);
  }
}

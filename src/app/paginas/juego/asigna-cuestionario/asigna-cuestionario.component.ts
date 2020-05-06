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

  //COLUMNAS DE LA TABLA DE LOS CUESTIONARIOS
  displayedColumnsMisCuestionarios: string[] = ['titulo', 'descripcion', ' '];
  dataSourceMisCuestionarios;
  misCuestionarios: Cuestionario[] = [];

  profesorId: number;
  mensaje = 'Confirmar que quieres escoger el cuestionario: ';

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

  DameTodosMisCuestionarios(){
    this.peticionesAPI.DameTodosMisCuestionarios(this.profesorId)
    .subscribe ( res => {
      if (res[0] !== undefined) {
        this.misCuestionarios = res;
        this.dataSourceMisCuestionarios = new MatTableDataSource(this.misCuestionarios);
      }else{
        Swal.fire('Alerta', 'Aun no tiene ningun cuestionario', 'warning');
      }
    });
  }

  applyFilter(filterValue: string){
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
    dialogRef.afterClosed().subscribe((confirmed:boolean) => {
      this.sesion.TomaCuestionario(cuestionario);
      this.dialogRef.close();      
    });
  }

}

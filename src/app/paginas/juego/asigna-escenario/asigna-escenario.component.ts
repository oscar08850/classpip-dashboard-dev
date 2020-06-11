import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { Location } from '@angular/common';
import { PeticionesAPIService, SesionService } from 'src/app/servicios';
import Swal from 'sweetalert2';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { Escenario } from 'src/app/clases/Escenario';

@Component({
  selector: 'app-asigna-escenario',
  templateUrl: './asigna-escenario.component.html',
  styleUrls: ['./asigna-escenario.component.scss']
})
export class AsignaEscenarioComponent implements OnInit {

  displayedColumnsMisEscenarios: string[] = ['Mapa', 'Descripcion', ' '];
  dataSourceMisEscenarios;
  misEscenarios: Escenario[] = [];

  profesorId: number;
  mensaje = 'Confirmar que quieres escoger el escenario: ';

  constructor(public dialog: MatDialog,
              private sesion: SesionService,
              public location: Location,
              private peticionesAPI: PeticionesAPIService,
              public dialogRef: MatDialogRef<AsignaEscenarioComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.profesorId = this.data.profesorId;
    this.DameTodosMisEscenarios();
  }

  DameTodosMisEscenarios() {
    this.peticionesAPI.DameEscenariosDelProfesor(this.profesorId)
    .subscribe ( res => {
      if (res[0] !== undefined) {
        this.misEscenarios = res;
        this.dataSourceMisEscenarios = new MatTableDataSource(this.misEscenarios);
      } else {
        Swal.fire('Alerta', 'Aun no tiene ningun escenario', 'warning');
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSourceMisEscenarios.filter = filterValue.trim().toLowerCase();
  }

  AbrirDialogoConfirmacionAsignarEscenario(escenario: Escenario): void {
    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje + escenario.Mapa,
        titulo: escenario.Mapa,
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      this.sesion.TomaEscenario(escenario);
      this.dialogRef.close();
    });
  }

}

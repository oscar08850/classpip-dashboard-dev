import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Location } from '@angular/common';
import { PeticionesAPIService, SesionService } from 'src/app/servicios';
import Swal from 'sweetalert2';
import { Escenario } from 'src/app/clases/Escenario';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-asigna-escenario',
  templateUrl: './asigna-escenario.component.html',
  styleUrls: ['./asigna-escenario.component.scss']
})
export class AsignaEscenarioComponent implements OnInit {

  @Output() emisorEscenario = new EventEmitter <Escenario>();

  
  displayedColumns: string[] = ['select', 'mapa', 'descripcion'];
  selection = new SelectionModel<Escenario>(true, []);
  dataSourceMisEscenarios;
  misEscenarios: Escenario[] = [];

  profesorId: number;
  mensaje = 'Confirmar que quieres escoger el escenario: ';

  constructor(public dialog: MatDialog,
              private sesion: SesionService,
              public location: Location,
              private peticionesAPI: PeticionesAPIService
              ) { }

  ngOnInit() {
    this.profesorId = this.sesion.DameProfesor().id;
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

  AsignarEscenario() {
    let escenarioSeleccionado;
    this.dataSourceMisEscenarios.data.forEach ( row => {
      if (this.selection.isSelected(row)) {
        console.log ('hemos elegido ', row);
        escenarioSeleccionado = row;

      }
    });
    this.emisorEscenario.emit (escenarioSeleccionado);

  }




  // applyFilter(filterValue: string) {
  //   this.dataSourceMisEscenarios.filter = filterValue.trim().toLowerCase();
  // }

  // AbrirDialogoConfirmacionAsignarEscenario(escenario: Escenario): void {
  //   const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
  //     height: '150px',
  //     data: {
  //       mensaje: this.mensaje + escenario.Mapa,
  //       titulo: escenario.Mapa,
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe((confirmed: boolean) => {
  //     this.sesion.TomaEscenario(escenario);
  //     this.dialogRef.close();
  //   });
  // }

}

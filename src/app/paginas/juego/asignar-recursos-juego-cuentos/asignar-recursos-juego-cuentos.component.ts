import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatDialog, MatTabGroup } from '@angular/material';
import {  Alumno, Equipo} from 'src/app/clases/index';

import { RecursoCuento } from '../../../clases/clasesParaJuegoDeCuentos/RecursoCuento';
import { JuegoDeCuento } from '../../../clases/clasesParaJuegoDeCuentos/JuegoDeCuento';


import {SelectionModel} from '@angular/cdk/collections';
// Services

   // Services
import { SesionService, PeticionesAPIService, CalculosService } from '../../../servicios/index';
import { element } from 'protractor';
@Component({
  selector: 'app-asignar-recursos-juego-cuentos',
  templateUrl: './asignar-recursos-juego-cuentos.component.html',
  styleUrls: ['./asignar-recursos-juego-cuentos.component.scss']
})
export class AsignarRecursosJuegoCuentosComponent implements OnInit {
  @Output() emisorRecursosElegidos = new EventEmitter <number []>();
  grupoId: number;
  profesorId: number;
 
  recursos: RecursoCuento[];
  RecursosElegidos: number[] = [];
 
  alumnos: Alumno[];
  equipos: Equipo[];
 
  datasource;
 
  isDisabled: Boolean = true;
 
  displayedColumns: string[] = ['select', 'nombreRecurso'];
 
 
  juego: JuegoDeCuento;
 
  selectedRowIndex = -1;
 
  selection = new SelectionModel<any>(true, []);
 
  constructor(
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    public dialog: MatDialog) { }

  ngOnInit() {
    console.log("entro");
    this.profesorId = this.sesion.DameProfesor().id;
    this.recuperarRecursos();
  }

  

 highlight(row) {
  this.selectedRowIndex = row.id;
}

recuperarRecursos() {
  this.peticionesAPI.recuperarListaRecursos(this.profesorId)
  .subscribe(elements => {
    if (elements !== undefined) {
      this.recursos = elements;
      this.datasource = new MatTableDataSource(this.recursos);
    } else {
      // Mensaje al usuario
      console.log('Este profesor no tiene colecciones');
    }
  });
}


AcabarSeleccion() {
    this.datasource.data.forEach
      (row => {
                if (this.selection.isSelected(row))  {
                  this.RecursosElegidos.push (row.id);
                }
            }
      );
    this.emisorRecursosElegidos.emit (this.RecursosElegidos);
}


IsAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.datasource.data.length;
  return numSelected === numRows;
}


MasterToggle() {
  if (this.IsAllSelected()) {
    this.selection.clear(); 
  } else {
    this.datasource.data.forEach(row => this.selection.select(row));
  }
}



}

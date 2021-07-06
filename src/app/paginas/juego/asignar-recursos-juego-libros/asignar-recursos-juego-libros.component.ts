import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatDialog, MatTabGroup } from '@angular/material';
import {  Alumno, Equipo} from 'src/app/clases/index';

import { RecursoLibro } from '../../../clases/clasesParaLibros/recursoLibro';
import { JuegoDeLibros } from '../../../clases/JuegoDeLibros';


import {SelectionModel} from '@angular/cdk/collections';
// Services

   // Services
import { SesionService, PeticionesAPIService, CalculosService } from '../../../servicios/index';
import { element } from 'protractor';
@Component({
  selector: 'app-asignar-recursos-juego-libros',
  templateUrl: './asignar-recursos-juego-libros.component.html',
  styleUrls: ['./asignar-recursos-juego-libros.component.scss']
})
export class AsignarRecursosJuegoLibrosComponent implements OnInit {
 @Output() emisorRecursosElegidos = new EventEmitter <number []>();
 grupoId: number;
 profesorId: number;

 recursos: RecursoLibro[];
 RecursosElegidos: number[] = [];

 alumnos: Alumno[];
 equipos: Equipo[];

 datasource;

 isDisabled: Boolean = true;

 displayedColumns: string[] = ['select', 'nombreRecurso'];


 juego: JuegoDeLibros;

 selectedRowIndex = -1;

 selection = new SelectionModel<any>(true, []);

 constructor(
              private sesion: SesionService,
              private peticionesAPI: PeticionesAPIService,
              public dialog: MatDialog) { }

 ngOnInit() {

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

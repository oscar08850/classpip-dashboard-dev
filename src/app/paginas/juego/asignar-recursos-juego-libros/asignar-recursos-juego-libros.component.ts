import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

// Imports para abrir diálogo mostrar cromos
import { MatDialog, MatTabGroup } from '@angular/material';
import {  Alumno, Equipo} from 'src/app/clases/index';

import { RecursoLibro } from '../../../clases/clasesParaLibros/recursoLibro';
import { JuegoDeLibros } from '../../../clases/JuegoDeLibros';


 /* Necesario para controlar qué filas están seleccionadas */
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
 // Para comunicar el nombre de la colección seleccionada a componente padre
 @Output() emisorRecursosElegidos = new EventEmitter <number []>();
 grupoId: number;
 profesorId: number;

 recursos: RecursoLibro[];
 RecursosElegidos: number[] = [];

 alumnos: Alumno[];
 equipos: Equipo[];

 datasource;

 // tslint:disable-next-line:ban-types
 isDisabled: Boolean = true;

 displayedColumns: string[] = ['select', 'nombreRecurso'];


 juego: JuegoDeLibros;

 // Para que al hacer click se quede la fila marcada
 selectedRowIndex = -1;

 /* Estructura necesaria para determinar que filas son las que se han seleccionado */
 selection = new SelectionModel<any>(true, []);

 constructor(
              private sesion: SesionService,
              private peticionesAPI: PeticionesAPIService,
              public dialog: MatDialog) { }

 ngOnInit() {

   this.profesorId = this.sesion.DameProfesor().id;
   this.recuperarRecursos();
 }


 // Para que al hacer click se quede la fila marcada
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

 // AgregaFamilia(familia: FamiliaAvatares) {
 //   this.familiasElegidas.push (familia);
 // }
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


 /* Para averiguar si todas las filas están seleccionadas */
 IsAllSelected() {
   const numSelected = this.selection.selected.length;
   const numRows = this.datasource.data.length;
   return numSelected === numRows;
 }

 /* Cuando se clica en el checkbox de cabecera hay que ver si todos los
   * checkbox estan acivados, en cuyo caso se desactivan todos, o si hay alguno
   * desactivado, en cuyo caso se activan todos */

 MasterToggle() {
   if (this.IsAllSelected()) {
     this.selection.clear(); // Desactivamos todos
   } else {
     // activamos todos
     this.datasource.data.forEach(row => this.selection.select(row));
   }
 }


}

import { Component, OnInit } from '@angular/core';
import { Profesor } from 'src/app/clases';
import { SesionService } from 'src/app/servicios';
import { CdkColumnDef } from '@angular/cdk/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-actividad-config',
  templateUrl: './actividad-config.component.html',
  styleUrls: ['./actividad-config.component.scss']
})
export class ActividadConfigComponent implements OnInit {

  //Arrays que contienen los flags para configurar los registros y notificaciones ([1] → Creación del Juego, [2] → Acceso al Juego, [10] → Asignación de Puntos, etc.)
  registros: boolean[];
  notificaciones: boolean[];

  selection1 = new SelectionModel<any>(true, []);
  selection2 = new SelectionModel<any>(true, []);
  dataSourceEventos;
  haCambiado: boolean[];
  hayCambios: boolean = false;
  tiposDeEvantos: string [] = [];

  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['evento', 'registroEvento', 'notificacion'];


  constructor(
    private sesionService: SesionService
  ) { }

  ngOnInit() {
    //Los arrays se rellenarán con los datos que le vengan de la última configuración del profesor (nuevo parámetro Config del modelo Profesor)
    let profesor: Profesor = this.sesionService.DameProfesor();
    this.registros = [];
    this.notificaciones = [];
    this.tiposDeEvantos.push ('Creación de un juego');
    this.tiposDeEvantos.push ('Juego de puntos');
    this.tiposDeEvantos.push ('Juego de colección');
    this.tiposDeEvantos.push ('Juego de avatares');

    this.dataSourceEventos = new MatTableDataSource(this.tiposDeEvantos);
    // this.configuracion = Array(3).fill (true);
  }

  GuardarCambios(){

  }

  /* Para averiguar si todos los elementos de un selector determinado están activos o no  */
  IsAllSelected(n) {
      let numSelected;
      if (n === 1) {
        numSelected = this.selection1.selected.length;
      }
      if (n === 2) {
        numSelected = this.selection2.selected.length;
      }
      const numRows = this.dataSourceEventos.data.length;
      return numSelected === numRows;
  }
  
  
  // Esta función se ejecuta cuando clicamos en el checkbox de cabecera
  
  MasterToggle(n) {
  
    if (n === 1) {
      if (this.IsAllSelected(1)) {
            console.log ('Borro todos');
            // Si todos los elementos del selector estan activos hay que desactivarlos todos
            this.selection1.clear(); // Desactivamos todos
      } else {
            console.log ('activo todos');
            // Tengo que activar todos los elementos del selector
            this.dataSourceEventos.data.forEach(row => this.selection1.select(row));
      }
    }
    if (n === 2) {
          if (this.IsAllSelected(2)) {
            this.selection2.clear(); // Desactivamos todos
          } else {
            this.dataSourceEventos.data.forEach(row => this.selection2.select(row));
          }
        }
 
    this.hayCambios = true;
    this.haCambiado = Array(3).fill (true);
    console.log (this.haCambiado);
  }
  HaCambiado(n , i) {
      // Cuando hago click sobre columna n de fila i 
      this.haCambiado[i] = true;
      this.hayCambios = true;
  }
  RegistrarCambios() {
    console.log ('Situacion actual de registro eventos ', this.selection1);
    console.log ('Situacion actual de registro notificaciones ', this.selection2);
  }
}

import { Component, OnInit, Input , ViewChild} from '@angular/core';
import { Location } from '@angular/common';

import {MatTableDataSource} from '@angular/material/table';

/* Necesario para controlar qué filas están seleccionadas */
import {SelectionModel} from '@angular/cdk/collections';

/* Imports necesarios para la ordenación y la paginación */
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

// Clases
import { Profesor } from '../../clases/index';

// Servicios
import {ProfesorService} from '../../servicios/index';
import { TrustedString } from '@angular/core/src/sanitization/bypass';




@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  profesor: any = [];


  elementoSeleccionado: any; // Lo usará el selector
  // Estos son los elementos que mostrará el selector
  listaElementos: string[] = ['uno', 'dos', 'tres', 'cuatro', 'cinco'];
  // Aqui construirá la función AcciónConSeleccionado la frase que se mostrará
  // en pantalla una vez seleccionado el elemento
  resultado: string;


  /* Estructura necesaria para determinar que filas son las que se han seleccionado */
  selection = new SelectionModel<any>(true, []);
  /* Estos son los identificadores de las columnas de la tabla */
  displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol'];
 /* Los datos que se mostrarán en la tabla */
  dataSource = new MatTableDataSource ([
      {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
      {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
      {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
      {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
      {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
      {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
      {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
      {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
      {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
      {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  ]);



  /* Esta variable determina si el boton de comprobar está activo o no */
  botonDesactivado = true;

  constructor(private servicioProfesor: ProfesorService,
              private location: Location) { }

  /* Anotaciones necesarias para la ordenación y la paginación */
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {

    // LE PIDO AL SERVICIO QUE ME DE LOS DATOS DEL PROFESOR QUE ME HAN ENVIADO
    this.profesor = this.servicioProfesor.RecibirProfesorDelServicio();
    /* Instrucciones necesarias para la ordenación y la paginación */
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  /* Para averiguar si todas las filas están seleccionadas */
  IsAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Cuando se clica en el checkbox de cabecera hay que ver si todos los
   * checkbox estan acivados, en cuyo caso se desactivan todos, o si hay alguno
   * desactivado, en cuyo caso se activan todos
  */
  MasterToggle() {
    if (this.IsAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }
  /* Al clicar el boton simplemente mostramos en consola las filas seleccionadas */
  ProcesarSeleccionados() {
    console.log (' Filas seleccionadas:');
    this.dataSource.data.forEach
      (row => {
                if (this.selection.isSelected(row))  {
                  console.log (row.name);
                }
            }
      );
  }

  /* Esta función decide si el boton debe estar activo (si hay al menos
  una fila seleccionada) o si debe estar desactivado (si no hay ninguna fila seleccionada) */
  ActualizarBoton() {
    if (this.selection.selected.length === 0) {
      this.botonDesactivado = true;
    } else {
      this.botonDesactivado = false;
    }
  }

  /* Esta función se llama cuando se quiere aplicar el filtro al dataSource */
  AplicarFiltro(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Esta es la función que se ejecuta cuando se selecciona un elemento
  // con el selector. Simplemente construimos una frase que se mostrará en pantalla
  AccionConSeleccionado() {
    this.resultado = 'Has seleccionado: ' + this.elementoSeleccionado;
  }
}

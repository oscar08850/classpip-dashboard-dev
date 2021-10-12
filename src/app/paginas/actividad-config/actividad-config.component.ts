/*
E este componente se controla la generación de registros y notificaciones de eventos.
Cada tipo de evento tiene un código. De emomento tenemos estos:
  1: Creación de un nuevo juego
  10: Asignación de puntos
  11: Cambio de nivel en un juego de puntos
  20: Asignación de cromos
  21: Regalar un cromo
  22: Colección completada
  30: Asignar privilegio en juego de avatar
  31: Quitar privilegio en juego de avatar
  32: Modificar avatar

El modelo del profesor tiene un campo que se llama configuraciónEventos. Se trata de un vector. 
Cada posición está asociada a un grupo de tipos de eventos:
  Posición 0: Creación de juegos
  Posición 1: Eventos de juego de puntos
  Posición 2: Eventos de juego de colección
  Posición 3: Eventos de juego de avatar

En cada posición hay un vector de 2 booleanos. El [0] indica si hay que registrar eventos de ese grupo
y el [1] indica si hay que generar notificaciones.
La configuración de todos esos valores se realiza en este componente.

En calculos está la función RegistrarEvento, que recibe un evento y se decide si se registra o no según 
esté la configuración del profesor.
La generación de la notificación se controla de forma similar en las funciones EnviarNotificacionIndividual
y EnviarNotificacionEquipo, que están en ComServerService.
*/
import { Component, OnInit } from '@angular/core';
import { Profesor } from 'src/app/clases';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import { CdkColumnDef } from '@angular/cdk/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import Swal from 'sweetalert2';

import { Location } from '@angular/common';

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
  // haCambiado: boolean[];
  hayCambios: boolean = false;
  tiposDeEvantos: string [] = [];
  configuracion = [];

  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['evento', 'registroEvento', 'notificacion'];
  profesor: Profesor;

  constructor(
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    private location: Location
  ) { }

  ngOnInit() {
    //Los arrays se rellenarán con los datos que le vengan de la última configuración del profesor (nuevo parámetro Config del modelo Profesor)
    this.profesor = this.sesion.DameProfesor();
    console.log ('CONFIGURACION ', this.profesor.configuracionEventos);
    this.registros = [];
    this.notificaciones = [];
    this.tiposDeEvantos.push ('Creación de un juego');
    this.tiposDeEvantos.push ('Juego de puntos');
    this.tiposDeEvantos.push ('Juego de colección');
    this.tiposDeEvantos.push ('Juego de avatares');

    this.dataSourceEventos = new MatTableDataSource(this.tiposDeEvantos);
    // La segunda condición es para subsanar el error de que algunos profes solo tenían dos filas de tipos de eventos.
    if (!this.profesor.configuracionEventos || this.profesor.configuracionEventos.length < 4 ) {
      this.configuracion = Array(this.tiposDeEvantos.length);
      this.configuracion [0] = Array(2).fill (false);
      this.configuracion [1] = Array(2).fill (false);
      this.configuracion [2] = Array(2).fill (false);
      this.configuracion [3] = Array(2).fill (false);
      this.profesor.configuracionEventos = this.configuracion;
    }
    for (let i = 0; i <  this.dataSourceEventos.data.length; i++) {
      if (this.profesor.configuracionEventos[i][0]) {
        this.selection1.select( this.dataSourceEventos.data[i]);
      }
      if (this.profesor.configuracionEventos[i][1]) {
        this.selection2.select( this.dataSourceEventos.data[i]);
      }
    }
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
    // this.haCambiado = Array(3).fill (true);
    // console.log (this.haCambiado);
  }
  HaCambiado(n , i) {
      // Cuando hago click sobre columna n de fila i 
      // this.haCambiado[i] = true;
      this.hayCambios = true;
      console.log ('hay cambios ', this.hayCambios);

  }
  RegistrarCambios() {

    for (let i = 0; i <  this.dataSourceEventos.data.length; i++) {
      this.profesor.configuracionEventos[i][0] = this.selection1.isSelected( this.dataSourceEventos.data[i]);
      this.profesor.configuracionEventos[i][1] = this.selection2.isSelected( this.dataSourceEventos.data[i]);
    }
    Swal.fire({
      title: '¿Seguro que quieres modificar la configuración?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        console.log ('voy a modificar profesor ', this.profesor);
        this.peticionesAPI.ModificaProfesor (this.profesor)
        .subscribe ((profesor) => {
          console.log ('ya esta ', profesor);
          Swal.fire('Configuración modificada');
        });
      }
    });
    this.hayCambios = false;
  }

  goBack() {
    if (this.hayCambios) {
      Swal.fire({
        title: '¿Seguro que quieres salir?',
        text: 'Has hecho cambios en la configuración que no has registrado',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, estoy seguro',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          this.location.back();
        }
      });
    } else {
      this.location.back();
    }
  }
}

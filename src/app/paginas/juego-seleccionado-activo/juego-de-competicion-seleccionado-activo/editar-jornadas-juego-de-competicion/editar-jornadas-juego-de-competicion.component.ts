import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
// Clases
// tslint:disable-next-line:max-line-length
import { Alumno, Juego, Jornada, TablaJornadas, AlumnoJuegoDeCompeticionLiga, TablaAlumnoJuegoDeCompeticion } from '../../../../clases/index';

// Servicio
import { SesionService, PeticionesAPIService, CalculosService } from '../../../../servicios/index';

// Imports para abrir diálogo y snackbar
import { MatDialog, MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-editar-jornadas-juego-de-competicion',
  templateUrl: './editar-jornadas-juego-de-competicion.component.html',
  styleUrls: ['./editar-jornadas-juego-de-competicion.component.scss']
})
export class EditarJornadasJuegoDeCompeticionComponent implements OnInit {

  /* Estructura necesaria para determinar que filas son las que se han seleccionado */
  selection = new SelectionModel<any>(true, []);
    // Juego De CompeticionLiga seleccionado
  juegoSeleccionado: Juego;
  numeroTotalJornadas: number;
  jornadasTabla: Jornada[];
  jornadas: Jornada[];
  dataSource: any;
  // tslint:disable-next-line:ban-types
  isDisabled: Boolean = true;
  botonTablaDesactivado = true;
  JornadaSeleccionadaId: number;
  seleccionados: boolean[];
  JornadasCompeticion: TablaJornadas[] = [];

  constructor(    public sesion: SesionService,
                  public location: Location,
                  public calculos: CalculosService,
                  public peticionesAPI: PeticionesAPIService) {}

  ngOnInit() {
    const datos = this.sesion.DameDatosParaJornadas();
    this.jornadas = datos.jornadas;
    this.JornadasCompeticion = datos.JornadasCompeticion;
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log ('juego seleccionado ' + this.juegoSeleccionado.Modo);
    console.log ('1 Voy a por las jornadas');
    // this.JornadasCompeticion = this.TablaJornadas();
    console.log (this.JornadasCompeticion);
    this.dataSource = new MatTableDataSource (this.JornadasCompeticion);
  }

  TablaJornadas(): any {
     console.log('4 Las jornadas son: ' + this.jornadas);
     this.JornadasCompeticion = this.calculos.DameTablaJornadasLiga( this.juegoSeleccionado, this.jornadas);
     console.log('4' + this.JornadasCompeticion);
  }


  /* Para averiguar si todas las filas están seleccionadas */
  IsAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
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
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }
  /* Esta función decide si el boton debe estar activo (si hay al menos
  una fila seleccionada) o si debe estar desactivado (si no hay ninguna fila seleccionada) */
  /* En este caso para que esté activo también debe haber seleccionado el tipo de punto a asignar */
  ActualizarBotonTabla() {
    if ((this.selection.selected.length === 0) || (this.JornadaSeleccionadaId === undefined)) {
      this.botonTablaDesactivado = true;
    } else {
      this.botonTablaDesactivado = false;
    }
  }



  EditarJornada() {
    // Tengo que hacer un recorrido diferente del dataSource porque necesito saber el
    // valor de i

    for ( let i = 0; i < this.dataSource.data.length; i++) {
      console.log ('Vuelta ' + i);


      // Buscamos los alumnos que hemos seleccionado
      if (this.selection.isSelected(this.dataSource.data[i]))  {

      }
    }
    this.dataSource = new MatTableDataSource (this.JornadasCompeticion);
    this.selection.clear();
    this.botonTablaDesactivado = true;
  }



  BotonDesactivado() {

    console.log('voy a ver si hay algo en los inputs');
    if (this.JornadaSeleccionadaId !== undefined ) {
      // && this.valorPunto !== undefined && this.valorPunto !== null) {
      console.log('hay algo, disabled');
      this.isDisabled = false;
    } else {
      console.log('no hay nada');
      this.isDisabled = true;
    }
  }
   /* Esta función decide si el boton debe estar activo (si hay al menos
  una fila seleccionada) o si debe estar desactivado (si no hay ninguna fila seleccionada) */
  ActualizarBoton() {
    if (this.selection.selected.length === 0) {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
  }

  Disabled() {

      if (this.seleccionados.filter(res => res === true)[0] !== undefined) {
        console.log('Hay alguno seleccionado');
        this.BotonDesactivado();
      } else {
        console.log('No hay alguno seleccionado');
        this.isDisabled = true;
      }

    }

  goBack() {
    this.location.back();
  }

}

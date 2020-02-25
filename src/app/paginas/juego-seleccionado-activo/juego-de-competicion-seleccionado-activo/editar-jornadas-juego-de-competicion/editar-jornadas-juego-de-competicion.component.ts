import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
// Clases
// tslint:disable-next-line:max-line-length
import { Alumno, Juego, Jornada, TablaJornadas, AlumnoJuegoDeCompeticionLiga, TablaAlumnoJuegoDeCompeticion } from '../../../../clases/index';

// Servicio
import { SesionService, PeticionesAPIService, CalculosService } from '../../../../servicios/index';


// Imports para abrir diálogo y snackbar
import { MatDialog, MatSnackBar } from '@angular/material';
import { from } from 'rxjs';



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
  myForm: FormGroup;
  NuevaFechaFormGroup: FormGroup;
  IDJornada: number;
  // tslint:disable-next-line:ban-types
  isDisabled: Boolean = true;
  botonTablaDesactivado = true;
  JornadaSeleccionadaId: number;
  seleccionados: boolean[];
  JornadasCompeticion: TablaJornadas[] = [];
  NuevaFecha: Date;

  displayedColumnsJornada: string[] = ['select', 'NumeroDeJornada', 'Fecha', 'CriterioGanador'];


  constructor(    public sesion: SesionService,
                  public location: Location,
                  public calculos: CalculosService,
                  public peticionesAPI: PeticionesAPIService,
                  // tslint:disable-next-line:variable-name
                  private _formBuilder: FormBuilder) {}

  ngOnInit() {
    const datos = this.sesion.DameDatosJornadas();
    this.jornadas = datos.jornadas;
    this.JornadasCompeticion = datos.JornadasCompeticion;
    // console.log ('this.JornadasCompeticion[1].Fecha');
    // console.log (this.JornadasCompeticion[0].Fecha);
    // console.log (this.JornadasCompeticion[1].Fecha);
    // console.log (this.JornadasCompeticion[2].Fecha);
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log ('juego seleccionado ' + this.juegoSeleccionado.Modo);
    console.log('Jornadas: ');
    console.log (this.jornadas);
    // this.JornadasCompeticion = this.TablaJornadas();
    console.log('Jornadas Competicion: ');
    console.log (this.JornadasCompeticion);
    this.dataSource = new MatTableDataSource (this.JornadasCompeticion);

    this.myForm = this._formBuilder.group({
      CriterioGanador: ['', Validators.required],
      picker: ['', Validators.required],
    });

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
    let NuevaFecha: Date;
    NuevaFecha = this.myForm.value.picker;
    let NuevoCriterio: string;
    NuevoCriterio = this.myForm.value.CriterioGanador;
    if ((this.selection.selected.length === 0) || ( NuevaFecha === undefined) || ( NuevoCriterio === undefined)) {
      this.botonTablaDesactivado = true;
    } else {
      this.botonTablaDesactivado = false;
    }
  }

  onChangeEvent(e): void {

    console.log('Nueva fecha seleccionada :' + e.target.value);

    this.NuevaFecha = e.target.value;
  }

  EditarJornada() {
    // Tengo que hacer un recorrido diferente del dataSource porque necesito saber el
    // valor de i


    let NuevoCriterio: string;
    NuevoCriterio = this.myForm.value.CriterioGanador;
    console.log('Voy a asignar Fecha ' + this.NuevaFecha );
    console.log('Voy a asignar criterio ' + NuevoCriterio);
    for ( let i = 0; i < this.dataSource.data.length; i++) {
      console.log ('Vuelta para guardar, check jornada ' + i + 1);


      // Buscamos los alumnos que hemos seleccionado
      if (this.selection.isSelected(this.dataSource.data[i]))  {
        console.log('Voy a asignar 2 ' + this.NuevaFecha + NuevoCriterio);
        console.log(this.jornadas[i]);
        console.log(this.NuevaFecha, NuevoCriterio, this.jornadas[i].id);
        this.IDJornada = this.jornadas[i].id;
        this.jornadas[i] = new Jornada (this.NuevaFecha, NuevoCriterio, this.jornadas[i].JuegoDeCompeticionId);
        console.log('Nueva Jornada ' + this.IDJornada);
        console.log(this.jornadas[i]);
        this.peticionesAPI.ModificarJornada (this.jornadas[i], this.IDJornada)
        .subscribe(JornadaCreada => {
          this.jornadas[i] = JornadaCreada;
        });
        console.log('Jornada Modificada');
        this.JornadasCompeticion[i].CriterioGanador = this.jornadas[i].CriterioGanador;
        this.JornadasCompeticion[i].Fecha = this.jornadas[i].Fecha;
        this.JornadasCompeticion[i].NumeroDeJornada = i + 1;
        console.log(this.JornadasCompeticion[i]);


      }
    }
    this.dataSource = new MatTableDataSource (this.JornadasCompeticion);
    this.selection.clear();
    this.botonTablaDesactivado = true;
  }



  BotonDesactivado() {
    let NuevaFecha: Date;
    NuevaFecha = this.myForm.value.picker;
    let NuevoCriterio: string;
    NuevoCriterio = this.myForm.value.CriterioGanador;

    console.log('voy a ver si hay algo en los inputs');
    if (NuevaFecha !== undefined && NuevoCriterio !== undefined ) {
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

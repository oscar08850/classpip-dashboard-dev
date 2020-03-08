import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
// Clases
// tslint:disable-next-line:max-line-length
import { TablaPuntosFormulaUno, Juego } from '../../../../clases/index';

// Servicio
import { SesionService, PeticionesAPIService, CalculosService } from '../../../../servicios/index';


// Imports para abrir diálogo y snackbar
import { MatDialog, MatSnackBar } from '@angular/material';
import { from } from 'rxjs';



@Component({
  selector: 'app-editar-puntos-juego-de-competicion-formula-uno',
  templateUrl: './editar-puntos-juego-de-competicion-formula-uno.component.html',
  styleUrls: ['./editar-puntos-juego-de-competicion-formula-uno.component.scss']
})
export class EditarPuntosJuegoDeCompeticionFormulaUnoComponent implements OnInit {

  myForm1: FormGroup;

  // No nos permite avanzar en el primer paso si no se ha seleccionado una opción
  // tslint:disable-next-line:ban-types
  isDisabled: Boolean = true;

  juegoSeleccionado: Juego;
  selection = new SelectionModel<any>(true, []);
  botonTablaDesactivado = true;
  seleccionados: boolean[];
  Puntuacion: number[];
  dataSource: any;
  TablaPuntuacion: TablaPuntosFormulaUno[];
  displayedColumnsTablaPuntuacion: string[] = ['select', 'Posicion', 'Puntos'];
  JuegoModificado: Juego;


  constructor(    public sesion: SesionService,
                  public location: Location,
                  public calculos: CalculosService,
                  public peticionesAPI: PeticionesAPIService,
                  // tslint:disable-next-line:variable-name
                  private _formBuilder: FormBuilder) {}

  ngOnInit() {

    this.juegoSeleccionado = this.sesion.DameJuego();
    this.TablaPuntuacion = this.sesion.DameTablaeditarPuntos();
    this.dataSource = new MatTableDataSource (this.TablaPuntuacion);
    this.Puntuacion = this.juegoSeleccionado.Puntos;
    console.log(this.juegoSeleccionado);
    this.myForm1 = this._formBuilder.group({
      NuevaPuntuacion: ['', Validators.required],
    });

  }

// Para averiguar si todas las filas están seleccionadas */
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
  let NuevaPuntuacion: number;
  NuevaPuntuacion = this.myForm1.value.NuevaPuntuacion;
  if ((this.selection.selected.length === 0) || ( NuevaPuntuacion === undefined)) {
    this.botonTablaDesactivado = true;
  } else {
    this.botonTablaDesactivado = false;
  }
}

BotonDesactivado() {
  let NuevaPuntuacion: number;
  NuevaPuntuacion = this.myForm1.value.NuevaPuntuacion;

  console.log('voy a ver si hay algo en los inputs');
  if (NuevaPuntuacion !== undefined ) {
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

AnadirPuntos() {
// Tengo que hacer un recorrido diferente del dataSource porque necesito saber el
  // valor de i

  let NuevaPuntuacion: number;
  NuevaPuntuacion = this.myForm1.value.NuevaPuntuacion;
  console.log('Voy a asignar NuevaPuntuacion ' + NuevaPuntuacion);
  for ( let i = 0; i < this.dataSource.data.length; i++) {

    // Buscamos los alumnos que hemos seleccionado
    if (this.selection.isSelected(this.dataSource.data[i]))  {
      console.log('Voy a asignar tantos puntos ' + NuevaPuntuacion);
      console.log(this.Puntuacion[i]);
      console.log(NuevaPuntuacion);
      this.Puntuacion[i] = NuevaPuntuacion;
      console.log(this.Puntuacion);
      this.TablaPuntuacion[i].Puntuacion = NuevaPuntuacion;
      console.log(this.TablaPuntuacion[i]);
    }
  }
  this.dataSource = new MatTableDataSource (this.TablaPuntuacion);
  this.selection.clear();
  this.botonTablaDesactivado = true;

}
AnadirJugadorconPuntos() {
  // Tengo que hacer un recorrido diferente del dataSource porque necesito saber el
     // valor de i
     let i: number;
     i = this.Puntuacion.length;
     console.log(i);
     console.log(this.Puntuacion);
     // this.Puntuacion[i] = NuevaPuntuacion;
     this.TablaPuntuacion[i] = new TablaPuntosFormulaUno(i + 1, 1);
     this.Puntuacion[i] = this.TablaPuntuacion[i].Puntuacion;
     console.log(this.TablaPuntuacion[i]);

     this.dataSource = new MatTableDataSource (this.TablaPuntuacion);
     // this.selection.clear();
     // this.botonTablaDesactivado = true;
   }

   EliminarJugadorconPuntos() {

       let i: number;
       i = this.Puntuacion.length;
       console.log(i);
       console.log(this.Puntuacion);
       this.TablaPuntuacion = this.TablaPuntuacion.splice(0, i - 1);
       this.Puntuacion = this.Puntuacion.slice(0, i - 1);
       console.log(this.TablaPuntuacion);
       console.log(this.Puntuacion);

       this.dataSource = new MatTableDataSource (this.TablaPuntuacion);

    }

    goBackandguardar() {
      this.JuegoModificado = this.juegoSeleccionado;
      console.log(this.JuegoModificado);
      this.JuegoModificado.Puntos = this.Puntuacion;
      console.log( this.JuegoModificado.Puntos);
      this.JuegoModificado.NumeroParticipantesPuntuan = this.Puntuacion.length;
      console.log(this.JuegoModificado);
      this.peticionesAPI.ModificaJuegoDeCompeticionFormulaUno(this.JuegoModificado, this.JuegoModificado.id)
      .subscribe(JuegoModificado => {
        this.JuegoModificado = JuegoModificado;
        console.log('El JuegoModificado es: ');
        console.log(this.JuegoModificado);
      });
      this.location.back();
    }

   goBack() {
    this.location.back();
    }

}

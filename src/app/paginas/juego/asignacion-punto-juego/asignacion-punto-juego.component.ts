import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material';
import {MatTableDataSource} from '@angular/material/table';


// Clases
import { Alumno, Equipo, Juego, Punto, AsignacionPuntosJuego} from '../../../clases/index';


// Services
import { SesionService, PeticionesAPIService } from '../../../servicios/index';

@Component({
  selector: 'app-asignacion-punto-juego',
  templateUrl: './asignacion-punto-juego.component.html',
  styleUrls: ['./asignacion-punto-juego.component.scss']
})
export class AsignacionPuntoJuegoComponent implements OnInit {

  grupoId: number;
  profesorId: number;

  // tslint:disable-next-line:ban-types
  isDisabled: Boolean = true;

  tiposPuntos: Punto[];
  seleccionados: boolean[];

  displayedColumns: string[] = ['select', 'nombrePunto', 'descripcionPunto'];
  selection = new SelectionModel<Punto>(true, []);

  juego: Juego;

  dataSource;

  puntosSeleccionados: Punto[] = [];
  botonTablaDesactivado = false;

  constructor(
               public snackBar: MatSnackBar,
               private sesion: SesionService,
               private peticionesAPI: PeticionesAPIService
  ){}

  ngOnInit() {

    console.log('Inicio el componente');
    this.grupoId = this.sesion.DameGrupo().id;
    this.juego = this.sesion.DameJuego();
    this.profesorId = this.sesion.DameProfesor().id;
    console.log(this.juego);

    // traigo los tipos de puntos entre los que se puede seleccionar
    this.peticionesAPI.DameTiposDePuntos(this.profesorId)
    .subscribe(puntos => {
      this.tiposPuntos = puntos;
      this.seleccionados = Array(this.tiposPuntos.length).fill(false);
      console.log(this.seleccionados);
      this.dataSource = new MatTableDataSource (this.tiposPuntos);
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
  ActualizarBotonTabla() {
    if (this.selection.selected.length === 0) {
      this.botonTablaDesactivado = true;
    } else {
      this.botonTablaDesactivado = false;
    }
  }

  AgregarTiposPuntosAlJuego() {
    this.dataSource.data.forEach
    (row => {
              if (this.selection.isSelected(row))  {
                const punto = row;
                this.peticionesAPI.AsignaPuntoJuego(new AsignacionPuntosJuego(punto.id, this.juego.id))
                .subscribe();
              }
          }
    );

    this.selection.clear();

    this.snackBar.open('Puntos añadidos correctamente', 'Cerrar', {
      duration: 2000,
    });

  }

}

import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material';

// Clases
import { Alumno, Equipo, Juego, Punto, AsignacionPuntosJuego} from '../../../clases/index';

// Services
import { JuegoService, GrupoService, PuntosInsigniasService, ProfesorService, JuegoDePuntosService } from '../../../servicios/index';

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

  puntosSeleccionables: Punto[];
  seleccionados: boolean[];

  displayedColumns: string[] = ['select', 'nombrePunto', 'descripcionPunto'];
  selection = new SelectionModel<Punto>(true, []);

  juego: Juego;


  puntosSeleccionados: Punto[] = [];


  constructor( private juegoService: JuegoService,
               private profesorService: ProfesorService,
               private grupoService: GrupoService,
               private juegoDePuntosService: JuegoDePuntosService,
               public snackBar: MatSnackBar,
               private puntosInsigniasService: PuntosInsigniasService) { }

  ngOnInit() {

    console.log('Inicio el componente');
    this.grupoId = this.grupoService.RecibirGrupoIdDelServicio();
    this.juego = this.juegoService.RecibirJuegoDelServicio();
    console.log(this.juego);
    this.RecogerPuntos();
  }

  ////////////////////////////////////////////// PARA JUEGO DE PUNTOS ////////////////////////////////////////////////

  RecogerPuntos() {
    if (this.profesorService.RecibirProfesorIdDelServicio() !== undefined) {
      console.log('profesor id');
      this.profesorId = this.profesorService.RecibirProfesorIdDelServicio();
      this.PuntosParaAsignar();
    }
  }

  PuntosParaAsignar() {
    this.puntosInsigniasService.GET_Puntos(this.profesorId)
    .subscribe(puntos => {
      this.puntosSeleccionables = puntos;
      this.seleccionados = Array(this.puntosSeleccionables.length).fill(false);
      console.log(this.seleccionados);
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.puntosSeleccionables.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.puntosSeleccionables.forEach(row => {
          this.selection.select(row);
        });
  }

  toggleCheckbox(row) {
    this.selection.toggle(row);
    row.selected = !row.selected;
    console.log(row);
    console.log(this.selection.toggle(row));

  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Punto): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  // Pone a true o false la posición del vector seleccionados que le pasamos (i) en función de su estado
  Seleccionar(i: number) {

    if (!this.selection.isSelected(this.puntosSeleccionables[i]) === true) {
      this.seleccionados[i] = true;
    } else {
      this.seleccionados[i] = false;
    }
    console.log(this.seleccionados);
  }

  // Pone a true or false todo el vector seleccionado
  SeleccionarTodos() {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.puntosSeleccionables.length; i++) {

      if (!this.isAllSelected() === true) {
        this.seleccionados[i] = true;
      } else {
        this.seleccionados[i] = false;
      }

    }
    console.log(this.seleccionados);
  }

  AgregarPuntosAlJuego() {

    for (let i = 0; i < this.seleccionados.length; i++) {

      if (this.seleccionados [i]) {
        let punto: Punto;
        punto = this.puntosSeleccionables[i];
        console.log(punto.Nombre + ' seleccionado');

        this.juegoDePuntosService.POST_AsignacionPuntoJuego(new AsignacionPuntosJuego(punto.id, this.juego.id))
        .subscribe(asignacion => console.log(asignacion));
      }
    }
    this.selection.clear();

    this.snackBar.open('Puntos añadidos correctamente', 'Cerrar', {
      duration: 2000,
    });

  }

}

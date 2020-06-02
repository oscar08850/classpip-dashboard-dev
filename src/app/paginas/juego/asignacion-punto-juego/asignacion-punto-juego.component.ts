
import { Component, OnInit, Output,  EventEmitter } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import Swal from 'sweetalert2';


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
  @Output() emisorTiposDePuntos = new EventEmitter <any[]>();


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
  puntoAleatorio: Punto;

  constructor(
               private sesion: SesionService,
               private peticionesAPI: PeticionesAPIService
  ) {}

  ngOnInit() {

    console.log('Inicio el componente');
    this.grupoId = this.sesion.DameGrupo().id;
    this.juego = this.sesion.DameJuego();
    this.profesorId = this.sesion.DameProfesor().id;
    console.log(this.juego);

    // traigo los tipos de puntos entre los que se puede seleccionar
    this.peticionesAPI.DameTiposDePuntos(this.profesorId)
    .subscribe(puntos => {

      // ME guardo el tipo de punto aleatorio para añadirlo al final
      this.puntoAleatorio = puntos.filter (p => p.Nombre === 'Aleatorio')[0];

      // Elimino el tipo de punto aleatorio para que no salga entre los asignables
      // porque ese tipo de punto se asigna al juego de forma automática
      this.tiposPuntos = puntos.filter (p => p.Nombre !== 'Aleatorio');


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
  // Esta función decide si el boton de aceptar los tipos de puntos
  // debe estar activo (si hay al menosuna fila seleccionada)

  HaSeleccionado() {
    if (this.selection.selected.length === 0) {
     return false;
    } else {
      return true;
    }
  }

  AgregarTiposPuntosAlJuego() {
    console.log ('Vamos a agregar LOS PUNTOS');
    const tiposDePuntosSeleccionados = [];
    this.dataSource.data.forEach ( row => {
      if (this.selection.isSelected(row)) {
        tiposDePuntosSeleccionados.push (row);
      }
    });
    // Añadimos el punto de tipo aleatorio que siempre ha de estar
    tiposDePuntosSeleccionados.push (this.puntoAleatorio);
    console.log (tiposDePuntosSeleccionados);
    this.emisorTiposDePuntos.emit (tiposDePuntosSeleccionados);


    this.selection.clear();

  }

}

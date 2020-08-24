import { Component, OnInit } from '@angular/core';
import { SesionService, PeticionesAPIService, CalculosService } from '../../../servicios/index';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

import {
  Alumno, Equipo, Juego, Punto, Nivel, AlumnoJuegoDePuntos, JuegoDeLibros, EquipoJuegoDePuntos,
  TablaAlumnoJuegoDePuntos, TablaEquipoJuegoDePuntos, JuegoDeAvatar, AlumnoJuegoDeAvatar, AlumnoJuegoDeLibro
} from '../../../clases/index';
import { MatDialog } from '@angular/material';

import { SelectionModel } from '@angular/cdk/collections';

import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-juego-de-cuento-seleccionado-activo',
  templateUrl: './juego-de-cuento-seleccionado-activo.component.html',
  styleUrls: ['./juego-de-cuento-seleccionado-activo.component.scss']
})
export class JuegoDeCuentoSeleccionadoActivoComponent implements OnInit {


  displayedColumns: string[] = ['nombre', 'primerApellido', 'segundoApellido', 'Nivel1', 'Nivel2', 'Nivel3', 'Permisoparaver', 'permisoparavotar', ' '];

  datasourceAlumnos;
  juegoSeleccionado: any;
  grupoid: any;
  alumnosDelJuego: AlumnoJuegoDeLibro[];
  inscripcionesAlumnosJuegodelibro: AlumnoJuegoDeLibro[];
  selection1 = new SelectionModel<any>(true, []);
  selection2 = new SelectionModel<any>(true, []);
  selection3 = new SelectionModel<any>(true, []);
  selection4 = new SelectionModel<any>(true, []);
  selection5 = new SelectionModel<any>(true, []);
  haCambiado: boolean[];
  hayCambios: boolean = false;


  constructor(public dialog: MatDialog,
    private calculos: CalculosService,
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    private location: Location) { }

  ngOnInit() {

    this.juegoSeleccionado = this.sesion.DameJuego();
    this.grupoid = this.sesion.DameGrupo();
    this.obteneralumnosdelJuego();


  }


  obteneralumnosdelJuego() {


    this.peticionesAPI.DameAlumnosJuegoLibro(this.juegoSeleccionado.id)
      .subscribe(alumnosJuego => {

        console.log(alumnosJuego);
        this.alumnosDelJuego = alumnosJuego;
        

      });
  }





  PrepararTabla() {
    this.datasourceAlumnos = new MatTableDataSource(this.alumnosDelJuego);

    this.datasourceAlumnos.data.forEach(row => {

      const inscripcion = this.alumnosDelJuego.filter(ins => ins.alumnoId === row.id)[0];
      // Ahora activo o desactivo el selector de cada privilegio según tenga el alumno ese privilegio o no
      if (inscripcion.nivel1) {
        this.selection1.select(row);
      } else {
        this.selection1.deselect(row);
      }
      if (inscripcion.nivel2) {
        this.selection2.select(row);
      } else {
        this.selection2.deselect(row);
      }
      if (inscripcion.nivel3) {
        this.selection3.select(row);
      } else {
        this.selection3.deselect(row);
      }
      if (inscripcion.permisoparaver) {
        this.selection4.select(row);
      } else {
        this.selection4.deselect(row);
      }
      if (inscripcion.permisoparavotar) {
        this.selection5.select(row);
      } else {
        this.selection5.deselect(row);
      }
     
    });


  }

}






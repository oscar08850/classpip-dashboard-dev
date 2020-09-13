import { Component, OnInit } from '@angular/core';
import { SesionService, PeticionesAPIService, CalculosService } from '../../../servicios/index';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import {
  Alumno, Equipo, Juego, Punto, Nivel, AlumnoJuegoDePuntos, JuegoDeLibros, EquipoJuegoDePuntos,
  TablaAlumnoJuegoDePuntos, TablaEquipoJuegoDePuntos, JuegoDeAvatar, AlumnoJuegoDeAvatar, AlumnoJuegoDeLibro
} from '../../../clases/index';
import { MatDialog } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-juego-de-cuento-seleccionado-activo',
  templateUrl: './juego-de-cuento-seleccionado-activo.component.html',
  styleUrls: ['./juego-de-cuento-seleccionado-activo.component.scss']
})
export class JuegoDeCuentoSeleccionadoActivoComponent implements OnInit {


  displayedColumns: string[] = ['alumnoID', 'nivel1', 'nivel2', 'nivel3', 'permisoparaver', 'permisoparavotar'];

  datasourceAlumno;
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
    private location: Location,
    private router: Router) { }

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
        this.haCambiado = Array(this.alumnosDelJuego.length).fill(false);
        this.PrepararTabla();

      });

  }

  PrepararTabla() {
    this.datasourceAlumno = new MatTableDataSource(this.alumnosDelJuego);

    this.datasourceAlumno.data.forEach(row => {

      const inscripcion = this.alumnosDelJuego.filter(ins => ins.alumnoID === row.alumnoID)[0];
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


  IsAllSelected(n) {
    let numSelected;
    if (n === 1) {
      numSelected = this.selection1.selected.length;
    }
    if (n === 2) {
      numSelected = this.selection2.selected.length;
    }
    if (n === 3) {
      numSelected = this.selection3.selected.length;
    }
    if (n === 4) {
      numSelected = this.selection4.selected.length;
    }
    if (n === 5) {
      numSelected = this.selection5.selected.length;
    }

    const numRows = this.datasourceAlumno.data.length;
    return numSelected === numRows;
  }



  MasterToggle(n) {

    if (n === 1) {
      if (this.IsAllSelected(1)) {


        this.selection1.clear();
        this.alumnosDelJuego.forEach(inscripcion => inscripcion.nivel1 = false);
      } else {
        // Tengo que activar todos los elementos del selector
        this.datasourceAlumno.data.forEach(row => this.selection1.select(row));
        // y conceder el privilegio correspondiente a todos los alumnos
        this.alumnosDelJuego.forEach(inscripcion => inscripcion.nivel1 = true);
      }
    }
    if (n === 2) {
      if (this.IsAllSelected(2)) {
        this.selection2.clear(); // Desactivamos todos
        this.alumnosDelJuego.forEach(inscripcion => inscripcion.nivel2 = false);
      } else {
        this.datasourceAlumno.data.forEach(row => this.selection2.select(row));
        this.alumnosDelJuego.forEach(inscripcion => inscripcion.nivel2 = true);
      }
    }
    if (n === 3) {
      if (this.IsAllSelected(3)) {
        this.selection3.clear(); // Desactivamos todos
        this.alumnosDelJuego.forEach(inscripcion => inscripcion.nivel3 = false);
      } else {
        this.datasourceAlumno.data.forEach(row => this.selection3.select(row));
        this.alumnosDelJuego.forEach(inscripcion => inscripcion.nivel3 = true);
      }
    }
    if (n === 4) {
      if (this.IsAllSelected(4)) {
        this.selection4.clear(); // Desactivamos todos
        this.alumnosDelJuego.forEach(inscripcion => inscripcion.permisoparaver = false);
      } else {
        this.datasourceAlumno.data.forEach(row => this.selection4.select(row));
        this.alumnosDelJuego.forEach(inscripcion => inscripcion.permisoparaver = true);
      }
    }
    if (n === 5) {
      if (this.IsAllSelected(5)) {
        this.selection5.clear(); // Desactivamos todos
        this.alumnosDelJuego.forEach(inscripcion => inscripcion.permisoparavotar = false);
      } else {
        this.datasourceAlumno.data.forEach(row => this.selection5.select(row));
        this.alumnosDelJuego.forEach(inscripcion => inscripcion.permisoparavotar = true);
      }
    }
  
  
  }


  HaCambiado(n ,i) {
    if(n==1)
    {
    this.alumnosDelJuego[i].nivel1 = !this.alumnosDelJuego[i].nivel1;

    }

    if(n==2)
    {
    this.alumnosDelJuego[i].nivel2 = !this.alumnosDelJuego[i].nivel2;
 
    }

    if(n==3)
    {
    this.alumnosDelJuego[i].nivel3 = !this.alumnosDelJuego[i].nivel3;
   
    }

    if(n==4)
    {
    this.alumnosDelJuego[i].permisoparaver = !this.alumnosDelJuego[i].permisoparaver;

    }

    if(n==5)
    {
    this.alumnosDelJuego[i].permisoparavotar = !this.alumnosDelJuego[i].permisoparavotar;
    
    }
 
  }



  RegistrarCambios() {

    for (let i = 0; i < this.alumnosDelJuego.length; i++) {
      
  
        this.peticionesAPI.ModificarPermidosJuegoLibro(this.alumnosDelJuego[i], this.juegoSeleccionado.id).subscribe();
      
    }
    Swal.fire('Cambios registrados correctamente', ' ', 'success');
  }


  irAlListado(){

    this.router.navigate(['/grupo/' + this.grupoid + '/juego/juegoSeleccionadoActivo/listadoCuentos']);

  }
  

  irAVotaciones(){

    this.router.navigate(['/grupo/' + this.grupoid + '/juego/juegoSeleccionadoActivo/votacionescuento']);

  }

}






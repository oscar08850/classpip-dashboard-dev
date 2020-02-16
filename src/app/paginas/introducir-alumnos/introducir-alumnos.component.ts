import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog, } from '@angular/material';
import { Alumno, Profesor } from '../../clases/index';
import {MatTableDataSource} from '@angular/material/table';
import Swal from 'sweetalert2';

// Servicios
import { SesionService, PeticionesAPIService } from '../../servicios/index';

@Component({
  selector: 'app-introducir-alumnos',
  templateUrl: './introducir-alumnos.component.html',
  styleUrls: ['./introducir-alumnos.component.scss']
})
export class IntroducirAlumnosComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'primerApellido', 'segundoApellido', ' '];
  nombreAlumno: string;
  apellido1Alumno: string;
  apellido2Alumno: string;
  textoAlumnosNuevos: string;
  isDisabledAlumno = true;
  nuevosAlumnos: Alumno[] = [];
  dataSource;
  profesor: Profesor;

  constructor(
                private peticionesAPI: PeticionesAPIService,
                private sesion: SesionService,
                public dialog: MatDialog) { }

  ngOnInit() {
    this.profesor = this.sesion.DameProfesor();
  }

   // Los campos de nombre y descripción son obligatorios. Si son undefined o '' no podremos clicar en crear
   Disabled() {

    if (this.nombreAlumno === undefined || this.apellido1Alumno === undefined || this.apellido2Alumno === undefined) {
      this.isDisabledAlumno = true;
    } else {
      this.isDisabledAlumno = false;
    }
  }

  LimpiarCampos() {
    this.nombreAlumno = undefined;
    this.apellido1Alumno = undefined;
    this.apellido2Alumno = undefined;
    this.isDisabledAlumno = true;
  }
  LimpiarCamposTexto() {
    this.textoAlumnosNuevos = undefined;
    this.isDisabledAlumno = true;
  }

  PonAlumno() {
    console.log ('pongo alumno :' + this.nuevosAlumnos);
    this.nuevosAlumnos.push (new Alumno (this.nombreAlumno, this.apellido1Alumno, this.apellido2Alumno));
    this.dataSource = new MatTableDataSource (this.nuevosAlumnos);
    this.LimpiarCampos();
  }

  BorrarAlumno(alumno: Alumno) {
    // tslint:disable-next-line:max-line-length
    this.nuevosAlumnos = this.nuevosAlumnos.filter (a => a.Nombre !== alumno.Nombre && a.PrimerApellido !== alumno.PrimerApellido && a.SegundoApellido !== alumno.SegundoApellido);
    this.dataSource = new MatTableDataSource (this.nuevosAlumnos);
  }
  RegistraAlumnos() {
    console.log ('Registra');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.nuevosAlumnos.length; i++) {
      const alumno = this.nuevosAlumnos[i];
      alumno.profesorId = this.profesor.id;
      alumno.ImagenPerfil = 'UsuarioAlumno.jpg';
      this.peticionesAPI.CreaAlumno (alumno).subscribe();
    }
    Swal.fire('Añadidos', this.nuevosAlumnos.length + ' nuevos alumnos añadidos correctamente', 'success');
    this.nuevosAlumnos = [];
  }

  DisabledTexto() {

    if (this.textoAlumnosNuevos === undefined) {
      this.isDisabledAlumno = true;
    } else {
      this.isDisabledAlumno = false;
    }
  }

  RegistroMasivo() {


    const lineas: string[] = this.textoAlumnosNuevos.split('\n');
    console.log ('Numero de lineas ' + lineas.length);

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < lineas.length; i++) {
        const trozos: string[] = lineas[i].split(';');
        if (trozos.length === 3) {
          this.nuevosAlumnos.push (new Alumno (trozos[0], trozos[1], trozos[2]));
        }
    }
    this.dataSource = new MatTableDataSource (this.nuevosAlumnos);
    this.LimpiarCamposTexto();
  }

}

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog, } from '@angular/material';
import { Alumno, Profesor } from '../../clases/index';
import {MatTableDataSource} from '@angular/material/table';
import Swal from 'sweetalert2';

// Servicios
import { SesionService, PeticionesAPIService, ComServerService } from '../../servicios/index';

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
  email: string;
  nombreUsuario: string;
  textoAlumnosNuevos: string;
  textoAlumnosErroneos: string;
  isDisabledAlumno = true;
  nuevosAlumnos: Alumno[] = [];
  dataSource;
  profesor: Profesor;
  alumnosEnClasspip: Alumno[];
  loading = false;

  constructor(
                private peticionesAPI: PeticionesAPIService,
                private sesion: SesionService,
                private comServer: ComServerService,
                public dialog: MatDialog) { }

  ngOnInit() {
    this.profesor = this.sesion.DameProfesor();
    // Traigo todos los alumnos que hay en classpip para asegurarme que no se repite el nombre de usuario
    // de ninguno de los nuevos.
    this.peticionesAPI.DameTodosLosAlumnos()
    .subscribe (alumnos => this.alumnosEnClasspip = alumnos);
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
    this.nombreUsuario = undefined;
    this.email = undefined;
    this.isDisabledAlumno = true;
  }
  LimpiarCamposTexto() {
    this.textoAlumnosNuevos = undefined;
    this.isDisabledAlumno = true;
  }

  PonAlumno() {
    console.log ('pongo alumno :' + this.nuevosAlumnos);
    if (!this.emailValido(this.email)) {
      // tslint:disable-next-line:max-line-length
      Swal.fire('Error', 'El email no es correcto', 'error');
    } else if (this.UsernameUsado (this.nombreUsuario)) {
      Swal.fire('Error', 'Ya existe otro alumno en Classpip (o vas a registrar uno) con ese nombre de usuario', 'error');
    } else {
      // genero un pasword aleatorio de 8 caracteres
      const password = Math.random().toString(36).substr(2, 8);
      // tslint:disable-next-line:max-line-length
      this.nuevosAlumnos.push (new Alumno (this.nombreAlumno, this.apellido1Alumno, this.apellido2Alumno, this.nombreUsuario, password, this.email));
      this.dataSource = new MatTableDataSource (this.nuevosAlumnos);
      this.LimpiarCampos();
    }
  }

  BorrarAlumno(alumno: Alumno) {
    // tslint:disable-next-line:max-line-length
    this.nuevosAlumnos = this.nuevosAlumnos.filter (a => a.Nombre !== alumno.Nombre && a.PrimerApellido !== alumno.PrimerApellido && a.SegundoApellido !== alumno.SegundoApellido);
    this.dataSource = new MatTableDataSource (this.nuevosAlumnos);
  }
  Delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  async RegistraAlumnos() {
    console.log ('Registra');
 
    Swal.fire({
      title: 'Vamos a registrar a ' + this.nuevosAlumnos.length + ' nuevos alumnos.',
      text: 'La operación tardará unos segundos. No desesperes.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then(async (result) => {
      if (result.value) {
        this.loading = true;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.nuevosAlumnos.length; i++) {
        const alumno = this.nuevosAlumnos[i];
        console.log ('voy a registrar al alumno');
        console.log (alumno);
        alumno.profesorId = this.profesor.id;
        this.peticionesAPI.CreaAlumno (alumno)
        // tslint:disable-next-line:no-shadowed-variable
        .subscribe( alumno => {
          // enviarle un email al alumno comunicandole su nombre de usuario y su contraseña
          // y diciendole que la cambie lo antes posible
          this.comServer.EnviarInfoRegistroAlumno (this.profesor, alumno);
          this.alumnosEnClasspip.push (alumno);
        });
        // Espero un tiempo para no provocar una avalancha de e,alis que parece
        // saturar al servidor
        await this.Delay(500);
        }
        this.loading = false;
        // tslint:disable-next-line:max-line-length
        Swal.fire('Añadidos', this.nuevosAlumnos.length + ' nuevos alumnos añadidos correctamente. Se les ha enviado un email con sus datos e instandoles a que modifiquen lo antes posible su contraseña.', 'success');
        this.nuevosAlumnos = [];
      }
    });
  }

  DisabledTexto() {

    if (this.textoAlumnosNuevos === undefined) {
      this.isDisabledAlumno = true;
    } else {
      this.isDisabledAlumno = false;
    }
  }

  emailValido(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  UsernameUsado(username: string): boolean {
    console.log ('usuarios en classpip');
    console.log (this.alumnosEnClasspip);
    let usado = this.alumnosEnClasspip.some (alumno => alumno.Username === username);
    usado = usado || this.nuevosAlumnos.some (alumno => alumno.Username === username);

    return usado;


  }

  RegistroMasivo() {


    const lineas: string[] = this.textoAlumnosNuevos.split('\n');
    console.log ('Numero de lineas ' + lineas.length);
    console.log ('lineas ');
    console.log (lineas);
    this.textoAlumnosErroneos = null;

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < lineas.length; i++) {
      if (lineas[i] !== '') {
        const trozos: string[] = lineas[i].split(';');
        if ((trozos.length !== 5) || (!this.emailValido(trozos[4].trim())) || this.UsernameUsado(trozos[3].trim())) {
    

          if (this.textoAlumnosErroneos === null) {
             this.textoAlumnosErroneos = lineas[i];
          } else {
            this.textoAlumnosErroneos = this.textoAlumnosErroneos + '\n' + lineas[i];
          }
        } else {
          // genero un pasword aleatorio de 8 caracteres
          const password = Math.random().toString(36).substr(2, 8);
          // tslint:disable-next-line:max-line-length
          this.nuevosAlumnos.push (new Alumno (trozos[0].trim(), trozos[1].trim(), trozos[2].trim(), trozos[3].trim(), password, trozos[4].trim()));
        }
      }
    }
    this.dataSource = new MatTableDataSource (this.nuevosAlumnos);
    this.LimpiarCamposTexto();
    if (this.textoAlumnosErroneos !== null) {
      this.textoAlumnosNuevos = this.textoAlumnosErroneos;
      // tslint:disable-next-line:max-line-length
      Swal.fire('Error', 'Hay errores en las lineas que han quedado en el cuadro (quizá el email no está bien, o ya existe el nombre de usuario en classpip o el número de datos es incorrecto). Esos alumnos no se han incluido', 'error');
    }
  }

}

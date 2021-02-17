import { Component } from '@angular/core';
import { Profesor, Rubrica, Criterio } from './clases';
import { SesionService} from './servicios/sesion.service';
import { PeticionesAPIService, CalculosService, ComServerService} from './servicios/index';
import { MatDialog, MatTabGroup } from '@angular/material';

import { Alumno } from './clases';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';


// USARE ESTO PARA NAVEGAR A LA PAGINA DE INICIO
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent  {
  profesor: Profesor = undefined;
  nombre;
  pass;

  misAlumnos: Alumno[];

  primerApellido: string;
  segundoApellido: string;
  username: string;
  email: string;
  contrasena: string;
  contrasenaRepetida: string;

  mostrarLogin = true;


  constructor(
              // private route: Router,
              // private location: Location,
              // private peticionesAPI: PeticionesAPIService,
              // private sesion: SesionService,
              // private comServer: ComServerService,
              // private calculos: CalculosService
              ) {
                // esto lo hago para que cuando vuelva a la página de login
                // que está en este componente, se quite la barra del navbar
                // this.route.events.subscribe(val => {
                //   //if (location.path() === '/login') {
                //   if (location.isCurrentPathEqualTo ('/login')) {
                //       console.log ('ya estoy aqui');
                //       console.log (location.path());
                //       this.profesor = undefined;
                //       // this.nombre = undefined;
                //       // this.pass = undefined;
                //   }
                // });

              }




  // Autentificar() {
  //   console.log ('a autentificar');
  //   console.log (this.nombre + ' ' + this.pass);

  //   this.peticionesAPI.DameProfesor(this.nombre, this.pass).subscribe(
  //     (res) => {
  //       if (res[0] !== undefined) {
  //         console.log ('autoenticicado correctamente');
  //         this.profesor = res[0]; // Si es diferente de null, el profesor existe y lo meto dentro de profesor
  //         // Envio el profesor a la sesión
  //         this.sesion.TomaProfesor(this.profesor);
  //         this.comServer.Conectar();

  //         // En principio, no seria necesario enviar el id del profesor porque ya
  //         // tengo el profesor en la sesión y puedo recuperarlo cuando quiera.
  //         // Pero si quitamos el id hay que cambiar las rutas en app-routing
  //         // De momento lo dejamos asi.
  //         console.log ('vamos inicio');
  //         this.route.navigate (['/inicio/' + this.profesor.id]);
  //       } else {
  //         // Aqui habría que mostrar alguna alerta al usuario
  //         console.log('profe no existe');
  //         Swal.fire('Cuidado', 'Usuario o contraseña incorrectos', 'warning');
  //       }
  //     },
  //     (err) => {
  //       console.log ('ERROR');
  //       Swal.fire('Error', 'Fallo en la conexion con la base de datos', 'error');
  //     }
  //   );
  // }
  // ValidaEmail(email) {
  //       const re = /\S+@\S+\.\S+/;
  //       return re.test(email);
  // }

  // Registrar() {
  //   if (this.contrasena !== this.contrasenaRepetida) {
  //     Swal.fire('Error', 'No coincide la contraseña con la contraseña repetida', 'error');
  //   } else if (!this.ValidaEmail (this.email)) {
  //     Swal.fire('Error', 'El email no es correcto', 'error');
  //   } else {
  //     const profesor = new Profesor (
  //       this.nombre,
  //       this.primerApellido,
  //       this.segundoApellido,
  //       this.username,
  //       this.email,
  //       this.contrasena
  //     );
  //     this.peticionesAPI.RegistraProfesor (profesor)
  //     .subscribe (  (res) => Swal.fire('OK', 'Registro completado con éxito', 'success'),
  //                   (err) => {
  //                     Swal.fire('Error', 'Fallo en la conexion con la base de datos', 'error');
  //     });
  //   }
  //   this.nombre = undefined;
  //   this.contrasena = undefined;
  //   this.mostrarLogin = true;

  // }
  // EnviarContrasena() {
  //   if (this.nombre === undefined) {
  //     Swal.fire('Cuidado', 'Introduce tu nombre de usuario en el formulario de login', 'warning');
  //   } else {
  //     console.log ('voy a pedir contraseña');
  //     this.peticionesAPI.DameContrasena (this.nombre)
  //     .subscribe ((res) => {
  //         if (res[0] !== undefined) {
  //           const profesor = res[0]; // Si es diferente de null, el profesor existe
  //           console.log ('existe');
  //           console.log (profesor);
  //           // le enviamos la contraseña
  //           this.comServer.RecordarContrasena (profesor);
  //           Swal.fire('OK', 'En breve recibirás un email con tu contraseña', 'success');
  //         } else {
  //           // Este profesor no está registrado en la base de datos
  //           Swal.fire('Error', 'No hay ningun profesor con este nombre de usuario', 'error');
  //         }
  //     });
  //   }

  // }

}

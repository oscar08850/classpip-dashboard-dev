import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { Pregunta, Profesor } from 'src/app/clases';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { PeticionesAPIService, SesionService, CalculosService, ComServerService} from './../../servicios';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  profesor: Profesor;
  nombre: string;
  pass: string;

  primerApellido: string;
  segundoApellido: string;
  username: string;
  email: string;
  contrasena: string;
  contrasenaRepetida: string;
  mostrarLogin = true;


  constructor(
    private route: Router,
    private location: Location,
    private peticionesAPI: PeticionesAPIService,
    private sesion: SesionService,
    private comServer: ComServerService,
    private calculos: CalculosService) {
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


  ngOnInit() {
    console.log ('entro en login');
    this.profesor = undefined;
    // envio un profesor undefined para que se notifique al componente navbar y desaparezca la barra
    // de navegación
    this.sesion.EnviaProfesor(this.profesor);

    const regex = /[^A-Za-z0-9]+/;
    console.log ('123adb: ' + regex.test ('123abc'));
    console.log ('123*adb: ' + regex.test ('123*abc'));
  }



  Autentificar() {
    console.log ('a autentificar');
    console.log (this.nombre + ' ' + this.pass);

    this.peticionesAPI.DameProfesor(this.nombre, this.pass)
    .subscribe(
      (res) => {
        if (res[0] !== undefined) {
          console.log ('autoenticicado correctamente');
          this.profesor = res[0]; // Si es diferente de null, el profesor existe y lo meto dentro de profesor
          // Notifico el nuevo profesor al componente navbar
          this.sesion.EnviaProfesor(this.profesor);
          this.comServer.Conectar(this.profesor.id);

          // En principio, no seria necesario enviar el id del profesor porque ya
          // tengo el profesor en la sesión y puedo recuperarlo cuando quiera.
          // Pero si quitamos el id hay que cambiar las rutas en app-routing
          // De momento lo dejamos asi.
          console.log ('vamos inicio');
          this.route.navigate (['/inicio/' + this.profesor.id]);
        } else {
          // Aqui habría que mostrar alguna alerta al usuario
          console.log('profe no existe');
          Swal.fire('Cuidado', 'Usuario o contraseña incorrectos', 'warning');
        }
      },
      (err) => {
        console.log('ERROR');
        console.error(err);
        Swal.fire('Error', 'Fallo en la conexion con la base de datos', 'error');
      }
    );
  }
  ValidaEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
  ValidaPass(pass) {
    // La contraseña solo puede tener numeros y digitos
    const re = /[^A-Za-z0-9]+/;
    return !re.test(pass);
  }

  Registrar() {
    this.peticionesAPI.BuscaNombreUsuario (this.username)
    .subscribe ( res => {
      if (res[0] !== undefined) {
        Swal.fire('Error', 'Ya existe alguien con el mismo nombre de usuario en Classpip', 'error');

      } else {
        if ( !this.ValidaPass (this.contrasena)) {
          Swal.fire('Error', 'La contraseña solo puede tener letras y dígitos', 'error');
        } else if (this.contrasena !== this.contrasenaRepetida) {
          Swal.fire('Error', 'No coincide la contraseña con la contraseña repetida', 'error');
        } else if (!this.ValidaEmail (this.email)) {
          Swal.fire('Error', 'El email no es correcto', 'error');
        } else {
          // creamos un identificador aleatorio de 5 digitos
          const identificador = Math.random().toString().substr(2, 5);
          const profesor = new Profesor (
          this.nombre,
          this.primerApellido,
          this.segundoApellido,
          this.username,
          this.email,
          this.contrasena,
          null,
          identificador
          );
          this.peticionesAPI.RegistraProfesor (profesor)
          .subscribe (
              // tslint:disable-next-line:no-shadowed-variable
              (res) => Swal.fire('OK', 'Registro completado con éxito', 'success'),
              (err) => Swal.fire('Error', 'Fallo en la conexion con la base de datos', 'error')
          );
          this.nombre = undefined;
          this.contrasena = undefined;
          this.mostrarLogin = true;
        }
      
      }

    });
  }
  EnviarContrasena() {
    if (this.nombre === undefined) {
      Swal.fire('Cuidado', 'Introduce tu nombre de usuario en el formulario de login', 'warning');
    } else {
      console.log ('voy a pedir contraseña');
      this.peticionesAPI.DameContrasena (this.nombre)
      .subscribe ((res) => {
          if (res[0] !== undefined) {
            const profesor = res[0]; // Si es diferente de null, el profesor existe
            console.log ('existe');
            console.log (profesor);
            // le enviamos la contraseña
            this.comServer.RecordarContrasena (profesor);
            Swal.fire('OK', 'En breve recibirás un email con tu contraseña', 'success');
          } else {
            // Este profesor no está registrado en la base de datos
            Swal.fire('Error', 'No hay ningun profesor con este nombre de usuario', 'error');
          }
      });
    }

  }

}

import { Component } from '@angular/core';
import { Profesor, Rubrica, Criterio } from './clases';
import { SesionService} from './servicios/sesion.service';
import { PeticionesAPIService, CalculosService, ComServerService} from './servicios/index';
import { MatDialog, MatTabGroup } from '@angular/material';

import { Alumno } from './clases';
import { Observable } from 'rxjs';


// USARE ESTO PARA NAVEGAR A LA PAGINA DE INICIO
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent  {
  profesor: Profesor;
  nombre = "Miguel";
  apellido = "Valero";

  misAlumnos: Alumno[];

  primerApellido: string;
  segundoApellido: string;
  username: string;
  email: string;
  contrasena: string;
  contrasenaRepetida: string;

  mostrarLogin = true;


  constructor(
              private route: Router,
              private peticionesAPI: PeticionesAPIService,
              private sesion: SesionService,
              private comServer: ComServerService,
              private calculos: CalculosService) { }




  Autentificar() {

    this.peticionesAPI.DameProfesor(this.nombre, this.apellido).subscribe(
      (res) => {
        if (res[0] !== undefined) {
          this.profesor = res[0]; // Si es diferente de null, el profesor existe y lo meto dentro de profesor
          // Envio el profesor a la sesión
          this.sesion.TomaProfesor(this.profesor);
          this.comServer.Conectar();

          // En principio, no seria necesario enviar el id del profesor porque ya
          // tengo el profesor en la sesión y puedo recuperarlo cuando quiera.
          // Pero si quitamos el id hay que cambiar las rutas en app-routing
          // De momento lo dejamos asi.
          this.route.navigateByUrl ('/inicio/' + this.profesor.id);
        } else {
          // Aqui habría que mostrar alguna alerta al usuario
          console.log('profe no existe');
          Swal.fire('Cuidado', 'Usuario o contraseña incorrectos', 'warning');
        }
      },
      (err) => {
        console.log ('ERROR');
        Swal.fire('Error', 'Fallo en la conexion con la base de datos', 'error');
      }
    );
  }
  ValidaEmail(email) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
  }

  Registrar() {
    console.log ('datos para el registro');
    console.log (this.nombre);
    console.log (this.primerApellido);
    console.log (this.segundoApellido);
    console.log (this.username);
    console.log (this.email);
    console.log (this.contrasena);
    console.log (this.contrasenaRepetida);
    if (this.contrasena !== this.contrasenaRepetida) {
      Swal.fire('Error', 'No coincide la contraseña con la contraseña repetida', 'error');
    } else if (!this.ValidaEmail (this.email)) {
      Swal.fire('Error', 'El email no es correcto', 'error');
    } else {
      this.peticionesAPI.RegistraProfesor (new Profesor (this.nombre, this.primerApellido))
      .subscribe (  (res) => Swal.fire('OK', 'Registro completado con éxito', 'success'),
                    (err) => {
                      Swal.fire('Error', 'Fallo en la conexion con la base de datos', 'error');
      });
    }

  }
  EnviarContrasena() {
    if (this.nombre === undefined) {
      Swal.fire('Cuidado', 'Introduce tu nombre en el formulario de login', 'warning');
    } else {
      console.log ('voy a pedir contraseña');
      this.peticionesAPI.DameContrasena (this.nombre)
      .subscribe ((res) => {
          if (res[0] !== undefined) {
            const profesor = res[0]; // Si es diferente de null, el profesor existe
            console.log ('existe');
            console.log (profesor);
            // le enviamos la contraseña
            this.comServer.RecordarContrasena ("miguel.valero@upc.edu", profesor.Nombre, profesor.Apellido);
            Swal.fire('OK', 'En breve recibirás un email con tu contraseña', 'success');
          } else {
            // Este profesor no está registrado en la base de datos
            Swal.fire('Error', 'No hay ningun profesor con este nombre de usuario', 'error');
          }
      });
    }

  }

}



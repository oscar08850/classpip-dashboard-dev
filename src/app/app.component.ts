import { Component } from '@angular/core';
import { Profesor } from './clases';
import { SesionService} from './servicios/sesion.service';
import { PeticionesAPIService, CalculosService, ComServerService} from './servicios/index';
import { MatDialog, MatTabGroup } from '@angular/material';


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
  nombre: string;
  apellido: string;

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

}



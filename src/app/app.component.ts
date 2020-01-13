import { Component } from '@angular/core';
import { Profesor } from './clases';
import { SesionService} from './servicios/sesion.service';
import { PeticionesAPIService, CalculosService} from './servicios/index';
import { MatDialog, MatSnackBar, MatTabGroup } from '@angular/material';


// USARE ESTO PARA NAVEGAR A LA PAGINA DE INICIO
import { Router } from '@angular/router';

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
              private calculos: CalculosService,
              public snackBar: MatSnackBar) { }

  Autentificar() {

    this.peticionesAPI.DameProfesor(this.nombre, this.apellido).subscribe(
      (res) => {
        if (res[0] !== undefined) {
          this.profesor = res[0]; // Si es diferente de null, el profesor existe y lo meto dentro de profesor

          // Envio el profesor a la sesión
          this.sesion.TomaProfesor(this.profesor);

          // En principio, no seria necesario enviar el id del profesor porque ya
          // tengo el profesor en la sesión y puedo recuperarlo cuando quiera.
          // Pero si quitamos el id hay que cambiar las rutas en app-routing
          // De momento lo dejamos asi.
          this.route.navigateByUrl ('/inicio/' + this.profesor.id);
        } else {
          // Aqui habría que mostrar alguna alerta al usuario
          console.log('profe no existe');
          this.snackBar.open('Usuario y/o contraseña incorrectos', 'Cerrar', {
            duration: 5000,
          });
        }
      },
      (err) => {
        console.log ('ERROR');
        this.snackBar.open('Fallo en la conexión a la base de datos', 'Cerrar', {
          duration: 5000,
        });
      }
    );
  }

}

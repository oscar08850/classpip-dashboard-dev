import { Component } from '@angular/core';
import { Profesor } from './clases';
import { ProfesorService } from './servicios/profesor.service';
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

  constructor(private profesorService: ProfesorService,
              private route: Router) { }




  Autentificar() {
    console.log('voy a entrar en autentificacion');

    this.profesorService.AutentificarProfesor(this.nombre, this.apellido).subscribe(
      (res) => {
        if (res[0] !== undefined) { // Utilizamos res porque la operacion es sincrona. Me suscribo y veo si tiene algo.
          console.log('profe existe');
          this.profesor = res[0]; // Si es diferente de null, el profesor existe y lo meto dentro de profesor

          // AHORA SE LO ENVIO AL SERVICIO
          this.profesorService.EnviarProfesorAlServicio(this.profesor);

          this.route.navigateByUrl ('/inicio/' + this.profesor.id); // DEBEMOS USAR ESTE ROUTE PARA QUE FUNCIONE
        } else {
          console.log('profe no existe');
        }
      }
    );
  }

}

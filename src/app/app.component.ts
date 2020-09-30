import { Component } from '@angular/core';
import { Profesor } from './clases';
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
  nombre: string;
  apellido: string;

  misAlumnos: Alumno[];

  constructor(
              private route: Router,
              private peticionesAPI: PeticionesAPIService,
              private sesion: SesionService,
              private comServer: ComServerService,
              private calculos: CalculosService) { }





    ngOnInit()
    {

      // this.nombre ="Miguel";
      // this.apellido = "Valero";
      this.Autentificar();

      
    }
    

    DameDatos(): any {
      const datosObservables = new Observable ( obs => {
        const datos: any = {
          alumnos: undefined,
          grupos: undefined,
          colecciones: undefined
        };

        let cont = 0;
        let alumnosProcesados: Alumno[];
        this.peticionesAPI.DameTodosMisAlumnos (this.profesor.id)
        .subscribe (alumnos => {
          alumnosProcesados = alumnos;
          console.log ('Mis Alumnos (AHORA SI):');
          console.log (alumnosProcesados);
          alumnosProcesados = alumnosProcesados.filter (alumno => alumno.Nombre[0] !== 'A');
          console.log ('Alumnos cuyo nombre no empieza por A');
          console.log (alumnosProcesados);
          datos.alumnos = alumnosProcesados;
          cont = cont + 1;
          if (cont === 3) {
            obs.next (datos);
          }
        });
        this.peticionesAPI.DameGruposProfesor (this.profesor.id)
          .subscribe (grupos => {
              datos.grupos = grupos;
              cont = cont + 1;
              if (cont === 3) {
                obs.next (datos);
              }
        });
        this.peticionesAPI.DameColeccionesDelProfesor (this.profesor.id)
        .subscribe (colecciones => {
                datos.colecciones = colecciones;
                cont = cont + 1;
                if (cont === 3) {
                  obs.next (datos);
                }
        });

      });
      return datosObservables;
    }




  PruebaObservables() {
      this.DameDatos()
      .subscribe ( datos => {

        console.log ('Ua tengo los datos');
        console.log (datos);
      } );
  }

  Autentificar() {

    this.peticionesAPI.DameProfesor(this.nombre, this.apellido).subscribe(
      (res) => {
        if (res[0] !== undefined) {
          this.profesor = res[0]; // Si es diferente de null, el profesor existe y lo meto dentro de profesor
          this.PruebaObservables();
          // Envio el profesor a la sesión
          this.sesion.TomaProfesor(this.profesor);
          this.comServer.Conectar();
          console.log("ESTOY CONECTANDOME DESDE EL DASHBOARD")

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



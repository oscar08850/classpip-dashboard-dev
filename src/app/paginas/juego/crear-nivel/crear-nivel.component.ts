import { Component, OnInit } from '@angular/core';

import { MatSnackBar } from '@angular/material';

// Servicios
import { JuegoService, JuegoDePuntosService } from '../../../servicios/index';

// Clases
import { Nivel, Insignia, Juego } from '../../../clases/index';

@Component({
  selector: 'app-crear-nivel',
  templateUrl: './crear-nivel.component.html',
  styleUrls: ['./crear-nivel.component.scss']
})
export class CrearNivelComponent implements OnInit {


  displayedColumns: string[] = ['nombre', 'puntosAlcanzar', 'privilegiosDelNivel', ' '];

  juego: Juego;

  // tslint:disable-next-line:ban-types
  isDisabledNivel: Boolean = true;

  nivelAgregados: Nivel [] = [];

  nombreNivel: string;
  puntosAlcanzar: number;
  privilegiosDelNivel: string;
  nombreLogo: string;
  juegoDePuntosId: number;



  file: File;
  logo: string;

  // tslint:disable-next-line:ban-types
  logoCargado: Boolean = false;



  constructor( private juegoService: JuegoService,
               private juegoDePuntosService: JuegoDePuntosService,
               public snackBar: MatSnackBar ) { }

  ngOnInit() {

    console.log('Inicio el componente crear nivel');
    this.juego = this.juegoService.RecibirJuegoDelServicio();


  }

  // Activa la función ExaminarImagen
  ActivarInput() {
    console.log('Activar input');
    document.getElementById('input').click();
  }


  // Buscaremos la imagen en nuestro ordenador y después se mostrará en el form con la variable "logo" y guarda el
  // nombre de la foto en la variable nombreLogo
  ExaminarImagen($event) {

    this.file = $event.target.files[0];
    console.log('fichero ' + this.file.name);
    this.nombreLogo = this.file.name;

    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      console.log('ya');
      this.logoCargado = true;
      this.logo = reader.result.toString();
    };
  }

  Disabled() {

    if (this.nombreNivel === undefined || this.privilegiosDelNivel === undefined || this.puntosAlcanzar === undefined ||
      this.nombreNivel === '' || this.privilegiosDelNivel === '' || this.puntosAlcanzar === null) {
      this.isDisabledNivel = true;
    } else {
      this.isDisabledNivel = false;
    }
  }

  LimpiarCampos() {
    this.nombreNivel = undefined;
    this.privilegiosDelNivel = undefined;
    this.puntosAlcanzar = null;
    this.isDisabledNivel = true;
    this.logoCargado = false;
    this.logo = undefined;
    this.nombreLogo = undefined;
  }

   CrearNivel() {
    this.juegoDePuntosId = this.juego.id;

    this.juegoDePuntosService.POST_Nivel(new Nivel (this.nombreNivel, this.puntosAlcanzar, this.privilegiosDelNivel,
      this.nombreLogo), this.juegoDePuntosId).subscribe(nivel => {
        if (nivel !== undefined) {
          console.log('Nivel añadido correctamente');
          console.log(nivel);
          this.snackBar.open('Nivel ' + nivel.Nombre + ' creado correctamente', 'Cerrar', {
            duration: 2000,
          });

          // Hago el POST de la imagen SOLO si hay algo cargado. Ese boolean se cambiará en la función ExaminarImagen
          if (this.logoCargado === true) {

            // Hacemos el POST de la nueva imagen en la base de datos recogida de la función ExaminarImagen
            const formData: FormData = new FormData();
            formData.append(this.nombreLogo, this.file);
            this.juegoDePuntosService.POST_ImagenNivel(formData)
            .subscribe(() => console.log('Logo cargado'));
          }

          this.NivelAgregados(nivel); // Añadimos la insignia a la lista insignias agregadas
          this.LimpiarCampos(); // Limpiamos todos los campos
        } else {
             console.log('Fallo añadiendo');
        }
      });
    }


  // Añade la nueva insignia a la lista insignias agregadas
  NivelAgregados(nivel: Nivel) {
    this.nivelAgregados.push(nivel);
    this.nivelAgregados = this.nivelAgregados.filter(res => res.Nombre !== '');
    return this.nivelAgregados;
  }

  BorrarNivel(nivel: Nivel) {
    console.log(nivel);
  }




  prueba() {
    console.log(this.nivelAgregados);
  }

}

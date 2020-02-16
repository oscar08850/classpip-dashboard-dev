import { Component, OnInit } from '@angular/core';
import { ResponseContentType, Http, Response } from '@angular/http';

import { Alumno, Equipo, Juego, EquipoJuegoDeColeccion, Cromo } from '../../../../clases/index';


// Services
import { SesionService, PeticionesAPIService, CalculosService } from '../../../../servicios/index';

import { Location } from '@angular/common';
import { DialogoConfirmacionComponent } from '../../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { MatDialog } from '@angular/material';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-equipo-seleccionado-juego-de-coleccion',
  templateUrl: './equipo-seleccionado-juego-de-coleccion.component.html',
  styleUrls: ['./equipo-seleccionado-juego-de-coleccion.component.scss']
})
export class EquipoSeleccionadoJuegoDeColeccionComponent implements OnInit {

  juegoSeleccionado: Juego;
  equipo: Equipo;

  equipoJuegoDeColeccion: EquipoJuegoDeColeccion;

  // imagen
  imagenPerfil: string;

  alumnosEquipo: Alumno[];

  inscripcionEquipo: EquipoJuegoDeColeccion;

  listaCromos: Cromo[];
  listaCromosSinRepetidos: any [];
  cromo: Cromo;

  imagenCromoArray: string[] = [];
  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Confirma que quieres eliminar el cromo: ';

  constructor( private sesion: SesionService,
               private peticionesAPI: PeticionesAPIService,
               private calculos: CalculosService,
               private http: Http,
               public location: Location,
               public dialog: MatDialog
               ) { }

  ngOnInit() {
    this.equipo = this.sesion.DameEquipo();
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.inscripcionEquipo = this.sesion.DameInscripcionEquipo();
    this.CromosDelEquipo();
    this.GET_ImagenPerfil();
  }

  GET_ImagenPerfil() {

    if (this.equipo.FotoEquipo !== undefined ) {
      this.http.get('http://localhost:3000/api/imagenes/LogosEquipos/download/' + this.equipo.FotoEquipo,
      { responseType: ResponseContentType.Blob })
      .subscribe(response => {

        const blob = new Blob([response.blob()], { type: 'image/jpg'});

        const reader = new FileReader();
        reader.addEventListener('load', () => {
          this.imagenPerfil = reader.result.toString();
        }, false);

        if (blob) {
          reader.readAsDataURL(blob);
        }
      });
    }

  }

  CromosDelEquipo() {
    this.peticionesAPI.DameCromosEquipo(this.inscripcionEquipo.id)
    .subscribe(cromos => {
      this.listaCromos = cromos;
      this.listaCromosSinRepetidos = this.calculos.GeneraListaSinRepetidos(this.listaCromos);
      this.listaCromosSinRepetidos.sort((a, b) => a.cromo.Nombre.localeCompare(b.cromo.Nombre));

      this.sesion.TomaCromos(this.listaCromos);
      this.listaCromos.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
      this.GET_ImagenesCromos();

    });
  }



  GET_ImagenesCromos() {

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.listaCromosSinRepetidos.length; i++) {

      this.cromo = this.listaCromosSinRepetidos[i].cromo;

      if (this.cromo.Imagen !== undefined ) {

        // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
        this.http.get('http://localhost:3000/api/imagenes/ImagenCromo/download/' + this.cromo.Imagen,
        { responseType: ResponseContentType.Blob })
        .subscribe(response => {
          const blob = new Blob([response.blob()], { type: 'image/jpg'});

          const reader = new FileReader();
          reader.addEventListener('load', () => {
            this.imagenCromoArray[i] = reader.result.toString();
          }, false);

          if (blob) {
            reader.readAsDataURL(blob);
          }

        });
      }
    }
  }



  AbrirDialogoConfirmacionBorrarCromo(cromo: Cromo): void {

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        nombre: cromo.Nombre,
      }
    });

    // Antes de cerrar recogeremos el resultado del diálogo: Borrar (true) o cancelar (false). Si confirmamos, borraremos
    // el punto (función BorrarPunto) y mostraremos un Swal con el mensaje de que se ha eliminado correctamente.
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.BorrarCromo(cromo);
        Swal.fire('Eliminado', cromo.Nombre + ' eliminado correctamente', 'success');

      }
    });
  }

   // Utilizamos esta función para eliminar un cromo de la base de datos y actualiza la lista de cromos
   BorrarCromo(cromo: Cromo) {
    // primero obtengo todas las asignaciones del cromo al alumno
    this.peticionesAPI.DameAsignacionesCromosEquipo (this.inscripcionEquipo.id, cromo.id)
    .subscribe((res) => {
      // Y ahora elimino la primera de ellas (una cualquiera)
      this.peticionesAPI.BorrarCromoEquipo (res[0].id)
      .subscribe ( () => this.CromosDelEquipo());
    });
  }



  goBack() {
    this.location.back();
  }

}

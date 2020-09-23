import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

// Servicios
import { PeticionesAPIService, SesionService} from '../../../servicios/index';

// Clases
import { Punto} from '../../../clases/index';

@Component({
  selector: 'app-editar-punto',
  templateUrl: './editar-punto.component.html',
  styleUrls: ['./editar-punto.component.scss']
})
export class EditarPuntoComponent implements OnInit {

  punto: Punto;
  nombrePunto: string;
  descripcionPunto: string;


  // tslint:disable-next-line:no-shadowed-variable
  constructor(  private peticionesAPI: PeticionesAPIService,
                private sesion: SesionService,
                private location: Location ) { }

  ngOnInit() {
    this.punto = this.sesion.DameTipoPunto();
    this.nombrePunto = this.punto.Nombre;
    this.descripcionPunto = this.punto.Descripcion;
  }

  EditarPunto() {
    console.log('Entro a editar');

    this.punto.Nombre = this.nombrePunto;
    this.punto.Descripcion = this.descripcionPunto;
    this.peticionesAPI.ModificaTipoDePunto(new Punto(this.nombrePunto, this.descripcionPunto), this.punto.profesorId, this.punto.id)
    .subscribe((res) => {
      if (res != null) {
        console.log('Voy a editar el punto con id ' + this.punto.id);
        this.punto = res;

      } else {
        console.log('fallo editando');
      }
    });
    this.goBack();
  }
  LimpiarCampos() {
    this.nombrePunto = '';
    this.descripcionPunto = '';

  }
  goBack() {
    this.location.back();
  }


}

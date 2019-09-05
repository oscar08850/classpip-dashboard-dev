import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

// Servicios
import { PuntosInsigniasService} from '../../../servicios/index';

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
  constructor(  private PuntosInsigniasService: PuntosInsigniasService,
                private location: Location ) { }

  ngOnInit() {
    this.punto = this.PuntosInsigniasService.RecibirPuntoDelServicio();
    this.nombrePunto = this.punto.Nombre;
    this.descripcionPunto = this.punto.Descripcion;
  }

  EditarPunto() {
    console.log('Entro a editar');

    this.PuntosInsigniasService.PUT_Punto(new Punto(this.nombrePunto, this.descripcionPunto), this.punto.profesorId, this.punto.id)
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

  goBack() {
    this.location.back();
  }


}

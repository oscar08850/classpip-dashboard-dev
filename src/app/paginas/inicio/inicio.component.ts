import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';

// Clases
import { Profesor } from '../../clases/index';

// Servicios
import {ProfesorService} from '../../servicios/index';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  profesor: any = [];


  constructor(private servicioProfesor: ProfesorService,
              private location: Location) { }

  ngOnInit() {

    // LE PIDO AL SERVICIO QUE ME DE LOS DATOS DEL PROFESOR QUE ME HAN ENVIADO
    this.profesor = this.servicioProfesor.RecibirProfesorDelServicio();
  }

}

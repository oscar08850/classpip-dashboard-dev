import { Component, OnInit, Input , ViewChild} from '@angular/core';
import { Location } from '@angular/common';

import {MatTableDataSource} from '@angular/material/table';

/* Necesario para controlar qué filas están seleccionadas */
import {SelectionModel} from '@angular/cdk/collections';

/* Imports necesarios para la ordenación y la paginación */
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

// Clases
import { Profesor } from '../../clases/index';

// Servicios
import {SesionService} from '../../servicios/index';
import { TrustedString } from '@angular/core/src/sanitization/bypass';




@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  constructor() { }


  ngOnInit() {

  }


}

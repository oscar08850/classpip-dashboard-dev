import { Component, OnInit } from '@angular/core';
import {SesionService, PeticionesAPIService, CalculosService} from '../../../servicios/index';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

import { Alumno, Equipo, Juego, Punto, Nivel, AlumnoJuegoDePuntos, EquipoJuegoDePuntos,
  TablaAlumnoJuegoDePuntos, TablaEquipoJuegoDePuntos, JuegoDeAvatar, AlumnoJuegoDeAvatar } from '../../../clases/index';
import { MatDialog } from '@angular/material';

import {SelectionModel} from '@angular/cdk/collections';

import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-juego-de-cuento-seleccionado-activo',
  templateUrl: './juego-de-cuento-seleccionado-activo.component.html',
  styleUrls: ['./juego-de-cuento-seleccionado-activo.component.scss']
})
export class JuegoDeCuentoSeleccionadoActivoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}


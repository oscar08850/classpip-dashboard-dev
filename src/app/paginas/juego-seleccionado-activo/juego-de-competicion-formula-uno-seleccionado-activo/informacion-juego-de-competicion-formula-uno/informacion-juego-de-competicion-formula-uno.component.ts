import { Component, OnInit } from '@angular/core';
// Servicio
import { SesionService , CalculosService, PeticionesAPIService } from '../../../../servicios/index';
import { forEach } from '@angular/router/src/utils/collection';
import { MatTableDataSource } from '@angular/material';
import { identifierModuleUrl } from '@angular/compiler';

@Component({
  selector: 'app-informacion-juego-de-competicion-formula-uno',
  templateUrl: './informacion-juego-de-competicion-formula-uno.component.html',
  styleUrls: ['./informacion-juego-de-competicion-formula-uno.component.scss']
})
export class InformacionJuegoDeCompeticionFormulaUnoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

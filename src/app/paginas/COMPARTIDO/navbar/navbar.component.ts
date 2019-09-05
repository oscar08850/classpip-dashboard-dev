import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Router } from '@angular/router';

// Clases
import { Profesor } from '../../../clases/index';

// Servicios
import {ProfesorService} from '../../../servicios/index';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {


  @Output() public sidenavToggle = new EventEmitter();

  profesor: Profesor;
  id: number;

  URLInicio: string;

  // Rutas del navbar
  URLMisGrupos: string;
  URLCrearGrupo: string;
  URLMisPuntos: string;
  URLCrearPuntos: string;
  URLMisColecciones: string;
  URLCrearColeccion: string;
  URLConfiguracion: string;

  constructor( private profesorService: ProfesorService,
               private router: Router) { }

  ngOnInit() {


    this.URLInicio = this.router.url;
    this.URLMisGrupos = this.URLInicio + '/misGrupos';
    this.URLCrearGrupo = this.URLInicio + '/crearGrupo';
    this.URLMisPuntos = this.URLInicio + '/misPuntos';
    this.URLCrearPuntos = this.URLInicio + '/crearPuntos';
    this.URLMisColecciones = this.URLInicio + '/misColecciones';
    this.URLCrearColeccion = this.URLInicio + '/crearColeccion';
    this.URLConfiguracion = this.URLInicio + '/configuracionProfesor';


    this.profesor = this.profesorService.RecibirProfesorDelServicio();

  }

}

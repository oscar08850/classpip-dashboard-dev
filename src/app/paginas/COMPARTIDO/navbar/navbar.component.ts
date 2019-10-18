import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Router } from '@angular/router';

// Clases
import { Profesor } from '../../../clases/index';

// Servicios
import {SesionService} from '../../../servicios/index';

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
  URLDesarrolladores: string;
  URLEstilos: string;

  constructor( private sesion: SesionService,
               private router: Router) { }

  ngOnInit() {


    this.URLInicio = this.router.url;
    this.URLMisGrupos = this.URLInicio + '/misGrupos';
    this.URLCrearGrupo = this.URLInicio + '/crearGrupo';
    this.URLMisPuntos = this.URLInicio + '/misPuntos';
    this.URLCrearPuntos = this.URLInicio + '/crearPuntos';
    this.URLMisColecciones = this.URLInicio + '/misColecciones';
    this.URLCrearColeccion = this.URLInicio + '/crearColeccion';
    this.URLDesarrolladores = this.URLInicio + '/desarrolladores';
    this.URLEstilos = this.URLInicio + '/estilos';
    this.URLConfiguracion = this.URLInicio + '/configuracionProfesor';


    // Recupero al profesor porque se muestra en la barra de navegación
    this.profesor = this.sesion.DameProfesor();

  }

}

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
  URLMisAlumnos: string;
  URLIntroducirAlumnos: string;
  URLConfiguracion: string;
  URLDesarrolladores: string;
  URLEstilos: string;
  URLMisPreguntas: string;
  URLCrearPregunta: string;
  URLMisCuestionarios: string;
  URLCrearCuestionario: string;
  URLMisFamiliasAvatares: string;
  URLCrearFamiliaAvatares: string;

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
    this.URLMisAlumnos = this.URLInicio + '/misAlumnos';
    this.URLIntroducirAlumnos = this.URLInicio + '/introducirAlumnos';
    this.URLEstilos = this.URLInicio + '/estilos';
    this.URLConfiguracion = this.URLInicio + '/configuracionProfesor';
    this.URLMisPreguntas = this.URLInicio + '/misPreguntas';
    this.URLCrearPregunta = this.URLInicio + '/crearPregunta';
    this.URLMisCuestionarios = this.URLInicio + '/misCuestionarios';
    this.URLCrearCuestionario = this.URLInicio + '/crearCuestionario';
    this.URLMisFamiliasAvatares = this.URLInicio + '/misFamiliasAvatares';
    this.URLCrearFamiliaAvatares = this.URLInicio + '/crearFamiliaAvatares';


    // Recupero al profesor porque se muestra en la barra de navegación
    this.profesor = this.sesion.DameProfesor();

  }

}

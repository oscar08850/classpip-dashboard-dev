import { Injectable } from '@angular/core';
import { Profesor, Grupo, Juego, Equipo, Alumno, Coleccion, Cromo } from '../clases';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  profesor: Profesor;
  grupo: Grupo;
  juego: Juego;
  equipo: Equipo;
  alumnosEquipo: Alumno[];
  alumnosGrupo: Alumno[];
  coleccion: Coleccion;
  cromos: Cromo[];
  cromo: Cromo;

  constructor() { }
  public TomaProfesor(profesor: Profesor){
    this.profesor = profesor;
  }
  public  DameProfesor(): Profesor {
    return this.profesor;
  }
  public TomaGrupo(grupo: Grupo) {
    this.grupo = grupo;
  }
  public  DameGrupo(): Grupo {
    return this.grupo;
  }
  public TomaJuego(juego: Juego) {
    this.juego = juego;
  }
  public  DameJuego(): Juego {
    return this.juego;
  }
  public TomaEquipo(equipo: Equipo) {
    this.equipo = equipo;
  }
  public TomaAlumnosEquipo(alumnos: Alumno[]) {
    this.alumnosEquipo = alumnos;
  }
  public  DameEquipo(): Equipo {
    return this.equipo;
  }
  public DameAlumnosEquipo(): Alumno[] {
    return this.alumnosEquipo;
  }

  public TomaAlumnosGrupo(alumnos: Alumno[]) {
    this.alumnosGrupo = alumnos;
  }
  public DameAlumnosGrupo(): Alumno[] {
    return this.alumnosGrupo;
  }

  public TomaColeccion(coleccion: Coleccion) {
    this.coleccion = coleccion;
  }
  public DameColeccion(): Coleccion {
    return this.coleccion ;
  }

  public TomaCromos(cromosColeccion: Cromo[]) {
    this.cromos = cromosColeccion;
  }

  public DameCromos(): Cromo[] {
    return this.cromos;
  }

  public TomaCromo( cromo: Cromo) {
    this.cromo = cromo;
  }

  public DameCromo(): Cromo {
    return this.cromo;
  }


}

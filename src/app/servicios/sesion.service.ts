import { Injectable } from '@angular/core';
import { Profesor, Grupo, Juego, Equipo, Alumno, Coleccion, Cromo, Punto, Insignia, AlumnoJuegoDeCompeticionLiga,
         // tslint:disable-next-line:max-line-length
         TablaJornadas, Jornada, TablaAlumnoJuegoDeCompeticion, TablaEquipoJuegoDeCompeticion, TablaPuntosFormulaUno, Cuestionario, Pregunta, JuegoDeAvatar, AlumnoJuegoDeAvatar, AlumnoJuegoDeCuestionario,
         TablaAlumnoJuegoDeCuestionario,
         FamiliaAvatares, CuestionarioSatisfaccion} from '../clases';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { Escenario } from '../clases/Escenario';
import { PuntoGeolocalizable } from '../clases/PuntoGeolocalizable';
import { FieldsMapping } from '@syncfusion/ej2-angular-lists';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  profesor: Profesor;
  grupo: Grupo;
  juego: Juego;
  juegoAvatar: JuegoDeAvatar;
  equipo: Equipo;
  alumnosEquipo: Alumno[];
  alumnosGrupo: Alumno[];
  coleccion: Coleccion;
  cromos: Cromo[];
  cromo: Cromo;
  posicion: any;
  tiposPuntosDelJuego: any;
  nivelesDelJuego: any;
  alumnoSeleccionado: any;
  inscripcionAlumnoJuego: any;
  equipoSeleccionado: any;
  inscripcionEquipoJuego: any;

  alumnosDelJuego: any;
  listaAlumnosOrdenadaPorPuntos: any;
  rankingJuegoDePuntos: any;
  equiposDelJuego: any;
  listaEquiposOrdenadaPorPuntos: any;
  rankingEquiposJuegoDePuntos: any;

  alumno: any;
  inscripcionAlumno: any;
  inscripcionEquipo: any;
  listaGrupos: any;
  imagenLogoEquipo: any;

  punto: Punto;
  insignia: Insignia;

  jornadas: any;
  JornadasCompeticion: any;
  TablaAlumnoJuegoDeCompeticion: TablaAlumnoJuegoDeCompeticion[];
  TablaEquipoJuegoDeCompeticion: TablaEquipoJuegoDeCompeticion[];
  TablaeditarPuntos: TablaPuntosFormulaUno[];
  JuegosDePuntos: Juego[];
  JuegosDeCuestionariosAcabados: Juego[];
  juegosDeVotacionUnoATodosAcabados: Juego[];
  // listaEquiposGrupo: any;

  pregunta: Pregunta;
  cuestionario: Cuestionario;
  listaCuestionarios: any;
  escenario: Escenario;
  puntogeolocalizable: PuntoGeolocalizable;
  listaEscenarios: any;
  puntosgeolocalizables: PuntoGeolocalizable[];
  IdMisPreguntasBasicas: number[];
  IdMisPreguntasBonus: number[];

  inscripcionAlumnoJuegoAvatar: AlumnoJuegoDeAvatar;

  inscripcionAlumnoJuegoDeCuestionario: AlumnoJuegoDeCuestionario;
  alumnoJuegoDeCuestionario: TablaAlumnoJuegoDeCuestionario;

  familia: FamiliaAvatares;
  cuestionarioDeSatiafaccion: CuestionarioSatisfaccion;

  constructor() { }
  public TomaProfesor(profesor: Profesor) {
    this.profesor = profesor;
  }
  public  DameProfesor(): Profesor {
    return this.profesor;
  }
  public TomaGrupo(grupo: Grupo) {
    this.grupo = grupo;
  }

  public TomaListaGrupos(listaGrupos: any) {
    this.listaGrupos = listaGrupos;
  }

  public DameListaGrupos(): any {
    return this.listaGrupos;
  }

  public  DameGrupo(): Grupo {
    return this.grupo;
  }

  // public TomaEquiposGrupo(listaEquipos: any) {
  //   this.listaEquiposGrupo = listaEquipos;
  // }

  // public DameEquiposGrupo(): any {
  //   return this.listaEquiposGrupo;
  // }

  public TomaJuego(juego: Juego) {
    this.juego = juego;
  }
  public  DameJuego(): Juego {
    return this.juego;
  }
  public TomaJuegoAvatar(juego: JuegoDeAvatar) {
    this.juegoAvatar = juego;
  }
  public  DameJuegoAvatar(): JuegoDeAvatar {
    return this.juegoAvatar;
  }
  public TomaAlumnoJuegoAvatar(alumnoJuegoAvatar: AlumnoJuegoDeAvatar) {
    this.inscripcionAlumnoJuegoAvatar = alumnoJuegoAvatar;
  }
  public DameAlumnoJuegoAvatar(): AlumnoJuegoDeAvatar {
    return this.inscripcionAlumnoJuegoAvatar;
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

  public TomaDatosEvolucionAlumnoJuegoCompeticionLiga( posicion: number,
                                                       alumnoSeleccionado: Alumno,
                                                       inscripcionAlumnoJuego: AlumnoJuegoDeCompeticionLiga ) {
    this.posicion = posicion;
    this.alumnoSeleccionado = alumnoSeleccionado;
    this.inscripcionAlumnoJuego = inscripcionAlumnoJuego;
  }

  public TomaDatosEvolucionAlumnoJuegoPuntos( posicion: any,
                                              tiposPuntosDelJuego: any,
                                              nivelesDelJuego: any,
                                              alumnoSeleccionado: any,
                                              inscripcionAlumnoJuego: any) {
      this.posicion = posicion;
      this.tiposPuntosDelJuego = tiposPuntosDelJuego;
      this.nivelesDelJuego = nivelesDelJuego;
      this.alumnoSeleccionado = alumnoSeleccionado;
      this.inscripcionAlumnoJuego = inscripcionAlumnoJuego;
  }

  public DameDatosEvolucionAlumnoJuegoPuntos(): any {
    const datos = {
                      posicion: this.posicion,
                      tiposPuntosDelJuego: this.tiposPuntosDelJuego,
                      nivelesDelJuego: this.nivelesDelJuego,
                      alumnoSeleccionado: this.alumnoSeleccionado,
                      inscripcionAlumnoJuego: this.inscripcionAlumnoJuego
    };
    return datos;
  }

  public TomaDatosEvolucionEquipoJuegoPuntos(
                      posicion: any,
                      equipoSeleccionado: any,
                      inscripcionEquipoJuego: any,
                      nivelesDelJuego: any,
                      tiposPuntosDelJuego) {
      this.posicion = posicion;
      this.equipoSeleccionado = equipoSeleccionado;
      this.inscripcionEquipoJuego = inscripcionEquipoJuego;
      this.nivelesDelJuego = nivelesDelJuego;
      this.tiposPuntosDelJuego = tiposPuntosDelJuego;

  }

  public DameDatosEvolucionEquipoJuegoPuntos(): any {
    const datos = {
                      posicion: this.posicion,
                      equipoSeleccionado: this.equipoSeleccionado,
                      inscripcionEquipoJuego: this.inscripcionEquipoJuego,
                      nivelesDelJuego: this.nivelesDelJuego,
                      tiposPuntosDelJuego: this.tiposPuntosDelJuego
    };
    return datos;
  }

  public TomaInformacionJuego(  nivelesDelJuego: any,
                                tiposPuntosDelJuego: any) {
      this.nivelesDelJuego = nivelesDelJuego;
      this.tiposPuntosDelJuego = tiposPuntosDelJuego;
  }
  public DameInformacionJuego(): any {
    const datos = {
                      nivelesDelJuego: this.nivelesDelJuego,
                      tiposPuntosDelJuego: this.tiposPuntosDelJuego
    };
    return datos;
  }

//   public TomaInformacionJuegoDeCompeticion( nivelesDelJuego: any ) {
//       this.nivelesDelJuego = nivelesDelJuego;
// }


  public TomaDatosParaAsignarPuntos(
          tiposPuntosDelJuego: any,
          nivelesDelJuego: any,
          alumnosDelJuego: any,
          listaAlumnosOrdenadaPorPuntos: any,
          rankingJuegoDePuntos: any,
          equiposDelJuego: any,
          listaEquiposOrdenadaPorPuntos: any,
          rankingEquiposJuegoDePuntos: any
        ) {

        this.tiposPuntosDelJuego = tiposPuntosDelJuego;
        this.nivelesDelJuego = nivelesDelJuego;
        this.alumnosDelJuego = alumnosDelJuego;
        this.listaAlumnosOrdenadaPorPuntos = listaAlumnosOrdenadaPorPuntos;
        this.rankingJuegoDePuntos = rankingJuegoDePuntos;
        this.equiposDelJuego = equiposDelJuego;
        this.listaEquiposOrdenadaPorPuntos = listaEquiposOrdenadaPorPuntos;
        this.rankingEquiposJuegoDePuntos = rankingEquiposJuegoDePuntos;
        console.log ('Sesion ' + this.rankingEquiposJuegoDePuntos );
        console.log ('Sesion ' + this.equiposDelJuego );
        console.log ('Sesion ' + this.listaEquiposOrdenadaPorPuntos );

  }

  public DameDatosParaAsignarPuntos(): any {
    const datos = {
    tiposPuntosDelJuego: this.tiposPuntosDelJuego,
    nivelesDelJuego: this.nivelesDelJuego,
    alumnosDelJuego: this.alumnosDelJuego,
    listaAlumnosOrdenadaPorPuntos: this.listaAlumnosOrdenadaPorPuntos,
    rankingJuegoDePuntos: this.rankingJuegoDePuntos,
    equiposDelJuego: this.equiposDelJuego,
    listaEquiposOrdenadaPorPuntos: this.listaEquiposOrdenadaPorPuntos,
    rankingEquiposJuegoDePuntos: this.rankingEquiposJuegoDePuntos
    };
    console.log ('Sesion regreso ' + datos.rankingEquiposJuegoDePuntos );

    return datos;
  }
  public DameRankingEquipos(): any {
    return this.rankingEquiposJuegoDePuntos;
  }

  public TomaAlumnosDelJuego( alumnos: any) {
    this.alumnosDelJuego = alumnos;
  }

  public DameAlumnosDelJuego(): any {
    return this.alumnosDelJuego;
  }

  public DameEquiposDelJuego(): any {
    return this.equiposDelJuego;
  }

  public TomaEquiposDelJuego( equipos: any) {
    this.equiposDelJuego = equipos;
  }

  public TomaAlumno(alumno: any) {
    this.alumno = alumno;
  }
  public DameAlumno(): any {
    return this.alumno;
  }

  public TomaInscripcionAlumno(inscripcionAlumno: any) {
    this.inscripcionAlumno = inscripcionAlumno;
  }

  public DameInscripcionAlumno(): any {
    return this.inscripcionAlumno;
  }

  public TomaInscripcionEquipo(inscripcionEquipo: any) {
    this.inscripcionEquipo = inscripcionEquipo;
  }

  public DameInscripcionEquipo(): any {
    return this.inscripcionEquipo;
  }

  public TomaImagenLogoEquipo(imagenLogoEquipo: any) {
    this.imagenLogoEquipo = imagenLogoEquipo;
  }

  public DameImagenLogoEquipo(): any {
    return this.imagenLogoEquipo;
  }

  public TomaTipoPunto(punto: any) {
    this.punto = punto;
  }

  public DameTipoPunto(): any {
    return this.punto;
  }

  public TomaInsignia(insignia: any) {
    this.insignia = insignia;
  }

  public DameInsignia(): any {
    return this.insignia;
  }

  public TomaDatosJornadas(
    jornadas: Jornada[],
    JornadasCompeticion: TablaJornadas[]
  ) {
  this.JornadasCompeticion = JornadasCompeticion;
  this.jornadas = jornadas;
  console.log ('jornadas:');
  console.log ( this.JornadasCompeticion);
  console.log ('TablaJornadas:');
  console.log ( this.jornadas);

}

public DameDatosJornadas(): any {
const datos = {
jornadas: this.jornadas,
JornadasCompeticion: this.JornadasCompeticion
};
console.log ('Aqui estan las jornadas guardadas y la tabla de jornadas: ');
console.log(this.jornadas);
console.log(this.JornadasCompeticion);

return datos;
}

public TomaCuestionario(cuestionario: Cuestionario) {
  this.cuestionario = cuestionario;
}

public  DameCuestionario(): Cuestionario {
  return this.cuestionario;
}

public DamePregunta(): Pregunta {
  return this.pregunta;
}

public TomaPregunta(pregunta: Pregunta) {
  this.pregunta = pregunta;
}

public DameListaCuestionarios(): any {
  return this.listaCuestionarios;
}

public TomaListaCuestionarios(listaCuestionarios: any) {
  this.listaCuestionarios = listaCuestionarios;
}




public TomaEscenario(escenario: Escenario) {
  this.escenario = escenario;
}

public  DameEscenario(): Escenario {
  return this.escenario;
}

public DamePuntoGeolocalizable(): PuntoGeolocalizable {
  return this.puntogeolocalizable;
}

public TomaPuntoGeolocalizable(puntogeolocalizable: PuntoGeolocalizable) {
  this.puntogeolocalizable = puntogeolocalizable;
}

public TomaPuntosGeolocalizables(puntosgeolocalizablesEscenario: PuntoGeolocalizable[]) {
  this.puntosgeolocalizables = puntosgeolocalizablesEscenario;
}
public DamePuntosGeolocalizables(): PuntoGeolocalizable[] {
  return this.puntosgeolocalizables;
}


public DameListaEscenarios(): any {
  return this.listaEscenarios;
}

public TomaListaEscenarios(listaEscenarios: any) {
  this.listaEscenarios = listaEscenarios;
}

public TomaIdPreguntasBasicas(IdMisPreguntasBasicas: number[]) {
  this.IdMisPreguntasBasicas = IdMisPreguntasBasicas;
}

public  DameIdPreguntasBasicas(): any {
  return this.IdMisPreguntasBasicas;
}

public TomaIdPreguntasBonus(IdMisPreguntasBonus: number[]) {
  this.IdMisPreguntasBonus = IdMisPreguntasBonus;
}

public  DameIdPreguntasBonus(): any {
  return this.IdMisPreguntasBonus;
}



public TomaDatosJornadasJuegoComponent(
  jornadas: Jornada[],
) {
this.jornadas = jornadas;
console.log ('jornadas:');
console.log ( this.jornadas);
}

public TomaTablaAlumnoJuegoDeCompeticion(Tabla: TablaAlumnoJuegoDeCompeticion[]) {
  this.TablaAlumnoJuegoDeCompeticion = Tabla;
}

public DameDatosJornadasJuegoComponent(): any {
const datos = {
jornadas: this.jornadas,
};
console.log ('Aqui estan las jornadas guardadas: ');
console.log(this.jornadas);

return datos;
}


public DameTablaAlumnoJuegoDeCompeticion(): TablaAlumnoJuegoDeCompeticion[] {
  const Tabla = this.TablaAlumnoJuegoDeCompeticion;
  return Tabla;
}

public TomaTablaEquipoJuegoDeCompeticion(Tabla: TablaEquipoJuegoDeCompeticion[]) {
  this.TablaEquipoJuegoDeCompeticion = Tabla;
}

public DameTablaEquipoJuegoDeCompeticion(): TablaEquipoJuegoDeCompeticion[] {
  const Tabla = this.TablaEquipoJuegoDeCompeticion;
  return Tabla;
}

public TomaJuegosDePuntos(juegosPuntos: Juego[]) {
  this.JuegosDePuntos = juegosPuntos;
}
public DameJuegosDePuntos(): Juego[] {
  return this.JuegosDePuntos;
}

 public TomaJuegosDeCuestionario(juegosCuestionarios: Juego[]) {
   console.log ('guardo juegos cuestionarios acabados');
   console.log (juegosCuestionarios);
   this.JuegosDeCuestionariosAcabados = juegosCuestionarios;
 }

 public DameJuegosDeCuestionariosAcabados(): Juego[] {
  return this.JuegosDeCuestionariosAcabados;
}

public TomaJuegosDeVotacionUnoATodos(juegosDeVotacionUnoATodos: Juego[]) {
  console.log ('guardo juegos de votacion Uno A Todos acabados');
  console.log (juegosDeVotacionUnoATodos);
  this.juegosDeVotacionUnoATodosAcabados = juegosDeVotacionUnoATodos;
}

public DameJuegosDeVotacionUnoATodosAcabados(): Juego[] {
 return this.juegosDeVotacionUnoATodosAcabados;
}

public TomaTablaeditarPuntos( TablaeditarPuntos: TablaPuntosFormulaUno[]) {
  this.TablaeditarPuntos = TablaeditarPuntos;
}
public DameTablaeditarPuntos(): TablaPuntosFormulaUno[] {
  const TablaeditarPuntos = this.TablaeditarPuntos ;
  return TablaeditarPuntos;
}

public TomaInscripcionAlumnoJuegoDeCuestionario(inscripcion: AlumnoJuegoDeCuestionario) {
  this.inscripcionAlumnoJuegoDeCuestionario = inscripcion;
}

public TomaAlumnoJuegoDeCuestionario(alumno: TablaAlumnoJuegoDeCuestionario) {
  this.alumnoJuegoDeCuestionario = alumno;
}

public DameAlumnoJuegoDeCuestionario(): TablaAlumnoJuegoDeCuestionario {
  return this.alumnoJuegoDeCuestionario;
}

public DameInscripcionAlumnoJuegoDeCuestionario(): AlumnoJuegoDeCuestionario {
  return this.inscripcionAlumnoJuegoDeCuestionario;
}
public TomaFamilia(familia: FamiliaAvatares) {
  this.familia = familia;
}
public DameFamilia(): FamiliaAvatares {
  return this.familia;
}
public TomaCuestionarioSatisfaccion(cuestionario: CuestionarioSatisfaccion) {
  this.cuestionarioDeSatiafaccion = cuestionario;
}

public DameCuestionarioSatisfaccion(): CuestionarioSatisfaccion {
  return this.cuestionarioDeSatiafaccion;
}

}

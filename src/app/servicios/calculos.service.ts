import { Injectable } from '@angular/core';
import { SesionService, PeticionesAPIService} from './index';
import { Grupo, Equipo, Juego, Alumno, Nivel, TablaAlumnoJuegoDePuntos, TablaHistorialPuntosAlumno, AlumnoJuegoDePuntos,
         TablaEquipoJuegoDePuntos, HistorialPuntosAlumno, HistorialPuntosEquipo, EquipoJuegoDePuntos, TablaHistorialPuntosEquipo,
         AlumnoJuegoDeColeccion, Album, EquipoJuegoDeColeccion, AlbumEquipo, Cromo, TablaJornadas, TablaAlumnoJuegoDeCompeticion,
         TablaEquipoJuegoDeCompeticion, Jornada, EquipoJuegoDeCompeticionLiga, EnfrentamientoLiga,
         InformacionPartidosLiga,
         AlumnoJuegoDeCompeticionLiga} from '../clases/index';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class CalculosService {

  juegosDePuntosActivos: Juego[] = [];
  juegosDePuntosInactivos: Juego[] = [];
  juegosDeColeccionActivos: Juego[] = [];
  juegosDeColeccionInactivos: Juego[] = [];
  juegosDeCompeticionActivos: Juego[] = [];
  juegosDeCompeticionInactivos: Juego[] = [];
  todosLosJuegosActivos: Juego[] = [];
  todosLosJuegosInactivos: Juego[] = [];
  ListaJuegosSeleccionadoActivo: Juego[];
  ListaJuegosSeleccionadoInactivo: Juego[];

  informacionPartidos: InformacionPartidosLiga[];

  constructor(
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService
  ) {
  }


  // Elimina el grupo (tanto el id del profe como del grupo estan en sesión.
  // Lo hago con un observable para que el componente que muestra la lista de grupos
  // espere hasta que se haya acabado la operacion de borrar el grupo de la base de datos
  public EliminarGrupo(): any {
    const eliminaObservable = new Observable ( obs => {


          this.peticionesAPI.BorraGrupo(
                    this.sesion.DameProfesor().id,
                    this.sesion.DameGrupo().id)
          .subscribe(() => {

            this.EliminarMatriculas();

            // Ahora elimino el grupo de la lista de grupos para que desaparezca de la pantalla al regresar
            let lista = this.sesion.DameListaGrupos();
            lista = lista.filter (g => g.id !== this.sesion.DameGrupo().id);
            obs.next ();
          });
    });
    return eliminaObservable;
  }

  // ESTA FUNCIÓN RECUPERA TODAS LAS MATRICULAS DEL GRUPO QUE VAMOS A BORRAR Y DESPUÉS LAS BORRA. ESTO LO HACEMOS PARA NO
  // DEJAR MATRICULAS QUE NO NOS SIRVEN EN LA BASE DE DATOS
  private EliminarMatriculas() {
    // Pido las matrículas correspondientes al grupo que voy a borrar
    this.peticionesAPI.DameMatriculasGrupo(this.sesion.DameGrupo().id)
    .subscribe( matriculas => {
      if (matriculas[0] !== undefined) {

        // Una vez recibo las matriculas del grupo, las voy borrando una a una
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < matriculas.length; i++) {
          this.peticionesAPI.BorraMatricula(matriculas[i].id)
          .subscribe(() => {
              console.log('matricula borrada correctamente');
          });
        }
      } else {
        console.log('no hay matriculas');
      }

    });
  }


  // Trae de la base de datos todos los juegos del grupo y los organiza en dos
  // listas, una de activos y otra de inactivos. Retorna estas listas como observable

  public DameListaJuegos(grupoID: number): any {
    const listasObservables = new Observable ( obs => {

      const juegosActivos: Juego[] = [];
      const juegosInactivos: Juego[] = [];

      console.log ('vamos a por los juegos de puntos del grupo: ' + grupoID);
      this.peticionesAPI.DameJuegoDePuntosGrupo(grupoID)
      .subscribe(juegosPuntos => {
        console.log('He recibido los juegos de puntos');
        console.log(juegosPuntos);
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < juegosPuntos.length; i++) {
          if (juegosPuntos[i].JuegoActivo === true) {
            juegosActivos.push(juegosPuntos[i]);
          } else {
            console.log('Juego inactivo');
            console.log(juegosPuntos[i]);
            juegosInactivos.push(juegosPuntos[i]);
          }
        }
        // Ahora vamos apor por los juegos de colección
        console.log ('vamos a por los juegos de colección del grupo: ' + grupoID);
        this.peticionesAPI.DameJuegoDeColeccionGrupo(grupoID)
        .subscribe(juegosColeccion => {
          console.log('He recibido los juegos de coleccion');
          console.log(juegosColeccion);
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < juegosColeccion.length; i++) {
            if (juegosColeccion[i].JuegoActivo === true) {
              juegosActivos.push(juegosColeccion[i]);
            } else {
              juegosInactivos.push(juegosColeccion[i]);
            }
          }
          // Ahora vamos a por los juegos de competición
          console.log ('vamos a por los juegos de competicion del grupo: ' + grupoID);
          this.peticionesAPI.DameJuegoDeCompeticionLigaGrupo(grupoID)
          .subscribe(juegosCompeticion => {
            console.log('He recibido los juegos de competición');
            console.log(juegosCompeticion);
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < juegosCompeticion.length; i++) {
              if (juegosCompeticion[i].JuegoActivo === true) {
                juegosActivos.push(juegosCompeticion[i]);
              } else {
                juegosInactivos.push(juegosCompeticion[i]);
              }
            }
            const resultado = { activos: juegosActivos, inactivos: juegosInactivos};
            obs.next (resultado);
            // this.PreparaListas ();
          });
        });
      });
    });

    return listasObservables;
  }

  public PrepararTablaRankingIndividual(  listaAlumnosOrdenadaPorPuntos,
                                          alumnosDelJuego,
                                          nivelesDelJuego): any {

      const rankingJuegoDePuntos: any [] = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < listaAlumnosOrdenadaPorPuntos.length; i++) {
        let alumno: Alumno;
        let nivel: Nivel;
        const alumnoId = listaAlumnosOrdenadaPorPuntos[i].alumnoId;
        const nivelId = listaAlumnosOrdenadaPorPuntos[i].nivelId;
        alumno = alumnosDelJuego.filter(res => res.id === alumnoId)[0];

        if (listaAlumnosOrdenadaPorPuntos[i].nivelId !== undefined) {
          nivel = nivelesDelJuego.filter(res => res.id === nivelId)[0];
        }

        if (nivel !== undefined) {
          rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
            listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno, nivel.Nombre);

        } else {
          rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
            listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno);
        }
      }

      return (rankingJuegoDePuntos);

  }

  public PrepararTablaRankingIndividualCompeticion(listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeCompeticionLiga[],
                                                   alumnosDelJuego: Alumno[], jornadasDelJuego: Jornada[],
                                                   enfrentamientosDelJuego: EnfrentamientoLiga[][] ): TablaAlumnoJuegoDeCompeticion[] {
    const rankingJuegoDeCompeticion: TablaAlumnoJuegoDeCompeticion [] = [];
    console.log (' Vamos a preparar la tabla del ranking individual de Competición');
    console.log ('la lista de alumnos ordenada es: ');
    console.log (listaAlumnosOrdenadaPorPuntos);
    // tslint:disable-next-line:prefer-for-oF
    for (let i = 0; i < listaAlumnosOrdenadaPorPuntos.length; i++) {
      let alumno: Alumno;
      const alumnoId = listaAlumnosOrdenadaPorPuntos[i].AlumnoId;
      alumno = alumnosDelJuego.filter(res => res.id === alumnoId)[0];
      rankingJuegoDeCompeticion[i] = new TablaAlumnoJuegoDeCompeticion(i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
                                                                       listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno, alumnoId);
    }
    const individual = true;
    const informacionPartidos = this.ObtenerInformaciónPartidos(listaAlumnosOrdenadaPorPuntos, jornadasDelJuego,
                                                                individual, enfrentamientosDelJuego);
    console.log('Vamos a rellenar la TablaEquipoJuegoDeCompeticion con la informacionPartidos');
    const rankingJuegoDeCompeticionFinal = this.RellenarTablaAlumnoJuegoDeCompeticion(rankingJuegoDeCompeticion, informacionPartidos);
    console.log ('El ranking es: ' );
    console.log (rankingJuegoDeCompeticionFinal);
    return rankingJuegoDeCompeticionFinal;
  }

  public PrepararTablaRankingEquipoCompeticion( listaEquiposOrdenadaPorPuntos: EquipoJuegoDeCompeticionLiga[],
                                                equiposDelJuego: Equipo[], jornadasDelJuego: Jornada[],
                                                enfrentamientosDelJuego: EnfrentamientoLiga[][] ): TablaEquipoJuegoDeCompeticion[] {
    const rankingJuegoDeCompeticion: TablaEquipoJuegoDeCompeticion [] = [];
    console.log (' Vamos a preparar la tabla del ranking por equipos de Competición');
    console.log ('la lista de equipos ordenada es: ');
    console.log (listaEquiposOrdenadaPorPuntos);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < listaEquiposOrdenadaPorPuntos.length; i++) {
      let equipo: Equipo;
      const EquipoId = listaEquiposOrdenadaPorPuntos[i].EquipoId;
      equipo = equiposDelJuego.filter(res => res.id === EquipoId)[0];
      rankingJuegoDeCompeticion[i] = new TablaEquipoJuegoDeCompeticion(i + 1, equipo.Nombre,
                                                                       listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo, EquipoId);
    }
    const individual = false;
    const informacionPartidos = this.ObtenerInformaciónPartidos(listaEquiposOrdenadaPorPuntos, jornadasDelJuego,
                                                                individual, enfrentamientosDelJuego);
    console.log('Vamos a rellenar la TablaEquipoJuegoDeCompeticion con la informacionPartidos');
    const rankingJuegoDeCompeticionFinal = this.RellenarTablaEquipoJuegoDeCompeticion(rankingJuegoDeCompeticion, informacionPartidos);
    console.log ('El ranking es: ' );
    console.log (rankingJuegoDeCompeticionFinal);
    return rankingJuegoDeCompeticionFinal;
  }

  public RellenarTablaEquipoJuegoDeCompeticion(rankingJuegoDeCompeticion: TablaEquipoJuegoDeCompeticion[],
                                               informacionPartidos: InformacionPartidosLiga[]): TablaEquipoJuegoDeCompeticion[] {
    console.log();
    for (let cont = 0; cont < rankingJuegoDeCompeticion.length; cont++) {
      rankingJuegoDeCompeticion[cont].partidosTotales = informacionPartidos[cont].partidosTotales;
      rankingJuegoDeCompeticion[cont].partidosJugados = informacionPartidos[cont].partidosJugados;
      rankingJuegoDeCompeticion[cont].partidosGanados = informacionPartidos[cont].partidosGanados;
      rankingJuegoDeCompeticion[cont].partidosEmpatados = informacionPartidos[cont].partidosEmpatados;
      rankingJuegoDeCompeticion[cont].partidosPerdidos = informacionPartidos[cont].partidosPerdidos;
    }
    return rankingJuegoDeCompeticion;
  }

  public RellenarTablaAlumnoJuegoDeCompeticion(rankingJuegoDeCompeticion: TablaAlumnoJuegoDeCompeticion[],
                                               informacionPartidos: InformacionPartidosLiga[]): TablaAlumnoJuegoDeCompeticion[] {
    console.log();
    for (let cont = 0; cont < rankingJuegoDeCompeticion.length; cont++) {
      rankingJuegoDeCompeticion[cont].partidosTotales = informacionPartidos[cont].partidosTotales;
      rankingJuegoDeCompeticion[cont].partidosJugados = informacionPartidos[cont].partidosJugados;
      rankingJuegoDeCompeticion[cont].partidosGanados = informacionPartidos[cont].partidosGanados;
      rankingJuegoDeCompeticion[cont].partidosEmpatados = informacionPartidos[cont].partidosEmpatados;
      rankingJuegoDeCompeticion[cont].partidosPerdidos = informacionPartidos[cont].partidosPerdidos;
    }
    return rankingJuegoDeCompeticion;
  }

  public ObtenerInformaciónPartidos(listaParticipantesOrdenadaPorPuntos, jornadasDelJuego: Jornada[], individual: boolean,
                                    enfrentamientosDelJuego: Array<Array<EnfrentamientoLiga>>): InformacionPartidosLiga[] {
    this.informacionPartidos = [];
    console.log('Estoy en ObtenerInformacionPartidos()');
    const listaInformacionPartidos: InformacionPartidosLiga[] = [];
    const listaEnfrentamientosDelJuego: EnfrentamientoLiga[] = this.ObtenerListaEnfrentamientosDelJuego(jornadasDelJuego,
                                                                                                      enfrentamientosDelJuego);
    if (individual === false) {
        // tslint:disable-next-line:prefer-for-of
      for (let equipo = 0; equipo < listaParticipantesOrdenadaPorPuntos.length; equipo++) {
        const informacionPartido = new InformacionPartidosLiga(listaParticipantesOrdenadaPorPuntos[equipo].EquipoId, 0, 0, 0, 0, 0);
        console.log(informacionPartido);
        informacionPartido.partidosTotales = this.CalcularPartidosTotales(listaEnfrentamientosDelJuego,
                                                                          listaParticipantesOrdenadaPorPuntos, equipo, individual);
        informacionPartido.partidosJugados = this.CalcularPartidosJugados(listaEnfrentamientosDelJuego,
                                                                          listaParticipantesOrdenadaPorPuntos, equipo, individual);
        informacionPartido.partidosGanados = this.CalcularPartidosGanados(listaEnfrentamientosDelJuego,
                                                                          listaParticipantesOrdenadaPorPuntos, equipo, individual);
        informacionPartido.partidosEmpatados = this.CalcularPartidosEmpatados(listaEnfrentamientosDelJuego,
                                                                              listaParticipantesOrdenadaPorPuntos, equipo, individual);
        informacionPartido.partidosPerdidos = this.CalcularPartidosPerdidos(listaEnfrentamientosDelJuego,
                                                                            listaParticipantesOrdenadaPorPuntos, equipo, individual);
        listaInformacionPartidos.push(informacionPartido);
        console.log('Partidos perdidos del participante id ' + listaParticipantesOrdenadaPorPuntos[equipo].EquipoId + 'son: '
                    + informacionPartido.partidosPerdidos);
      }
    } else if (individual === true) {
        // tslint:disable-next-line:prefer-for-of
      for (let alumno = 0; alumno < listaParticipantesOrdenadaPorPuntos.length; alumno++) {
        const informacionPartido = new InformacionPartidosLiga(listaParticipantesOrdenadaPorPuntos[alumno].AlumnoId, 0, 0, 0, 0, 0);
        console.log(informacionPartido);
        informacionPartido.partidosTotales = this.CalcularPartidosTotales(listaEnfrentamientosDelJuego,
                                                                          listaParticipantesOrdenadaPorPuntos, alumno, individual);
        informacionPartido.partidosJugados = this.CalcularPartidosJugados(listaEnfrentamientosDelJuego,
                                                                          listaParticipantesOrdenadaPorPuntos, alumno, individual);
        informacionPartido.partidosGanados = this.CalcularPartidosGanados(listaEnfrentamientosDelJuego,
                                                                          listaParticipantesOrdenadaPorPuntos, alumno, individual);
        informacionPartido.partidosEmpatados = this.CalcularPartidosEmpatados(listaEnfrentamientosDelJuego,
                                                                              listaParticipantesOrdenadaPorPuntos, alumno, individual);
        informacionPartido.partidosPerdidos = this.CalcularPartidosPerdidos(listaEnfrentamientosDelJuego,
                                                                            listaParticipantesOrdenadaPorPuntos, alumno, individual);
        listaInformacionPartidos.push(informacionPartido);
        console.log('Partidos perdidos del participante id ' + listaParticipantesOrdenadaPorPuntos[alumno].AlumnoId + 'son: '
                    + informacionPartido.partidosPerdidos);
      }
    }
    console.log('La listaInformacionPartidos es: ');
    console.log(listaInformacionPartidos);
    return listaInformacionPartidos;
  }

  public ObtenerListaEnfrentamientosDelJuego(jornadasDelJuego: Jornada[], enfrentamientosDelJuego: EnfrentamientoLiga[][]) {
    const listaEnfrentamientosDelJuego: EnfrentamientoLiga[] = [];
    for (let jornada = 0; jornada < jornadasDelJuego.length; jornada++) {
      // tslint:disable-next-line:prefer-for-of
      for ( let enfrentamiento = 0; enfrentamiento < enfrentamientosDelJuego[jornada].length; enfrentamiento++) {
        listaEnfrentamientosDelJuego.push(enfrentamientosDelJuego[jornada][enfrentamiento]);
      }
    }
    console.log('La lista de enfrentamientos del juego es: ');
    console.log(listaEnfrentamientosDelJuego);
    return listaEnfrentamientosDelJuego;
  }


  public CalcularPartidosTotales(listaEnfrentamientosDelJuego: EnfrentamientoLiga[],
                                 listaParticipantesOrdenadaPorPuntos, participante: number, individual): number {
    let partidosTotales = 0;
    if (individual === false) {
      // tslint:disable-next-line:prefer-for-of
      for (let contEnfrentamiento = 0; contEnfrentamiento < listaEnfrentamientosDelJuego.length; contEnfrentamiento++) {
        if (listaParticipantesOrdenadaPorPuntos[participante].EquipoId === listaEnfrentamientosDelJuego[contEnfrentamiento].JugadorUno ||
            listaParticipantesOrdenadaPorPuntos[participante].EquipoId === listaEnfrentamientosDelJuego[contEnfrentamiento].JugadorDos) {
              partidosTotales++;
        }
      }
    } else if (individual === true) {
      // tslint:disable-next-line:prefer-for-of
      for (let contEnfrentamiento = 0; contEnfrentamiento < listaEnfrentamientosDelJuego.length; contEnfrentamiento++) {
        if (listaParticipantesOrdenadaPorPuntos[participante].AlumnoId === listaEnfrentamientosDelJuego[contEnfrentamiento].JugadorUno ||
            listaParticipantesOrdenadaPorPuntos[participante].AlumnoId === listaEnfrentamientosDelJuego[contEnfrentamiento].JugadorDos) {
              partidosTotales++;
        }
      }
    }
    return partidosTotales;
  }

  public CalcularPartidosJugados(listaEnfrentamientosDelJuego: EnfrentamientoLiga[],
                                 listaParticipantesOrdenadaPorPuntos, participante: number, individual): number {
    let partidosJugados = 0;
    if (individual === false) {
      // tslint:disable-next-line:prefer-for-of
      for (let contEnfrentamiento = 0; contEnfrentamiento < listaEnfrentamientosDelJuego.length; contEnfrentamiento++) {
        if (listaParticipantesOrdenadaPorPuntos[participante].EquipoId === listaEnfrentamientosDelJuego[contEnfrentamiento].JugadorUno ||
            listaParticipantesOrdenadaPorPuntos[participante].EquipoId === listaEnfrentamientosDelJuego[contEnfrentamiento].JugadorDos) {

            if (listaEnfrentamientosDelJuego[contEnfrentamiento].Ganador !== undefined) {
              partidosJugados++;
            }
        }
      }
    } else if (individual === true) {
      // tslint:disable-next-line:prefer-for-of
      for (let contEnfrentamiento = 0; contEnfrentamiento < listaEnfrentamientosDelJuego.length; contEnfrentamiento++) {
        if (listaParticipantesOrdenadaPorPuntos[participante].AlumnoId === listaEnfrentamientosDelJuego[contEnfrentamiento].JugadorUno ||
            listaParticipantesOrdenadaPorPuntos[participante].AlumnoId === listaEnfrentamientosDelJuego[contEnfrentamiento].JugadorDos) {

            if (listaEnfrentamientosDelJuego[contEnfrentamiento].Ganador !== undefined) {
              partidosJugados++;
            }
        }
      }
    }
    return partidosJugados;
  }

  public CalcularPartidosGanados(listaEnfrentamientosDelJuego: EnfrentamientoLiga[],
                                 listaEquiposOrdenadaPorPuntos, participante: number, individual): number {
    let partidosGanados = 0;
    if (individual === false) {
      // tslint:disable-next-line:prefer-for-of
      for (let contEnfrentamiento = 0; contEnfrentamiento < listaEnfrentamientosDelJuego.length; contEnfrentamiento++) {
        if (listaEquiposOrdenadaPorPuntos[participante].EquipoId === listaEnfrentamientosDelJuego[contEnfrentamiento].JugadorUno ||
            listaEquiposOrdenadaPorPuntos[participante].EquipoId === listaEnfrentamientosDelJuego[contEnfrentamiento].JugadorDos) {

            if (listaEquiposOrdenadaPorPuntos[participante].EquipoId === listaEnfrentamientosDelJuego[contEnfrentamiento].Ganador) {
              partidosGanados++;
            }
        }
      }
    } else if (individual === true) {
      // tslint:disable-next-line:prefer-for-of
      for (let contEnfrentamiento = 0; contEnfrentamiento < listaEnfrentamientosDelJuego.length; contEnfrentamiento++) {
        if (listaEquiposOrdenadaPorPuntos[participante].AlumnoId === listaEnfrentamientosDelJuego[contEnfrentamiento].JugadorUno ||
            listaEquiposOrdenadaPorPuntos[participante].AlumnoId === listaEnfrentamientosDelJuego[contEnfrentamiento].JugadorDos) {

            if (listaEquiposOrdenadaPorPuntos[participante].AlumnoId === listaEnfrentamientosDelJuego[contEnfrentamiento].Ganador) {
              partidosGanados++;
            }
        }
      }
    }
    return partidosGanados;
  }

  public CalcularPartidosEmpatados(listaEnfrentamientosDelJuego: EnfrentamientoLiga[],
                                   listaParticipantesOrdenadaPorPuntos,
                                   participante: number, individual): number {
    let partidosEmpatados = 0;
    if (individual === false) {
      // tslint:disable-next-line:prefer-for-of
      for (let contEnfrentamiento = 0; contEnfrentamiento < listaEnfrentamientosDelJuego.length; contEnfrentamiento++) {
        if (listaParticipantesOrdenadaPorPuntos[participante].EquipoId === listaEnfrentamientosDelJuego[contEnfrentamiento].JugadorUno ||
        listaParticipantesOrdenadaPorPuntos[participante].EquipoId === listaEnfrentamientosDelJuego[contEnfrentamiento].JugadorDos) {

          if (listaEnfrentamientosDelJuego[contEnfrentamiento].Ganador === 0) {
            partidosEmpatados++;
          }
        }
      }
    } else if (individual === true) {
      // tslint:disable-next-line:prefer-for-of
      for (let contEnfrentamiento = 0; contEnfrentamiento < listaEnfrentamientosDelJuego.length; contEnfrentamiento++) {
        if (listaParticipantesOrdenadaPorPuntos[participante].AlumnoId === listaEnfrentamientosDelJuego[contEnfrentamiento].JugadorUno ||
        listaParticipantesOrdenadaPorPuntos[participante].AlumnoId === listaEnfrentamientosDelJuego[contEnfrentamiento].JugadorDos) {

          if (listaEnfrentamientosDelJuego[contEnfrentamiento].Ganador === 0) {
            partidosEmpatados++;
          }
        }
      }
    }
    return partidosEmpatados;
  }

  public CalcularPartidosPerdidos(listaEnfrentamientosDelJuego: EnfrentamientoLiga[],
                                  listaParticipantesOrdenadaPorPuntos, contEquipo: number, individual): number {
    let partidosPerdidos = 0;
    if (individual === false) {
      // tslint:disable-next-line:prefer-for-of
      for (let contEnfrentamiento = 0; contEnfrentamiento < listaEnfrentamientosDelJuego.length; contEnfrentamiento++) {
        if (listaParticipantesOrdenadaPorPuntos[contEquipo].EquipoId === listaEnfrentamientosDelJuego[contEnfrentamiento].JugadorUno ||
        listaParticipantesOrdenadaPorPuntos[contEquipo].EquipoId === listaEnfrentamientosDelJuego[contEnfrentamiento].JugadorDos) {

          if ((listaEnfrentamientosDelJuego[contEnfrentamiento].Ganador !== 0 &&
              listaEnfrentamientosDelJuego[contEnfrentamiento].Ganador !== undefined) &&
              listaEnfrentamientosDelJuego[contEnfrentamiento].Ganador !== listaParticipantesOrdenadaPorPuntos[contEquipo].EquipoId) {
            partidosPerdidos++;
          }
        }
      }
    } else if (individual === true) {
      // tslint:disable-next-line:prefer-for-of
      for (let contEnfrentamiento = 0; contEnfrentamiento < listaEnfrentamientosDelJuego.length; contEnfrentamiento++) {
        if (listaParticipantesOrdenadaPorPuntos[contEquipo].AlumnoId === listaEnfrentamientosDelJuego[contEnfrentamiento].JugadorUno ||
        listaParticipantesOrdenadaPorPuntos[contEquipo].AlumnoId === listaEnfrentamientosDelJuego[contEnfrentamiento].JugadorDos) {

          if ((listaEnfrentamientosDelJuego[contEnfrentamiento].Ganador !== 0 &&
              listaEnfrentamientosDelJuego[contEnfrentamiento].Ganador !== undefined) &&
              listaEnfrentamientosDelJuego[contEnfrentamiento].Ganador !== listaParticipantesOrdenadaPorPuntos[contEquipo].AlumnoId) {
            partidosPerdidos++;
          }
        }
      }
    }
    return partidosPerdidos;
  }

  // public ObtenerInformaciónPartidos(listaEquiposOrdenadaPorPuntos: EquipoJuegoDeCompeticionLiga[], jornadasDelJuego: Jornada[],
  //                                   enfrentamientosDelJuego: Array<Array<EnfrentamientoLiga>>): InformacionPartidosLiga[] {
  //   console.log('Estoy en ObtenerInformacionPartidos()');
  //   this.informacionPartidos = [];
  //   // tslint:disable-next-line:prefer-for-of
  //   for (let i = 0; i < listaEquiposOrdenadaPorPuntos.length; i++) {
  //     const informacionPartido = new InformacionPartidosLiga(0, 0, 0, 0, 0);
  //     const participantesInspeccionados: number[] = [];
  //     for (let j = 0; j < jornadasDelJuego.length; j++) {
  //       // tslint:disable-next-line:prefer-for-of
  //       for (let m = 0; m < enfrentamientosDelJuego[j].length; m++) {
  //         const participanteInspeccionadoUno = participantesInspeccionados.indexOf(enfrentamientosDelJuego[j][m].JugadorUno);
  //         const participanteInspeccionadoDos = participantesInspeccionados.indexOf(enfrentamientosDelJuego[j][m].JugadorDos);
  //         if (listaEquiposOrdenadaPorPuntos[i].EquipoId === enfrentamientosDelJuego[j][m].JugadorUno &&
  //             participanteInspeccionadoUno === -1) {
  //           console.log('El participante del que vamos a calcular los partidos totales es: ' + enfrentamientosDelJuego[j][m].JugadorUno);
  //           informacionPartido.partidosTotales = this.CalcularPartidosTotales(enfrentamientosDelJuego[j][m].JugadorUno,
  //                                                                             jornadasDelJuego, enfrentamientosDelJuego);
  //           console.log('Los partidosTotales de este son: ' + informacionPartido.partidosTotales);
  //           this.informacionPartidos.push(informacionPartido);
  //           participantesInspeccionados.push(enfrentamientosDelJuego[j][m].JugadorUno);
  //           console.log(listaEquiposOrdenadaPorPuntos);
  //           console.log(informacionPartido);
  //         } else if (listaEquiposOrdenadaPorPuntos[i].EquipoId === enfrentamientosDelJuego[j][m].JugadorDos &&
  //                    participanteInspeccionadoDos === -1) {
  //           console.log('El participante del que vamos a calcular los partidos totales es: ' + enfrentamientosDelJuego[j][m].JugadorUno);
  //           informacionPartido.partidosTotales = this.CalcularPartidosTotales(enfrentamientosDelJuego[j][m].JugadorDos,
  //                                                                             jornadasDelJuego, enfrentamientosDelJuego);
  //           participantesInspeccionados.push(enfrentamientosDelJuego[j][m].JugadorDos);
  //           console.log(listaEquiposOrdenadaPorPuntos);
  //           console.log(informacionPartido);
  //         }
  //       }
  //     }
  //   }
  //   return this.informacionPartidos;
  // }

  // public CalcularPartidosTotales(participante: number, jornadasDelJuego: Jornada[],
  //                                enfrentamientosDelJuego: Array<Array<EnfrentamientoLiga>>): number {
  //   console.log('Estamos en CalcularPartidosTotales() del participante: ' + participante);
  //   let numPartidosTotales = 0;
  //   for (let i = 0; i < jornadasDelJuego.length; i++) {
  //     // tslint:disable-next-line:prefer-for-of
  //     for (let j = 0; j < enfrentamientosDelJuego[i].length; j++) {
  //       if (participante === enfrentamientosDelJuego[i][j].JugadorUno ||
  //           participante === enfrentamientosDelJuego[i][j].JugadorDos) {
  //             numPartidosTotales ++;
  //       }
  //     }
  //   }
  //   console.log('Los partidosTotales son: ' + numPartidosTotales);
  //   return numPartidosTotales;
  // }

  public DameRankingPuntoSeleccionadoEquipos(
    listaEquiposOrdenadaPorPuntos: any,
    equiposDelJuego: any,
    nivelesDelJuego: any,
    puntoSeleccionadoId: any
  ): any {

    const rankingObservable = new Observable ( obs => {

      let rankingEquiposJuegoDePuntos: any[] = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < listaEquiposOrdenadaPorPuntos.length; i ++) {

        let equipo: Equipo;
        let nivel: Nivel;
        // Busca equipo
        equipo = equiposDelJuego.filter(res => res.id === listaEquiposOrdenadaPorPuntos[i].equipoId)[0];

        if (listaEquiposOrdenadaPorPuntos[i].nivelId !== undefined) {
          nivel = nivelesDelJuego.filter(res => res.id === listaEquiposOrdenadaPorPuntos[i].nivelId)[0];
        }

        this.peticionesAPI.DameHistorialDeUnPuntoEquipo(listaEquiposOrdenadaPorPuntos[i].id, puntoSeleccionadoId)
        .subscribe(historial => {

          let puntos = 0;
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < historial.length; j ++) {
            puntos = puntos + historial[j].ValorPunto;
          }


          if (nivel !== undefined) {
            rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
              puntos, nivel.Nombre);
          } else {
            rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
              puntos);
          }

          if (i === listaEquiposOrdenadaPorPuntos.length - 1 ) {
            // tslint:disable-next-line:only-arrow-functions
            rankingEquiposJuegoDePuntos = rankingEquiposJuegoDePuntos.sort(function(obj1, obj2) {
              return obj2.puntos - obj1.puntos;
            });
            obs.next (rankingEquiposJuegoDePuntos);
          }
        });
      }
    });
    return rankingObservable;
  }

  public DameRankingPuntoSeleccionadoAlumnos(
                            listaAlumnosOrdenadaPorPuntos: any,
                            alumnosDelJuego: any,
                            nivelesDelJuego: any,
                            puntoSeleccionadoId: any): any {
    const rankingObservable = new Observable ( obs => {

      let rankingJuegoDePuntos: any[] = [];

      console.log ('Dentro ranking2 ');
      console.log ('Recorremos los ' + listaAlumnosOrdenadaPorPuntos.length);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < listaAlumnosOrdenadaPorPuntos.length; i ++) {
        console.log ('alumno ' + i);

        let alumno: Alumno;
        let nivel: Nivel;

        // Busco al alumno
        alumno = alumnosDelJuego.filter(res => res.id === listaAlumnosOrdenadaPorPuntos[i].alumnoId)[0];
        console.log ('nombre ' + alumno.Nombre);

        if (listaAlumnosOrdenadaPorPuntos[i].nivelId !== undefined) {
          console.log(listaAlumnosOrdenadaPorPuntos[i].alumnoId);
          // Busco el nivel
          nivel = nivelesDelJuego.filter(res => res.id === listaAlumnosOrdenadaPorPuntos[i].nivelId)[0];
        }

        this.peticionesAPI.DameHistorialDeUnPunto(listaAlumnosOrdenadaPorPuntos[i].id, puntoSeleccionadoId)
        .subscribe(historial => {
          let puntos = 0;
          console.log (alumno.Nombre + ' tieme ' + historial.length + 'asignaciones');
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < historial.length; j ++) {
            puntos = puntos + historial[j].ValorPunto;
          }
          console.log ('Puntos ' + puntos);

          if (nivel !== undefined) {
            // tslint:disable-next-line:max-line-length
            rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
              puntos, nivel.Nombre);
          } else {
            // tslint:disable-next-line:max-line-length
            rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
              puntos);
          }

          if (i === listaAlumnosOrdenadaPorPuntos.length - 1 ) {
            console.log ('vamos a acabar');
            // tslint:disable-next-line:only-arrow-functions
            rankingJuegoDePuntos = rankingJuegoDePuntos.sort(function(obj1, obj2) {
              return obj2.puntos - obj1.puntos;
            });
            obs.next (rankingJuegoDePuntos);
        }

        });
      }
    });
    return rankingObservable;
  }
  // ESTA FUNCIÓN NOS DA DOS LISTA, UNA CON LOS ALUMNOS DEL GRUPO CON EQUIPO Y
  // OTRA CON LOS QUE NO TIENEN EQUIPO
  public DameListasAlumnosConYSinEquipo(equipo: Equipo, alumnosGrupo: Alumno[]): any {
    const listasObservables = new Observable ( obs => {
      this.peticionesAPI.DameAsignacionesEquipoDelGrupo(equipo.grupoId)
      .subscribe(asignaciones => {
        console.log ('Asignaciones equipo ' + equipo.id);
        console.log (asignaciones);
        let asignacionesEquipo: any[];
        const alumnosConEquipo: Alumno[] = [];
        const alumnosSinEquipo: Alumno[] = [];

        if (asignaciones [0] !== undefined) {
          // cuando recibimos las asignaciones las metemos en su lista
          asignacionesEquipo = asignaciones;
        }
        console.log ('Alumnos del grupo: ' + alumnosGrupo);
        // Ahora preparamos dos listas, una de alumnos con equipo y otra de alumnos sin equipo
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < alumnosGrupo.length; i++) {

          // PRIMERO MIRAMOS SI HAY ALGUNA ASIGNACIÓN HECHA EN ESTE GRUPO O NO. SI NO HAY NINGUNA ASIGNACIÓN A NINGÚN EQUIPO HECHA
          // SIGNIFICA QUE TODOS LOS ALUMNOS DEL GRUPO PUEDEN METERSE EN CUALQUIER EQUIPO. SERÍA ILÓGICO BUSCAR EN ALGO VACÍO
          if (asignacionesEquipo != null) {
            // EN CASO DE TENER ASIGNADO UN EQUIPO (TRUE) LO INCLUIMOS EN LA LISTA DE ALUMNOS CON EQUIPO
            if (asignacionesEquipo.filter(res => res.alumnoId === alumnosGrupo[i].id)[0] !== undefined) {
              alumnosConEquipo.push(alumnosGrupo[i]);
              // SI NO ESTA ASIGNADO TODAVIDA A NINGÚN EQUIPO, LO PONEMOS EN LA LISTA DE ALUMNOS SIN EQUIPO
            } else  {
              alumnosSinEquipo.push(alumnosGrupo[i]);
            }
          // SI NO HAY NINGUNA ASIGNACIÓN HECHA SIGNIFICA QUE TODOS LOS ALUMNOS DEL GRUPO ESTAN SIN EQUIPO
          } else {
            alumnosSinEquipo.push(alumnosGrupo[i]);
          }
        }
        const resultado = { con: alumnosConEquipo, sin: alumnosSinEquipo};
        obs.next (resultado);
      });
    });
    console.log ('Id Equipo ' + equipo.id);
    return listasObservables;
  }


  public DameSiguienteNivel(nivelesDelJuego: Nivel[], nivel: Nivel): Nivel {
  // Retorna el nivel siguiente al que me dan, o undefined si el que me dan es el máximo
    const pos = nivelesDelJuego.indexOf (nivel);
    if (pos === nivelesDelJuego.length - 1) {
      return undefined;
    } else {
      return nivelesDelJuego[pos + 1];
    }
  }

private DameNivelId( nivelesDelJuego: Nivel[], puntos: number): number {
  let i = 0;
  let encontrado = false;
  while ((i < nivelesDelJuego.length) && !encontrado) {
    if (nivelesDelJuego[i].PuntosAlcanzar > puntos) {
          encontrado = true;
          console.log ('encontrado');
    } else {
          i = i + 1;
    }
  }
  if (!encontrado) {
    console.log ('no encontrado');
    // Tiene el nivel máximo
    return nivelesDelJuego[nivelesDelJuego.length - 1].id;
  } else if (i > 0) {
    return nivelesDelJuego[i - 1].id;
  } else {
    return undefined;
  }
}

// // Me da la posición que ocupa en el vector de niveles
// private DameNivelPos( nivelesDelJuego: Nivel[], puntos: number): number {
//   let i = 0;
//   let encontrado = false;
//   while ((i < nivelesDelJuego.length) && !encontrado) {
//     if (nivelesDelJuego[i].PuntosAlcanzar > puntos) {
//           encontrado = true;
//           console.log ('encontrado');
//     } else {
//           i = i + 1;
//     }
//   }
//   if (!encontrado) {
//     console.log ('no encontrado');
//     // Tiene el nivel máximo
//     return nivelesDelJuego.length - 1;
//   } else if (i > 0) {
//     return i - 1;
//   } else {
//     return undefined;
//   }
// }


public BorrarPunto(   punto: TablaHistorialPuntosAlumno, alumnoJuegoDePuntos: any,
                      nivelesDelJuego: Nivel[]) {

   alumnoJuegoDePuntos.PuntosTotalesAlumno = alumnoJuegoDePuntos.PuntosTotalesAlumno - punto.valorPunto;
   if ((nivelesDelJuego !== undefined) && (nivelesDelJuego.length !== 0)) {
     // calculamos el nuevo nivel
     console.log ('calculo nuevo nivel ' + nivelesDelJuego.length);
     const nivelId = this.DameNivelId (nivelesDelJuego, alumnoJuegoDePuntos.PuntosTotalesAlumno );
     alumnoJuegoDePuntos.nivelId = nivelId;
   }
   this.peticionesAPI.PonPuntosJuegoDePuntos(alumnoJuegoDePuntos, alumnoJuegoDePuntos.id).
   subscribe ();
   this.peticionesAPI.BorrarPuntosAlumno(punto.historialId).subscribe();
  }

  //  console.log ('EN calculos ' + alumnoSeleccionado.id);
  //  console.log ('EN calculos ' + alumnoJuegoDePuntos);
  //  const resultadoObservable = new Observable ( obs => {

  //   console.log(punto);
  //   this.peticionesAPI.BorrarPuntosAlumno(punto.historialId).subscribe();

  //   // Buscamos los nuevos puntos
  //   let nuevosPuntos: number;
  //   nuevosPuntos = (Number(alumnoJuegoDePuntos.PuntosTotalesAlumno) - Number(punto.valorPunto));
  //   console.log(nuevosPuntos);
  //   alumnoJuegoDePuntos.PuntosTotalesAlumno = nuevosPuntos;
  //   console.log('Borro los puntos y miro que puntos totales tengo');

  //   // Comprobamos si subimos de nivel o no
  //   // tslint:disable-next-line:curly
  //   if (nivel !== undefined) {
  //     if (nuevosPuntos < nivel.PuntosAlcanzar) {
  //       if (nivel !== undefined) {
  //         console.log('Voy a bajar de nivel');
  //         siguienteNivel = nivel;
  //         nivel = this.DameNivelAnterior(nivelesDelJuego, nivel.id);
  //       }

  //     } else {
  //       console.log('mantengo el nivel');
  //     }
  //   }
  //   console.log ('EN calculos ' + alumnoJuegoDePuntos);

  //   console.log('Voy a editar la base de datos y actualizar la tabla');
  //   if (nivel !== undefined) {
  //     this.peticionesAPI.PonPuntosJuegoDePuntos( new AlumnoJuegoDePuntos(alumnoSeleccionado.id, juegoSeleccionado.id,
  //       nuevosPuntos, nivel.id), alumnoJuegoDePuntos.id).subscribe(res => {
  //         console.log(res);
  //        // alumnoJuegoDePuntos = res;
  //         console.log ('EN calculos 1 ' + alumnoJuegoDePuntos);
  //         const resultado = {alumno: alumnoJuegoDePuntos, n: nivel, sn: siguienteNivel};
  //         obs.next (resultado);
  //    //     this.MostrarHistorialSeleccionado();
  //       });
  //   } else {
  //     this.peticionesAPI.PonPuntosJuegoDePuntos( new AlumnoJuegoDePuntos(alumnoSeleccionado.id, juegoSeleccionado.id,
  //       nuevosPuntos), alumnoJuegoDePuntos.id).subscribe(res => {
  //         console.log(res);
  //         console.log ('EN calculos 2 ' + alumnoJuegoDePuntos);
  //         const resultado = {alumno: alumnoJuegoDePuntos, n: nivel, sn: siguienteNivel};
  //         obs.next (resultado);
  //         //MostrarHistorialSeleccionado();
  //       });
  //   }
  //  });
  //  return resultadoObservable;

  // }

public BorrarPuntoEquipo( punto: TablaHistorialPuntosEquipo, equipoJuegoDePuntos: any,
                          nivelesDelJuego: Nivel[]) {

    equipoJuegoDePuntos.PuntosTotalesEquipo = equipoJuegoDePuntos.PuntosTotalesEquipo - punto.valorPunto;
    if (nivelesDelJuego !== undefined) {
        // calculamos el nuevo nivel
        console.log ('calculo nuevo nivel ');
        const nivelId = this.DameNivelId (nivelesDelJuego, equipoJuegoDePuntos.PuntosTotalesEquipo );
        equipoJuegoDePuntos.nivelId = nivelId;
    }
    this.peticionesAPI.PonPuntosEquiposJuegoDePuntos(equipoJuegoDePuntos, equipoJuegoDePuntos.id).
    subscribe ();
    this.peticionesAPI.BorraPuntosEquipo(punto.historialId).subscribe();
}

  // public BorrarPuntoEquipo2(
  //     equipoJuegoDePuntos: any,
  //     punto: TablaHistorialPuntosEquipo,
  //     nivel: any,
  //     siguienteNivel: any,
  //     juegoSeleccionado: any,
  //     equipoSeleccionado: any,
  //     nivelesDelJuego: any,
  //     ): any {
  //   const resultadoObservable = new Observable ( obs => {

  //     console.log(punto);

  //     // Buscamos los nuevos puntos
  //     let nuevosPuntos: number;
  //     nuevosPuntos = (Number(equipoJuegoDePuntos.PuntosTotalesEquipo) - Number(punto.valorPunto));
  //     console.log(nuevosPuntos);
  //     equipoJuegoDePuntos.PuntosTotalesEquipo = nuevosPuntos;

  //     this.peticionesAPI.BorraPuntosEquipo(punto.historialId).subscribe();



  //     console.log('Borro los puntos y miro que puntos totales tengo');

  //     // Comprobamos si subimos de nivel o no
  //     // tslint:disable-next-line:curly
  //     if (nivel !== undefined) {
  //       if (nuevosPuntos < nivel.PuntosAlcanzar) {
  //         if (nivel !== undefined) {
  //           console.log('Voy a bajar de nivel');
  //           siguienteNivel = nivel;
  //           nivel = this.DameNivelAnterior(nivelesDelJuego, nivel.id);
  //         }

  //       } else {
  //         console.log('mantengo el nivel');
  //       }
  //     }

  //     console.log('Voy a editar la base de datos y actualizar la tabla');
  //     if (nivel !== undefined) {
  //       this.peticionesAPI.PonPuntosEquiposJuegoDePuntos( new EquipoJuegoDePuntos(equipoSeleccionado.id,
  //         juegoSeleccionado.id, nuevosPuntos, nivel.id), equipoJuegoDePuntos.id).subscribe(res => {
  //           console.log(res);
  //           const resultado = {equipo: res, n: nivel, sn: siguienteNivel};
  //           obs.next (resultado);

  //         });
  //     } else {
  //       this.peticionesAPI.PonPuntosEquiposJuegoDePuntos( new EquipoJuegoDePuntos(equipoSeleccionado.id,
  //         juegoSeleccionado.id, nuevosPuntos), equipoJuegoDePuntos.id).subscribe(res => {
  //           console.log(res);
  //           const resultado = {equipo: res, n: nivel, sn: siguienteNivel};
  //           obs.next (resultado);
  //         });
  //     }
  //   });
  //   return resultadoObservable;

  // }



  // public DameNivelAnteriorRRRRRRR(nivelesDelJuego: any, nivelId: number): Nivel {

  //   // tslint:disable-next-line:no-inferrable-types
  //   let encontrado: boolean = false;
  //   let i = 0;
  //   while ((i < nivelesDelJuego.length) && (encontrado === false)) {

  //     if (nivelesDelJuego[i].id === nivelId) {
  //       encontrado = true;
  //     }
  //     i = i + 1;
  //   }
  //   if (i >= 2) {
  //     return nivelesDelJuego[i - 2];
  //     console.log('punto plata o mas');
  //   } else {
  //     return undefined;
  //     console.log('punto bronce');
  //   }

  // }
  // public PorcentajeEquipo(

  //   nivel: any,
  //   equipoJuegoDePuntos: any,
  //   nivelesDelJuego: any,
  //   siguienteNivel

  // ): number {

  //   let porcentaje: number;
  //   if (nivel !== undefined) {
  //     // Si no estoy en el útlimo nivel, busco el porcentaje. Sino el porcentaje es 1.
  //     if (equipoJuegoDePuntos.nivelId !== nivelesDelJuego[nivelesDelJuego.length - 1].id) {
  //       porcentaje = (equipoJuegoDePuntos.PuntosTotalesEquipo - nivel.PuntosAlcanzar) /
  //       (siguienteNivel.PuntosAlcanzar - nivel.PuntosAlcanzar);

  //     } else {
  //       porcentaje = 1;
  //     }

  //   } else {
  //     porcentaje = (equipoJuegoDePuntos.PuntosTotalesEquipo - 0) / (siguienteNivel.PuntosAlcanzar - 0);
  //   }

  //   return porcentaje;
  // }

  // public Porcentaje(nivel: any, siguienteNivel: any, alumnoJuegoDePuntos: any, nivelesDelJuego: any): number {

  //   let porcentaje: number;

  //   if (nivel !== undefined) {
  //     // Si no estoy en el útlimo nivel, busco el porcentaje. Sino el porcentaje es 1.
  //     if (alumnoJuegoDePuntos.nivelId !== nivelesDelJuego[nivelesDelJuego.length - 1].id) {
  //       porcentaje = (alumnoJuegoDePuntos.PuntosTotalesAlumno - nivel.PuntosAlcanzar) /
  //       (siguienteNivel.PuntosAlcanzar - nivel.PuntosAlcanzar);
  //       console.log('no estoy en el ultimo nivel');

  //     } else {
  //       porcentaje = 1;
  //     }

  //   } else {
  //     console.log('El sigueinte nivel es el primero');

  //     porcentaje = (alumnoJuegoDePuntos.PuntosTotalesAlumno - 0) / (siguienteNivel.PuntosAlcanzar - 0);
  //   }

  //   return porcentaje;
  // }

  // ESTA FUNCION DEVUELVE DOS LISTAS
  // NO ME GUSTA PORQUE LA DE RANKING INDIVIDUAL DEVUELVE SOLO UNA
  // HAY QUE PENSAR COMO SIMPLIFICAR ESTO DE LAS LISTAS Y LOS RANKINGS
  public PrepararTablaRankingEquipos(
    listaEquiposOrdenadaPorPuntos: any,
    equiposDelJuego: any,
    nivelesDelJuego: any,

  ): any {
  const rankingEquiposJuegoDePuntos: any[] = [];
  // const rankingEquiposJuegoDePuntosTotal: any [] = [];
  for (let i = 0; i < listaEquiposOrdenadaPorPuntos.length; i++) {
    console.log ('Bucle principal');
    let equipo: Equipo;
    let nivel: Nivel;
    equipo = equiposDelJuego.filter(res => res.id === listaEquiposOrdenadaPorPuntos[i].equipoId)[0];

    if (listaEquiposOrdenadaPorPuntos[i].nivelId !== undefined) {
      console.log(listaEquiposOrdenadaPorPuntos[i].equipoId);
      nivel = nivelesDelJuego.filter(res => res.id === listaEquiposOrdenadaPorPuntos[i].nivelId)[0];
      console.log(listaEquiposOrdenadaPorPuntos[i].nivelId);
    }

    if (nivel !== undefined) {
        rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
          listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo, nivel.Nombre);

        // rankingEquiposJuegoDePuntosTotal[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
        //     listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo, nivel.Nombre);
    } else {
        rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
            listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo);

        // rankingEquiposJuegoDePuntosTotal[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
        //     listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo);
    }
  }

  // const resultado = {
  //                       ranking: rankingEquiposJuegoDePuntos,
  //                       rankingTotal: rankingEquiposJuegoDePuntosTotal
  // };
  return rankingEquiposJuegoDePuntos;
}


public AsignarPuntosAlumno(
  alumno: AlumnoJuegoDePuntos,
  nivelesDelJuego: Nivel[],
  puntosNuevos: any,
  puntoSeleccionadoId: any,
) {

      alumno.PuntosTotalesAlumno = alumno.PuntosTotalesAlumno + puntosNuevos;
      if (nivelesDelJuego.length > 0 ) {
        const nivelId = this.DameNivelId (nivelesDelJuego, alumno.PuntosTotalesAlumno );
        alumno.nivelId = nivelId;
      }
      this.peticionesAPI.PonPuntosJuegoDePuntos(alumno, alumno.id).
      subscribe ();
      const fechaAsignacionPunto = new Date();
      const fechaString = fechaAsignacionPunto.toLocaleDateString() + '  ' + fechaAsignacionPunto.toLocaleTimeString();
      // tslint:disable-next-line:max-line-length
      this.peticionesAPI.PonHistorialPuntosAlumno(new HistorialPuntosAlumno (puntosNuevos, puntoSeleccionadoId, alumno.id, fechaString))
          // tslint:disable-next-line:no-shadowed-variable
      .subscribe(res => console.log(res));
}


public AsignarPuntosEquipo(
  equipo: EquipoJuegoDePuntos,
  nivelesDelJuego: Nivel[],
  puntosNuevos: any,
  puntoSeleccionadoId: any,
) {

      equipo.PuntosTotalesEquipo = equipo.PuntosTotalesEquipo + puntosNuevos;
      if (nivelesDelJuego.length > 0 ) {
        const nivelId = this.DameNivelId (nivelesDelJuego, equipo.PuntosTotalesEquipo );
        equipo.nivelId = nivelId;
      }
      this.peticionesAPI.PonPuntosEquiposJuegoDePuntos(equipo, equipo.id).
      subscribe ();
      const fechaAsignacionPunto = new Date();
      const fechaString = fechaAsignacionPunto.toLocaleDateString() + '  ' + fechaAsignacionPunto.toLocaleTimeString();
      // tslint:disable-next-line:max-line-length
      this.peticionesAPI.PonHistorialPuntosEquipo(new HistorialPuntosEquipo (puntosNuevos, puntoSeleccionadoId, equipo.id, fechaString))
          // tslint:disable-next-line:no-shadowed-variable
      .subscribe(res => console.log(res));
}


public PreparaHistorialEquipo(
  equipoJuegoDePuntos: any,
  tiposPuntosDelJuego: any,
): any {
  const historialObservable = new Observable ( obs => {

    let historial = [];

    this.peticionesAPI.DameHistorialPuntosEquipo(equipoJuegoDePuntos.id)
    .subscribe(his => {

      if (his[0] !== null) {
        for (let i = 0; i < his.length; i++) {
          console.log('voy ' + i);
          const punto = tiposPuntosDelJuego.filter(res => res.id === his[i].puntoId)[0];

          historial[i] = new TablaHistorialPuntosEquipo (punto.Nombre,
          punto.Descripcion, his[i].ValorPunto, his[i].fecha,
          his[i].equipoJuegoDePuntosId, his[i].id, his[i].puntoId);
        }
      } else {
        historial = undefined;
      }
      historial = historial.filter(res => res.nombre !== '');
      obs.next (historial);
    });
  });
  return historialObservable;
}


  public Prueba(profesorId): any {
    const gruposObservable = new Observable ( obs => {
        this.peticionesAPI.DameGruposProfesor(profesorId)
        .subscribe(res => {
          if (res[0] !== undefined) {
            obs.next (res.slice (0, 2));
          } else {
            obs.next (undefined);
          }
      });
    });
    return gruposObservable;
  }


  private randomIndex(
    probabilities: number[],
    randomGenerator: () => number = Math.random): number {

      // get the cumulative distribution function
      let acc = 0;
      const cdf = probabilities
          .map(v => acc += v) // running total [4,7,9,10]
          .map(v => v / acc); // normalize to max 1 [0.4,0.7,0.9,1]

      // pick a random number between 0 and 1
      const randomNumber = randomGenerator();

      // find the first index of cdf where it exceeds randomNumber
      // (findIndex() is in ES2015+)
      return cdf.findIndex(p => randomNumber < p);
  }

  public AsignarCromosAleatoriosAlumno(
    alumno: Alumno,
    inscripcionesAlumnos: any,
    numeroCromosRandom: number,
    probabilidadCromos: any,
    cromosColeccion: any,

  ) {
    let alumnoJuegoDeColeccion: AlumnoJuegoDeColeccion;
    alumnoJuegoDeColeccion = inscripcionesAlumnos.filter(res => res.alumnoId === alumno.id)[0];
    console.log(alumnoJuegoDeColeccion);

    // tslint:disable-next-line:prefer-const
    // let hits = this.probabilidadCromos.map(x => 0);


    for (let k = 0; k < numeroCromosRandom; k++) {

      console.log('Voy a hacer el post del cromo ' + k);

      const indexCromo = this.randomIndex(probabilidadCromos);
      // hits[this.indexCromo]++;


      this.peticionesAPI.AsignarCromoAlumno(new Album (alumnoJuegoDeColeccion.id,
        cromosColeccion[indexCromo].id)).subscribe(res => {

        // this.selection.clear();
        // this.selectionEquipos.clear();
        // this.isDisabled = true;
        // this.seleccionados = Array(this.alumnosDelJuego.length).fill(false);
      });
    }

  }

  public AsignarCromosAleatoriosEquipo(
      equipo: Equipo,
      inscripcionesEquipos: any,
      numeroCromosRandom: number,
      probabilidadCromos: any,
      cromosColeccion: any
  ) {
    let equipoJuegoDeColeccion: EquipoJuegoDeColeccion;
    equipoJuegoDeColeccion = inscripcionesEquipos.filter(res => res.equipoId === equipo.id)[0];
    console.log(equipoJuegoDeColeccion);

    for (let k = 0; k < numeroCromosRandom; k++) {

      console.log('Voy a hacer el post del cromo ' + k);

      const indexCromo = this.randomIndex(probabilidadCromos);

      this.peticionesAPI.AsignarCromoEquipo(new AlbumEquipo (equipoJuegoDeColeccion.id,
        cromosColeccion[indexCromo].id)).subscribe(res => {

        console.log(res);

      });
    }

  }

  // Esta función recibe una lista de cromos en la que puede haber repetidos
  // y geneera otra en la que cada cromo aparece una sola vez y se le asocia el número
  // de veces que aparece reperido en la lista de entrada
  GeneraListaSinRepetidos(listaCromos: Cromo []): any [] {
    const listaCromosSinRepetidos: any [] = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < listaCromos.length; i++) {
      const n = listaCromos.filter (cromo => cromo.Nombre === listaCromos[i].Nombre).length;
      if (listaCromosSinRepetidos.filter (res => res.cromo.Nombre === listaCromos[i].Nombre).length === 0) {
        listaCromosSinRepetidos.push ({rep: n, cromo: listaCromos[i]});
      }
    }
    return listaCromosSinRepetidos;
  }

  public CrearJornadasLiga(NumeroDeJornadas, juegoDeCompeticionID) {
    for (let i = 1; i <= NumeroDeJornadas; i++) {
      // tslint:disable-next-line:max-line-length '2000-01-01T01:01:01.000Z'
      const jornada = new Jornada(undefined, 'Pendiente de determinar', juegoDeCompeticionID);
      console.log(jornada);
      this.peticionesAPI.CrearJornadasLiga(jornada, juegoDeCompeticionID)
      .subscribe(jornadacreada => {
        console.log('jornada creada');
        console.log(jornadacreada);
      });
    }
  }

  public DameTablaJornadasLiga( juegoSeleccionado, jornadas) {
  const TablaJornada: TablaJornadas [] = [];

  // tslint:disable-next-line:prefer-for-of
  console.log('3 Vamos a llenar la tabla');
  console.log(jornadas);
  console.log(juegoSeleccionado);
  for (let i = 0; i < juegoSeleccionado.NumeroTotalJornadas; i++) {
  let jornada: Jornada;
  const jornadaId = jornadas[i].id;
  jornada = jornadas.filter(res => res.id === jornadaId)[0];

  if (jornada.Fecha === undefined) {
      TablaJornada[i] = new TablaJornadas (i + 1, 'Fecha por Determinar', jornada.CriterioGanador, jornada.id);
      console.log(TablaJornada[i]);
    } else {
      TablaJornada[i] = new TablaJornadas (i + 1, jornada.Fecha, jornada.CriterioGanador, jornada.id);
      console.log(TablaJornada[i]);
    }
  }
  return(TablaJornada);
  }

 public FormarEquiposAleatorios(individuos: any[], tamEquipos: number): any[] {
    const listaInicial = individuos;
    const numeroGrupos = Math.ceil(listaInicial.length / tamEquipos);
    console.log ('Tamaño ' + tamEquipos);

    console.log ('Numero de grupos ' + numeroGrupos);
    const equipos: any [] = [];
    for (let i = 0; i < numeroGrupos - 1; i++) {
      console.log ('grupo ' + i);
      const equipo: any[] = [];
      for (let j = 0; j < tamEquipos; j++) {
        const n = Math.floor(Math.random() * listaInicial.length);
        console.log (n + ' ' + listaInicial[n]);
        equipo.push (listaInicial[n]);
        listaInicial.splice (n , 1);
      }
      equipos.push (equipo);
    }
    equipos.push (listaInicial);
    return equipos;
  }

}

import { Injectable } from '@angular/core';
import { SesionService, PeticionesAPIService } from './index';
import {
  Grupo, Equipo, Juego, Alumno, Nivel, TablaAlumnoJuegoDePuntos, TablaHistorialPuntosAlumno, AlumnoJuegoDePuntos,
  TablaEquipoJuegoDePuntos, HistorialPuntosAlumno, HistorialPuntosEquipo, EquipoJuegoDePuntos, TablaHistorialPuntosEquipo,
  AlumnoJuegoDeColeccion, Album, Coleccion, EquipoJuegoDeColeccion, AlbumEquipo, Cromo, TablaJornadas, TablaAlumnoJuegoDeCompeticion,
  TablaEquipoJuegoDeCompeticion, Jornada, EquipoJuegoDeCompeticionLiga, EnfrentamientoLiga, InformacionPartidosLiga,
  AlumnoJuegoDeCompeticionLiga, AlumnoJuegoDeCompeticionFormulaUno, EquipoJuegoDeCompeticionFormulaUno,
  // tslint:disable-next-line:max-line-length
  TablaClasificacionJornada, TablaPuntosFormulaUno, AlumnoJuegoDeVotacionUnoATodos, TablaAlumnoJuegoDeVotacionUnoATodos,
  AlumnoJuegoDeVotacionTodosAUno, TablaAlumnoJuegoDeVotacionTodosAUno, JuegoDeVotacionTodosAUno, FamiliaAvatares, Pregunta,
  AlumnoJuegoDeCuestionario, TablaAlumnoJuegoDeCuestionario, AlumnoJuegoDeGeocaching, TablaAlumnoJuegoDeGeocaching, Evento, Profesor, Punto
} from '../clases/index';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { calcPossibleSecurityContexts } from '@angular/compiler/src/template_parser/binding_parser';

import Swal from 'sweetalert2';
import { isNullOrUndefined } from 'util';

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
  rondas: Array<Array<EnfrentamientoLiga>>;
  informacionPartidos: InformacionPartidosLiga[];
  jornadasnuevas: Jornada[];
  TablaeditarPuntos: TablaPuntosFormulaUno[];
  AlumnoJuegoDeCompeticionLigaId: number;
  EquipoJuegoDeCompeticionLigaId: number;
  empateAsignado = 0;

  constructor(
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService
  ) { }


  // Elimina el grupo (tanto el id del profe como del grupo estan en sesión).
  // Lo hago con un observable para que el componente que muestra la lista de grupos
  // espere hasta que se haya acabado la operacion de borrar el grupo de la base de datos
  public EliminarGrupo(): any {
    const eliminaObservable = new Observable(obs => {
      // Las siguientes funciones retornan observables para que pueda esperar a que acaben
      // antes de continuar borrando cosas.
      console.log('Empezamos el proceso de eliminación del grupo');
      this.EliminarMatriculas()
        .subscribe(() => this.EliminarSesionesClase()
          .subscribe(() => this.EliminaJuegos()
            .subscribe(() => {
              console.log('Ya voy a borrar el grupo');
              this.peticionesAPI.BorraGrupo(
                this.sesion.DameProfesor().id,
                this.sesion.DameGrupo().id)
                .subscribe(() => {
                  // Ahora elimino el grupo de la lista de grupos para que desaparezca de la pantalla al regresar
                  console.log('Eliminamos grupo de la lista');
                  let lista = this.sesion.DameListaGrupos();
                  lista = lista.filter(g => g.id !== this.sesion.DameGrupo().id);
                  obs.next();
                });
            })));
    });
    return eliminaObservable;
  }

  // Esta función genera un observable para avisar al que suscriba de cuándo se ha completado
  private EliminaJuegos(): any {
    const eliminaJuegosObservable = new Observable(obs => {
      console.log('Vamos a borrar los juegos');
      this.DameListaJuegos(this.sesion.DameGrupo().id)
        .subscribe(listas => {
          // Hago una lista con todos los juegos (activos e inactivos)
          const juegos = listas.activos.concat(listas.inactivos);
          console.log('Ya tengo los juegos');
          console.log(juegos);
          let cont = 0;
          if (juegos[0] !== undefined) {
            juegos.forEach(juego => {
              if (juego.Tipo === 'Juego De Puntos') {
                // Primero borramos las inscripciones de alumnos o equipos
                if (juego.Modo === 'Individual') {
                  console.log('Juego de puntos individual');
                  this.peticionesAPI.DameInscripcionesAlumnoJuegoDePuntos(juego.id)
                    // tslint:disable-next-line:max-line-length
                    .subscribe(inscripciones => inscripciones.forEach(inscripcion => {
                      // Borro los historiales de puntos de ese alumno
                      this.peticionesAPI.DameHistorialPuntosAlumno(inscripcion.id)
                        // tslint:disable-next-line:max-line-length
                        .subscribe(historiales => historiales.forEach(historial => this.peticionesAPI.BorrarPuntosAlumno(historial.id).subscribe()));
                      // Borro la inscripcion del alumno
                      this.peticionesAPI.BorraInscripcionAlumnoJuegoDePuntos(inscripcion.id).subscribe();
                    }));
                } else {
                  this.peticionesAPI.DameInscripcionesEquipoJuegoDePuntos(juego.id)
                    // tslint:disable-next-line:max-line-length
                    .subscribe(inscripciones => inscripciones.forEach(inscripcion => {
                      // Borro los historiales de puntos de ese equipo
                      this.peticionesAPI.DameHistorialPuntosEquipo(inscripcion.id)
                        // tslint:disable-next-line:max-line-length
                        .subscribe(historiales => historiales.forEach(historial => this.peticionesAPI.BorraPuntosEquipo(historial.id).subscribe()));
                      // Borro la inscripcion del equipo
                      this.peticionesAPI.BorraInscripcionEquipoJuegoDePuntos(inscripcion.id).subscribe();
                    }));
                }
                // Ahora borramos las asignaciones de puntos
                this.peticionesAPI.DamePuntosJuego(juego.id)
                  .subscribe(puntos => puntos.forEach(punto => this.peticionesAPI.BorraPuntoJuego(punto.id).subscribe()));
                // y los niveles e imagenes
                this.peticionesAPI.DameNivelesJuego(juego.id)
                  .subscribe(niveles => niveles.forEach(nivel => {
                    this.peticionesAPI.BorraNivel(nivel.id).subscribe();
                    if (nivel.Imagen !== undefined) {
                      this.peticionesAPI.BorraImagenNivel(nivel.Imagen).subscribe();
                    }
                  }));
                // Ahora borramos el juego
                this.peticionesAPI.BorraJuegoDePuntos(juego.id)
                  .subscribe(() => {
                    cont++;
                    if (cont === juegos.length) {
                      obs.next();
                    }
                  });
              } else if (juego.Tipo === 'Juego De Colección') {
                if (juego.Modo === 'Individual') {
                  console.log('borro juego de coleccion individual');
                  this.peticionesAPI.DameInscripcionesAlumnoJuegoDeColeccion(juego.id)
                    .subscribe(inscripciones => inscripciones.forEach(inscripcion => {
                      // Para cada alumno inscrito tengo que traer los cromos asignados (su album) y
                      // borrar esas asignaciones
                      console.log('borro inscripcion');
                      console.log(inscripcion);
                      this.peticionesAPI.DameAsignacionesCromosAlumno(inscripcion.id)
                        // tslint:disable-next-line:max-line-length
                        .subscribe(asignaciones => asignaciones.forEach(asignacion => this.peticionesAPI.BorrarAsignacionCromoAlumno(asignacion.id).subscribe())
                        );
                      // y ahora borro la inscripcion
                      this.peticionesAPI.BorraInscripcionAlumnoJuegoDeColeccion(inscripcion.id)
                        .subscribe();
                    }));
                } else {
                  console.log('borro juego de coleccion en equipo');
                  this.peticionesAPI.DameInscripcionesEquipoJuegoDeColeccion(juego.id)
                    .subscribe(inscripciones => inscripciones.forEach(inscripcion => {
                      // Para cada alumno inscrito tengo que traer los cromos asignados (su album) y
                      // borrar esas asignaciones
                      console.log('borro inscripcion');
                      console.log(inscripcion);
                      this.peticionesAPI.DameAsignacionesCromosEquipo(inscripcion.id)
                        // tslint:disable-next-line:max-line-length
                        .subscribe(asignaciones => asignaciones.forEach(asignacion => this.peticionesAPI.BorrarAsignacionCromoEquipo(asignacion.id).subscribe())
                        );
                      // y ahora borro la inscripcion
                      this.peticionesAPI.BorraInscripcionEquipoJuegoDeColeccion(inscripcion.id)
                        .subscribe();
                    }));
                }
                // Ahora borramos el juego
                this.peticionesAPI.BorraJuegoDeColeccion(juego.id)
                  .subscribe(() => {
                    cont++;
                    if (cont === juegos.length) {
                      obs.next();
                    }
                  });
              } else if (juego.Tipo === 'Juego De Competición Liga') {
                // Para borrar un juego de Liga ya hay una funcion en calculos, pero no la puedo
                // usar porque esa funcion no hace el obs.next que necesito aqui. ASi que el código que viene a continuación
                // es igual al de la función, pero añadiendole el obs.next al acabar de borrar
                console.log('Voy a borrar liga');
                if (juego.Modo === 'Individual') {
                  console.log('Voy a borrar liga individual');
                  this.peticionesAPI.DameInscripcionesAlumnoJuegoDeCompeticionLiga(juego.id)
                    // tslint:disable-next-line:max-line-length
                    .subscribe(inscripciones => inscripciones.forEach(inscripcion => this.peticionesAPI.BorraInscripcionAlumnoJuegoDeCompeticionLiga(inscripcion.id).subscribe()));
                } else {
                  this.peticionesAPI.DameInscripcionesEquipoJuegoDeCompeticionLiga(juego.id)
                    // tslint:disable-next-line:max-line-length
                    .subscribe(inscripciones => inscripciones.forEach(inscripcion => this.peticionesAPI.BorraInscripcionEquipoJuegoDeCompeticionLiga(inscripcion.id).subscribe()));
                }
                this.peticionesAPI.DameJornadasDeCompeticionLiga(juego.id)
                  .subscribe(jornadas => {
                    jornadas.forEach(jornada => {
                      this.peticionesAPI.DameEnfrentamientosDeCadaJornadaLiga(jornada.id)
                        // tslint:disable-next-line:max-line-length
                        .subscribe(enfrentamientos => enfrentamientos.forEach(enfrentamiento => this.peticionesAPI.BorraEnrentamientoLiga(enfrentamiento).subscribe()));
                      // Borrar jornada
                      this.peticionesAPI.BorrarJornadaLiga(jornada).subscribe();
                    });
                  });
                // Borro el juego
                this.peticionesAPI.BorraJuegoDeCompeticionLiga(juego.id)
                  .subscribe(() => {
                    // Esto es lo que no hace la funcion que borra el juego de liga
                    cont++;
                    if (cont === juegos.length) {
                      obs.next();
                    }
                  });

              } else if (juego.Tipo === 'Juego De Competición Fórmula Uno') {
                // Para borrar un juego de formula uno ya hay una funcion en calculos, pero no la puedo
                // usar porque esa funcion no hace el obs.next que necesito aqui. ASi que el código que viene a continuación
                // es igual al de la función, pero añadiendole el obs.next al acabar de borrar

                if (juego.Modo === 'Individual') {
                  console.log('Voy a borrar formula 1 individual');
                  this.peticionesAPI.DameInscripcionesAlumnoJuegoDeCompeticionFormulaUno(juego.id)
                    // tslint:disable-next-line:max-line-length
                    .subscribe(inscripciones => inscripciones.forEach(inscripcion => this.peticionesAPI.BorraInscripcionAlumnoJuegoDeCompeticionFormulaUno(inscripcion.id).subscribe()));
                } else {
                  this.peticionesAPI.DameInscripcionesEquipoJuegoDeCompeticionFormulaUno(juego.id)
                    // tslint:disable-next-line:max-line-length
                    .subscribe(inscripciones => {
                      // tslint:disable-next-line:max-line-length
                      inscripciones.forEach(inscripcion => this.peticionesAPI.BorraInscripcionEquipoJuegoDeCompeticionFormulaUno(inscripcion.id).subscribe());
                    }
                    );
                }
                // Pido las jornadas y para cada jornada pido los enfrentamientos y los borro. Y luego borro la jornada
                this.peticionesAPI.DameJornadasDeCompeticionFormulaUno(juego.id)
                  .subscribe(jornadas => jornadas.forEach(jornada => this.peticionesAPI.BorrarJornadaFormulaUno(jornada).subscribe()));
                // Borro el juego
                this.peticionesAPI.BorraJuegoDeCompeticionFormulaUno(juego.id)
                  .subscribe(() => {
                    // Esto es lo que no hace la funcion que borra el juego de liga
                    cont++;
                    if (cont === juegos.length) {
                      obs.next();
                    }
                  });
              } else if (juego.Tipo === 'Juego De Avatar') {
                if (juego.Modo === 'Individual') {
                  this.peticionesAPI.DameInscripcionesAlumnoJuegoDeAvatar(juego.id)
                    // tslint:disable-next-line:max-line-length
                    .subscribe(inscripciones => inscripciones.forEach(inscripcion => this.peticionesAPI.BorraInscripcionAlumnoJuegoDeAvatar(inscripcion.id).subscribe()));
                }
                this.peticionesAPI.BorraJuegoDeAvatar(juego.id)
                  .subscribe(() => {
                    // Esto es lo que no hace la funcion que borra el juego de liga
                    cont++;
                    if (cont === juegos.length) {
                      obs.next();
                    }
                  });

              } else if (juego.Tipo === 'Juego De Cuestionario') {
                if (juego.Modo === 'Individual') {
                  this.peticionesAPI.DameInscripcionesAlumnoJuegoDeCuestionario(juego.id)
                    .subscribe(AlumnosDelJuego => {
                      if (AlumnosDelJuego[0] !== undefined) {
                        // Una vez recibo las inscripciones, las voy borrando una a una
                        // tslint:disable-next-line:prefer-for-of
                        for (let i = 0; i < AlumnosDelJuego.length; i++) {
                          this.peticionesAPI.BorraAlumnoDelJuegoDeCuestionario(AlumnosDelJuego[i].id)
                            .subscribe(() => {
                              console.log('Inscripcion al juego borrada correctamente');
                            });
                        }
                      } else {
                        console.log('No hay alumnos en el juego de cuestionario');
                      }
                    });
                  this.peticionesAPI.DameRespuestasAlumnoJuegoDeCuestionario(juego.id)
                    .subscribe(respuestas => {
                      if (respuestas[0] !== undefined) {
                        // Una vez recibo las inscripciones, las voy borrando una a una
                        // tslint:disable-next-line:prefer-for-of
                        for (let i = 0; i < respuestas.length; i++) {
                          this.peticionesAPI.BorraRespuestaAlumnoDelJuegoDeCuestionario(respuestas[i].id)
                            .subscribe(() => {
                              console.log('Respuesta borrada correctamente');
                            });
                        }
                      } else {
                        console.log('No hay respuestas en el juego de cuestionario');
                      }

                    });

                }
                this.peticionesAPI.BorrarJuegoDeCuestionario(juego.id)
                  .subscribe(() => {
                    // Esto es lo que no hace la funcion que borra el juego de liga
                    cont++;
                    if (cont === juegos.length) {
                      obs.next();
                    }
                  });

              } else if (juego.Tipo === 'Juego De Geocaching') {
                if (juego.Modo === 'Individual') {
                  this.peticionesAPI.DameAlumnosDelJuegoDeGeocaching(juego.id)
                    .subscribe(AlumnosDelJuego => {
                      if (AlumnosDelJuego[0] !== undefined) {

                        // Una vez recibo las inscripciones, las voy borrando una a una
                        // tslint:disable-next-line:prefer-for-of
                        for (let i = 0; i < AlumnosDelJuego.length; i++) {
                          this.peticionesAPI.BorraAlumnoDelJuegoDeGeocaching(AlumnosDelJuego[i].id)
                            .subscribe(() => {
                              console.log('Inscripcion al juego borrada correctamente');
                            });
                        }
                      } else {
                        console.log('No hay alumnos en el juego de geocaching');
                      }

                    });
                }
                this.peticionesAPI.BorrarJuegoDeGeocaching(juego.id)
                  .subscribe(() => {
                    // Esto es lo que no hace la funcion que borra el juego de liga
                    cont++;
                    if (cont === juegos.length) {
                      obs.next();
                    }
                  });
              } else if (juego.Tipo === 'Juego De Votación Uno A Todos') {
                if (juego.Modo === 'Individual') {
                  this.peticionesAPI.DameAlumnosJuegoDeVotacionUnoATodos(juego.id)
                    .subscribe(AlumnosDelJuego => {
                      if (AlumnosDelJuego[0] !== undefined) {
                        // Una vez recibo las inscripciones, las voy borrando una a una
                        // tslint:disable-next-line:prefer-for-of
                        for (let i = 0; i < AlumnosDelJuego.length; i++) {
                          this.peticionesAPI.BorraInscripcionAlumnoJuegoDeVotacionUnoATodos(AlumnosDelJuego[i].id)
                            .subscribe(() => {
                              console.log('Inscripcion al juego borrada correctamente');
                            });
                        }
                      } else {
                        console.log('No hay alumnos en el juego de votacion');
                      }
                    });
                }
                this.peticionesAPI.BorraJuegoDeVotacionUnoATodos(juego.id)
                  .subscribe(() => {
                    // Esto es lo que no hace la funcion que borra el juego de liga
                    cont++;
                    if (cont === juegos.length) {
                      obs.next();
                    }
                  });
              } else if (juego.Tipo === 'Juego De Votación Todos A Uno') {
                if (juego.Modo === 'Individual') {
                  this.peticionesAPI.DameAlumnosJuegoDeVotacionTodosAUno(juego.id)
                    .subscribe(AlumnosDelJuego => {
                      if (AlumnosDelJuego[0] !== undefined) {
                        // Una vez recibo las inscripciones, las voy borrando una a una
                        // tslint:disable-next-line:prefer-for-of
                        for (let i = 0; i < AlumnosDelJuego.length; i++) {
                          this.peticionesAPI.BorraInscripcionAlumnoJuegoDeVotacionTodosAUno(AlumnosDelJuego[i].id)
                            .subscribe(() => {
                              console.log('Inscripcion al juego borrada correctamente');
                            });
                        }
                      } else {
                        console.log('No hay alumnos en el juego de votacion');
                      }
                    });
                }
                this.peticionesAPI.BorraJuegoDeVotacionTodosAUno(juego.id)
                  .subscribe(() => {
                    // Esto es lo que no hace la funcion que borra el juego de liga
                    cont++;
                    if (cont === juegos.length) {
                      obs.next();
                    }
                  });
              }
            });
          } else {
            console.log('No hay juegos');
            obs.next();
          }
        });
    });
    return eliminaJuegosObservable;
  }

  // ESTA FUNCIÓN RECUPERA TODAS LAS MATRICULAS DEL GRUPO QUE VAMOS A BORRAR Y DESPUÉS LAS BORRA. ESTO LO HACEMOS PARA NO
  // DEJAR MATRICULAS QUE NO NOS SIRVEN EN LA BASE DE DATOS
  // Lo hacemos como observable para que el que la use tenga que suscribirse y pueda esperar a que se complete
  // la operación antes de avanzar
  private EliminarMatriculas(): any {
    const eliminaMatriculasObservable = new Observable(obs => {
      // Pido las matrículas correspondientes al grupo que voy a borrar
      console.log('vamos a eliminar matriculas');
      this.peticionesAPI.DameMatriculasGrupo(this.sesion.DameGrupo().id)
        .subscribe(matriculas => {
          if (matriculas[0] !== undefined) {
            let cont = 0;
            console.log('ya tengo las matriculas');
            console.log(matriculas);
            // Una vez recibo las matriculas del grupo, las voy borrando una a una
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < matriculas.length; i++) {
              this.peticionesAPI.BorraMatricula(matriculas[i].id)
                .subscribe(() => {
                  cont++;
                  if (cont === matriculas.length) {
                    // Ya hemos borrado todas
                    console.log('ya estan todas eliminadas');
                    obs.next();
                  }
                });
            }
          } else {
            // no hay matricular que borrar
            console.log('no hay matriculas para eliminara');
            obs.next();
          }

        });
    });
    return eliminaMatriculasObservable;
  }

  // ESTA FUNCIÓN RECUPERA TODAS LAS SESIONES DE CLASE DEL GRUPO QUE VAMOS A BORRAR Y DESPUÉS LAS BORRA.
  // Lo hacemos como observable para que el que la use tenga que suscribirse y pueda esperar a que se complete
  // la operación antes de avanzar
  private EliminarSesionesClase(): any {
    const eliminaSesionesObservable = new Observable(obs => {
      console.log('vamos a eliminar las sesiones de clase');
      // Pido las matrículas correspondientes al grupo que voy a borrar
      this.peticionesAPI.DameSesionesClaseGrupo(this.sesion.DameGrupo().id)
        .subscribe(sesiones => {
          if (sesiones[0] !== undefined) {
            console.log('ya tengo las sesiones');
            console.log(sesiones);
            let cont = 0;
            // Una vez recibo las sesiones de clase del grupo, las voy borrando una a una
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < sesiones.length; i++) {
              // primero tengo que borrar los registros de asistencia a la sesión
              console.log('Vamos a eliminara los registros de asistencia de la sesion ' + i);
              this.peticionesAPI.DameAsistenciasClase(sesiones[i].id).
                subscribe(asistencias => {
                  console.log('ya tengo los registros de asistencia');
                  console.log(asistencias);
                  asistencias.forEach(asistencia => this.peticionesAPI.BorraAsistenciaClase(asistencia.id).subscribe());
                  console.log('Ya he borrado los registros de asistencia');
                });
              // Ahora borro la sesión
              console.log('Ahora borro la sesion de clase');
              this.peticionesAPI.BorraSesionClase(sesiones[i].id)
                .subscribe(() => {
                  cont++;
                  if (cont === sesiones.length) {
                    // Ya hemos borrado todas las sesiones
                    console.log('ya esta borradas todas las sesiones de clase');
                    obs.next();
                  }
                });
            }
          } else {
            // nada que eliminar
            console.log('No hay sesiones de clase para borrar');
            obs.next();
          }

        });
    });
    return eliminaSesionesObservable;
  }


  // Trae de la base de datos todos los juegos del grupo y los organiza en dos
  // listas, una de activos y otra de inactivos. Retorna estas listas como observable

  public DameListaJuegos(grupoID: number): any {
    const listasObservables = new Observable(obs => {

      const juegosActivos: any[] = [];
      const juegosInactivos: any[] = [];
      const juegosPreparados: any[] = [];

      console.log('vamos a por los juegos de puntos del grupo: ' + grupoID);
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
          console.log('vamos a por los juegos de colección del grupo: ' + grupoID);
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
              console.log('vamos a por los juegos de competicion liga del grupo: ' + grupoID);
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
                  // ahora toca los juegos de competicion de formula uno
                  console.log('vamos a por los juegos de competicion formula uno del grupo: ' + grupoID);
                  this.peticionesAPI.DameJuegoDeCompeticionFormulaUnoGrupo(grupoID)
                    .subscribe(juegosCompeticionFormulaUno => {
                      console.log('He recibido los juegos de competición formula uno');
                      console.log(juegosCompeticionFormulaUno);
                      // tslint:disable-next-line:prefer-for-of
                      for (let i = 0; i < juegosCompeticionFormulaUno.length; i++) {
                        if (juegosCompeticionFormulaUno[i].JuegoActivo === true) {
                          juegosActivos.push(juegosCompeticionFormulaUno[i]);
                        } else {
                          juegosInactivos.push(juegosCompeticionFormulaUno[i]);
                        }
                      }
                      console.log('vamos a por los juegos de avatar del grupo: ' + grupoID);
                      this.peticionesAPI.DameJuegoDeAvatarGrupo(grupoID)
                        .subscribe(juegosAvatar => {
                          console.log('He recibido los juegos de avatar');
                          console.log(juegosAvatar);
                          // tslint:disable-next-line:prefer-for-of
                          for (let i = 0; i < juegosAvatar.length; i++) {
                            if (juegosAvatar[i].JuegoActivo === true) {
                              juegosActivos.push(juegosAvatar[i]);
                            } else {
                              juegosInactivos.push(juegosAvatar[i]);
                            }
                          }
                          // Ahora recogemos los juegos de cuestionario
                          // console.log ('vamos a por los juegos de cuestionario del grupo: ' + grupoID);
                          console.log('vamos a por los juegos de cuestionario del grupo: ' + grupoID);
                          this.peticionesAPI.DameJuegoDeCuestionario(grupoID)
                            .subscribe(juegosCuestionario => {
                              console.log('He recibido los juegos de cuestionario');
                              console.log(juegosCuestionario);
                              // tslint:disable-next-line:prefer-for-of
                              for (let i = 0; i < juegosCuestionario.length; i++) {
                                if (juegosCuestionario[i].JuegoActivo === true) {
                                  juegosCuestionario[i].Tipo = 'Juego De Cuestionario';
                                  juegosActivos.push(juegosCuestionario[i]);
                                } else if (juegosCuestionario[i].JuegoTerminado === false && juegosCuestionario[i].JuegoActivo === false) {
                                  juegosCuestionario[i].Tipo = 'Juego De Cuestionario';
                                  juegosPreparados.push(juegosCuestionario[i]);
                                } else if (juegosCuestionario[i].JuegoTerminado === true) {
                                  juegosCuestionario[i].Tipo = 'Juego De Cuestionario';
                                  juegosInactivos.push(juegosCuestionario[i]);
                                }
                              }

                              console.log('vamos a por los juegos de geocaching del grupo: ' + grupoID);
                              this.peticionesAPI.DameJuegoDeGeocaching(grupoID)
                                .subscribe(juegosGeocaching => {
                                  console.log('He recibido los juegos de geocaching');
                                  console.log(juegosGeocaching);
                                  // tslint:disable-next-line:prefer-for-of
                                  for (let i = 0; i < juegosGeocaching.length; i++) {
                                    if (juegosGeocaching[i].JuegoActivo === true) {
                                      juegosGeocaching[i].Tipo = 'Juego De Geocaching';
                                      juegosActivos.push(juegosGeocaching[i]);
                                    } else if (juegosGeocaching[i].JuegoTerminado === false && juegosGeocaching[i].JuegoActivo === false) {
                                      juegosGeocaching[i].Tipo = 'Juego De Geocaching';
                                      juegosPreparados.push(juegosGeocaching[i]);
                                    } else if (juegosGeocaching[i].JuegoTerminado === true) {
                                      juegosGeocaching[i].Tipo = 'Juego De Geocaching';
                                      juegosInactivos.push(juegosGeocaching[i]);
                                    }
                                  }
                                  console.log('Vamos a por los juegos de votacion Uno a Todos del grupo: ' + grupoID);
                                  this.peticionesAPI.DameJuegosDeVotacionUnoATodos(grupoID)
                                    .subscribe(juegosVotacionUnoATodos => {
                                      console.log('He recibido los juegos de votacion Uno A Todos');
                                      console.log(juegosVotacionUnoATodos);
                                      // tslint:disable-next-line:prefer-for-of
                                      for (let i = 0; i < juegosVotacionUnoATodos.length; i++) {
                                        if (juegosVotacionUnoATodos[i].JuegoActivo === true) {
                                          juegosVotacionUnoATodos[i].Tipo = 'Juego De Votación Uno A Todos';
                                          juegosActivos.push(juegosVotacionUnoATodos[i]);
                                        } else {
                                          juegosVotacionUnoATodos[i].Tipo = 'Juego De Votación Uno A Todos';
                                          juegosInactivos.push(juegosVotacionUnoATodos[i]);
                                        }
                                      }
                                      console.log('Vamos a por los juegos de votacion Todos A Uno del grupo: ' + grupoID);
                                      this.peticionesAPI.DameJuegosDeVotacionTodosAUno(grupoID)
                                        .subscribe(juegosVotacioTodosAUno => {
                                          console.log('He recibido los juegos de votacion Todos A Uno');
                                          console.log(juegosVotacioTodosAUno);
                                          // tslint:disable-next-line:prefer-for-of
                                          for (let i = 0; i < juegosVotacioTodosAUno.length; i++) {
                                            if (juegosVotacioTodosAUno[i].JuegoActivo === true) {
                                              juegosVotacioTodosAUno[i].Tipo = 'Juego De Votación Todos A Uno';
                                              juegosActivos.push(juegosVotacioTodosAUno[i]);
                                            } else {
                                              juegosVotacioTodosAUno[i].Tipo = 'Juego De Votación Todos A Uno';
                                              juegosInactivos.push(juegosVotacioTodosAUno[i]);
                                            }
                                          }
                                          console.log('Vamos a por los juegos de cuestionario de satisfacción: ' + grupoID);
                                          this.peticionesAPI.DameJuegosDeCuestionarioSatisfaccion(grupoID)
                                            .subscribe(juegosCuestionarioSatisfaccion => {
                                              console.log('He recibido los juegos de cuestionario de satisfacción');
                                              console.log(juegosCuestionarioSatisfaccion);
                                              // tslint:disable-next-line:prefer-for-of
                                              for (let i = 0; i < juegosCuestionarioSatisfaccion.length; i++) {
                                                if (juegosCuestionarioSatisfaccion[i].JuegoActivo === true) {
                                                  juegosActivos.push(juegosCuestionarioSatisfaccion[i]);
                                                } else {
                                                  juegosInactivos.push(juegosCuestionarioSatisfaccion[i]);
                                                }
                                              }
                                              const resultado = { activos: juegosActivos, inactivos: juegosInactivos, preparados: juegosPreparados };
                                              obs.next(resultado);

                                              // console.log('GET JuegoDeEvaluacion OF grupoID: ', grupoID);
                                              // this.peticionesAPI.DameJuegosDeEvaluacion(grupoID)
                                              //   .subscribe(juegosDeEvaluacion => {
                                              //     console.log('GET RESPONSE JuegoDeEvaluacion', juegosDeEvaluacion);
                                              //     // tslint:disable-next-line:prefer-for-of
                                              //     for (let i = 0; i < juegosDeEvaluacion.length; i++) {
                                              //       if (juegosDeEvaluacion[i].JuegoActivo === true) {
                                              //         juegosDeEvaluacion[i].Tipo = 'Evaluacion';
                                              //         juegosActivos.push(juegosDeEvaluacion[i]);
                                              //       } else {
                                              //         juegosDeEvaluacion[i].Tipo = 'Evaluacion';
                                              //         juegosInactivos.push(juegosDeEvaluacion[i]);
                                              //       }
                                              //     }

                                              //   const resultado = { activos: juegosActivos, inactivos: juegosInactivos, preparados: juegosPreparados};
                                              //   obs.next (resultado);
                                              // });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    return listasObservables;
  }

  public DameJuegosRapidos(profesorId: number): any {
    const listasObservables = new Observable(obs => {

      let juegosRapidos: any[] = [];
      this.peticionesAPI.DameJuegosDeEncuestaRapida(profesorId)
        .subscribe(juegos => {
          console.log('Ya tengo los juegos de encuesta rápida');
          console.log(juegos);
          juegosRapidos = juegosRapidos.concat(juegos);
          this.peticionesAPI.DameJuegosDeVotacionRapida(profesorId)
            // tslint:disable-next-line:no-shadowed-variable
            .subscribe(juegos => {
              console.log('Ya tengo los juegos de votación rápida');
              console.log(juegos);
              juegosRapidos = juegosRapidos.concat(juegos);
              this.peticionesAPI.DameJuegosDeCuestionarioRapido(profesorId)
                // tslint:disable-next-line:no-shadowed-variable
                .subscribe(juegos => {
                  console.log('Ya tengo los juegos de cuestionario rapido');
                  console.log(juegos);
                  juegosRapidos = juegosRapidos.concat(juegos);
                  console.log(juegosRapidos);
                  // obs.next (juegosRapidos);
                  this.peticionesAPI.DameJuegosDeCogerTurnoRapido(profesorId)
                    // tslint:disable-next-line:no-shadowed-variable
                    .subscribe(juegos => {
                      console.log('Ya tengo los juegos de coger turno rapido');
                      console.log(juegos);
                      juegosRapidos = juegosRapidos.concat(juegos);
                      console.log(juegosRapidos);
                      obs.next(juegosRapidos);
                    });
                });
            });
        });
    });

    return listasObservables;
  }


  public PrepararTablaRankingIndividual(listaAlumnosOrdenadaPorPuntos,
    alumnosDelJuego,
    nivelesDelJuego): any {

    const rankingJuegoDePuntos: any[] = [];
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
        rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos(i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
          listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno, nivel.Nombre);

      } else {
        rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos(i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
          listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno);
      }
    }

    return (rankingJuegoDePuntos);

  }



  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  public DameRankingPuntoSeleccionadoEquipos(
    listaEquiposOrdenadaPorPuntos: any,
    equiposDelJuego: any,
    nivelesDelJuego: any,
    puntoSeleccionadoId: any
  ): any {

    const rankingObservable = new Observable(obs => {

      let rankingEquiposJuegoDePuntos: any[] = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < listaEquiposOrdenadaPorPuntos.length; i++) {

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
            for (let j = 0; j < historial.length; j++) {
              puntos = puntos + historial[j].ValorPunto;
            }


            if (nivel !== undefined) {
              rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos(i + 1, equipo.Nombre, equipo.id,
                puntos, nivel.Nombre);
            } else {
              rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos(i + 1, equipo.Nombre, equipo.id,
                puntos);
            }

            if (i === listaEquiposOrdenadaPorPuntos.length - 1) {
              // tslint:disable-next-line:only-arrow-functions
              rankingEquiposJuegoDePuntos = rankingEquiposJuegoDePuntos.sort(function (obj1, obj2) {
                return obj2.puntos - obj1.puntos;
              });
              obs.next(rankingEquiposJuegoDePuntos);
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
    const rankingObservable = new Observable(obs => {

      let rankingJuegoDePuntos: any[] = [];

      console.log('Dentro ranking2 ');
      console.log('Recorremos los ' + listaAlumnosOrdenadaPorPuntos.length);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < listaAlumnosOrdenadaPorPuntos.length; i++) {
        console.log('alumno ' + i);

        let alumno: Alumno;
        let nivel: Nivel;

        // Busco al alumno
        alumno = alumnosDelJuego.filter(res => res.id === listaAlumnosOrdenadaPorPuntos[i].alumnoId)[0];
        console.log('nombre ' + alumno.Nombre);

        if (listaAlumnosOrdenadaPorPuntos[i].nivelId !== undefined) {
          console.log(listaAlumnosOrdenadaPorPuntos[i].alumnoId);
          // Busco el nivel
          nivel = nivelesDelJuego.filter(res => res.id === listaAlumnosOrdenadaPorPuntos[i].nivelId)[0];
        }

        this.peticionesAPI.DameHistorialDeUnPunto(listaAlumnosOrdenadaPorPuntos[i].id, puntoSeleccionadoId)
          .subscribe(historial => {
            let puntos = 0;
            console.log(alumno.Nombre + ' tieme ' + historial.length + 'asignaciones');
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < historial.length; j++) {
              puntos = puntos + historial[j].ValorPunto;
            }
            console.log('Puntos ' + puntos);

            if (nivel !== undefined) {
              // tslint:disable-next-line:max-line-length
              rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos(i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
                puntos, nivel.Nombre);
            } else {
              // tslint:disable-next-line:max-line-length
              rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos(i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
                puntos);
            }

            if (i === listaAlumnosOrdenadaPorPuntos.length - 1) {
              console.log('vamos a acabar');
              // tslint:disable-next-line:only-arrow-functions
              rankingJuegoDePuntos = rankingJuegoDePuntos.sort(function (obj1, obj2) {
                return obj2.puntos - obj1.puntos;
              });
              obs.next(rankingJuegoDePuntos);
            }

          });
      }
    });
    return rankingObservable;
  }

  // ESTA FUNCIÓN NOS DA DOS LISTA, UNA CON LOS ALUMNOS DEL GRUPO CON EQUIPO Y
  // OTRA CON LOS QUE NO TIENEN EQUIPO
  public DameListasAlumnosConYSinEquipo(equipo: Equipo, alumnosGrupo: Alumno[]): any {
    const listasObservables = new Observable(obs => {
      this.peticionesAPI.DameAsignacionesEquipoDelGrupo(equipo.grupoId)
        .subscribe(asignaciones => {
          console.log('Asignaciones equipo ' + equipo.id);
          console.log(asignaciones);
          let asignacionesEquipo: any[];
          const alumnosConEquipo: Alumno[] = [];
          const alumnosSinEquipo: Alumno[] = [];

          if (asignaciones[0] !== undefined) {
            // cuando recibimos las asignaciones las metemos en su lista
            asignacionesEquipo = asignaciones;
          }
          console.log('Alumnos del grupo: ' + alumnosGrupo);
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
              } else {
                alumnosSinEquipo.push(alumnosGrupo[i]);
              }
              // SI NO HAY NINGUNA ASIGNACIÓN HECHA SIGNIFICA QUE TODOS LOS ALUMNOS DEL GRUPO ESTAN SIN EQUIPO
            } else {
              alumnosSinEquipo.push(alumnosGrupo[i]);
            }
          }
          const resultado = { con: alumnosConEquipo, sin: alumnosSinEquipo };
          obs.next(resultado);
        });
    });
    console.log('Id Equipo ' + equipo.id);
    return listasObservables;
  }

  public DameSiguienteNivel(nivelesDelJuego: Nivel[], nivel: Nivel): Nivel {
    // Retorna el nivel siguiente al que me dan, o undefined si el que me dan es el máximo
    const pos = nivelesDelJuego.indexOf(nivel);
    if (pos === nivelesDelJuego.length - 1) {
      return undefined;
    } else {
      return nivelesDelJuego[pos + 1];
    }
  }

  private DameNivelId(nivelesDelJuego: Nivel[], puntos: number): number {
    let i = 0;
    let encontrado = false;
    while ((i < nivelesDelJuego.length) && !encontrado) {
      if (nivelesDelJuego[i].PuntosAlcanzar > puntos) {
        encontrado = true;
        console.log('encontrado');
      } else {
        i = i + 1;
      }
    }
    if (!encontrado) {
      console.log('no encontrado');
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


  public BorrarPunto(punto: TablaHistorialPuntosAlumno, alumnoJuegoDePuntos: any,
    nivelesDelJuego: Nivel[]) {

    alumnoJuegoDePuntos.PuntosTotalesAlumno = alumnoJuegoDePuntos.PuntosTotalesAlumno - punto.valorPunto;
    if ((nivelesDelJuego !== undefined) && (nivelesDelJuego.length !== 0)) {
      // calculamos el nuevo nivel
      console.log('calculo nuevo nivel ' + nivelesDelJuego.length);
      const nivelId = this.DameNivelId(nivelesDelJuego, alumnoJuegoDePuntos.PuntosTotalesAlumno);
      alumnoJuegoDePuntos.nivelId = nivelId;
    }
    this.peticionesAPI.PonPuntosJuegoDePuntos(alumnoJuegoDePuntos, alumnoJuegoDePuntos.id).
      subscribe();
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

  public BorrarPuntoEquipo(punto: TablaHistorialPuntosEquipo, equipoJuegoDePuntos: any,
    nivelesDelJuego: Nivel[]) {

    equipoJuegoDePuntos.PuntosTotalesEquipo = equipoJuegoDePuntos.PuntosTotalesEquipo - punto.valorPunto;
    if (nivelesDelJuego !== undefined) {
      // calculamos el nuevo nivel
      console.log('calculo nuevo nivel ');
      const nivelId = this.DameNivelId(nivelesDelJuego, equipoJuegoDePuntos.PuntosTotalesEquipo);
      equipoJuegoDePuntos.nivelId = nivelId;
    }
    this.peticionesAPI.PonPuntosEquiposJuegoDePuntos(equipoJuegoDePuntos, equipoJuegoDePuntos.id).
      subscribe();
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
      console.log('Bucle principal');
      let equipo: Equipo;
      let nivel: Nivel;
      equipo = equiposDelJuego.filter(res => res.id === listaEquiposOrdenadaPorPuntos[i].equipoId)[0];

      if (listaEquiposOrdenadaPorPuntos[i].nivelId !== undefined) {
        console.log(listaEquiposOrdenadaPorPuntos[i].equipoId);
        nivel = nivelesDelJuego.filter(res => res.id === listaEquiposOrdenadaPorPuntos[i].nivelId)[0];
        console.log(listaEquiposOrdenadaPorPuntos[i].nivelId);
      }

      if (nivel !== undefined) {
        rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos(i + 1, equipo.Nombre, equipo.id,
          listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo, nivel.Nombre);

        // rankingEquiposJuegoDePuntosTotal[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
        //     listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo, nivel.Nombre);
      } else {
        rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos(i + 1, equipo.Nombre, equipo.id,
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
    if (nivelesDelJuego.length > 0) {
      const nivelId = this.DameNivelId(nivelesDelJuego, alumno.PuntosTotalesAlumno);
      alumno.nivelId = nivelId;
    }
    this.peticionesAPI.PonPuntosJuegoDePuntos(alumno, alumno.id).
      subscribe();
    const fechaAsignacionPunto = new Date();
    const fechaString = fechaAsignacionPunto.toLocaleDateString() + '  ' + fechaAsignacionPunto.toLocaleTimeString();
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.PonHistorialPuntosAlumno(new HistorialPuntosAlumno(puntosNuevos, puntoSeleccionadoId, alumno.id, fechaString))
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
    if (nivelesDelJuego.length > 0) {
      const nivelId = this.DameNivelId(nivelesDelJuego, equipo.PuntosTotalesEquipo);
      equipo.nivelId = nivelId;
    }
    this.peticionesAPI.PonPuntosEquiposJuegoDePuntos(equipo, equipo.id).
      subscribe();
    const fechaAsignacionPunto = new Date();
    const fechaString = fechaAsignacionPunto.toLocaleDateString() + '  ' + fechaAsignacionPunto.toLocaleTimeString();
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.PonHistorialPuntosEquipo(new HistorialPuntosEquipo(puntosNuevos, puntoSeleccionadoId, equipo.id, fechaString))
      // tslint:disable-next-line:no-shadowed-variable
      .subscribe(res => console.log(res));
  }


  public PreparaHistorialEquipo(
    equipoJuegoDePuntos: any,
    tiposPuntosDelJuego: any,
  ): any {
    const historialObservable = new Observable(obs => {

      let historial = [];

      this.peticionesAPI.DameHistorialPuntosEquipo(equipoJuegoDePuntos.id)
        .subscribe(his => {

          if (his[0] !== null) {
            for (let i = 0; i < his.length; i++) {
              console.log('voy ' + i);
              const punto = tiposPuntosDelJuego.filter(res => res.id === his[i].puntoId)[0];

              historial[i] = new TablaHistorialPuntosEquipo(punto.Nombre,
                punto.Descripcion, his[i].ValorPunto, his[i].fecha,
                his[i].equipoJuegoDePuntosId, his[i].id, his[i].puntoId);
            }
          } else {
            historial = undefined;
          }
          historial = historial.filter(res => res.nombre !== '');
          obs.next(historial);
        });
    });
    return historialObservable;
  }


  public Prueba(profesorId): any {
    const gruposObservable = new Observable(obs => {
      this.peticionesAPI.DameGruposProfesor(profesorId)
        .subscribe(res => {
          if (res[0] !== undefined) {
            obs.next(res.slice(0, 2));
          } else {
            obs.next(undefined);
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


      this.peticionesAPI.AsignarCromoAlumno(new Album(alumnoJuegoDeColeccion.id,
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

      this.peticionesAPI.AsignarCromoEquipo(new AlbumEquipo(equipoJuegoDeColeccion.id,
        cromosColeccion[indexCromo].id)).subscribe(res => {

          console.log(res);

        });
    }
  }

  //Comprueba si se ha completado la Colección del Alumno/Equipo del JDP
  public CompruebaFinalizacionColeccion(coleccionID: number, alumnoJDPid?: number, equipoJDPid?: number): Observable<boolean> {
    const comprobanteObservable: Observable<boolean> = new Observable((obs) => {
      this.peticionesAPI.DameCromosColeccion(coleccionID).subscribe((cromos) => {
        //console.log(cromos);
        let cromosAsignadosDiferentes: number[] = [];
        if(alumnoJDPid != undefined){
          this.peticionesAPI.DameAsignacionesCromosAlumno(alumnoJDPid).subscribe((asignaciones) => {
            //console.log(asignaciones);
            asignaciones.forEach((asignacion) => {
              if(!cromosAsignadosDiferentes.includes(asignacion.cromoId)){
                cromosAsignadosDiferentes.push(asignacion.cromoId);
              }
            });
            if(cromosAsignadosDiferentes.length == cromos.length){
              obs.next(true);
            }
            else{
              obs.next(false);
            }
          }, (err) => {
            console.log(err);
            obs.next(false);
          });
        }
        else if(equipoJDPid != undefined){
          this.peticionesAPI.DameAsignacionesCromosEquipo(equipoJDPid).subscribe((asignaciones) => {
            //console.log(asignaciones);
            asignaciones.forEach((asignacion) => {
              if(!cromosAsignadosDiferentes.includes(asignacion.cromoId)){
                cromosAsignadosDiferentes.push(asignacion.cromoId);
              }
            });
            if(cromosAsignadosDiferentes.length == cromos.length){
              obs.next(true);
            }
            else{
              obs.next(false);
            }
          }, (err) => {
            console.log(err);
            obs.next(false);
          });
        }
        else{
          obs.next(false);
        }
      }, (err) => {
        console.log(err); 
        obs.next(false);
      });
    });
    return comprobanteObservable;
  }

  // Esta función recibe una lista de cromos en la que puede haber repetidos
  // y geneera otra en la que cada cromo aparece una sola vez y se le asocia el número
  // de veces que aparece reperido en la lista de entrada
  GeneraListaSinRepetidos(listaCromos: Cromo[]): any[] {
    const listaCromosSinRepetidos: any[] = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < listaCromos.length; i++) {
      const n = listaCromos.filter(cromo => cromo.Nombre === listaCromos[i].Nombre).length;
      if (listaCromosSinRepetidos.filter(res => res.cromo.Nombre === listaCromos[i].Nombre).length === 0) {
        listaCromosSinRepetidos.push({ rep: n, cromo: listaCromos[i] });
      }
    }
    return listaCromosSinRepetidos;
  }
  public DameIdAlumnos(lineas: string[], listaAlumnosClasificacion: any[]): any[] {
    const ganadores: any[] = [];
    let nombreRepetido = false;

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < lineas.length; i++) {
      // Busco a cada uno de los ganadores (uno por linea de texto) y si esta guardo su id
      // tslint:disable-next-line:max-line-length
      const ganador = listaAlumnosClasificacion.filter(alumno => lineas[i] === alumno.nombre + ' ' + alumno.primerApellido + ' ' + alumno.segundoApellido)[0];
      if (ganador !== undefined) {
        const indexOfRepetido = ganadores.indexOf(ganador.id);
        if (indexOfRepetido === -1) {
          ganadores.push(ganador.id);
        } else {
          nombreRepetido = true;
          console.log('nombreRepetido = ' + nombreRepetido);
        }
      }
      // const indexOfRepetido = ganadores.indexOf(ganador.id);
      // if (ganador !== undefined && indexOfRepetido === -1) {
      //   ganadores.push (ganador.id);
      // } else if (indexOfRepetido !== -1) {
      //   nombreRepetido = true;
      //   console.log('nombreRepetido = ' + nombreRepetido);
      // }
    }
    if (ganadores.length === lineas.length && nombreRepetido === false) {
      console.log('ganadores: ');
      console.log(ganadores);
      return ganadores;
    } else if (ganadores.length !== lineas.length && nombreRepetido === true) {
      Swal.fire('Cuidado', 'Alguno de los alumnos introducidos está repetido', 'warning');
      nombreRepetido = false;
      return undefined;
    } else { // alguno de los ganadores no se ha encontrado
      console.log('alguno de los ganadores no se ha encontrado');
      Swal.fire('Cuidado', 'Alguno de los alumnos introducidos no se corresponde con ninguno de los participantes del juego', 'warning');
      return undefined;
    }
  }

  public DameIdEquipos(lineas: string[], listaEquiposClasificacion: any[]): any[] {
    const ganadores: any[] = [];
    let nombreRepetido = false;

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < lineas.length; i++) {
      // Busco a cada uno de los ganadores (uno por linea de texto) y si esta guardo su id
      // tslint:disable-next-line:max-line-length
      const ganador = listaEquiposClasificacion.filter(equipo => lineas[i] === equipo.nombre)[0];
      // if (ganador !== undefined) {
      //   ganadores.push (ganador.id);
      // }

      if (ganador !== undefined) {
        const indexOfRepetido = ganadores.indexOf(ganador.id);
        if (indexOfRepetido === -1) {
          ganadores.push(ganador.id);
        } else {
          nombreRepetido = true;
          console.log('nombreRepetido = ' + nombreRepetido);
        }
      }
    }
    // if (ganadores.length === lineas.length) {
    //   return ganadores;
    // } else { // alguno de los ganadores no se ha encontrado
    //   Swal.fire('Cuidado', 'Alguno de los equipos introducidos no se corresponde con ninguno de los participantes del juego', 'warning');
    //   return undefined;
    // }

    if (ganadores.length === lineas.length && nombreRepetido === false) {
      console.log('ganadores: ');
      console.log(ganadores);
      return ganadores;
    } else if (ganadores.length !== lineas.length && nombreRepetido === true) {
      Swal.fire('Cuidado', 'Alguno de los equipos introducidos está repetido', 'warning');
      nombreRepetido = false;
      return undefined;
    } else { // alguno de los ganadores no se ha encontrado
      console.log('alguno de los ganadores no se ha encontrado');
      Swal.fire('Cuidado', 'Alguno de los equipos introducidos no se corresponde con ninguno de los participantes del juego', 'warning');
      return undefined;
    }
  }

  /////////////////////////////////////////////////////  COMPETICIONES  ////////////////////////////////////////////////////

  public BorraJuegoCompeticionLiga(juegoDeCompeticion: Juego) {
    // Pido las inscripciones de los participantes en el juego y las borro todas
    if (juegoDeCompeticion.Modo === 'Individual') {
      this.peticionesAPI.DameInscripcionesAlumnoJuegoDeCompeticionLiga(juegoDeCompeticion.id)
        // tslint:disable-next-line:max-line-length
        .subscribe(inscripciones => inscripciones.forEach(inscripcion => this.peticionesAPI.BorraInscripcionAlumnoJuegoDeCompeticionLiga(inscripcion.id).subscribe()));
    } else {
      console.log('inscripciones equipos');
      this.peticionesAPI.DameInscripcionesEquipoJuegoDeCompeticionLiga(juegoDeCompeticion.id)
        // tslint:disable-next-line:max-line-length
        .subscribe(inscripciones => {
          console.log('inscripciones');
          console.log(inscripciones);
          inscripciones.forEach(inscripcion => this.peticionesAPI.BorraInscripcionEquipoJuegoDeCompeticionLiga(inscripcion.id).subscribe());
        }
        );
    }
    // Pido las jornadas y para cada jornada pido los enfrentamientos y los borro. Y luego borro la jornada
    this.peticionesAPI.DameJornadasDeCompeticionLiga(juegoDeCompeticion.id)
      .subscribe(jornadas => {
        jornadas.forEach(jornada => {
          this.peticionesAPI.DameEnfrentamientosDeCadaJornadaLiga(jornada.id)
            // tslint:disable-next-line:max-line-length
            .subscribe(enfrentamientos => enfrentamientos.forEach(enfrentamiento => this.peticionesAPI.BorraEnrentamientoLiga(enfrentamiento).subscribe()));
          // Borrar jornada
          this.peticionesAPI.BorrarJornadaLiga(jornada).subscribe();
        });
      });


    // Borro el juego
    this.peticionesAPI.BorraJuegoDeCompeticionLiga(juegoDeCompeticion.id).subscribe();

  }


  public BorraJuegoCompeticionFormulaUno(juegoDeCompeticion: Juego) {
    // Pido las inscripciones de los participantes en el juego y las borro todas
    if (juegoDeCompeticion.Modo === 'Individual') {
      this.peticionesAPI.DameInscripcionesAlumnoJuegoDeCompeticionFormulaUno(juegoDeCompeticion.id)
        // tslint:disable-next-line:max-line-length
        .subscribe(inscripciones => inscripciones.forEach(inscripcion => this.peticionesAPI.BorraInscripcionAlumnoJuegoDeCompeticionFormulaUno(inscripcion.id).subscribe()));
    } else {
      console.log('inscripciones equipos');
      this.peticionesAPI.DameInscripcionesEquipoJuegoDeCompeticionFormulaUno(juegoDeCompeticion.id)
        // tslint:disable-next-line:max-line-length
        .subscribe(inscripciones => {
          console.log('inscripciones');
          console.log(inscripciones);
          // tslint:disable-next-line:max-line-length
          inscripciones.forEach(inscripcion => this.peticionesAPI.BorraInscripcionEquipoJuegoDeCompeticionFormulaUno(inscripcion.id).subscribe());
        }
        );
    }
    // Pido las jornadas y para cada jornada pido los enfrentamientos y los borro. Y luego borro la jornada
    this.peticionesAPI.DameJornadasDeCompeticionFormulaUno(juegoDeCompeticion.id)
      .subscribe(jornadas => jornadas.forEach(jornada => this.peticionesAPI.BorrarJornadaFormulaUno(jornada).subscribe()));


    // Borro el juego
    this.peticionesAPI.BorraJuegoDeCompeticionFormulaUno(juegoDeCompeticion.id).subscribe();
  }

  public CrearJornadasLiga(NumeroDeJornadas, juegoDeCompeticionID): any {
    const jornadasObservables = new Observable(obs => {
      const jornadasNuevas = [];
      let cont = 0;
      for (let i = 0; i < NumeroDeJornadas; i++) {
        // tslint:disable-next-line:max-line-length '2000-01-01T01:01:01.000Z'
        const jornada = new Jornada(undefined, 'Pendiente de determinar', juegoDeCompeticionID);
        this.peticionesAPI.CrearJornadasLiga(jornada, juegoDeCompeticionID)
          .subscribe(jornadacreada => {
            jornadasNuevas.push(jornadacreada);
            cont = cont + 1;
            if (cont === Number(NumeroDeJornadas)) {
              obs.next(jornadasNuevas);
            }
          });
      }
    });
    return jornadasObservables;
  }

  public CrearJornadasFormulaUno(NumeroDeJornadas, juegoDeCompeticionID): any {
    const jornadasObservables = new Observable(obs => {
      const jornadasNuevas = [];
      let cont = 0;
      for (let i = 0; i < NumeroDeJornadas; i++) {
        // tslint:disable-next-line:max-line-length '2000-01-01T01:01:01.000Z'
        const jornada = new Jornada(undefined, 'Pendiente de determinar', juegoDeCompeticionID);
        console.log(jornada);
        this.peticionesAPI.CrearJornadasFormulaUno(jornada, juegoDeCompeticionID)
          .subscribe(jornadacreada => {
            jornadasNuevas.push(jornadacreada);
            cont = cont + 1;
            if (cont === Number(NumeroDeJornadas)) {
              obs.next(jornadasNuevas);
            }
          });
      }
    });
    return jornadasObservables;
  }
  public ObtenerNombreGanadoresFormulaUno(juegoSeleccionado: Juego, jornada, alumnoJuegoDeCompeticionFormulaUno,
    equipoJuegoDeCompeticionFormulaUno) {
    console.log('Estoy en ObtenerNombreGanadoresFormulaUno()');
    const GanadoresFormulaUno: {
      nombre: string[]
      id: number[]
    } = { nombre: [], id: [] };
    GanadoresFormulaUno.nombre = [];
    GanadoresFormulaUno.id = jornada.GanadoresFormulaUno;
    if (juegoSeleccionado.Modo === 'Individual') {
      for (let j = 0; j < GanadoresFormulaUno.id.length; j++) {
        // tslint:disable-next-line:prefer-for-of
        for (let k = 0; k < alumnoJuegoDeCompeticionFormulaUno.length; k++) {
          if (GanadoresFormulaUno.id[j] === alumnoJuegoDeCompeticionFormulaUno[k].id) {
            GanadoresFormulaUno.nombre[j] = alumnoJuegoDeCompeticionFormulaUno[k].nombre + ' '
              + alumnoJuegoDeCompeticionFormulaUno[k].primerApellido + ' '
              + alumnoJuegoDeCompeticionFormulaUno[k].segundoApellido;
          }
        }
      }
      console.log(GanadoresFormulaUno);
      return GanadoresFormulaUno;
    } else {
      for (let j = 0; j < GanadoresFormulaUno.id.length; j++) {
        // tslint:disable-next-line:prefer-for-of
        for (let k = 0; k < equipoJuegoDeCompeticionFormulaUno.length; k++) {
          console.log('GanadoresFormulaUno[j].id === equipoJuegoDeCompeticionFormulaUno[k].id :');
          console.log(GanadoresFormulaUno.id[j] + '===' + equipoJuegoDeCompeticionFormulaUno[k].id);
          if (GanadoresFormulaUno.id[j] === equipoJuegoDeCompeticionFormulaUno[k].id) {
            GanadoresFormulaUno.nombre[j] = equipoJuegoDeCompeticionFormulaUno[k].nombre;
          }
        }
      }
      console.log('GanadoresFormulaUno:');
      console.log(GanadoresFormulaUno);
      return GanadoresFormulaUno;
    }
  }

  public ClasificacionJornada(juegoSeleccionado: Juego, alumnoJuegoDeCompeticionFormulaUno: TablaAlumnoJuegoDeCompeticion[],
    equipoJuegoDeCompeticionFormulaUno: TablaEquipoJuegoDeCompeticion[], GanadoresFormulaUno: string[],
    GanadoresFormulaUnoId: number[]) {
    console.log('Estoy en calculos.ClasificacionJornada()');
    const ParticipantesFormulaUno: string[] = [];
    const PuntosFormulaUno: number[] = [];
    const Posicion: number[] = [];
    const ParticipantesId: number[] = [];
    if (GanadoresFormulaUno !== undefined) {
      GanadoresFormulaUno.forEach(ganador => ParticipantesFormulaUno.push(ganador));
      juegoSeleccionado.Puntos.forEach(punto => {
        PuntosFormulaUno.push(punto);
        console.log('Los Puntos del juego son: ' + punto);
      });
      // const PuntosFormulaUno: number[] = juegoSeleccionado.Puntos;
      if (juegoSeleccionado.Modo === 'Individual') {
        alumnoJuegoDeCompeticionFormulaUno.forEach(a => {
          const ParticipanteFormulaUno = a.nombre + ' ' + a.primerApellido + ' ' + a.segundoApellido;
          const ParticipanteId = a.id;
          const indexNoGanador = GanadoresFormulaUno.indexOf(ParticipanteFormulaUno);
          if (indexNoGanador === -1) {
            ParticipantesFormulaUno.push(ParticipanteFormulaUno);
            PuntosFormulaUno.push(0);
            ParticipantesId.push(ParticipanteId);
          }
        });
        for (let j = 0; j < ParticipantesFormulaUno.length; j++) {
          Posicion[j] = j + 1;
        }
      } else {
        console.log('Estamos en ClasificacionJornada() equipo');
        equipoJuegoDeCompeticionFormulaUno.forEach(a => {
          const ParticipanteFormulaUno = a.nombre;
          const ParticipanteId = a.id;
          const indexNoGanador = GanadoresFormulaUno.indexOf(ParticipanteFormulaUno);
          if (indexNoGanador === -1) {
            ParticipantesFormulaUno.push(ParticipanteFormulaUno);
            PuntosFormulaUno.push(0);
            ParticipantesId.push(ParticipanteId);
          }
        });
        for (let j = 0; j < ParticipantesFormulaUno.length; j++) {
          Posicion[j] = j + 1;
        }
      }
    } else {
      console.log('Esta jornada aún no tiene ganadores asignados');
      if (juegoSeleccionado.Modo === 'Individual') {
        alumnoJuegoDeCompeticionFormulaUno.forEach(a => {
          const ParticipanteFormulaUno = a.nombre + ' ' + a.primerApellido + ' ' + a.segundoApellido;
          const ParticipanteId = a.id;
          ParticipantesFormulaUno.push(ParticipanteFormulaUno);
          PuntosFormulaUno.push(0);
          ParticipantesId.push(ParticipanteId);
        });
        for (let j = 0; j < ParticipantesFormulaUno.length; j++) {
          Posicion[j] = j + 1;
        }
      } else {
        console.log('Estamos en ClasificacionJornada() equipo');
        equipoJuegoDeCompeticionFormulaUno.forEach(a => {
          const ParticipanteFormulaUno = a.nombre;
          const ParticipanteId = a.id;
          ParticipantesFormulaUno.push(ParticipanteFormulaUno);
          PuntosFormulaUno.push(0);
          ParticipantesId.push(ParticipanteId);
        });
        for (let j = 0; j < ParticipantesFormulaUno.length; j++) {
          Posicion[j] = j + 1;
        }
      }
    }
    const datosClasificaciónJornada = {
      participante: ParticipantesFormulaUno,
      puntos: PuntosFormulaUno,
      posicion: Posicion,
      participanteId: ParticipantesId
    };
    return datosClasificaciónJornada;
  }

  public GenerarTablaJornadasF1(juegoSeleccionado, jornadas, alumnoJuegoDeCompeticionFormulaUno,
    equipoJuegoDeCompeticionFormulaUno) {

    const TablaJornada: TablaJornadas[] = [];
    console.log('juego seleccionado:');
    console.log(juegoSeleccionado);
    for (let i = 0; i < juegoSeleccionado.NumeroTotalJornadas; i++) {
      let jornada: Jornada;
      const jornadaId = jornadas[i].id;
      jornada = jornadas.filter(res => res.id === jornadaId)[0];

      console.log('Ganadores de la jornada:');
      console.log(jornada.GanadoresFormulaUno);
      console.log('Fecha de la jornada');
      console.log(jornada.Fecha);
      if (juegoSeleccionado.Tipo === 'Juego De Competición Fórmula Uno') {

        if (jornada.Fecha === undefined && jornada.GanadoresFormulaUno === undefined) {
          const Disputada = false;
          TablaJornada[i] = new TablaJornadas(i + 1, jornada.Fecha, jornada.CriterioGanador, jornada.id, undefined, undefined, Disputada);

        } else if (jornada.Fecha === undefined && jornada.GanadoresFormulaUno !== undefined) {
          const GanadoresFormulaUno = this.ObtenerNombreGanadoresFormulaUno(juegoSeleccionado, jornada, alumnoJuegoDeCompeticionFormulaUno,
            equipoJuegoDeCompeticionFormulaUno);
          const Disputada = true;
          TablaJornada[i] = new TablaJornadas(i + 1, jornada.Fecha, jornada.CriterioGanador, jornada.id, GanadoresFormulaUno.nombre,
            GanadoresFormulaUno.id, Disputada);

        } else if (jornada.Fecha !== undefined && jornada.GanadoresFormulaUno === undefined) {
          const Disputada = false;
          TablaJornada[i] = new TablaJornadas(i + 1, jornada.Fecha, jornada.CriterioGanador, jornada.id,
            undefined, undefined, Disputada);

        } else {
          const GanadoresFormulaUno = this.ObtenerNombreGanadoresFormulaUno(juegoSeleccionado, jornada,
            alumnoJuegoDeCompeticionFormulaUno,
            equipoJuegoDeCompeticionFormulaUno);
          const Disputada = true;
          TablaJornada[i] = new TablaJornadas(i + 1, jornada.Fecha, jornada.CriterioGanador, jornada.id, GanadoresFormulaUno.nombre,
            GanadoresFormulaUno.id, Disputada);
        }
      }
    }
    return (TablaJornada);
  }

  public GenerarTablaJornadasLiga(juegoSeleccionado, jornadas, enfrentamientosJuego: EnfrentamientoLiga[][]) {
    const TablaJornada: TablaJornadas[] = [];
    console.log('juego seleccionado:');
    console.log(juegoSeleccionado);
    for (let i = 0; i < jornadas.length; i++) {
      let jornada: Jornada;
      const jornadaId = jornadas[i].id;
      jornada = jornadas.filter(res => res.id === jornadaId)[0];
      const enfrentamientosJornada: EnfrentamientoLiga[] = [];
      enfrentamientosJuego[i].forEach(enfrentamientoDeLaJornada => {
        console.log('%%%%%%%%%%');
        console.log(enfrentamientoDeLaJornada);
        if (enfrentamientoDeLaJornada.JornadaDeCompeticionLigaId === jornadaId) {
          enfrentamientosJornada.push(enfrentamientoDeLaJornada);
        }
      });
      console.log('Los enfrentamientosJornada con id ' + jornadaId + ' son:');
      console.log(enfrentamientosJornada);
      const Disputada: boolean = this.JornadaFinalizadaLiga(jornada, enfrentamientosJornada);
      TablaJornada[i] = new TablaJornadas(i + 1, jornada.Fecha, jornada.CriterioGanador, jornada.id, undefined, undefined, Disputada);
    }
    return TablaJornada;
  }

  public JornadaFinalizadaLiga(jornadaSeleccionada: Jornada, EnfrentamientosJornada: EnfrentamientoLiga[]) {
    let HayGanador = true;
    let jornadaFinalizada = true;
    if (jornadaSeleccionada.id === EnfrentamientosJornada[0].JornadaDeCompeticionLigaId) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < EnfrentamientosJornada.length; i++) {
        if (EnfrentamientosJornada[i].Ganador === undefined) {
          HayGanador = false;
        }
      }
      if (HayGanador === false) {
        jornadaFinalizada = false;
      }
    }
    return jornadaFinalizada;
  }

  public FormarEquiposAleatorios(individuos: any[], tamEquipos: number): any[] {
    const listaInicial = individuos;
    const numeroGrupos = Math.ceil(listaInicial.length / tamEquipos);
    console.log('Tamaño ' + tamEquipos);

    console.log('Numero de grupos ' + numeroGrupos);
    const equipos: any[] = [];
    for (let i = 0; i < numeroGrupos - 1; i++) {
      console.log('grupo ' + i);
      const equipo: any[] = [];
      for (let j = 0; j < tamEquipos; j++) {
        const n = Math.floor(Math.random() * listaInicial.length);
        console.log(n + ' ' + listaInicial[n]);
        equipo.push(listaInicial[n]);
        listaInicial.splice(n, 1);
      }
      equipos.push(equipo);
    }
    equipos.push(listaInicial);
    return equipos;
  }

  // Elimina el cuestionario (tanto el id del profe como del cuestinario estan en sesión.
  // Lo hago con un observable para que el componente que muestra la lista de cuestionarios
  // espere hasta que se haya acabado la operacion de borrar el cuestionario de la base de datos
  public EliminarCuestionario(): any {
    const eliminaObservable = new Observable(obs => {
      this.peticionesAPI.BorraCuestionario(
        this.sesion.DameProfesor().id,
        this.sesion.DameCuestionario().id)
        .subscribe(() => {
          this.EliminarPreguntasDelCuestionario();
          obs.next();
        });
    });
    return eliminaObservable;
  }

  // ESTA FUNCIÓN RECUPERA TODAS LAS PREGUNTAS DEL CUESTIONARIO QUE VAMOS A BORRAR Y DESPUÉS LAS BORRA. ESTO LO HACEMOS PARA NO
  // DEJAR RELACIONES PREGUNTADELCUESTIONARIO QUE NO NOS SIRVEN EN LA BASE DE DATOS
  private EliminarPreguntasDelCuestionario() {
    // Pido las preguntasDelCuestionario correspondientes al cuestionario que voy a borrar
    this.peticionesAPI.DameAsignacionesPreguntasACuestionario(this.sesion.DameCuestionario().id)
      .subscribe(preguntasDelCuestionario => {
        if (preguntasDelCuestionario[0] !== undefined) {

          // Una vez recibo las preguntas del cuestionario, las voy borrando una a una
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < preguntasDelCuestionario.length; i++) {
            this.peticionesAPI.BorraPreguntaDelCuestionario(preguntasDelCuestionario[i].id)
              .subscribe(() => {
                console.log('Pregunta del cuestionario borrada correctamente');
              });
          }
        } else {
          console.log('no hay preguntas en el cuestionario');
        }

      });
  }

  // Elimina la pregunta (La pregunta se guarda previamente en sesión.
  // Lo hago con un observable para que el componente que muestra la lista de preguntas
  // espere hasta que se haya acabado la operacion de borrar la pregunta de la base de datos.
  // La primera función elimina la imagen asociada a la pregunta, mientras que la segunda elimina el modelo de la pregunta.
  public EliminarPregunta(): any {
    const eliminaObservable = new Observable(obs => {
      //Miramos si la imagen está asociada a más de una pregunta
      var contador = 0;
      //Recuperamos todas las preguntas que hay en la BD
      this.peticionesAPI.DameTodasMisPreguntas(this.sesion.DameProfesor().id).subscribe(res => {
        if (res[0] !== undefined) {
          //Comparamos cada una de las imágenes con la que queremos eliminar.
          res.forEach(pregunta => {
            if (pregunta.Imagen == this.sesion.DamePregunta().Imagen) {
              contador++;
            }
          });

          //Si el contador es dos o más, la imagen se usa en más de una Pregunta y, por lo tanto, no se puede borrar.
          if (contador < 2) {
            this.peticionesAPI.BorrarImagenPregunta(this.sesion.DamePregunta().Imagen).subscribe();
            console.log("IMAGEN ELIMINADA");
          }
        }
      });

      console.log("IMAGEN EN USO")
      this.peticionesAPI.BorrarPregunta(
        this.sesion.DamePregunta().id)
        .subscribe(() => {
          this.EliminarPreguntasDelCuestionarioConPregunta();
          obs.next();
        });
    });
    return eliminaObservable;
  }

  // tslint:disable-next-line:max-line-length
  // ESTA FUNCIÓN RECUPERA TODOS LOS CUESTINARIOS QUE CONTIENEN ESA PREGUNTA Y DESPUÉS LA BORRA DE PREGUNTASDELCUESTIONARIO. ESTO LO HACEMOS PARA NO
  // DEJAR MATRICULAS QUE NO NOS SIRVEN EN LA BASE DE DATOS
  private EliminarPreguntasDelCuestionarioConPregunta() {
    // Pido las preguntasDelCuestionario correspondientes a la pregunta que voy a borrar
    this.peticionesAPI.DameCuestionariosConPregunta(this.sesion.DamePregunta().id)
      .subscribe(preguntasDelCuestionario => {
        if (preguntasDelCuestionario[0] !== undefined) {

          // Una vez recibo las preguntasDelCuestionario con esa pregunta, las voy borrando una a una
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < preguntasDelCuestionario.length; i++) {
            this.peticionesAPI.BorraPreguntaDelCuestionario(preguntasDelCuestionario[i].id)
              .subscribe(() => {
                console.log('Pregunta del cuestionario borrada correctamente');
              });
          }
        } else {
          console.log('no hay preguntas en el cuestionario');
        }

      });
  }

  public calcularLigaNumEquipos(numEquipos: number, numRondas: number): any[] {
    if (numEquipos % 2 !== 0) {
      numEquipos = numEquipos + 1;
    }
    const numParticupantes = numEquipos - 1;
    console.log('Vamos a crear los enfrentamientos');
    const numPartidosPorRonda = numEquipos / 2;

    this.rondas = [];

    console.log(this.rondas);
    for (let i = 0, k = 0; i < numRondas; i++) {

      this.rondas[i] = [];

      for (let j = 0; j < numPartidosPorRonda; j++) {

        this.rondas[i][j] = new EnfrentamientoLiga();
        this.rondas[i][j].JugadorUno = k;

        k++;

        if (k === numParticupantes) {
          k = 0;
        }
      }
    }

    for (let i = 0; i < numRondas; i++) {


      if (i % 2 === 0) {
        this.rondas[i][0].JugadorDos = numEquipos - 1;
      } else {
        this.rondas[i][0].JugadorDos = this.rondas[i][0].JugadorUno;
        this.rondas[i][0].JugadorUno = numEquipos - 1;
      }
    }

    const equipoMasAlto = numEquipos - 1;
    const equipoImparMasAlto = equipoMasAlto - 1;

    for (let i = 0, k = equipoImparMasAlto; i < numRondas; i++) {


      for (let j = 1; j < numPartidosPorRonda; j++) {
        this.rondas[i][j].JugadorDos = k;

        k--;

        if (k === -1) {
          k = equipoImparMasAlto;
        }
      }
    }
    console.log(this.rondas);
    return this.rondas;

  }

  public calcularLiga(numEquipos: number, NumeroDeJornadas: number, participantes: any, ID: number, Jornadas: Jornada[]) {
    console.log('Voy a calcular liga');
    console.log('Numero de jornadas ' + NumeroDeJornadas);
    console.log('Participantes ');
    console.log(participantes);
    console.log('Jornadas ');
    console.log(Jornadas);
    console.log('Numero de Jornadas' + Jornadas.length);
    this.rondas = this.calcularLigaNumEquipos(participantes.length, NumeroDeJornadas);
    console.log('rondas');
    console.log(this.rondas);
    this.guardarenfrentamientos(this.rondas, NumeroDeJornadas, participantes, Jornadas);
    console.log('Enrentaminetos guardados');
  }

  public guardarenfrentamientos(rondas: Array<Array<EnfrentamientoLiga>>, NumeroDeJornadas: number,
    participantes: any[], jornadas: Jornada[]) {

    console.log('Entro en guardar enfrentamientos');
    const numPartidosPorRonda = participantes.length / 2;

    for (let i = 0; i < jornadas.length; i++) {
      console.log('jornada' + i);

      for (let j = 0; j < numPartidosPorRonda; j++) {
        // tslint:disable-next-line:prefer-const
        let EnfrentamientoLigaa: EnfrentamientoLiga;
        if (rondas[i][j].JugadorUno === participantes.length) {
          EnfrentamientoLigaa = new EnfrentamientoLiga(participantes[rondas[i][j].JugadorDos].id,
            participantes[rondas[i][j].JugadorDos].id, undefined, jornadas[i].id);

        } else if (rondas[i][j].JugadorDos === participantes.length) {
          EnfrentamientoLigaa = new EnfrentamientoLiga(participantes[rondas[i][j].JugadorUno].id,
            participantes[rondas[i][j].JugadorUno].id, undefined, jornadas[i].id);

        } else {
          EnfrentamientoLigaa = new EnfrentamientoLiga(participantes[rondas[i][j].JugadorUno].id,
            participantes[rondas[i][j].JugadorDos].id, undefined, jornadas[i].id);
        }
        console.log('mostramos enrentamiento');
        // console.log(EnfrentamientoLigaa);
        if (EnfrentamientoLigaa.JugadorUno !== EnfrentamientoLigaa.JugadorDos) {
          this.peticionesAPI.CrearEnrentamientoLiga(EnfrentamientoLigaa, jornadas[i].id)
            .subscribe(enfrentamientocreado => {
              console.log('enfrentamiento creado');
              console.log(enfrentamientocreado);
            });
        }
      }
    }
  }

  public DameTablaeditarPuntos(juegoSeleccionado: Juego) {
    this.TablaeditarPuntos = [];

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < juegoSeleccionado.Puntos.length; i++) {
      this.TablaeditarPuntos[i] = new TablaPuntosFormulaUno(i + 1, juegoSeleccionado.Puntos[i]);
    }
    return this.TablaeditarPuntos;
  }

  public JornadaFinalizada(juegoSeleccionado: Juego, jornadaSeleccionada: TablaJornadas) {
    let jornadaFinalizada = false;
    if (jornadaSeleccionada.Disputada === true) {
      jornadaFinalizada = true;
    }
    return jornadaFinalizada;
    // let jornadaFinalizada = false;
    // if (juegoSeleccionado.Tipo === 'Juego De Competición Liga') {
    //   if (jornadaSeleccionada.Disputada === true) {
    //     jornadaFinalizada = true;
    //   } else {
    //     jornadaFinalizada = false;
    //   }
    // } else if (juegoSeleccionado.Tipo === 'Juego De Competición Fórmula Uno') {
    //   if (jornadaSeleccionada.GanadoresFormulaUno.id === undefined &&
    //       jornadaSeleccionada.GanadoresFormulaUno.nombre === undefined) {
    //         jornadaFinalizada = false;
    //   } else {
    //     jornadaFinalizada = true;
    //   }
    // }
    // return jornadaFinalizada;
  }

  public ObtenerNombreParticipante(participantesId: number[], listaAlumnosClasificacion: TablaAlumnoJuegoDeCompeticion[],
    listaEquiposClasificacion: TablaEquipoJuegoDeCompeticion[], juegoSeleccionado: Juego) {
    console.log('Estoy en ObtenerNombreParticipante()');
    const participantesNombre: string[] = [];
    if (juegoSeleccionado.Modo === 'Individual') {
      participantesId.forEach(participanteId => {
        const alumno = listaAlumnosClasificacion.filter(a => a.id === participanteId)[0];
        participantesNombre.push(alumno.nombre + ' ' + alumno.primerApellido + ' ' + alumno.segundoApellido);
      });
    } else {
      const equipos: TablaEquipoJuegoDeCompeticion[] = [];
      participantesId.forEach(participanteId => {
        participantesNombre.push(listaEquiposClasificacion.filter(e => e.id === participanteId)[0].nombre);
      });
    }
    console.log('Los nombres de los participantes que puntúan son: ');
    console.log(participantesNombre);
    return participantesNombre;
  }



  ////////////////////////////////////////////     JUEGO DE COMPETICIÓN  LIGA    ////////////////////////////////////////
  public PrepararTablaRankingIndividualLiga(listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeCompeticionLiga[],
    alumnosDelJuego: Alumno[], jornadasDelJuego: Jornada[],
    enfrentamientosDelJuego: EnfrentamientoLiga[][]): TablaAlumnoJuegoDeCompeticion[] {
    const rankingJuegoDeCompeticion: TablaAlumnoJuegoDeCompeticion[] = [];
    console.log(' Vamos a preparar la tabla del ranking individual de Competición Liga');
    console.log('la lista de alumnos ordenada es: ');
    console.log(listaAlumnosOrdenadaPorPuntos);
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
    console.log('El ranking es: ');
    console.log(rankingJuegoDeCompeticionFinal);
    return rankingJuegoDeCompeticionFinal;
  }

  public PrepararTablaRankingEquipoLiga(listaEquiposOrdenadaPorPuntos: EquipoJuegoDeCompeticionLiga[],
    equiposDelJuego: Equipo[], jornadasDelJuego: Jornada[],
    enfrentamientosDelJuego: EnfrentamientoLiga[][]): TablaEquipoJuegoDeCompeticion[] {
    const rankingJuegoDeCompeticion: TablaEquipoJuegoDeCompeticion[] = [];
    console.log(' Vamos a preparar la tabla del ranking por equipos de Competición Liga');
    console.log('la lista de equipos ordenada es: ');
    console.log(listaEquiposOrdenadaPorPuntos);
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
    console.log('El ranking es: ');
    console.log(rankingJuegoDeCompeticionFinal);
    return rankingJuegoDeCompeticionFinal;
  }

  public ConstruirTablaEnfrentamientos(EnfrentamientosJornadaSeleccionada: EnfrentamientoLiga[],
    listaAlumnosClasificacion: TablaAlumnoJuegoDeCompeticion[],
    listaEquiposClasificacion: TablaEquipoJuegoDeCompeticion[],
    juegoSeleccionado: Juego) {
    console.log('Aquí tendré la tabla de enfrentamientos, los enfrentamientos sonc:');
    console.log(EnfrentamientosJornadaSeleccionada);
    console.log('Distinción entre Individual y equipos');
    if (juegoSeleccionado.Modo === 'Individual') {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < EnfrentamientosJornadaSeleccionada.length; i++) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < listaAlumnosClasificacion.length; j++) {
          if (EnfrentamientosJornadaSeleccionada[i].JugadorUno === listaAlumnosClasificacion[j].id) {
            EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno = listaAlumnosClasificacion[j].nombre + ' ' +
              listaAlumnosClasificacion[j].primerApellido + ' ' +
              listaAlumnosClasificacion[j].segundoApellido;
            if (EnfrentamientosJornadaSeleccionada[i].Ganador === listaAlumnosClasificacion[j].id) {
              EnfrentamientosJornadaSeleccionada[i].nombreGanador = listaAlumnosClasificacion[j].nombre + ' ' +
                listaAlumnosClasificacion[j].primerApellido + ' ' +
                listaAlumnosClasificacion[j].segundoApellido;
            } else if (EnfrentamientosJornadaSeleccionada[i].Ganador === 0) {
              EnfrentamientosJornadaSeleccionada[i].nombreGanador = 'Empate';
            } else if (EnfrentamientosJornadaSeleccionada[i].Ganador === undefined) {
              EnfrentamientosJornadaSeleccionada[i].nombreGanador = '-';
            }
          } else if (EnfrentamientosJornadaSeleccionada[i].JugadorDos === listaAlumnosClasificacion[j].id) {
            EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos = listaAlumnosClasificacion[j].nombre + ' ' +
              listaAlumnosClasificacion[j].primerApellido + ' ' +
              listaAlumnosClasificacion[j].segundoApellido;
            if (EnfrentamientosJornadaSeleccionada[i].Ganador === listaAlumnosClasificacion[j].id) {
              EnfrentamientosJornadaSeleccionada[i].nombreGanador = listaAlumnosClasificacion[j].nombre + ' ' +
                listaAlumnosClasificacion[j].primerApellido + ' ' +
                listaAlumnosClasificacion[j].segundoApellido;
            } else if (EnfrentamientosJornadaSeleccionada[i].Ganador === 0) {
              EnfrentamientosJornadaSeleccionada[i].nombreGanador = 'Empate';
            } else if (EnfrentamientosJornadaSeleccionada[i].Ganador === undefined) {
              EnfrentamientosJornadaSeleccionada[i].nombreGanador = '-';
            }
          }
        }
      }

    } else {
      console.log('Estoy en ConstruirTablaEnfrentamientos() equipos');
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < EnfrentamientosJornadaSeleccionada.length; i++) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < listaEquiposClasificacion.length; j++) {
          if (EnfrentamientosJornadaSeleccionada[i].JugadorUno === listaEquiposClasificacion[j].id) {
            EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno = listaEquiposClasificacion[j].nombre;
            if (EnfrentamientosJornadaSeleccionada[i].Ganador === listaEquiposClasificacion[j].id) {
              EnfrentamientosJornadaSeleccionada[i].nombreGanador = listaEquiposClasificacion[j].nombre;
            } else if (EnfrentamientosJornadaSeleccionada[i].Ganador === 0) {
              EnfrentamientosJornadaSeleccionada[i].nombreGanador = 'Empate';
            } else if (EnfrentamientosJornadaSeleccionada[i].Ganador === undefined) {
              EnfrentamientosJornadaSeleccionada[i].nombreGanador = '-';
            }
          } else if (EnfrentamientosJornadaSeleccionada[i].JugadorDos === listaEquiposClasificacion[j].id) {
            EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos = listaEquiposClasificacion[j].nombre;
            if (EnfrentamientosJornadaSeleccionada[i].Ganador === listaEquiposClasificacion[j].id) {
              EnfrentamientosJornadaSeleccionada[i].nombreGanador = listaEquiposClasificacion[j].nombre;
            } else if (EnfrentamientosJornadaSeleccionada[i].Ganador === 0) {
              EnfrentamientosJornadaSeleccionada[i].nombreGanador = 'Empate';
            } else if (EnfrentamientosJornadaSeleccionada[i].Ganador === undefined) {
              EnfrentamientosJornadaSeleccionada[i].nombreGanador = '-';
            }
          }
        }
      }
    }
    return EnfrentamientosJornadaSeleccionada;
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
    for (let cont = 0; cont < rankingJuegoDeCompeticion.length; cont++) {
      rankingJuegoDeCompeticion[cont].partidosTotales = informacionPartidos[cont].partidosTotales;
      rankingJuegoDeCompeticion[cont].partidosJugados = informacionPartidos[cont].partidosJugados;
      rankingJuegoDeCompeticion[cont].partidosGanados = informacionPartidos[cont].partidosGanados;
      rankingJuegoDeCompeticion[cont].partidosEmpatados = informacionPartidos[cont].partidosEmpatados;
      rankingJuegoDeCompeticion[cont].partidosPerdidos = informacionPartidos[cont].partidosPerdidos;
    }
    console.log('----------------------------------');
    console.log(rankingJuegoDeCompeticion);
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
      for (let enfrentamiento = 0; enfrentamiento < enfrentamientosDelJuego[jornada].length; enfrentamiento++) {
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


  // --------------- Antigua metodología asignar ganadores manualmente --------------- //

  public RevisarMultipleSeleccion(enfrentamientosSeleccionadosColumnaUno: EnfrentamientoLiga[],
    enfrentamientosSeleccionadosColumnaDos: EnfrentamientoLiga[],
    enfrentamientosSeleccionadosColumnaTres: EnfrentamientoLiga[]) {
    console.log('Selección en ColumnaUno');
    console.log(enfrentamientosSeleccionadosColumnaUno);
    console.log('Selección en ColumnaDos');
    console.log(enfrentamientosSeleccionadosColumnaDos);
    console.log('Selección en ColumnaTres');
    console.log(enfrentamientosSeleccionadosColumnaTres);

    let avisoMasDeUnGanadorMarcadoDosEmpate = false;
    let avisoMasDeUnGanadorMarcadoUnoDos = false;
    let avisoMasDeUnGanadorMarcadoUnoEmpate = false;

    // Segundo miramos si solo hay una selección por enfrentamiento
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < enfrentamientosSeleccionadosColumnaUno.length; i++) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < enfrentamientosSeleccionadosColumnaDos.length; j++) {
        if (enfrentamientosSeleccionadosColumnaUno[i].id === enfrentamientosSeleccionadosColumnaDos[j].id) {
          avisoMasDeUnGanadorMarcadoUnoDos = true;
          console.log('Hay alguna selección con ganadorUno y ganadorDos, poner el sweatalert');
          console.log(enfrentamientosSeleccionadosColumnaDos[j]);
          console.log(enfrentamientosSeleccionadosColumnaUno[i].id);
        }
      }
      // tslint:disable-next-line:prefer-for-of
      for (let k = 0; k < enfrentamientosSeleccionadosColumnaTres.length; k++) {
        if (enfrentamientosSeleccionadosColumnaUno[i].id === enfrentamientosSeleccionadosColumnaTres[k].id) {
          avisoMasDeUnGanadorMarcadoUnoEmpate = true;
          console.log('Hay alguna selección con ganadorUno y Empate, poner el sweatalert');
          console.log(enfrentamientosSeleccionadosColumnaUno[i]);
          console.log(enfrentamientosSeleccionadosColumnaTres[k].id);
        }
      }
    }

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < enfrentamientosSeleccionadosColumnaDos.length; i++) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < enfrentamientosSeleccionadosColumnaTres.length; j++) {
        if (enfrentamientosSeleccionadosColumnaDos[i].id === enfrentamientosSeleccionadosColumnaTres[j].id) {
          avisoMasDeUnGanadorMarcadoDosEmpate = true;
          console.log('Hay alguna selección con ganadorDos y Empate, poner sweatalert');
          console.log(enfrentamientosSeleccionadosColumnaDos[i]);
          console.log(enfrentamientosSeleccionadosColumnaTres[j].id);
        }
      }
    }

    // tslint:disable-next-line:max-line-length
    console.log('avisoMasDeUnGanadorMarcadoUnoEmpate = ' + avisoMasDeUnGanadorMarcadoUnoEmpate);
    console.log('avisoMasDeUnGanadorMarcadoDosEmpate = ' + avisoMasDeUnGanadorMarcadoDosEmpate);
    console.log('avisoMasDeUnGanadorMarcadoUnoDos = ' + avisoMasDeUnGanadorMarcadoUnoDos);

    if (avisoMasDeUnGanadorMarcadoDosEmpate === false && avisoMasDeUnGanadorMarcadoUnoDos === false
      && avisoMasDeUnGanadorMarcadoUnoEmpate === false) {
      return false;
    } else {
      return true;
    }
  }

  public AsignarGanadorEquipos(enfrentamientosSeleccionadosColumna: EnfrentamientoLiga[],
    enfrentamientosJornadaSeleccionada: EnfrentamientoLiga[],
    listaEquiposClasificacion: TablaEquipoJuegoDeCompeticion[],
    equiposJuegoDeCompeticionLiga: EquipoJuegoDeCompeticionLiga[],
    juegoSeleccionado: Juego, ganador: number, Resultados: {
      buenos: string
      malos: string
    }) {
    console.log('Estoy en AsignarGanadorEquipos()');
    console.log(enfrentamientosSeleccionadosColumna);
    console.log(enfrentamientosJornadaSeleccionada);
    console.log(listaEquiposClasificacion);
    console.log(equiposJuegoDeCompeticionLiga);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < enfrentamientosSeleccionadosColumna.length; i++) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < listaEquiposClasificacion.length; j++) {
        const nombreCompleto = listaEquiposClasificacion[j].nombre;
        if (nombreCompleto === enfrentamientosSeleccionadosColumna[i].nombreJugadorDos && ganador === 2) {
          console.log('He encontrado el equipo: ' + enfrentamientosSeleccionadosColumna[i].nombreJugadorDos);

          // Miramos en la base de datos si para este enfrentamiento ya se había seleccionado un ganador.
          // Si ya estaba asignado que aparezca un mensaje avisando (Si da a aceptar se reasigna el ganador seleccionado, si da a
          // cancelar no se sobreescribe en la base de datos, se queda tal cual)
          // tslint:disable-next-line:prefer-for-of
          for (let k = 0; k < enfrentamientosJornadaSeleccionada.length; k++) {
            // tslint:disable-next-line:max-line-length
            if (enfrentamientosJornadaSeleccionada[k].nombreJugadorUno === enfrentamientosSeleccionadosColumna[i].nombreJugadorUno &&
              // tslint:disable-next-line:max-line-length
              enfrentamientosJornadaSeleccionada[k].nombreJugadorDos === enfrentamientosSeleccionadosColumna[i].nombreJugadorDos) {
              console.log('Ya estoy en el el enfrentamiento que quiero');
              if (enfrentamientosJornadaSeleccionada[k].Ganador === undefined) {
                console.log('Este enfrentamiento no tiene ganador asignado:');
                console.log(enfrentamientosJornadaSeleccionada[k]);
                // Tengo que actualizar el ganador en EnfrentamientoLiga
                enfrentamientosJornadaSeleccionada[k].Ganador = enfrentamientosSeleccionadosColumna[i].JugadorDos;
                const enfrentamiento = new EnfrentamientoLiga(enfrentamientosJornadaSeleccionada[k].JugadorUno,
                  enfrentamientosJornadaSeleccionada[k].JugadorDos,
                  enfrentamientosJornadaSeleccionada[k].Ganador,
                  enfrentamientosJornadaSeleccionada[k].JornadaDeCompeticionLigaId,
                  undefined, undefined,
                  enfrentamientosJornadaSeleccionada[k].id);
                this.peticionesAPI.PonGanadorDelEnfrentamiento(enfrentamiento).
                  subscribe(res => console.log(res));
                console.log('El enfrentamiento con el ganador actualizado queda: ');
                console.log(enfrentamientosJornadaSeleccionada[k]);
                Resultados.buenos = Resultados.buenos + '\n' + 'Ganador: ' + enfrentamientosSeleccionadosColumna[i].nombreJugadorDos;

                // Tengo que actualizar el EquipoJuegoDeCompeticionLiga con los nuevos puntos
                console.log('El equipo ganador es: ' + listaEquiposClasificacion[j].nombre);
                console.log('Los puntos antes de registrar el partido ganado: ' + listaEquiposClasificacion[j].puntos);
                listaEquiposClasificacion[j].puntos = listaEquiposClasificacion[j].puntos + 3;
                console.log('Los puntos actualizados después de registrar el partido ganado: '
                  + listaEquiposClasificacion[j].puntos);
                console.log(listaEquiposClasificacion[j]);
                const EquipoId = listaEquiposClasificacion[j].id;
                console.log('el id del equipo es: ' + EquipoId);
                // tslint:disable-next-line:prefer-for-of
                for (let m = 0; m < equiposJuegoDeCompeticionLiga.length; m++) {
                  if (equiposJuegoDeCompeticionLiga[m].EquipoId === EquipoId) {
                    this.EquipoJuegoDeCompeticionLigaId = equiposJuegoDeCompeticionLiga[m].id;
                  }
                }
                const equipoGanador = new EquipoJuegoDeCompeticionLiga(EquipoId,
                  juegoSeleccionado.id,
                  listaEquiposClasificacion[j].puntos,
                  this.EquipoJuegoDeCompeticionLigaId);
                console.log(equipoGanador);
                console.log('El id del alumno es: ' + equipoGanador.EquipoId + ' y los puntos actualizados son: '
                  + equipoGanador.PuntosTotalesEquipo);
                this.peticionesAPI.PonPuntosEquipoGanadorJuegoDeCompeticionLiga(equipoGanador).
                  subscribe(res => console.log(res));
              } else {
                console.log('Este enfrentamiento ya tiene asignado un ganador: ');
                console.log(enfrentamientosJornadaSeleccionada[k]);
                Resultados.malos = Resultados.malos + ' ' + (k + 1) + 'º';
              }
            }
          }
        } else if (nombreCompleto === enfrentamientosSeleccionadosColumna[i].nombreJugadorUno && ganador === 1) {
          console.log('He encontrado el equipo: ' + enfrentamientosSeleccionadosColumna[i].nombreJugadorUno);

          // Miramos en la base de datos si para este enfrentamiento ya se había seleccionado un ganador.
          // Si ya estaba asignado que aparezca un mensaje avisando (Si da a aceptar se reasigna el ganador seleccionado, si da a
          // cancelar no se sobreescribe en la base de datos, se queda tal cual)
          // tslint:disable-next-line:prefer-for-of
          for (let k = 0; k < enfrentamientosJornadaSeleccionada.length; k++) {
            // tslint:disable-next-line:max-line-length
            if (enfrentamientosJornadaSeleccionada[k].nombreJugadorUno === enfrentamientosSeleccionadosColumna[i].nombreJugadorUno &&
              // tslint:disable-next-line:max-line-length
              enfrentamientosJornadaSeleccionada[k].nombreJugadorDos === enfrentamientosSeleccionadosColumna[i].nombreJugadorDos) {
              console.log('Ya estoy en el el enfrentamiento que quiero');
              if (enfrentamientosJornadaSeleccionada[k].Ganador === undefined) {
                console.log('Este enfrentamiento no tiene ganador asignado:');
                console.log(enfrentamientosJornadaSeleccionada[k]);
                // Tengo que actualizar el ganador en EnfrentamientoLiga
                enfrentamientosJornadaSeleccionada[k].Ganador = enfrentamientosSeleccionadosColumna[i].JugadorUno;
                const enfrentamiento = new EnfrentamientoLiga(enfrentamientosJornadaSeleccionada[k].JugadorUno,
                  enfrentamientosJornadaSeleccionada[k].JugadorDos,
                  enfrentamientosJornadaSeleccionada[k].Ganador,
                  enfrentamientosJornadaSeleccionada[k].JornadaDeCompeticionLigaId,
                  undefined, undefined,
                  enfrentamientosJornadaSeleccionada[k].id);
                this.peticionesAPI.PonGanadorDelEnfrentamiento(enfrentamiento).
                  subscribe(res => console.log(res));
                console.log('El enfrentamiento con el ganador actualizado queda: ');
                console.log(enfrentamientosJornadaSeleccionada[k]);
                Resultados.buenos = Resultados.buenos + '\n' + 'Ganador: ' + enfrentamientosSeleccionadosColumna[i].nombreJugadorDos;

                // Tengo que actualizar el EquipoJuegoDeCompeticionLiga con los nuevos puntos
                console.log('El equipo ganador es: ' + listaEquiposClasificacion[j].nombre);
                console.log('Los puntos antes de registrar el partido ganado: ' + listaEquiposClasificacion[j].puntos);
                listaEquiposClasificacion[j].puntos = listaEquiposClasificacion[j].puntos + 3;
                console.log('Los puntos actualizados después de registrar el partido ganado: '
                  + listaEquiposClasificacion[j].puntos);
                console.log(listaEquiposClasificacion[j]);
                const EquipoId = listaEquiposClasificacion[j].id;
                console.log('el id del equipo es: ' + EquipoId);
                // tslint:disable-next-line:prefer-for-of
                for (let m = 0; m < equiposJuegoDeCompeticionLiga.length; m++) {
                  if (equiposJuegoDeCompeticionLiga[m].EquipoId === EquipoId) {
                    this.EquipoJuegoDeCompeticionLigaId = equiposJuegoDeCompeticionLiga[m].id;
                  }
                }
                const equipoGanador = new EquipoJuegoDeCompeticionLiga(EquipoId,
                  juegoSeleccionado.id,
                  listaEquiposClasificacion[j].puntos,
                  this.EquipoJuegoDeCompeticionLigaId);
                console.log(equipoGanador);
                console.log('El id del alumno es: ' + equipoGanador.EquipoId + ' y los puntos actualizados son: '
                  + equipoGanador.PuntosTotalesEquipo);
                this.peticionesAPI.PonPuntosEquipoGanadorJuegoDeCompeticionLiga(equipoGanador).
                  subscribe(res => console.log(res));
              } else {
                console.log('Este enfrentamiento ya tiene asignado un ganador: ');
                console.log(enfrentamientosJornadaSeleccionada[k]);
                Resultados.malos = Resultados.malos + ' ' + (k + 1) + 'º';
              }
            }
          }
        }
      }
    }
    return Resultados;
  }

  public AsignarGanadorIndividual(enfrentamientosSeleccionadosColumna: EnfrentamientoLiga[],
    enfrentamientosJornadaSeleccionada: EnfrentamientoLiga[],
    listaAlumnosClasificacion: TablaAlumnoJuegoDeCompeticion[],
    alumnosJuegoDeCompeticionLiga: AlumnoJuegoDeCompeticionLiga[],
    juegoSeleccionado: Juego, ganador: number, Resultados: {
      buenos: string
      malos: string
    }) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < enfrentamientosSeleccionadosColumna.length; i++) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < listaAlumnosClasificacion.length; j++) {
        const nombreCompleto = listaAlumnosClasificacion[j].nombre + ' ' + listaAlumnosClasificacion[j].primerApellido
          + ' ' + listaAlumnosClasificacion[j].segundoApellido;
        //  GANADOR COLUMNA DOS
        if (nombreCompleto === enfrentamientosSeleccionadosColumna[i].nombreJugadorDos && ganador === 2) {
          console.log('He encontrado el alumno: ' + enfrentamientosSeleccionadosColumna[i].nombreJugadorDos);

          // Miramos en la base de datos si para este enfrentamiento ya se había seleccionado un ganador.
          // Si ya estaba asignado que aparezca un mensaje avisando (Si da a aceptar se reasigna el ganador seleccionado, si da a
          // cancelar no se sobreescribe en la base de datos, se queda tal cual)
          // tslint:disable-next-line:prefer-for-of
          for (let k = 0; k < enfrentamientosJornadaSeleccionada.length; k++) {
            // tslint:disable-next-line:max-line-length
            if (enfrentamientosJornadaSeleccionada[k].nombreJugadorUno === enfrentamientosSeleccionadosColumna[i].nombreJugadorUno &&
              // tslint:disable-next-line:max-line-length
              enfrentamientosJornadaSeleccionada[k].nombreJugadorDos === enfrentamientosSeleccionadosColumna[i].nombreJugadorDos) {
              console.log('Ya estoy en el el enfrentamiento que quiero');
              if (enfrentamientosJornadaSeleccionada[k].Ganador === undefined) {
                console.log('Este enfrentamiento no tiene ganador asignado:');
                console.log(enfrentamientosJornadaSeleccionada[k]);
                // Tengo que actualizar el ganador en EnfrentamientoLiga
                enfrentamientosJornadaSeleccionada[k].Ganador = enfrentamientosSeleccionadosColumna[i].JugadorDos;
                const enfrentamiento = new EnfrentamientoLiga(enfrentamientosJornadaSeleccionada[k].JugadorUno,
                  enfrentamientosJornadaSeleccionada[k].JugadorDos,
                  enfrentamientosJornadaSeleccionada[k].Ganador,
                  enfrentamientosJornadaSeleccionada[k].JornadaDeCompeticionLigaId,
                  undefined, undefined,
                  enfrentamientosJornadaSeleccionada[k].id);
                this.peticionesAPI.PonGanadorDelEnfrentamiento(enfrentamiento).
                  subscribe(res => console.log(res));
                console.log('El enfrentamiento con el ganador actualizado queda: ');
                console.log(enfrentamientosJornadaSeleccionada[k]);
                Resultados.buenos = Resultados.buenos + '\n' + 'Ganador: ' + enfrentamientosSeleccionadosColumna[i].nombreJugadorDos;

                // Tengo que actualizar el AlumnoJuegoDeCompeticionLiga con los nuevos puntos
                console.log('El alumno ganador es: ' + listaAlumnosClasificacion[j].nombre);
                console.log('Los puntos antes de registrar el partido ganado: ' + listaAlumnosClasificacion[j].puntos);
                listaAlumnosClasificacion[j].puntos = listaAlumnosClasificacion[j].puntos + 3;
                console.log('Los puntos actualizados después de registrar el partido ganado: '
                  + listaAlumnosClasificacion[j].puntos);
                console.log(listaAlumnosClasificacion[j]);
                const AlumnoId = listaAlumnosClasificacion[j].id;
                console.log('el id del alumno es: ' + AlumnoId);
                // tslint:disable-next-line:prefer-for-of
                for (let m = 0; m < alumnosJuegoDeCompeticionLiga.length; m++) {
                  if (alumnosJuegoDeCompeticionLiga[m].AlumnoId === AlumnoId) {
                    this.AlumnoJuegoDeCompeticionLigaId = alumnosJuegoDeCompeticionLiga[m].id;
                  }
                }
                const alumnoGanador = new AlumnoJuegoDeCompeticionLiga(AlumnoId,
                  juegoSeleccionado.id,
                  listaAlumnosClasificacion[j].puntos,
                  this.AlumnoJuegoDeCompeticionLigaId);
                console.log(alumnoGanador);
                console.log('El id del alumno es: ' + alumnoGanador.AlumnoId + ' y los puntos actualizados son: '
                  + alumnoGanador.PuntosTotalesAlumno);
                this.peticionesAPI.PonPuntosAlumnoGanadorJuegoDeCompeticionLiga(alumnoGanador).
                  subscribe(res => console.log(res));
              } else {
                console.log('Este enfrentamiento ya tiene asignado un ganador: ');
                console.log(enfrentamientosJornadaSeleccionada[k]);
                Resultados.malos = Resultados.malos + ' ' + (k + 1) + 'º';
              }
            }
          }
          //  GANADOR COLUMNA DOS
        } else if (nombreCompleto === enfrentamientosSeleccionadosColumna[i].nombreJugadorUno && ganador === 1) {
          console.log('He encontrado el alumno: ' + enfrentamientosSeleccionadosColumna[i].nombreJugadorUno);

          // Miramos en la base de datos si para este enfrentamiento ya se había seleccionado un ganador.
          // Si ya estaba asignado que aparezca un mensaje avisando (Si da a aceptar se reasigna el ganador seleccionado, si da a
          // cancelar no se sobreescribe en la base de datos, se queda tal cual)
          // tslint:disable-next-line:prefer-for-of
          for (let k = 0; k < enfrentamientosJornadaSeleccionada.length; k++) {
            // tslint:disable-next-line:max-line-length
            if (enfrentamientosJornadaSeleccionada[k].nombreJugadorUno === enfrentamientosSeleccionadosColumna[i].nombreJugadorUno &&
              // tslint:disable-next-line:max-line-length
              enfrentamientosJornadaSeleccionada[k].nombreJugadorDos === enfrentamientosSeleccionadosColumna[i].nombreJugadorDos) {
              console.log('Ya estoy en el el enfrentamiento que quiero');
              if (enfrentamientosJornadaSeleccionada[k].Ganador === undefined) {
                console.log('Este enfrentamiento no tiene ganador asignado:');
                console.log(enfrentamientosJornadaSeleccionada[k]);
                // Tengo que actualizar el ganador en EnfrentamientoLiga
                enfrentamientosJornadaSeleccionada[k].Ganador = enfrentamientosSeleccionadosColumna[i].JugadorUno;
                const enfrentamiento = new EnfrentamientoLiga(enfrentamientosJornadaSeleccionada[k].JugadorUno,
                  enfrentamientosJornadaSeleccionada[k].JugadorDos,
                  enfrentamientosJornadaSeleccionada[k].Ganador,
                  enfrentamientosJornadaSeleccionada[k].JornadaDeCompeticionLigaId,
                  undefined, undefined,
                  enfrentamientosJornadaSeleccionada[k].id);
                this.peticionesAPI.PonGanadorDelEnfrentamiento(enfrentamiento).
                  subscribe(res => console.log(res));
                console.log('El enfrentamiento con el ganador actualizado queda: ');
                console.log(enfrentamientosJornadaSeleccionada[k]);
                Resultados.buenos = Resultados.buenos + '\n' + 'Ganador: ' + enfrentamientosSeleccionadosColumna[i].nombreJugadorUno;

                // Tengo que actualizar el AlumnoJuegoDeCompeticionLiga con los nuevos puntos
                console.log('El alumno ganador es: ' + listaAlumnosClasificacion[j].nombre);
                console.log('Los puntos antes de registrar el partido ganado: ' + listaAlumnosClasificacion[j].puntos);
                listaAlumnosClasificacion[j].puntos = listaAlumnosClasificacion[j].puntos + 3;
                console.log('Los puntos actualizados después de registrar el partido ganado: '
                  + listaAlumnosClasificacion[j].puntos);
                console.log(listaAlumnosClasificacion[j]);
                const AlumnoId = listaAlumnosClasificacion[j].id;
                console.log('el id del alumno es: ' + AlumnoId);
                // tslint:disable-next-line:prefer-for-of
                for (let m = 0; m < alumnosJuegoDeCompeticionLiga.length; m++) {
                  if (alumnosJuegoDeCompeticionLiga[m].AlumnoId === AlumnoId) {
                    this.AlumnoJuegoDeCompeticionLigaId = alumnosJuegoDeCompeticionLiga[m].id;
                  }
                }
                const alumnoGanador = new AlumnoJuegoDeCompeticionLiga(AlumnoId,
                  juegoSeleccionado.id,
                  listaAlumnosClasificacion[j].puntos,
                  this.AlumnoJuegoDeCompeticionLigaId);
                console.log(alumnoGanador);
                console.log('El id del alumno es: ' + alumnoGanador.AlumnoId + ' y los puntos actualizados son: '
                  + alumnoGanador.PuntosTotalesAlumno);
                this.peticionesAPI.PonPuntosAlumnoGanadorJuegoDeCompeticionLiga(alumnoGanador).
                  subscribe(res => console.log(res));
              } else {
                console.log('Este enfrentamiento ya tiene asignado un ganador: ');
                console.log(enfrentamientosJornadaSeleccionada[k]);
                Resultados.malos = Resultados.malos + ' ' + (k + 1) + 'º';
              }
            }
          }

        }
      }
    }
    return Resultados;
  }

  public AsignarEmpateIndividual(enfrentamientosSeleccionadosColumna: EnfrentamientoLiga[],
    enfrentamientosJornadaSeleccionada: EnfrentamientoLiga[],
    listaAlumnosClasificacion: TablaAlumnoJuegoDeCompeticion[],
    alumnosJuegoDeCompeticionLiga: AlumnoJuegoDeCompeticionLiga[],
    juegoSeleccionado: Juego, Resultados: {
      buenos: string
      malos: string
    }) {
    let alumnosConPuntosSumados = 0;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < enfrentamientosSeleccionadosColumna.length; i++) {
      let enfrentamientoEmpateRegistrado = false;
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < listaAlumnosClasificacion.length; j++) {
        const nombreCompleto = listaAlumnosClasificacion[j].nombre + ' ' + listaAlumnosClasificacion[j].primerApellido
          + ' ' + listaAlumnosClasificacion[j].segundoApellido;
        if (nombreCompleto === enfrentamientosSeleccionadosColumna[i].nombreJugadorDos ||
          nombreCompleto === enfrentamientosSeleccionadosColumna[i].nombreJugadorUno) {
          console.log('He encontrado el alumno: ' + nombreCompleto);
          console.log('Los puntos antes de registrar el partido ganado: ' + listaAlumnosClasificacion[j].puntos);

          // Miramos en la base de datos si para este enfrentamiento ya se había seleccionado un ganador.
          // Si ya estaba asignado que aparezca un mensaje avisando (Si da a aceptar se reasigna el ganador seleccionado, si da a
          // cancelar no se sobreescribe en la base de datos, se queda tal cual)
          // tslint:disable-next-line:prefer-for-of
          for (let k = 0; k < enfrentamientosJornadaSeleccionada.length; k++) {
            // tslint:disable-next-line:max-line-length
            if (enfrentamientosJornadaSeleccionada[k].nombreJugadorUno === enfrentamientosSeleccionadosColumna[i].nombreJugadorUno &&
              // tslint:disable-next-line:max-line-length
              enfrentamientosJornadaSeleccionada[k].nombreJugadorDos === enfrentamientosSeleccionadosColumna[i].nombreJugadorDos) {
              console.log('Ya estoy en el el enfrentamiento que quiero');
              if (enfrentamientosJornadaSeleccionada[k].Ganador === undefined) {
                console.log('Este enfrentamiento no tiene ganador asignado:');
                // Ahora tengo que actualizar los dos AlumnoJuegoDeCompeticionLiga del enfrentamiento con los nuevos puntos
                listaAlumnosClasificacion[j].puntos = listaAlumnosClasificacion[j].puntos + 1;
                console.log('Los puntos actualizados después de registrar el partido ganado: '
                  + listaAlumnosClasificacion[j].puntos);
                console.log(listaAlumnosClasificacion[j]);
                console.log('el id del alumno es: ' + listaAlumnosClasificacion[j].id);
                const AlumnoId = listaAlumnosClasificacion[j].id;
                // tslint:disable-next-line:prefer-for-of
                for (let m = 0; m < alumnosJuegoDeCompeticionLiga.length; m++) {
                  if (alumnosJuegoDeCompeticionLiga[m].AlumnoId === AlumnoId) {
                    this.AlumnoJuegoDeCompeticionLigaId = alumnosJuegoDeCompeticionLiga[m].id;
                  }
                }
                const alumnoGanador = new AlumnoJuegoDeCompeticionLiga(AlumnoId,
                  juegoSeleccionado.id,
                  listaAlumnosClasificacion[j].puntos,
                  this.AlumnoJuegoDeCompeticionLigaId);
                console.log(alumnoGanador);
                console.log('El id del alumno es: ' + alumnoGanador.AlumnoId + ' y los puntos son: '
                  + alumnoGanador.PuntosTotalesAlumno);
                alumnosConPuntosSumados++;
                this.peticionesAPI.PonPuntosAlumnoGanadorJuegoDeCompeticionLiga(alumnoGanador).
                  subscribe(res => console.log(res));

                if (alumnosConPuntosSumados === 2 && enfrentamientoEmpateRegistrado === false) {
                  alumnosConPuntosSumados = 0;
                  enfrentamientoEmpateRegistrado = true;
                  enfrentamientosJornadaSeleccionada[k].Ganador = 0;
                  console.log(enfrentamientosJornadaSeleccionada[k]);
                  const enfrentamiento = new EnfrentamientoLiga(enfrentamientosJornadaSeleccionada[k].JugadorUno,
                    enfrentamientosJornadaSeleccionada[k].JugadorDos,
                    enfrentamientosJornadaSeleccionada[k].Ganador,
                    enfrentamientosJornadaSeleccionada[k].JornadaDeCompeticionLigaId,
                    undefined, undefined,
                    enfrentamientosJornadaSeleccionada[k].id);
                  this.peticionesAPI.PonGanadorDelEnfrentamiento(enfrentamiento).
                    subscribe(res => console.log(res));
                  Resultados.buenos = Resultados.buenos + '\n' + 'Empate';
                }
              } else {
                this.empateAsignado++;
                if (this.empateAsignado === 2) {
                  this.empateAsignado = 0;
                  console.log('Este enfrentamiento ya tiene asignado un ganador: ');
                  console.log(enfrentamientosJornadaSeleccionada[k]);
                  Resultados.malos = Resultados.malos + ' ' + (k + 1) + 'º';
                }
              }
            }
          }

        }
      }
    }
    return Resultados;
  }

  public AsignarEmpateEquipos(enfrentamientosSeleccionadosColumna: EnfrentamientoLiga[],
    enfrentamientosJornadaSeleccionada: EnfrentamientoLiga[],
    listaEquiposClasificacion: TablaEquipoJuegoDeCompeticion[],
    equiposJuegoDeCompeticionLiga: EquipoJuegoDeCompeticionLiga[],
    juegoSeleccionado: Juego, Resultados: {
      buenos: string
      malos: string
    }) {
    let equiposConPuntosSumados = 0;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < enfrentamientosSeleccionadosColumna.length; i++) {
      let enfrentamientoEmpateRegistrado = false;
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < listaEquiposClasificacion.length; j++) {
        const nombreCompleto = listaEquiposClasificacion[j].nombre;
        if (nombreCompleto === enfrentamientosSeleccionadosColumna[i].nombreJugadorDos ||
          nombreCompleto === enfrentamientosSeleccionadosColumna[i].nombreJugadorUno) {
          console.log('He encontrado el equipo: ' + enfrentamientosSeleccionadosColumna[i].nombreJugadorDos);
          console.log('Los puntos antes de registrar el partido ganado: ' + listaEquiposClasificacion[j].puntos);

          // Miramos en la base de datos si para este enfrentamiento ya se había seleccionado un ganador.
          // Si ya estaba asignado que aparezca un mensaje avisando (Si da a aceptar se reasigna el ganador seleccionado, si da a
          // cancelar no se sobreescribe en la base de datos, se queda tal cual)
          // tslint:disable-next-line:prefer-for-of
          for (let k = 0; k < enfrentamientosJornadaSeleccionada.length; k++) {
            // tslint:disable-next-line:max-line-length
            if (enfrentamientosJornadaSeleccionada[k].nombreJugadorUno === enfrentamientosSeleccionadosColumna[i].nombreJugadorUno &&
              // tslint:disable-next-line:max-line-length
              enfrentamientosJornadaSeleccionada[k].nombreJugadorDos === enfrentamientosSeleccionadosColumna[i].nombreJugadorDos) {
              console.log('Ya estoy en el el enfrentamiento que quiero');
              if (enfrentamientosJornadaSeleccionada[k].Ganador === undefined) {
                console.log('Este enfrentamiento no tiene ganador asignado:');
                // Ahora tengo que actualizar los dos AlumnoJuegoDeCompeticionLiga del enfrentamiento con los nuevos puntos
                listaEquiposClasificacion[j].puntos = listaEquiposClasificacion[j].puntos + 1;
                console.log('Los puntos actualizados después de registrar el partido ganado: '
                  + listaEquiposClasificacion[j].puntos);
                console.log(listaEquiposClasificacion[j]);
                console.log('el id del equipo es: ' + listaEquiposClasificacion[j].id);
                const EquipoId = listaEquiposClasificacion[j].id;
                // tslint:disable-next-line:prefer-for-of
                for (let m = 0; m < equiposJuegoDeCompeticionLiga.length; m++) {
                  if (equiposJuegoDeCompeticionLiga[m].EquipoId === EquipoId) {
                    this.EquipoJuegoDeCompeticionLigaId = equiposJuegoDeCompeticionLiga[m].id;
                  }
                }
                const equipoEmpatado = new EquipoJuegoDeCompeticionLiga(EquipoId,
                  juegoSeleccionado.id,
                  listaEquiposClasificacion[j].puntos,
                  this.EquipoJuegoDeCompeticionLigaId);
                console.log(equipoEmpatado);
                console.log('El id del equipo es: ' + equipoEmpatado.EquipoId + ' y los puntos son: '
                  + equipoEmpatado.PuntosTotalesEquipo);
                equiposConPuntosSumados++;
                this.peticionesAPI.PonPuntosEquipoGanadorJuegoDeCompeticionLiga(equipoEmpatado).
                  subscribe(res => console.log(res));

                if (equiposConPuntosSumados === 2 && enfrentamientoEmpateRegistrado === false) {
                  equiposConPuntosSumados = 0;
                  enfrentamientoEmpateRegistrado = true;
                  enfrentamientosJornadaSeleccionada[k].Ganador = 0;
                  console.log(enfrentamientosJornadaSeleccionada[k]);
                  const enfrentamiento = new EnfrentamientoLiga(enfrentamientosJornadaSeleccionada[k].JugadorUno,
                    enfrentamientosJornadaSeleccionada[k].JugadorDos,
                    enfrentamientosJornadaSeleccionada[k].Ganador,
                    enfrentamientosJornadaSeleccionada[k].JornadaDeCompeticionLigaId,
                    undefined, undefined,
                    enfrentamientosJornadaSeleccionada[k].id);
                  this.peticionesAPI.PonGanadorDelEnfrentamiento(enfrentamiento).
                    subscribe(res => console.log(res));
                  Resultados.buenos = Resultados.buenos + '\n' + 'Empate';
                }
              } else {
                console.log('Este enfrentamiento ya tiene asignado un ganador: ');
                console.log(enfrentamientosJornadaSeleccionada[k]);
                this.empateAsignado++;
                if (this.empateAsignado === 2) {
                  this.empateAsignado = 0;
                  console.log('Este enfrentamiento ya tiene asignado un ganador: ');
                  console.log(enfrentamientosJornadaSeleccionada[k]);
                  Resultados.malos = Resultados.malos + ' ' + (k + 1) + 'º';
                }
              }
            }
          }

        }
      }
    }
    return Resultados;
  }



  // --------------- Nueva metodología asignar ganadores manualmente --------------- //

  public AsignarResultadosJornadaLiga(juego: Juego, jornadaId: number, resultados: number[]) {
    const indexEnfrentamientosConResultadosPreviamente: number[] = [];
    let tieneGanadores = false;
    // Primero necesitamos los enfrentamientos de la jornada
    this.peticionesAPI.DameEnfrentamientosDeCadaJornadaLiga(jornadaId)
      .subscribe(enfrentamientosJornadaSeleccionada => {
        console.log('Los enfrentamientos de la jornada son: ');
        console.log(enfrentamientosJornadaSeleccionada);

        if (resultados.length === enfrentamientosJornadaSeleccionada.length) {
          console.log('resultados.length === enfrentamientosJornadaSeleccionada.length');

          for (let indexEnfrentamientos = 0; indexEnfrentamientos < enfrentamientosJornadaSeleccionada.length; indexEnfrentamientos++) {
            const numeroEnfrentamiento = indexEnfrentamientos + 1;
            // Si el enfrentamiento no tenía ganadores
            // --> actualizar enfrentamiento con los ganadores seleccionados y actualizar puntos de los particupantes
            console.log('numeroEnfrentamiento' + numeroEnfrentamiento);
            console.log('ganador = ' + enfrentamientosJornadaSeleccionada[indexEnfrentamientos].Ganador);
            if (enfrentamientosJornadaSeleccionada[indexEnfrentamientos].Ganador === undefined) {

              // Actualizamos el ganador en EnfrentamientoLiga
              this.GuardarGanadorEnfrentamiento(enfrentamientosJornadaSeleccionada[indexEnfrentamientos],
                resultados[indexEnfrentamientos]);
              // Actualizamos los puntos de los participantes
              this.ActualizarPuntosParticipantesEnfrentamiento(juego, enfrentamientosJornadaSeleccionada[indexEnfrentamientos],
                resultados[indexEnfrentamientos]);
            } else {  // el enfrentamiento tenía ganadores
              indexEnfrentamientosConResultadosPreviamente.push(indexEnfrentamientos);
              console.log('El enfrentamiento ya tenía ganadores');
              tieneGanadores = true;

            }
          }
          // if (tieneGanadores === true) {
          //   Swal.fire('Esta jornada ya tiene ganadores', '', 'error');
          // } else {
          //   Swal.fire('Resultados asignados', 'Enhorabuena', 'success');
          // }
        }
      });
  }

  // public ClasificacionJornada(juegoSeleccionado: Juego, alumnoJuegoDeCompeticionFormulaUno: TablaAlumnoJuegoDeCompeticion[],
  //                             equipoJuegoDeCompeticionFormulaUno: TablaEquipoJuegoDeCompeticion[], GanadoresFormulaUno: string[],
  //                             GanadoresFormulaUnoId: number[]) {
  //   if (GanadoresFormulaUno !== undefined) {
  //     const ParticipantesFormulaUno: string[] = GanadoresFormulaUno;
  //     const PuntosFormulaUno: number[] = [];
  //     juegoSeleccionado.Puntos.forEach(punto => { PuntosFormulaUno.push(punto); });
  //     // const PuntosFormulaUno: number[] = juegoSeleccionado.Puntos;
  //     const Posicion: number[] = [];
  //     const ParticipantesId: number[] = GanadoresFormulaUnoId;
  //     if (juegoSeleccionado.Modo === 'Individual') {
  //       // tslint:disable-next-line:prefer-for-of
  //       for (let i = 0; i < alumnoJuegoDeCompeticionFormulaUno.length; i++) {
  //         const ParticipanteFormulaUno =  alumnoJuegoDeCompeticionFormulaUno[i].nombre + ' '
  //                                       + alumnoJuegoDeCompeticionFormulaUno[i].primerApellido + ' '
  //                                       + alumnoJuegoDeCompeticionFormulaUno[i].segundoApellido;
  //         const ParticipanteId = alumnoJuegoDeCompeticionFormulaUno[i].id;
  //         const indexNoGanador = GanadoresFormulaUno.indexOf(ParticipanteFormulaUno);
  //         if (indexNoGanador === -1) {
  //           ParticipantesFormulaUno.push(ParticipanteFormulaUno);
  //           PuntosFormulaUno.push(0);
  //           ParticipantesId.push(ParticipanteId);
  //         }
  //       }
  //       for (let j = 0; j < ParticipantesFormulaUno.length; j++) {
  //         Posicion[j] = j + 1;
  //       }
  //     } else {
  //       console.log('Estamos en ClasificacionJornada() equipo');
  //       // tslint:disable-next-line:prefer-for-of
  //       for (let i = 0; i < equipoJuegoDeCompeticionFormulaUno.length; i++) {
  //         const ParticipanteFormulaUno = equipoJuegoDeCompeticionFormulaUno[i].nombre;
  //         const ParticipanteId = equipoJuegoDeCompeticionFormulaUno[i].id;
  //         const indexNoGanador = GanadoresFormulaUno.indexOf(ParticipanteFormulaUno);
  //         if (indexNoGanador === -1) {
  //           ParticipantesFormulaUno.push(ParticipanteFormulaUno);
  //           PuntosFormulaUno.push(0);
  //           ParticipantesId.push(ParticipanteId);
  //         }
  //       }
  //       for (let j = 0; j < ParticipantesFormulaUno.length; j++) {
  //         Posicion[j] = j + 1;
  //       }
  //     }
  //     const datosClasificaciónJornada = {
  //       participante: ParticipantesFormulaUno,
  //       puntos: PuntosFormulaUno,
  //       posicion: Posicion,
  //       participanteId: ParticipantesId
  //     };
  //     return datosClasificaciónJornada;
  //   } else {
  //     console.log('Esta jornada aún no tiene ganadores asignados');
  //     const ParticipantesFormulaUno: string[] = [];
  //     const PuntosFormulaUno: number[] = [];
  //     const Posicion: number[] = [];
  //     const ParticipantesId: number[] = [];
  //     if (juegoSeleccionado.Modo === 'Individual') {
  //       // tslint:disable-next-line:prefer-for-of
  //       for (let i = 0; i < alumnoJuegoDeCompeticionFormulaUno.length; i++) {
  //         const ParticipanteFormulaUno =  alumnoJuegoDeCompeticionFormulaUno[i].nombre + ' '
  //                                       + alumnoJuegoDeCompeticionFormulaUno[i].primerApellido + ' '
  //                                       + alumnoJuegoDeCompeticionFormulaUno[i].segundoApellido;
  //         ParticipantesFormulaUno.push(ParticipanteFormulaUno);
  //         const ParticipanteId = alumnoJuegoDeCompeticionFormulaUno[i].id;
  //         PuntosFormulaUno.push(0);
  //         ParticipantesId.push(ParticipanteId);
  //       }
  //       for (let j = 0; j < ParticipantesFormulaUno.length; j++) {
  //         Posicion[j] = j + 1;
  //       }

  //     } else {
  //    // tslint:disable-next-line:prefer-for-of
  //       for (let i = 0; i < equipoJuegoDeCompeticionFormulaUno.length; i++) {
  //         const ParticipanteFormulaUno = equipoJuegoDeCompeticionFormulaUno[i].nombre;
  //         ParticipantesFormulaUno.push(ParticipanteFormulaUno);
  //         const ParticipanteId = equipoJuegoDeCompeticionFormulaUno[i].id;
  //         PuntosFormulaUno.push(0);
  //         ParticipantesId.push(ParticipanteId);
  //       }
  //       for (let j = 0; j < ParticipantesFormulaUno.length; j++) {
  //         Posicion[j] = j + 1;
  //       }
  //     }
  //     const datosClasificaciónJornada = {
  //       participante: ParticipantesFormulaUno,
  //       puntos: PuntosFormulaUno,
  //       posicion: Posicion,
  //       participanteId: ParticipantesId
  //     };
  //     return datosClasificaciónJornada;
  //   }
  // }

  public GuardarGanadorEnfrentamiento(enfrentamiento: EnfrentamientoLiga, resultado: number) {
    let enfrentamientoActualizado: EnfrentamientoLiga;

    if (resultado === 1) {
      enfrentamiento.Ganador = enfrentamiento.JugadorUno;
    } else if (resultado === 2) {
      enfrentamiento.Ganador = enfrentamiento.JugadorDos;
    } else if (resultado === 0) {
      enfrentamiento.Ganador = 0;
    } else if (resultado === -1) {
    }

    if (resultado === 1 || resultado === 2 || resultado === 0) {
      enfrentamientoActualizado = new EnfrentamientoLiga(enfrentamiento.JugadorUno,
        enfrentamiento.JugadorDos,
        enfrentamiento.Ganador,
        enfrentamiento.JornadaDeCompeticionLigaId,
        undefined, undefined,
        enfrentamiento.id);
      console.log('enfrentamientoActualizado');
      console.log(enfrentamientoActualizado);
      this.peticionesAPI.PonGanadorDelEnfrentamiento(enfrentamientoActualizado).
        subscribe(res => console.log(res));
      console.log('El enfrentamiento con el ganador actualizado queda: ');
      console.log(enfrentamientoActualizado);
    }
  }

  public ActualizarPuntosParticipantesEnfrentamiento(juego: Juego, enfrentamiento: EnfrentamientoLiga, resultado: number) {

    if (juego.Modo === 'Individual') {
      console.log('Estoy en ActualizarPuntosParticipantesEnfrentamiento() Individual');
      let alumnoGanador: AlumnoJuegoDeCompeticionLiga[] = [];
      this.peticionesAPI.DameInscripcionesAlumnoJuegoDeCompeticionLiga(juego.id)
        .subscribe(alumnosJuegoLiga => {
          if (resultado === 1 || resultado === 2) {
            alumnoGanador = alumnosJuegoLiga.filter(alumno => alumno.AlumnoId === enfrentamiento.Ganador);
            alumnoGanador[0].PuntosTotalesAlumno = alumnoGanador[0].PuntosTotalesAlumno + 3;
          } else if (resultado === 0) {
            alumnoGanador.push(alumnosJuegoLiga.filter(alumno => alumno.AlumnoId === enfrentamiento.JugadorUno)[0]);
            alumnoGanador.push(alumnosJuegoLiga.filter(alumno => alumno.AlumnoId === enfrentamiento.JugadorDos)[0]);
            alumnoGanador.forEach(alumno => {
              alumno.PuntosTotalesAlumno = alumno.PuntosTotalesAlumno + 1;
            });
          }
          console.log('alumnoGanador:');
          console.log(alumnoGanador);
          alumnoGanador.forEach(alumno => {
            this.peticionesAPI.PonPuntosAlumnoGanadorJuegoDeCompeticionLiga(alumno)
              .subscribe(res => console.log(res));
          });
        });

    } else {
      console.log('Estoy en ActualizarPuntosParticipantesEnfrentamiento() Equipo');
      let equipoGanador: EquipoJuegoDeCompeticionLiga[] = [];
      this.peticionesAPI.DameInscripcionesEquipoJuegoDeCompeticionLiga(juego.id)
        .subscribe(equiposJuegoLiga => {
          if (resultado === 1 || resultado === 2) {
            equipoGanador = equiposJuegoLiga.filter(equipo => equipo.EquipoId === enfrentamiento.Ganador);
            equipoGanador[0].PuntosTotalesEquipo = equipoGanador[0].PuntosTotalesEquipo + 3;
          } else if (resultado === 0) {
            equipoGanador.push(equiposJuegoLiga.filter(equipo => equipo.EquipoId === enfrentamiento.JugadorUno)[0]);
            equipoGanador.push(equiposJuegoLiga.filter(equipo => equipo.EquipoId === enfrentamiento.JugadorDos)[0]);
            equipoGanador.forEach(equipo => {
              equipo.PuntosTotalesEquipo = equipo.PuntosTotalesEquipo + 1;
            });
          }
          console.log('equipoGanador:');
          console.log(equipoGanador);
          equipoGanador.forEach(equipo => {
            this.peticionesAPI.PonPuntosEquipoGanadorJuegoDeCompeticionLiga(equipo)
              .subscribe(res => console.log(res));
          });
        });
    }
  }

  public MensajeSweetalert(juego: Juego, enfrentamientosJornadaSeleccionada: EnfrentamientoLiga[], resultados: number[],
    indexEnfrentamientosConResultadosPreviamente: number[]) {
    console.log('Estoy en MensajeSweetalert()');
    console.log(enfrentamientosJornadaSeleccionada);
    const Mensaje: {
      buenos: string
      malos: string
    } = { buenos: '', malos: 'Los enfrentamientos: ' };
    if (juego.Modo === 'Individual') {
      // Saco todos los alumnos de la BD para poder asociar el id del ganador con un nombre y apellidos de un alumno
      this.peticionesAPI.DameAlumnos()
        .subscribe(alumnos => {
          if (resultados.length === enfrentamientosJornadaSeleccionada.length) {
            for (let indexEnfrentamientos = 0; indexEnfrentamientos < enfrentamientosJornadaSeleccionada.length; indexEnfrentamientos++) {
              const posicion = indexEnfrentamientosConResultadosPreviamente.indexOf(indexEnfrentamientos);
              console.log('posicion' + posicion);
              // si el enfrentamiento no está en el vector de enfrentamientos con resultados es mensaje bueno
              if (posicion === -1) {
                const numeroEnfrentamiento = indexEnfrentamientos + 1;
                console.log('numeroEnfrentamiento = ' + numeroEnfrentamiento);

                console.log('El enfrentamiento: ' + (indexEnfrentamientos + 1) + 'º no tiene ganadores');
                if (resultados[indexEnfrentamientos] === 0) {
                  Mensaje.buenos = Mensaje.buenos + '\n' + 'Empate ';
                } else if (resultados[indexEnfrentamientos] === -1) {
                  const a = 0;
                  console.log('enfrentamiento para el que no se ha seleccionado ganador');
                } else {  // resultados[indexEnfrentamientos] === 1 || resultados[indexEnfrentamientos] === 2
                  const alumnoGanador = alumnos.filter(alumno => alumno.id ===
                    enfrentamientosJornadaSeleccionada[indexEnfrentamientos].Ganador)[0];
                  Mensaje.buenos = Mensaje.buenos + '\n' + 'Ganador: ' + alumnoGanador.Nombre + ' ' + alumnoGanador.PrimerApellido + ' ' +
                    alumnoGanador.SegundoApellido;
                }
              } else {
                const numeroEnfrentamiento = indexEnfrentamientosConResultadosPreviamente[posicion] + 1;
                console.log('El enfrentamiento: ' + numeroEnfrentamiento + 'º tiene ganador');
                Mensaje.malos = Mensaje.malos + numeroEnfrentamiento + 'º ';
              }
            }
          } else {
            console.log('Se ha producido algún error: resultados.length !== enfrentamientosJornadaSeleccionada.length');
          }
          console.log('Mensaje.buenos');
          console.log(Mensaje.buenos);
          console.log('Mensaje.malos');
          console.log(Mensaje.malos);
          return Mensaje;
        });
    } else {
      // Saco todos los equipos de la BD para poder asociar el id del equipo ganador con un nombre de equipo
      this.peticionesAPI.DameEquipos()
        .subscribe(equipos => {
          if (resultados.length === enfrentamientosJornadaSeleccionada.length) {
            for (let indexEnfrentamientos = 0; indexEnfrentamientos < enfrentamientosJornadaSeleccionada.length; indexEnfrentamientos++) {
              const posicion = indexEnfrentamientosConResultadosPreviamente.indexOf(indexEnfrentamientos);
              if (posicion === -1) { // si el enfrentamiento no está en el vector de enfrentamientos con resultados es mensaje bueno
                const numeroEnfrentamiento = indexEnfrentamientos + 1;
                console.log('numeroEnfrentamiento = ' + numeroEnfrentamiento);

                console.log('El enfrentamiento: ' + (indexEnfrentamientos + 1) + 'º no tiene ganadores');
                if (resultados[indexEnfrentamientos] === 0) {
                  Mensaje.buenos = Mensaje.buenos + '\n' + 'Empate ';
                } else if (resultados[indexEnfrentamientos] === -1) {
                  // enfrentamiento para el que no se ha seleccionado ganador
                } else {  // resultados[indexEnfrentamientos] === 1 || resultados[indexEnfrentamientos] === 2
                  const equipoGanador = equipos.filter(alumno => alumno.id ===
                    enfrentamientosJornadaSeleccionada[indexEnfrentamientos].Ganador)[0];
                  Mensaje.buenos = Mensaje.buenos + '\n' + 'Ganador: ' + equipoGanador.Nombre;
                }
              } else {
                const numeroEnfrentamiento = indexEnfrentamientosConResultadosPreviamente[posicion] + 1;
                console.log('El enfrentamiento: ' + numeroEnfrentamiento + 'º tiene ganador');
                Mensaje.malos = Mensaje.malos + numeroEnfrentamiento + 'º ';
              }
            }
          } else {
            console.log('Se ha producido algún error: resultados.length !== enfrentamientosJornadaSeleccionada.length');
          }
          console.log('Mensaje.buenos');
          console.log(Mensaje.buenos);
          console.log('Mensaje.malos');
          console.log(Mensaje.malos);
          return Mensaje;
        });
    }
  }

  //////////////////////////////////////// JUEGO DE VOTACION UNO A TODOS ///////////////////////////////////
  public PrepararTablaRankingIndividualVotacionUnoATodos(listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeVotacionUnoATodos[],
    alumnosDelJuego: Alumno[]): TablaAlumnoJuegoDeVotacionUnoATodos[] {
    console.log(' EN CALCULOS');
    console.log(listaAlumnosOrdenadaPorPuntos);
    const rankingJuegoDeVotacion: TablaAlumnoJuegoDeVotacionUnoATodos[] = [];
    // tslint:disable-next-line:prefer-for-oF
    for (let i = 0; i < listaAlumnosOrdenadaPorPuntos.length; i++) {
      let alumno: Alumno;
      const alumnoId = listaAlumnosOrdenadaPorPuntos[i].alumnoId;
      alumno = alumnosDelJuego.filter(res => res.id === alumnoId)[0];
      // tslint:disable-next-line:max-line-length

      const elem = new TablaAlumnoJuegoDeVotacionUnoATodos(i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
        0, alumnoId);
      rankingJuegoDeVotacion[i] = elem;
    }

    // Ahora voy a ver qué alumnos ya han votado para acumular sus votos y marcarlos
    // como que ya han votado
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < listaAlumnosOrdenadaPorPuntos.length; i++) {
      if (listaAlumnosOrdenadaPorPuntos[i].Votos) {
        // Este alumno ya ha votado
        const alumno = listaAlumnosOrdenadaPorPuntos[i];
        // Asigno los puntos a los destinatorios
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < alumno.Votos.length; j++) {
          const votado = rankingJuegoDeVotacion.filter(al => al.id === alumno.Votos[j].alumnoId)[0];
          votado.puntos = votado.puntos + alumno.Votos[j].puntos;
        }
        // Marque que el alumno ya ha votado
        rankingJuegoDeVotacion.filter(al => al.id === alumno.alumnoId)[0].votado = true;
      }
    }

    return rankingJuegoDeVotacion;
  }

  public PrepararTablaRankingIndividualVotacionUnoATodosAcabado(listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeVotacionUnoATodos[],
    // tslint:disable-next-line:max-line-length
    alumnosDelJuego: Alumno[]): TablaAlumnoJuegoDeVotacionUnoATodos[] {
    const rankingJuegoDeVotacion: TablaAlumnoJuegoDeVotacionUnoATodos[] = [];
    // tslint:disable-next-line:prefer-for-oF
    for (let i = 0; i < listaAlumnosOrdenadaPorPuntos.length; i++) {
      let alumno: Alumno;
      const alumnoId = listaAlumnosOrdenadaPorPuntos[i].alumnoId;
      alumno = alumnosDelJuego.filter(res => res.id === alumnoId)[0];
      // tslint:disable-next-line:max-line-length

      const elem = new TablaAlumnoJuegoDeVotacionUnoATodos(i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
        listaAlumnosOrdenadaPorPuntos[i].puntosTotales, alumnoId);
      rankingJuegoDeVotacion[i] = elem;
    }

    return rankingJuegoDeVotacion;
  }


  //////////////////////////////////////// JUEGO DE VOTACION  TODOS A UNO ///////////////////////////////////
  public PrepararTablaRankingIndividualVotacionTodosAUno(listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeVotacionTodosAUno[],
    // tslint:disable-next-line:max-line-length
    alumnosDelJuego: Alumno[], juego: JuegoDeVotacionTodosAUno): TablaAlumnoJuegoDeVotacionTodosAUno[] {
    const rankingJuegoDeVotacion: TablaAlumnoJuegoDeVotacionTodosAUno[] = [];
    // tslint:disable-next-line:prefer-for-oF
    for (let i = 0; i < listaAlumnosOrdenadaPorPuntos.length; i++) {
      let alumno: Alumno;
      const alumnoId = listaAlumnosOrdenadaPorPuntos[i].alumnoId;
      alumno = alumnosDelJuego.filter(res => res.id === alumnoId)[0];
      // tslint:disable-next-line:max-line-length

      const elem = new TablaAlumnoJuegoDeVotacionTodosAUno(i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
        0, alumnoId);
      if (listaAlumnosOrdenadaPorPuntos[i].VotosEmitidos.length === listaAlumnosOrdenadaPorPuntos.length - 1) {
        elem.votado = true;
      } else {
        elem.votado = false;
      }
      elem.conceptos = Array(juego.Conceptos.length).fill(0);
      rankingJuegoDeVotacion[i] = elem;
    }

    // Ahora para cada alumno voy a calcular los votos recibidos y la nota en cada uno de los conceptos, asi como su nota temporal

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < listaAlumnosOrdenadaPorPuntos.length; i++) {
      if (listaAlumnosOrdenadaPorPuntos[i].VotosEmitidos) {
        // Este alumno ha emitido algunos votos
        listaAlumnosOrdenadaPorPuntos[i].VotosEmitidos.forEach(votoEmitido => {
          // busco al alumno que ha recibido estos votos
          // tslint:disable-next-line:no-shadowed-variable
          const alumnoVotado = rankingJuegoDeVotacion.filter(alumno => alumno.id === votoEmitido.alumnoId)[0];
          alumnoVotado.votosRecibidos++;
          // le asigno los votos que ha recibido para cada concepto
          for (let j = 0; j < votoEmitido.votos.length; j++) {
            alumnoVotado.conceptos[j] = alumnoVotado.conceptos[j] + votoEmitido.votos[j];
          }

        });
      }
    }

    // Para acabar calculo la nota parcial total  para cada alumno
    rankingJuegoDeVotacion.forEach(alumno => {

      if (alumno.votosRecibidos === 0) {
        alumno.nota = 0;
      } else {
        let nota = 0;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < alumno.conceptos.length; i++) {
          nota = nota + (alumno.conceptos[i] * juego.Pesos[i]) / 100;
        }
        alumno.nota = nota / alumno.votosRecibidos;
      }
    });

    return rankingJuegoDeVotacion;
  }

  public PrepararTablaRankingIndividualVotacionTodosAUnoAcabado(listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeVotacionTodosAUno[],
    // tslint:disable-next-line:max-line-length
    alumnosDelJuego: Alumno[], juego: JuegoDeVotacionTodosAUno): TablaAlumnoJuegoDeVotacionTodosAUno[] {
    const rankingJuegoDeVotacion: TablaAlumnoJuegoDeVotacionTodosAUno[] = [];
    // tslint:disable-next-line:prefer-for-oF
    for (let i = 0; i < listaAlumnosOrdenadaPorPuntos.length; i++) {
      let alumno: Alumno;
      const alumnoId = listaAlumnosOrdenadaPorPuntos[i].alumnoId;
      alumno = alumnosDelJuego.filter(res => res.id === alumnoId)[0];
      // tslint:disable-next-line:max-line-length


      const elem = new TablaAlumnoJuegoDeVotacionTodosAUno(i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
        listaAlumnosOrdenadaPorPuntos[i].PuntosTotales, alumnoId);
      console.log('elemento');
      console.log(elem);
      elem.conceptos = Array(juego.Conceptos.length).fill(0);
      rankingJuegoDeVotacion[i] = elem;
    }

    // Ahora para cada alumno voy a calcular los votos recibidos y la nota en cada uno de los conceptos

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < listaAlumnosOrdenadaPorPuntos.length; i++) {
      if (listaAlumnosOrdenadaPorPuntos[i].VotosEmitidos) {
        // Este alumno ha emitido algunos votos
        listaAlumnosOrdenadaPorPuntos[i].VotosEmitidos.forEach(votoEmitido => {
          // busco al alumno que ha recibido estos votos
          // tslint:disable-next-line:no-shadowed-variable
          const alumnoVotado = rankingJuegoDeVotacion.filter(alumno => alumno.id === votoEmitido.alumnoId)[0];
          alumnoVotado.votosRecibidos++;
          // le asigno los votos que ha recibido para cada concepto
          for (let j = 0; j < votoEmitido.votos.length; j++) {
            alumnoVotado.conceptos[j] = alumnoVotado.conceptos[j] + votoEmitido.votos[j];
          }

        });
      }
    }

    return rankingJuegoDeVotacion;
  }

  //////////////////////////////////////// JUEGO DE COMPETICIÓN FÓRUMULA UNO ///////////////////////////////////
  public PrepararTablaRankingIndividualFormulaUno(listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeCompeticionFormulaUno[],
    alumnosDelJuego: Alumno[]): TablaAlumnoJuegoDeCompeticion[] {
    const rankingJuegoDeCompeticion: TablaAlumnoJuegoDeCompeticion[] = [];
    console.log(' Vamos a preparar la tabla del ranking individual de Competición Fórmula Uno');
    console.log('la lista de alumnos ordenada es: ');
    console.log(listaAlumnosOrdenadaPorPuntos);
    // tslint:disable-next-line:prefer-for-oF
    for (let i = 0; i < listaAlumnosOrdenadaPorPuntos.length; i++) {
      let alumno: Alumno;
      const alumnoId = listaAlumnosOrdenadaPorPuntos[i].AlumnoId;
      alumno = alumnosDelJuego.filter(res => res.id === alumnoId)[0];
      rankingJuegoDeCompeticion[i] = new TablaAlumnoJuegoDeCompeticion(i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
        listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno, alumnoId);
    }
    return rankingJuegoDeCompeticion;
  }

  public PrepararTablaRankingEquipoFormulaUno(listaEquiposOrdenadaPorPuntos: EquipoJuegoDeCompeticionFormulaUno[],
    equiposDelJuego: Equipo[]) {
    const rankingJuegoDeCompeticion: TablaEquipoJuegoDeCompeticion[] = [];
    console.log(' Vamos a preparar la tabla del ranking por equipos de Competición Fórmula Uno');
    console.log('la lista de equipos ordenada es: ');
    console.log(listaEquiposOrdenadaPorPuntos);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < listaEquiposOrdenadaPorPuntos.length; i++) {
      let equipo: Equipo;
      const EquipoId = listaEquiposOrdenadaPorPuntos[i].EquipoId;
      equipo = equiposDelJuego.filter(res => res.id === EquipoId)[0];
      rankingJuegoDeCompeticion[i] = new TablaEquipoJuegoDeCompeticion(i + 1, equipo.Nombre,
        listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo, EquipoId);
    }
    return rankingJuegoDeCompeticion;
  }

  public PrepararTablaRankingJornadaFormulaUno(datosClasificacionJornadaSeleccionada: {
    participante: string[];
    puntos: number[];
    posicion: number[];
    participanteId: number[]
  }) {
    console.log('Estoy en PrepararTablaRankingJornadaFormulaUno');
    const rankingJornadaFormulaUno: TablaClasificacionJornada[] = [];
    for (let i = 0; i < datosClasificacionJornadaSeleccionada.participante.length; i++) {
      rankingJornadaFormulaUno[i] = new TablaClasificacionJornada(datosClasificacionJornadaSeleccionada.participante[i],
        datosClasificacionJornadaSeleccionada.puntos[i],
        datosClasificacionJornadaSeleccionada.posicion[i],
        datosClasificacionJornadaSeleccionada.participanteId[i]);
    }
    return rankingJornadaFormulaUno;
  }


  // --------------------- Nueva metodología asignar ganadores  --------------------- //
  public AsignarResultadosJornadaF1(juego: Juego, jornada: Jornada, participantesPuntuan: number[]) {

    const puntuacionesDelJuego = juego.Puntos;
    if (participantesPuntuan.length === puntuacionesDelJuego.length) {
      console.log('ganadores.length === puntuacionesDelJuego.length');

      // Si la jornada no tenía ganadores (en principio tadas las jornadas que llegan a esta función es porque no tenían ganadores)
      // --> actualizar jornada con los ganadores seleccionados y actualizar puntos de los particupantes
      console.log('jornadaId: ' + jornada.id);
      console.log('ganador = ' + jornada.GanadoresFormulaUno);
      if (jornada.GanadoresFormulaUno === undefined) {

        // Actualizamos el ganador en JornadaDeCompeticionFormulaUno
        this.GuardarGanadorJornada(jornada, participantesPuntuan);

        // Actualizamos los puntos de los participantes
        for (let indexParticipantesPuntuan = 0; indexParticipantesPuntuan < participantesPuntuan.length; indexParticipantesPuntuan++) {

          this.ActualizarPuntosParticipantesJornada(juego, participantesPuntuan[indexParticipantesPuntuan],
            puntuacionesDelJuego[indexParticipantesPuntuan]);
        }

      } else {  // el enfrentamiento tenía ganadores
        console.log('Esta jornada ya tiene ganadores asignados');
      }

      // // Mensaje sweetalert
      // const Mensaje = this.MensajeSweetalertF1();
    } else {
      console.log('Se ha producido algún error: participantesPuntuan.length !== puntuacionesDelJuego.length');
    }
  }

  GuardarGanadorJornada(jornada: Jornada, participantesPuntuan: number[]) {
    console.log('Actualizamos la Jornada');
    const jornadaActualizada: Jornada = jornada;
    console.log('jornada NO actualizada');
    console.log(jornadaActualizada);
    jornadaActualizada.GanadoresFormulaUno = participantesPuntuan;
    console.log('jornada actualizada');
    console.log(jornadaActualizada);
    this.peticionesAPI.PonGanadoresJornadasDeCompeticionFormulaUno(jornadaActualizada)
      .subscribe(res => {
        console.log(res);
        console.log('Se ha actualizado la jornada en la base de datos');
      });
  }

  ActualizarPuntosParticipantesJornada(juego: Juego, participantePuntua: number, puntuacionDelParticipantePuntua: number) {

    if (juego.Modo === 'Individual') {
      console.log('Estoy en ActualizarPuntosParticipantesJornada() Individual');
      let alumnoPuntua: AlumnoJuegoDeCompeticionFormulaUno;
      this.peticionesAPI.DameInscripcionesAlumnoJuegoDeCompeticionFormulaUno(juego.id)
        .subscribe(alumnosJuegoF1 => {
          console.log('alumnosJuegoF1');
          console.log(alumnosJuegoF1);
          console.log('participantePuntua');
          console.log(participantePuntua);
          alumnoPuntua = alumnosJuegoF1.filter(alumno => alumno.AlumnoId === participantePuntua)[0];
          console.log('alumnoGanador NO actualizado:');
          console.log(alumnoPuntua);
          alumnoPuntua.PuntosTotalesAlumno = alumnoPuntua.PuntosTotalesAlumno + puntuacionDelParticipantePuntua;
          console.log('alumnoGanador actualizado:');
          console.log(alumnoPuntua);
          this.peticionesAPI.PonPuntosAlumnoGanadorJornadasDeCompeticionFormulaUno(alumnoPuntua)
            .subscribe(res => console.log(res));
        });

    } else {
      console.log('Estoy en ActualizarPuntosParticipantesJornada() Individual');
      let equipoPuntua: EquipoJuegoDeCompeticionFormulaUno;
      this.peticionesAPI.DameInscripcionesEquipoJuegoDeCompeticionFormulaUno(juego.id)
        .subscribe(equiposJuegoF1 => {
          console.log('equiposJuegoF1');
          console.log(equiposJuegoF1);
          console.log('participantePuntua');
          console.log(participantePuntua);
          equipoPuntua = equiposJuegoF1.filter(alumno => alumno.EquipoId === participantePuntua)[0];
          console.log('equipoPuntua NO actualizado:');
          console.log(equipoPuntua);
          equipoPuntua.PuntosTotalesEquipo = equipoPuntua.PuntosTotalesEquipo + puntuacionDelParticipantePuntua;
          console.log('equipoPuntua actualizado:');
          console.log(equipoPuntua);
          this.peticionesAPI.PonPuntosEquipoGanadorJornadasDeCompeticionFormulaUno(equipoPuntua)
            .subscribe(res => console.log(res));
        });
    }
  }

  public JornadaF1TieneGanadores(jornadaId: number, jornadasDelJuego: Jornada[]) {
    let jornadaTieneGanadores = false;
    jornadasDelJuego.forEach(jornada => {
      if (jornada.id === Number(jornadaId) && jornada.GanadoresFormulaUno !== undefined) {
        jornadaTieneGanadores = true;
      }
    });
    return jornadaTieneGanadores;
  }

  public ObtenerJornadaSeleccionada(jornadaId: number, jornadasDelJuego: Jornada[]) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < jornadasDelJuego.length; i++) {
      if (jornadasDelJuego[i].id === jornadaId) {
        return jornadasDelJuego[i];
      }
    }
  }


  //////////////////////////////////////// JUEGO DE CUESTIONARIO ///////////////////////////////////
  public PrepararTablaRankingCuestionario(listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeCuestionario[],
    alumnosDelJuego: Alumno[]): TablaAlumnoJuegoDeCuestionario[] {
    const rankingJuegoDeCompeticion: TablaAlumnoJuegoDeCuestionario[] = [];
    // tslint:disable-next-line:prefer-for-oF
    for (let i = 0; i < listaAlumnosOrdenadaPorPuntos.length; i++) {
      let alumno: Alumno;
      const alumnoId = listaAlumnosOrdenadaPorPuntos[i].alumnoId;
      alumno = alumnosDelJuego.filter(res => res.id === alumnoId)[0];
      rankingJuegoDeCompeticion[i] = new TablaAlumnoJuegoDeCuestionario(alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
        // tslint:disable-next-line:max-line-length
        listaAlumnosOrdenadaPorPuntos[i].Nota, listaAlumnosOrdenadaPorPuntos[i].Contestado, alumnoId, listaAlumnosOrdenadaPorPuntos[i].TiempoEmpleado);
    }
    return rankingJuegoDeCompeticion;
  }

  // Elimina juego de cuestionario y posterior mente procederemos a eliminar los alumnos de ese juego de cuestionario
  public EliminarJuegoDeCuestionario(): any {
    const eliminaObservable = new Observable(obs => {
      this.peticionesAPI.BorrarJuegoDeCuestionario(
        this.sesion.DameJuego().id)
        .subscribe(() => {
          this.EliminarAlumnosJuegoDeCuestionario();
          this.EliminaRespuestasJuegoDeCuestionario();
          obs.next();
        });
    });
    return eliminaObservable;
  }

  // tslint:disable-next-line:max-line-length
  // Esta funcion recupera todos los alumnos que estaban inscritos en el juego de cuestionario y los borra. Esto lo hacemos para no dejar matriculas que no
  // nos sirven dentro de la base de datos
  private EliminarAlumnosJuegoDeCuestionario() {
    // Pido los alumnos correspondientes al juego que voy a borrar
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeCuestionario(this.sesion.DameJuego().id)
      .subscribe(AlumnosDelJuego => {
        if (AlumnosDelJuego[0] !== undefined) {

          // Una vez recibo las inscripciones, las voy borrando una a una
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < AlumnosDelJuego.length; i++) {
            this.peticionesAPI.BorraAlumnoDelJuegoDeCuestionario(AlumnosDelJuego[i].id)
              .subscribe(() => {
                console.log('Inscripcion al juego borrada correctamente');
              });
          }
        } else {
          console.log('No hay alumnos en el juego de cuestionario');
        }

      });
  }

  private EliminaRespuestasJuegoDeCuestionario() {
    // Pido los alumnos correspondientes al juego que voy a borrar
    this.peticionesAPI.DameRespuestasAlumnoJuegoDeCuestionario(this.sesion.DameJuego().id)
      .subscribe(respuestas => {
        if (respuestas[0] !== undefined) {

          // Una vez recibo las inscripciones, las voy borrando una a una
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < respuestas.length; i++) {
            this.peticionesAPI.BorraRespuestaAlumnoDelJuegoDeCuestionario(respuestas[i].id)
              .subscribe(() => {
                console.log('Respuesta borrada correctamente');
              });
          }
        } else {
          console.log('No hay respuestas en el juego de cuestionario');
        }

      });
  }



  // juego geocaching


  public PrepararTablaRankingGeocaching(listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeGeocaching[],
    alumnosDelJuego: Alumno[]): TablaAlumnoJuegoDeGeocaching[] {
    const rankingJuegoDeCompeticion: TablaAlumnoJuegoDeGeocaching[] = [];
    // tslint:disable-next-line:prefer-for-oF
    for (let i = 0; i < listaAlumnosOrdenadaPorPuntos.length; i++) {
      let alumno: Alumno;
      const AlumnoId = listaAlumnosOrdenadaPorPuntos[i].alumnoId;
      alumno = alumnosDelJuego.filter(res => res.id === AlumnoId)[0];
      rankingJuegoDeCompeticion[i] = new TablaAlumnoJuegoDeGeocaching(alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
        listaAlumnosOrdenadaPorPuntos[i].Puntuacion, listaAlumnosOrdenadaPorPuntos[i].Etapa, AlumnoId);
    }
    return rankingJuegoDeCompeticion;
  }

  public EliminarJuegoDeGeocaching(): any {
    const eliminaObservable = new Observable(obs => {
      this.peticionesAPI.BorrarJuegoDeGeocaching(
        this.sesion.DameJuego().id)
        .subscribe(() => {
          this.EliminarAlumnosJuegoDeGeocaching();
          obs.next();
        });
    });
    return eliminaObservable;
  }

  private EliminarAlumnosJuegoDeGeocaching() {
    // Pido los alumnos correspondientes al juego que voy a borrar
    this.peticionesAPI.DameAlumnosDelJuegoDeGeocaching(this.sesion.DameJuego().id)
      .subscribe(AlumnosDelJuego => {
        if (AlumnosDelJuego[0] !== undefined) {

          // Una vez recibo las inscripciones, las voy borrando una a una
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < AlumnosDelJuego.length; i++) {
            this.peticionesAPI.BorraAlumnoDelJuegoDeGeocaching(AlumnosDelJuego[i].id)
              .subscribe(() => {
                console.log('Inscripcion al juego borrada correctamente');
              });
          }
        } else {
          console.log('No hay alumnos en el juego de geocaching');
        }

      });
  }

  // Devuelve la lista de ficheros de la familia que ya están en la base de datos
  // Se usa al cargar una familia nueva para asegurarnos de que no cargamos ficheros
  // que ya se usan en otros recursos, lo cual sería un problema al borrar un recurso
  public VerificarFicherosFamilia(familia: FamiliaAvatares): any {
    const listaFicherosObservable = new Observable(obs => {
      const lista: string[] = [];
      let cont = 0;
      const numeroFicheros = familia.Complemento1.length +
        familia.Complemento2.length +
        familia.Complemento3.length +
        familia.Complemento4.length +
        1;

      this.peticionesAPI.DameImagenAvatar(familia.Silueta)
        .subscribe(
          (imagen) => {

            lista.push(familia.Silueta);
            cont++;
            if (cont === numeroFicheros) {
              obs.next(lista);
            }
          },
          (error) => {
            cont++;
            if (cont === numeroFicheros) {
              obs.next(lista);
            }
          });
      familia.Complemento1.forEach(nombreFichero => {
        this.peticionesAPI.DameImagenAvatar(nombreFichero)
          .subscribe(
            (imagen) => {

              lista.push(nombreFichero);
              cont++;
              if (cont === numeroFicheros) {
                obs.next(lista);
              }
            },
            (error) => {
              cont++;
              if (cont === numeroFicheros) {
                obs.next(lista);
              }
            });
      });
      familia.Complemento2.forEach(nombreFichero => {
        this.peticionesAPI.DameImagenAvatar(nombreFichero)
          .subscribe(
            (imagen) => {

              lista.push(nombreFichero);
              cont++;
              if (cont === numeroFicheros) {
                obs.next(lista);
              }
            },
            (error) => {
              cont++;
              if (cont === numeroFicheros) {
                obs.next(lista);
              }
            });
      });
      familia.Complemento3.forEach(nombreFichero => {
        this.peticionesAPI.DameImagenAvatar(nombreFichero)
          .subscribe(
            (imagen) => {

              lista.push(nombreFichero);
              cont++;
              if (cont === numeroFicheros) {
                obs.next(lista);
              }
            },
            (error) => {
              cont++;
              if (cont === numeroFicheros) {
                obs.next(lista);
              }
            });
      });
      familia.Complemento4.forEach(nombreFichero => {
        this.peticionesAPI.DameImagenAvatar(nombreFichero)
          .subscribe(
            (imagen) => {

              lista.push(nombreFichero);
              cont++;
              if (cont === numeroFicheros) {
                obs.next(lista);
              }
            },
            (error) => {
              cont++;
              if (cont === numeroFicheros) {
                obs.next(lista);
              }
            });
      });
    });

    return listaFicherosObservable;

  }

  public VerificarFicherosColeccion(coleccion: any): any {
    const listaFicherosObservable = new Observable(obs => {
      const lista: string[] = [];
      let numeroFicheros: number;
      let cont = 0;
      if (coleccion.DosCaras) {
        numeroFicheros = coleccion.cromos.length * 2 + 1;
      } else {
        numeroFicheros = coleccion.cromos.length + 1;
      }

      this.peticionesAPI.DameImagenColeccion(coleccion.ImagenColeccion)
        .subscribe(
          (imagen) => {
            lista.push(coleccion.ImagenColeccion);
            cont++;
            if (cont === numeroFicheros) {
              obs.next(lista);
            }
          },
          (error) => {
            cont++;
            if (cont === numeroFicheros) {
              obs.next(lista);
            }
          });
      coleccion.cromos.forEach(cromo => {
        console.log('nuevo cromo');
        console.log(cromo);
        this.peticionesAPI.DameImagenCromo(cromo.nombreImagenCromoDelante)
          .subscribe(
            (imagen) => {
              lista.push(cromo.nombreImagenCromoDelante);
              cont++;
              if (cont === numeroFicheros) {
                obs.next(lista);
              }
            },
            (error) => {
              cont++;
              if (cont === numeroFicheros) {
                obs.next(lista);
              }
            });

        if (coleccion.DosCaras) {
          this.peticionesAPI.DameImagenCromo(cromo.nombreImagenCromoDetras)
            .subscribe(
              (imagen) => {
                lista.push(cromo.nombreImagenCromoDetras);
                cont++;
                if (cont === numeroFicheros) {
                  obs.next(lista);
                }
              },
              (error) => {
                cont++;
                if (cont === numeroFicheros) {
                  obs.next(lista);
                }
              });
        }
      });
    });
    return listaFicherosObservable;
  }


  public NombreFicheroImagenPreguntaRepetido(nombreFichero: string): any {
    const verificarFicheroObservable = new Observable(obs => {
      this.peticionesAPI.DameImagenPregunta(nombreFichero)
        .subscribe(
          (imagen) => {
            obs.next(true);
          },
          (error) => {
            obs.next(false);
          });
    });
    return verificarFicheroObservable;
  }


  public VerificarFicherosPreguntas(preguntas: any): any {
    const listaFicherosObservable = new Observable(obs => {
      let numeroFicheros = 0;
      preguntas.forEach(pregunta => {
        if (pregunta.Imagen) {
          numeroFicheros++;
        }
      });
      const lista: string[] = [];

      let cont = 0;
      preguntas.forEach(pregunta => {
        this.peticionesAPI.DameImagenPregunta(pregunta.Imagen)
          .subscribe(
            (imagen) => {
              lista.push(pregunta.Imagen);
              cont++;
              if (cont === numeroFicheros) {
                obs.next(lista);
              }
            },
            (error) => {
              cont++;
              if (cont === numeroFicheros) {
                obs.next(lista);
              }
            });
      });
    });
    return listaFicherosObservable;
  }


  //Devuelve el Observable del Juego específico en función del Tipo de Juego y su ID
  public DameJuego(tipoJuego: string, juegoID: number): Observable<any> {
    switch (tipoJuego) {
      case "Juego De Avatar":
        return this.peticionesAPI.DameJuegoDeAvatar(juegoID);

      case "Juego De Coger Turno Rápido":
        return this.peticionesAPI.DameJuegoDeCogerTurnoRapido(juegoID);

      case "Juego De Colección":
        return this.peticionesAPI.DameJuegoDeColeccion(juegoID);

      case "Juego De Competición Fórmula Uno":
        return this.peticionesAPI.DameJuegoDeCompeticionFormulaUno(juegoID);

      case "Juego De Competición Liga":
        return this.peticionesAPI.DameJuegoDeCompeticionLiga(juegoID);

      case "Juego De Cuestionario":
        return this.peticionesAPI.DameJuegoDeCuestionarioPorID(juegoID);

      case "Juego De Cuestionario Rápido":
        return this.peticionesAPI.DameJuegoDeCuestionarioRapido(juegoID);

      case "Juego De Cuestionario de Satisfacción":
        return this.peticionesAPI.DameJuegoDeCuestionarioSatisfaccion(juegoID);

      case "Juego De Encuesta Rápida":
        return this.peticionesAPI.DameJuegoDeEncuestaRapida(juegoID);

      case "Juego De Evaluación":
        return this.peticionesAPI.DameJuegoDeEvaluacion(juegoID);

      case "Juego De Geocaching":
        return this.peticionesAPI.DameJuegoDeGeocachingPorID(juegoID);

      case "Juego De Puntos":
        return this.peticionesAPI.DameJuegoDePuntos(juegoID);

      case "Juego De Votación Rápida":
        return this.peticionesAPI.DameJuegoDeVotacionRapida(juegoID);

      case "Juego De Votación Uno A Todos":
        return this.peticionesAPI.DameJuegoDeVotacionTodosAUno(juegoID);

      case "Juego De Votación Todos A Uno":
        return this.peticionesAPI.DameJuegoDeVotacionUnoATodos(juegoID);

      default:
        return null;
    }
  }

  //Devuelve el Observable de los Juegos en función del Tipo de Juego y el Grupo al que pertenecen
  public DameJuegosDelGrupoSegunTipo(tipoJuego: string, grupoID: number): Observable<any> {
    let profesor: Profesor = this.sesion.DameProfesor();
    switch (tipoJuego) {
      case "Juego De Avatar":
        return this.peticionesAPI.DameJuegoDeAvatarGrupo(grupoID);

      case "Juego De Coger Turno Rápido": //Este Tipo de Juego no se asocia a ningún Grupo, así que lo buscamos según el Profesor
        return this.peticionesAPI.DameJuegosDeCogerTurnoRapido(profesor.id);

      case "Juego De Colección":
        return this.peticionesAPI.DameJuegoDeColeccionGrupo(grupoID);

      case "Juego De Competición Fórmula Uno":
        return this.peticionesAPI.DameJuegoDeCompeticionFormulaUnoGrupo(grupoID);

      case "Juego De Competición Liga":
        return this.peticionesAPI.DameJuegoDeCompeticionLigaGrupo(grupoID);

      case "Juego De Cuestionario":
        return this.peticionesAPI.DameJuegoDeCuestionario(grupoID);

      case "Juego De Cuestionario Rápido": //Este Tipo de Juego no se asocia a ningún Grupo, así que lo buscamos según el Profesor
        return this.peticionesAPI.DameJuegosDeCuestionarioRapido(profesor.id);

      case "Juego De Cuestionario de Satisfacción":
        return this.peticionesAPI.DameJuegosDeCuestionarioSatisfaccion(grupoID);

      case "Juego De Encuesta Rápida": //Este Tipo de Juego no se asocia a ningún Grupo, así que lo buscamos según el Profesor
        return this.peticionesAPI.DameJuegosDeEncuestaRapida(profesor.id);

      case "Juego De Evaluación":
        return this.peticionesAPI.DameJuegosDeEvaluacion(grupoID);

      case "Juego De Geocaching":
        return this.peticionesAPI.DameJuegoDeGeocaching(grupoID);

      case "Juego De Puntos":
        return this.peticionesAPI.DameJuegoDePuntosGrupo(grupoID);

      case "Juego De Votación Rápida": //Este Tipo de Juego no se asocia a ningún Grupo, así que lo buscamos según el Profesor
        return this.peticionesAPI.DameJuegosDeVotacionRapida(profesor.id);

      case "Juego De Votación Uno A Todos":
        return this.peticionesAPI.DameJuegosDeVotacionTodosAUno(grupoID);

      case "Juego De Votación Todos A Uno":
        return this.peticionesAPI.DameJuegosDeVotacionUnoATodos(grupoID);

      default:
        return null;
    }
  }


  //---------------------------------------- CÁLCULOS PARA EL REGISTRO DE ACTIVIDAD (EVENTOS) ----------------------------------------//

  //Devuelve el Observable con los datos específicos (que no van explícitos, es decir, van con un ID) de un Evento
  public DameDatosEvento(evento: Evento): Observable<any> {
    const datosEventoObservable: Observable<any> = new Observable((obs) => {
      let datosEvento: any = {};
      
      switch (Number(evento.TipoEvento)) {
        case 1: //Grupo + Juego
          this.DameJuego(evento.TipoJuego, evento.JuegoID).subscribe((juego) => {
            //console.log(juego);
            this.peticionesAPI.DameGrupo(juego.grupoId).subscribe((grupo) => {
              //console.log(grupo);
              datosEvento = {
                'juego': juego,
                'grupo': grupo
              };
              obs.next(datosEvento);
            }, (err) => {
              console.log(err);
              Swal.fire({
                title: "Error al obtener el Grupos del Evento seleccionado",
                text: err.message,
                icon: "error",
                showConfirmButton: false,
                timer: 3000
              });
              obs.next(datosEvento);
            });
          }, (err) => {
            console.log(err);
            Swal.fire({
              title: "Error al obtener el Juego del Evento seleccionado",
              text: err.message,
              icon: "error",
              showConfirmButton: false,
              timer: 3000
            });
            obs.next(datosEvento);
          });
          break;
        
        //Grupo + Alumno + Juego
        case 2:
        case 30:
        case 31:
        case 32:
          this.peticionesAPI.DameAlumno(evento.AlumnoID).subscribe((alumno) => {
            //console.log(alumno);
            this.DameJuego(evento.TipoJuego, evento.JuegoID).subscribe((juego) => {
              //console.log(juego);
              this.peticionesAPI.DameGrupo(juego.grupoId).subscribe((grupo) => {
                //console.log(grupo);
                datosEvento = {
                  'alumno': alumno,
                  'juego': juego,
                  'grupo': grupo
                };
                obs.next(datosEvento);
              }, (err) => {
                console.log(err);
                Swal.fire({
                  title: "Error al obtener el Grupo del Evento seleccionado",
                  text: err.message,
                  icon: "error",
                  showConfirmButton: false,
                  timer: 3000
                });
                obs.next(datosEvento);
              });
            }, (err) => {
              console.log(err);
              Swal.fire({
                title: "Error al obtener el Juego del Evento seleccionado",
                text: err.message,
                icon: "error",
                showConfirmButton: false,
                timer: 3000
              });
              obs.next(datosEvento);
            });
          }, (err) => {
            console.log(err);
            Swal.fire({
              title: "Error al obtener el Alumno del Evento seleccionado",
              text: err.message,
              icon: "error",
              showConfirmButton: false,
              timer: 3000
            });
            obs.next(datosEvento);
          });
          break;

        case 10: //Grupo + Alumno + Equipo + Juego + Punto
          this.DameJuego(evento.TipoJuego, evento.JuegoID).subscribe((juego) => {
            //console.log(juego);
            this.peticionesAPI.DameGrupo(juego.grupoId).subscribe((grupo) => {
              //console.log(grupo);
              let profesor: Profesor = this.sesion.DameProfesor();
              this.peticionesAPI.DameTipoDePunto(evento.PuntoID, profesor.id).subscribe((punto) => {
                //console.log(punto);
                if(juego.Modo == 'Individual') { //Juego de Puntos Individual
                  this.peticionesAPI.DameAlumno(evento.AlumnoID).subscribe((alumno) => {
                    //console.log(alumno);
                    datosEvento = {
                      'juego': juego,
                      'grupo': grupo,
                      'punto': punto,
                      'alumno': alumno
                    };
                    obs.next(datosEvento);
                  }, (err) => {
                    console.log(err);
                    Swal.fire({
                      title: "Error al obtener el Alumno del Evento seleccionado",
                      text: err.message,
                      icon: "error",
                      showConfirmButton: false,
                      timer: 3000
                    });
                    obs.next(datosEvento);
                  });
                }
                else { //Juego de Puntos en Equipos
                  this.peticionesAPI.DameEquipo(evento.EquipoID).subscribe((equipo) => {
                    //console.log(equipo);
                    datosEvento = {
                      'juego': juego,
                      'grupo': grupo,
                      'punto': punto,
                      'equipo': equipo
                    };
                    obs.next(datosEvento);
                  }, (err) => {
                    console.log(err);
                    Swal.fire({
                      title: "Error al obtener el Equipo del Evento seleccionado",
                      text: err.message,
                      icon: "error",
                      showConfirmButton: false,
                      timer: 3000
                    });
                    obs.next(datosEvento);
                  });
                }
              }, (err) => {
                console.log(err);
                Swal.fire({
                  title: "Error al obtener el Punto del Evento seleccionado",
                  text: err.message,
                  icon: "error",
                  showConfirmButton: false,
                  timer: 3000
                });
                obs.next(datosEvento);
              });
            }, (err) => {
              console.log(err);
              Swal.fire({
                title: "Error al obtener el Grupo del Evento seleccionado",
                text: err.message,
                icon: "error",
                showConfirmButton: false,
                timer: 3000
              });
              obs.next(datosEvento);
            });
          }, (err) => {
            console.log(err);
            Swal.fire({
              title: "Error al obtener el Juego del Evento seleccionado",
              text: err.message,
              icon: "error",
              showConfirmButton: false,
              timer: 3000
            });
            obs.next(datosEvento);
          });
          break;

        case 11: //Grupo + Alumno + Equipo + Juego + Nivel
          this.DameJuego(evento.TipoJuego, evento.JuegoID).subscribe((juego) => {
            //console.log(juego);
            this.peticionesAPI.DameGrupo(juego.grupoId).subscribe((grupo) => {
              //console.log(grupo);
              this.peticionesAPI.DameNivel(evento.NivelID).subscribe((nivel) => {
                //console.log(punto);
                if(juego.Modo == 'Individual') { //Juego de Puntos Individual
                  this.peticionesAPI.DameAlumno(evento.AlumnoID).subscribe((alumno) => {
                    //console.log(alumno);
                    datosEvento = {
                      'juego': juego,
                      'grupo': grupo,
                      'nivel': nivel,
                      'alumno': alumno
                    };
                    obs.next(datosEvento);
                  }, (err) => {
                    console.log(err);
                    Swal.fire({
                      title: "Error al obtener el Alumno del Evento seleccionado",
                      text: err.message,
                      icon: "error",
                      showConfirmButton: false,
                      timer: 3000
                    });
                    obs.next(datosEvento);
                  });
                }
                else { //Juego de Puntos en Equipos
                  this.peticionesAPI.DameEquipo(evento.EquipoID).subscribe((equipo) => {
                    //console.log(equipo);
                    datosEvento = {
                      'juego': juego,
                      'grupo': grupo,
                      'nivel': nivel,
                      'equipo': equipo
                    };
                    obs.next(datosEvento);
                  }, (err) => {
                    console.log(err);
                    Swal.fire({
                      title: "Error al obtener el Equipo del Evento seleccionado",
                      text: err.message,
                      icon: "error",
                      showConfirmButton: false,
                      timer: 3000
                    });
                    obs.next(datosEvento);
                  });
                }
              }, (err) => {
                console.log(err);
                Swal.fire({
                  title: "Error al obtener el Nivel del Evento seleccionado",
                  text: err.message,
                  icon: "error",
                  showConfirmButton: false,
                  timer: 3000
                });
                obs.next(datosEvento);
              });
            }, (err) => {
              console.log(err);
              Swal.fire({
                title: "Error al obtener el Grupo del Evento seleccionado",
                text: err.message,
                icon: "error",
                showConfirmButton: false,
                timer: 3000
              });
              obs.next(datosEvento);
            });
          }, (err) => {
            console.log(err);
            Swal.fire({
              title: "Error al obtener el Juego del Evento seleccionado",
              text: err.message,
              icon: "error",
              showConfirmButton: false,
              timer: 3000
            });
            obs.next(datosEvento);
          });
          break;
        
        //Grupo + Alumno + Equipo + Juego
        case 20:
        case 22:
          this.DameJuego(evento.TipoJuego, evento.JuegoID).subscribe((juego) => {
            //console.log(juego);
            this.peticionesAPI.DameGrupo(juego.grupoId).subscribe((grupo) => {
              //console.log(grupo);
              if(juego.Modo == 'Individual') { //Juego Individual
                this.peticionesAPI.DameAlumno(evento.AlumnoID).subscribe((alumno) => {
                  //console.log(alumno);
                  datosEvento = {
                    'juego': juego,
                    'grupo': grupo,
                    'alumno': alumno
                  };
                  obs.next(datosEvento);
                }, (err) => {
                  console.log(err);
                  Swal.fire({
                    title: "Error al obtener el Alumno del Evento seleccionado",
                    text: err.message,
                    icon: "error",
                    showConfirmButton: false,
                    timer: 3000
                  });
                  obs.next(datosEvento);
                });
              }
              else { //Juego en Equipos
                this.peticionesAPI.DameEquipo(evento.EquipoID).subscribe((equipo) => {
                  //console.log(equipo);
                  datosEvento = {
                    'juego': juego,
                    'grupo': grupo,
                    'equipo': equipo
                  };
                  obs.next(datosEvento);
                }, (err) => {
                  console.log(err);
                  Swal.fire({
                    title: "Error al obtener el Equipo del Evento seleccionado",
                    text: err.message,
                    icon: "error",
                    showConfirmButton: false,
                    timer: 3000
                  });
                  obs.next(datosEvento);
                });
              }
            }, (err) => {
              console.log(err);
              Swal.fire({
                title: "Error al obtener el Grupo del Evento seleccionado",
                text: err.message,
                icon: "error",
                showConfirmButton: false,
                timer: 3000
              });
              obs.next(datosEvento);
            });
          }, (err) => {
            console.log(err);
            Swal.fire({
              title: "Error al obtener el Juego del Evento seleccionado",
              text: err.message,
              icon: "error",
              showConfirmButton: false,
              timer: 3000
            });
            obs.next(datosEvento);
          });
          break;

        case 21: //Grupo + Alumno + Equipo + Juego + AlumnoReceptorCromo + EquipoReceptorCromo
          this.DameJuego(evento.TipoJuego, evento.JuegoID).subscribe((juego) => {
            //console.log(juego);
            this.peticionesAPI.DameGrupo(juego.grupoId).subscribe((grupo) => {
              //console.log(grupo);
              if(juego.Modo == 'Individual') { //Juego de Colección Individual
                this.peticionesAPI.DameAlumno(evento.AlumnoID).subscribe((alumno) => {
                  //console.log(alumno);
                  this.peticionesAPI.DameAlumno(evento.AlumnoReceptorCromoID).subscribe((alumnoReceptorCromo) => {
                    //console.log(alumnoReceptorCromo);
                    datosEvento = {
                      'juego': juego,
                      'grupo': grupo,
                      'alumno': alumno,
                      'alumnoReceptorCromo': alumnoReceptorCromo
                    };
                    obs.next(datosEvento);
                  }, (err) => {
                    console.log(err);
                    Swal.fire({
                      title: "Error al obtener el Alumno Receptor de Cromo del Evento seleccionado",
                      text: err.message,
                      icon: "error",
                      showConfirmButton: false,
                      timer: 3000
                    });
                    obs.next(datosEvento);
                  });
                }, (err) => {
                  console.log(err);
                  Swal.fire({
                    title: "Error al obtener el Alumno del Evento seleccionado",
                    text: err.message,
                    icon: "error",
                    showConfirmButton: false,
                    timer: 3000
                  });
                  obs.next(datosEvento);
                });
              }
              else { //Juego de Colección en Equipos
                this.peticionesAPI.DameEquipo(evento.EquipoID).subscribe((equipo) => {
                  //console.log(equipo);
                  this.peticionesAPI.DameEquipo(evento.EquipoReceptorCromoID).subscribe((equipoReceptorCromo) => {
                    datosEvento = {
                      'juego': juego,
                      'grupo': grupo,
                      'equipo': equipo,
                      'equipoReceptorCromo': equipoReceptorCromo
                    };
                    obs.next(datosEvento);
                  }, (err) => {
                    console.log(err);
                    Swal.fire({
                      title: "Error al obtener el Equipo Receptor de Cromo del Evento seleccionado",
                      text: err.message,
                      icon: "error",
                      showConfirmButton: false,
                      timer: 3000
                    });
                    obs.next(datosEvento);
                  });
                }, (err) => {
                  console.log(err);
                  Swal.fire({
                    title: "Error al obtener el Equipo del Evento seleccionado",
                    text: err.message,
                    icon: "error",
                    showConfirmButton: false,
                    timer: 3000
                  });
                  obs.next(datosEvento);
                });
              }
            }, (err) => {
              console.log(err);
              Swal.fire({
                title: "Error al obtener el Grupo del Evento seleccionado",
                text: err.message,
                icon: "error",
                showConfirmButton: false,
                timer: 3000
              });
              obs.next(datosEvento);
            });
          }, (err) => {
            console.log(err);
            Swal.fire({
              title: "Error al obtener el Juego del Evento seleccionado",
              text: err.message,
              icon: "error",
              showConfirmButton: false,
              timer: 3000
            });
            obs.next(datosEvento);
          });
          break;

        default:
          obs.next(datosEvento);
          break;
      }
    });
    return datosEventoObservable;
  }

  //Devuelve el Observable con los valores para generar la mini tabla de Filtros (Para el PDF del Registro de Actividad)
  public DameTablaFiltros(filtrarTipoEvento: boolean, filtroTipoEvento: number, filtrarFecha: boolean, filtroFechaInicial: Date, filtroFechaFinal: Date, filtroGrupo: Grupo, filtrarAlumno: boolean, filtroAlumno: Alumno, filtrarEquipo: boolean, filtroEquipo: Equipo, filtrarTipoJuego: boolean, filtroTipoJuego: string, filtrarJuego: boolean, filtroJuego: any, filtrarPunto: boolean, filtroPunto: Punto, filtrarNivel: boolean, filtroNivel: Nivel, filtrarAlumnoReceptorCromo: boolean, filtroAlumnoReceptorCromo: Alumno, filtrarEquipoReceptorCromo: boolean, filtroEquipoReceptorCromo: Equipo, filtrarPrivilegio: boolean, filtroPrivilegio: number): Observable<any> {
    const tablaFiltrosObservable: Observable<any> = new Observable((obs) => {
      let tablaFiltros: string[] = [];

      if(filtrarTipoEvento) { 
        switch(Number(filtroTipoEvento)) {
          case 1: tablaFiltros.push("Creación del Juego"); 
            break;
          case 2: tablaFiltros.push("Acceso al Juego"); 
            break;
          case 10: tablaFiltros.push("Asignación de Punto/s"); 
            break;
          case 11: tablaFiltros.push("Ascenso de Nivel (Juego de Puntos)"); 
            break;
          case 20: tablaFiltros.push("Asignación de Cromo/s"); 
            break;
          case 21: tablaFiltros.push("Regalo de Cromo"); 
            break;
          case 22: tablaFiltros.push("Finalización de Colección de Cromos"); 
            break;
          case 30: tablaFiltros.push("Asignación de Privilegio (Juego de Avatar)"); 
            break;
          case 31: tablaFiltros.push("Eliminación de Privilegio (Juego de Avatar)"); 
            break;
          case 32: tablaFiltros.push("Modificación de Avatar (Juego de Avatar)"); 
            break;
        }
      }
      else { tablaFiltros.push(" - "); }
  
      if(filtrarFecha){
        let diaInicial = ('0' + filtroFechaInicial.getDate()).slice(-2);
        let mesInicial = ('0' + (filtroFechaInicial.getMonth() + 1)).slice(-2);
        let anyoInicial = filtroFechaInicial.getFullYear();
        let fechaInicial: string = `${diaInicial}/${mesInicial}/${anyoInicial}`;
  
        let diaFinal = ('0' + filtroFechaFinal.getDate()).slice(-2);
        let mesFinal = ('0' + (filtroFechaFinal.getMonth() + 1)).slice(-2);
        let anyoFinal = filtroFechaFinal.getFullYear();
        let fechaFinal: string = `${diaFinal}/${mesFinal}/${anyoFinal}`;
  
        tablaFiltros.push(`Entre el ${fechaInicial} y el ${fechaFinal}`);
      }
      else { tablaFiltros.push(" - "); }
      
      if(filtroGrupo.id != null) { tablaFiltros.push(filtroGrupo.Nombre); }
      else { tablaFiltros.push(" - "); }
  
      if(filtrarAlumno) { tablaFiltros.push(`${filtroAlumno.Nombre} ${filtroAlumno.PrimerApellido} ${filtroAlumno.SegundoApellido}`); }
      else if(filtrarEquipo) { tablaFiltros.push(`${filtroEquipo.Nombre} (Equipo)`); }
      else { tablaFiltros.push(" - "); }
      
      if(filtrarTipoJuego) { 
        if(filtrarJuego) { tablaFiltros.push(`${filtroJuego.NombreJuego} (${filtroTipoJuego})`); }
        else { tablaFiltros.push(`Tipo: ${filtroTipoJuego}`); }
      }
      else {
        if(filtrarJuego) { tablaFiltros.push(`Nombre: ${filtroJuego.NombreJuego}`); }
        else { tablaFiltros.push(" - "); }
      }
  
      if(filtrarPunto) { tablaFiltros.push(`Tipo: ${filtroPunto.Nombre}`); }
      else { tablaFiltros.push(" - "); }
  
      if(filtrarNivel) { tablaFiltros.push(filtroNivel.Nombre); }
      else { tablaFiltros.push(" - "); }
  
      if(filtrarAlumnoReceptorCromo) { tablaFiltros.push(`Cromo regalado a ${filtroAlumnoReceptorCromo.Nombre} ${filtroAlumnoReceptorCromo.PrimerApellido} ${filtroAlumnoReceptorCromo.SegundoApellido}`); }
      else if(filtrarEquipoReceptorCromo) { tablaFiltros.push(`Cromo regalado al equipo ${filtroEquipoReceptorCromo}`); }
      else { tablaFiltros.push(" - "); }
  
      if(filtrarPrivilegio) {
        let nombrePrivilegio: string = " ";
        if (filtroPrivilegio == 5) { 
          nombrePrivilegio = "Privilegio Nota de Voz"; 
        }
        else if (filtroPrivilegio == 6) {
          nombrePrivilegio = "Privilegio Espiar";
        }
        else {
          nombrePrivilegio = `Privilegio ${filtroPrivilegio}`;
        }
  
        tablaFiltros.push(nombrePrivilegio);
      }
      else { tablaFiltros.push(" - "); }

      obs.next(tablaFiltros);
    });
    return tablaFiltrosObservable;
  }

  //Devuelve el Observable con los valores para generar la tabla de Eventos (Para el PDF del Registro de Actividad)
  public DameTablaEventos(listaEventos: Evento[]): Observable<any> {
    const tablaEventosObservable: Observable<any> = new Observable((obs) => {
      let tablaEventos: string[][] = [];
      let contadorFilas: number = 0; //Cuando sea igual a la longitud de la listaEventos, entonces se retornará para generar el PDF

      for (let i: number = 0; i < listaEventos.length; i++) { //Lo hacemos con for en vez de foreach para que no se desordene la lista
        let diaEvento = ('0' + listaEventos[i].FechayHora.getDate()).slice(-2);
        let mesEvento = ('0' + (listaEventos[i].FechayHora.getMonth() + 1)).slice(-2);
        let anyoEvento = listaEventos[i].FechayHora.getFullYear();
        let horaEvento = ('0' + listaEventos[i].FechayHora.getHours()).slice(-2);
        let minutosEvento = ('0' + listaEventos[i].FechayHora.getMinutes()).slice(-2);
        let fechaEvento: string = `${diaEvento}/${mesEvento}/${anyoEvento} ${horaEvento}:${minutosEvento}`;

        this.DameDatosEvento(listaEventos[i]).subscribe((datos) => {
          switch (Number(listaEventos[i].TipoEvento)) {
            case 1: //Grupo + Juego
              tablaEventos[i] = ["Creación del Juego", fechaEvento, String(datos.grupo.Nombre), " - ", `${String(datos.juego.NombreJuego)} (${String(datos.juego.Tipo)})`, " - ", " - ", " - ", " - "];
              break;

            case 2: //Grupo + Alumno + Juego
              let alumnoEvento: string = `${datos.alumno.Nombre} ${datos.alumno.PrimerApellido} ${datos.alumno.SegundoApellido}`;
              tablaEventos[i] = ["Acceso al Juego", fechaEvento, String(datos.grupo.Nombre), alumnoEvento, `${String(datos.juego.NombreJuego)} (${String(datos.juego.Tipo)})`, " - ", " - ", " - ", " - "];
              break;

            case 10: //Grupo + Alumno + Equipo + Juego + Punto
              if (datos.juego.Modo == 'Individual') { //Juego de Puntos Individual
                let alumnoEvento: string = `${datos.alumno.Nombre} ${datos.alumno.PrimerApellido} ${datos.alumno.SegundoApellido}`;
                tablaEventos[i] = ["Asignación de Punto/s", fechaEvento, String(datos.grupo.Nombre), alumnoEvento, `${String(datos.juego.NombreJuego)} (${String(datos.juego.Tipo)})`, `${listaEventos[i].NumeroPuntos} punto/s de ${String(datos.punto.Nombre)}`, " - ", " - ", " - "];
              }
              else { //Juego de Puntos en Equipos
                tablaEventos[i] = ["Asignación de Punto/s", fechaEvento, String(datos.grupo.Nombre), `${String(datos.equipo.Nombre)} (Equipo)`, `${String(datos.juego.NombreJuego)} (${String(datos.juego.Tipo)})`, `${listaEventos[i].NumeroPuntos} punto/s de ${String(datos.punto.Nombre)}`, " - ", " - ", " - "];
              }
              break;

            case 11: //Grupo + Alumno + Equipo + Juego + Nivel
              if (datos.juego.Modo == 'Individual') { //Juego de Puntos Individual
                let alumnoEvento: string = `${datos.alumno.Nombre} ${datos.alumno.PrimerApellido} ${datos.alumno.SegundoApellido}`;
                tablaEventos[i] = ["Ascenso de Nivel (Juego de Puntos)", fechaEvento, String(datos.grupo.Nombre), alumnoEvento, `${String(datos.juego.NombreJuego)} (${String(datos.juego.Tipo)})`, " - ", `${datos.nivel.Nombre} (${String(datos.nivel.PuntosAlcanzar)} p)`, " - ", " - "];
              }
              else { //Juego de Puntos en Equipos
                tablaEventos[i] = ["Ascenso de Nivel (Juego de Puntos)", fechaEvento, String(datos.grupo.Nombre), `${String(datos.equipo.Nombre)} (Equipo)`, `${String(datos.juego.NombreJuego)} (${String(datos.juego.Tipo)})`, " - ", `${datos.nivel.Nombre} (${String(datos.nivel.PuntosAlcanzar)} p)`, " - ", " - "];
              }
              break;

            case 20: //Grupo + Alumno + Equipo + Juego + Cromos
              if (datos.juego.Modo == 'Individual') { //Juego de Colección Individual
                let alumnoEvento: string = `${datos.alumno.Nombre} ${datos.alumno.PrimerApellido} ${datos.alumno.SegundoApellido}`;
                tablaEventos[i] = ["Asignación de Cromo/s", fechaEvento, String(datos.grupo.Nombre), alumnoEvento, `${String(datos.juego.NombreJuego)} (${String(datos.juego.Tipo)})`, " - ", " - ", `${listaEventos[i].NumeroCromos} cromo/s`, " - "];
              }
              else { //Juego de Colección en Equipos
                tablaEventos[i] = ["Asignación de Cromo/s", fechaEvento, String(datos.grupo.Nombre), `${String(datos.equipo.Nombre)} (Equipo)`, `${String(datos.juego.NombreJuego)} (${String(datos.juego.Tipo)})`, " - ", " - ", `${listaEventos[i].NumeroCromos} cromo/s`, " - "];
              }
              break;
            
            case 21: //Grupo + Alumno + Equipo + Juego + AlumnoReceptorCromo + EquipoReceptorCromo
              if (datos.juego.Modo == 'Individual') { //Juego de Colección Individual
                let alumnoEvento: string = `${datos.alumno.Nombre} ${datos.alumno.PrimerApellido} ${datos.alumno.SegundoApellido}`;
                let alumnoReceptorCromoEvento: string = `${datos.alumnoReceptorCromo.Nombre} ${datos.alumnoReceptorCromo.PrimerApellido} ${datos.alumnoReceptorCromo.SegundoApellido}`;
                tablaEventos[i] = ["Regalo de Cromo", fechaEvento, String(datos.grupo.Nombre), alumnoEvento, `${String(datos.juego.NombreJuego)} (${String(datos.juego.Tipo)})`, " - ", " - ", `Cromo regalado a ${alumnoReceptorCromoEvento}`, " - "];
              }
              else { //Juego de Colección en Equipos
                tablaEventos[i] = ["Regalo de Cromo", fechaEvento, String(datos.grupo.Nombre), `${String(datos.equipo.Nombre)} (Equipo)`, `${String(datos.juego.NombreJuego)} (${String(datos.juego.Tipo)})`, " - ", " - ", `Cromo regalado al Equipo ${String(datos.equipoReceptorCromo.Nombre)}`, " - "];
              }
              break;

            case 22: //Grupo + Alumno + Equipo + Juego
              if (datos.juego.Modo == 'Individual') { //Juego de Colección Individual
                let alumnoEvento: string = `${datos.alumno.Nombre} ${datos.alumno.PrimerApellido} ${datos.alumno.SegundoApellido}`;
                tablaEventos[i] = ["Finalización de Colección de Cromos", fechaEvento, String(datos.grupo.Nombre), alumnoEvento, `${String(datos.juego.NombreJuego)} (${String(datos.juego.Tipo)})`, " - ", " - ", " - ", " - "];
              }
              else { //Juego de Colección en Equipos
                tablaEventos[i] = ["Finalización de Colección de Cromos", fechaEvento, String(datos.grupo.Nombre), `${String(datos.equipo.Nombre)} (Equipo)`, `${String(datos.juego.NombreJuego)} (${String(datos.juego.Tipo)})`, " - ", " - ", " - ", " - "];
              }
              break;

            case 30: //Grupo + Alumno + Juego + Privilegio
              let nombrePrivilegioAsignado: string = " ";
              if (listaEventos[i].Privilegio == 5) { 
                nombrePrivilegioAsignado = "Privilegio Nota de Voz"; 
              }
              else if (listaEventos[i].Privilegio == 6) {
                nombrePrivilegioAsignado = "Privilegio Espiar";
              }
              else {
                nombrePrivilegioAsignado = `Privilegio ${listaEventos[i].Privilegio}`;
              }

              let alumnoAsignacionPrivilegio: string = `${datos.alumno.Nombre} ${datos.alumno.PrimerApellido} ${datos.alumno.SegundoApellido}`;
              tablaEventos[i] = ["Asignación de Privilegio (Juego de Avatar)", fechaEvento, String(datos.grupo.Nombre), alumnoAsignacionPrivilegio, `${String(datos.juego.NombreJuego)} (${String(datos.juego.Tipo)})`, " - ", " - ", " - ", `${nombrePrivilegioAsignado}`];
              break;

            case 31:
              let nombrePrivilegioEliminado: string = " ";
              if (listaEventos[i].Privilegio == 5) { 
                nombrePrivilegioEliminado = "Privilegio Nota de Voz"; 
              }
              else if (listaEventos[i].Privilegio == 6) {
                nombrePrivilegioEliminado = "Privilegio Espiar";
              }
              else {
                nombrePrivilegioEliminado = `Privilegio ${listaEventos[i].Privilegio}`;
              }

              let alumnoEliminacionPrivilegio: string = `${datos.alumno.Nombre} ${datos.alumno.PrimerApellido} ${datos.alumno.SegundoApellido}`;
              tablaEventos[i] = ["Eliminación de Privilegio (Juego de Avatar)", fechaEvento, String(datos.grupo.Nombre), alumnoEliminacionPrivilegio, `${String(datos.juego.NombreJuego)} (${String(datos.juego.Tipo)})`, " - ", " - ", " - ", `${nombrePrivilegioEliminado}`];
              break;

            case 32:
              let alumnoModificacionAvatar: string = `${datos.alumno.Nombre} ${datos.alumno.PrimerApellido} ${datos.alumno.SegundoApellido}`;
              tablaEventos[i] = ["Modificación de Avatar (Juego de Avatar)", fechaEvento, String(datos.grupo.Nombre), alumnoModificacionAvatar, `${String(datos.juego.NombreJuego)} (${String(datos.juego.Tipo)})`, " - ", " - ", " - ", " - "];
              break;

            default:
              tablaEventos[i] = [" - ", " - ", " - ", " - ", " - ", " - ", " - ", " - ", " - "];
              break;
          }
          //Ya se ha procesado esta fila de la tabla (elemento de la listaEventos)
          contadorFilas = contadorFilas + 1;

          if (contadorFilas == listaEventos.length) { //Ya se han cargado todos los datos de cada fila de la tabla (cada elemento de la listaEventos)
            obs.next(tablaEventos);
          }
        }, (err) => {
          console.log(err);

          Swal.fire({
            title: `Error al obtener los Datos del Evento número ${i}`,
            text: err.message,
            icon: "error",
            showConfirmButton: false,
            timer: 3000
          });

          //Ya se ha procesado esta fila de la tabla (elemento de la listaEventosPaginada)
          contadorFilas = contadorFilas + 1;

          if (contadorFilas == listaEventos.length) { //Ya se han cargado todos los datos de cada fila de la tabla (cada elemento de la listaEventos)
            obs.next(tablaEventos);
          }
        });
      }
    });
    return tablaEventosObservable;
  }

  //----------------------------------------------------------------------------------------------------------------------------------//


  //-------------------------------------------------- CÁLCULOS PARA LOS GRÁFICOS DE ACTIVIDAD --------------------------------------------------//

  //Devuelve los valores necesarios para mostrar el Histograma seleccionado
  public CalculaHistograma(tipoHistograma: number, diaInicial: Date, diaFinal: Date, juegoSeleccionado: any, profesor: Profesor, alumnoSeleccionado?: Alumno, equipoSeleccionado?: Equipo, puntoSeleccionado?: Punto, nivelSeleccionado?: Nivel, alumnoReceptorCromoSeleccionado?: Alumno, equipoReceptorCromoSeleccionado?: Equipo): Observable<any> {
    const histogramaObservable: Observable<any> = new Observable((obs) => {
      let histograma: any = {};

      //Para que se busque hasta el último día, incluido:
      diaFinal.setHours(23);
      diaFinal.setMinutes(59);
      diaFinal.setSeconds(59);
      diaFinal.setMilliseconds(999);
      let numDias: number = Math.ceil((diaFinal.getTime() - diaInicial.getTime()) / (1000 * 60 * 60 * 24)); //Número de días de diferencia entre el inicial y final; El ceil hace que ambos estén incluídos también
      //console.log(`Número de barras (días): ${numDias}`);
      
      let fechaBusqueda: Date = diaInicial; //Dia en el que se van a buscar los eventos
      let dias: string[] = []; //Valores X de las barras

      let eventosFiltrados: Evento[] = []; //Necesaria para poder parsear las fechas

      switch (Number(tipoHistograma)) {
        case 1: //Número de accesos a un Juego de un Alumno
          let accesos: number[] = []; //Valores Y de las barras

          let filtrosAcceso: string = " ";
          if (alumnoSeleccionado.Username === "todos") {
            filtrosAcceso = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=2&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
          }
          else {
            filtrosAcceso = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=2&filter[where][AlumnoID]=${alumnoSeleccionado.id}&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
          }

          this.peticionesAPI.DameEventosFiltrados(filtrosAcceso).subscribe((eventos) => {
            //console.log(eventos);
            eventos.forEach((evento) => {
              eventosFiltrados.push(new Evento(evento.TipoEvento, new Date(evento.FechayHora), evento.ProfesorID, evento.AlumnoID, evento.EquipoID, evento.JuegoID, evento.NombreJuego, evento.TipoJuego, evento.PuntoID, evento.NumeroPuntos, evento.NivelID, evento.NumeroCromos, evento.AlumnoReceptorCromoID, evento.EquipoReceptorCromoID, evento.Privilegio));
            });

            for (let contDias: number = 0; contDias < numDias; contDias++) {
              let accesosDia: number = 0;
            
              eventosFiltrados.forEach((evento) => {
                if ((evento.FechayHora.getDate() === fechaBusqueda.getDate()) && (evento.FechayHora.getMonth() === fechaBusqueda.getMonth()) && (evento.FechayHora.getFullYear() === fechaBusqueda.getFullYear())) { //Es el día a buscar
                  accesosDia = accesosDia + 1;
                }
              });

              accesos[contDias] = accesosDia;
              dias[contDias] = `${fechaBusqueda.toLocaleDateString()}`;
              fechaBusqueda.setDate(diaInicial.getDate() + 1);
            }

            histograma = {
              color: ['#3398DB'],
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              grid: {
                left: '5%',
                right: '5%',
                bottom: '10%',
                containLabel: true
              },
              xAxis: [
                {
                  type: 'category',
                  data: dias,
                  axisTick: {
                    alignWithLabel: true
                  }
                }
              ],
              yAxis: [{
                type: 'value'
              }],
              series: [{
                name: "Nº de accesos",
                type: 'bar',
                barWidth: '50%',
                data: accesos
              }]
            };
            obs.next(histograma);
          }, (err) => {
            console.log(err);
            Swal.fire({
              title: "Error al obtener los Eventos filtrados para procesar los Datos del Histograma",
              text: err.message,
              icon: "error",
              showConfirmButton: false,
              timer: 3000
            });
            obs.next(histograma);
          });
          break;

        case 2: //Número de Alumnos que han accedido a un Juego
          let alumnosAcceso: number[] = []; //Valores Y de las barras

          this.peticionesAPI.DameEventosFiltrados(`?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=2&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`).subscribe((eventos) => {
            //console.log(eventos);
            eventos.forEach((evento) => {
              eventosFiltrados.push(new Evento(evento.TipoEvento, new Date(evento.FechayHora), evento.ProfesorID, evento.AlumnoID, evento.EquipoID, evento.JuegoID, evento.NombreJuego, evento.TipoJuego, evento.PuntoID, evento.NumeroPuntos, evento.NivelID, evento.NumeroCromos, evento.AlumnoReceptorCromoID, evento.EquipoReceptorCromoID, evento.Privilegio));
            });

            for (let contDias: number = 0; contDias < numDias; contDias++) {
              let alumnosAccesoDia: number = 0;
              let alumnosDiferentesDia: number[] = [];

              eventosFiltrados.forEach((evento) => {
                if ((evento.FechayHora.getDate() === fechaBusqueda.getDate()) && (evento.FechayHora.getMonth() === fechaBusqueda.getMonth()) && (evento.FechayHora.getFullYear() === fechaBusqueda.getFullYear())) { //Es el día a buscar
                  //En este caso el contador sólo cuenta cuántos alumnos en ese día han entrado al Juego
                  if (!alumnosDiferentesDia.includes(evento.AlumnoID)){
                    alumnosDiferentesDia.push(evento.AlumnoID);
                    alumnosAccesoDia = alumnosAccesoDia + 1;
                  }
                }
              });

              alumnosAcceso[contDias] = alumnosAccesoDia;
              dias[contDias] = `${fechaBusqueda.toLocaleDateString()}`;
              fechaBusqueda.setDate(diaInicial.getDate() + 1);
            }

            histograma = {
              color: ['#3398DB'],
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              grid: {
                left: '5%',
                right: '5%',
                bottom: '10%',
                containLabel: true
              },
              xAxis: [
                {
                  type: 'category',
                  data: dias,
                  axisTick: {
                    alignWithLabel: true
                  }
                }
              ],
              yAxis: [{
                type: 'value'
              }],
              series: [{
                name: "Nº de Alumnos que han accedido",
                type: 'bar',
                barWidth: '50%',
                data: alumnosAcceso
              }]
            };
            obs.next(histograma);
          }, (err) => {
            console.log(err);
            Swal.fire({
              title: "Error al obtener los Eventos filtrados para procesar los Datos del Histograma",
              text: err.message,
              icon: "error",
              showConfirmButton: false,
              timer: 3000
            });
            obs.next(histograma);
          });
          break;
  
        case 10: //Número de Puntos obtenidos por un Alumno/Equipo
          let puntos: any[] = []; //Valores Y de las barras

          let filtrosPuntos: string = " ";
          let filtrosNiveles: string = " "; //Para comprobar si en el día se ha subido de nivel, si se ha subido de nivel se marca la barra en otro color
          if (puntoSeleccionado.Nombre === " [TODOS LOS TIPOS DE PUNTO] ") {
            if (juegoSeleccionado.Modo == 'Individual') { //Individual
              if (alumnoSeleccionado.Username === "todos") {
                filtrosPuntos = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=10&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
                filtrosNiveles = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=11&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
              }
              else {
                filtrosPuntos = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=10&filter[where][AlumnoID]=${alumnoSeleccionado.id}&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
                filtrosNiveles = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=11&filter[where][AlumnoID]=${alumnoSeleccionado.id}&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
              }
            }
            else { //En Equipos
              if (equipoSeleccionado.Nombre === " [TODOS LOS EQUIPOS] ") {
                filtrosPuntos = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=10&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
                filtrosNiveles = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=11&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
              }
              else {
                filtrosPuntos = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=10&filter[where][EquipoID]=${equipoSeleccionado.id}&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
                filtrosNiveles = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=11&filter[where][EquipoID]=${equipoSeleccionado.id}&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
              }
            }
          }
          else { //Un Punto en concreto
            if (juegoSeleccionado.Modo == 'Individual') { //Individual
              if (alumnoSeleccionado.Username === "todos") {
                filtrosPuntos = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=10&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}&filter[where][PuntoID]=${puntoSeleccionado.id}`;
                filtrosNiveles = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=11&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
              }
              else {
                filtrosPuntos = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=10&filter[where][AlumnoID]=${alumnoSeleccionado.id}&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}&filter[where][PuntoID]=${puntoSeleccionado.id}`;
                filtrosNiveles = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=11&filter[where][AlumnoID]=${alumnoSeleccionado.id}&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
              }
            }
            else { //En Equipos
              if (equipoSeleccionado.Nombre === " [TODOS LOS EQUIPOS] ") {
                filtrosPuntos = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=10&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}&filter[where][PuntoID]=${puntoSeleccionado.id}`;
                filtrosNiveles = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=11&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
              }
              else {
                filtrosPuntos = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=10&filter[where][EquipoID]=${equipoSeleccionado.id}&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}&filter[where][PuntoID]=${puntoSeleccionado.id}`;
                filtrosNiveles = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=11&filter[where][EquipoID]=${equipoSeleccionado.id}&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
              }
            }
          }

          this.peticionesAPI.DameEventosFiltrados(filtrosPuntos).subscribe((eventos) => {
            //console.log(eventos);
            eventos.forEach((evento) => {
              eventosFiltrados.push(new Evento(evento.TipoEvento, new Date(evento.FechayHora), evento.ProfesorID, evento.AlumnoID, evento.EquipoID, evento.JuegoID, evento.NombreJuego, evento.TipoJuego, evento.PuntoID, evento.NumeroPuntos, evento.NivelID, evento.NumeroCromos, evento.AlumnoReceptorCromoID, evento.EquipoReceptorCromoID, evento.Privilegio));
            });

            let eventosFiltradosNiveles: Evento[] = []; //Para comprobar si en el día concreto se ha subido de nivel
            this.peticionesAPI.DameEventosFiltrados(filtrosNiveles).subscribe((eventos) => {
              //console.log(eventos);
              eventos.forEach((evento) => {
                eventosFiltradosNiveles.push(new Evento(evento.TipoEvento, new Date(evento.FechayHora), evento.ProfesorID, evento.AlumnoID, evento.EquipoID, evento.JuegoID, evento.NombreJuego, evento.TipoJuego, evento.PuntoID, evento.NumeroPuntos, evento.NivelID, evento.NumeroCromos, evento.AlumnoReceptorCromoID, evento.EquipoReceptorCromoID, evento.Privilegio));
              });

              for (let contDias: number = 0; contDias < numDias; contDias++) {
                let puntosDia: number = 0;
                let ascensoDia: boolean = false;
  
                eventosFiltrados.forEach((evento) => {
                  if ((evento.FechayHora.getDate() === fechaBusqueda.getDate()) && (evento.FechayHora.getMonth() === fechaBusqueda.getMonth()) && (evento.FechayHora.getFullYear() === fechaBusqueda.getFullYear())) { //Es el día a buscar
                    puntosDia = puntosDia + evento.NumeroPuntos;

                    eventosFiltradosNiveles.forEach((eventoNiveles) => {
                      if ((eventoNiveles.FechayHora.getDate() === fechaBusqueda.getDate()) && (eventoNiveles.FechayHora.getMonth() === fechaBusqueda.getMonth()) && (eventoNiveles.FechayHora.getFullYear() === fechaBusqueda.getFullYear())) { //Es el día a buscar
                        //Se ha subido de nivel
                        ascensoDia = true;
                      }
                    });
                  }
                });
                if (ascensoDia) {
                  puntos[contDias] = { value: puntosDia, itemStyle: { color: 'green'}};
                }
                else {
                  puntos[contDias] = puntosDia;
                }
                dias[contDias] = `${fechaBusqueda.toLocaleDateString()}`;
                fechaBusqueda.setDate(diaInicial.getDate() + 1);
              }

              histograma = {
                color: ['#3398DB', 'green'],
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'shadow'
                  }
                },
                legend: {
                  data: ["Nº de Puntos obtenidos", "Ascenso de nivel"]
                },
                grid: {
                  left: '5%',
                  right: '5%',
                  bottom: '10%',
                  containLabel: true
                },
                xAxis: [
                  {
                    type: 'category',
                    data: dias,
                    axisTick: {
                      alignWithLabel: true
                    }
                  }
                ],
                yAxis: [{
                  type: 'value',
                }],
                series: [{
                  name: "Nº de Puntos obtenidos",
                  type: 'bar',
                  barWidth: '50%',
                  data: puntos
                }, {
                  name: "Ascenso de nivel",
                  type: 'bar',
                  data: []
                }]
              };
              obs.next(histograma);
            }, (err) => {
              console.log(err);
              Swal.fire({
                title: "Error al obtener los Eventos filtrados para procesar los Datos del Histograma",
                text: err.message,
                icon: "error",
                showConfirmButton: false,
                timer: 3000
              });
              obs.next(histograma);
            });
          }, (err) => {
            console.log(err);
            Swal.fire({
              title: "Error al obtener los Eventos filtrados para procesar los Datos del Histograma",
              text: err.message,
              icon: "error",
              showConfirmButton: false,
              timer: 3000
            });
            obs.next(histograma);
          }); 
          break;

        case 11: //Número de Alumnos/Equipos que han obtenido el Tipo de Punto
          let alumnosPunto: number[] = []; //Valores Y de las barras
          let equiposPunto: number[] = []; //Valores Y de las barras

          let filtrosNumAlumnosEquiposPunto: string = " ";
          if (puntoSeleccionado.Nombre === " [TODOS LOS TIPOS DE PUNTO] ") {
            filtrosNumAlumnosEquiposPunto = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=10&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
          }
          else { 
            filtrosNumAlumnosEquiposPunto = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=10&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}&filter[where][PuntoID]=${puntoSeleccionado.id}`;
          }

          this.peticionesAPI.DameEventosFiltrados(filtrosNumAlumnosEquiposPunto).subscribe((eventos) => {
            //console.log(eventos);
            eventos.forEach((evento) => {
              eventosFiltrados.push(new Evento(evento.TipoEvento, new Date(evento.FechayHora), evento.ProfesorID, evento.AlumnoID, evento.EquipoID, evento.JuegoID, evento.NombreJuego, evento.TipoJuego, evento.PuntoID, evento.NumeroPuntos, evento.NivelID, evento.NumeroCromos, evento.AlumnoReceptorCromoID, evento.EquipoReceptorCromoID, evento.Privilegio));
            });

            for (let contDias: number = 0; contDias < numDias; contDias++) {
              let alumnosPuntoDia: number = 0;
              let equiposPuntoDia: number = 0;
              let alumnosDiferentesDia: number[] = [];
              let equiposDiferentesDia: number[] = [];

              eventosFiltrados.forEach((evento) => {
                if ((evento.FechayHora.getDate() === fechaBusqueda.getDate()) && (evento.FechayHora.getMonth() === fechaBusqueda.getMonth()) && (evento.FechayHora.getFullYear() === fechaBusqueda.getFullYear())) { //Es el día a buscar
                  //En este caso el contador sólo cuenta cuántos Alumnos/Equipos en ese día han obtenido Puntos
                  if(juegoSeleccionado.Modo == 'Individual') { //Individual
                    if(evento.AlumnoID != undefined) { //Es un Evento de un JDP Individual
                      if (!alumnosDiferentesDia.includes(evento.AlumnoID)) {
                        alumnosDiferentesDia.push(evento.AlumnoID);
                        alumnosPuntoDia = alumnosPuntoDia + 1;
                      }
                    }
                  }
                  else { //En Equipo
                    if(evento.EquipoID != undefined) { //Es un Evento de un JDP En Equipos
                      if (!equiposDiferentesDia.includes(evento.EquipoID)) {
                        equiposDiferentesDia.push(evento.EquipoID);
                        equiposPuntoDia = equiposPuntoDia + 1;
                      }
                    }
                  }
                }
              });

              alumnosPunto[contDias] = alumnosPuntoDia;
              equiposPunto[contDias] = equiposPuntoDia;
              dias[contDias] = `${fechaBusqueda.toLocaleDateString()}`;
              fechaBusqueda.setDate(diaInicial.getDate() + 1);
            }

            if (juegoSeleccionado.Modo == 'Individual') {
              histograma = {
                color: ['#3398DB'],
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'shadow'
                  }
                },
                grid: {
                  left: '5%',
                  right: '5%',
                  bottom: '10%',
                  containLabel: true
                },
                xAxis: [
                  {
                    type: 'category',
                    data: dias,
                    axisTick: {
                      alignWithLabel: true
                    }
                  }
                ],
                yAxis: [{
                  type: 'value'
                }],
                series: [{
                  name: "Nº de Alumnos que lo han obtenido",
                  type: 'bar',
                  barWidth: '50%',
                  data: alumnosPunto
                }]
              };
            }
            else {
              histograma = {
                color: ['#3398DB'],
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'shadow'
                  }
                },
                grid: {
                  left: '5%',
                  right: '5%',
                  bottom: '10%',
                  containLabel: true
                },
                xAxis: [
                  {
                    type: 'category',
                    data: dias,
                    axisTick: {
                      alignWithLabel: true
                    }
                  }
                ],
                yAxis: [{
                  type: 'value'
                }],
                series: [{
                  name: "Nº de Equipos que lo han obtenido",
                  type: 'bar',
                  barWidth: '50%',
                  data: equiposPunto
                }]
              };
            }
            obs.next(histograma);
            }, (err) => {
              console.log(err);
              Swal.fire({
                title: "Error al obtener los Eventos filtrados para procesar los Datos del Histograma",
                text: err.message,
                icon: "error",
                showConfirmButton: false,
                timer: 3000
              });
              obs.next(histograma);
            });
          break;

        case 20: //Número de Cromos obtenidos por un Alumno/Equipo
          let cromos: number[] = []; //Valores Y de las barras

          let filtrosCromos: string = " ";
          if (juegoSeleccionado.Modo == 'Individual') { //Individual
            if (alumnoSeleccionado.Username === "todos") {
              filtrosCromos = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=20&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
            }
            else {
              filtrosCromos = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=20&filter[where][AlumnoID]=${alumnoSeleccionado.id}&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
            }
          }
          else { //En Equipos
            if (equipoSeleccionado.Nombre === " [TODOS LOS EQUIPOS] ") {
              filtrosCromos = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=20&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
            }
            else {
              filtrosCromos = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=20&filter[where][EquipoID]=${equipoSeleccionado.id}&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
            }
          }

          this.peticionesAPI.DameEventosFiltrados(filtrosCromos).subscribe((eventos) => {
            //console.log(eventos);
            eventos.forEach((evento) => {
              eventosFiltrados.push(new Evento(evento.TipoEvento, new Date(evento.FechayHora), evento.ProfesorID, evento.AlumnoID, evento.EquipoID, evento.JuegoID, evento.NombreJuego, evento.TipoJuego, evento.PuntoID, evento.NumeroPuntos, evento.NivelID, evento.NumeroCromos, evento.AlumnoReceptorCromoID, evento.EquipoReceptorCromoID, evento.Privilegio));
            });

            for (let contDias: number = 0; contDias < numDias; contDias++) {
              let cromosDia: number = 0;

              eventosFiltrados.forEach((evento) => {
                if ((evento.FechayHora.getDate() === fechaBusqueda.getDate()) && (evento.FechayHora.getMonth() === fechaBusqueda.getMonth()) && (evento.FechayHora.getFullYear() === fechaBusqueda.getFullYear())) { //Es el día a buscar
                  cromosDia = cromosDia + evento.NumeroCromos;
                }
              });
              
              cromos[contDias] = cromosDia;
              dias[contDias] = `${fechaBusqueda.toLocaleDateString()}`;
              fechaBusqueda.setDate(diaInicial.getDate() + 1);
            }

            histograma = {
              color: ['#3398DB'],
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              grid: {
                left: '5%',
                right: '5%',
                bottom: '10%',
                containLabel: true
              },
              xAxis: [
                {
                  type: 'category',
                  data: dias,
                  axisTick: {
                    alignWithLabel: true
                  }
                }
              ],
              yAxis: [{
                type: 'value',
              }],
              series: [{
                name: "Nº de Cromos obtenidos",
                type: 'bar',
                barWidth: '50%',
                data: cromos
              }]
            };
            obs.next(histograma);
          }, (err) => {
            console.log(err);
            Swal.fire({
              title: "Error al obtener los Eventos filtrados para procesar los Datos del Histograma",
              text: err.message,
              icon: "error",
              showConfirmButton: false,
              timer: 3000
            });
            obs.next(histograma);
          }); 
          break;

        case 21: //Número de Cromos regalados por un Alumno/Equipo a un Alumno/Equipo
          let cromosRegalados: number[] = []; //Valores Y de las barras

          let filtrosCromosRegalados: string = " ";
          if (juegoSeleccionado.Modo == 'Individual') { //Individual
            if ((alumnoSeleccionado.Username === "todos") && (alumnoReceptorCromoSeleccionado.Username === "todos")) {
              filtrosCromosRegalados = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=21&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
            }
            else if ((alumnoSeleccionado.Username != "todos") && (alumnoReceptorCromoSeleccionado.Username === "todos")) {
              filtrosCromosRegalados = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=21&filter[where][AlumnoID]=${alumnoSeleccionado.id}&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
            }
            else if ((alumnoSeleccionado.Username === "todos") && (alumnoReceptorCromoSeleccionado.Username != "todos")) {
              filtrosCromosRegalados = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=21&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}&filter[where][AlumnoReceptorCromoID]=${alumnoReceptorCromoSeleccionado.id}`;
            }
            else {
              filtrosCromosRegalados = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=21&filter[where][AlumnoID]=${alumnoSeleccionado.id}&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}&filter[where][AlumnoReceptorCromoID]=${alumnoReceptorCromoSeleccionado.id}`;
            }
          }
          else { //En Equipos
            if ((equipoSeleccionado.Nombre === " [TODOS LOS EQUIPOS] ") && (equipoReceptorCromoSeleccionado.Nombre === " [TODOS LOS EQUIPOS] ")) {
              filtrosCromosRegalados = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=21&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
            }
            else if ((equipoSeleccionado.Nombre != " [TODOS LOS EQUIPOS] ") && (equipoReceptorCromoSeleccionado.Nombre === " [TODOS LOS EQUIPOS] ")) {
              filtrosCromosRegalados = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=21&filter[where][EquipoID]=${equipoSeleccionado.id}&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
            }
            else if ((equipoSeleccionado.Nombre === " [TODOS LOS EQUIPOS] ") && (equipoReceptorCromoSeleccionado.Nombre != " [TODOS LOS EQUIPOS] ")) {
              filtrosCromosRegalados = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=21&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}&filter[where][EquipoReceptorCromoID]=${equipoReceptorCromoSeleccionado.id}`;
            }
            else {
              filtrosCromosRegalados = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=21&filter[where][EquipoID]=${equipoSeleccionado.id}&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}&filter[where][EquipoReceptorCromoID]=${equipoReceptorCromoSeleccionado.id}`;
            }
          }

          this.peticionesAPI.DameEventosFiltrados(filtrosCromosRegalados).subscribe((eventos) => {
            //console.log(eventos);
            eventos.forEach((evento) => {
              eventosFiltrados.push(new Evento(evento.TipoEvento, new Date(evento.FechayHora), evento.ProfesorID, evento.AlumnoID, evento.EquipoID, evento.JuegoID, evento.NombreJuego, evento.TipoJuego, evento.PuntoID, evento.NumeroPuntos, evento.NivelID, evento.NumeroCromos, evento.AlumnoReceptorCromoID, evento.EquipoReceptorCromoID, evento.Privilegio));
            });

            for (let contDias: number = 0; contDias < numDias; contDias++) {
              let cromosRegaladosDia: number = 0;
          
              eventosFiltrados.forEach((evento) => {
                if ((evento.FechayHora.getDate() === fechaBusqueda.getDate()) && (evento.FechayHora.getMonth() === fechaBusqueda.getMonth()) && (evento.FechayHora.getFullYear() === fechaBusqueda.getFullYear())) { //Es el día a buscar
                  cromosRegaladosDia = cromosRegaladosDia + 1;
                }
              });
              
              cromosRegalados[contDias] = cromosRegaladosDia;
              dias[contDias] = `${fechaBusqueda.toLocaleDateString()}`;
              fechaBusqueda.setDate(diaInicial.getDate() + 1);
            }

            histograma = {
              color: ['#3398DB'],
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              grid: {
                left: '5%',
                right: '5%',
                bottom: '10%',
                containLabel: true
              },
              xAxis: [
                {
                  type: 'category',
                  data: dias,
                  axisTick: {
                    alignWithLabel: true
                  }
                }
              ],
              yAxis: [{
                type: 'value',
              }],
              series: [{
                name: "Nº de Cromos regalados",
                type: 'bar',
                barWidth: '50%',
                data: cromosRegalados
              }]
            };
            obs.next(histograma);
          }, (err) => {
            console.log(err);
            Swal.fire({
              title: "Error al obtener los Eventos filtrados para procesar los Datos del Histograma",
              text: err.message,
              icon: "error",
              showConfirmButton: false,
              timer: 3000
            });
            obs.next(histograma);
          });
          break;

        case 30: //Número de modificaciones de Avatar de un Alumno (Juego de Avatar)
          let modificaciones: number[] = []; //Valores Y de las barras

          let filtrosModificaciones: string = " ";
          if (alumnoSeleccionado.Username === "todos") {
            filtrosModificaciones = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=32&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
          }
          else {
            filtrosModificaciones = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=32&filter[where][AlumnoID]=${alumnoSeleccionado.id}&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
          }
        
          this.peticionesAPI.DameEventosFiltrados(filtrosModificaciones).subscribe((eventos) => {
            //console.log(eventos);
            eventos.forEach((evento) => {
              eventosFiltrados.push(new Evento(evento.TipoEvento, new Date(evento.FechayHora), evento.ProfesorID, evento.AlumnoID, evento.EquipoID, evento.JuegoID, evento.NombreJuego, evento.TipoJuego, evento.PuntoID, evento.NumeroPuntos, evento.NivelID, evento.NumeroCromos, evento.AlumnoReceptorCromoID, evento.EquipoReceptorCromoID, evento.Privilegio));
            });
        
            for (let contDias: number = 0; contDias < numDias; contDias++) {
              let modificacionesDia: number = 0;
            
              eventosFiltrados.forEach((evento) => {
                if ((evento.FechayHora.getDate() === fechaBusqueda.getDate()) && (evento.FechayHora.getMonth() === fechaBusqueda.getMonth()) && (evento.FechayHora.getFullYear() === fechaBusqueda.getFullYear())) { //Es el día a buscar
                  modificacionesDia = modificacionesDia + 1;
                }
              });
        
              modificaciones[contDias] = modificacionesDia;
              dias[contDias] = `${fechaBusqueda.toLocaleDateString()}`;
              fechaBusqueda.setDate(diaInicial.getDate() + 1);
            }
        
            histograma = {
              color: ['#3398DB'],
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              grid: {
                left: '5%',
                right: '5%',
                bottom: '10%',
                containLabel: true
              },
              xAxis: [
                {
                  type: 'category',
                  data: dias,
                  axisTick: {
                    alignWithLabel: true
                  }
                }
              ],
              yAxis: [{
                type: 'value'
              }],
              series: [{
                name: "Nº de modificaciones",
                type: 'bar',
                barWidth: '50%',
                data: modificaciones
              }]
            };
            obs.next(histograma);
          }, (err) => {
            console.log(err);
            Swal.fire({
              title: "Error al obtener los Eventos filtrados para procesar los Datos del Histograma",
              text: err.message,
              icon: "error",
              showConfirmButton: false,
              timer: 3000
            });
            obs.next(histograma);
          });
          break;

        default: 
          histograma = {};
          obs.next(histograma);
          break;
      }
    });
    return histogramaObservable
  }


  //Devuelve los valores necesarios para mostrar la Función Contínua seleccionada
  /* public CalculaFuncion(tipoFuncion: number, diaInicial: Date, diaFinal: Date, juegoSeleccionado: any, profesor: Profesor, alumnoSeleccionado?: Alumno, equipoSeleccionado?: Equipo): Observable<any> {
    const funcionObservable: Observable<any> = new Observable((obs) => {
      obs.next({});
    });
    return funcionObservable;
  } */

  //Devuelve los valores necesarios para mostrar el Diagrama seleccionado
  public CalculaDiagrama(tipoDiagrama: number, diaInicial: Date, diaFinal: Date, juegoSeleccionado: any, profesor: Profesor, alumnoSeleccionado?: Alumno, equipoSeleccionado?: Equipo, nivelSeleccionado?: Nivel, privilegioSeleccionado?: number): Observable<any> {
    const diagramaObservable: Observable<any> = new Observable((obs) => {
      let diagrama: any = {};

      //Para que se busque hasta el último día, incluido:
      diaFinal.setHours(23);
      diaFinal.setMinutes(59);
      diaFinal.setSeconds(59);
      diaFinal.setMilliseconds(999);
      let numDias: number = Math.ceil((diaFinal.getTime() - diaInicial.getTime()) / (1000 * 60 * 60 * 24)); //Número de días de diferencia entre el inicial y final; El ceil hace que ambos estén incluídos también
      //console.log(`Número de barras (días): ${numDias}`);

      let fechaBusqueda: Date = diaInicial; //Dia en el que se van a buscar los eventos
      let dias: string[] = []; //Valores X del Diagrama

      let datosPuntos: any[] = []; //Indica dónde se van a representar los puntos del Diagrama

      let eventosFiltrados: Evento[] = []; //Necesaria para poder parsear las fechas

      switch (Number(tipoDiagrama)) {
        case 10: //Diagrama 'Punch Card' de los Ascensos de Nivel de un Alumno/Equipo (Juego de Puntos)
          let niveles: string[] = []; //Valores Y del Diagrama

          let filtrosAscenso: string = " ";
          if (nivelSeleccionado.Nombre === " [TODOS LOS NIVELES] ") {
            if (juegoSeleccionado.Modo == 'Individual') { //Individual
              filtrosAscenso = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=11&filter[where][AlumnoID]=${alumnoSeleccionado.id}&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
            }
            else { //En Equipos
              filtrosAscenso = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=11&filter[where][EquipoID]=${equipoSeleccionado.id}&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
            }
          }
          else {
            if (juegoSeleccionado.Modo == 'Individual') { //Individual
              filtrosAscenso = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=11&filter[where][AlumnoID]=${alumnoSeleccionado.id}&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}&filter[where][NivelID]=${nivelSeleccionado.id}`;
            }
            else { //En Equipos
              filtrosAscenso = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=11&filter[where][EquipoID]=${equipoSeleccionado.id}&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}&filter[where][NivelID]=${nivelSeleccionado.id}`;
            }
          }

          this.peticionesAPI.DameEventosFiltrados(filtrosAscenso).subscribe((eventos) => {
            //console.log(eventos);
            eventos.forEach((evento) => {
              eventosFiltrados.push(new Evento(evento.TipoEvento, new Date(evento.FechayHora), evento.ProfesorID, evento.AlumnoID, evento.EquipoID, evento.JuegoID, evento.NombreJuego, evento.TipoJuego, evento.PuntoID, evento.NumeroPuntos, evento.NivelID, evento.NumeroCromos, evento.AlumnoReceptorCromoID, evento.EquipoReceptorCromoID, evento.Privilegio));
            });

            this.peticionesAPI.DameNiveles().subscribe((todosNiveles) => {
              //console.log(todosNiveles);

              for (let contDias: number = 0; contDias < numDias; contDias++) {
                eventosFiltrados.forEach((evento) => {
                  if ((evento.FechayHora.getDate() === fechaBusqueda.getDate()) && (evento.FechayHora.getMonth() === fechaBusqueda.getMonth()) && (evento.FechayHora.getFullYear() === fechaBusqueda.getFullYear())) { //Es el día a buscar
                    let nivel: Nivel = todosNiveles.filter((nivel) => (nivel.id == evento.NivelID && nivel.juegoDePuntosId == evento.JuegoID))[0];
                    //console.log(nivel);

                    if(!niveles.includes(nivel.Nombre)){
                      niveles.push(nivel.Nombre);
                    }
                    datosPuntos.push([contDias, niveles.indexOf(nivel.Nombre)]);
                  }
                });
                dias[contDias] = `${fechaBusqueda.toLocaleDateString()}`;
                fechaBusqueda.setDate(diaInicial.getDate() + 1);
              }

              datosPuntos = datosPuntos.map(function(item) {
                return [item[0], item[1]];
              });

              diagrama = {
                color: ['#3398DB'],
                legend: {
                  data: ['Nivel obtenido']
                },
                tooltip: {
                  position: 'top',
                  formatter: function (params) {
                    return 'Nivel obtenido: ' + niveles[params.value[1]] + ' | Día: ' + dias[params.value[0]];
                  }
                },
                grid: {
                  left: 20,
                  right: 30,
                  bottom: 10,
                  containLabel: true
                },
                xAxis: [
                  {
                    type: 'category',
                    data: dias,
                    boundaryGap: false,
                    splitLine: {
                        show: true
                    },
                    axisLine: {
                        show: false
                    }
                  }
                ],
                yAxis: [{
                  type: 'category',
                  data: niveles,
                  axisLine: {
                    show: false
                }
                }],
                series: [{
                  name: "Nivel obtenido",
                  type: 'scatter',
                  data: datosPuntos
                }]
              };
              obs.next(diagrama);
            }, (err) => {
              console.log(err);
              Swal.fire({
              title: "Error al obtener los Niveles para procesar los Datos del Diagrama",
              text: err.message,
              icon: "error",
              showConfirmButton: false,
              timer: 3000
            });
              obs.next(diagrama);
            });
          }, (err) => {
            console.log(err);
            Swal.fire({
              title: "Error al obtener los Eventos filtrados para procesar los Datos del Diagrama",
              text: err.message,
              icon: "error",
              showConfirmButton: false,
              timer: 3000
            });
            obs.next(diagrama);
          });
          break;

        case 20: //Diagrama ‘Punch Card’ de las Finalizaciones de Colecciones de Cromos de Alumnos/Equipos (Juego de Colección)
          let alumnosFinalizacion: string[] = []; //Valores Y del Diagrama
          let equiposFinalizacion: string[] = []; //Valores Y del Diagrama

          let filtrosFinalizacion: string = " ";
          if (juegoSeleccionado.Modo == 'Individual') { //Individual
            if (alumnoSeleccionado.Username === "todos") { 
              filtrosFinalizacion = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=22&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
            }
            else { 
              filtrosFinalizacion = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=22&filter[where][AlumnoID]=${alumnoSeleccionado.id}&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
            }
          }
          else { //En Equipos
            if (equipoSeleccionado.Nombre === " [TODOS LOS EQUIPOS] ") {
              filtrosFinalizacion = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=22&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}&filter[where][NivelID]=${nivelSeleccionado.id}`;
            }
            else {
              filtrosFinalizacion = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=22&filter[where][EquipoID]=${equipoSeleccionado.id}&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}&filter[where][NivelID]=${nivelSeleccionado.id}`;
            }
          }

          this.peticionesAPI.DameEventosFiltrados(filtrosFinalizacion).subscribe((eventos) => {
            //console.log(eventos);
            eventos.forEach((evento) => {
              eventosFiltrados.push(new Evento(evento.TipoEvento, new Date(evento.FechayHora), evento.ProfesorID, evento.AlumnoID, evento.EquipoID, evento.JuegoID, evento.NombreJuego, evento.TipoJuego, evento.PuntoID, evento.NumeroPuntos, evento.NivelID, evento.NumeroCromos, evento.AlumnoReceptorCromoID, evento.EquipoReceptorCromoID, evento.Privilegio));
            });

            this.peticionesAPI.DameAlumnos().subscribe((todosAlumnos) => {
              //console.log(todosAlumnos);

              this.peticionesAPI.DameEquipos().subscribe((todosEquipos) => {
                //console.log(todosEquipos);

                for (let contDias: number = 0; contDias < numDias; contDias++) {
                  eventosFiltrados.forEach((evento) => {
                    if ((evento.FechayHora.getDate() === fechaBusqueda.getDate()) && (evento.FechayHora.getMonth() === fechaBusqueda.getMonth()) && (evento.FechayHora.getFullYear() === fechaBusqueda.getFullYear())) { //Es el día a buscar
                      if(juegoSeleccionado.Modo == 'Individual') { //Individual
                        let alumno: Alumno = todosAlumnos.filter((alumno) => (alumno.id == evento.AlumnoID))[0];
                        //console.log(alumno);

                        let nombreCompletoAlumno: string = `${alumno.Nombre} ${alumno.PrimerApellido} ${alumno.SegundoApellido}`;
                        if(!alumnosFinalizacion.includes(nombreCompletoAlumno)){
                          alumnosFinalizacion.push(nombreCompletoAlumno);
                        }
                        datosPuntos.push([contDias, alumnosFinalizacion.indexOf(nombreCompletoAlumno)]);
                      }
                      else { //En Equipos
                        let equipo: Equipo = todosEquipos.filter((equipo) => (equipo.id == evento.EquipoID))[0];
                        //console.log(equipo);

                        if(!equiposFinalizacion.includes(equipo.Nombre)){
                          equiposFinalizacion.push(equipo.Nombre);
                        }
                        datosPuntos.push([contDias, alumnosFinalizacion.indexOf(equipo.Nombre)]);
                      }
                    }
                  });
                  dias[contDias] = `${fechaBusqueda.toLocaleDateString()}`;
                  fechaBusqueda.setDate(diaInicial.getDate() + 1);
                }
  
                datosPuntos = datosPuntos.map(function(item) {
                  return [item[0], item[1]];
                });

                if(juegoSeleccionado.Modo == 'Individual') { //Individual
                  diagrama = {
                    color: ['#3398DB'],
                    legend: {
                      data: ['Finalización de la Colección']
                    },
                    tooltip: {
                      position: 'top',
                      formatter: function (params) {
                        return 'El Alumno ' + alumnosFinalizacion[params.value[1]] + ' ha completado la Colección | Día: ' + dias[params.value[0]];
                      }
                    },
                    grid: {
                      left: 20,
                      right: 30,
                      bottom: 10,
                      containLabel: true
                    },
                    xAxis: [
                      {
                        type: 'category',
                        data: dias,
                        boundaryGap: false,
                        splitLine: {
                            show: true
                        },
                        axisLine: {
                            show: false
                        }
                      }
                    ],
                    yAxis: [{
                      type: 'category',
                      data: alumnosFinalizacion,
                      axisLine: {
                        show: false
                    }
                    }],
                    series: [{
                      name: "Finalización de la Colección",
                      type: 'scatter',
                      data: datosPuntos
                    }]
                  };
                }
                else { //En Equipos
                  diagrama = {
                    color: ['#3398DB'],
                    legend: {
                      data: ['Finalización de la Colección']
                    },
                    tooltip: {
                      position: 'top',
                      formatter: function (params) {
                        return 'El Equipo ' + equiposFinalizacion[params.value[1]] + ' ha completado la Colección | Día: ' + dias[params.value[0]];
                      }
                    },
                    grid: {
                      left: 20,
                      right: 30,
                      bottom: 10,
                      containLabel: true
                    },
                    xAxis: [
                      {
                        type: 'category',
                        data: dias,
                        boundaryGap: false,
                        splitLine: {
                            show: true
                        },
                        axisLine: {
                            show: false
                        }
                      }
                    ],
                    yAxis: [{
                      type: 'category',
                      data: equiposFinalizacion,
                      axisLine: {
                        show: false
                    }
                    }],
                    series: [{
                      name: "Finalización de la Colección",
                      type: 'scatter',
                      data: datosPuntos
                    }]
                  };
                }
                obs.next(diagrama);
              }, (err) => {
                console.log(err);
                Swal.fire({
                  title: "Error al obtener los Equipos para procesar los Datos del Diagrama",
                  text: err.message,
                  icon: "error",
                  showConfirmButton: false,
                  timer: 3000
                });
                obs.next(diagrama);
              });
            }, (err) => {
              console.log(err);
              Swal.fire({
                title: "Error al obtener los Alumnos para procesar los Datos del Diagrama",
                text: err.message,
                icon: "error",
                showConfirmButton: false,
                timer: 3000
              });
              obs.next(diagrama);
            });
          }, (err) => {
            console.log(err);
            Swal.fire({
              title: "Error al obtener los Eventos filtrados para procesar los Datos del Diagrama",
              text: err.message,
              icon: "error",
              showConfirmButton: false,
              timer: 3000
            });
            obs.next(diagrama);
          });
          break;

        case 30: //Diagrama 'Punch Card' de las Asignaciones/Eliminaciones de Privilegios de un Alumno (Juego de Avatar)
          let datosPuntosAsignacion: any[] = []; //Indica dónde se van a representar los puntos de Asignación en el Diagrama (puntos verdes)
          let datosPuntosEliminacion: any[] = []; //Indica dónde se van a representar los puntos de Eliminación en el Diagrama (puntos rojos)
          let privilegios: string[] = []; //Valores Y del Diagrama

          let filtrosAsignacion: string = " ";
          let filtrosEliminacion: string = " ";
          if (privilegioSeleccionado == -1) { //Todos los Privilegios
            filtrosAsignacion = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=30&filter[where][AlumnoID]=${alumnoSeleccionado.id}&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
            filtrosEliminacion = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=31&filter[where][AlumnoID]=${alumnoSeleccionado.id}&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`;
          }
          else { //Un Privilegio en concreto
            filtrosAsignacion = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=30&filter[where][AlumnoID]=${alumnoSeleccionado.id}&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}&filter[where][Privilegio]=${privilegioSeleccionado}`;
            filtrosEliminacion = `?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=31&filter[where][AlumnoID]=${alumnoSeleccionado.id}&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}&filter[where][Privilegio]=${privilegioSeleccionado}`;
          }

          this.peticionesAPI.DameEventosFiltrados(filtrosAsignacion).subscribe((eventosAsignacion) => {
            //console.log(eventosAsignacion);
            eventosAsignacion.forEach((evento) => {
              eventosFiltrados.push(new Evento(evento.TipoEvento, new Date(evento.FechayHora), evento.ProfesorID, evento.AlumnoID, evento.EquipoID, evento.JuegoID, evento.NombreJuego, evento.TipoJuego, evento.PuntoID, evento.NumeroPuntos, evento.NivelID, evento.NumeroCromos, evento.AlumnoReceptorCromoID, evento.EquipoReceptorCromoID, evento.Privilegio));
            });

            this.peticionesAPI.DameEventosFiltrados(filtrosEliminacion).subscribe((eventosEliminacion) => {
              //console.log(eventosEliminacion);
              eventosEliminacion.forEach((evento) => {
                eventosFiltrados.push(new Evento(evento.TipoEvento, new Date(evento.FechayHora), evento.ProfesorID, evento.AlumnoID, evento.EquipoID, evento.JuegoID, evento.NombreJuego, evento.TipoJuego, evento.PuntoID, evento.NumeroPuntos, evento.NivelID, evento.NumeroCromos, evento.AlumnoReceptorCromoID, evento.EquipoReceptorCromoID, evento.Privilegio));
              });

              for (let contDias: number = 0; contDias < numDias; contDias++) {
                eventosFiltrados.forEach((evento) => {
                  if ((evento.FechayHora.getDate() === fechaBusqueda.getDate()) && (evento.FechayHora.getMonth() === fechaBusqueda.getMonth()) && (evento.FechayHora.getFullYear() === fechaBusqueda.getFullYear())) { //Es el día a buscar
                    let nombrePrivilegio: string = " ";
                    if (evento.Privilegio == 5) { 
                      nombrePrivilegio = "Privilegio Nota de Voz"; 
                    }
                    else if (evento.Privilegio == 6) {
                      nombrePrivilegio = "Privilegio Espiar";
                    }
                    else {
                      nombrePrivilegio = `Privilegio ${evento.Privilegio}`;
                    }
                    
                    if(!privilegios.includes(nombrePrivilegio)){
                      privilegios.push(nombrePrivilegio);
                    }
                    if (evento.TipoEvento == 30) { //Asignación
                      datosPuntosAsignacion.push({
                        value: [contDias, privilegios.indexOf(nombrePrivilegio)],
                        itemStyle: { color: 'green' }
                      });
                    }
                    else { //Eliminación
                      datosPuntosEliminacion.push({
                        value: [contDias, privilegios.indexOf(nombrePrivilegio)],
                        itemStyle: { color: 'red' }
                      });
                    }
                    //Para representar las etiquetas de ambos tipos de punto (Asignación/Eliminación)
                    datosPuntos.push([contDias, privilegios.indexOf(nombrePrivilegio)]);
                  }
                });
                dias[contDias] = `${fechaBusqueda.toLocaleDateString()}`;
                fechaBusqueda.setDate(diaInicial.getDate() + 1);
              }

              //Para representar las etiquetas de ambos tipos de punto (Asignación/Eliminación)
              datosPuntos = datosPuntos.map(function(item) {
                return [item[0], item[1]];
              });

              diagrama = {
                color: ['green', 'red'],
                legend: {
                  data: ['Privilegio asignado', 'Privilegio eliminado']
                },
                tooltip: {
                  trigger: 'item'
                },
                grid: {
                  left: 20,
                  right: 30,
                  bottom: 10,
                  containLabel: true
                },
                xAxis: [
                  {
                    type: 'category',
                    data: dias,
                    boundaryGap: false,
                    splitLine: {
                        show: true
                    },
                    axisLine: {
                        show: false
                    }
                  }
                ],
                yAxis: [{
                  type: 'category',
                  data: privilegios,
                  axisLine: {
                    show: false
                }
                }],
                series: [{
                  name: "Privilegio asignado",
                  type: 'scatter',
                  data: datosPuntosAsignacion,
                  tooltip: {
                    position: 'top',
                    formatter: function (params) {
                      return 'Privilegio asignado: ' + privilegios[params.value[1]] + ' | Día: ' + dias[params.value[0]];
                    }
                  }
                },{
                  name: "Privilegio eliminado",
                  type: 'scatter',
                  data: datosPuntosEliminacion,
                  tooltip: {
                    position: 'top',
                    formatter: function (params) {
                      return 'Privilegio eliminado: ' + privilegios[params.value[1]] + ' | Día: ' + dias[params.value[0]];
                    }
                  }
                }]
              };
              obs.next(diagrama);
            }, (err) => {
              console.log(err);
              Swal.fire({
                title: "Error al obtener los Eventos filtrados para procesar los Datos del Diagrama",
                text: err.message,
                icon: "error",
                showConfirmButton: false,
                timer: 3000
              });
              obs.next(diagrama);
            });
          }, (err) => {
            console.log(err);
            Swal.fire({
              title: "Error al obtener los Eventos filtrados para procesar los Datos del Diagrama",
              text: err.message,
              icon: "error",
              showConfirmButton: false,
              timer: 3000
            });
            obs.next(diagrama);
          });
          break;
        
        default:
          diagrama = {};
          obs.next(diagrama);
          break;
      }
    });
    return diagramaObservable;
  }

  //Devuelve los valores necesarios para mostrar el Grafo seleccionado
  public CalculaGrafo(tipoGrafo: number, juegoSeleccionado: any, profesor: Profesor): Observable<any> {
    const grafoObservable: Observable<any> = new Observable((obs) => {
      let grafo: any = {};

      let nodes: any[] = []; //Nodos del grafo
      /* EJEMPLO
      {
        "id": "0",
        "name": "Myriel",
        "symbolSize": 19.12381,
        "x": -266.82776,
        "y": 299.6904,
        "value": 28.685715,
        "category": 0
      } */
      let links: any[] = []; //Enlaces del grafo
      /* EJEMPLO
      {
        "source": "1",
        "target": "0"
      } */
      let categories: any[] = [] //Categorías del grafo
      /* EJEMPLO
      {
        "name": "类目0"
      } */

      let eventosFiltrados: Evento[] = []; //Necesaria para poder parsear las fechas

      switch (Number(tipoGrafo)) {
        case 20: //Red de regalos de Cromos ("red de relaciones") entre Alumnos/Equipos (Juego de Colección)
          categories = [{"name": "Relación de regalo de Cromos"}];

          this.peticionesAPI.DameAlumnosJuegoDeColeccion(juegoSeleccionado.id).subscribe((alumnos) => {
            //console.log(alumnos);
            this.peticionesAPI.DameEquiposJuegoDeColeccion(juegoSeleccionado.id).subscribe((equipos) => {
              //console.log(equipos);
              this.peticionesAPI.DameEventosFiltrados(`?filter[where][ProfesorID]=${profesor.id}&filter[where][TipoEvento]=21&filter[where][TipoJuego]=${juegoSeleccionado.Tipo}&filter[where][JuegoID]=${juegoSeleccionado.id}`).subscribe((eventos) => {
                //console.log(eventos);
                eventos.forEach((evento) => {
                  eventosFiltrados.push(new Evento(evento.TipoEvento, new Date(evento.FechayHora), evento.ProfesorID, evento.AlumnoID, evento.EquipoID, evento.JuegoID, evento.NombreJuego, evento.TipoJuego, evento.PuntoID, evento.NumeroPuntos, evento.NivelID, evento.NumeroCromos, evento.AlumnoReceptorCromoID, evento.EquipoReceptorCromoID, evento.Privilegio));
                });

                let valuesAlumnos: number[] = []; //Hacemos que por cada relación entre dos Alumnos, se lleve 5 puntos el que da el Cromo y 2.5 el que lo recibe //El índice de este vector es el ID del Alumno
                let valuesEquipos: number[] = []; //Hacemos que por cada relación entre dos Equipos, se lleve 5 puntos el que da el Cromo y 2.5 el que lo recibe //El índice de este vector es el ID del Equipo
                for (let link: number = 0; link < eventosFiltrados.length; link++) {
                  if (juegoSeleccionado.Modo == 'Individual') {
                    links.push({
                      "source": "\"" + eventosFiltrados[link].AlumnoID + "\"",
                      "target": "\"" + eventosFiltrados[link].AlumnoReceptorCromoID + "\""
                    });
                    if (valuesAlumnos[eventosFiltrados[link].AlumnoID] == null) { valuesAlumnos[eventosFiltrados[link].AlumnoID] = 0; }
                    if (valuesAlumnos[eventosFiltrados[link].AlumnoReceptorCromoID] == null) { valuesAlumnos[eventosFiltrados[link].AlumnoReceptorCromoID] = 0; }
                    valuesAlumnos[eventosFiltrados[link].AlumnoID] = valuesAlumnos[eventosFiltrados[link].AlumnoID] + 5;
                    valuesAlumnos[eventosFiltrados[link].AlumnoReceptorCromoID] = valuesAlumnos[eventosFiltrados[link].AlumnoReceptorCromoID] + 2.5;
                  }
                  else {
                    links.push({
                      "source": "\"" + eventosFiltrados[link].EquipoID + "\"",
                      "target": "\"" + eventosFiltrados[link].EquipoReceptorCromoID + "\""
                    });
                    if (valuesEquipos[eventosFiltrados[link].EquipoID] == null) { valuesEquipos[eventosFiltrados[link].EquipoID] = 0; }
                    if (valuesEquipos[eventosFiltrados[link].EquipoReceptorCromoID] == null) { valuesEquipos[eventosFiltrados[link].EquipoReceptorCromoID] = 0; }
                    valuesEquipos[eventosFiltrados[link].EquipoID] = valuesEquipos[eventosFiltrados[link].EquipoID] + 5;
                    valuesEquipos[eventosFiltrados[link].EquipoReceptorCromoID] = valuesEquipos[eventosFiltrados[link].EquipoReceptorCromoID] + 2.5;
                  }
                }
                
                if (juegoSeleccionado.Modo == 'Individual') { //Individual
                  for (let node: number = 0; node < alumnos.length; node++) {
                    let posX: number = Math.floor(Math.random() * (500 - 10 + 1) + 10);
                    let posY: number = Math.floor(Math.random() * (500 - 10 + 1) + 10);
                    nodes.push({
                      "id": "\"" + alumnos[node].id + "\"",
                      "name": `${alumnos[node].Nombre} ${alumnos[node].PrimerApellido} ${alumnos[node].SegundoApellido}`,
                      "value": valuesAlumnos[alumnos[node].id],
                      "symbolSize": Number(valuesAlumnos[alumnos[node].id] * (2/3)),
                      "category": 0,
                      "x": posX,
                      "y": posY
                    });
                  }
                }
                else { //En Equipos
                  for(let node: number = 0; node < equipos.length; node++) {
                    let posX: number = Math.floor(Math.random() * (500 - 10 + 1) + 10);
                    let posY: number = Math.floor(Math.random() * (500 - 10 + 1) + 10);
                    nodes.push({
                      "id": "\"" + equipos[node].id + "\"",
                      "name": `${equipos[node].Nombre}`,
                      "value": valuesEquipos[alumnos[node].id],
                      "symbolSize": Number(valuesEquipos[alumnos[node].id] * (2/3)),
                      "category": 0,
                      "x": posX,
                      "y": posY
                    });
                  }
                }

                nodes.forEach(function (node) {
                  node.label = {
                    show: node.symbolSize > 0
                  };
                });
                grafo = {
                  title: {
                    text: 'Red de regalo de Cromos',
                    subtext: 'Red de "relaciones" entre Alumnos/Equipos',
                    top: 'bottom',
                    left: 'right'
                  },
                  tooltip: {},
                  legend: [{
                    data: categories.map(function (a) {
                        return a.name;
                    })
                  }],
                  animationDuration: 1500,
                  animationEasingUpdate: 'quinticInOut',
                  series: [
                    {
                      name: 'Puntuación de regalos [2,5 x Cromo recibido | 5 x Cromo regalado]',
                      type: 'graph',
                      layout: 'circular',
                      data: nodes,
                      links: links,
                      categories: categories,
                      roam: true,
                      label: {
                        position: 'right',
                        formatter: '{b}',
                        color: 'black'
                      },
                      lineStyle: {
                        color: 'source',
                        curveness: 0.3
                      },
                      emphasis: {
                        focus: 'adjacency',
                        lineStyle: {
                          width: 10
                        }
                      }
                    }
                  ]
                };
                obs.next(grafo);
              }, (err) => {
                console.log(err);
                Swal.fire({
                  title: "Error al obtener los Eventos filtrados para procesar los Datos del Grafo",
                  text: err.message,
                  icon: "error",
                  showConfirmButton: false,
                  timer: 3000
                });
                obs.next(grafo);
              });
            }, (err) => {
              console.log(err);
              Swal.fire({
                title: "Error al obtener los Equipos para procesar los Datos del Grafo",
                text: err.message,
                icon: "error",
                showConfirmButton: false,
                timer: 3000
              });
              obs.next(grafo);
            });
          }, (err) => {
            console.log(err);
            Swal.fire({
              title: "Error al obtener los Alumnos para procesar los Datos del Grafo",
              text: err.message,
              icon: "error",
              showConfirmButton: false,
              timer: 3000
            });
            obs.next(grafo);
          });
          break;

        default:
          break;
      }
    });
    return grafoObservable;
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------//

}

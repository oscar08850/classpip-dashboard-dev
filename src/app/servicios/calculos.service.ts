import { Injectable } from '@angular/core';
import { SesionService, PeticionesAPIService} from './index';
// tslint:disable-next-line:max-line-length
import { Grupo, Equipo, Juego, Alumno, Nivel, TablaAlumnoJuegoDePuntos, TablaHistorialPuntosAlumno, AlumnoJuegoDePuntos, TablaEquipoJuegoDePuntos, HistorialPuntosAlumno,
  HistorialPuntosEquipo, EquipoJuegoDePuntos, TablaHistorialPuntosEquipo, AlumnoJuegoDeColeccion, Album,
  EquipoJuegoDeColeccion, AlbumEquipo, Cromo } from '../clases/index';
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

  constructor(
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService
  ) {
  }


  // ESTA FUNCIÓN BORRARÁ EL GRUPO DE ID QUE PASEMOS DEL PROFESOR CON ID QUE PASEMOS Y VOLVERÁ A LA PÁGINA DE LISTAR
  // ACTUALIZANDO LA TABLA
  public EliminarGrupo() {

    this.peticionesAPI.BorraGrupo(
              this.sesion.DameProfesor().id,
              this.sesion.DameGrupo().id)
    .subscribe(() => {

      this.EliminarMatriculas();

      // Ahora elimino el grupo de la lista de grupos para que desaparezca de la pantalla al regresar
      let lista = this.sesion.DameListaGrupos();
      lista = lista.filter (g => g.id !== this.sesion.DameGrupo().id);
      this.sesion.TomaListaGrupos (lista);
    });
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

      console.log ('vamos a por los juegos de puntos: ' + grupoID);
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
        this.peticionesAPI.DameJuegoDeColeccionGrupo(grupoID)
        .subscribe(juegosColeccion => {
          console.log('He recibido los juegos de coleccion');

          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < juegosColeccion.length; i++) {
            if (juegosColeccion[i].JuegoActivo === true) {
              juegosActivos.push(juegosColeccion[i]);
            } else {
              juegosInactivos.push(juegosColeccion[i]);
            }
          }
          // Ahora vamos a por los juegos de competición
          console.log ('vamos a por los juegos de competicion: ' + grupoID);
          this.peticionesAPI.DameJuegoDeCompeticionGrupo(grupoID)
          .subscribe(juegosCompeticion => {
            console.log('He recibido los juegos de competición');
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
      console.log ('Recorremos los ' + listaAlumnosOrdenadaPorPuntos.length)
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
  // public DameNivelActualYSiguiente(nivelesDelJuego: any, alumnoJuegoDePuntos: any,  ): any {

  //   let nivel;
  //   let siguienteNivel;
  //   // Primero ordenamos los niveles
  //   // tslint:disable-next-line:only-arrow-functions
  //   nivelesDelJuego = nivelesDelJuego.sort(function(obj1, obj2) {
  //     return obj1.PuntosAlcanzar - obj2.PuntosAlcanzar;
  //   });

  //   nivel = nivelesDelJuego.filter(res => res.id === alumnoJuegoDePuntos.nivelId)[0];
  //   // this.nivel = this.BuscarNivelActual(this.alumnoJuegoDePuntos.nivelId);
  //   console.log(nivel);



  //   // Si el alumno ya ha alcanzado algun nivel, buscamos cual es el siguiente nivel del que ya tiene. Sino el siguiente
  //   // nivel será el primero
  //   if (alumnoJuegoDePuntos.nivelId !== undefined) {

  //     // Si no estoy en el último nivel, busco el siguiente nivel
  //     if (alumnoJuegoDePuntos.nivelId !== nivelesDelJuego[nivelesDelJuego.length - 1].id) {
  //       siguienteNivel = this.DameSiguienteNivel(nivelesDelJuego, alumnoJuegoDePuntos.nivelId);
  //     } else {
  //       siguienteNivel = undefined;
  //     }

  //   } else {
  //     siguienteNivel = nivelesDelJuego[0];
  //   }

  //   const resultado = { n: nivel, sn: siguienteNivel};
  //   return resultado;
  // }


  // public DameNivelActualYSiguienteEquipo(nivelesDelJuego: any, equipoJuegoDePuntos: any,  ): any {

  //   let nivel;
  //   let siguienteNivel;
  //   // tslint:disable-next-line:only-arrow-functions
  //   nivelesDelJuego = nivelesDelJuego.sort(function(obj1, obj2) {
  //     return obj1.PuntosAlcanzar - obj2.PuntosAlcanzar;
  //   });

  //   nivel = nivelesDelJuego.filter(res => res.id === equipoJuegoDePuntos.nivelId)[0];

  //   // Si el alumno ya ha alcanzado algun nivel, buscamos cual es el siguiente nivel del que ya tiene. Sino el siguiente
  //   // nivel será el primero
  //   if (equipoJuegoDePuntos.nivelId !== undefined) {
  //     console.log('tiene un nivel');
  //     // Si no estoy en el último nivel, busco el siguiente nivel
  //     if (equipoJuegoDePuntos.nivelId !== nivelesDelJuego[nivelesDelJuego.length - 1].id) {
  //       siguienteNivel = this.DameSiguienteNivel(nivelesDelJuego, equipoJuegoDePuntos.nivelId);
  //     } else {
  //       siguienteNivel = undefined;
  //     }
  //   } else {
  //     console.log('no tiene un nivel');
  //     siguienteNivel = nivelesDelJuego[0];
  //   }
  //   const resultado = { n: nivel, sn: siguienteNivel};
  //   return resultado;
  // }


  // private DameSiguienteNivell(nivelesDelJuego: any, nivelId: number): Nivel {

  //   console.log('Voy a buscar el siguiente nivel');
  //   // tslint:disable-next-line:no-inferrable-types
  //   let encontrado: boolean = false;
  //   let i = 0;
  //   while ((i < nivelesDelJuego.length) && (encontrado === false)) {

  //     if (nivelesDelJuego[i].id === nivelId) {
  //       encontrado = true;
  //     }
  //     i = i + 1;
  //   }

  //   return nivelesDelJuego[i];
  // }
/*
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
return gruposObservable; */

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
   if (nivelesDelJuego !== undefined) {
     // calculamos el nuevo nivel
     console.log ('calculo nuevo nivel ');
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

  //}

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
      if (nivelesDelJuego !== undefined) {
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


// //TIENE QUE HABER UNA FORMA MAS FACIL DE HACER ESTO
// public AsignarPuntosAlumno2(
//   i: number,
//   listaAlumnosOrdenadaPorPuntos: any,
//   nivelesDelJuego: any,
//   valorPunto: any,
//   rankingJuegoDePuntos: any,
//   puntoSeleccionadoId: any,



// ): any {
//   const listasObservables = new Observable ( obs => {

//     console.log ('Lista ' + listaAlumnosOrdenadaPorPuntos);
//     console.log ('niveles ' + nivelesDelJuego);
//     let nivel: Nivel;
//     let siguienteNivel: Nivel;
//     // Buscar nivel actual
//     nivel = nivelesDelJuego.filter(res => res.id === listaAlumnosOrdenadaPorPuntos[i].nivelId)[0];

//     // Si el alumno ya ha alcanzado algun nivel, buscamos cual es el siguiente nivel del que ya tiene. Sino el siguiente
//     // nivel será el primero
//     if (listaAlumnosOrdenadaPorPuntos[i].nivelId !== undefined) {
//       console.log('Si hay un nivel, buscamos el siguiente nivel');

//       if (nivel.id !== nivelesDelJuego[nivelesDelJuego.length - 1].id) {

//         // Buscar siguiente nivel

//           // tslint:disable-next-line:no-inferrable-types
//           let encontrado: boolean = false;
//           let j = 0;
//           while ((j < nivelesDelJuego.length) && (encontrado === false)) {
//             if (nivelesDelJuego[j].id === listaAlumnosOrdenadaPorPuntos[j].nivelId) {
//               encontrado = true;
//             }
//             j = j + 1;
//           }
//           siguienteNivel = nivelesDelJuego[j];

//       } else {
//         console.log('Ya hemos alcanzado el nivel maximo, no buscamos el siguiente nivel');
//       }

//     } else {
//       console.log('El siguiente nivel es el primer nivel');
//       siguienteNivel = nivelesDelJuego[0];
//     }

//     let nuevosPuntos: number;
//     nuevosPuntos = listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno + valorPunto;

//     // Comprobamos si subimos de nivel o no

//     if (nivel !== undefined ) {
//       if (nivel.id !== nivelesDelJuego[nivelesDelJuego.length - 1].id) {
//         console.log('No estoy en el ultimo nivel, busco el siguiente nivel y miro si subo nivel o no');

//         if (nuevosPuntos >= siguienteNivel.PuntosAlcanzar) {

//           console.log('Voy a subir de nivel');
//           nivel = siguienteNivel;
//         } else {

//           console.log('mantengo el nivel');
//           if (listaAlumnosOrdenadaPorPuntos[i].nivelId !== undefined) {
//             // Buscar nivel actual
//             nivel = nivelesDelJuego.filter(res => res.id === listaAlumnosOrdenadaPorPuntos[i].nivelId)[0];

//           }
//         }
//       } else {
//         console.log('estoy maximo nivel, que es el siguiente');
//         // Buscar nivel actual
//         nivel = nivelesDelJuego.filter(res => res.id === listaAlumnosOrdenadaPorPuntos[i].nivelId)[0];

//         console.log(nivel);
//       }
//     } else {

//       if (nuevosPuntos >= siguienteNivel.PuntosAlcanzar) {

//         console.log('Voy a subir de nivel');
//         nivel = siguienteNivel;
//       } else {

//         console.log('mantengo el nivel');
//         if (listaAlumnosOrdenadaPorPuntos[i].nivelId !== undefined) {
//           // Buscar nivel actual
//           nivel = nivelesDelJuego.filter(res => res.id === listaAlumnosOrdenadaPorPuntos[i].nivelId)[0];

//         }
//       }
//     }

//     // tslint:disable-next-line:curly

//     if (nivel !== undefined) {
//       this.peticionesAPI.PonPuntosJuegoDePuntos(new AlumnoJuegoDePuntos (listaAlumnosOrdenadaPorPuntos[i].alumnoId,
//         listaAlumnosOrdenadaPorPuntos[i].juegoDePuntosId, nuevosPuntos, nivel.id),
//         listaAlumnosOrdenadaPorPuntos[i].id).subscribe( res => {

//             listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno = nuevosPuntos;
//             listaAlumnosOrdenadaPorPuntos[i].nivelId = nivel.id;

//             rankingJuegoDePuntos[i].puntos = nuevosPuntos;
//             rankingJuegoDePuntos[i].nivel = nivel.Nombre;
//             const fechaAsignacionPunto = new Date();
//             const fechaString = fechaAsignacionPunto.toLocaleDateString() + '  ' + fechaAsignacionPunto.toLocaleTimeString();
//         // tslint:disable-next-line:max-line-length
//       // this.POST_HistorialAlumno(this.valorPunto, this.puntoSeleccionadoId, this.listaAlumnosOrdenadaPorPuntos[i].id, this.fechaString);
//         // tslint:disable-next-line:max-line-length
//             this.peticionesAPI.PonHistorialPuntosAlumno(new HistorialPuntosAlumno (valorPunto, puntoSeleccionadoId, listaAlumnosOrdenadaPorPuntos[i].id, fechaString))
//         // tslint:disable-next-line:no-shadowed-variable
//             .subscribe(res => console.log(res));
//         // Ordenar lista por puntos
//         // tslint:disable-next-line:only-arrow-functions
//             listaAlumnosOrdenadaPorPuntos = listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2) {
//               return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
//             });
//         //this.OrdenarListaPorPuntos();
//         // Ordenar ranking por puntos
//         // tslint:disable-next-line:only-arrow-functions
//             rankingJuegoDePuntos = rankingJuegoDePuntos.sort(function(obj1, obj2) {
//                 return obj2.puntos - obj1.puntos;
//             });
//             for (let j = 0; j < rankingJuegoDePuntos.length - 1; j ++) {
//                 rankingJuegoDePuntos[j].posicion = j + 1;
//             }
//             rankingJuegoDePuntos = rankingJuegoDePuntos.filter(result => result.nombre !== '');
//             if (i === 7) {
//               console.log ('111111 ' + rankingJuegoDePuntos[i]);
//             }

//             const resultado = {
//                                   lista: listaAlumnosOrdenadaPorPuntos,
//                                   ranking: rankingJuegoDePuntos
//             };
//             obs.next (resultado);
//         });
//     } else {

//       this.peticionesAPI.PonPuntosJuegoDePuntos(new AlumnoJuegoDePuntos (listaAlumnosOrdenadaPorPuntos[i].alumnoId,
//         listaAlumnosOrdenadaPorPuntos[i].juegoDePuntosId, nuevosPuntos),
//         listaAlumnosOrdenadaPorPuntos[i].id).subscribe( res => {
//         console.log(res);
//         listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno = nuevosPuntos;
//         // this.listaAlumnosOrdenadaPorPuntos[i].nivelId = nivel.id;

//         rankingJuegoDePuntos[i].puntos = nuevosPuntos;
//         const fechaAsignacionPunto = new Date();
//         const fechaString = fechaAsignacionPunto.toLocaleDateString() + '  ' + fechaAsignacionPunto.toLocaleTimeString();
//         // tslint:disable-next-line:max-line-length
//         this.peticionesAPI.PonHistorialPuntosAlumno(new HistorialPuntosAlumno (valorPunto, puntoSeleccionadoId, listaAlumnosOrdenadaPorPuntos[i].id, fechaString))
//         // tslint:disable-next-line:no-shadowed-variable
//         .subscribe(res => console.log(res));
//         // Ordenar lista por puntos
//         // tslint:disable-next-line:only-arrow-functions
//         listaAlumnosOrdenadaPorPuntos = listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2) {
//           return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
//         });
//         //this.OrdenarListaPorPuntos();
//         // Ordenar ranking por puntos
//         // tslint:disable-next-line:only-arrow-functions
//         rankingJuegoDePuntos = rankingJuegoDePuntos.sort(function(obj1, obj2) {
//           return obj2.puntos - obj1.puntos;
//         });
//         for (let j = 0; j < rankingJuegoDePuntos.length - 1; j ++) {
//           rankingJuegoDePuntos[j].posicion = j + 1;
//         }
//         rankingJuegoDePuntos = rankingJuegoDePuntos.filter(result => result.nombre !== '');
//         const resultado = {
//           lista: listaAlumnosOrdenadaPorPuntos,
//           ranking: rankingJuegoDePuntos
//         };
//         obs.next (resultado);
//       });
//     }
//   });
//   return listasObservables;
// }


public AsignarPuntosEquipo(
  equipo: EquipoJuegoDePuntos,
  nivelesDelJuego: Nivel[],
  puntosNuevos: any,
  puntoSeleccionadoId: any,
) {

      equipo.PuntosTotalesEquipo = equipo.PuntosTotalesEquipo + puntosNuevos;
      if (nivelesDelJuego !== undefined) {
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



// //TIENE QUE HABER UNA FORMA MAS FACIL DE HACER ESTO
// public AsignarPuntosEquipo2(
//   i: number,
//   listaEquiposOrdenadaPorPuntos: any,
//   nivelesDelJuego: any,
//   valorPunto: any,
//   rankingEquiposJuegoDePunto: any,
//   puntoSeleccionadoId: any,



// ): any {
//   const listasObservables = new Observable ( obs => {



//     let equipo: TablaEquipoJuegoDePuntos;
//     equipo = rankingEquiposJuegoDePunto[i];
//     console.log(equipo.nombre + ' seleccionado');

//     let nivel: Nivel;
//     let siguienteNivel: Nivel;
//     nivel = nivelesDelJuego.filter(res => res.id === listaEquiposOrdenadaPorPuntos[i].nivelId)[0];


//     // Si el alumno ya ha alcanzado algun nivel, buscamos cual es el siguiente nivel del que ya tiene. Sino el siguiente
//     // nivel será el primero
//     if (listaEquiposOrdenadaPorPuntos[i].nivelId !== undefined) {
//       console.log('Si hay un nivel, buscamos el siguiente nivel');

//       if (nivel.id !== nivelesDelJuego[nivelesDelJuego.length - 1].id) {

//         //Buscamos el siguiente nivel
//         let encontrado = false;
//         let j = 0;
//         while ((j < nivelesDelJuego.length) && (encontrado === false)) {
//           if (nivelesDelJuego[j].id === listaEquiposOrdenadaPorPuntos[i].nivelId) {
//             encontrado = true;
//           }
//           j = j + 1;
//         }
//         siguienteNivel = nivelesDelJuego[j];


//       } else {
//         console.log('Ya hemos alcanzado el nivel maximo, no buscamos el siguiente nivel');
//       }

//     } else {
//       console.log('El siguiente nivel es el primer nivel');
//       siguienteNivel = nivelesDelJuego[0];
//     }

//     let nuevosPuntos: number;
//     nuevosPuntos = listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo + valorPunto;

//     // Comprobamos si subimos de nivel o no

//     if (nivel !== undefined) {
//       if (nivel !== undefined) {
//         if (nivel.id !== nivelesDelJuego[nivelesDelJuego.length - 1].id) {
//           console.log('No estoy en el ultimo nivel, busco el siguiente nivel y miro si subo nivel o no');

//           if (nuevosPuntos >= siguienteNivel.PuntosAlcanzar) {

//             console.log('Voy a subir de nivel');
//             nivel = siguienteNivel;
//           } else {

//             console.log('mantengo el nivel');
//             if (listaEquiposOrdenadaPorPuntos[i].nivelId !== undefined) {
//               nivel = nivelesDelJuego.filter(res => res.id === listaEquiposOrdenadaPorPuntos[i].nivelId)[0];

//             }
//           }
//         } else {
//           console.log('estoy maximo nivel, que es el siguiente');
//           nivel = nivelesDelJuego.filter(res => res.id === listaEquiposOrdenadaPorPuntos[i].nivelId)[0];

//           console.log(nivel);
//         }
//       }
//     } else {
//       if (nuevosPuntos >= siguienteNivel.PuntosAlcanzar) {

//         console.log('Voy a subir de nivel');
//         nivel = siguienteNivel;
//       } else {

//         console.log('mantengo el nivel');
//         if (listaEquiposOrdenadaPorPuntos[i].nivelId !== undefined) {
//           nivel = nivelesDelJuego.filter(res => res.id === listaEquiposOrdenadaPorPuntos[i].nivelId)[0];

//         }
//       }
//     }

//     // tslint:disable-next-line:curly

//     if (nivel !== undefined) {
//       this.peticionesAPI.PonPuntosEquiposJuegoDePuntos( new EquipoJuegoDePuntos(listaEquiposOrdenadaPorPuntos[i].equipoId,
//         listaEquiposOrdenadaPorPuntos[i].juegoDePuntosId, nuevosPuntos, nivel.id), listaEquiposOrdenadaPorPuntos[i].id)
//         .subscribe( res => {
//           console.log(res);
//           listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo = nuevosPuntos;
//           listaEquiposOrdenadaPorPuntos[i].nivelId = nivel.id;

//           rankingEquiposJuegoDePunto[i].puntos = nuevosPuntos;
//           rankingEquiposJuegoDePunto[i].nivel = nivel.Nombre;

//           const fechaAsignacionPunto = new Date();
//           const fechaString = fechaAsignacionPunto.toLocaleDateString() + '  ' + fechaAsignacionPunto.toLocaleTimeString();

//           // tslint:disable-next-line:max-line-length
//           // tslint:disable-next-line:max-line-length
//           this.peticionesAPI.PonHistorialPuntosEquipo(new HistorialPuntosEquipo (valorPunto, puntoSeleccionadoId, listaEquiposOrdenadaPorPuntos[i].id, fechaString))
//           .subscribe(result => console.log(res));
//           // tslint:disable-next-line:only-arrow-functions
//           rankingEquiposJuegoDePunto = rankingEquiposJuegoDePunto.sort(function(obj1, obj2) {
//             return obj2.puntos - obj1.puntos;
//           });
//           for (let j = 0; j < rankingEquiposJuegoDePunto.length - 1; j ++) {
//             rankingEquiposJuegoDePunto[j].posicion = j + 1;
//           }
//           rankingEquiposJuegoDePunto = rankingEquiposJuegoDePunto.filter(result => result.nombre !== '');
//           const resultado = {
//             lista: listaEquiposOrdenadaPorPuntos,
//             ranking: rankingEquiposJuegoDePunto
//           };
//           obs.next (resultado);
//         });
//       } else {

//         // tslint:disable-next-line:max-line-length
//         this.peticionesAPI.PonPuntosEquiposJuegoDePuntos( new EquipoJuegoDePuntos(listaEquiposOrdenadaPorPuntos[i].equipoId,
//           listaEquiposOrdenadaPorPuntos[i].juegoDePuntosId, nuevosPuntos), listaEquiposOrdenadaPorPuntos[i].id)
//           .subscribe( res => {
//             console.log(res);
//             listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo = nuevosPuntos;

//             rankingEquiposJuegoDePunto[i].puntos = nuevosPuntos;

//             const fechaAsignacionPunto = new Date();
//             const fechaString = fechaAsignacionPunto.toLocaleDateString() + '  ' + fechaAsignacionPunto.toLocaleTimeString();

//             // tslint:disable-next-line:max-line-length
//             this.peticionesAPI.PonHistorialPuntosEquipo(new HistorialPuntosEquipo (valorPunto, puntoSeleccionadoId, listaEquiposOrdenadaPorPuntos[i].id, fechaString))
//             .subscribe(result => console.log(res));
//             // tslint:disable-next-line:max-line-length
//             // tslint:disable-next-line:only-arrow-functions
//             listaEquiposOrdenadaPorPuntos = listaEquiposOrdenadaPorPuntos.sort(function(obj1, obj2) {
//               return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;
//             });
//             // tslint:disable-next-line:only-arrow-functions
//             rankingEquiposJuegoDePunto = rankingEquiposJuegoDePunto.sort(function(obj1, obj2) {
//               return obj2.puntos - obj1.puntos;
//             });
//             for (let j = 0; j < rankingEquiposJuegoDePunto.length - 1; j ++) {
//               rankingEquiposJuegoDePunto[j].posicion = j + 1;
//             }
//             rankingEquiposJuegoDePunto = rankingEquiposJuegoDePunto.filter(result => result.nombre !== '');
//             const resultado = {
//               lista: listaEquiposOrdenadaPorPuntos,
//               ranking: rankingEquiposJuegoDePunto
//             };
//             obs.next (resultado);
//           });
//       }
//   });
//   return listasObservables;
// }


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
    //let hits = this.probabilidadCromos.map(x => 0);


    for (let k = 0; k < numeroCromosRandom; k++) {

      console.log('Voy a hacer el post del cromo ' + k);

      const indexCromo = this.randomIndex(probabilidadCromos);
      //hits[this.indexCromo]++;


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

}

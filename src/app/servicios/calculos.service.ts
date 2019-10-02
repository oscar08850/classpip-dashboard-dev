import { Injectable } from '@angular/core';
import { SesionService, PeticionesAPIService} from './index';
import { Grupo, Equipo, Juego, Alumno, Nivel, TablaAlumnoJuegoDePuntos } from '../clases/index';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';

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

      return new MatTableDataSource(rankingJuegoDePuntos);

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
}

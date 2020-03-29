import { Injectable } from '@angular/core';
import {Observable, Subject , of } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { ResponseContentType, Http} from '@angular/http';


import { Profesor, Grupo, Alumno, Matricula, Juego, Punto, Nivel, AlumnoJuegoDePuntos,
        Equipo, AsignacionEquipo, AsignacionPuntosJuego, EquipoJuegoDePuntos, Coleccion,
        AlumnoJuegoDeColeccion, EquipoJuegoDeColeccion, Cromo, HistorialPuntosAlumno, HistorialPuntosEquipo,
        Album, AlbumEquipo, Insignia, AlumnoJuegoDeCompeticionLiga, EquipoJuegoDeCompeticionLiga,
        Jornada, EnfrentamientoLiga, Pregunta,  PreguntaDelCuestionario, Cuestionario} from '../clases/index';


@Injectable({
  providedIn: 'root'
})
export class PeticionesAPIService {


  private APIUrlProfesores = 'http://localhost:3000/api/Profesores';

  private APIUrlAlumnos = 'http://localhost:3000/api/Alumnos';


  private APIUrlGrupos = 'http://localhost:3000/api/Grupos';

  private APIUrlMatriculas = 'http://localhost:3000/api/Matriculas';

  private APIUrlEquipos = 'http://localhost:3000/api/Equipos';

  private APIUrlColecciones = 'http://localhost:3000/api/Colecciones';

  private APIUrlPreguntas = 'http://localhost:3000/api/Preguntas';

  private APIUrlCuestionarios = 'http://localhost:3000/api/Cuestionarios';

  private APIUrlPreguntaDelCuestionario = 'http://localhost:3000/api/PreguntasDelCuestionario';

  private APIRUrlJuegoDePuntos = 'http://localhost:3000/api/JuegosDePuntos';
  private APIUrlAlumnoJuegoDePuntos = 'http://localhost:3000/api/AlumnoJuegosDePuntos';
  private APIUrlEquipoJuegoDePuntos = 'http://localhost:3000/api/EquiposJuegosDePuntos';
  private APIUrlPuntosJuego = 'http://localhost:3000/api/AsignacionPuntosJuego';
  private APIUrlHistorialPuntosAlumno = 'http://localhost:3000/api/HistorialesPuntosAlumno';
  private APIUrlHistorialPuntosEquipo = 'http://localhost:3000/api/HistorialesPuntosEquipo';

  private APIRUrlJuegoDeColeccion = 'http://localhost:3000/api/JuegosDeColeccion';
  private APIUrlAlumnoJuegoDeColeccion = 'http://localhost:3000/api/AlumnosJuegoDeColeccion';
  private APIUrlEquipoJuegoDeColeccion = 'http://localhost:3000/api/EquiposJuegoDeColeccion';
  private APIRUrlAlbum = 'http://localhost:3000/api/Albumes';
  private APIRUrlAlbumEquipo = 'http://localhost:3000/api/albumsEquipo';

  private APIUrlJuegoDeCompeticionLiga = 'http://localhost:3000/api/JuegosDeCompeticionLiga';
  private APIUrlAlumnoJuegoDeCompeticionLiga = 'http://localhost:3000/api/AlumnosJuegoDeCompeticionLiga';
  private APIUrlEquipoJuegoDeCompeticionLiga = 'http://localhost:3000/api/EquiposJuegoDeCompeticionLiga';
  private APIUrlJornadasJuegoDeCompeticionLiga = 'http://localhost:3000/api/JornadasDeCompeticionLiga';

  // Para cargar y descargar imagenes
  private APIUrlImagenAlumno = 'http://localhost:3000/api/imagenes/imagenAlumno';
  private APIUrlImagenColeccion = 'http://localhost:3000/api/imagenes/ImagenColeccion';
  private APIUrlImagenCromo = 'http://localhost:3000/api/imagenes/ImagenCromo';
  private APIUrlImagenNivel = 'http://localhost:3000/api/imagenes/imagenNivel';
  private APIURLImagenInsignia = 'http://localhost:3000/api/imagenes/ImagenInsignia';
  private APIUrlLogosEquipos = 'http://localhost:3000/api/imagenes/LogosEquipos';


  constructor(
    private http: HttpClient,
    private httpImagenes: Http
  ) { }


  public DameProfesor(nombre: string, apellido: string): Observable<Profesor> {
    console.log('Entro a mostrar a ' + nombre + ' ' + apellido);
    return this.http.get<Profesor>(this.APIUrlProfesores + '?filter[where][Nombre]=' + nombre + '&filter[where][Apellido]=' + apellido);
  }

  public DameTodosMisAlumnos(profesorId: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.APIUrlProfesores + '/' + profesorId + '/alumnos');
  }

  public DameAlumnoConcreto(alumno: Alumno, ProfesorId: number): Observable<Alumno> {
    console.log('Entro a buscar a ' + alumno.Nombre + ' ' + alumno.PrimerApellido + ' ' + alumno.SegundoApellido );
    return this.http.get<Alumno>(this.APIUrlProfesores + '/' + ProfesorId + '/alumnos?filter[where][Nombre]=' + alumno.Nombre +
    '&filter[where][PrimerApellido]=' + alumno.PrimerApellido + '&filter[where][SegundoApellido]=' + alumno.SegundoApellido);

  }
  public DameImagenAlumno(imagen: string): Observable<any> {
    return this.httpImagenes.get(this.APIUrlImagenAlumno + '/download/' + imagen,
      { responseType: ResponseContentType.Blob });
  }

  public CreaAlumno(alumno: Alumno): Observable<Alumno> {
    return this.http.post<Alumno>(this.APIUrlAlumnos, alumno);
  }

  public BorraAlumno(alumnoId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlAlumnos + '/' + alumnoId);
  }

  public AsignaAlumnoAlProfesor(alumno: Alumno, profesorId: number): Observable<Alumno> {
    return this.http.post<Alumno>(this.APIUrlProfesores + '/' + profesorId + '/alumnos', alumno);
  }

///////////////////////////////////////////////////////////////////////////////////////////
  // Grupos
  public DameGruposProfesor(profesorId: number): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(this.APIUrlProfesores + '/' + profesorId + '/grupos');
  }
  public CreaGrupo(grupo: Grupo, profesorId: number): Observable<Grupo> {
    return this.http.post<Grupo>(this.APIUrlProfesores + '/' + profesorId + '/grupos', grupo);
  }
  public ModificaGrupo(grupo: Grupo, profesorId: number, grupoId: number): Observable<Grupo> {
    return this.http.put<Grupo>(this.APIUrlProfesores + '/' + profesorId + '/grupos/' + grupoId, grupo);
  }
  public BorraGrupo(profesorId: number, grupoId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlProfesores + '/' + profesorId + '/grupos/' + grupoId);
  }
  public DameAlumnosGrupo(grupoId: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.APIUrlGrupos + '/' + grupoId + '/alumnos');
  }
  public DameMatriculasGrupo(grupoId: number): Observable<Matricula[]> {
    return this.http.get<Matricula[]>(this.APIUrlMatriculas + '?filter[where][grupoId]=' + grupoId);
  }
  public BorraMatricula(matriculaId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlMatriculas + '/' + matriculaId);
  }

  public BorraMatriculaAlumno(alumnoId: number, grupoId: number): Observable<Matricula> {
    return this.http.delete<any>(this.APIUrlMatriculas + '?filter[where][grupoId]=' + grupoId + '&filter[where][alumnoId]=' + alumnoId);
  }

  public MatriculaAlumnoEnGrupo(matricula: Matricula): Observable<Matricula> {
    return this.http.post<Matricula>(this.APIUrlMatriculas, matricula);
  }

  public DameMatriculaAlumno(alumnoId: number, grupoId: number): Observable<Matricula> {
    return this.http.get<Matricula>(this.APIUrlMatriculas + '?filter[where][grupoId]=' + grupoId + '&filter[where][alumnoId]=' + alumnoId);
  }

///////////////////////////////////////////////////////////////////////////////////////////
  // Equipos
  public DameEquiposDelGrupo(grupoId: number): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.APIUrlGrupos + '/' + grupoId + '/equipos');
  }
  public BorraEquipoDelGrupo(equipo: Equipo): Observable<any> {
    return this.http.delete<any>(this.APIUrlGrupos + '/' + equipo.grupoId + '/equipos/' + equipo.id);
  }
  public CreaEquipo(equipo: Equipo, grupoId: number): Observable<Equipo> {
    return this.http.post<Equipo>(this.APIUrlGrupos + '/' + grupoId + '/equipos', equipo);
  }
  public PonLogoEquipo(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIUrlLogosEquipos + '/upload', formData);
  }
  public DameLogoEquipo(logo: string): Observable<any> {
    return this.httpImagenes.get(this.APIUrlLogosEquipos + '/download/' + logo,
    { responseType: ResponseContentType.Blob });
  }
  public ModificaEquipo(equipo: Equipo, grupoId: number, equipoId: number): Observable<Equipo> {
    return this.http.put<Equipo>(this.APIUrlGrupos + '/' + grupoId + '/equipos/' + equipoId, equipo);
  }
  public DameAlumnosEquipo(equipoId: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.APIUrlEquipos + '/' + equipoId + '/alumnos');
  }
  public DameAsignacionesDelEquipo(equipo: Equipo): Observable<AsignacionEquipo[]> {
    // Da las asignaciones de los alumnos del equipo
    return this.http.get<AsignacionEquipo[]>(this.APIUrlGrupos + '/' + equipo.grupoId + '/asignacionEquipos?filter[where][equipoId]='
     + equipo.id);
  }
  public DameAsignacionesEquipoDelGrupo(grupoId: number): Observable<AsignacionEquipo[]> {
    // Da las asignaciones a equipos de todos los alumnos del grupo (sean del equipo que sean)
    return this.http.get<AsignacionEquipo[]>(this.APIUrlGrupos + '/' + grupoId + '/asignacionEquipos');
  }
  public DameAsignacionEquipoAlumno(alumnoId: number, equipoId: number, grupoId: number): Observable<AsignacionEquipo> {
    // Da la asignación a un equipo de un alumno concreto
    return this.http.get<AsignacionEquipo>(this.APIUrlGrupos + '/' + grupoId + '/asignacionEquipos?filter[where][equipoId]=' + equipoId +
    '&filter[where][alumnoId]=' + alumnoId);
  }
  public ModificaAsignacionEquipoAlumno(asignacionEquipo: AsignacionEquipo, grupoId: number, asignacionEquipoId: number):
  Observable<AsignacionEquipo> {
    return this.http.put<AsignacionEquipo>(this.APIUrlGrupos + '/' + grupoId + '/asignacionEquipos/' +
    asignacionEquipoId, asignacionEquipo);
  }
  public BorraAlumnoEquipo(asignacionEquipo: AsignacionEquipo): Observable<any> {
    return this.http.delete<any>(this.APIUrlGrupos + '/' + asignacionEquipo.grupoId + '/asignacionEquipos/'
    + asignacionEquipo.id);
  }
  public PonAlumnoEquipo(asignacionEquipos: AsignacionEquipo, grupoId: number): Observable<AsignacionEquipo> {
    return this.http.post<AsignacionEquipo>(this.APIUrlGrupos + '/' + grupoId + '/asignacionEquipos', asignacionEquipos);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////
  // Puntos e insignias
  public CreaTipoDePunto(punto: Punto, profesorId: number): Observable<Punto> {
    return this.http.post<Punto>(this.APIUrlProfesores + '/' + profesorId + '/puntos', punto);
  }
  public ModificaTipoDePunto(punto: Punto, profesorId: number, puntoId: number): Observable<Punto> {
    return this.http.put<Punto>(this.APIUrlProfesores + '/' + profesorId + '/puntos/' + puntoId, punto);
  }

  public BorraTipoDePunto(puntoId: number, profesorId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlProfesores + '/' + profesorId + '/puntos/' + puntoId);
  }
  public CreaInsignia(insignia: Insignia, profesorId: number): Observable<Insignia> {
    return this.http.post<Insignia>(this.APIUrlProfesores + '/' + profesorId + '/insignia', insignia);
  }
  public DameInsignias(profesorId: number): Observable<Insignia[]> {
    return this.http.get<Insignia[]>(this.APIUrlProfesores + '/' + profesorId + '/insignia');
  }
  public ModificaInsignia(insignia: Insignia, profesorId: number, insigniaId: number): Observable<Insignia> {
    return this.http.put<Insignia>(this.APIUrlProfesores + '/' + profesorId + '/insignia/' + insigniaId, insignia);
  }
  public BorraInsignia(insigniaId: number, profesorId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlProfesores + '/' + profesorId + '/insignia/' + insigniaId);
  }
  public PonImagenInsignia(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIURLImagenInsignia + '/upload', formData);
  }
  public DameImagenInsignia(imagen: string): Observable<any> {
    return this.httpImagenes.get(this.APIURLImagenInsignia + '/download/' + imagen,
      { responseType: ResponseContentType.Blob });
  }


  ///////////////////////////////////////////////////////////////////////////////////////////
  // Colecciones
  public CreaColeccion(coleccion: Coleccion, profesorId: number): Observable<Coleccion> {
    return this.http.post<Coleccion>(this.APIUrlProfesores + '/' + profesorId + '/coleccions', coleccion);
  }
  public DameColeccion(coleccionId: number): Observable<Coleccion> {
    return this.http.get<Coleccion>(this.APIUrlColecciones + '/' + coleccionId);
  }
  public PonImagenColeccion(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIUrlImagenColeccion + '/upload', formData);
  }
  public DameImagenColeccion(imagen: string): Observable<any> {
    return this.httpImagenes.get(this.APIUrlImagenColeccion + '/download/' + imagen,
      { responseType: ResponseContentType.Blob });
  }

  public BorraColeccion(coleccionId: number, profesorId: number): Observable<any> {
    // console.log('JODER');
    return this.http.delete<any>(this.APIUrlProfesores + '/' + profesorId + '/coleccions/' + coleccionId);
  }
  public PonCromoColeccion(cromo: Cromo, coleccionId: number): Observable<Cromo> {
    return this.http.post<Cromo>(this.APIUrlColecciones + '/' + coleccionId + '/cromos', cromo);
  }
  public PonImagenCromo(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIUrlImagenCromo + '/upload', formData);
  }
  public DameImagenCromo(imagen: string): Observable<any> {
    return this.httpImagenes.get(this.APIUrlImagenCromo +  '/download/' + imagen,
      { responseType: ResponseContentType.Blob });
  }
  public ModificaCromoColeccion(cromo: Cromo, coleccionId: number, cromoId: number): Observable<Cromo> {
    return this.http.put<Cromo>(this.APIUrlColecciones + '/' + coleccionId + '/cromos/' + cromoId, cromo);
  }
  public BorrarCromo(cromoId: number, coleccionId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlColecciones + '/' + coleccionId + '/cromos/' + cromoId);
  }
  public DameCromosColeccion(coleccionId: number): Observable<Cromo[]> {
    return this.http.get<Cromo[]>(this.APIUrlColecciones + '/' + coleccionId + '/cromos');
  }
  public BorrarImagenColeccion(ImagenColeccion: string): Observable<any> {
    console.log('Voy a quitar la foto');
    return this.http.delete<any>(this.APIUrlImagenColeccion + '/files/' + ImagenColeccion);
  }

  public BorrarImagenCromo(ImagenCromo: string): Observable<any> {
    return this.http.delete<any>(this.APIUrlImagenCromo + '/files/' + ImagenCromo);
  }

   // SE USA PARA EDITAR LA COLECCIÓN DEL PROFESOR. AMBOS IDENTIFICADORES LOS PASAMOS COMO PARÁMETRO
   public ModificaColeccion(coleccion: Coleccion, profesorId: number, coleccionId: number): Observable<Coleccion> {
    return this.http.put<Coleccion>(this.APIUrlProfesores + '/' + profesorId + '/coleccions/' + coleccionId, coleccion);
  }



///////////////////////////////////////////////////////////////////////////////////////////
  // Juego de puntos
  // Creacion del juego
  public CreaJuegoDePuntos(juego: Juego, grupoId: number): Observable<Juego> {
    return this.http.post<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDePuntos', juego);
  }

  public AsignaPuntoJuego(asignacionPuntoJuego: AsignacionPuntosJuego) {
    return this.http.post<AsignacionPuntosJuego>(this.APIUrlPuntosJuego, asignacionPuntoJuego);
  }
  public DameTiposDePuntos(profesorId: number): Observable<Punto[]> {
    return this.http.get<Punto[]>(this.APIUrlProfesores + '/' + profesorId + '/puntos');
  }

  public CreaNivel(nivel: Nivel, juegoDePuntosId: number) {
    return this.http.post<Nivel>(this.APIRUrlJuegoDePuntos + '/' + juegoDePuntosId + '/nivels', nivel);
  }
  public PonImagenNivel(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIUrlImagenNivel + '/upload', formData);
  }
  public DameImagenNivel(imagen: string): Observable<any> {
    return this.httpImagenes.get(this.APIUrlImagenNivel + '/download/' + imagen,
        { responseType: ResponseContentType.Blob });
  }
  public CambiaEstadoJuegoDePuntos(juegoDePuntos: Juego, juegoDePuntosId: number, grupoId: number): Observable<Juego> {
    return this.http.put<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDePuntos/' + juegoDePuntosId, juegoDePuntos);
  }
  public BorraJuegoDePuntos(juegoDePuntosId: number, grupoId: number): Observable<Juego> {
    return this.http.delete<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDePuntos/' + juegoDePuntosId);
  }

///////////////////////////////////////////////////////////////////////////////////////////
  // Gestion de puntos en juego individual

  public DameJuegoDePuntosGrupo(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/juegoDePuntos');
  }
  public DameAlumnosJuegoDePuntos(juegoDePuntosId: number): Observable<Alumno[]> {
    console.log('Voy a por los alumnos');
    return this.http.get<Alumno[]>(this.APIRUrlJuegoDePuntos + '/' + juegoDePuntosId + '/alumnos');
  }
  public DamePuntosJuegoDePuntos(juegoDePuntosId: number): Observable<Punto[]> {
    return this.http.get<Punto[]>(this.APIRUrlJuegoDePuntos + '/' + juegoDePuntosId + '/puntos');
  }
  public DameNivelesJuegoDePuntos(juegoDePuntosId: number): Observable<Nivel[]> {
    return this.http.get<Nivel[]>(this.APIRUrlJuegoDePuntos + '/' + juegoDePuntosId + '/nivels');
  }
  public DameInscripcionAlumnoJuegoDePuntos(alumnoId: number, juegoDePuntosId: number): Observable<AlumnoJuegoDePuntos> {
    return this.http.get<AlumnoJuegoDePuntos>(this.APIUrlAlumnoJuegoDePuntos + '?filter[where][alumnoId]=' + alumnoId
    + '&filter[where][juegoDePuntosId]=' + juegoDePuntosId);
  }
  public DameInscripcionesAlumnoJuegoDePuntos(juegoDePuntosId: number): Observable<AlumnoJuegoDePuntos[]> {
    return this.http.get<AlumnoJuegoDePuntos[]>(this.APIUrlAlumnoJuegoDePuntos + '?filter[where][juegoDePuntosId]=' + juegoDePuntosId);
  }
  public InscribeAlumnoJuegoDePuntos(alumnoJuegoDePuntos: AlumnoJuegoDePuntos) {
    return this.http.post<AlumnoJuegoDePuntos>(this.APIUrlAlumnoJuegoDePuntos, alumnoJuegoDePuntos);
  }
  public BorrarPuntosAlumno(historialPuntosAlumnoId: number): Observable<HistorialPuntosAlumno[]> {
    return this.http.delete<HistorialPuntosAlumno[]>(this.APIUrlHistorialPuntosAlumno + '/' + historialPuntosAlumnoId);
  }
  public PonPuntosJuegoDePuntos( alumnoJuegoDePuntos: AlumnoJuegoDePuntos, alumnoJuegoDePuntosId: number): Observable<AlumnoJuegoDePuntos> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<AlumnoJuegoDePuntos>(this.APIUrlAlumnoJuegoDePuntos + '/' + alumnoJuegoDePuntosId, alumnoJuegoDePuntos);
  }
  public DameHistorialPuntosAlumno(alumnoJuegoDePuntosId: number): Observable<HistorialPuntosAlumno[]> {
    return this.http.get<HistorialPuntosAlumno[]>(this.APIUrlHistorialPuntosAlumno + '?filter[where][alumnoJuegoDePuntosId]='
     + alumnoJuegoDePuntosId);
  }
  public PonHistorialPuntosAlumno(historial: HistorialPuntosAlumno): Observable<HistorialPuntosAlumno> {
    return this.http.post<HistorialPuntosAlumno>(this. APIUrlHistorialPuntosAlumno, historial);
  }
  public DameHistorialDeUnPunto(alumnoJuegoDePuntosId: number, puntoId: number): Observable<HistorialPuntosAlumno[]> {
    return this.http.get<HistorialPuntosAlumno[]>(this.APIUrlHistorialPuntosAlumno + '?filter[where][alumnoJuegoDePuntosId]='
     + alumnoJuegoDePuntosId + '&filter[where][puntoId]=' + puntoId);
  }


///////////////////////////////////////////////////////////////////////////////////////////
  // Gestion de puntos en juego por equipos
  public DameEquiposJuegoDePuntos(juegoDePuntosId: number): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.APIRUrlJuegoDePuntos + '/' + juegoDePuntosId + '/equipos');
  }
  public InscribeEquipoJuegoDePuntos(equipoJuegoDePuntos: EquipoJuegoDePuntos) {
    return this.http.post<EquipoJuegoDePuntos>(this.APIUrlEquipoJuegoDePuntos, equipoJuegoDePuntos);
  }
  public DameInscripcionesEquipoJuegoDePuntos(juegoDePuntosId: number): Observable<EquipoJuegoDePuntos[]> {
    return this.http.get<EquipoJuegoDePuntos[]>(this.APIUrlEquipoJuegoDePuntos + '?filter[where][juegoDePuntosId]=' + juegoDePuntosId);
  }
  public DameHistorialDeUnPuntoEquipo(equipoJuegoDePuntosId: number, puntoId: number): Observable<HistorialPuntosEquipo[]> {
    return this.http.get<HistorialPuntosEquipo[]>(this.APIUrlHistorialPuntosEquipo + '?filter[where][equipoJuegoDePuntosId]='
     + equipoJuegoDePuntosId + '&filter[where][puntoId]=' + puntoId);
  }
  public DameHistorialPuntosEquipo(equipoJuegoDePuntosId: number): Observable<HistorialPuntosEquipo[]> {
    return this.http.get<HistorialPuntosEquipo[]>(this.APIUrlHistorialPuntosEquipo + '?filter[where][equipoJuegoDePuntosId]='
     + equipoJuegoDePuntosId);
  }
  // tslint:disable-next-line:max-line-length
  public PonPuntosEquiposJuegoDePuntos( equipoJuegoDePuntos: EquipoJuegoDePuntos, equipoJuegoDePuntosId: number): Observable<EquipoJuegoDePuntos> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<EquipoJuegoDePuntos>(this.APIUrlEquipoJuegoDePuntos + '/' + equipoJuegoDePuntosId, equipoJuegoDePuntos);
  }
  public PonHistorialPuntosEquipo(historial: HistorialPuntosEquipo): Observable<HistorialPuntosEquipo> {
    return this.http.post<HistorialPuntosEquipo>(this. APIUrlHistorialPuntosEquipo, historial);
  }
   public BorraPuntosEquipo(historialPuntosEquipoId: number): Observable<HistorialPuntosEquipo[]> {
    return this.http.delete<HistorialPuntosEquipo[]>(this.APIUrlHistorialPuntosEquipo + '/' + historialPuntosEquipoId);
  }



///////////////////////////////////////////////////////////////////////////////////////////
  // Juego de colección
  public DameColeccionesDelProfesor(profesorId: number): Observable<Coleccion[]> {
    return this.http.get<Coleccion[]>(this.APIUrlProfesores + '/' + profesorId + '/coleccions');
  }
  public CreaJuegoDeColeccion(juego: Juego, grupoId: number): Observable<Juego> {
    return this.http.post<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeColeccions', juego);
  }
  public CambiaEstadoJuegoDeColeccion(juegoDeColeccion: Juego, juegoDeColeccionId: number, grupoId: number): Observable<Juego> {
    return this.http.put<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeColeccions/' + juegoDeColeccionId, juegoDeColeccion);
  }
  public BorraJuegoDeColeccion(juegoDeColeccionId: number, grupoId: number): Observable<Juego> {
    return this.http.delete<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeColeccions/' + juegoDeColeccionId);
  }
  public DameJuegoDeColeccionGrupo(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeColeccions');
  }
  public CompletaJuegoDeColeccion(juego: Juego, grupoId: number, juegoId: number): Observable<Juego> {
    return this.http.put<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeColeccions/' + juegoId, juego);
  }
  public InscribeAlumnoJuegoDeColeccion(alumnoJuegoDeColeccion: AlumnoJuegoDeColeccion) {
    return this.http.post<AlumnoJuegoDeColeccion>(this.APIUrlAlumnoJuegoDeColeccion, alumnoJuegoDeColeccion);
  }
  public InscribeEquipoJuegoDeColeccion(equipoJuegoDeColeccion: EquipoJuegoDeColeccion) {
    return this.http.post<EquipoJuegoDeColeccion>(this.APIUrlEquipoJuegoDeColeccion, equipoJuegoDeColeccion);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////
  // Gestion del juego de colecciones, individual
  public DameAlumnosJuegoDeColeccion(juegoDeColeccionId: number): Observable<Alumno[]> {
    console.log('Voy a por los alumnos');
    return this.http.get<Alumno[]>(this.APIRUrlJuegoDeColeccion + '/' + juegoDeColeccionId + '/alumnos');
  }
  public DameInscripcionesAlumnoJuegoDeColeccion(juegoDeColeccionId: number): Observable<AlumnoJuegoDeColeccion[]> {
    return this.http.get<AlumnoJuegoDeColeccion[]>(this.APIUrlAlumnoJuegoDeColeccion + '?filter[where][juegoDeColeccionId]='
    + juegoDeColeccionId);
  }
  public AsignarCromoAlumno(album: Album) {
    return this.http.post<Album>(this.APIRUrlAlbum, album);
  }

  public DameCromosAlumno(alumnoJuegoDeColeccionId: number): Observable<Cromo[]> {
    return this.http.get<Cromo[]>(this.APIUrlAlumnoJuegoDeColeccion + '/' + alumnoJuegoDeColeccionId + '/cromos');
  }


  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Gestion del juego de colecciones, en equipo
  public DameEquiposJuegoDeColeccion(juegoDeColeccionId: number): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.APIRUrlJuegoDeColeccion + '/' + juegoDeColeccionId + '/equipos');
  }
  public DameCromosEquipo(equipoJuegoDeColeccionId: number): Observable<Cromo[]> {
    return this.http.get<Cromo[]>(this.APIUrlEquipoJuegoDeColeccion + '/' + equipoJuegoDeColeccionId + '/cromos');
  }
  public DameInscripcionesEquipoJuegoDeColeccion(juegoDeColeccionId: number): Observable<EquipoJuegoDeColeccion[]> {
    return this.http.get<EquipoJuegoDeColeccion[]>(this.APIUrlEquipoJuegoDeColeccion + '?filter[where][juegoDeColeccionId]='
    + juegoDeColeccionId);
  }
  public AsignarCromoEquipo(album: AlbumEquipo) {
    return this.http.post<AlbumEquipo>(this.APIRUrlAlbumEquipo, album);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Juego de competición
  // CREAMOS UN NUEVO JUEGO DE COMPETICION EN EL GRUPO
  public CreaJuegoDeCompeticionLiga(juego: Juego, grupoId: number): Observable<Juego> {
    console.log('voy a crear el juego de competicion liga');
    console.log(juego);
    return this.http.post<Juego>(this.APIUrlGrupos + '/' + grupoId + '/JuegosDeCompeticionLiga', juego);
  }

  public DameJuegoDeCompeticionLigaGrupo(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/JuegosDeCompeticionLiga');
  }

  public InscribeAlumnoJuegoDeCompeticionLiga(alumnoJuegoDeCompeticionLiga: AlumnoJuegoDeCompeticionLiga) {
    return this.http.post<AlumnoJuegoDeCompeticionLiga>(this.APIUrlAlumnoJuegoDeCompeticionLiga, alumnoJuegoDeCompeticionLiga);
  }

  public InscribeEquipoJuegoDeCompeticionLiga(equipoJuegoDeCompeticionLiga: EquipoJuegoDeCompeticionLiga) {
    return this.http.post<EquipoJuegoDeCompeticionLiga>(this.APIUrlEquipoJuegoDeCompeticionLiga, equipoJuegoDeCompeticionLiga);
  }

  public CambiaEstadoJuegoDeCompeticionLiga(JuegosDeCompeticionLiga: Juego,
                                            juegoDeCompeticionId: number,
                                            grupoId: number): Observable<Juego> {
    return this.http.put<Juego>(this.APIUrlGrupos + '/' + grupoId + '/JuegosDeCompeticionLiga/' + juegoDeCompeticionId,
    JuegosDeCompeticionLiga);
  }

  public BorraJuegoDeCompeticionLiga(juegoDeCompeticionId: number, grupoId: number): Observable<Juego> {
    return this.http.delete<Juego>(this.APIUrlGrupos + '/' + grupoId + '/JuegosDeCompeticionLiga/' + juegoDeCompeticionId);
  }

  // jornadas juego de competición liga
  public CrearJornadasLiga( jornadasDeCompeticionLiga: Jornada,
                            juegoDeCompeticionID: number): Observable<Jornada> {
    return this.http.post<Jornada>(this.APIUrlJuegoDeCompeticionLiga + '/' + juegoDeCompeticionID + '/JornadasDeCompeticionLiga',
    jornadasDeCompeticionLiga);
  }

  public ModificarJornada(JornadaNueva: Jornada, JornadaId: number): Observable<Jornada> {
    return this.http.put<Jornada>(this.APIUrlJornadasJuegoDeCompeticionLiga + '/' + JornadaId, JornadaNueva );
  }

  public DameJornadasDeCompeticionLiga(juegoDeCompeticionLigaId: number): Observable<Jornada[]> {
    return this.http.get<Jornada[]>(this.APIUrlJornadasJuegoDeCompeticionLiga + '?filter[where][JuegoDeCompeticionLigaId]='
    + juegoDeCompeticionLigaId);

    // return this.http.get<Jornada[]>(this.APIUrlJuegoDeCompeticionLiga + '/' + juegoDeCompeticionID + '/JornadasDeCompeticionLiga');
  }

  public DameEnfrentamientosDeJornadaLiga(jornadasDeCompeticionLigaId: number): Observable<EnfrentamientoLiga[]> {
    return this.http.get<EnfrentamientoLiga[]>('http://localhost:3000/api/JornadasDeCompeticionLiga/' + jornadasDeCompeticionLigaId +
    '/enfrentamientosLiga');
  }
  ///////////////////////////////////////////////////////////////////////////////////////////
  // Gestion del juego de competiciones, individual
  public DameAlumnosJuegoDeCompeticionLiga(juegoDeCompeticionLigaId: number): Observable<Alumno[]> {
    console.log('Voy a por los alumnos');
    return this.http.get<Alumno[]>(this.APIUrlJuegoDeCompeticionLiga + '/' + juegoDeCompeticionLigaId + '/alumnos');
  }

  public DameInscripcionesAlumnoJuegoDeCompeticionLiga(juegoDeCompeticionLigaId: number): Observable<AlumnoJuegoDeCompeticionLiga[]> {
    return this.http.get<AlumnoJuegoDeCompeticionLiga[]>(this.APIUrlAlumnoJuegoDeCompeticionLiga
                                                          + '?filter[where][JuegoDeCompeticionLigaId]=' + juegoDeCompeticionLigaId);
  }
  ///////////////////////////////////////////////////////////////////////////////////////////
  // Gestion del juego de competiciones, equipos
  public DameEquiposJuegoDeCompeticionLiga(juegoDeCompeticionLigaId: number): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.APIUrlJuegoDeCompeticionLiga + '/' + juegoDeCompeticionLigaId + '/equipos');
  }

  public DameInscripcionesEquipoJuegoDeCompeticionLiga(juegoDeCompeticionLigaId: number): Observable<EquipoJuegoDeCompeticionLiga[]> {
    return this.http.get<EquipoJuegoDeCompeticionLiga[]>(this.APIUrlEquipoJuegoDeCompeticionLiga
                                                          + '?filter[where][JuegoDeCompeticionLigaId]=' + juegoDeCompeticionLigaId);
  }


  ///////////////////////////////////////////////////////////////////////////////////////////
  // Gestion del juego de colecciones, individual

  public BorrarCromoAlumno(albumId: number ) {
    // tslint:disable-next-line:max-line-length
    return this.http.delete(this.APIRUrlAlbum + '/' + albumId);
  }



  // Una cosa es obtener los cromos (funcion anterior) y otra es obtener las asignacionese
  // de cromos (esta función) que retorna una lista de objetos de tipo Album (nombre muy poco
  // apropiado para esto)
  public DameAsignacionesCromosAlumno(inscripcionAlumnoId: number, cromoId: number): Observable<Album[]> {
    return this.http.get<Album[]>(this.APIRUrlAlbum + '?filter[where][alumnoJuegoDeColeccionId]='
          + inscripcionAlumnoId + '&filter[where][cromoId]=' + cromoId);
  }




  // Una cosa es obtener los cromos (funcion anterior) y otra es obtener las asignacionese
  // de cromos (esta función) que retorna una lista de objetos de tipo Album (nombre muy poco
  // apropiado para esto)
  public DameAsignacionesCromosEquipo(inscripcionEquipoId: number, cromoId: number): Observable<AlbumEquipo[]> {
    return this.http.get<AlbumEquipo[]>(this.APIRUrlAlbumEquipo + '?filter[where][equipoJuegoDeColeccionId]='
          + inscripcionEquipoId + '&filter[where][cromoId]=' + cromoId);
  }
  public BorrarCromoEquipo(albumId: number ) {
    // tslint:disable-next-line:max-line-length
    return this.http.delete(this.APIRUrlAlbumEquipo + '/' + albumId);
  }
  // Juego de competición
  public DameJuegoDeCompeticionGrupo(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeCompeticions');
  }

  //Preguntas
  public CreaPregunta(pregunta: Pregunta, profesorId: number): Observable<Pregunta> {
    console.log(pregunta, profesorId);
    return this.http.post<Pregunta>(this.APIUrlProfesores + '/' + profesorId + '/preguntas', pregunta);
  }

  public DameTodasMisPreguntas(profesorId: number): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(this.APIUrlProfesores + '/' + profesorId + '/preguntas');
  }

  //Cuestionarios
  public CreaCuestionario(cuestionario: Cuestionario, profesorId: number): Observable<Cuestionario> {
    console.log('Cuestionario: ' + cuestionario);
    return this.http.post<Cuestionario>(this.APIUrlProfesores + '/' + profesorId + '/cuestionarios', cuestionario);
  }
  public ModificaCuestionario(cuestionario: Cuestionario, profesorId: number, cuestionarioId: number): Observable<Cuestionario> {
    return this.http.put<Cuestionario>(this.APIUrlProfesores + '/' + profesorId + '/cuestionarios/' + cuestionarioId, cuestionario);
  }
  public BorraCuestionario(profesorId: number, cuestionarioId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlProfesores + '/' + profesorId + '/cuestionarios/' + cuestionarioId);
  }
  public DamePreguntasCuestionario(cuestionarioId: number): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(this.APIUrlCuestionarios + '/' + cuestionarioId + '/Preguntas');
  }
  public PreguntasEnCuestionario(preguntaDelCuestionario: PreguntaDelCuestionario): Observable<PreguntaDelCuestionario> {
    return this.http.post<PreguntaDelCuestionario>(this.APIUrlPreguntaDelCuestionario, preguntaDelCuestionario);
  }
  public DamePreguntaDelCuestionario(preguntaId: number, cuestionarioId: number): Observable<PreguntaDelCuestionario> {
    return this.http.get<PreguntaDelCuestionario>(this.APIUrlPreguntaDelCuestionario + '?filter[where][cuestionarioId]=' + cuestionarioId + '&filter[where][preguntaId]=' + preguntaId);
  }
  public BorraPreguntaDelCuestionario(preguntaDelCuestionatioId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlPreguntaDelCuestionario + '/' + preguntaDelCuestionatioId);
  }
  public DamePreguntasDelCuestionarioCuestionario(cuestionarioId: number): Observable<PreguntaDelCuestionario[]> {
    return this.http.get<PreguntaDelCuestionario[]>(this.APIUrlPreguntaDelCuestionario + '?filter[where][cuestionarioId]=' + cuestionarioId);
  }
}

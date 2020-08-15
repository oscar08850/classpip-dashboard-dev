import { Injectable } from '@angular/core';
import {Observable, Subject , of } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { ResponseContentType, Http} from '@angular/http';


import { Profesor, Grupo, Alumno, Matricula, Juego, Punto, Nivel, AlumnoJuegoDePuntos,
        Equipo, AsignacionEquipo, AsignacionPuntosJuego, EquipoJuegoDePuntos, Coleccion,
        AlumnoJuegoDeColeccion, EquipoJuegoDeColeccion, Cromo, HistorialPuntosAlumno, HistorialPuntosEquipo,
        Album, AlbumEquipo, Insignia, AlumnoJuegoDeCompeticionLiga, EquipoJuegoDeCompeticionLiga,
        Jornada, EnfrentamientoLiga, Pregunta,  PreguntaDelCuestionario, Cuestionario, AlumnoJuegoDeCompeticionFormulaUno,
        EquipoJuegoDeCompeticionFormulaUno, SesionClase, AsistenciaClase, FamiliaAvatares, JuegoDeAvatar,
        AlumnoJuegoDeAvatar, JuegoDeCuestionario, AlumnoJuegoDeCuestionario,
        RespuestaJuegoDeCuestionario} from '../clases/index';

import { Escenario } from '../clases/Escenario';
import { PuntoGeolocalizable } from '../clases/PuntoGeolocalizable';
import { JuegoDeGeocaching } from '../clases/JuegoDeGeocaching';
import { AlumnoJuegoDeGeocaching } from '../clases/AlumnoJuegoDeGeocaching';

@Injectable({
  providedIn: 'root'
})
export class PeticionesAPIService {





 //private host = 'http://localhost';
 private host = 'http://147.83.118.92';




  private APIUrlProfesores = this.host + ':3000/api/Profesores';
  private APIUrlAlumnos = this.host + ':3000/api/Alumnos';
  private APIUrlGrupos = this.host + ':3000/api/Grupos';
  private APIUrlMatriculas = this.host + ':3000/api/Matriculas';
  private APIUrlEquipos = this.host + ':3000/api/Equipos';
  private APIUrlColecciones = this.host + ':3000/api/Colecciones';
  private APIUrlCromos = this.host + ':3000/api/Cromos';
  private APIUrlPreguntas = this.host + ':3000/api/Preguntas';
  private APIUrlCuestionarios = this.host + ':3000/api/Cuestionarios';
  private APIUrlPreguntaDelCuestionario = this.host + ':3000/api/PreguntasDelCuestionario';
  private APIUrlAlumnoJuegoDeCuestionario = this.host + ':3000/api/AlumnosJuegoDeCuestionario';
  private APIUrlJuegoDeCuestionario = this.host + ':3000/api/JuegosDeCuestionario';
  private APIUrlRespuestasJuegoDeCuestionario = this.host + ':3000/api/respuestasJuegoDeCuestionario';



  private APIUrlJuegoDePuntos = this.host + ':3000/api/JuegosDePuntos';
  private APIUrlAlumnoJuegoDePuntos = this.host + ':3000/api/AlumnoJuegosDePuntos';
  private APIUrlEquipoJuegoDePuntos = this.host + ':3000/api/EquiposJuegosDePuntos';
  private APIUrlPuntosJuego = this.host + ':3000/api/AsignacionPuntosJuego';
  private APIUrlNiveles = this.host + ':3000/api/Niveles';
  private APIUrlHistorialPuntosAlumno = this.host + ':3000/api/HistorialesPuntosAlumno';
  private APIUrlHistorialPuntosEquipo = this.host + ':3000/api/HistorialesPuntosEquipo';
  private APIUrlJuegoDeColeccion = this.host + ':3000/api/JuegosDeColeccion';
  private APIUrlAlumnoJuegoDeColeccion = this.host + ':3000/api/AlumnosJuegoDeColeccion';
  private APIUrlEquipoJuegoDeColeccion = this.host + ':3000/api/EquiposJuegoDeColeccion';
  private APIUrlAlbum = this.host + ':3000/api/Albumes';
  private APIUrlAlbumEquipo = this.host + ':3000/api/albumsEquipo';
  private APIUrlJuegoDeCompeticionLiga = this.host + ':3000/api/JuegosDeCompeticionLiga';
  private APIUrlAlumnoJuegoDeCompeticionLiga = this.host + ':3000/api/AlumnosJuegoDeCompeticionLiga';
  private APIUrlEquipoJuegoDeCompeticionLiga = this.host + ':3000/api/EquiposJuegoDeCompeticionLiga';
  private APIUrlJornadasJuegoDeCompeticionLiga = this.host + ':3000/api/JornadasDeCompeticionLiga';
  private APIUrlEnfrentamientosLiga = this.host + ':3000/api/EnfrentamientosLiga';
  private APIUrlJuegoDeCompeticionFormulaUno = this.host + ':3000/api/JuegosDecompeticionFormulaUno';
  private APIUrlAlumnoJuegoDeCompeticionFormulaUno = this.host + ':3000/api/AlumnosJuegoDeCompeticionFormulaUno';
  private APIUrlEquipoJuegoDeCompeticionFormulaUno = this.host + ':3000/api/EquiposJuegoDeCompeticionFormulaUno';
  private APIUrlJornadasJuegoDeCompeticionFormulaUno = this.host + ':3000/api/JornadasDeCompeticionFormulaUno';
  private APIUrlJuegoDeGeocaching = this.host + ':3000/api/JuegosDeGeocaching';

  private APIUrlAsistenciasClase = this.host + ':3000/api/AsistenciasClase';
  private APIUrlSesionesClase = this.host + ':3000/api/SesionesClase';

  private APIUrlFamiliarAvatares = this.host + ':3000/api/familiasAvatares';
  private APIUrlAlumnoJuegoDeGeocaching = this.host + ':3000/api/AlumnosJuegoDeGeocaching';


  // Para cargar y descargar imagenes
  private APIUrlImagenAlumno = this.host + ':3000/api/imagenes/imagenAlumno';
  private APIUrlImagenColeccion = this.host + ':3000/api/imagenes/ImagenColeccion';
  private APIUrlImagenCromo = this.host + ':3000/api/imagenes/ImagenCromo';
  private APIUrlImagenNivel = this.host + ':3000/api/imagenes/imagenNivel';
  private APIUrlImagenInsignia = this.host + ':3000/api/imagenes/ImagenInsignia';
  private APIUrlLogosEquipos = this.host + ':3000/api/imagenes/LogosEquipos';

  private APIUrlImagenesAvatares =  this.host + ':3000/api/imagenes/ImagenesAvatares';
  private APIUrlJuegoDeAvatar = this.host + ':3000/api/juegosDeAvatar';
  private APIUrlAlumnoJuegoDeAvatar = this.host + ':3000/api/alumnosJuegoAvatar';


  private APIUrlEscenarios = this.host + ':3000/api/Escenarios';
  private APIUrlPuntosGeolocalizables = this.host + ':3000/api/PuntosGeolocalizables';

  //API Libros

  private APIurlImagenesLibros = 'http://localhost' + ':3000/api/imagenes';


  constructor(
    private http: HttpClient,
    private httpImagenes: Http
  ) { }

  /* Las funciones estar agrupadas en los bloques siquientes:

    GESTION DE PROFESORES Y ALUNNOS
    GESTIÓN DE GRUPOS
    GESTION DE EQUIIPOS
    GESTION DE SESIONES DE CLASE
    GESTION DE TIPOS DE PUNTOS E INSIGNIAS
    GESTION DE COLECCIONES
    GESTION JUEGO DE PUNTOS
    GESTION JUEGO DE PUNTOS INDIVIDUAL
    GESTION JUEGO DE PUNTOS POR EQUIPOS
    GESTION DE JUEGO DE COLECCION
    GESTION DE JUEGO DE COLECCIÓN INDIVIDUAL
    GESTION DE JUEGO DE COLECCION POR EQUIPOS
    GESTION JUEGOS DE COMPETICION
    GESTION JUEGOS DE COMPETICION TIPO LIGA
    GESTION COMPETICION LIGA INDIVIDUAL
    GESITON COMPETICION LIGA POR EQUIPOS
    GESTION JUEGO DE COMPETICION TIPO FORMULA 1
    GESTION COMPETICION FORMULA 1 INDIVIDUAL
    GESTION JUEGO COMPETICION FORMULA 1 POR EQUIPOS
    GESTION DE PREGUNTAS
    GESTION DE CUESTIONARIOS
    GESTION DE JUEGOS DE CUESTIONARIO
    GESTION DE ALUMNOS EN JUEGOS DE CUESTIONARIO
    GESTION DE ESCENARIOS
    GESTION DE JUEGOS DE GEOCACHING
    GESTION DE ALUMNOS EN JUEGOS DE GEOCACHING
    GESTION DE FAMILIAS DE AVATAES
    GESTION DE JUEGOS DE AVATARES
    GESTION DE ALUMNOS EN JUEGOS DE AVATARES
  */

/////////////////////  GESTION DE PROFESORES Y ALUNNOS ///////////////////////////////
  public DameProfesor(nombre: string, apellido: string): Observable<Profesor> {
    console.log('Entro a mostrar a ' + nombre + ' ' + apellido);
    return this.http.get<Profesor>(this.APIUrlProfesores + '?filter[where][Nombre]=' + nombre + '&filter[where][Apellido]=' + apellido);
  }

  public DameTodosMisAlumnos(profesorId: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.APIUrlProfesores + '/' + profesorId + '/alumnos');
  }

  public DameAlumno(alumnoId: number): Observable<Alumno> {
    return this.http.get<Alumno>(this.APIUrlAlumnos + '/' + alumnoId);
  }

  // Esta no se para que se usa habiendo DameTodosMisAlumnos
  public DameAlumnos(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.APIUrlAlumnos);
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

/////////////////////////////////////////// GESTIÓN DE GRUPOS ///////////////////////////////

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

///////////////////////////////////// GESTION DE EQUIIPOS ///////////////////////////////


  public DameEquipos(): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.APIUrlEquipos);
  }

  // Falta hacer DameEquipo

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

  ////////////////////////////////// GESTION DE SESIONES DE CLASE //////////////////////

  public CreaSesionClase(sesion: SesionClase, grupoId: number): Observable<Grupo> {
    return this.http.post<Grupo>(this.APIUrlGrupos + '/' + grupoId + '/sesionesClase', sesion);
  }

  public RegistraAsistenciaAlumno(asistencia: AsistenciaClase): Observable<AsistenciaClase> {
    return this.http.post<AsistenciaClase>(this.APIUrlAsistenciasClase, asistencia);
  }

  public DameSesionesClaseGrupo(grupoId: number): Observable<SesionClase[]> {
    return this.http.get<SesionClase[]>(this.APIUrlSesionesClase + '?filter[where][grupoId]=' + grupoId);
  }

  public DameAsistenciasClase(sesionClaseId: number): Observable<AsistenciaClase[]> {
    return this.http.get<AsistenciaClase[]>(this.APIUrlAsistenciasClase + '?filter[where][sesionClaseId]=' + sesionClaseId);
  }

  public BorraSesionClase(sesionClaseId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlSesionesClase + '/' + sesionClaseId);
  }

  public BorraAsistenciaClase(asistenciaId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlAsistenciasClase + '/' + asistenciaId);
  }

  ////////////////////////////////// GESTION DE TIPOS DE PUNTOS E INSIGNIAS ////////////////////////////////////

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
    return this.http.post<any>(this.APIUrlImagenInsignia + '/upload', formData);
  }
  public DameImagenInsignia(imagen: string): Observable<any> {
    return this.httpImagenes.get(this.APIUrlImagenInsignia + '/download/' + imagen,
      { responseType: ResponseContentType.Blob });
  }


  /////////////////////////////////////// GESTION DE COLECCIONES ////////////////////////////////////////////////////

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
  public BorrarCromo(cromoId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlCromos + '/' + cromoId);
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



///////////////////////////////////////////// GESTION JUEGO DE PUNTOS //////////////////////////////////////////////

  public CreaJuegoDePuntos(juego: Juego, grupoId: number): Observable<Juego> {
    return this.http.post<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDePuntos', juego);
  }

  public AsignaPuntoJuego(asignacionPuntoJuego: AsignacionPuntosJuego) {
    return this.http.post<AsignacionPuntosJuego>(this.APIUrlPuntosJuego, asignacionPuntoJuego);
  }

  public DamePuntosJuego(juegoDePuntosId: number) {
    return this.http.get<AsignacionPuntosJuego[]>(this.APIUrlPuntosJuego +  '?filter[where][juegoDePuntosId]=' + juegoDePuntosId);
  }

  public BorraPuntoJuego(puntoId: number): any {
    return this.http.delete<any>(this.APIUrlPuntosJuego + '/' + puntoId);
  }


  public DameTiposDePuntos(profesorId: number): Observable<Punto[]> {
    return this.http.get<Punto[]>(this.APIUrlProfesores + '/' + profesorId + '/puntos');
  }

  public CreaNivel(nivel: Nivel, juegoDePuntosId: number) {
    return this.http.post<Nivel>(this.APIUrlJuegoDePuntos + '/' + juegoDePuntosId + '/nivels', nivel);
  }

  public DameNivelesJuego(juegoDePuntosId: number): Observable<Nivel[]> {
    return this.http.get<Nivel[]>(this.APIUrlNiveles +  '?filter[where][juegoDePuntosId]=' + juegoDePuntosId);
  }

  public BorraNivel(nivelId: number): any {
    return this.http.delete<any>(this.APIUrlNiveles + '/' + nivelId);
  }

  public PonImagenNivel(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIUrlImagenNivel + '/upload', formData);
  }
  public DameImagenNivel(imagen: string): Observable<any> {
    return this.httpImagenes.get(this.APIUrlImagenNivel + '/download/' + imagen,
        { responseType: ResponseContentType.Blob });
  }

  public BorraImagenNivel(imagenNivel: string): Observable<any> {
    return this.http.delete<any>(this.APIUrlImagenNivel + '/files/' + imagenNivel);
  }

  public CambiaEstadoJuegoDePuntos(juegoDePuntos: Juego, juegoDePuntosId: number, grupoId: number): Observable<Juego> {
    return this.http.put<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDePuntos/' + juegoDePuntosId, juegoDePuntos);
  }
  public BorraJuegoDePuntos(juegoDePuntosId: number): Observable<Juego> {
    return this.http.delete<Juego>(this.APIUrlJuegoDePuntos + '/' + juegoDePuntosId);
  }

/////////////////////////////////// GESTION JUEGO DE PUNTOS INDIVIDUAL ////////////////////////////////////////////////////////

  public DameJuegoDePuntosGrupo(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/juegoDePuntos');
  }
  public DameAlumnosJuegoDePuntos(juegoDePuntosId: number): Observable<Alumno[]> {
    console.log('Voy a por los alumnos');
    return this.http.get<Alumno[]>(this.APIUrlJuegoDePuntos + '/' + juegoDePuntosId + '/alumnos');
  }
  public DamePuntosJuegoDePuntos(juegoDePuntosId: number): Observable<Punto[]> {
    return this.http.get<Punto[]>(this.APIUrlJuegoDePuntos + '/' + juegoDePuntosId + '/puntos');
  }
  public DameNivelesJuegoDePuntos(juegoDePuntosId: number): Observable<Nivel[]> {
    return this.http.get<Nivel[]>(this.APIUrlJuegoDePuntos + '/' + juegoDePuntosId + '/nivels');
  }
  public DameInscripcionAlumnoJuegoDePuntos(alumnoId: number, juegoDePuntosId: number): Observable<AlumnoJuegoDePuntos> {
    return this.http.get<AlumnoJuegoDePuntos>(this.APIUrlAlumnoJuegoDePuntos + '?filter[where][alumnoId]=' + alumnoId
    + '&filter[where][juegoDePuntosId]=' + juegoDePuntosId);
  }
  public BorraInscripcionAlumnoJuegoDePuntos(inscripcionId: number): any {
    return this.http.delete<any>(this.APIUrlAlumnoJuegoDePuntos + '/' + inscripcionId);
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


//////////////////////////////////////// GESTION JUEGO DE PUNTOS POR EQUIPOS ///////////////////////////////////////////////////
  public DameEquiposJuegoDePuntos(juegoDePuntosId: number): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.APIUrlJuegoDePuntos + '/' + juegoDePuntosId + '/equipos');
  }
  public InscribeEquipoJuegoDePuntos(equipoJuegoDePuntos: EquipoJuegoDePuntos) {
    return this.http.post<EquipoJuegoDePuntos>(this.APIUrlEquipoJuegoDePuntos, equipoJuegoDePuntos);
  }
  public DameInscripcionesEquipoJuegoDePuntos(juegoDePuntosId: number): Observable<EquipoJuegoDePuntos[]> {
    return this.http.get<EquipoJuegoDePuntos[]>(this.APIUrlEquipoJuegoDePuntos + '?filter[where][juegoDePuntosId]=' + juegoDePuntosId);
  }

  public BorraInscripcionEquipoJuegoDePuntos(inscripcionId: number): any {
    return this.http.delete<any>(this.APIUrlEquipoJuegoDePuntos + '/' + inscripcionId);
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



///////////////////////////////////////// GESTION DE JUEGO DE COLECCION //////////////////////////////////////////////////
  public DameColeccionesDelProfesor(profesorId: number): Observable<Coleccion[]> {
    return this.http.get<Coleccion[]>(this.APIUrlProfesores + '/' + profesorId + '/coleccions');
  }
  public CreaJuegoDeColeccion(juego: Juego, grupoId: number): Observable<Juego> {
    return this.http.post<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeColeccions', juego);
  }
  public CambiaEstadoJuegoDeColeccion(juegoDeColeccion: Juego, juegoDeColeccionId: number, grupoId: number): Observable<Juego> {
    return this.http.put<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeColeccions/' + juegoDeColeccionId, juegoDeColeccion);
  }
  public BorraJuegoDeColeccion(juegoDeColeccionId: number): Observable<Juego> {
    return this.http.delete<Juego>(this.APIUrlJuegoDeColeccion + '/' + juegoDeColeccionId);
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

  ///////////////////////////////////////// GESTION DE JUEGO DE COLECCIÓN INDIVIDUAL //////////////////////////////////////////////////

  public DameAlumnosJuegoDeColeccion(juegoDeColeccionId: number): Observable<Alumno[]> {
    console.log ('pido alumnos del juego ' + juegoDeColeccionId);
    return this.http.get<Alumno[]>(this.APIUrlJuegoDeColeccion + '/' + juegoDeColeccionId + '/alumnos');
  }
  public DameInscripcionesAlumnoJuegoDeColeccion(juegoDeColeccionId: number): Observable<AlumnoJuegoDeColeccion[]> {
    return this.http.get<AlumnoJuegoDeColeccion[]>(this.APIUrlAlumnoJuegoDeColeccion + '?filter[where][juegoDeColeccionId]='
    + juegoDeColeccionId);
  }

  public BorraInscripcionAlumnoJuegoDeColeccion(inscripcionId: number ) {
    // tslint:disable-next-line:max-line-length
    return this.http.delete(this.APIUrlAlumnoJuegoDeColeccion + '/' + inscripcionId);
  }

  public AsignarCromoAlumno(album: Album) {
    return this.http.post<Album>(this.APIUrlAlbum, album);
  }

  public DameCromosAlumno(alumnoJuegoDeColeccionId: number): Observable<Cromo[]> {
    return this.http.get<Cromo[]>(this.APIUrlAlumnoJuegoDeColeccion + '/' + alumnoJuegoDeColeccionId + '/cromos');
  }



  // Una cosa es obtener los cromos (funcion anterior) y otra es obtener las asignacionese
  // de cromos (esta función) que retorna una lista de objetos de tipo Album (nombre muy poco
  // apropiado para esto)

  public DameAsignacionesCromosAlumno(inscripcionAlumnoId: number): Observable<Album[]> {
    return this.http.get<Album[]>(this.APIUrlAlbum + '?filter[where][alumnoJuegoDeColeccionId]='
          + inscripcionAlumnoId);
  }

  // Esta es para obtener las asignaciones de un cromo concreto
  public DameAsignacionesCromoConcretoAlumno(inscripcionAlumnoId: number, cromoId: number): Observable<Album[]> {
    return this.http.get<Album[]>(this.APIUrlAlbum + '?filter[where][alumnoJuegoDeColeccionId]='
          + inscripcionAlumnoId + '&filter[where][cromoId]=' + cromoId);
  }


  public BorrarAsignacionCromoAlumno(albumId: number ) {
    // tslint:disable-next-line:max-line-length
    return this.http.delete(this.APIUrlAlbum + '/' + albumId);
  }



  ////////////////////////////////////// GESTION DE JUEGO DE COLECCION POR EQUIPOS //////////////////////////////////
  public DameEquiposJuegoDeColeccion(juegoDeColeccionId: number): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.APIUrlJuegoDeColeccion + '/' + juegoDeColeccionId + '/equipos');
  }

  public DameInscripcionesEquipoJuegoDeColeccion(juegoDeColeccionId: number): Observable<EquipoJuegoDeColeccion[]> {
    return this.http.get<EquipoJuegoDeColeccion[]>(this.APIUrlEquipoJuegoDeColeccion + '?filter[where][juegoDeColeccionId]='
    + juegoDeColeccionId);
  }

  public BorraInscripcionEquipoJuegoDeColeccion(inscripcionId: number ) {
    // tslint:disable-next-line:max-line-length
    return this.http.delete(this.APIUrlEquipoJuegoDeColeccion + '/' + inscripcionId);
  }

  public AsignarCromoEquipo(album: AlbumEquipo) {
    return this.http.post<AlbumEquipo>(this.APIUrlAlbumEquipo, album);
  }

  public DameCromosEquipo(equipoJuegoDeColeccionId: number): Observable<Cromo[]> {
    return this.http.get<Cromo[]>(this.APIUrlEquipoJuegoDeColeccion + '/' + equipoJuegoDeColeccionId + '/cromos');
  }

  // Una cosa es obtener los cromos (funcion anterior) y otra es obtener las asignacionese
  // de cromos (esta función) que retorna una lista de objetos de tipo AlbumEquipo (nombre muy poco
  // apropiado para esto)

  public DameAsignacionesCromosEquipo(inscripcionEquipoId: number): Observable<AlbumEquipo[]> {
    return this.http.get<AlbumEquipo[]>(this.APIUrlAlbumEquipo + '?filter[where][alumnoJuegoDeColeccionId]='
          + inscripcionEquipoId);
  }
  public DameAsignacionesCromoConcretoEquipo(inscripcionEquipoId: number, cromoId: number): Observable<AlbumEquipo[]> {
    return this.http.get<AlbumEquipo[]>(this.APIUrlAlbumEquipo + '?filter[where][equipoJuegoDeColeccionId]='
          + inscripcionEquipoId + '&filter[where][cromoId]=' + cromoId);
  }
  public BorrarAsignacionCromoEquipo(albumId: number ) {
    // tslint:disable-next-line:max-line-length
    return this.http.delete(this.APIUrlAlbumEquipo + '/' + albumId);
  }



    /////////////////////////////////////// GESTION JUEGOS DE COMPETICION /////////////////////////////////

  public DameJuegoDeCompeticionGrupo(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeCompeticions');
  }

   /////////////////////////////////////// GESTION JUEGOS DE COMPETICION TIPO LIGA /////////////////////////////////

  public CreaJuegoDeCompeticionLiga(juego: Juego, grupoId: number): Observable<Juego> {
    return this.http.post<Juego>(this.APIUrlGrupos + '/' + grupoId + '/JuegosDeCompeticionLiga', juego);
  }

  public DameJuegoDeCompeticionLigaGrupo(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/JuegosDeCompeticionLiga');
  }

  public CambiaEstadoJuegoDeCompeticionLiga(JuegosDeCompeticionLiga: Juego,
                                            juegoDeCompeticionId: number,
                                            grupoId: number): Observable<Juego> {
    return this.http.put<Juego>(this.APIUrlGrupos + '/' + grupoId + '/JuegosDeCompeticionLiga/' + juegoDeCompeticionId,
    JuegosDeCompeticionLiga);
  }

  public BorraJuegoDeCompeticionLiga(juegoDeCompeticionId: number): Observable<Juego> {
    return this.http.delete<Juego>(this.APIUrlJuegoDeCompeticionLiga + '/' + juegoDeCompeticionId);
  }


  // jornadas juego de competición liga
  public CrearJornadasLiga( jornadasDeCompeticionLiga: Jornada,
                            juegoDeCompeticionID: number): Observable<Jornada> {
    return this.http.post<Jornada>(this.APIUrlJuegoDeCompeticionLiga + '/' + juegoDeCompeticionID + '/JornadasDeCompeticionLiga',
    jornadasDeCompeticionLiga);
  }

    // jornadas juego de competición liga
  public BorrarJornadaLiga( jornadaDeCompeticionLiga: Jornada): Observable<Jornada> {
    return this.http.delete<Jornada>(this.APIUrlJornadasJuegoDeCompeticionLiga + '/' + jornadaDeCompeticionLiga.id);

  }

  public ModificarJornada(JornadaNueva: Jornada, JornadaId: number): Observable<Jornada> {
    return this.http.patch<Jornada>(this.APIUrlJornadasJuegoDeCompeticionLiga + '/' + JornadaId, JornadaNueva );
  }

  public DameJornadasDeCompeticionLiga(juegoDeCompeticionLigaId: number): Observable<Jornada[]> {
    return this.http.get<Jornada[]>(this.APIUrlJornadasJuegoDeCompeticionLiga + '?filter[where][JuegoDeCompeticionLigaId]='
    + juegoDeCompeticionLigaId);
  }

  public DameEnfrentamientosDeCadaJornadaLiga(jornadasDeCompeticionLigaId: number): Observable<Array<EnfrentamientoLiga>> {
    return this.http.get<Array<EnfrentamientoLiga>>(this.APIUrlJornadasJuegoDeCompeticionLiga + '/' + jornadasDeCompeticionLigaId +
    '/enfrentamientosLiga');
  }
  public CrearEnrentamientoLiga(enfrentamiento: EnfrentamientoLiga, jornadasDeCompeticionLigaId: number): Observable<EnfrentamientoLiga> {
    return this.http.post<EnfrentamientoLiga>(this.APIUrlJornadasJuegoDeCompeticionLiga + '/' + jornadasDeCompeticionLigaId +
    '/enfrentamientosLiga', enfrentamiento);
  }
  public BorraEnrentamientoLiga(enfrentamiento: EnfrentamientoLiga): Observable<EnfrentamientoLiga> {
    return this.http.delete<EnfrentamientoLiga>(this.APIUrlEnfrentamientosLiga + '/' + enfrentamiento.id);
  }

  public PonGanadorDelEnfrentamiento(enfrentamiento: EnfrentamientoLiga): Observable<EnfrentamientoLiga> {
    return this.http.put<EnfrentamientoLiga>(this.APIUrlEnfrentamientosLiga + '/' + enfrentamiento.id, enfrentamiento);
  }


  ///////////////////////////////// GESTION COMPETICION LIGA INDIVIDUAL //////////////////////////////////////////////////////////
  public DameAlumnosJuegoDeCompeticionLiga(juegoDeCompeticionLigaId: number): Observable<Alumno[]> {
    console.log('Voy a por los alumnos');
    return this.http.get<Alumno[]>(this.APIUrlJuegoDeCompeticionLiga + '/' + juegoDeCompeticionLigaId + '/alumnos');
  }

  public InscribeAlumnoJuegoDeCompeticionLiga(alumnoJuegoDeCompeticionLiga: AlumnoJuegoDeCompeticionLiga) {
    return this.http.post<AlumnoJuegoDeCompeticionLiga>(this.APIUrlAlumnoJuegoDeCompeticionLiga, alumnoJuegoDeCompeticionLiga);
  }
  public BorraInscripcionAlumnoJuegoDeCompeticionLiga(inscripcionId: number) {
    return this.http.delete<AlumnoJuegoDeCompeticionLiga>(this.APIUrlAlumnoJuegoDeCompeticionLiga + '/' + inscripcionId);
  }

  public DameInscripcionesAlumnoJuegoDeCompeticionLiga(juegoDeCompeticionLigaId: number): Observable<AlumnoJuegoDeCompeticionLiga[]> {
    return this.http.get<AlumnoJuegoDeCompeticionLiga[]>(this.APIUrlAlumnoJuegoDeCompeticionLiga
                                                          + '?filter[where][JuegoDeCompeticionLigaId]=' + juegoDeCompeticionLigaId);
  }

  // tslint:disable-next-line:max-line-length
  public PonPuntosAlumnoGanadorJuegoDeCompeticionLiga(alumnoGanadorJuegoDeCompeticionLiga: AlumnoJuegoDeCompeticionLiga): Observable<AlumnoJuegoDeCompeticionLiga> {
    return this.http.put<AlumnoJuegoDeCompeticionLiga>(this.APIUrlAlumnoJuegoDeCompeticionLiga + '/'
                                                       + alumnoGanadorJuegoDeCompeticionLiga.id, alumnoGanadorJuegoDeCompeticionLiga);
  }

  //////////////////////////////////// GESITON COMPETICION LIGA POR EQUIPOS ///////////////////////////////////////////////////////
  public DameEquiposJuegoDeCompeticionLiga(juegoDeCompeticionLigaId: number): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.APIUrlJuegoDeCompeticionLiga + '/' + juegoDeCompeticionLigaId + '/equipos');
  }

  public DameInscripcionesEquipoJuegoDeCompeticionLiga(juegoDeCompeticionLigaId: number): Observable<EquipoJuegoDeCompeticionLiga[]> {
    return this.http.get<EquipoJuegoDeCompeticionLiga[]>(this.APIUrlEquipoJuegoDeCompeticionLiga
                                                          + '?filter[where][JuegoDeCompeticionLigaId]=' + juegoDeCompeticionLigaId);
  }


  public BorraInscripcionEquipoJuegoDeCompeticionLiga(inscripcionId: number) {
    return this.http.delete<EquipoJuegoDeCompeticionLiga>(this.APIUrlEquipoJuegoDeCompeticionLiga + '/' + inscripcionId);
  }

  public InscribeEquipoJuegoDeCompeticionLiga(equipoJuegoDeCompeticionLiga: EquipoJuegoDeCompeticionLiga) {
    return this.http.post<EquipoJuegoDeCompeticionLiga>(this.APIUrlEquipoJuegoDeCompeticionLiga, equipoJuegoDeCompeticionLiga);
  }

  // tslint:disable-next-line:max-line-length
  public PonPuntosEquipoGanadorJuegoDeCompeticionLiga(ganadorJuegoDeCompeticionLiga: EquipoJuegoDeCompeticionLiga): Observable<EquipoJuegoDeCompeticionLiga> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<EquipoJuegoDeCompeticionLiga>(this.APIUrlEquipoJuegoDeCompeticionLiga + '/' + ganadorJuegoDeCompeticionLiga.id, ganadorJuegoDeCompeticionLiga);
  }

/////////////////////////// GESTION JUEGO DE COMPETICION TIPO FORMULA 1 ////////////////////////////

  public CreaJuegoDeCompeticionFormulaUno(juego: Juego, grupoId: number): Observable<Juego> {
    return this.http.post<Juego>(this.APIUrlGrupos + '/' + grupoId + '/JuegosDeCompeticionFormulaUno', juego);
  }

  public DameJuegoDeCompeticionFormulaUnoGrupo(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/JuegosDeCompeticionFormulaUno');
  }

  public BorraJuegoDeCompeticionFormulaUno(juegoDeCompeticionId: number): Observable<Juego> {
    return this.http.delete<Juego>(this.APIUrlJuegoDeCompeticionFormulaUno + '/' + juegoDeCompeticionId);
  }

  public ModificaJuegoDeCompeticionFormulaUno(juego: Juego, grupoId: number): Observable<Juego> {
    return this.http.patch<Juego>(this.APIUrlJuegoDeCompeticionFormulaUno + '/' + grupoId, juego);
  }
   public CambiaEstadoJuegoDeCompeticionFormulaUno( JuegosDeCompeticionF1: Juego,
                                                    juegoDeCompeticionId: number,
                                                    grupoId: number): Observable<Juego> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<Juego>(this.APIUrlGrupos + '/' + grupoId + '/JuegosDeCompeticionFormulaUno/' + juegoDeCompeticionId, JuegosDeCompeticionF1);
  }

  public CrearJornadasFormulaUno( JornadasDeCompeticionFormulaUno: Jornada, juegoDeCompeticionID: number): Observable<Jornada> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<Jornada>(this.APIUrlJuegoDeCompeticionFormulaUno + '/' + juegoDeCompeticionID + '/JornadasDeCompeticionFormulaUno',
    JornadasDeCompeticionFormulaUno);

  }

  public ModificarJornadaFormulaUno(JornadaNueva: Jornada, JornadaId: number): Observable<Jornada> {
    return this.http.patch<Jornada>(this.APIUrlJornadasJuegoDeCompeticionFormulaUno + '/' + JornadaId, JornadaNueva );
  }


  public DameJornadasDeCompeticionFormulaUno(juegoDeCompeticionId: number): Observable<Jornada[]> {
    return this.http.get<Jornada[]>(this.APIUrlJuegoDeCompeticionFormulaUno + '/' + juegoDeCompeticionId
                                     + '/jornadasDeCompeticionFormulaUno');
  }

  public ActualizaGanadoresJornadasDeCompeticionFormulaUno(juegoDeCompeticionFormulaUnoId: number): Observable<Jornada[]> {
    return this.http.get<Jornada[]>(this.APIUrlJuegoDeCompeticionFormulaUno + '/' + juegoDeCompeticionFormulaUnoId
                                     + '/jornadasDeCompeticionFormulaUno');
  }

  public PonGanadoresJornadasDeCompeticionFormulaUno(jornada: Jornada): Observable<Jornada> {
    return this.http.put<Jornada>(this.APIUrlJornadasJuegoDeCompeticionFormulaUno + '/' + jornada.id, jornada);
  }

  public BorrarJornadaFormulaUno( jornadaDeCompeticionFormulaUno: Jornada): Observable<Jornada> {
    return this.http.delete<Jornada>(this.APIUrlJornadasJuegoDeCompeticionFormulaUno  + '/' + jornadaDeCompeticionFormulaUno.id);

  }

   ////////////////////////////////// GESTION COMPETICION FORMULA 1 INDIVIDUAL /////////////////////////////////////////////////////////

  public DameAlumnosJuegoDeCompeticionFormulaUno(juegoDeCompeticionFormulaUnoId: number): Observable<Alumno[]> {
    console.log('Voy a por los alumnos');
    return this.http.get<Alumno[]>(this.APIUrlJuegoDeCompeticionFormulaUno + '/' + juegoDeCompeticionFormulaUnoId + '/alumnos');
  }

  public InscribeAlumnoJuegoDeCompeticionFormulaUno(alumnoJuegoDeCompeticionFormulaUno: AlumnoJuegoDeCompeticionFormulaUno) {
    return this.http.post<AlumnoJuegoDeCompeticionFormulaUno>(this.APIUrlAlumnoJuegoDeCompeticionFormulaUno,
      alumnoJuegoDeCompeticionFormulaUno);
  }


  // tslint:disable-next-line:max-line-length
  public DameInscripcionesAlumnoJuegoDeCompeticionFormulaUno(juegoDeCompeticionFormulaUnoId: number): Observable<AlumnoJuegoDeCompeticionFormulaUno[]> {
    return this.http.get<AlumnoJuegoDeCompeticionFormulaUno[]>(this.APIUrlAlumnoJuegoDeCompeticionFormulaUno
                                                      + '?filter[where][JuegoDeCompeticionFormulaUnoId]=' + juegoDeCompeticionFormulaUnoId);
  }

  public BorraInscripcionAlumnoJuegoDeCompeticionFormulaUno(alumnoJuegoDeCompeticionFormulaUnoId: number) {
    // tslint:disable-next-line:max-line-length
    return this.http.delete<AlumnoJuegoDeCompeticionFormulaUno>(this.APIUrlAlumnoJuegoDeCompeticionFormulaUno + '/' + alumnoJuegoDeCompeticionFormulaUnoId);
  }


  // tslint:disable-next-line:max-line-length
  public PonPuntosAlumnoGanadorJornadasDeCompeticionFormulaUno(alumno: AlumnoJuegoDeCompeticionFormulaUno): Observable<AlumnoJuegoDeCompeticionFormulaUno> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<AlumnoJuegoDeCompeticionFormulaUno>(this.APIUrlAlumnoJuegoDeCompeticionFormulaUno + '/' + alumno.id, alumno);
  }

  //////////////////////////////////////// GESTION JUEGO COMPETICION FORMULA 1 POR EQUIPOS ///////////////////////////////////////

  public DameEquiposJuegoDeCompeticionFormulaUno(juegoDeCompeticionLigaId: number): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.APIUrlJuegoDeCompeticionFormulaUno + '/' + juegoDeCompeticionLigaId + '/equipos');
  }

  public InscribeEquipoJuegoDeCompeticionFormulaUno(equipoJuegoDeCompeticionFormulaUno: EquipoJuegoDeCompeticionFormulaUno) {
    return this.http.post<EquipoJuegoDeCompeticionFormulaUno>(this.APIUrlEquipoJuegoDeCompeticionFormulaUno,
      equipoJuegoDeCompeticionFormulaUno);
  }
// tslint:disable-next-line:max-line-length
  public DameInscripcionesEquipoJuegoDeCompeticionFormulaUno(juegoDeCompeticionFormulaUnoId: number): Observable<EquipoJuegoDeCompeticionFormulaUno[]> {
    return this.http.get<EquipoJuegoDeCompeticionFormulaUno[]>(this.APIUrlEquipoJuegoDeCompeticionFormulaUno
                                                      + '?filter[where][JuegoDeCompeticionFormulaUnoId]=' + juegoDeCompeticionFormulaUnoId);
  }

  public BorraInscripcionEquipoJuegoDeCompeticionFormulaUno(equipoJuegoDeCompeticionFormulaUnoId: number) {
    // tslint:disable-next-line:max-line-length
    return this.http.delete<EquipoJuegoDeCompeticionLiga>(this.APIUrlEquipoJuegoDeCompeticionFormulaUno + '/' + equipoJuegoDeCompeticionFormulaUnoId);
  }

   // tslint:disable-next-line:max-line-length
   public PonPuntosEquipoGanadorJornadasDeCompeticionFormulaUno(equipo: EquipoJuegoDeCompeticionFormulaUno): Observable<EquipoJuegoDeCompeticionFormulaUno> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<EquipoJuegoDeCompeticionFormulaUno>(this.APIUrlEquipoJuegoDeCompeticionFormulaUno + '/' + equipo.id, equipo);
  }


/////////////////////////////// GESTION DE PREGUNTAS /////////////////////////////

  public CreaPregunta(pregunta: Pregunta, profesorId: number): Observable<Pregunta> {
    console.log(pregunta, profesorId);
    return this.http.post<Pregunta>(this.APIUrlProfesores + '/' + profesorId + '/preguntas', pregunta);
  }
  public DameTodasMisPreguntas(profesorId: number): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(this.APIUrlProfesores + '/' + profesorId + '/preguntas');
  }
  public BorrarPregunta(preguntaId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlPreguntas + '/' + preguntaId);
  }
  public ModificaPregunta(pregunta: Pregunta, profesorId: number, preguntaId: number): Observable<Pregunta> {
    return this.http.put<Pregunta>(this.APIUrlProfesores + '/' + profesorId + '/preguntas/' + preguntaId, pregunta);
  }

  //////////////////////////// GESTION DE CUESTIONARIOS /////////////////////////////
  public CreaCuestionario(cuestionario: Cuestionario, profesorId: number): Observable<Cuestionario> {
    console.log('Cuestionario: ' + cuestionario);
    return this.http.post<Cuestionario>(this.APIUrlProfesores + '/' + profesorId + '/cuestionarios', cuestionario);
  }
  public DameCuestionario(cuestionarioId: number): Observable<Cuestionario> {
    return this.http.get<Cuestionario>(this.APIUrlCuestionarios + '/' + cuestionarioId);
  }
  public ModificaCuestionario(cuestionario: Cuestionario, profesorId: number, cuestionarioId: number): Observable<Cuestionario> {
    return this.http.put<Cuestionario>(this.APIUrlProfesores + '/' + profesorId + '/cuestionarios/' + cuestionarioId, cuestionario);
  }
  public DameTodosMisCuestionarios(profesorId: number): Observable<Cuestionario[]> {
    return this.http.get<Cuestionario[]>(this.APIUrlProfesores + '/' + profesorId + '/cuestionarios');
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
    // tslint:disable-next-line:max-line-length
    return this.http.get<PreguntaDelCuestionario>(this.APIUrlPreguntaDelCuestionario + '?filter[where][cuestionarioId]=' + cuestionarioId + '&filter[where][preguntaId]=' + preguntaId);
  }
  public BorraPreguntaDelCuestionario(preguntaDelCuestionatioId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlPreguntaDelCuestionario + '/' + preguntaDelCuestionatioId);
  }
  public DamePreguntasDelCuestionarioCuestionario(cuestionarioId: number): Observable<PreguntaDelCuestionario[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<PreguntaDelCuestionario[]>(this.APIUrlPreguntaDelCuestionario + '?filter[where][cuestionarioId]=' + cuestionarioId);
  }
  public DameCuestionariosConPregunta(preguntaId: number): Observable<PreguntaDelCuestionario[]> {
    return this.http.get<PreguntaDelCuestionario[]>(this.APIUrlPreguntaDelCuestionario + '?filter[where][preguntaId]=' + preguntaId);
  }
    //////////////////////////////// GESTION DE JUEGOS DE CUESTIONARIO/////////////////
    public CreaJuegoDeCuestionario(juegoDeCuestionario: JuegoDeCuestionario, grupoId: number): Observable<JuegoDeCuestionario> {
      return this.http.post<JuegoDeCuestionario>(this.APIUrlGrupos + '/' + grupoId + '/juegosDeCuestionario', juegoDeCuestionario);
    }
    public DameJuegoDeCuestionario(grupoId: number): Observable<Juego[]> {
      return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/juegosDeCuestionario');
    }
    public ModificaJuegoDeCuestionario(JuegosDeCuestionario: JuegoDeCuestionario,
                                       juegoDeCuestionarioId: number, grupoId: number): Observable<JuegoDeCuestionario> {
      return this.http.put<JuegoDeCuestionario>(this.APIUrlGrupos + '/' + grupoId + '/juegosDeCuestionario/' + juegoDeCuestionarioId,
      JuegosDeCuestionario);
    }

    public BorrarJuegoDeCuestionario(juegoDeCuestionarioId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlJuegoDeCuestionario + '/' + juegoDeCuestionarioId);
    }
      //////////////////////////////// GESTION DE ALUMNOS EN JUEGOS DE CUESTIONARIO/////////////////

    public InscribeAlumnoJuegoDeCuestionario(alumnoJuegoDeCuestionario: AlumnoJuegoDeCuestionario) {
      return this.http.post<AlumnoJuegoDeCuestionario>(this.APIUrlAlumnoJuegoDeCuestionario, alumnoJuegoDeCuestionario);
    }
    public DameAlumnosJuegoDeCuestionario(juegoDeCuestionario: number): Observable<Alumno[]> {
      return this.http.get<Alumno[]>(this.APIUrlJuegoDeCuestionario + '/' + juegoDeCuestionario + '/alumnos');
    }
    public DameInscripcionesAlumnoJuegoDeCuestionario(juegoDeCuestionarioId: number): Observable<AlumnoJuegoDeCuestionario[]> {
      return this.http.get<AlumnoJuegoDeCuestionario[]>(this.APIUrlAlumnoJuegoDeCuestionario
                                                        + '?filter[where][juegoDeCuestionarioId]=' + juegoDeCuestionarioId);
    }
    public DameRespuestasAlumnoJuegoDeCuestionario(alumnoJuegoDeCuestionarioId: number): Observable<RespuestaJuegoDeCuestionario[]> {
      return this.http.get<RespuestaJuegoDeCuestionario[]>(this.APIUrlRespuestasJuegoDeCuestionario
        + '?filter[where][alumnoJuegoDeCuestionarioId]=' + alumnoJuegoDeCuestionarioId);
    }

    public BorraRespuestaAlumnoDelJuegoDeCuestionario(respuestaId: number) {
      return this.http.delete<any>(this.APIUrlRespuestasJuegoDeCuestionario + '/' + respuestaId);
    }
    public BorraAlumnoDelJuegoDeCuestionario(alumnoJuegoDeCuestionarioId: number): Observable<any> {
      return this.http.delete<any>(this.APIUrlAlumnoJuegoDeCuestionario + '/' + alumnoJuegoDeCuestionarioId);
    }



 /////////////////////////////////////// GESTION DE ESCENARIOS ////////////////////////

  public CreaEscenario(escenario: Escenario, profesorId: number): Observable<Escenario> {
    console.log('Escenario: ' + escenario);
    return this.http.post<Escenario>(this.APIUrlProfesores + '/' + profesorId + '/escenarios', escenario);
  }
  public ModificaEscenario(escenario: Escenario, profesorId: number, idescenario: number): Observable<Escenario> {
    return this.http.put<Escenario>(this.APIUrlProfesores + '/' + profesorId + '/escenarios/' + idescenario, escenario);
  }
  // public DameTodosMisEscenarios(profesorId: number): Observable<Escenario[]> {
  //   return this.http.get<Escenario[]>(this.APIUrlProfesores + '/' + profesorId + '/escenarios');
  // }

  public DameEscenariosDelProfesor(profesorId: number): Observable<Escenario[]> {
    return this.http.get<Escenario[]>(this.APIUrlProfesores + '/' + profesorId + '/escenarios');
  }

  public BorraEscenario(idescenario: number, profesorId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlProfesores + '/' + profesorId + '/escenarios/' + idescenario);
  }
  public PonPuntoGeolocalizableEscenario(puntogeolocalizable: PuntoGeolocalizable, idescenario: number): Observable<PuntoGeolocalizable> {
    return this.http.post<PuntoGeolocalizable>(this.APIUrlEscenarios + '/' + idescenario + '/puntosgeolocalizables', puntogeolocalizable);
  }
  public BorrarPuntoGeolocalizable(idpuntogeolocalizable: number, idescenario: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlEscenarios + '/' + idescenario + '/puntosgeolocalizables/' + idpuntogeolocalizable);
  }
  public DameEscenario(idescenario: number): Observable<Escenario> {
    return this.http.get<Escenario>(this.APIUrlEscenarios + '/' + idescenario);
  }


  public DamePuntosGeolocalizablesEscenario(idescenario: number): Observable<PuntoGeolocalizable[]> {
    return this.http.get<PuntoGeolocalizable[]>(this.APIUrlEscenarios + '/' + idescenario + '/puntosgeolocalizables');
  }

  // tslint:disable-next-line:max-line-length
  public ModificaPuntoGeolocalizableEscenario(puntogeolocalizable: PuntoGeolocalizable, idescenario: number, idpuntogeolocalizable: number): Observable<PuntoGeolocalizable> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<PuntoGeolocalizable>(this.APIUrlEscenarios + '/' + idescenario + '/puntosgeolocalizables/' + idpuntogeolocalizable, puntogeolocalizable);
  }

  ////////////////////////////// GESTION DE JUEGOS DE GEOCACHING ////////////////////////////////////////

  public CreaJuegoDeGeocaching(juegoDeGeocaching: JuegoDeGeocaching, grupoId: number): Observable<JuegoDeGeocaching> {
    return this.http.post<JuegoDeGeocaching>(this.APIUrlGrupos + '/' + grupoId + '/juegosDeGeocaching', juegoDeGeocaching);
  }

  public ModificaJuegoDeGeocaching(JuegosDeGeocaching: JuegoDeGeocaching,
                                   juegoDeGeocachingId: number, grupoId: number): Observable<JuegoDeGeocaching> {
    return this.http.put<JuegoDeGeocaching>(this.APIUrlGrupos + '/' + grupoId + '/juegosDeGeocaching/' + juegoDeGeocachingId,
    JuegosDeGeocaching);
  }
public BorrarJuegoDeGeocaching(juegoDeGeocachingId: number): Observable<any> {
  return this.http.delete<any>(this.APIUrlJuegoDeGeocaching + '/' + juegoDeGeocachingId);
}

public DameJuegoDeGeocaching(grupoId: number): Observable<Juego[]> {
  return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/juegosDeGeocaching');
}

/////////////////////////////// GESTION DE ALUMNOS EN JUEGOS DE GEOCACHING //////////////////

public DameAlumnosDelJuegoDeGeocaching(juegoDeGeocachingId: number): Observable<AlumnoJuegoDeGeocaching[]> {
  // tslint:disable-next-line:max-line-length
  return this.http.get<AlumnoJuegoDeGeocaching[]>(this.APIUrlAlumnoJuegoDeGeocaching + '?filter[where][juegoDeGeocachingId]=' + juegoDeGeocachingId);
}
public BorraAlumnoDelJuegoDeGeocaching(alumnoJuegoDeGeocachingId: number): Observable<any> {
  return this.http.delete<any>(this.APIUrlAlumnoJuegoDeGeocaching + '/' + alumnoJuegoDeGeocachingId);
}

public InscribeAlumnoJuegoDeGeocaching(alumnoJuegoDeGeocaching: AlumnoJuegoDeGeocaching) {
  return this.http.post<AlumnoJuegoDeGeocaching>(this.APIUrlAlumnoJuegoDeGeocaching, alumnoJuegoDeGeocaching);
}

public DameAlumnosJuegoDeGeocaching(juegoDeGeocaching: number): Observable<Alumno[]> {
  return this.http.get<Alumno[]>(this.APIUrlJuegoDeGeocaching + '/' + juegoDeGeocaching + '/alumnos');
}
public DameInscripcionesAlumnoJuegoDeGeocaching(juegoDeGeocachingId: number): Observable<AlumnoJuegoDeGeocaching[]> {
  return this.http.get<AlumnoJuegoDeGeocaching[]>(this.APIUrlAlumnoJuegoDeGeocaching
                                                    + '?filter[where][juegoDeGeocachingId]=' + juegoDeGeocachingId);
}



  ////////////////////////////// GESTION FAMILIAS DE AVATARES ////////////////////////////////////


  public CreaFamiliaAvatares(familia: FamiliaAvatares, profesorId: number): Observable<FamiliaAvatares> {
    return this.http.post<FamiliaAvatares>(this.APIUrlProfesores + '/' + profesorId + '/familiaAvatares', familia);
  }

  public DameFamiliasAvataresProfesor(profesorId: number): Observable<FamiliaAvatares[]> {
    return this.http.get<FamiliaAvatares[]>(this.APIUrlProfesores + '/' + profesorId + '/familiaAvatares');
  }

  public DameFamilia(familiaId: number): Observable<FamiliaAvatares> {
    return this.http.get<FamiliaAvatares>(this.APIUrlFamiliarAvatares + '/' + familiaId);
  }

  public ModificaFamiliaAvatares(familia: FamiliaAvatares): Observable<FamiliaAvatares> {
    return this.http.put<FamiliaAvatares>(this.APIUrlFamiliarAvatares + '/' + familia.id, familia);
  }

  public  BorraFamiliaAvatares(familiaId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlFamiliarAvatares + '/' +  familiaId);
  }

  public PonImagenAvatar(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIUrlImagenesAvatares + '/upload', formData);
  }
  public DameImagenAvatar(imagen: string): Observable<any> {
    return this.httpImagenes.get(this.APIUrlImagenesAvatares + '/download/' + imagen,
      { responseType: ResponseContentType.Blob });
  }

  public BorrarImagenAvatar(imagen: string): Observable<any> {
    return this.http.delete<any>(this.APIUrlImagenesAvatares + '/files/' + imagen);
  }

    ////////////////////////////// GESTION JUEGO DE AVATARES ////////////////////////////////////

  public CreaJuegoDeAvatar(juego: JuegoDeAvatar, grupoId: number): Observable<JuegoDeAvatar> {
      return this.http.post<JuegoDeAvatar>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeAvatars', juego);
  }

  public BorraJuegoDeAvatar(juegoDeAvatarId: number): Observable<JuegoDeAvatar> {
    return this.http.delete<JuegoDeAvatar>(this.APIUrlJuegoDeAvatar + '/' + juegoDeAvatarId);
  }

  public ModificaJuegoDeAvatar(juego: Juego): Observable<Juego> {
    return this.http.put<Juego>(this.APIUrlJuegoDeAvatar + '/' + juego.id, juego);
  }
  public DameJuegoDeAvatarGrupo(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeAvatars');
  }

  //////////////////////////////// GESTION DE ALUMNOS EN JUEGO DE AVATAR //////////////

  public InscribeAlumnoJuegoDeAvatar(alumnoJuegoDeAvatar: AlumnoJuegoDeAvatar) {
    return this.http.post<AlumnoJuegoDeAvatar>(this.APIUrlAlumnoJuegoDeAvatar,
      alumnoJuegoDeAvatar);
  }

  public DameAlumnosJuegoDeAvatar(juegoDeAvatarId: number): Observable<Alumno[]> {
    console.log('Voy a por los alumnos');
    return this.http.get<Alumno[]>(this.APIUrlJuegoDeAvatar + '/' + juegoDeAvatarId + '/alumnos');
  }

  // tslint:disable-next-line:max-line-length
  public DameInscripcionesAlumnoJuegoDeAvatar(juegoDeAvatarId: number): Observable<AlumnoJuegoDeAvatar[]> {
    return this.http.get<AlumnoJuegoDeAvatar[]>(this.APIUrlAlumnoJuegoDeAvatar
                                                      + '?filter[where][juegoDeAvatarId]=' + juegoDeAvatarId);
  }
  public BorraInscripcionAlumnoJuegoDeAvatar(inscripcionId: number) {
    // tslint:disable-next-line:max-line-length
    return this.http.delete<AlumnoJuegoDeAvatar>(this.APIUrlAlumnoJuegoDeAvatar + '/' + inscripcionId);
  }

  public ModificaInscripcionAlumnoJuegoDeAvatar(inscripcion: AlumnoJuegoDeAvatar): Observable<AlumnoJuegoDeAvatar> {
    return this.http.put<AlumnoJuegoDeAvatar>(this.APIUrlAlumnoJuegoDeAvatar + '/' + inscripcion.id, inscripcion);
  }
  //////////////////////////////// GESTION DE EQUIPOS EN JUEGO DE AVATAR /////////////////


  /////////////////////////////// GESTION LIBROS //////////////////////////////////


  public crearCarpeta(nombre: any):Observable<any>{
    return this.http.post<any>(this.APIurlImagenesLibros, nombre);
  }

  public guardarImagenRecursoLibro(nombre: any, file: any):Observable<any>{
    return this.http.post<any>(this.APIurlImagenesLibros +'/'+ nombre + '/upload', file);
  }
}

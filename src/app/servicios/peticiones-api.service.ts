import { Injectable } from '@angular/core';
import {Observable, Subject , of } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { ResponseContentType } from '@angular/http';

import { Profesor, Grupo, Alumno, Matricula, Juego, Punto, Nivel, AlumnoJuegoDePuntos,
        Equipo, AsignacionEquipo, AsignacionPuntosJuego, EquipoJuegoDePuntos, Coleccion,
        AlumnoJuegoDeColeccion, EquipoJuegoDeColeccion, Cromo } from '../clases/index';

@Injectable({
  providedIn: 'root'
})
export class PeticionesAPIService {


  private APIUrlProfesores = 'http://localhost:3000/api/Profesores';
  private APIUrlGrupos = 'http://localhost:3000/api/Grupos';
  private APIUrlMatriculas = 'http://localhost:3000/api/Matriculas';
  private APIRUrlJuegoDePuntos = 'http://localhost:3000/api/JuegosDePuntos';
  private APIUrlAlumnoJuegoDePuntos = 'http://localhost:3000/api/AlumnoJuegosDePuntos';
  private APIUrlLogoEquipo = 'http://localhost:3000/api/imagenes/LogosEquipos/download/'
  private APIUrlEquipos = 'http://localhost:3000/api/Equipos';
  private APIUrlLogosEquipos = 'http://localhost:3000/api/imagenes/LogosEquipos';
  private APIUrlPuntosJuego = 'http://localhost:3000/api/AsignacionPuntosJuego';
  private APIUrlImagenNivel = 'http://localhost:3000/api/imagenes/imagenNivel';

  private APIUrlAlumnoJuegoPuntos = 'http://localhost:3000/api/AlumnoJuegosDePuntos';
  private APIUrlEquipoJuegoPuntos = 'http://localhost:3000/api/EquiposJuegosDePuntos';

  private APIUrlAlumnoJuegoDeColeccion = 'http://localhost:3000/api/AlumnosJuegoDeColeccion';
  private APIUrlEquipoJuegoDeColeccion = 'http://localhost:3000/api/EquiposJuegoDeColeccion';


  private APIUrlColecciones = 'http://localhost:3000/api/Colecciones';
  private APIUrlImagenColeccion = 'http://localhost:3000/api/imagenes/ImagenColeccion';
  private APIUrlImagenCromo = 'http://localhost:3000/api/imagenes/ImagenCromo';


  constructor(
    private http: HttpClient
  ) { }

  // FUNCIÓN TEMPORAL DE AUTENTIFICAR (PARA SIMPLIFICAR AHORA)
  public DameProfesor(nombre: string, apellido: string): Observable<Profesor> {
    console.log('Entro a mostrar a ' + nombre + ' ' + apellido);
    return this.http.get<Profesor>(this.APIUrlProfesores + '?filter[where][Nombre]=' + nombre + '&filter[where][Apellido]=' + apellido);
  }

  // NOS DEVUELVE UN ARRAY CON LOS GRUPOS DEL PROFESOR
  public DameGruposProfesor(profesorId: number): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(this.APIUrlProfesores + '/' + profesorId + '/grupos');
  }

  // NOS DEVUELVE LOS ALUMNOS DEL GRUPO CUYO IDENTIFICADOR PASAMOS COMO PARÁMETRO
  public DameAlumnosGrupo(grupoId: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.APIUrlGrupos + '/' + grupoId + '/alumnos');
  }

   // OBTENEMOS LA MATRICULA DE UN ALUMNO EN UN GRUPO NUEVO
   public DameMatriculasGrupo(grupoId: number): Observable<Matricula[]> {
    return this.http.get<Matricula[]>(this.APIUrlMatriculas + '?filter[where][grupoId]=' + grupoId);
  }


  // BORRAMOS LA MATRICULA DEL ALUMNO EN EL GRUPO
  public BorraMatricula(matriculaId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlMatriculas + '/' + matriculaId);
  }

  public BorraGrupo(profesorId: number, grupoId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlProfesores + '/' + profesorId + '/grupos/' + grupoId);
  }

  // DEVUELVE LOS JUEGOS DE PUNTOS DEL GRUPO QUE PASAMOS COMO PARÁMETRO
  public DameJuegoDePuntosGrupo(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/juegoDePuntos');
  }

  // OBTENEMOS LOS JUEGO DE COLECCIÓN DEL GRUPO
  public DameJuegoDeColeccionGrupo(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeColeccions');
  }

  // OBTENEMOS LOS JUEGO DE COMPETICIÓN DEL GRUPO
  public DameJuegoDeCompeticionGrupo(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeCompeticions');
  }

  // OBTENEMOS LOS PUNTOS QUE FORMAN PARTE DEL JUEGO DE PUNTOS
  public DamePuntosJuegoDePuntos(juegoDePuntosId: number): Observable<Punto[]> {
    return this.http.get<Punto[]>(this.APIRUrlJuegoDePuntos + '/' + juegoDePuntosId + '/puntos');
  }

   // OBTENEMOS LOS NIVELES QUE FORMAN PARTE DEL JUEGO DE PUNTOS
   public DameNivelesJuegoDePuntos(juegoDePuntosId: number): Observable<Nivel[]> {
    return this.http.get<Nivel[]>(this.APIRUrlJuegoDePuntos + '/' + juegoDePuntosId + '/nivels');
  }

  // OBTENEMOS LOS ALUMNOS QUE FORMAN PARTE DEL JUEGO DE PUNTOS
    public DameAlumnosJuegoDePuntos(juegoDePuntosId: number): Observable<Alumno[]> {
    console.log('Voy a por los alumnos');
    return this.http.get<Alumno[]>(this.APIRUrlJuegoDePuntos + '/' + juegoDePuntosId + '/alumnos');
  }

  // OBTENEMOS LA INSCRIPCIÓN ESPECÍFICA DE UN ALUMNO CONCRETO EN UN JUEGO DE PUNTOS CONCRETO.
  public DameInscripcionAlumnoJuegoDePuntos(alumnoId: number, juegoDePuntosId: number): Observable<AlumnoJuegoDePuntos> {
    return this.http.get<AlumnoJuegoDePuntos>(this.APIUrlAlumnoJuegoDePuntos + '?filter[where][alumnoId]=' + alumnoId
    + '&filter[where][juegoDePuntosId]=' + juegoDePuntosId);
  }

  // NOS DEVUELVE LAS INCRIPCIONES DE TODOS LOS ALUMNOS DE UN JUEGO DE PUNTOS
  public DameInscripcionesAlumnoJuegoDePuntos(juegoDePuntosId: number): Observable<AlumnoJuegoDePuntos[]> {
    return this.http.get<AlumnoJuegoDePuntos[]>(this.APIUrlAlumnoJuegoDePuntos + '?filter[where][juegoDePuntosId]=' + juegoDePuntosId);
  }

  // PERMITE CREAR UN GRUPO AL PROFESOR. DEVOLVEMOS UN OBSERVABLE GRUPO PARA SABER EL IDENTIFICADOR DEL GRUPO QUE ACABAMOS
  // DE CREAR POR SI DECIDIMOS TIRAR UN PASO HACIA ATRÁS EN EL MOMENTO DE CREAR Y MODIFICAR EL NOMBRE O LA DESCRIPCIÓN
  public CreaGrupo(grupo: Grupo, profesorId: number): Observable<Grupo> {
    return this.http.post<Grupo>(this.APIUrlProfesores + '/' + profesorId + '/grupos', grupo);
  }
// CUANDO EDITAMOS UN GRUPO LE PASAMOS EL NUEVO MODELO DEL GRUPO, EL IDENTIFICADOR DEL PROFESOR Y EL GRUPO EN CONCRETO
  // QUE QUEREMOS EDITAR
  public ModificaGrupo(grupo: Grupo, profesorId: number, grupoId: number): Observable<Grupo> {
    return this.http.put<Grupo>(this.APIUrlProfesores + '/' + profesorId + '/grupos/' + grupoId, grupo);
  }

   // BUSCA SI HAY ALGUN ALUMNO EN LA BASE DE DATOS CON ESE NOMBRE Y APELLIDOS
   public DameAlumnoConcreto(alumno: Alumno, ProfesorId: number): Observable<Alumno> {
    console.log('Entro a buscar a ' + alumno.Nombre + ' ' + alumno.PrimerApellido + ' ' + alumno.SegundoApellido );
    return this.http.get<Alumno>(this.APIUrlProfesores + '/' + ProfesorId + '/alumnos?filter[where][Nombre]=' + alumno.Nombre +
    '&filter[where][PrimerApellido]=' + alumno.PrimerApellido + '&filter[where][SegundoApellido]=' + alumno.SegundoApellido);
  }

  // MATRICULAMOS A UN ALUMNO EN UN GRUPO NUEVO
  public MatriculaAlumnoEnGrupo(matricula: Matricula): Observable<Matricula> {
    return this.http.post<Matricula>(this.APIUrlMatriculas, matricula);
  }

  // ASIGNAR ALUMNOS A UN PROFESOR
  public AsignaAlumnoAlProfesor(alumno: Alumno, profesorId: number): Observable<Alumno> {
    return this.http.post<Alumno>(this.APIUrlProfesores + '/' + profesorId + '/alumnos', alumno);
  }

  // OBTENEMOS LA MATRICULA CONCRETA DE UN ALUMNO EN UN GRUPO
  public DameMatriculaAlumno(alumnoId: number, grupoId: number): Observable<Matricula> {
    return this.http.get<Matricula>(this.APIUrlMatriculas + '?filter[where][grupoId]=' + grupoId + '&filter[where][alumnoId]=' + alumnoId);
  }


  // OBTENEMOS LOS EQUIPOS DEL GRUPO
  public DameEquiposDelGrupo(grupoId: number): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.APIUrlGrupos + '/' + grupoId + '/equipos');
  }

  // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera

  // public DameLogoEquipo(FotoEquipo: string): Observable<any> {
  //   return this.http.get(this.APIUrlLogoEquipo + FotoEquipo,
  //      { responseType: ResponseContentType.ArrayBuffer });
  // }

  // OBTENEMOS LOS ALUMNOS QUE PERTENECEN A UN EQUIPO
  public DameAlumnosEquipo(equipoId: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.APIUrlEquipos + '/' + equipoId + '/alumnos');
  }

  // ELIMINAMOS UN EQUIPO EN CONCRETO DEL GRUPO
  public BorraEquipoDelGrupo(equipo: Equipo): Observable<any> {
    return this.http.delete<any>(this.APIUrlGrupos + '/' + equipo.grupoId + '/equipos/' + equipo.id);
  }

  // DEVUELVE UN ARRAY CON LAS ASIGNACIONES DE UN EQUIPO CONCRETO
  public DameAsignacionesDelEquipo(equipo: Equipo): Observable<AsignacionEquipo[]> {
    console.log('Entro a buscar' );
    return this.http.get<AsignacionEquipo[]>(this.APIUrlGrupos + '/' + equipo.grupoId + '/asignacionEquipos?filter[where][equipoId]='
     + equipo.id);
  }

  // BUSCA Y ELIMINA A UN ALUMNO DE UN EQUIPO (BORRA ASIGNACIONEQUIPO)
  public BorraAlumnoEquipo(asignacionEquipo: AsignacionEquipo): Observable<any> {
    return this.http.delete<any>(this.APIUrlGrupos + '/' + asignacionEquipo.grupoId + '/asignacionEquipos/'
    + asignacionEquipo.id);
  }

  // CREAMOS UN NUEVO EQUIPO DENTRO DEL GRUPO
  public CreaEquipo(equipo: Equipo, grupoId: number): Observable<Equipo> {
    return this.http.post<Equipo>(this.APIUrlGrupos + '/' + grupoId + '/equipos', equipo);
  }
  // PONEMOS UN LOGO AL EQUIPO
  public PonLogoEquipo(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIUrlLogosEquipos + '/upload', formData);
  }


  // SE USA PARA EDITAR UN EQUIPO
  public ModificaEquipo(equipo: Equipo, grupoId: number, equipoId: number): Observable<Equipo> {
    return this.http.put<Equipo>(this.APIUrlGrupos + '/' + grupoId + '/equipos/' + equipoId, equipo);
  }

  // RECUPERAMOS LAS ASIGNACIONES (COMO LA INSCRIPCIÓN DEL ALUMNO AL EQUIPO) DE UN GRUPO DETERMINADO
  public DameAsignacionesEquipoDelGrupo(grupoId: number): Observable<AsignacionEquipo[]> {
    return this.http.get<AsignacionEquipo[]>(this.APIUrlGrupos + '/' + grupoId + '/asignacionEquipos');
  }

  // DEVUELVE LA ASIGNACIÓN CONCRETA DE UN ALUMNO EN UN EQUIPO
  public DameAsignacionEquipoAlumno(alumnoId: number, equipoId: number, grupoId: number): Observable<AsignacionEquipo> {
    return this.http.get<AsignacionEquipo>(this.APIUrlGrupos + '/' + grupoId + '/asignacionEquipos?filter[where][equipoId]=' + equipoId +
    '&filter[where][alumnoId]=' + alumnoId);
  }

  // EDITA UNA ASIGNACIÓN DE UN ALUMNO EN UN EQUIPO. SE PUEDE UTILIZAR PARA MOVER ALUMNOS DE EQUIPO.
  public ModificaAsignacionEquipoAlumno(asignacionEquipo: AsignacionEquipo, grupoId: number, asignacionEquipoId: number):
  Observable<AsignacionEquipo> {
    return this.http.put<AsignacionEquipo>(this.APIUrlGrupos + '/' + grupoId + '/asignacionEquipos/' +
    asignacionEquipoId, asignacionEquipo);
  }


  // ASIGNAR ALUMNO A UN EQUIPO
  public PonAlumnoEquipo(asignacionEquipos: AsignacionEquipo, grupoId: number): Observable<AsignacionEquipo> {
    return this.http.post<AsignacionEquipo>(this.APIUrlGrupos + '/' + grupoId + '/asignacionEquipos', asignacionEquipos);
  }

  // CREA UN NUEVO JUEGO DE PUNTOS
  public CreaJuegoDePuntos(juego: Juego, grupoId: number): Observable<Juego> {
    return this.http.post<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDePuntos', juego);
  }

  // CREAMOS UN NUEVO JUEGO DE COLECCIÓN EN EL GRUPO
  public CreaJuegoDeColeccion(juego: Juego, grupoId: number): Observable<Juego> {
    return this.http.post<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeColeccions', juego);
  }

  // DEVUELVE LOS TIPOS DE PUNTOS CREADOS POR EL PROFESOR
  public DameTiposDePuntos(profesorId: number): Observable<Punto[]> {
    return this.http.get<Punto[]>(this.APIUrlProfesores + '/' + profesorId + '/puntos');
  }

  // SELECCIONAMOS LOS PUNTOS QUE FORMARÁN PARTE DEL JUEGO
  public AsignaPuntoJuego(asignacionPuntoJuego: AsignacionPuntosJuego) {
    return this.http.post<AsignacionPuntosJuego>(this.APIUrlPuntosJuego, asignacionPuntoJuego);
  }


  // CREAMOS NIVELES PARA UN JUEGO DE PUNTOS DETERMINADO
  public CreaNivel(nivel: Nivel, juegoDePuntosId: number) {
    return this.http.post<Nivel>(this.APIRUrlJuegoDePuntos + '/' + juegoDePuntosId + '/nivels', nivel);
  }


  // ASIGNAMOS FOTOS A UN NIVEL (ES OPCIONAL)
  public PonImagenNivel(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIUrlImagenNivel + '/upload', formData);
  }


  // INSCRIBIMOS A LOS ALUMNOS AL JUEGO DE PUNTOS
  public InscribeAlumnoJuegoDePuntos(alumnoJuegoDePuntos: AlumnoJuegoDePuntos) {
    return this.http.post<AlumnoJuegoDePuntos>(this.APIUrlAlumnoJuegoPuntos, alumnoJuegoDePuntos);
  }


  // INSCRIBIMOS A LOS EQUIPOS AL JUEGO DE PUNTOS
  public InscribeEquipoJuegoDePuntos(equipoJuegoDePuntos: EquipoJuegoDePuntos) {
    return this.http.post<EquipoJuegoDePuntos>(this.APIUrlEquipoJuegoPuntos, equipoJuegoDePuntos);
  }

  // OBTENEMOS UN ARRAY CON LAS COLECCIONES DEL PROFESOR
  public DameColeccionesDelProfesor(profesorId: number): Observable<Coleccion[]> {
    return this.http.get<Coleccion[]>(this.APIUrlProfesores + '/' + profesorId + '/coleccions');
  }





  // EDITAMOS UN JUEGO DE COLECCIÓN. EL JUEGO YA FUE CREADO. AHORA LO COMPLETAMOS ASIGNANDOLE
  // LA COLECCION (POR ESO ES UN PUT)
  public CompletaJuegoDeColeccion(juego: Juego, grupoId: number, juegoId: number): Observable<Juego> {
    return this.http.put<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeColeccions/' + juegoId, juego);
  }

  // INSCRIBIMOS AL ALUMNO EN EL JUEGO DE COLECCIÓN
  public InscribeAlumnoJuegoDeColeccion(alumnoJuegoDeColeccion: AlumnoJuegoDeColeccion) {
    return this.http.post<AlumnoJuegoDeColeccion>(this.APIUrlAlumnoJuegoDeColeccion, alumnoJuegoDeColeccion);
  }

  // INCRIBIMOS AL EQUIPO EN EL JUEGO DE COLECCIÓN
  public InscribeEquipoJuegoDeColeccion(equipoJuegoDeColeccion: EquipoJuegoDeColeccion) {
    return this.http.post<EquipoJuegoDeColeccion>(this.APIUrlEquipoJuegoDeColeccion, equipoJuegoDeColeccion);
  }

  // OBTENEMOS UN ARRAY DE CROMOS DE LA COLECCIÓN
  public DameCromosColeccion(coleccionId: number): Observable<Cromo[]> {
    return this.http.get<Cromo[]>(this.APIUrlColecciones + '/' + coleccionId + '/cromos');
  }



  // ELIMINAMOS LA COLECCIÓN CUYO IDENTIFICADOR PASAMOS COMO PARÁMETRO
  public BorraColeccion(coleccionId: number, profesorId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlProfesores + '/' + profesorId + '/coleccions/' + coleccionId);
  }


  // ELIMINAMOS UN CROMO DETERMINADO DE UNA COLECCIÓN CONCRETA
  public BorrarCromo(cromoId: number, coleccionId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlColecciones + '/' + coleccionId + '/cromos/' + cromoId);
  }

   // SE USA PARA EDITAR LA COLECCIÓN DEL PROFESOR. AMBOS IDENTIFICADORES LOS PASAMOS COMO PARÁMETRO
   public ModificaColeccion(coleccion: Coleccion, profesorId: number, coleccionId: number): Observable<Coleccion> {
    return this.http.put<Coleccion>(this.APIUrlProfesores + '/' + profesorId + '/coleccions/' + coleccionId, coleccion);
  }


  // PONE UNA IMÁGEN A LA COLECCIÓN
  public PonImagenColeccion(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIUrlImagenColeccion + '/upload', formData);
  }

   // EDITAMOS UN CROMO EN CONCRETO DE UNA COLECCIÓN DETERMINADA
  public ModificaCromoColeccion(cromo: Cromo, coleccionId: number, cromoId: number): Observable<Cromo> {
    return this.http.put<Cromo>(this.APIUrlColecciones + '/' + coleccionId + '/cromos/' + cromoId, cromo);
  }

  // PONEMOS UNA IMAGEN AL CROMO
  public PonImagenCromo(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIUrlImagenCromo + '/upload', formData);
  }

  // HACE UN POST DE UNA NUEVA COLECCIÓN AL PROFESOR
  public CreaColeccion(coleccion: Coleccion, profesorId: number): Observable<Coleccion> {
    return this.http.post<Coleccion>(this.APIUrlProfesores + '/' + profesorId + '/coleccions', coleccion);
  }

  // AGREGAMOS UN NUEVO CROMO A UNA COLECCIÓN DETERMINADA
  public PonCromoColeccion(cromo: Cromo, coleccionId: number): Observable<Cromo> {
    return this.http.post<Cromo>(this.APIUrlColecciones + '/' + coleccionId + '/cromos', cromo);
  }
}

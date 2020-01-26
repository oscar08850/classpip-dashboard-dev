import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// IMPORTAMOS LOS COMPONENTES
import { LoginComponent } from './paginas/login/login.component';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { CrearGrupoComponent } from './paginas/crear-grupo/crear-grupo.component';
import { MisGruposComponent } from './paginas/mis-grupos/mis-grupos.component';
import { GrupoComponent } from './paginas/grupo/grupo.component';
import { EditarGrupoComponent } from './paginas/editar-grupo/editar-grupo.component';
import { EquiposComponent } from './paginas/equipos/equipos.component';
import { EditarEquipoComponent } from './paginas/equipos/editar-equipo/editar-equipo.component';
import { AboutClasspipComponent } from './paginas/about-classpip/about-classpip.component';
import { MisPuntosComponent } from './paginas/mis-puntos/mis-puntos.component';
import { CrearPuntoComponent } from './paginas/crear-punto/crear-punto.component';
import { JuegoComponent } from './paginas/juego/juego.component';
import { JuegoSeleccionadoActivoComponent } from './paginas/juego-seleccionado-activo/juego-seleccionado-activo.component';
// tslint:disable-next-line:max-line-length
import { AsignarPuntosComponent } from './paginas/juego-seleccionado-activo/juego-de-puntos-seleccionado-activo/asignar-puntos/asignar-puntos.component';
// tslint:disable-next-line:max-line-length
import { AlumnoSeleccionadoJuegoDePuntosComponent } from './paginas/juego-seleccionado-activo/juego-de-puntos-seleccionado-activo/alumno-seleccionado-juego-de-puntos/alumno-seleccionado-juego-de-puntos.component';
import { CrearColeccionComponent } from './paginas/crear-coleccion/crear-coleccion.component';
import { MisColeccionesComponent } from './paginas/mis-colecciones/mis-colecciones.component';
// tslint:disable-next-line:max-line-length
import { InformacionJuegoPuntosComponent } from './paginas/juego-seleccionado-activo/juego-de-puntos-seleccionado-activo/informacion-juego-puntos/informacion-juego-puntos.component';
// tslint:disable-next-line:max-line-length
import { EquipoSeleccionadoJuegoDePuntosComponent } from './paginas/juego-seleccionado-activo/juego-de-puntos-seleccionado-activo/equipo-seleccionado-juego-de-puntos/equipo-seleccionado-juego-de-puntos.component';
import { JuegoSeleccionadoInactivoComponent } from './paginas/juego-seleccionado-inactivo/juego-seleccionado-inactivo.component';
import { EditarPuntoComponent } from './paginas/mis-puntos/editar-punto/editar-punto.component';
import { EditarInsigniaComponent } from './paginas/mis-puntos/editar-insignia/editar-insignia.component';
import { EditarColeccionComponent } from './paginas/mis-colecciones/editar-coleccion/editar-coleccion.component';
// tslint:disable-next-line:max-line-length
import { AsignarCromosComponent } from './paginas/juego-seleccionado-activo/juego-de-coleccion-seleccionado-activo/asignar-cromos/asignar-cromos.component';
// tslint:disable-next-line:max-line-length
import { InformacionJuegoColeccionComponent } from './paginas/juego-seleccionado-activo/juego-de-coleccion-seleccionado-activo/informacion-juego-coleccion/informacion-juego-coleccion.component';

// tslint:disable-next-line:max-line-length
import { AlumnoSeleccionadoJuegoDeColeccionComponent } from './paginas/juego-seleccionado-activo/juego-de-coleccion-seleccionado-activo/alumno-seleccionado-juego-de-coleccion/alumno-seleccionado-juego-de-coleccion.component';
// tslint:disable-next-line:max-line-length
import { EquipoSeleccionadoJuegoDeColeccionComponent } from './paginas/juego-seleccionado-activo/juego-de-coleccion-seleccionado-activo/equipo-seleccionado-juego-de-coleccion/equipo-seleccionado-juego-de-coleccion.component';
import { PasarListaComponent } from './paginas/pasar-lista/pasar-lista.component';
// tslint:disable-next-line:max-line-length
import { AlbumDelAlumnoComponent } from './paginas/juego-seleccionado-activo/juego-de-coleccion-seleccionado-activo/alumno-seleccionado-juego-de-coleccion/album-del-alumno/album-del-alumno.component';
// tslint:disable-next-line:max-line-length
import { AlbumEquipoComponent } from './paginas/juego-seleccionado-activo/juego-de-coleccion-seleccionado-activo/equipo-seleccionado-juego-de-coleccion/album-equipo/album-equipo.component';
import { ConfiguracionProfesorComponent } from './paginas/COMPARTIDO/configuracion-profesor/configuracion-profesor.component';
import {MisAlumnosComponent} from './paginas/mis-alumnos/mis-alumnos.component';
import {IntroducirAlumnosComponent} from './paginas/introducir-alumnos/introducir-alumnos.component';


// JUEGO DE COMPETICIÓN
// tslint:disable-next-line:max-line-length
import { InformacionJuegoDeCompeticionComponent } from './paginas/juego-seleccionado-activo/juego-de-competicion-seleccionado-activo/informacion-juego-de-competicion/informacion-juego-de-competicion.component';
// tslint:disable-next-line:max-line-length
import { EditarJornadasJuegoDeCompeticionComponent } from './paginas/juego-seleccionado-activo/juego-de-competicion-seleccionado-activo/editar-jornadas-juego-de-competicion/editar-jornadas-juego-de-competicion.component';
// tslint:disable-next-line:max-line-length
import { AlumnosSeleccionadoJuegoDeCompeticionLigaComponent } from './paginas/juego-seleccionado-activo/juego-de-competicion-seleccionado-activo/alumnos-seleccionado-juego-de-competicion-liga/alumnos-seleccionado-juego-de-competicion-liga.component';

// tslint:disable-next-line:max-line-length
import { GanadorJuegoDeCompeticionLigaComponent } from './paginas/juego-seleccionado-activo/juego-de-competicion-seleccionado-activo/ganador-juego-de-competicion-liga/ganador-juego-de-competicion-liga.component';

import { AppComponent } from './app.component';
import { ElementosComponent } from './elementos/elementos.component';
import { DesarrolladoresComponent } from './desarrolladores/desarrolladores.component';
import {EstilosComponent} from './estilos/estilos.component';
import { DeactivateGuardCrearGrupo } from './guardas/canExitCrearGrupo.guard';
import { DeactivateGuardCrearColeccion } from './guardas/canExitCrearColeccion.guard';
import { DeactivateGuardCrearJuego } from './guardas/canExitCrearJuego.guard';

const routes: Routes = [


  // LOGIN
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },


  ////////////////////////////// RUTAS DESDE EL INICIO A LOS COMPONENTES PRINCIPALES DEL NAVBAR ////////////////////


  // CLASSPIP
  { path: 'aboutClasspip', component: AboutClasspipComponent },

  // INICIO
  { path: 'inicio/:id', component: InicioComponent },

  { path: 'inicio/:id/desarrolladores', component: DesarrolladoresComponent },
  { path: 'inicio/:id/estilos', component: EstilosComponent },

  // GRUPOS
  //  La página de crear grupos tiene una guarda para que no pueda abandonarse
  // a menos que el usuario lo confirme
  // Hay que evitar que se abandone a medias el proceso de creación de un grupo
  { path: 'inicio/:id/crearGrupo', component: CrearGrupoComponent, canDeactivate: [DeactivateGuardCrearGrupo] },
  // { path: 'inicio/:id/crearGrupo', component: CrearGrupoComponent},

  { path: 'inicio/:id/misGrupos', component: MisGruposComponent },




  // COLECCIÓN
  { path: 'inicio/:id/crearColeccion', component: CrearColeccionComponent, canDeactivate: [DeactivateGuardCrearColeccion] },
  { path: 'inicio/:id/misColecciones', component: MisColeccionesComponent },

  // PUNTOS INSIGNIAS
  { path: 'inicio/:id/crearPuntos', component: CrearPuntoComponent },
  { path: 'inicio/:id/misPuntos', component: MisPuntosComponent },

   // ALUMNNOS
   { path: 'inicio/:id/misAlumnos', component: MisAlumnosComponent },
   { path: 'inicio/:id/introducirAlumnos', component: IntroducirAlumnosComponent },


  //////////////////////////// RUTAS RELACIONADAS CON COMPONENTES PRINCIPALES /////////////////////////////////////////



  // GRUPOS
  { path: 'grupo/:id', component: GrupoComponent },
  { path: 'grupo/:id/editarGrupo', component: EditarGrupoComponent },

  // GRUPOS --> PASAR LISTA
  { path: 'grupo/:id/pasarLista', component: PasarListaComponent },

  // GRUPOS --> EQUIPOS
  { path: 'grupo/:id/equiposGrupo', component: EquiposComponent },
  { path: 'grupo/:id/equiposGrupo/editarEquipo', component: EditarEquipoComponent },


  // GRUPOS --> JUEGOS
  { path: 'grupo/:id/juegos', component: JuegoComponent, canDeactivate: [DeactivateGuardCrearJuego] },
  { path: 'grupo/:id/juegos/juegoSeleccionadoActivo', component: JuegoSeleccionadoActivoComponent },
  { path: 'grupo/:id/juegos/juegoSeleccionadoInactivo', component: JuegoSeleccionadoInactivoComponent },

  // GRUPOS --> JUEGOS --> JUEGO DE PUNTOS
  { path: 'grupo/:id/juegos/juegoSeleccionadoActivo/asignarPuntos', component: AsignarPuntosComponent },
  { path: 'grupo/:id/juegos/juegoSeleccionadoActivo/informacionAlumnoJuego', component: AlumnoSeleccionadoJuegoDePuntosComponent },
  { path: 'grupo/:id/juegos/juegoSeleccionadoActivo/informacionJuego', component: InformacionJuegoPuntosComponent },
  { path: 'grupo/:id/juegos/juegoSeleccionadoActivo/informacionEquipoJuego', component: EquipoSeleccionadoJuegoDePuntosComponent },
  { path: 'grupo/:id/juegos/juegoSeleccionadoInactivo/informacionJuego', component: InformacionJuegoPuntosComponent },
  { path: 'grupo/:id/juegos/juegoSeleccionadoInactivo/informacionAlumnoJuego', component: AlumnoSeleccionadoJuegoDePuntosComponent },
  { path: 'grupo/:id/juegos/juegoSeleccionadoInactivo/informacionEquipoJuego', component: EquipoSeleccionadoJuegoDePuntosComponent },

  // GRUPOS --> JUEGOS --> JUEGO DE COLECCIÓN
  { path: 'grupo/:id/juegos/juegoSeleccionadoActivo/asignarCromos', component: AsignarCromosComponent },
  { path: 'grupo/:id/juegos/juegoSeleccionadoActivo/informacionJuegoColeccion', component: InformacionJuegoColeccionComponent },
  // tslint:disable-next-line:max-line-length
  { path: 'grupo/:id/juegos/juegoSeleccionadoActivo/informacionAlumnoJuegoColeccion', component: AlumnoSeleccionadoJuegoDeColeccionComponent },
  // tslint:disable-next-line:max-line-length
  { path: 'grupo/:id/juegos/juegoSeleccionadoActivo/informacionEquipoJuegoColeccion', component: EquipoSeleccionadoJuegoDeColeccionComponent },
  { path: 'grupo/:id/juegos/juegoSeleccionadoActivo/informacionAlumnoJuegoColeccion/Album', component: AlbumDelAlumnoComponent },
  { path: 'grupo/:id/juegos/juegoSeleccionadoActivo/informacionEquipoJuegoColeccion/AlbumEquipo', component: AlbumEquipoComponent },
  { path: 'grupo/:id/juegos/juegoSeleccionadoInactivo/informacionJuegoColeccion', component: InformacionJuegoColeccionComponent },
  // tslint:disable-next-line:max-line-length
  { path: 'grupo/:id/juegos/juegoSeleccionadoInactivo/informacionAlumnoJuegoColeccion', component: AlumnoSeleccionadoJuegoDeColeccionComponent },
  // tslint:disable-next-line:max-line-length
  { path: 'grupo/:id/juegos/juegoSeleccionadoInactivo/informacionEquipoJuegoColeccion', component: EquipoSeleccionadoJuegoDeColeccionComponent },
  { path: 'grupo/:id/juegos/juegoSeleccionadoInactivo/informacionAlumnoJuegoColeccion/Album', component: AlbumDelAlumnoComponent },
  { path: 'grupo/:id/juegos/juegoSeleccionadoInactivo/informacionEquipoJuegoColeccion/AlbumEquipo', component: AlbumEquipoComponent },


  // GRUPOS --> JUEGOS --> JUEGO DE COMPETICIÓN
  { path: 'grupo/:id/juegos/juegoSeleccionadoActivo/informacionJuegoDeCompeticion', component: InformacionJuegoDeCompeticionComponent },
  // tslint:disable-next-line:max-line-length
  { path: 'grupo/:id/juegos/juegoSeleccionadoActivo/editarjornadasJuegoDeCompeticion', component: EditarJornadasJuegoDeCompeticionComponent },
  // tslint:disable-next-line:max-line-length
  { path: 'grupo/:id/juegos/juegoSeleccionadoActivo/informacionAlumnoJuegoCompeticionLiga', component: AlumnosSeleccionadoJuegoDeCompeticionLigaComponent },
  // tslint:disable-next-line:max-line-length
  {path: 'grupo/:id/juegos/juegoSeleccionadoActivo/seleccionarGanadorJuegoDeCompeticionLiga', component: GanadorJuegoDeCompeticionLigaComponent},

  // COLECCIÓN
  { path: 'inicio/:id/misColecciones/editarColeccion', component: EditarColeccionComponent },



  // PUNTOS E INSIGNIAS
  { path: 'inicio/:id/misPuntos/editarPunto', component: EditarPuntoComponent },
  { path: 'inicio/:id/misPuntos/editarInsignia', component: EditarInsigniaComponent },

  // CONFIGURACION
  { path: 'inicio/:id/configuracionProfesor', component: ConfiguracionProfesorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [DeactivateGuardCrearGrupo, DeactivateGuardCrearColeccion, DeactivateGuardCrearJuego],
  exports: [RouterModule]
})
export class AppRoutingModule { }

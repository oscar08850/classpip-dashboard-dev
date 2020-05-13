import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from '@angular/http';

// IMPORTs CONSULTA BASE DE DATOS
import { HttpClientModule } from '@angular/common/http';

// IMPORTs DE ANGULAR MATERIAL
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatRadioModule } from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MdePopoverModule } from '@material-extended/mde';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDatepickerModule, MatNativeDateModule } from '@angular/material';




// IMPORTs COMPONENTES
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './paginas/login/login.component';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { CrearGrupoComponent } from './paginas/crear-grupo/crear-grupo.component';
import { MisGruposComponent } from './paginas/mis-grupos/mis-grupos.component';
import { GrupoComponent } from './paginas/grupo/grupo.component';
import { AgregarAlumnoDialogComponent } from './paginas/crear-grupo/agregar-alumno-dialog/agregar-alumno-dialog.component';
import { EditarGrupoComponent } from './paginas/editar-grupo/editar-grupo.component';
import { EquiposComponent } from './paginas/equipos/equipos.component';
import { EditarEquipoComponent } from './paginas/equipos/editar-equipo/editar-equipo.component';
import { AgregarAlumnoEquipoComponent } from './paginas/equipos/agregar-alumno-equipo/agregar-alumno-equipo.component';
import { MoverAlumnoComponent } from './paginas/equipos/editar-equipo/mover-alumno/mover-alumno.component';
import { AboutClasspipComponent } from './paginas/about-classpip/about-classpip.component';
import { MisPuntosComponent } from './paginas/mis-puntos/mis-puntos.component';
import { CrearPuntoComponent } from './paginas/crear-punto/crear-punto.component';
import { JuegoComponent } from './paginas/juego/juego.component';
import { JuegoSeleccionadoActivoComponent } from './paginas/juego-seleccionado-activo/juego-seleccionado-activo.component';
import { AsignacionPuntoJuegoComponent } from './paginas/juego/asignacion-punto-juego/asignacion-punto-juego.component';
import { CrearNivelComponent } from './paginas/juego/crear-nivel/crear-nivel.component';
// tslint:disable-next-line:max-line-length
import { JuegoDePuntosSeleccionadoActivoComponent } from './paginas/juego-seleccionado-activo/juego-de-puntos-seleccionado-activo/juego-de-puntos-seleccionado-activo.component';
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
// tslint:disable-next-line:max-line-length
import { JuegoDePuntosSeleccionadoInactivoComponent } from './paginas/juego-seleccionado-inactivo/juego-de-puntos-seleccionado-inactivo/juego-de-puntos-seleccionado-inactivo.component';
import { EditarPuntoComponent } from './paginas/mis-puntos/editar-punto/editar-punto.component';
import { EditarInsigniaComponent } from './paginas/mis-puntos/editar-insignia/editar-insignia.component';
import { EditarColeccionComponent } from './paginas/mis-colecciones/editar-coleccion/editar-coleccion.component';
import { AgregarCromoDialogComponent } from './paginas/mis-colecciones/agregar-cromo-dialog/agregar-cromo-dialog.component';
import { AsignacionColeccionJuegoComponent } from './paginas/juego/asignacion-coleccion-juego/asignacion-coleccion-juego.component';
// tslint:disable-next-line:max-line-length
import { DialogMostrarCromosComponent } from './paginas/juego/asignacion-coleccion-juego/dialog-mostrar-cromos/dialog-mostrar-cromos.component';
// tslint:disable-next-line:max-line-length
import { JuegoDeColeccionSeleccionadoActivoComponent } from './paginas/juego-seleccionado-activo/juego-de-coleccion-seleccionado-activo/juego-de-coleccion-seleccionado-activo.component';
// tslint:disable-next-line:max-line-length
import { AsignarCromosComponent } from './paginas/juego-seleccionado-activo/juego-de-coleccion-seleccionado-activo/asignar-cromos/asignar-cromos.component';
// tslint:disable-next-line:max-line-length
import { InformacionJuegoColeccionComponent } from './paginas/juego-seleccionado-activo/juego-de-coleccion-seleccionado-activo/informacion-juego-coleccion/informacion-juego-coleccion.component';
// tslint:disable-next-line:max-line-length
import { AlumnoSeleccionadoJuegoDeColeccionComponent } from './paginas/juego-seleccionado-activo/juego-de-coleccion-seleccionado-activo/alumno-seleccionado-juego-de-coleccion/alumno-seleccionado-juego-de-coleccion.component';
// tslint:disable-next-line:max-line-length
import { EquipoSeleccionadoJuegoDeColeccionComponent } from './paginas/juego-seleccionado-activo/juego-de-coleccion-seleccionado-activo/equipo-seleccionado-juego-de-coleccion/equipo-seleccionado-juego-de-coleccion.component';
import { SesionesClaseComponent } from './paginas/sesiones-clase/sesiones-clase.component';
// tslint:disable-next-line:max-line-length
import { AlbumDelAlumnoComponent } from './paginas/juego-seleccionado-activo/juego-de-coleccion-seleccionado-activo/alumno-seleccionado-juego-de-coleccion/album-del-alumno/album-del-alumno.component';
// tslint:disable-next-line:max-line-length
import { AlbumEquipoComponent } from './paginas/juego-seleccionado-activo/juego-de-coleccion-seleccionado-activo/equipo-seleccionado-juego-de-coleccion/album-equipo/album-equipo.component';
import { ConfiguracionProfesorComponent } from './paginas/COMPARTIDO/configuracion-profesor/configuracion-profesor.component';
import { FooterComponent } from './paginas/COMPARTIDO/footer/footer.component';
// tslint:disable-next-line:max-line-length
import { JuegoDeColeccionSeleccionadoInactivoComponent } from './paginas/juego-seleccionado-inactivo/juego-de-coleccion-seleccionado-inactivo/juego-de-coleccion-seleccionado-inactivo.component';

// tslint:disable-next-line:max-line-length
import { JuegoDeCompeticionSeleccionadoActivoComponent } from './paginas/juego-seleccionado-activo/juego-de-competicion-seleccionado-activo/juego-de-competicion-seleccionado-activo.component';
// tslint:disable-next-line:max-line-length
import { JuegoDeCompeticionSeleccionadoInactivoComponent } from './paginas/juego-seleccionado-inactivo/juego-de-competicion-seleccionado-inactivo/juego-de-competicion-seleccionado-inactivo.component';
// tslint:disable-next-line:max-line-length
import { InformacionJuegoDeCompeticionComponent } from './paginas/juego-seleccionado-activo/juego-de-competicion-seleccionado-activo/informacion-juego-de-competicion/informacion-juego-de-competicion.component';
// tslint:disable-next-line:max-line-length
import { InformacionJuegoDeCompeticionInactivoComponent } from './paginas/juego-seleccionado-inactivo/juego-de-competicion-seleccionado-inactivo/informacion-juego-de-competicion-inactivo/informacion-juego-de-competicion-inactivo.component';
// tslint:disable-next-line:max-line-length
import { EditarJornadasJuegoDeCompeticionComponent } from './paginas/juego-seleccionado-activo/juego-de-competicion-seleccionado-activo/editar-jornadas-juego-de-competicion/editar-jornadas-juego-de-competicion.component';
// tslint:disable-next-line:max-line-length
import { GanadorJuegoDeCompeticionLigaComponent } from './paginas/juego-seleccionado-activo/juego-de-competicion-seleccionado-activo/ganador-juego-de-competicion-liga/ganador-juego-de-competicion-liga.component';
// tslint:disable-next-line:max-line-length
import { JuegoDeCompeticionFormulaUnoSeleccionadoActivoComponent } from './paginas/juego-seleccionado-activo/juego-de-competicion-formula-uno-seleccionado-activo/juego-formula-uno-seleccionado-activo.component';
// tslint:disable-next-line:max-line-length
import { JuegoDeCompeticionFormulaUnoSeleccionadoInactivoComponent } from './paginas/juego-seleccionado-inactivo/juego-de-competicion-formula-uno-seleccionado-inactivo/juego-formula-uno-seleccionado-inactivo.component';
// tslint:disable-next-line:max-line-length
import { InformacionJuegoDeCompeticionFormulaUnoComponent } from './paginas/juego-seleccionado-activo/juego-de-competicion-formula-uno-seleccionado-activo/informacion-juego-formula-uno/informacion-juego-formula-uno.component';
// tslint:disable-next-line:max-line-length
import { InformacionJuegoDeCompeticionFormulaUnoInactivoComponent } from './paginas/juego-seleccionado-inactivo/juego-de-competicion-formula-uno-seleccionado-inactivo/informacion-juego-formula-uno-inactivo/informacion-juego-formula-uno-inactivo.component';
// tslint:disable-next-line:max-line-length
import { GanadoresJuegoDeCompeticionFormulaUnoComponent } from './paginas/juego-seleccionado-activo/juego-de-competicion-formula-uno-seleccionado-activo/ganadores-juego-formula-uno/ganadores-juego-formula-uno.component';
// tslint:disable-next-line:max-line-length
import { EditarJornadasJuegoDeCompeticionFormulaUnoComponent } from './paginas/juego-seleccionado-activo/juego-de-competicion-formula-uno-seleccionado-activo/editar-jornadas-juego-formula-uno/editar-jornadas-juego-formula-uno.component';
// tslint:disable-next-line:max-line-length
import { EditarPuntosJuegoDeCompeticionFormulaUnoComponent } from './paginas/juego-seleccionado-activo/juego-de-competicion-formula-uno-seleccionado-activo/editar-puntos-juego-formula-uno/editar-puntos-juego-formula-uno.component';

// COMPONENTES EN COMPARTIDO
import { DialogoConfirmacionComponent } from './paginas/COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { NavbarComponent } from './paginas/COMPARTIDO/navbar/navbar.component';
import { ElementosComponent } from './elementos/elementos.component';
import { DesarrolladoresComponent } from './desarrolladores/desarrolladores.component';
import { DialogoComponent } from './desarrolladores/dialogo/dialogo.component';
import { EstilosComponent } from './estilos/estilos.component';

// tslint:disable-next-line:max-line-length
import { AlumnosSeleccionadoJuegoDeCompeticionLigaComponent } from './paginas/juego-seleccionado-activo/juego-de-competicion-seleccionado-activo/alumnos-seleccionado-juego-de-competicion-liga/alumnos-seleccionado-juego-de-competicion-liga.component';

import { EditarCromoDialogComponent } from './paginas/mis-colecciones/editar-cromo-dialog/editar-cromo-dialog.component';
import { MisAlumnosComponent } from './paginas/mis-alumnos/mis-alumnos.component';
import { IntroducirAlumnosComponent} from './paginas/introducir-alumnos/introducir-alumnos.component';

import { DateAdapter } from '@angular/material';
import { CustomDateAdapter } from './CustomDataAdapter';

import { PreguntaComponent } from './paginas/pregunta/pregunta.component';
import { CrearCuestionarioComponent } from './paginas/crear-cuestionario/crear-cuestionario.component';
import { AgregarPreguntasDialogComponent } from './paginas/crear-cuestionario/agregar-preguntas-dialog/agregar-preguntas-dialog.component';
import { MisPreguntasComponent } from './paginas/mis-preguntas/mis-preguntas.component';
import { MisCuestionariosComponent } from './paginas/mis-cuestionarios/mis-cuestionarios.component';
import { EditarPreguntaDialogComponent } from './paginas/mis-preguntas/editar-pregunta-dialog/editar-pregunta-dialog.component';
import { EditarCuestionarioComponent } from './paginas/editar-cuestionario/editar-cuestionario.component';
import { AsignaCuestionarioComponent } from './paginas/juego/asigna-cuestionario/asigna-cuestionario.component';
import { JuegoDeCuestionarioSeleccionadoInactivoComponent } from './paginas/juego-seleccionado-inactivo/juego-de-cuestionario-seleccionado-inactivo/juego-de-cuestionario-seleccionado-inactivo.component';
import { JuegoDeCuestionarioSeleccionadoActivoComponent } from './paginas/juego-seleccionado-activo/juego-de-cuestionario-seleccionado-activo/juego-de-cuestionario-seleccionado-activo.component';
import { InformacionJuegoDeCuestionarioDialogComponent } from './paginas/juego-seleccionado-activo/juego-de-cuestionario-seleccionado-activo/informacion-juego-de-cuestionario-dialog/informacion-juego-de-cuestionario-dialog.component';
import { JuegoSeleccionadoPreparadoComponent } from './paginas/juego-seleccionado-preparado/juego-seleccionado-preparado.component';
// tslint:disable-next-line:max-line-length
import { JuegoDeCuestionarioSeleccionadoPreparadoComponent } from './paginas/juego-seleccionado-preparado/juego-de-cuestionario-seleccionado-preparado/juego-de-cuestionario-seleccionado-preparado.component';

// para el uso de graficos
import { NgxEchartsModule } from 'ngx-echarts';


import { CrearEscenarioComponent } from './paginas/crear-escenario/crear-escenario.component';
import { MisEscenariosComponent } from './paginas/mis-escenarios/mis-escenarios.component';
import { EditarPuntoGeolocalizableDialogComponent } from './paginas/mis-escenarios/editar-puntogeolocalizable-dialog/editar-puntogeolocalizable-dialog.component';
import { AgregarPuntoGeolocalizableDialogComponent } from './paginas/mis-escenarios/agregar-puntogeolocalizable-dialog/agregar-puntogeolocalizable-dialog.component';
import { EditarEscenarioComponent } from './paginas/mis-escenarios/editar-escenario/editar-escenario.component';

// avatares
import { MisFamiliasAvataresComponent } from './paginas/mis-familias-avatares/mis-familias-avatares.component';
import { CrearFamiliaAvataresComponent } from './paginas/crear-familia-avatares/crear-familia-avatares.component';
// tslint:disable-next-line:max-line-length
import { AsignarFamiliasJuegoAvataresComponent } from './paginas/juego/asignar-familias-juego-avatares/asignar-familias-juego-avatares.component';
// tslint:disable-next-line:max-line-length
import { JuegoDeAvatarSeleccionadoActivoComponent } from './paginas/juego-seleccionado-activo/juego-de-avatar-seleccionado-activo/juego-de-avatar-seleccionado-activo.component';
// tslint:disable-next-line:max-line-length
import { MostrarAvatarAlumnoComponent } from './paginas/juego-seleccionado-activo/juego-de-avatar-seleccionado-activo/mostrar-avatar-alumno/mostrar-avatar-alumno.component';
// tslint:disable-next-line:max-line-length
import { InformacionJuegoAvatarComponent } from './paginas/juego-seleccionado-activo/juego-de-avatar-seleccionado-activo/informacion-juego-avatar/informacion-juego-avatar.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InicioComponent,
    CrearGrupoComponent,
    MisGruposComponent,
    GrupoComponent,
    AgregarAlumnoDialogComponent,
    EditarGrupoComponent,
    EquiposComponent,
    EditarEquipoComponent,
    AgregarAlumnoEquipoComponent,
    DialogoConfirmacionComponent,
    MoverAlumnoComponent,
    NavbarComponent,
    AboutClasspipComponent,
    MisPuntosComponent,
    CrearPuntoComponent,
    JuegoComponent,
    JuegoSeleccionadoActivoComponent,
    AsignacionPuntoJuegoComponent,
    CrearNivelComponent,
    AsignarPuntosComponent,
    JuegoDePuntosSeleccionadoActivoComponent,
    AlumnoSeleccionadoJuegoDePuntosComponent,
    CrearColeccionComponent,
    MisColeccionesComponent,
    InformacionJuegoPuntosComponent,
    EquipoSeleccionadoJuegoDePuntosComponent,
    JuegoSeleccionadoInactivoComponent,
    JuegoDePuntosSeleccionadoInactivoComponent,
    EditarPuntoComponent,
    EditarInsigniaComponent,
    EditarColeccionComponent,
    AgregarCromoDialogComponent,
    AsignacionColeccionJuegoComponent,
    DialogMostrarCromosComponent,
    JuegoDeColeccionSeleccionadoActivoComponent,
    AsignarCromosComponent,
    InformacionJuegoColeccionComponent,
    AlumnoSeleccionadoJuegoDeColeccionComponent,
    EquipoSeleccionadoJuegoDeColeccionComponent,
    SesionesClaseComponent,
    AlbumDelAlumnoComponent,
    AlbumEquipoComponent,
    ConfiguracionProfesorComponent,
    FooterComponent,
    JuegoDeColeccionSeleccionadoInactivoComponent,
    ElementosComponent,
    DesarrolladoresComponent,
    DialogoComponent,
    EstilosComponent,

    JuegoDeCompeticionSeleccionadoActivoComponent,
    JuegoDeCompeticionSeleccionadoInactivoComponent,
    InformacionJuegoDeCompeticionComponent,
    EditarJornadasJuegoDeCompeticionComponent,
    AlumnosSeleccionadoJuegoDeCompeticionLigaComponent,
    InformacionJuegoDeCompeticionInactivoComponent,

    EditarCromoDialogComponent,
    MisAlumnosComponent,
    IntroducirAlumnosComponent,

    PreguntaComponent,
    CrearCuestionarioComponent,
    AgregarPreguntasDialogComponent,
    MisPreguntasComponent,
    MisCuestionariosComponent,
    EditarPreguntaDialogComponent,
    EditarCuestionarioComponent,
    AsignaCuestionarioComponent,

    GanadorJuegoDeCompeticionLigaComponent,
    JuegoDeCompeticionFormulaUnoSeleccionadoActivoComponent,
    InformacionJuegoDeCompeticionFormulaUnoComponent,
    GanadoresJuegoDeCompeticionFormulaUnoComponent,
    EditarJornadasJuegoDeCompeticionFormulaUnoComponent,
    EditarPuntosJuegoDeCompeticionFormulaUnoComponent,
    InformacionJuegoDeCompeticionFormulaUnoInactivoComponent,
    JuegoDeCompeticionFormulaUnoSeleccionadoInactivoComponent,

    CrearEscenarioComponent,
    MisEscenariosComponent,
    EditarPuntoGeolocalizableDialogComponent,
    AgregarPuntoGeolocalizableDialogComponent,
    EditarEscenarioComponent,
    
    MisFamiliasAvataresComponent,
    CrearFamiliaAvataresComponent,
    AsignarFamiliasJuegoAvataresComponent,
    JuegoDeAvatarSeleccionadoActivoComponent,
    MostrarAvatarAlumnoComponent,
    InformacionJuegoAvatarComponent,
    JuegoDeCuestionarioSeleccionadoInactivoComponent,
    JuegoDeCuestionarioSeleccionadoActivoComponent,
    InformacionJuegoDeCuestionarioDialogComponent,
    JuegoSeleccionadoPreparadoComponent,
    JuegoDeCuestionarioSeleccionadoPreparadoComponent



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpModule,

    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatChipsModule,
    MatCardModule,
    MatMenuModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatExpansionModule,
    MatTooltipModule,
    MatTableModule,
    MatListModule,
    MatIconModule,
    MatDialogModule,
    MatDividerModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatGridListModule,
    MdePopoverModule,
    MatSortModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,

    HttpClientModule,

    NgxEchartsModule
  ],
  // INCLUIR DIÁLOGOS AQUI ADEMÁS DE ARRIBA
  entryComponents: [AgregarAlumnoDialogComponent, AgregarPreguntasDialogComponent, DialogMostrarCromosComponent,
    AgregarAlumnoEquipoComponent, DialogoConfirmacionComponent, MoverAlumnoComponent, AgregarCromoDialogComponent,
    EditarCromoDialogComponent, DialogoComponent, EditarPreguntaDialogComponent, AgregarPuntoGeolocalizableDialogComponent, EditarPuntoGeolocalizableDialogComponent, AsignaCuestionarioComponent,
    InformacionJuegoDeCuestionarioDialogComponent]
  bootstrap: [AppComponent],
  providers: [
    {
        provide: DateAdapter, useClass: CustomDateAdapter
    }
  ]


})
export class AppModule { }

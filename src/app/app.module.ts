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
import { MatInputModule } from '@angular/material';
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
import { EditarCromoComponent } from './paginas/mis-colecciones/editar-coleccion/editar-cromo/editar-cromo.component';
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
import { PasarListaComponent } from './paginas/pasar-lista/pasar-lista.component';
// tslint:disable-next-line:max-line-length
import { AlbumDelAlumnoComponent } from './paginas/juego-seleccionado-activo/juego-de-coleccion-seleccionado-activo/alumno-seleccionado-juego-de-coleccion/album-del-alumno/album-del-alumno.component';
// tslint:disable-next-line:max-line-length
import { AlbumEquipoComponent } from './paginas/juego-seleccionado-activo/juego-de-coleccion-seleccionado-activo/equipo-seleccionado-juego-de-coleccion/album-equipo/album-equipo.component';
import { ConfiguracionProfesorComponent } from './paginas/COMPARTIDO/configuracion-profesor/configuracion-profesor.component';
import { FooterComponent } from './paginas/COMPARTIDO/footer/footer.component';
// tslint:disable-next-line:max-line-length
import { JuegoDeColeccionSeleccionadoInactivoComponent } from './paginas/juego-seleccionado-inactivo/juego-de-coleccion-seleccionado-inactivo/juego-de-coleccion-seleccionado-inactivo.component';


// COMPONENTES EN COMPARTIDO
import { DialogoConfirmacionComponent } from './paginas/COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { NavbarComponent } from './paginas/COMPARTIDO/navbar/navbar.component';


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
    EditarCromoComponent,
    AsignacionColeccionJuegoComponent,
    DialogMostrarCromosComponent,
    JuegoDeColeccionSeleccionadoActivoComponent,
    AsignarCromosComponent,
    InformacionJuegoColeccionComponent,
    AlumnoSeleccionadoJuegoDeColeccionComponent,
    EquipoSeleccionadoJuegoDeColeccionComponent,
    PasarListaComponent,
    AlbumDelAlumnoComponent,
    AlbumEquipoComponent,
    ConfiguracionProfesorComponent,
    FooterComponent,
    JuegoDeColeccionSeleccionadoInactivoComponent
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

    HttpClientModule


  ],
  // INCLUIR DIÁLOGOS AQUI ADEMÁS DE ARRIBA
  entryComponents: [AgregarAlumnoDialogComponent, DialogMostrarCromosComponent,
    AgregarAlumnoEquipoComponent, DialogoConfirmacionComponent, MoverAlumnoComponent, AgregarCromoDialogComponent ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

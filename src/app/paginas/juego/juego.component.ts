import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatTabGroup } from '@angular/material';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Clases
// tslint:disable-next-line:max-line-length
// import {  Nivel, Alumno, Equipo, Juego, JuegoDeCompeticion, Punto, TablaPuntosFormulaUno,
//           AlumnoJuegoDePuntos, EquipoJuegoDePuntos, Grupo, AlumnoJuegoDeCompeticionLiga,
//           EquipoJuegoDeCompeticionLiga, Jornada, AlumnoJuegoDeCompeticionFormulaUno,
//           EquipoJuegoDeCompeticionFormulaUno, Cuestionario, JuegoDeAvatar, FamiliaAvatares,
//           AlumnoJuegoDeAvatar, AsignacionPuntosJuego, Coleccion, AlumnoJuegoDeColeccion,
//           EquipoJuegoDeColeccion, Escenario, JuegoDeGeocaching, AlumnoJuegoDeGeocaching} from '../../clases/index';

          // tslint:disable-next-line:max-line-length
import {  Nivel, Alumno, Equipo, Juego, JuegoDeCompeticion, Punto, TablaPuntosFormulaUno,

          AlumnoJuegoDePuntos, EquipoJuegoDePuntos, Grupo, AlumnoJuegoDeCompeticionLiga,
          EquipoJuegoDeCompeticionLiga, Jornada, AlumnoJuegoDeCompeticionFormulaUno,
          EquipoJuegoDeCompeticionFormulaUno, Cuestionario, JuegoDeAvatar, FamiliaAvatares,
          AlumnoJuegoDeAvatar, AsignacionPuntosJuego, Coleccion, AlumnoJuegoDeColeccion,
          EquipoJuegoDeColeccion, Escenario, JuegoDeGeocaching, AlumnoJuegoDeGeocaching, PuntoGeolocalizable } from '../../clases/index';


// Services
import { SesionService, CalculosService, PeticionesAPIService } from '../../servicios/index';

import { Observable} from 'rxjs';
import { of } from 'rxjs';
import 'rxjs';

import { DialogoConfirmacionComponent } from '../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';

import { AsignaCuestionarioComponent } from './asigna-cuestionario/asigna-cuestionario.component';
import { JuegoDeCuestionario } from 'src/app/clases/JuegoDeCuestionario';
import { AlumnoJuegoDeCuestionario } from 'src/app/clases/AlumnoJuegoDeCuestionario';
import { Router } from '@angular/router';

import { AsignaEscenarioComponent } from './asigna-escenario/asigna-escenario.component';
import { AsignaPreguntasComponent } from './asigna-preguntas/asigna-preguntas.component';







export interface OpcionSeleccionada {
  nombre: string;
  id: string;
}

export interface ChipColor {
  nombre: string;
  color: ThemePalette;
}



@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.scss']
})

export class JuegoComponent implements OnInit {


  ///////////////////////////////////// VARIABLE GENERALES PARA EL COMPONENTE ///////////////////////////////////

  profesorId: number;
  grupo: Grupo;
  alumnosGrupo: Alumno[];
  equiposGrupo: Equipo[];
  @ViewChild('stepper') stepper;
  @ViewChild('tabs') tabGroup: MatTabGroup;

  // tslint:disable-next-line:ban-types
  juegoCreado: Boolean = false;

  // Usaré esta variable para determinar si debo advertir al usuario de
  // que está abandonando el proceso de creación del juego
  creandoJuego = false;

  juego: Juego;
  juegoDeCuestionario: JuegoDeCuestionario;
  juegoDeCompeticion: JuegoDeCompeticion;
  juegoDeAvatar: JuegoDeAvatar;
  juegoDeGeocaching: JuegoDeGeocaching;

  // Informacion para todos los juegos
  myForm: FormGroup;
  nombreDelJuego: string;
  tipoDeJuegoSeleccionado: string;
  modoDeJuegoSeleccionado: string;
  tengoNombre = false;
  tengoTipo = false;
  tengoModo = false;
  seleccionTipoJuego: ChipColor[] = [
    {nombre: 'Juego De Puntos', color: 'primary'},
    {nombre: 'Juego De Colección', color: 'accent'},
    {nombre: 'Juego De Competición', color: 'warn'},
    {nombre: 'Juego De Avatar', color: 'primary'},
    {nombre: 'Juego De Cuestionario', color: 'accent'},
    {nombre: 'Juego De Geocaching', color: 'warn'}
  ];
  seleccionModoJuego: ChipColor[] = [
    {nombre: 'Individual', color: 'primary'},
    {nombre: 'Equipos', color: 'accent'}
  ];


  // información para crear un juego de puntos
  puntosDelJuego: Punto[] = [];
  nivelesDelJuego: Nivel[] = [];
  logosNiveles: FormData[] = [];

  // información para crear un juego de colección
  coleccionSeleccionada: Coleccion;
  tengoColeccion = false;


  // información para crear un juego de cuestionario
  cuestionario: Cuestionario;
  tengoCuestionario = false;
  puntuacionCorrecta: number;
  puntuacionIncorrecta: number;
  modoPresentacion: string;
  tengoModoPresentacion = false;
  seleccionModoPresentacion: string[] = ['Mismo orden para todos',
  'Preguntas desordenadas',
  'Preguntas y respuestas desordenadas'];

  // información para crear juego de avatares
  familiasElegidas: number[];
  tengoFamilias = false;


  // Información para crear juego de competicion

  tipoDeCompeticionSeleccionado: string;
  seleccionTipoDeCompeticion: ChipColor[] = [
    {nombre: 'Liga', color: 'primary'},
    {nombre: 'Fórmula Uno', color: 'warn'},
    {nombre: 'Torneo', color: 'accent'}
  ];
  tengoTipoDeCompeticion = false;
  numeroDeJornadas: number;
  tengoNumeroDeJornadas = false;
  jornadasLiga: Jornada[];
  jornadasFormulaUno: Jornada[];

  nuevaPuntuacion: number;
  tengoNuevaPuntuacion = false;
  Puntuacion: number[] = [];
  selection = new SelectionModel<any>(true, []);
  dataSource: any;
  TablaPuntuacion: TablaPuntosFormulaUno[];
  displayedColumnsTablaPuntuacion: string[] = ['select', 'Posicion', 'Puntos'];

  // Informacion para juego de geocatching

 // escenario: Escenario;
  tengoEscenario = false;
 // puntosgeolocalizablesEscenario: PuntoGeolocalizable[];
  numeroDePuntosGeolocalizables: number;

  idescenario: number;
  PreguntasBasicas: number[];
  PreguntasBonus: number[];
  tengoPreguntas = false;

  puntuacionCorrectaGeo: number;
  puntuacionIncorrectaGeo: number;
  puntuacionCorrectaGeoBonus: number;
  puntuacionIncorrectaGeoBonus: number;

  // Informacion para juego de geocatching

  escenario: Escenario;
  tengoEscenario = false;
  puntosgeolocalizablesEscenario: PuntoGeolocalizable[];
  numeroDePuntosGeolocalizables: number;

  idescenario: number;
  PreguntasBasicas: number[];
  PreguntasBonus: number[];
  tengoPreguntas = false;

  puntuacionCorrectaGeo: number;
  puntuacionIncorrectaGeo: number;
  puntuacionCorrectaGeoBonus: number;
  puntuacionIncorrectaGeoBonus: number;

  final = false;

  // myForm1: FormGroup;
  // myForm2: FormGroup;
  // myFormPrivilegiosAvatar: FormGroup;


  // HACEMOS DOS LISTAS CON LOS JUEGOS ACTIVOS, INACTIVOS Y PREPARADOS
  // Lo logico seria que fuesen listas de tipo Juego, pero meteremos objetos
  // de varios tipos (por ejemplo, de tipo Juego y de tipo JuegoDeCuestionario)
  juegosActivos: any[];
  juegosInactivos: any[];
  juegosPreparados: any[];


  // tslint:disable-next-line:no-inferrable-types
  opcionSeleccionada: string = 'todosLosJuegos';


  // criterioComplemento1: string;

  //////////////////////////////////// PARÁMETROS PARA PÁGINA DE CREAR JUEGO //////////////////////////////////////
  // para leer el nombre
  // formNombre: FormGroup;


  // En el primer paso mostraremos tres Chips con las diferentes opciones de tipo de juego que podemos crear y su color


  // En el segundo paso mostraremos dos Chips con los dos modos de juego que podemos crear y su color


    // En el segundo paso mostraremos dos Chips con los dos modos de juego que podemos crear y su color

  // Recogemos la opción que seleccionemos en el primer (tipoDeJuegoSeleccionado) y en el segundo paso (modoDeJuegoSeleccionado)



  // NumeroDeVueltasValueInd: number;
  // NumeroDeVueltasValueEqu: number;

  // // Todo lo relacionado con juego de cuestionario
  // myFormPuntuacion: FormGroup;
  // PuntuacionCorrecta: number;
  // PuntuacionIncorrecta: number;


  // // tslint:disable-next-line:ban-types
  // DisabledCuestionario: Boolean = true;
  //  // tslint:disable-next-line:ban-types
  // DisabledPuntuacion: Boolean = true;
  //  // tslint:disable-next-line:ban-types
  // DisabledPresentacion: Boolean =  true;
  // juegoDeCuestionarioId: number;

  // // Tipos de presentacion para el juego de cuestionario

  // ModoPresentacionFavorito: string;
  // myFormPresentacion: FormGroup;

  // // Recogemos el tipo de presentacion para el juego de cuestionario
  // tipoDePresentacion: string;
  // //
  // tipoJuegoCompeticionSeleccionado: string;

  // // No nos permite avanzar si no se ha seleccionado una opción
  // // tslint:disable-next-line:ban-types
  // isDisabled: Boolean = true;
  // // tslint:disable-next-line:ban-types
  // isDisabledNombre: Boolean = true;
  // // tslint:disable-next-line:ban-types
  // isDisabledModo: Boolean = true;
  // // tslint:disable-next-line:ban-types
  // isDisabledExtra: Boolean = true;
  // // tslint:disable-next-line:ban-types
  // isDisabledTipoCompeticion: Boolean = true;
  // // tslint:disable-next-line:ban-types
  // isDisabledJornadas: Boolean = true;

  // tipoJuegoElegido: string;
  // nombreColeccionSeleccionada: string;
  // // tslint:disable-next-line:ban-types
  // finalizar: Boolean = false;

  // botonTablaDesactivado = true;
  // seleccionados: boolean[];

  // botonTablaDesactivadoJugadorExtra = true;



  constructor(
               public dialog: MatDialog,
               private calculos: CalculosService,
               private sesion: SesionService,
               private location: Location,
               private peticionesAPI: PeticionesAPIService,
               // tslint:disable-next-line:variable-name
               private _formBuilder: FormBuilder,
               private router: Router
               ) { }


  ngOnInit() {
    this.grupo = this.sesion.DameGrupo();
    console.log (' Grupo ' + this.grupo);
    this.alumnosGrupo = this.sesion.DameAlumnosGrupo();
    this.profesorId = this.sesion.DameProfesor().id;
    // La lista de equipos del grupo no esta en el servicio sesión. Asi que hay que
    // ir a buscarla
    this.peticionesAPI.DameEquiposDelGrupo(this.grupo.id)
    .subscribe(equipos => {
      if (equipos[0] !== undefined) {
        console.log('Hay equipos');
        this.equiposGrupo = equipos;
        console.log(this.equiposGrupo);
      } else {
        // mensaje al usuario
        console.log('Este grupo aun no tiene equipos');
        this.equiposGrupo = undefined;
      }
    });

    // Ahora traemos la lista de juegos
    // esta operacion es complicada. Por eso está en calculos
    this.calculos.DameListaJuegos(this.grupo.id)
    .subscribe ( listas => {
            console.log ('He recibido los juegos');
            console.log (listas);
            this.juegosActivos = listas.activos;
            // Si la lista aun esta vacia la dejo como indefinida para que me
            // salga el mensaje de que aun no hay juegos
            if (listas.activos[0] === undefined) {
              this.juegosActivos = undefined;
              console.log ('No hay inactivos');
            } else {
              this.juegosActivos = listas.activos;
              console.log ('hay activos');
            }
            if (listas.inactivos[0] === undefined) {
              this.juegosInactivos = undefined;
              console.log ('No hay inactivos');
            } else {
              this.juegosInactivos = listas.inactivos;
              console.log ('hay inactivos');
            }
            if (listas.preparados[0] === undefined) {
              this.juegosPreparados = undefined;
            } else {
              this.juegosPreparados = listas.preparados;
            }

    });
    // Es este formulario recogeremos la información que vaya introduciendo
    // el usuario segun el tipo de juego
    this.myForm = this._formBuilder.group({
      NombreDelJuego: ['', Validators.required],
      PuntuacionCorrecta: ['', Validators.required],
      PuntuacionIncorrecta: ['', Validators.required],
      NumeroDeJornadas: ['', Validators.required],
      criterioPrivilegioComplemento1: ['', Validators.required],
      criterioPrivilegioComplemento2: ['', Validators.required],
      criterioPrivilegioComplemento3: ['', Validators.required],
      criterioPrivilegioComplemento4: ['', Validators.required],
      criterioPrivilegioVoz: ['', Validators.required],
      criterioPrivilegioVerTodos: ['', Validators.required],
      NuevaPuntuacion: ['', Validators.required],
      PuntuacionCorrectaGeo: ['', Validators.required],
      PuntuacionIncorrectaGeo : ['', Validators.required],
      PuntuacionCorrectaGeoBonus: ['', Validators.required],
      PuntuacionIncorrectaGeoBonus: ['', Validators.required]
    });

    this.TablaPuntuacion = [];
    this.TablaPuntuacion[0] = new TablaPuntosFormulaUno(1, 10);
    this.dataSource = new MatTableDataSource (this.TablaPuntuacion);
    this.Puntuacion[0] = 10;
  }

  //////////////////////////////////////// FUNCIONES PARA LISTAR JUEGOS ///////////////////////////////////////////////


  // Busca la lista de juego de puntos y la clasifica entre activo e inactivo, y activa la función ListaJuegosDeColeccion

  // Función que usaremos para clicar en un juego y entrar en él,
  // Enviamos juego a la sesión
  JuegoSeleccionado(juego: Juego) {
    console.log ('**************guardo juego en la sesion');
    console.log (juego);
    this.sesion.TomaJuego(juego);
  }


  ///////////////////////////////////////// FUNCIONES PARA CREAR JUEGO ///////////////////////////////////////////////

  // RECUPERA LOS EQUIPOS DEL GRUPO
  TraeEquiposDelGrupo() {
    this.peticionesAPI.DameEquiposDelGrupo(this.grupo.id)
    .subscribe(equipos => {
      if (equipos[0] !== undefined) {
        console.log('Hay equipos');
        this.equiposGrupo = equipos;
        console.log(this.equiposGrupo);
      } else {
        // mensaje al usuario
        console.log('Este grupo aun no tiene equipos');
      }

    });
  }

  GuardaNombreDelJuego() {
    this.nombreDelJuego = this.myForm.value.NombreDelJuego;
    console.log ('Entro en guardar nombre');
    console.log (this.nombreDelJuego);
    if ( this.nombreDelJuego === undefined) {
      this.tengoNombre = false;
    } else {
      this.tengoNombre = true;
      this.creandoJuego = true; // empiezo el proceso de creacion del juego
      console.log ('tengo nombre ' + this.nombreDelJuego);
    }
  }


  TipoDeJuegoSeleccionado(tipo: ChipColor) {
    this.tipoDeJuegoSeleccionado = tipo.nombre;
    console.log(' tengo tipo ' + this.tipoDeJuegoSeleccionado);
    this.tengoTipo = true;
    // if (this.tipoDeJuegoSeleccionado === 'Juego De Competición') {
    //     this.NumeroDeVueltas();
    // }
  }


  // Recoge el modo de juego seleccionado y lo mete en la variable (modoDeJuegoSeleccionado), la cual se usará después
  // para el POST del juego
  ModoDeJuegoSeleccionado(modo: ChipColor) {
    this.modoDeJuegoSeleccionado = modo.nombre;
    console.log(' tengo modo ' + this.modoDeJuegoSeleccionado);
    console.log(' tengo tipo ' + this.tipoDeJuegoSeleccionado);
    if ((this.tipoDeJuegoSeleccionado === 'Juego De Cuestionario') && (this.modoDeJuegoSeleccionado === 'Equipos')) {
      Swal.fire('Alerta', 'Aún no es posible el juego de cuestionario en equipo', 'warning');
    } else if ((this.tipoDeJuegoSeleccionado === 'Juego De Avatares') && (this.modoDeJuegoSeleccionado === 'Equipos')) {
      Swal.fire('Alerta', 'Aún no es posible el juego de avatares en equipo', 'warning');
    } else {
      if (this.modoDeJuegoSeleccionado === 'Individual') {
        if (this.alumnosGrupo === undefined) {
          Swal.fire('Alerta', 'No hay ningún alumno en este grupo', 'warning');
          console.log('No Hay alumnos, no puedo crear el juego');
        } else {
          console.log('Hay alumnos, puedo crear');
          this.tengoModo = true;
        }

      } else {
        if (this.equiposGrupo === undefined) {
          Swal.fire('Alerta', 'No hay ningún equipo en este grupo', 'warning');
          console.log('No se puede crear juego pq no hay equipos');
        } else {
          this.tengoModo = true;
          console.log('Hay equipos, puedo crear');
        }
      }
    }
  }

  // FUNCIONES PARA LA CREACION DE JUEGO DE PUNTOS
  RecibeTiposDePuntos($event) {
    this.puntosDelJuego = $event;
    console.log ('ya tengo los puntos');
    console.log (this.puntosDelJuego);
  }

  RecibeNivel($event) {
    this.nivelesDelJuego.push ($event.n);
    if ($event.l !== undefined) {
      this.logosNiveles.push ($event.l);
    }
    console.log ('ya tengo los niveles');
    console.log (this.nivelesDelJuego);
    console.log (this.logosNiveles);
  }


  // Función que usaremos para crear un juego de puntos.

  CrearJuegoDePuntos() {
    // primero creamos el juego
    this.peticionesAPI.CreaJuegoDePuntos(new Juego (this.tipoDeJuegoSeleccionado, this.modoDeJuegoSeleccionado,
      undefined, undefined, undefined, undefined, undefined, undefined, this.nombreDelJuego), this.grupo.id)
    .subscribe(juegoCreado => {
      this.juego = juegoCreado;
      this.sesion.TomaJuego(this.juego);
      this.juegoCreado = true;
      // Ahora asignamos los puntos
      // tslint:disable-next-line:max-line-length
      this.puntosDelJuego.forEach (punto =>
        this.peticionesAPI.AsignaPuntoJuego(new AsignacionPuntosJuego(punto.id, this.juego.id))
        .subscribe()
      );
      // asignamos los niveles
      if (this.nivelesDelJuego !== undefined) {
        this.nivelesDelJuego.forEach (nivel =>
          this.peticionesAPI.CreaNivel(nivel, this.juego.id)
          .subscribe()
        );
        // Guardamos los logos de los niveles
        this.logosNiveles.forEach (logo =>
          this.peticionesAPI.PonImagenNivel(logo)
          .subscribe()
        );
      }

      // Inscribo los participantes en el juego
      if (this.modoDeJuegoSeleccionado === 'Individual') {
        console.log('Voy a inscribir a los alumnos del grupo 1');

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.alumnosGrupo.length; i++) {
          console.log(this.alumnosGrupo[i]);
          this.peticionesAPI.InscribeAlumnoJuegoDePuntos(new AlumnoJuegoDePuntos(this.alumnosGrupo[i].id, this.juego.id))
          .subscribe();
        }
      } else {
        console.log('Voy a inscribir los equipos del grupo');

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.equiposGrupo.length; i++) {
          console.log(this.equiposGrupo[i]);
          this.peticionesAPI.InscribeEquipoJuegoDePuntos(new EquipoJuegoDePuntos(this.equiposGrupo[i].id, this.juego.id))
          .subscribe();
        }
      }
      Swal.fire('Juego de puntos creado correctamente', ' ', 'success');

    // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
      if (this.juegosActivos === undefined) {
      // Si la lista aun no se ha creado no podre hacer el push
          this.juegosActivos = [];
      }
      this.juegosActivos.push (this.juego);
      this.Limpiar();
      // Regresamos a la lista de equipos (mat-tab con índice 0)
      this.tabGroup.selectedIndex = 0;
    });
  }

  /// FUNCIONES PARA LA CREACION DE JUEGO DE COLECCIÓN

    // Recibo el nombre de la colección elegida en el componente hijo
  RecibeColeccion($event) {
    this.coleccionSeleccionada = $event;
    this.tengoColeccion = true;
  }

  CrearJuegoDeColeccion() {
    this.peticionesAPI.CreaJuegoDeColeccion(new Juego (this.tipoDeJuegoSeleccionado, this.modoDeJuegoSeleccionado,
      this.coleccionSeleccionada.id, undefined, undefined, undefined, undefined, undefined, this.nombreDelJuego), this.grupo.id)
    .subscribe(juegoCreado => {
      this.juego = juegoCreado;
      console.log(juegoCreado);
      console.log('Juego creado correctamente');
      this.sesion.TomaJuego(this.juego);
      this.juegoCreado = true;
      // Asignamos a los participantes en el juego
      if (this.modoDeJuegoSeleccionado === 'Individual') {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.alumnosGrupo.length; i++) {
          this.peticionesAPI.InscribeAlumnoJuegoDeColeccion(new AlumnoJuegoDeColeccion (this.alumnosGrupo[i].id, this.juego.id))
          .subscribe();
        }
      } else {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.equiposGrupo.length; i++) {
          this.peticionesAPI.InscribeEquipoJuegoDeColeccion(new EquipoJuegoDeColeccion(this.equiposGrupo[i].id, this.juego.id))
          .subscribe();
        }
      }
      Swal.fire('Juego de colección creado correctamente', ' ', 'success');

      // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
      if (this.juegosActivos === undefined) {
        // Si la lista aun no se ha creado no podre hacer el push
            this.juegosActivos = [];
        }
      this.juegosActivos.push (this.juego);
      this.Limpiar();
        // Regresamos a la lista de equipos (mat-tab con índice 0)
      this.tabGroup.selectedIndex = 0;

    });
  }

  //// FUNCIONES PARA LA CREACION DE JUEGO DE CUESTIONARIO
  AbrirDialogoAgregarCuestionario(): void {
    const dialogRef = this.dialog.open(AsignaCuestionarioComponent, {
      width: '70%',
      height: '80%',
      position: {
        top: '0%'
      },
      // Pasamos los parametros necesarios
      data: {
        profesorId: this.profesorId
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.cuestionario = this.sesion.DameCuestionario();
      this.tengoCuestionario = true;
      console.log('CUESTIONARIO SELECCIONADO --->' + this.cuestionario.Titulo);
    });
  }

  // Para habilitar el boton de guardar puntuaciones
  TengoPuntuaciones() {
    if (this.myForm.value.PuntuacionCorrecta === '' || this.myForm.value.PuntuacionIncorrecta === '') {
      return false;
    } else {
      return true;
    }
  }

  GuardarPuntuacion() {
    this.puntuacionCorrecta = this.myForm.value.PuntuacionCorrecta;
    this.puntuacionIncorrecta = this.myForm.value.PuntuacionIncorrecta;
  }
  GuardarModoPresentacion(modoPresentacion) {
    this.modoPresentacion = modoPresentacion;
    this.tengoModoPresentacion = true;
  }

  CrearJuegoDeCuestionario() {

    // Tengo que crear un juego de tipo JuegoDeCuestionario y no uno de tipo Juego, como en los casos
    // anteriores. La razón es que no están bien organizado el tema de que los modelos de los diferentes juegos
    // tomen como base el modelo Juego genérico. De momento se queda así.


    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.CreaJuegoDeCuestionario(new JuegoDeCuestionario (this.nombreDelJuego, this.puntuacionCorrecta,
      this.puntuacionIncorrecta, this.modoPresentacion,
      false, false, this.profesorId, this.grupo.id, this.cuestionario.id), this.grupo.id)
    .subscribe(juegoCreado => {
      this.juegoDeCuestionario = juegoCreado;
      // Inscribimos a los alumnos (de momento no hay juego de cuestionario por equipos)
       // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.alumnosGrupo.length; i++) {
        // tslint:disable-next-line:max-line-length
        this.peticionesAPI.InscribeAlumnoJuegoDeCuestionario(new AlumnoJuegoDeCuestionario(0, this.juegoDeCuestionario.id, this.alumnosGrupo[i].id ))
        .subscribe();
      }
      Swal.fire('Juego de cuestionario creado correctamente', ' ', 'success');

      // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
      if (this.juegosActivos === undefined) {
        // Si la lista aun no se ha creado no podre hacer el push
            this.juegosActivos = [];
        }
      this.juegosActivos.push (this.juegoDeCuestionario);
      this.Limpiar();
        // Regresamos a la lista de equipos (mat-tab con índice 0)
      this.tabGroup.selectedIndex = 0;

    });
  }

  //// FUNCIONES PARA LA CREACION DE UN JUEGO DE AVATARES
  RecibeFamiliasElegidas($event) {
    this.familiasElegidas = $event;
    this.tengoFamilias = true;
  }


  CrearJuegoDeAvatar( ) {

    const juego = new JuegoDeAvatar ( this.nombreDelJuego,
                                      this.tipoDeJuegoSeleccionado,
                                      this.modoDeJuegoSeleccionado,
                                      true);
    juego.Familias = this.familiasElegidas;
    juego.CriteriosPrivilegioComplemento1 = this.myForm.value.criterioPrivilegioComplemento1;
    juego.CriteriosPrivilegioComplemento2 = this.myForm.value.criterioPrivilegioComplemento2;
    juego.CriteriosPrivilegioComplemento3 = this.myForm.value.criterioPrivilegioComplemento3;
    juego.CriteriosPrivilegioComplemento4 = this.myForm.value.criterioPrivilegioComplemento4;
    juego.CriteriosPrivilegioVoz = this.myForm.value.criterioPrivilegioVoz;
    juego.CriteriosPrivilegioVerTodos = this.myForm.value.criterioPrivilegioVerTodos;
    this.peticionesAPI.CreaJuegoDeAvatar (juego, this.grupo.id)
      .subscribe (nuevoJuego => {
        this.juegoDeAvatar = nuevoJuego;
        // Ahora inscribimos en el juego a los participantes
        if (this.modoDeJuegoSeleccionado === 'Individual') {

          console.log('Voy a inscribir a los alumnos del grupo');
          // tslint:disable-next-line:max-line-length
          if (this.modoDeJuegoSeleccionado === 'Individual') {
              console.log('Voy a inscribir a los alumnos del grupo');
              // tslint:disable-next-line:prefer-for-of
              for (let i = 0; i < this.alumnosGrupo.length; i++) {
                // tslint:disable-next-line:max-line-length
                console.log ('inscribo');
                this.peticionesAPI.InscribeAlumnoJuegoDeAvatar(new AlumnoJuegoDeAvatar(this.alumnosGrupo[i].id,  this.juegoDeAvatar.id))
                .subscribe();
              }
          } else {
                  // Inscribo a los equipos
          }
          Swal.fire('Juego de avatares creado correctamente', ' ', 'success');

          // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
          if (this.juegosActivos === undefined) {
            // Si la lista aun no se ha creado no podre hacer el push
                this.juegosActivos = [];
            }
          this.juegosActivos.push (this.juegoDeAvatar);
          this.Limpiar();
            // Regresamos a la lista de equipos (mat-tab con índice 0)
          this.tabGroup.selectedIndex = 0;
      }});
  }

  // FUNCIONES PARA CREAR JUEGO DE COMPETICION
  TipoDeCompeticionSeleccionado(tipoCompeticion: ChipColor) {
    this.tipoDeCompeticionSeleccionado = tipoCompeticion.nombre;
    this.tengoTipoDeCompeticion = true;
  }

  GuardarNumeroDeJornadas() {
    this.numeroDeJornadas = this.myForm.value.NumeroDeJornadas;
    if (  this.numeroDeJornadas  === undefined || isNaN( this.numeroDeJornadas )) {
      this.tengoNumeroDeJornadas = false;
      Swal.fire('Introduzca un número de jornadas válido', 'Le recordamos que debe ser un número', 'error');
    } else {
      console.log ('tengo numero');
      this.tengoNumeroDeJornadas = true;
    }
  }

  GuardarNuevaPuntuacion() {
    this.nuevaPuntuacion = this.myForm.value.NuevaPuntuacion;
    console.log ('tengo nueva puntuacion ' + this.nuevaPuntuacion );
    this.tengoNuevaPuntuacion = true;

  }

  Preparado() {
    if ((this.tengoNuevaPuntuacion) &&  (this.selection.selected.length > 0)) {
      return true;
    } else {
      return false;
    }
  }

  AnadirPuntos() {
    console.log ('nueva puntuiacion');
    console.log (this.nuevaPuntuacion);
    if (!isNaN(this.nuevaPuntuacion)) {
      for ( let i = 0; i < this.dataSource.data.length; i++) {
        // Buscamos los alumnos que hemos seleccionado
        if (this.selection.isSelected(this.dataSource.data[i]))  {
          this.Puntuacion[i] = this.nuevaPuntuacion;
          this.TablaPuntuacion[i].Puntuacion = this.nuevaPuntuacion;
        }
      }
    } else {
         Swal.fire('Introduzca una puntuación válida', 'Le recordamos que debe ser un Número', 'error');
    }
    this.dataSource = new MatTableDataSource (this.TablaPuntuacion);
    this.selection.clear();
    this.tengoNuevaPuntuacion = false;
  }

  AnadirFila() {

    let i: number;
    let NumeroParticipantes: number;
    i = this.Puntuacion.length;
    console.log(i);
    console.log(this.Puntuacion);
    if (this.modoDeJuegoSeleccionado === 'Individual') {
      NumeroParticipantes = this.alumnosGrupo.length;
    } else {
      NumeroParticipantes = this.equiposGrupo.length;
    }

    if (i < NumeroParticipantes) {
    this.TablaPuntuacion[i] = new TablaPuntosFormulaUno(i + 1, 1);
    this.Puntuacion[i] = this.TablaPuntuacion[i].Puntuacion;
    console.log(this.TablaPuntuacion[i]);

    this.dataSource = new MatTableDataSource (this.TablaPuntuacion);
  } else {
    Swal.fire('No es posible añadir otra fila', 'Ya puntuan todos los participantes', 'error');
    }

  }

  EliminarFina() {

    let i: number;
    i = this.Puntuacion.length;
    console.log(i);
    console.log(this.Puntuacion);
    if (i > 1) {
          this.TablaPuntuacion = this.TablaPuntuacion.splice(0, i - 1);
          this.Puntuacion = this.Puntuacion.slice(0, i - 1);
          console.log(this.TablaPuntuacion);
          console.log(this.Puntuacion);

          this.dataSource = new MatTableDataSource (this.TablaPuntuacion);
    } else {
      Swal.fire('No es posible eliminar otra fila', 'Como mínimo debe puntuar un participante', 'error');
    }

  }


  CrearJuegoDeCompeticionLiga() {

    // tslint:disable-next-line:max-line-lengtholean)
    this.peticionesAPI.CreaJuegoDeCompeticionLiga(new Juego (this.tipoDeJuegoSeleccionado + ' ' + this.tipoDeCompeticionSeleccionado,
                                                    this.modoDeJuegoSeleccionado, undefined, true, this.numeroDeJornadas,
                                                    this.tipoDeCompeticionSeleccionado,
                                                    undefined, undefined, this.nombreDelJuego), this.grupo.id)
    .subscribe(juegoCreado => {
      this.juego = juegoCreado;
      this.sesion.TomaJuego(this.juego);
      this.juegoCreado = true;
      // Creamos las jornadas
      console.log ('voy a crear jornadas');
      this.calculos.CrearJornadasLiga(this.numeroDeJornadas, this.juego.id)
      .subscribe ( jornadas => {
        this.jornadasLiga = jornadas;
        console.log('Jornadas creadas correctamente');
        console.log ( this.jornadasLiga );
        console.log ( this.jornadasLiga.length);

        if (this.modoDeJuegoSeleccionado === 'Individual') {
          // tslint:disable-next-line:max-line-length
          this.calculos.calcularLiga(this.alumnosGrupo.length, this.jornadasLiga.length, this.alumnosGrupo, this.grupo.id, this.jornadasLiga);
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.alumnosGrupo.length; i++) {
            // tslint:disable-next-line:max-line-length
            this.peticionesAPI.InscribeAlumnoJuegoDeCompeticionLiga(new AlumnoJuegoDeCompeticionLiga(this.alumnosGrupo[i].id, this.juego.id))
            .subscribe();
          }
        } else {

          // tslint:disable-next-line:max-line-length
          this.calculos.calcularLiga(this.equiposGrupo.length, this.jornadasLiga.length, this.equiposGrupo, this.grupo.id, this.jornadasLiga);

          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.equiposGrupo.length; i++) {
            // tslint:disable-next-line:max-line-length
            this.peticionesAPI.InscribeEquipoJuegoDeCompeticionLiga(new EquipoJuegoDeCompeticionLiga(this.equiposGrupo[i].id, this.juego.id))
            .subscribe();
          }
        }
        Swal.fire('Juego de competición tipo liga creado correctamente', ' ', 'success');
      // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
        if (this.juegosActivos === undefined) {
        // Si la lista aun no se ha creado no podre hacer el push
            this.juegosActivos = [];
        }
        this.juegosActivos.push (this.juego);
        this.Limpiar();
        // Regresamos a la lista de equipos (mat-tab con índice 0)
        this.tabGroup.selectedIndex = 0;
      });
    });
  }


  CrearJuegoDeCompeticionFormulaUno() {
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.CreaJuegoDeCompeticionFormulaUno(new Juego (this.tipoDeJuegoSeleccionado + ' ' + this.tipoDeCompeticionSeleccionado,
                                                    this.modoDeJuegoSeleccionado, undefined, true, this.numeroDeJornadas,
                                                    undefined, this.Puntuacion.length,
                                                    this.Puntuacion, this.nombreDelJuego), this.grupo.id)
    .subscribe(juegoCreado => {
      this.juego = juegoCreado;
      this.sesion.TomaJuego(this.juego);
      this.juegoCreado = true;
      this.calculos.CrearJornadasFormulaUno(this.numeroDeJornadas, this.juego.id)
      .subscribe ( jornadas => {
        this.jornadasFormulaUno = jornadas;
        this.sesion.TomaDatosJornadasJuegoComponent( this.jornadasFormulaUno);

        // inscribo a los participantes
        if (this.modoDeJuegoSeleccionado === 'Individual') {

          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.alumnosGrupo.length; i++) {
            // tslint:disable-next-line:max-line-length
            this.peticionesAPI.InscribeAlumnoJuegoDeCompeticionFormulaUno(new AlumnoJuegoDeCompeticionFormulaUno(this.alumnosGrupo[i].id, this.juego.id))
            .subscribe();
          }
        } else {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.equiposGrupo.length; i++) {
            // tslint:disable-next-line:max-line-length
            this.peticionesAPI.InscribeEquipoJuegoDeCompeticionFormulaUno(new EquipoJuegoDeCompeticionFormulaUno(this.equiposGrupo[i].id, this.juego.id))
            .subscribe();
          }
        }
        Swal.fire('Juego de competición tipo fórmula uno creado correctamente', ' ', 'success');

        // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
        if (this.juegosActivos === undefined) {
          // Si la lista aun no se ha creado no podre hacer el push
              this.juegosActivos = [];
          }
        this.juegosActivos.push (this.juego);
          // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
        this.Limpiar();
         // Regresamos a la lista de equipos (mat-tab con índice 0)
        this.tabGroup.selectedIndex = 0;

      });
    });
  }



  /// Funciones para craar juego de Geocatching
  // Geocaching
  AbrirDialogoAgregarEscenario(): void {
    const dialogRef = this.dialog.open(AsignaEscenarioComponent, {
      width: '70%',
      height: '80%',
      position: {
        top: '0%'
      },
      // Pasamos los parametros necesarios
      data: {
        profesorId: this.profesorId
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.escenario = this.sesion.DameEscenario();

      console.log('ESCENARIO SELECCIONADO --->' + this.escenario.Mapa);
      this.DamePuntosGeolocalizablesDelEscenario(this.escenario);
      console.log(this.numeroDePuntosGeolocalizables);
      console.log(this.puntosgeolocalizablesEscenario);
    });
  }

  DamePuntosGeolocalizablesDelEscenario(escenario: Escenario) {

    console.log('voy a mostrar los puntosgeolocalizables del escenario ' + escenario.id);
    this.peticionesAPI.DamePuntosGeolocalizablesEscenario(escenario.id)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.puntosgeolocalizablesEscenario = res;
        console.log(res);
        this.numeroDePuntosGeolocalizables = this.puntosgeolocalizablesEscenario.length;
        console.log(this.numeroDePuntosGeolocalizables);
        this.tengoEscenario = true;
      } else {
        console.log('No hay puntosgeolocalizables en el escenario');
        this.puntosgeolocalizablesEscenario = undefined;
        this.numeroDePuntosGeolocalizables = 0;
      }
    });
  }

  AbrirDialogoAgregarPreguntas(): void {
    const dialogRef = this.dialog.open(AsignaPreguntasComponent, {
      width: '70%',
      height: '80%',
      position: {
        top: '0%'
      },
      // Pasamos los parametros necesarios
      data: {
        profesorId: this.profesorId,
        numeroDePuntosGeolocalizables: this.numeroDePuntosGeolocalizables

      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.PreguntasBasicas = this.sesion.DameIdPreguntasBasicas();
      this.PreguntasBonus = this.sesion.DameIdPreguntasBonus();
      this.tengoPreguntas = true;
      console.log ('comprobacion de que se reciben los id de las preguntas');
      console.log (this.PreguntasBasicas);
      console.log (this.PreguntasBonus);

    })
  }


  // Para habilitar el boton de guardar puntuaciones
  TengoPuntuacionesGeocatching() {
    if (this.myForm.value.PuntuacionCorrectaGeo === '' ||
        this.myForm.value.PuntuacionIncorrectaGeo === '' ||
        this.myForm.value.PuntuacionCorrectaGeoBonus === '' ||
        this.myForm.value.PuntuacionIncorrectaGeoBonus === '') {
      return false;
    } else {
      return true;
    }
  }
  GuardarPuntuacionGeocaching() {
    this.puntuacionCorrectaGeo = this.myForm.value.PuntuacionCorrectaGeo;
    this.puntuacionIncorrectaGeo = this.myForm.value.PuntuacionIncorrectaGeo;
    this.puntuacionCorrectaGeoBonus = this.myForm.value.PuntuacionCorrectaGeoBonus;
    this.puntuacionIncorrectaGeoBonus = this.myForm.value.PuntuacionIncorrectaGeoBonus;
  }

  CrearJuegoDeGeocaching() {
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.CreaJuegoDeGeocaching(new JuegoDeGeocaching(this.nombreDelJuego, this.puntuacionCorrectaGeo, this.puntuacionIncorrectaGeo, this.puntuacionCorrectaGeoBonus, this.puntuacionIncorrectaGeoBonus, this.PreguntasBasicas, this.PreguntasBonus,
      false, false, this.profesorId, this.grupo.id, this.escenario.id), this.grupo.id)
    .subscribe(juegoCreado => {
      this.juegoDeGeocaching = juegoCreado;
      // this.sesion.TomaJuego(this.juegoDeGeocaching);
      this.juegoCreado = true;

      // Inscribimos a los alumnos en el juego
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.alumnosGrupo.length; i++) {
        // tslint:disable-next-line:max-line-length
        this.peticionesAPI.InscribeAlumnoJuegoDeGeocaching(new AlumnoJuegoDeGeocaching(0, 0, this.alumnosGrupo[i].id, this.juegoDeGeocaching.id ))
        .subscribe();
      }
      Swal.fire('Juego de geocatching creado correctamente', ' ', 'success');

      // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
      if (this.juegosActivos === undefined) {
        // Si la lista aun no se ha creado no podre hacer el push
            this.juegosActivos = [];
        }
      this.juegosActivos.push (this.juegoDeGeocaching);
        // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
      this.Limpiar();
       // Regresamos a la lista de equipos (mat-tab con índice 0)
      this.tabGroup.selectedIndex = 0;
    });
  }




goBack() {
    this.location.back();
  }

canExit(): Observable <boolean> {
    console.log ('voy a salir');
    console.log (this.creandoJuego);
    if (!this.creandoJuego) {
      return of (true);
    } else {
      const confirmacionObservable = new Observable <boolean>( obs => {
          const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
            height: '150px',
            data: {
              mensaje: 'Confirma que quieres abandonar el proceso de creación del juego',
            }
          });

          dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
              this.Limpiar();
            }
            obs.next (confirmed);
          });
      });
      return confirmacionObservable;
    }
  }

  // Funciones Para creacion de Competicion Formula Uno
  // Para averiguar si todas las filas están seleccionadas */
IsAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /* Cuando se clica en el checkbox de cabecera hay que ver si todos los
    * checkbox estan acivados, en cuyo caso se desactivan todos, o si hay alguno
    * desactivado, en cuyo caso se activan todos */

MasterToggle() {
    if (this.IsAllSelected()) {
      this.selection.clear(); // Desactivamos todos
    } else {
      // activamos todos
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

Limpiar() {
    // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
    this.stepper.reset();
    this.myForm.reset();
    this.tengoNombre = false;
    this.tengoTipo = false;
    this.tengoModo = false;

    this.puntosDelJuego = [];
    this.nivelesDelJuego = [];
    this.logosNiveles = [];


    this.coleccionSeleccionada = undefined;
    this.tengoColeccion = false;

    this.creandoJuego = false;
    this.juegoCreado = false;

    this.modoPresentacion = undefined;
    this.puntuacionCorrecta = undefined;
    this.puntuacionIncorrecta = undefined;
    this.cuestionario = undefined;
    this.tengoCuestionario = false;
    this.tengoModoPresentacion = false;

    this.familiasElegidas = undefined;
    this.tengoFamilias = false;



    this.tengoNumeroDeJornadas = false;
    this.tengoTipoDeCompeticion = false;
    this.tengoNuevaPuntuacion = false;


    this.puntuacionCorrectaGeo = undefined;
    this.puntuacionIncorrectaGeo = undefined;
    this.puntuacionCorrectaGeoBonus = undefined;
    this.puntuacionIncorrectaGeoBonus = undefined;
    this.escenario = undefined;
    this.tengoEscenario = false;

    this.puntosgeolocalizablesEscenario = undefined;
    this.PreguntasBasicas = undefined;
    this.PreguntasBonus = undefined;
    this.tengoPreguntas = false;


}


}

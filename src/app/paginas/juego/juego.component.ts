import { Component, OnInit, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatSnackBar, MatTabGroup } from '@angular/material';

// Clases
import { Alumno, Equipo, Juego, Punto, AlumnoJuegoDePuntos, EquipoJuegoDePuntos} from '../../clases/index';

// Services
import { JuegoService, GrupoService, PuntosInsigniasService, EquipoService, JuegoDePuntosService } from '../../servicios/index';

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


  ///////////////////////////////////// PARÁMETROS GENERALES PARA EL COMPONENTE ///////////////////////////////////

  grupoId: number;
  alumnosGrupo: Alumno[];
  equiposGrupo: Equipo[];
  @ViewChild('stepper') stepper;
  @ViewChild('tabs') tabGroup: MatTabGroup;

  // tslint:disable-next-line:ban-types
  juegoCreado: Boolean = false;

  juego: Juego;




  ///////////////////////////////////// PARÁMETROS PARA PÁGINA LISTA DE JUEGOS ////////////////////////////////////

  // Opciones para mostrar en la lista desplegable para seleccionar el tipo de juego que listar
  opcionesMostrar: OpcionSeleccionada[] = [
    {nombre: 'Todos los juegos', id: 'todosLosJuegos'},
    {nombre: 'Juegos de puntos', id: 'juegosDePuntos'},
    {nombre: 'Juegos de colección', id: 'juegosDeColeccion'},
    {nombre: 'Juegos de competición', id: 'juegosDeCompeticion'},
  ];

  // Recogemos los tres tipos de juegos que tenemos y las metemos en una lista, tanto activos como inactivos
  juegosDePuntos: Juego[];
  juegosDeColeccion: Juego[];
  juegosDeCompeticion: Juego[];

  // AHORA SEPARAMOS ENTRE LOS JUEGOS ACTIVOS E INACTIVOS DE CADA TIPO DE JUEGO

  // Separamos entre juegos de puntos activos e inactivos
  juegosDePuntosActivos: Juego[] = [];
  juegosDePuntosInactivos: Juego[] = [];

  // Separamos entre juegos de coleccion activos e inactivos
  juegosDeColeccionActivos: Juego[] = [];
  juegosDeColeccionInactivos: Juego[] = [];

  // Separamos entre juegos de competición activos e inactivos
  juegosDeCompeticionActivos: Juego[] = [];
  juegosDeCompeticionInactivos: Juego[] = [];


  // HACEMOS DOS LISTAS CON LOS JUEGOS ACTIVOS E INACTIVOS DE LOS TRES TIPOS DE JUEGOS
  todosLosJuegosActivos: Juego[] = [];
  todosLosJuegosInactivos: Juego[] = [];

  // Al seleccionar el tipo de juego que deseo mostrar de la lista desplegable (OpcionSeleccionada), copiaremos esa lista
  // en este vector, ya que será de donde se sacará la información que se mostrará
  ListaJuegosSeleccionadoActivo: Juego[];
  ListaJuegosSeleccionadoInactivo: Juego[];

  // tslint:disable-next-line:no-inferrable-types
  opcionSeleccionada: string = 'todosLosJuegos';



  //////////////////////////////////// PARÁMETROS PARA PÁGINA DE CREAR JUEGO //////////////////////////////////////

  // En el primer paso mostraremos tres Chips con las diferentes opciones de tipo de juego que podemos crear y su color
  seleccionTipoJuego: ChipColor[] = [
    {nombre: 'Juego De Puntos', color: 'primary'},
    {nombre: 'Juego De Colección', color: 'accent'},
    {nombre: 'Juego De Competición', color: 'warn'}
  ];

  // En el segundo paso mostraremos dos Chips con los dos modos de juego que podemos crear y su color
  seleccionModoJuego: ChipColor[] = [
    {nombre: 'Individual', color: 'primary'},
    {nombre: 'Equipos', color: 'accent'}
  ];

    // En el segundo paso mostraremos dos Chips con los dos modos de juego que podemos crear y su color
    seleccionTipoJuegoCompeticion: ChipColor[] = [
      {nombre: 'Liga', color: 'primary'},
      {nombre: 'Torneo', color: 'accent'}
    ];

  // Recogemos la opción que seleccionemos en el primer (tipoDeJuegoSeleccionado) y en el segundo paso (modoDeJuegoSeleccionado)
  tipoDeJuegoSeleccionado: string;
  modoDeJuegoSeleccionado: string;

  //
  tipoJuegoCompeticionSeleccionado: string;

  // No nos permite avanzar en el primer paso si no se ha seleccionado una opción
  // tslint:disable-next-line:ban-types
  isDisabled: Boolean = true;

  // No nos permite avanzar en el segundo paso si no se ha seleccionado opción
  // tslint:disable-next-line:ban-types
  isDisabledModo: Boolean = true;



  constructor( private juegoService: JuegoService,
               private grupoService: GrupoService,
               private equipoService: EquipoService,
               private juegoDePuntosService: JuegoDePuntosService,
               public snackBar: MatSnackBar,
               private puntosInsigniasService: PuntosInsigniasService) { }

  ngOnInit() {
    this.grupoId = this.grupoService.RecibirGrupoIdDelServicio();
    this.alumnosGrupo = this.grupoService.RecibirAlumnosGrupoDelServicio();
    this.EquiposDelGrupo();

    // Recupera la lista de juegos que tiene el grupo (primero el de puntos, después de colección y después los totales)
    // y los va clasificando en activo e inactivo
    this.ListaJuegosDePuntos();
  }


  //////////////////////////////////////// FUNCIONES PARA LISTAR JUEGOS ///////////////////////////////////////////////


  // Busca la lista de juego de puntos y la clasifica entre activo e inactivo, y activa la función ListaJuegosDeColeccion
  ListaJuegosDePuntos() {
    this.juegoDePuntosService.GET_JuegoDePuntos(this.grupoId)
    .subscribe(juegos => {
      console.log('He recibido los juegos de puntos');
      console.log(juegos);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < juegos.length; i++) {
        if (juegos[i].JuegoActivo === true) {
          this.juegosDePuntosActivos.push(juegos[i]);
        } else {
          console.log('Juego inactivo');
          console.log(juegos[i]);
          this.juegosDePuntosInactivos.push(juegos[i]);
        }
      }
      this.ListaJuegosDeColeccion();
    });
  }


  // Busca la lista de juego de coleccion y la clasifica entre activo e inactivo, y activa la función ListaJuegosDeCompeticion
  ListaJuegosDeColeccion() {
    this.juegoService.GET_JuegoDeColeccion(this.grupoId)
    .subscribe(juegos => {
      console.log('He recibido los juegos de coleccion');

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < juegos.length; i++) {
        if (juegos[i].JuegoActivo === true) {
          this.juegosDeColeccionActivos.push(juegos[i]);
        } else {
          this.juegosDeColeccionInactivos.push(juegos[i]);
        }
      }
      this.ListaJuegosDeCompeticion();
    });
  }


  // Busca la lista de juego de competicion y la clasifica entre activo e inactivo, y activa la función ListaJuegosTotales
  ListaJuegosDeCompeticion() {
    this.juegoService.GET_JuegoDeCompeticion(this.grupoId)
    .subscribe(juegos => {
      console.log('He recibido los juegos de competición');

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < juegos.length; i++) {
        if (juegos[i].JuegoActivo === true) {
          this.juegosDeCompeticionActivos.push(juegos[i]);
        } else {
          this.juegosDeCompeticionInactivos.push(juegos[i]);
        }
      }
      this.ListaJuegosTotales();
    });
  }


  // Una vez recibidos los juegos de puntos y colección y clasificados en activos e inactivos, los metemos dentro de la
  // lista total de juegos activos e inactivos
  ListaJuegosTotales() {

    for (let i = 0; i < (this.juegosDePuntosActivos.length); i++ ) {
      this.todosLosJuegosActivos.push(this.juegosDePuntosActivos[i]);
    }

    for (let i = 0; i < (this.juegosDePuntosInactivos.length); i++ ) {
      this.todosLosJuegosInactivos.push(this.juegosDePuntosInactivos[i]);
    }

    for (let i = 0; i < (this.juegosDeColeccionActivos.length); i++ ) {
      this.todosLosJuegosActivos.push(this.juegosDeColeccionActivos[i]);
    }

    for (let i = 0; i < (this.juegosDeColeccionInactivos.length); i++ ) {
      this.todosLosJuegosInactivos.push(this.juegosDeColeccionInactivos[i]);
    }

    for (let i = 0; i < (this.juegosDeCompeticionActivos.length); i++ ) {
      this.todosLosJuegosActivos.push(this.juegosDeCompeticionActivos[i]);
    }

    for (let i = 0; i < (this.juegosDeCompeticionInactivos.length); i++ ) {
      this.todosLosJuegosInactivos.push(this.juegosDeCompeticionInactivos[i]);
    }

    // Por defecto al principio mostraremos la lista de todos los juegos, con lo que la lista seleccionada para mostrar
    // será la de todos los juegos
    this.ListaJuegosSeleccionadoActivo = this.todosLosJuegosActivos;
    this.ListaJuegosSeleccionadoInactivo = this.todosLosJuegosInactivos;
  }


  // En función de la opción que deseemos muestrear (opcionSeleccionada) en la lista de juegos, el vector
  // ListaJuegosSeleccionadoActivo y ListaJuegosSeleccionadoInactivo tomará un valor u otro
  ListaJuegoSeleccionado() {

    console.log('Busquemos la lista correspondiente');
    console.log(this.opcionSeleccionada);

    if (this.opcionSeleccionada === 'todosLosJuegos') {
      this.ListaJuegosSeleccionadoActivo = this.todosLosJuegosActivos;
      this.ListaJuegosSeleccionadoInactivo = this.todosLosJuegosInactivos;
    }
    if (this.opcionSeleccionada === 'juegosDePuntos') {
      this.ListaJuegosSeleccionadoActivo = this.juegosDePuntosActivos;
      this.ListaJuegosSeleccionadoInactivo = this.juegosDePuntosInactivos;
    }

    if (this.opcionSeleccionada === 'juegosDeColeccion') {
      this.ListaJuegosSeleccionadoActivo = this.juegosDeColeccionActivos;
      this.ListaJuegosSeleccionadoInactivo = this.juegosDeColeccionInactivos;
    }

    if (this.opcionSeleccionada === 'juegosDeCompeticion') {

      this.ListaJuegosSeleccionadoActivo = this.juegosDeCompeticionActivos;
      this.ListaJuegosSeleccionadoInactivo = this.juegosDeCompeticionInactivos;
    }
  }

  // Función que usaremos para clicar en un juego y entrar en él, enviándolo al servicio
  JuegoSeleccionado(juego: Juego) {
    this.juegoService.EnviarJuegoAlServicio(juego);
  }





  ///////////////////////////////////////// FUNCIONES PARA CREAR JUEGO ///////////////////////////////////////////////

  // RECUPERA LOS EQUIPOS DEL GRUPO
  EquiposDelGrupo() {
    this.equipoService.GET_EquiposDelGrupo(this.grupoId)
    .subscribe(equipos => {
      if (equipos !== undefined) {
        console.log('Hay equipos');
        this.equiposGrupo = equipos;
        console.log(this.equiposGrupo);
      } else {
        console.log('Este grupo aun no tiene equipos');
      }

    });
  }

  // Recoge el tipo de juego seleccionado y lo mete en la variable (tipoDeJuegoSeleccionado), la cual se usará después
  // para el POST del juego
  TipoDeJuegoSeleccionado(tipo: ChipColor) {
    this.tipoDeJuegoSeleccionado = tipo.nombre;
    console.log(this.tipoDeJuegoSeleccionado);
    this.isDisabled = false;
  }


  // Recoge el modo de juego seleccionado y lo mete en la variable (modoDeJuegoSeleccionado), la cual se usará después
  // para el POST del juego
  ModoDeJuegoSeleccionado(modo: ChipColor) {
    this.modoDeJuegoSeleccionado = modo.nombre;
    if (this.modoDeJuegoSeleccionado === 'Individual') {
      if (this.alumnosGrupo === undefined) {
        this.isDisabledModo = true;
        console.log('No Hay alumnos, no puedo crear el juego');
      } else {
        console.log('Hay alumnos, puedo crear');
        this.isDisabledModo = false;
      }

    } else {
      if (this.equiposGrupo[0] === undefined) {
        this.isDisabledModo = true;
        console.log('No se puede crear juego pq no hay alumnos');
      } else {
        this.isDisabledModo = false;
        console.log('Hay equipos, puedo crear');
      }

    }
  }

  // Función que usaremos para crear un juego de puntos. Hay que diferenciar entre los tres juegos porque la URL es diferente
  CrearJuegoDePuntos() {
    this.juegoDePuntosService.POST_JuegoDePuntos(new Juego (this.tipoDeJuegoSeleccionado, this.modoDeJuegoSeleccionado), this.grupoId)
    .subscribe(juegoCreado => {
      this.juego = juegoCreado;
      console.log(juegoCreado);
      console.log('Juego creado correctamente');
      this.juegoService.EnviarJuegoAlServicio(juegoCreado);
      this.juegoCreado = true;
    });
  }

  CrearJuegoDeColeccion() {
    this.juegoService.POST_JuegoDeColeccion(new Juego (this.tipoDeJuegoSeleccionado, this.modoDeJuegoSeleccionado), this.grupoId)
    .subscribe(juegoCreado => {
      this.juego = juegoCreado;
      console.log(juegoCreado);
      console.log('Juego creado correctamente');
      this.juegoService.EnviarJuegoAlServicio(juegoCreado);
      this.juegoCreado = true;
    });
  }

  // Si decidimos crear un juego de puntos, lo crearemos ya en la base de datos y posteriormente le añadiremos puntos y niveles
  // Si decidimos crear un juego de colección no haremos el POST en este paso, sino en el siguente cuando indiquemos la colección
  // Si decidimos crear un juego de competición tampoco haremos el POST en este paso, sino cuando indiquemos el tipo de competición

  CrearJuegoCorrespondiente() {
    if (this.tipoDeJuegoSeleccionado === 'Juego De Puntos') {
      console.log('Voy a crear juego de puntos');
      this.CrearJuegoDePuntos();
    } else if (this.tipoDeJuegoSeleccionado === 'Juego De Colección') {
      console.log('Voy a crear juego de colección');
      this.CrearJuegoDeColeccion();
    }
    this.snackBar.open(this.tipoDeJuegoSeleccionado + ' creado correctamente', 'Cerrar', {
      duration: 2000,
    });
  }

  TipoDeJuegoCompeticionSeleccionado(tipoCompeticion: ChipColor) {
    this.tipoJuegoCompeticionSeleccionado = tipoCompeticion.nombre;
    console.log('Voy a crear juego de competicón');
  }


  InscribirAlumnosJuego() {
    console.log('Voy a inscribir a los alumnos del grupo');

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.alumnosGrupo.length; i++) {
      console.log(this.alumnosGrupo[i]);
      this.juegoDePuntosService.POST_AlumnoJuegoDePuntos(new AlumnoJuegoDePuntos(this.alumnosGrupo[i].id, this.juego.id))
      .subscribe(alumnoJuego => console.log('alumnos inscritos correctamente'));
    }
  }


  // INSCRIBE A TODOS LOS EQUIPOS DEL GRUPO DONDE SE CREA EL JUEGO Y PONE SUS PUNTOS A 0
  InscribirEquiposJuego() {
    console.log('Voy a inscribir los equipos al grupo');

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.equiposGrupo.length; i++) {
      console.log(this.equiposGrupo[i]);
      this.juegoDePuntosService.POST_EquipoJuegoDePuntos(new EquipoJuegoDePuntos(this.equiposGrupo[i].id, this.juego.id))
      .subscribe(equiposJuego => console.log(equiposJuego));
    }
  }

  Finalizar() {
    this.ListaJuegosDePuntos();

    // AHORA SEPARAMOS ENTRE LOS JUEGOS ACTIVOS E INACTIVOS DE CADA TIPO DE JUEGO

    // Separamos entre juegos de puntos activos e inactivos
    this.juegosDePuntosActivos = [];
    this.juegosDePuntosInactivos = [];

    // Separamos entre juegos de coleccion activos e inactivos
    this.juegosDeColeccionActivos = [];
    this.juegosDeColeccionInactivos  = [];

    // Separamos entre juegos de competición activos e inactivos
    this.juegosDeCompeticionActivos = [];
    this.juegosDeCompeticionInactivos = [];


    // HACEMOS DOS LISTAS CON LOS JUEGOS ACTIVOS E INACTIVOS DE LOS TRES TIPOS DE JUEGOS
    this.todosLosJuegosActivos = [];
    this.todosLosJuegosInactivos = [];

    // Al seleccionar el tipo de juego que deseo mostrar de la lista desplegable (OpcionSeleccionada), copiaremos esa lista
    // en este vector, ya que será de donde se sacará la información que se mostrará
    this.ListaJuegosSeleccionadoActivo = [];
    this.ListaJuegosSeleccionadoInactivo = [];

    this.juegoCreado = false;

    // Regresamos a la lista de equipos (mat-tab con índice 0)
    this.tabGroup.selectedIndex = 0;

    // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
    this.stepper.reset();
  }

  prueba() {
    console.log(this.juego);
  }



}

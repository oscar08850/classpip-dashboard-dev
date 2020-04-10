import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatTabGroup } from '@angular/material';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Clases
// tslint:disable-next-line:max-line-length
import { Alumno, Equipo, Juego, JuegoDeCompeticion, Punto, TablaPuntosFormulaUno, AlumnoJuegoDePuntos, EquipoJuegoDePuntos, Grupo, AlumnoJuegoDeCompeticionLiga, EquipoJuegoDeCompeticionLiga, Jornada, AlumnoJuegoDeCompeticionFormulaUno, EquipoJuegoDeCompeticionFormulaUno} from '../../clases/index';

// Services
import { SesionService, CalculosService, PeticionesAPIService } from '../../servicios/index';


import { Observable} from 'rxjs';
import { of } from 'rxjs';
import 'rxjs';

import { DialogoConfirmacionComponent } from '../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';




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

  grupo: Grupo;
  alumnosGrupo: Alumno[];
  equiposGrupo: Equipo[];
  @ViewChild('stepper') stepper;
  @ViewChild('tabs') tabGroup: MatTabGroup;

  // tslint:disable-next-line:ban-types
  juegoCreado: Boolean = false;

  juego: Juego;
  juegoDeCompeticion: JuegoDeCompeticion;
  myForm: FormGroup;
  myForm1: FormGroup;
  myForm2: FormGroup;

  // HACEMOS DOS LISTAS CON LOS JUEGOS ACTIVOS E INACTIVOS DE LOS TRES TIPOS DE JUEGOS
  juegosActivos: Juego[];
  juegosInactivos: Juego[];


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
      {nombre: 'Fórmula Uno', color: 'warn'},
      {nombre: 'Torneo', color: 'accent'}
    ];

  // Recogemos la opción que seleccionemos en el primer (tipoDeJuegoSeleccionado) y en el segundo paso (modoDeJuegoSeleccionado)
  tipoDeJuegoSeleccionado: string;
  modoDeJuegoSeleccionado: string;
  NumeroDeVueltasValueInd: number;
  NumeroDeVueltasValueEqu: number;

  //
  tipoJuegoCompeticionSeleccionado: string;

  // No nos permite avanzar si no se ha seleccionado una opción
  // tslint:disable-next-line:ban-types
  isDisabled: Boolean = true;
  // tslint:disable-next-line:ban-types
  isDisabledNombre: Boolean = true;
  // tslint:disable-next-line:ban-types
  isDisabledModo: Boolean = true;
  // tslint:disable-next-line:ban-types
  isDisabledExtra: Boolean = true;
  // tslint:disable-next-line:ban-types
  isDisabledTipoCompeticion: Boolean = true;
  // tslint:disable-next-line:ban-types
  isDisabledJornadas: Boolean = true;

  tipoJuegoElegido: string;
  nombreColeccionSeleccionada: string;
  // tslint:disable-next-line:ban-types
  finalizar: Boolean = false;
  selection = new SelectionModel<any>(true, []);
  botonTablaDesactivado = true;
  seleccionados: boolean[];
  Puntuacion: number[];
  dataSource: any;
  TablaPuntuacion: TablaPuntosFormulaUno[];
  botonTablaDesactivadoJugadorExtra = true;
  displayedColumnsTablaPuntuacion: string[] = ['select', 'Posicion', 'Puntos'];


  constructor(
               public dialog: MatDialog,
               private calculos: CalculosService,
               private sesion: SesionService,
               private location: Location,
               private peticionesAPI: PeticionesAPIService,
               // tslint:disable-next-line:variable-name
               private _formBuilder: FormBuilder,
               ) { }


  ngOnInit() {
    this.grupo = this.sesion.DameGrupo();
    this.alumnosGrupo = this.sesion.DameAlumnosGrupo();
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

    });
    console.log ('Ya he traido los juegos');

    this.myForm = this._formBuilder.group({
      NumeroDeJornadas: ['', Validators.required],
    });

    this.myForm1 = this._formBuilder.group({
      NuevaPuntuacion: ['', Validators.required],
    });

    this.myForm2 = this._formBuilder.group({
      NombredelJuego: ['', Validators.required],
    });

    this.TablaPuntuacion = [];
    this.TablaPuntuacion[0] = new TablaPuntosFormulaUno(1, 10);
    this.dataSource = new MatTableDataSource (this.TablaPuntuacion);
    this.Puntuacion = [10];
  }

  //////////////////////////////////////// FUNCIONES PARA LISTAR JUEGOS ///////////////////////////////////////////////


  // Busca la lista de juego de puntos y la clasifica entre activo e inactivo, y activa la función ListaJuegosDeColeccion

  // Función que usaremos para clicar en un juego y entrar en él,
  // Enviamos juego a la sesión
  JuegoSeleccionado(juego: Juego) {
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

  // Recoge el tipo de juego seleccionado y lo mete en la variable (tipoDeJuegoSeleccionado), la cual se usará después
  // para el POST del juego
  TipoDeJuegoSeleccionado(tipo: ChipColor) {
    this.tipoDeJuegoSeleccionado = tipo.nombre;
    console.log(this.tipoDeJuegoSeleccionado);
    this.isDisabled = false;
    if (this.tipoDeJuegoSeleccionado === 'Juego De Competición') {
        this.NumeroDeVueltas();
    }
  }


  // Recoge el modo de juego seleccionado y lo mete en la variable (modoDeJuegoSeleccionado), la cual se usará después
  // para el POST del juego
  ModoDeJuegoSeleccionado(modo: ChipColor) {
    this.modoDeJuegoSeleccionado = modo.nombre;
    if (this.modoDeJuegoSeleccionado === 'Individual') {
      if (this.alumnosGrupo === undefined) {
        this.isDisabledModo = true;
        Swal.fire('Alerta', 'No hay ningún alumno en este grupo', 'warning');
        console.log('No Hay alumnos, no puedo crear el juego');
      } else {
        console.log('Hay alumnos, puedo crear');
        this.isDisabledModo = false;
      }

    } else {
      if (this.equiposGrupo === undefined) {
        this.isDisabledModo = true;
        Swal.fire('Alerta', 'No hay ningún equipo en este grupo', 'warning');
        console.log('No se puede crear juego pq no hay equipos');
      } else {
        this.isDisabledModo = false;
        console.log('Hay equipos, puedo crear');
      }
    }
  }

  // Función que usaremos para crear un juego de puntos.
  // Hay que diferenciar entre los tres juegos porque la URL es diferente
  CrearJuegoDePuntos() {
    let NombredelJuego: string;
    NombredelJuego = this.myForm2.value.NombredelJuego;
    this.peticionesAPI.CreaJuegoDePuntos(new Juego (this.tipoDeJuegoSeleccionado, this.modoDeJuegoSeleccionado,
      undefined, undefined, undefined, undefined, undefined, undefined, NombredelJuego), this.grupo.id)
    .subscribe(juegoCreado => {
      this.juego = juegoCreado;
      console.log(juegoCreado);
      console.log('Juego creado correctamente');
      this.sesion.TomaJuego(this.juego);
      this.juegoCreado = true;
    });
  }

  CrearJuegoDeColeccion() {
    let NombredelJuego: string;
    NombredelJuego = this.myForm2.value.NombredelJuego;
    this.peticionesAPI.CreaJuegoDeColeccion(new Juego (this.tipoDeJuegoSeleccionado, this.modoDeJuegoSeleccionado,
      undefined, undefined, undefined, undefined, undefined, undefined, NombredelJuego), this.grupo.id)
    .subscribe(juegoCreado => {
      this.juego = juegoCreado;
      console.log(juegoCreado);
      console.log('Juego creado correctamente');
      this.sesion.TomaJuego(this.juego);
      this.juegoCreado = true;
    });
  }

  CrearJuegoDeCompeticionLiga() {
    console.log (this.tipoJuegoCompeticionSeleccionado);

    let NumeroDeJornadas: number;
    let Jornadas: Jornada[];
    NumeroDeJornadas = this.myForm.value.NumeroDeJornadas;
    let NombredelJuego: string;
    NombredelJuego = this.myForm2.value.NombredelJuego;
    console.log(NumeroDeJornadas);
    console.log(new Juego (this.tipoDeJuegoSeleccionado + ' Liga', this.modoDeJuegoSeleccionado,
                  undefined, true, NumeroDeJornadas, this.tipoJuegoCompeticionSeleccionado, undefined,
                  undefined, NombredelJuego), this.grupo.id);
    // tslint:disable-next-line:max-line-lengtholean)
    this.peticionesAPI.CreaJuegoDeCompeticionLiga(new Juego (this.tipoDeJuegoSeleccionado + ' ' + this.tipoJuegoCompeticionSeleccionado,
                                                    this.modoDeJuegoSeleccionado, undefined, true, NumeroDeJornadas,
                                                    this.tipoJuegoCompeticionSeleccionado,
                                                    undefined, undefined, NombredelJuego), this.grupo.id)
    .subscribe(juegoCreado => {
      this.juego = juegoCreado;
      console.log(juegoCreado);
      console.log('Juego creado correctamente');
      this.sesion.TomaJuego(this.juego);
      this.juegoCreado = true;
      console.log('Voy a crear las ' + NumeroDeJornadas + ' jornadas');
      Jornadas = this.calculos.CrearJornadasLiga(NumeroDeJornadas, this.juego.id);
      console.log('Jornadas creadas correctamente');
      this.sesion.TomaDatosJornadasJuegoComponent(Jornadas);
    });
  }


  CrearJuegoDeCompeticionFormulaUno() {
    console.log ('&&&&&& ' + this.tipoJuegoCompeticionSeleccionado);

    let NumeroDeJornadas: number;
    let Jornadas: Jornada[];
    NumeroDeJornadas = this.myForm.value.NumeroDeJornadas;
    let NombredelJuego: string;
    NombredelJuego = this.myForm2.value.NombredelJuego;
    console.log(NombredelJuego);
    console.log(NumeroDeJornadas);
    console.log(new Juego (this.tipoDeJuegoSeleccionado + ' ' + this.tipoJuegoCompeticionSeleccionado, this.modoDeJuegoSeleccionado,
                  undefined, true, NumeroDeJornadas, this.tipoJuegoCompeticionSeleccionado, this.Puntuacion.length,
                  this.Puntuacion), this.grupo.id);
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.CreaJuegoDeCompeticionFormulaUno(new Juego (this.tipoDeJuegoSeleccionado + ' ' + this.tipoJuegoCompeticionSeleccionado,
                                                    this.modoDeJuegoSeleccionado, undefined, true, NumeroDeJornadas,
                                                    undefined, this.Puntuacion.length,
                                                    this.Puntuacion, NombredelJuego), this.grupo.id)
    .subscribe(juegoCreado => {
      this.juego = juegoCreado;
      console.log(juegoCreado);
      console.log('Juego creado correctamente');
      this.sesion.TomaJuego(this.juego);
      this.juegoCreado = true;
      console.log('Voy a crear las ' + NumeroDeJornadas + ' jornadas');
      Jornadas = this.calculos.CrearJornadasFormulaUno(NumeroDeJornadas, this.juego.id);
      console.log('Jornadas creadas correctamente');
      this.sesion.TomaDatosJornadasJuegoComponent(Jornadas);
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
    } else if (this.tipoDeJuegoSeleccionado === 'Juego De Competición' && this.tipoJuegoCompeticionSeleccionado === 'Liga') {
      console.log('Voy a crear juego de Competición Liga');
      this.CrearJuegoDeCompeticionLiga();
    } else if (this.tipoDeJuegoSeleccionado === 'Juego De Competición' && this.tipoJuegoCompeticionSeleccionado === 'Fórmula Uno') {
      console.log('Voy a crear juego de Competición Formula Uno');
      this.CrearJuegoDeCompeticionFormulaUno();
    }

    Swal.fire('Creado', this.tipoDeJuegoSeleccionado + ' creado correctamente', 'success');
  }

  TipoDeJuegoCompeticionSeleccionado(tipoCompeticion: ChipColor) {
    this.tipoJuegoCompeticionSeleccionado = tipoCompeticion.nombre;
    console.log('El juego de competición será tipo: ' + tipoCompeticion.nombre);
    this.isDisabledTipoCompeticion = false;
  }


  Finalizar() {
    console.log ('Entro en finalizar');
    console.log (this.tipoDeJuegoSeleccionado);
    const datos = this.sesion.DameDatosJornadasJuegoComponent();
    let jornadas: Jornada[];
    jornadas = datos.jornadas;

    if (this.tipoDeJuegoSeleccionado === 'Juego De Competición') {
      if (this.tipoJuegoCompeticionSeleccionado === 'Liga') {
        if (this.modoDeJuegoSeleccionado === 'Individual') {

          console.log('Voy a crear los enfrentamientos');
          console.log(this.alumnosGrupo.length);
          console.log(jornadas.length);
          console.log(Math.abs(this.alumnosGrupo.length % 2));
          this.calculos.calcularLiga(this.alumnosGrupo.length, jornadas.length, this.alumnosGrupo, this.grupo.id, jornadas);

          console.log('Voy a inscribir a los alumnos del grupo');

          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.alumnosGrupo.length; i++) {
            console.log('alumno: ' + this.alumnosGrupo[i]);
            console.log('id alumno: ' + this.alumnosGrupo[i].id);
            console.log('juego: ' + this.juego);
            console.log('id juego: ' + this.juego.id);
            console.log(new AlumnoJuegoDeCompeticionLiga(this.alumnosGrupo[i].id, this.juego.id));
            // tslint:disable-next-line:max-line-length
            this.peticionesAPI.InscribeAlumnoJuegoDeCompeticionLiga(new AlumnoJuegoDeCompeticionLiga(this.alumnosGrupo[i].id, this.juego.id))
            .subscribe(alumnoJuego => console.log('alumnos inscritos correctamente'));
          }
        } else {

          console.log('Voy a crear los enfrentamientos');
          this.calculos.calcularLiga(this.equiposGrupo.length, jornadas.length, this.equiposGrupo, this.grupo.id, jornadas);

          console.log('Voy a inscribir los equipos al grupo');

          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.equiposGrupo.length; i++) {
            console.log(this.equiposGrupo[i]);
            // tslint:disable-next-line:max-line-length
            this.peticionesAPI.InscribeEquipoJuegoDeCompeticionLiga(new EquipoJuegoDeCompeticionLiga(this.equiposGrupo[i].id, this.juego.id))
            .subscribe(equiposJuego => console.log(equiposJuego));
          }
        }
      } else if (this.tipoJuegoCompeticionSeleccionado === 'Fórmula Uno') {
        if (this.modoDeJuegoSeleccionado === 'Individual') {

          console.log('Voy a inscribir a los alumnos del grupo');

          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.alumnosGrupo.length; i++) {
            console.log('alumno: ' + this.alumnosGrupo[i]);
            console.log('id alumno: ' + this.alumnosGrupo[i].id);
            console.log('juego: ' + this.juego);
            console.log('id juego: ' + this.juego.id);
            console.log(new AlumnoJuegoDeCompeticionFormulaUno(this.alumnosGrupo[i].id, this.juego.id));
            // tslint:disable-next-line:max-line-length
            this.peticionesAPI.InscribeAlumnoJuegoDeCompeticionFormulaUno(new AlumnoJuegoDeCompeticionFormulaUno(this.alumnosGrupo[i].id, this.juego.id))
            .subscribe(alumnoJuego => console.log('alumnos inscritos correctamente'));
          }
        } else {
          console.log('Voy a inscribir los equipos al grupo');
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.equiposGrupo.length; i++) {
            console.log(this.equiposGrupo[i]);
            // tslint:disable-next-line:max-line-length
            this.peticionesAPI.InscribeEquipoJuegoDeCompeticionFormulaUno(new EquipoJuegoDeCompeticionFormulaUno(this.equiposGrupo[i].id, this.juego.id))
            .subscribe(equiposJuego => console.log(equiposJuego));
          }
        }
      }
    }


    console.log ('AAAA');

    if (this.tipoDeJuegoSeleccionado === 'Juego De Puntos') {
      console.log ('Es un juego de puntos');

      if (this.modoDeJuegoSeleccionado === 'Individual') {
        console.log('Voy a inscribir a los alumnos del grupo 1');

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.alumnosGrupo.length; i++) {
          console.log(this.alumnosGrupo[i]);
          this.peticionesAPI.InscribeAlumnoJuegoDePuntos(new AlumnoJuegoDePuntos(this.alumnosGrupo[i].id, this.juego.id))
          .subscribe(alumnoJuego => console.log('alumnos inscritos correctamente 1'));
        }
      } else {
        console.log('Voy a inscribir los equipos del grupo');

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.equiposGrupo.length; i++) {
          console.log(this.equiposGrupo[i]);
          this.peticionesAPI.InscribeEquipoJuegoDePuntos(new EquipoJuegoDePuntos(this.equiposGrupo[i].id, this.juego.id))
          .subscribe(equiposJuego => console.log(equiposJuego));
        }
      }

    }

    // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
    if (this.juegosActivos === undefined) {
      // Si la lista aun no se ha creado no podre hacer el push
          this.juegosActivos = [];
    }
    this.juegosActivos.push (this.juego);


    this.juegoCreado = false;

      // Regresamos a la lista de equipos (mat-tab con índice 0)
    this.tabGroup.selectedIndex = 0;

      // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
    this.stepper.reset();
    this.finalizar = true;
    this.TablaPuntuacion = [];
    this.TablaPuntuacion[0] = new TablaPuntosFormulaUno(1, 10);
    this.dataSource = new MatTableDataSource (this.TablaPuntuacion);
    this.Puntuacion = [10];
    // tslint:disable-next-line:ban-types
    this.isDisabled = true;
    // tslint:disable-next-line:ban-types
    this.isDisabledNombre = true;
    // tslint:disable-next-line:ban-types
    this.isDisabledModo = true;
    // tslint:disable-next-line:ban-types
    this.isDisabledExtra = true;
    // tslint:disable-next-line:ban-types
    this.isDisabledTipoCompeticion = true;
    // tslint:disable-next-line:ban-types
    this.isDisabledJornadas = true;
    this.tipoJuegoCompeticionSeleccionado = undefined;
    this.tipoDeJuegoSeleccionado = undefined;
    this.modoDeJuegoSeleccionado = undefined;
  }

  // Recibo el nombre de la colección elegida en el componente hijo
   RecibeNombre($event) {
    this.nombreColeccionSeleccionada = $event;
  }

  goBack() {
    this.location.back();
  }

  canExit(): Observable <boolean> {
    if (!this.juegoCreado || this.finalizar) {
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
              // Si confirma que quiere salir entonces eliminamos el grupo que se ha creado
              // this.sesion.TomaGrupo (this.grupo);
              // this.calculos.EliminarGrupo();
              // this.BorrarColeccion (this.coleccionCreada);
              if (this.tipoDeJuegoSeleccionado === 'Juego De Puntos') {
                this.peticionesAPI.BorraJuegoDePuntos(this.juego.id, this.juego.grupoId).subscribe();
              } else if (this.tipoDeJuegoSeleccionado === 'Juego De Colección') {
                this.peticionesAPI.BorraJuegoDeColeccion(this.juego.id, this.juego.grupoId).subscribe();
              }
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
  /* Esta función decide si el boton debe estar activo (si hay al menos
  una fila seleccionada) o si debe estar desactivado (si no hay ninguna fila seleccionada) */
  /* En este caso para que esté activo también debe haber seleccionado el tipo de punto a asignar */
  ActualizarBotonTabla() {
    let NuevaPuntuacion: number;
    NuevaPuntuacion = this.myForm1.value.NuevaPuntuacion;
    if ((this.selection.selected.length === 0) || ( NuevaPuntuacion === undefined)) {
      this.botonTablaDesactivado = true;
    } else {
      this.botonTablaDesactivado = false;
    }
  }

  BotonDesactivado() {
    let NuevaPuntuacion: number;
    NuevaPuntuacion = this.myForm1.value.NuevaPuntuacion;

    console.log('voy a ver si hay algo en los inputs');
    if (NuevaPuntuacion !== undefined ) {
      console.log('hay algo, disabled');
      this.isDisabled = false;
    } else {
      console.log('no hay nada');
      this.isDisabled = true;
    }
  }

   /* Esta función decide si el boton debe estar activo (si hay al menos
  una fila seleccionada) o si debe estar desactivado (si no hay ninguna fila seleccionada) */
  ActualizarBoton() {
    if (this.selection.selected.length === 0) {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
  }

  Disabled() {

      if (this.seleccionados.filter(res => res === true)[0] !== undefined) {
        console.log('Hay alguno seleccionado');
        this.BotonDesactivado();
      } else {
        console.log('No hay alguno seleccionado');
        this.isDisabled = true;

      }

    }

  AnadirPuntos() {
 // Tengo que hacer un recorrido diferente del dataSource porque necesito saber el
    // valor de i

    let NuevaPuntuacion: number;
    NuevaPuntuacion = Number(this.myForm1.value.NuevaPuntuacion);
    console.log('Voy a asignar NuevaPuntuacion ' + NuevaPuntuacion);
    if (!isNaN(NuevaPuntuacion)) {
      for ( let i = 0; i < this.dataSource.data.length; i++) {

          // Buscamos los alumnos que hemos seleccionado
          if (this.selection.isSelected(this.dataSource.data[i]))  {
            console.log('Voy a asignar tantos puntos ' + NuevaPuntuacion);
            console.log(this.Puntuacion[i]);
            console.log(NuevaPuntuacion);
            this.Puntuacion[i] = NuevaPuntuacion;
            console.log(this.Puntuacion);
            this.TablaPuntuacion[i].Puntuacion = NuevaPuntuacion;
            console.log(this.TablaPuntuacion[i]);
          }
        }
    } else {
      Swal.fire('Introduzca una puntuación válida', 'Le recordamos que debe ser un Número', 'error');
    }

    this.dataSource = new MatTableDataSource (this.TablaPuntuacion);
    this.selection.clear();
    this.botonTablaDesactivado = true;

  }
  AnadirJugadorconPuntos() {

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

  EliminarJugadorconPuntos() {

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

  ActualizarBotonPaso1() {
    let NombredelJuego: string;
    NombredelJuego = this.myForm2.value.NombredelJuego;
    if ( NombredelJuego === undefined) {
      this.isDisabledNombre = true;
    } else {
      this.isDisabledNombre = false;
    }
  }

  ActualizarBotonPasoJornadas() {
    let NumeroDeJornadas: number;
    NumeroDeJornadas = this.myForm.value.NumeroDeJornadas;
    console.log('Estoy en Actualizar boton');
    if ( NumeroDeJornadas === undefined || isNaN(NumeroDeJornadas)) {
      this.isDisabledJornadas = true;
      Swal.fire('Introduzca un número de jornadas válido', 'Le recordamos que debe ser un Número', 'error');
    } else {
      this.isDisabledJornadas = false;
    }
  }

  NumeroDeVueltas() {

    if (this.alumnosGrupo.length % 2 === 0) {
      this.NumeroDeVueltasValueInd = this.alumnosGrupo.length - 1;
    } else {
      this.NumeroDeVueltasValueInd = this.alumnosGrupo.length;
    }
    console.log(this.NumeroDeVueltasValueInd);

    if (this.equiposGrupo.length % 2 === 0) {
      this.NumeroDeVueltasValueEqu = this.equiposGrupo.length - 1;
    } else {
      this.NumeroDeVueltasValueEqu = this.equiposGrupo.length;
    }
    console.log(this.NumeroDeVueltasValueEqu);
  }
}

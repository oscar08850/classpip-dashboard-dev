import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

// Clases
import { Juego, Jornada, TablaJornadas, EnfrentamientoTorneo, Alumno, Equipo, AlumnoJuegoDePuntos,
  EquipoJuegoDePuntos, AlumnoJuegoDeCuestionario, AlumnoJuegoDeVotacionUnoATodos} from '../../../../clases/index';

// Services
import { SesionService, CalculosService, PeticionesAPIService } from '../../../../servicios/index';
import {MatTableDataSource} from '@angular/material/table';

import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { analyzeAndValidateNgModules } from '@angular/compiler';

export interface Asignacion {
  modo: string;
  id: number;
}

const ModoAsignacion: Asignacion[] = [
  {modo: 'Manualmente', id: 1},
  {modo: 'Aleatoriamente', id: 2},
  {modo: 'Según resultados de un juego', id: 3}
];

@Component({
  selector: 'app-ganador-juego-de-competicion-torneo',
  templateUrl: './ganador-juego-de-competicion-torneo.component.html',
  styleUrls: ['./ganador-juego-de-competicion-torneo.component.scss']
})
export class GanadorJuegoDeCompeticionTorneoComponent implements OnInit {

  /* Estructura necesaria para determinar que filas son las que se han seleccionado */
  selectionUno = new SelectionModel<any>(true, []);
  selectionDos = new SelectionModel<any>(true, []);
  botonAsignarAleatorioDesactivado = true;
  botonAsignarManualDesactivado = true;
  botonAsignarJuegoDesactivado = true;

  modoAsignacion: Asignacion[] = ModoAsignacion;


  // Juego De CompeticionTorneo seleccionado
  juegoSeleccionado: Juego;
  numeroTotalJornadas: number;
  jornadasDelJuego: Jornada[];
  JornadasCompeticion: TablaJornadas[] = [];
  jornadaId: number;
  jornadaSiguiente : number;
  juegoDisponibleSeleccionadoID: number;
  juegoDisponibleSeleccionado: Juego;
  modoAsignacionId: number;


  // Información de la tabla: Muestra el JugadorUno, JugadorDos, Ganador, JornadaDeCompeticionTorneoId y id
  EnfrentamientosJornadaSeleccionada: EnfrentamientoTorneo[] = [];
  EnfrentamientosGanadoresJornadaSeleccionada: EnfrentamientoTorneo[] = [];
  EnfrentamientosPerdedoresJornadaSeleccionada: EnfrentamientoTorneo[] = [];
  EnfrentamientosPerdedores: Array<Array<EnfrentamientoTorneo>>;
  listaPerdedores: Array<number>;
  listaGanadoresPerdedores: number[];
  listaGanadores: number[];
  resultados: number[];


  


  // Alumnos y Equipos del Juego
   alumnosDelJuego: Alumno[];
   equiposDelJuego: Equipo[];

  listaAlumnosJuegoDePuntos: AlumnoJuegoDePuntos[];
  listaEquiposJuegoDePuntos: EquipoJuegoDePuntos[];
  listaAlumnosJuegoDeCuestionario: AlumnoJuegoDeCuestionario[];
  listaAlumnosJuegoDeVotacionUnoATodos: AlumnoJuegoDeVotacionUnoATodos[];
  juegosDisponibles: Juego[];
  juegosActivosPuntosModo: Juego[];
  NumeroDeJuegoDePuntos: number;
  

  dataSourceTablaGanadorIndividual;
  dataSourceTablaGanadorEquipo;

  dataSourceTablaPerdedoresIndividual;
  dataSourceTablaPerdedoresEquipo;


  displayedColumnsAlumno: string[] = ['select1', 'nombreJugadorUno', 'select2', 'nombreJugadorDos'];

  asignados: boolean;

  constructor( public sesion: SesionService,
               public location: Location,
               public calculos: CalculosService,
               public peticionesAPI: PeticionesAPIService) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    const datos = this.sesion.DameDatosJornadas();
    this.JornadasCompeticion = datos.JornadasCompeticion;
    this.jornadasDelJuego = datos.jornadas;
    this.numeroTotalJornadas = datos.jornadas.length;
   
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.alumnosDelJuego = this.sesion.DameAlumnoJuegoDeCompeticionTorneo();
    } else {
      this.equiposDelJuego = this.sesion.DameEquipoJuegoDeCompeticionTorneo();
    } // Selecciono los juegos entre los que puedo elegir para decidir resultados
    // Son los juegos de puntos (tanto activos como acabados) y los juegos de cuestionario acabados
    this.juegosDisponibles = this.sesion.DameJuegosDePuntos().filter (juego => juego.Modo === this.juegoSeleccionado.Modo);
    // tslint:disable-next-line:max-line-length
    this.juegosDisponibles = this.juegosDisponibles.concat (this.sesion.DameJuegosDeCuestionariosAcabados());
    this.juegosDisponibles = this.juegosDisponibles.concat (this.sesion.DameJuegosDeVotacionUnoATodosAcabados());
    console.log ('Juegos para elegir ganadores ');
    console.log (this.juegosDisponibles);
    this.asignados = false;
  }
  ////////////////// FUNCIONES PARA OBTENER LOS DATOS NECESARIOS //////////////////////////
  ObtenerEnfrentamientosDeCadaJornada(jornadaId: number) {
    this.peticionesAPI.DameEnfrentamientosDeCadaJornadaTorneo(jornadaId)
    .subscribe(enfrentamientos => {
      this.EnfrentamientosJornadaSeleccionada = enfrentamientos;
      this.ConstruirTablaElegirGanador();
    });
  }



  ActualizarTablaClasificacion() {
    console.log('Estoy en ActualizarTablaClasificacion()');
    const jornadaActualizada = this.JornadasCompeticion.filter (jornada => jornada.id === Number(this.jornadaId))[0];
    jornadaActualizada.Disputada = true;
    for (let i = 0; i < this.JornadasCompeticion.length; i++) {
      if (this.JornadasCompeticion[i].id === Number(this.jornadaId)) {
        this.JornadasCompeticion[i] = jornadaActualizada;
      }
    }
  }

  // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen
  RecuperarInscripcionesAlumnosJuegoPuntos() {
    console.log ('voy a por las inscripciones ' + Number(this.juegoDisponibleSeleccionadoID));
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDePuntos(Number(this.juegoDisponibleSeleccionadoID))
    .subscribe(inscripciones => {
      this.listaAlumnosJuegoDePuntos = inscripciones;
      console.log (this.listaAlumnosJuegoDePuntos);
    });
  }

  // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen
  RecuperarInscripcionesEquiposJuegoPuntos() {
    console.log ('vamos por las inscripciones ' + Number(this.juegoDisponibleSeleccionadoID));
    this.peticionesAPI.DameInscripcionesEquipoJuegoDePuntos(Number(this.juegoDisponibleSeleccionadoID))
    .subscribe(inscripciones => {
      this.listaEquiposJuegoDePuntos = inscripciones;
      console.log(this.listaEquiposJuegoDePuntos);
      console.log ('ya tengo las inscripciones');
    });
  }

  RecuperarInscripcionesAlumnosJuegoCuestionario() {
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeCuestionario(this.juegoDisponibleSeleccionadoID)
    .subscribe(inscripciones => {
      this.listaAlumnosJuegoDeCuestionario = inscripciones;
    });
  }

  RecuperarInscripcionesAlumnosJuegoDeVotacionUnoATodos() {
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeVotacionUnoATodos(this.juegoDisponibleSeleccionadoID)
    .subscribe(inscripciones => {
      this.listaAlumnosJuegoDeVotacionUnoATodos = inscripciones;
    });

  }


  Disputada(jornadaId): boolean {
      return this.JornadasCompeticion.filter (jornada => jornada.id === Number(jornadaId))[0].Disputada;
  }

  ConstruirTablaElegirGanador() {
    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('Estoy en ConstruirTablaElegirGanador() alumnos');
      // tslint:disable-next-line:prefer-for-of
      this.EnfrentamientosGanadoresJornadaSeleccionada = [];
      this.EnfrentamientosPerdedoresJornadaSeleccionada = [];
      for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {
        // tslint:disable-next-line:max-line-length
        
            if (this.EnfrentamientosJornadaSeleccionada[i].JugadorUno !== 0) {
            const JugadorUno = this.alumnosDelJuego.filter (alumno => alumno.id === this.EnfrentamientosJornadaSeleccionada[i].JugadorUno )[0];
            // tslint:disable-next-line:max-line-length
            console.log(JugadorUno);
            this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno = JugadorUno.Nombre + ' ' + JugadorUno.PrimerApellido + ' ' + JugadorUno.SegundoApellido;
            // tslint:disable-next-line:max-line-length
            } else {
              this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno ='Jugador fantasma';
            }
            if (this.EnfrentamientosJornadaSeleccionada[i].JugadorDos !== 0) {
            const JugadorDos = this.alumnosDelJuego.filter (alumno => alumno.id === this.EnfrentamientosJornadaSeleccionada[i].JugadorDos)[0];
            // tslint:disable-next-line:max-line-length
            this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos = JugadorDos.Nombre + ' ' + JugadorDos.PrimerApellido + ' ' + JugadorDos.SegundoApellido;
            } else{
              this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos ='Jugador fantasma';
            }
            if (this.EnfrentamientosJornadaSeleccionada[i].perdedor === undefined) {
              this.EnfrentamientosGanadoresJornadaSeleccionada.push(this.EnfrentamientosJornadaSeleccionada[i]);
            }else{
              this.EnfrentamientosPerdedoresJornadaSeleccionada.push(this.EnfrentamientosJornadaSeleccionada[i]);
            }
          
      }
      if (this.juegoSeleccionado.ModeloTorneo === 'Clásico' ) {
        console.log(this.EnfrentamientosJornadaSeleccionada);
        this.dataSourceTablaGanadorIndividual = new MatTableDataSource(this.EnfrentamientosJornadaSeleccionada);
        console.log('El dataSource :');
        console.log(this.dataSourceTablaGanadorIndividual.data);
        }
      // Ahora vamos a marcar los resultados en caso de que la jornada se haya disputado ya


      if (this.Disputada (this.jornadaId)) {
        // tslint:disable-next-line:prefer-for-of
        if (this.juegoSeleccionado.ModeloTorneo === 'Clásico' ) {
        for (let i = 0; i < this.EnfrentamientosGanadoresJornadaSeleccionada.length; i++) {
          if (this.EnfrentamientosGanadoresJornadaSeleccionada[i].Ganador === this.EnfrentamientosGanadoresJornadaSeleccionada[i].JugadorUno) {
            this.selectionUno.select(this.dataSourceTablaGanadorIndividual.data[i]);
          } else if (this.EnfrentamientosGanadoresJornadaSeleccionada[i].Ganador === this.EnfrentamientosGanadoresJornadaSeleccionada[i].JugadorDos) {
            this.selectionDos.select(this.dataSourceTablaGanadorIndividual.data[i]);
          } 

        }
      }
      }
      

    } else {
      console.log('Estoy en ConstruirTablaElegirGanador() equipos');
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {
         // tslint:disable-next-line:max-line-length
         if (this.EnfrentamientosJornadaSeleccionada[i].JugadorUno !== 0) {
          const EquipoUno = this.equiposDelJuego.filter (equipo => equipo.id === this.EnfrentamientosJornadaSeleccionada[i].JugadorUno )[0];
         // tslint:disable-next-line:max-line-length
         console.log(EquipoUno);
         this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno = EquipoUno.Nombre;
         }
         else {
          this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno ='Equipo fantasma';
        }
        if (this.EnfrentamientosJornadaSeleccionada[i].JugadorDos !== 0) {
         // tslint:disable-next-line:max-line-length
         const EquipoDos = this.equiposDelJuego.filter (equipo => equipo.id === this.EnfrentamientosJornadaSeleccionada[i].JugadorDos)[0];
         // tslint:disable-next-line:max-line-length
         console.log(EquipoDos);
         this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos = EquipoDos.Nombre;
        }
        else {
         this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos ='Equipo fantasma';
       }

      }
      console.log(this.EnfrentamientosJornadaSeleccionada);
      this.dataSourceTablaGanadorEquipo = new MatTableDataSource(this.EnfrentamientosJornadaSeleccionada);
      console.log('El dataSource es:');
      console.log(this.dataSourceTablaGanadorEquipo.data);

      if (this.Disputada (this.jornadaId)) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {
          if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === this.EnfrentamientosJornadaSeleccionada[i].JugadorUno) {
            this.selectionUno.select(this.dataSourceTablaGanadorEquipo.data[i]);
          } else if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === this.EnfrentamientosJornadaSeleccionada[i].JugadorDos) {
            this.selectionDos.select(this.dataSourceTablaGanadorEquipo.data[i]);
          } 
        }
      }

    }
   

  }

  //////// FUNCIONES PARA CONTROLAR LOS BOTONES Y LOS CHECKBOX ////////////////////////////


  // Esta función se ejecuta al seleccionar el modo de asignación
  SeleccionaModo() {
    console.log ('SeleccionaModo' + this.modoAsignacionId);
    // activamos el boton correspondiente si se eligió manual ao aleatorio
    if (Number(this.modoAsignacionId) === 1) { // Manual
        this.botonAsignarAleatorioDesactivado = true;
        this.botonAsignarManualDesactivado = false;
        this.botonAsignarJuegoDesactivado = true;
    } else if (Number(this.modoAsignacionId) === 2) { // Aleatorio
        this.botonAsignarManualDesactivado = true;
        this.botonAsignarAleatorioDesactivado = false;
        this.botonAsignarJuegoDesactivado = true;
    // Si se elijió asignación por juego de puntos y no hay juego de puntos para elegir se muestra una alarma
    // Si  hay juego de puntos no se hace nada porque ya aparecerá automáticamente el selector del juego
      } else if ((Number(this.modoAsignacionId) === 3) && (this.juegosDisponibles.length === 0)) { // JuegoPuntos
        this.botonAsignarManualDesactivado = true;
        this.botonAsignarAleatorioDesactivado = true;
        this.botonAsignarJuegoDesactivado = true;
        console.log ('Aviso');
        Swal.fire('Cuidado', 'No hay juegos finalizados disponibles para este grupo', 'warning');
      } else {
        console.log ('Salgo');
        console.log ('juegos disponibles');
        console.log (this.juegosDisponibles);
      }
  }

  // Me traigo el juego elegido para decidir los resultados de la jornada
  TraerJuegoDisponibleSeleccionado() {
    this.ObtenerEnfrentamientosDeCadaJornada(this.jornadaId);
    this.botonAsignarManualDesactivado = true;
    this.botonAsignarAleatorioDesactivado = true;
    this.botonAsignarJuegoDesactivado = false;
    console.log ('ID del juego seleccionado ' + this.juegoDisponibleSeleccionadoID);
    console.log (this.juegosDisponibles);
    this.juegoDisponibleSeleccionado = this.juegosDisponibles.filter (juego => juego.id === Number (this.juegoDisponibleSeleccionadoID))[0];
    console.log ('ya he seleccionado el juego');
    console.log (this.juegoDisponibleSeleccionado);
    if ( this.juegoDisponibleSeleccionado.Tipo === 'Juego De Puntos') {
      if (this.juegoSeleccionado.Modo === 'Individual') {
        this.RecuperarInscripcionesAlumnosJuegoPuntos();
      } else {
        this.RecuperarInscripcionesEquiposJuegoPuntos();
      }
    } else if ( this.juegoDisponibleSeleccionado.Tipo === 'Juego De Cuestionario') {
      // De momento solo hay individual
      this.RecuperarInscripcionesAlumnosJuegoCuestionario();
    } else if ( this.juegoDisponibleSeleccionado.Tipo === 'Juego De Votación Uno A Todos') {
      // De momento solo hay individual
      this.RecuperarInscripcionesAlumnosJuegoDeVotacionUnoATodos();
    }
  }

  /* Esta función decide si los botones deben estar activos (si se ha seleccionado la jornada)
     o si debe estar desactivado (si no se ha seleccionado la jornada) */
  SeleccionaJornada() {
    console.log('Estoy en actualizar botón');
    let jornadaAnterior : number;
    console.log (this.jornadaId);
    jornadaAnterior = this.jornadaId -1;
    console.log (jornadaAnterior);
    console.log (this.JornadasCompeticion[0].id);
    if (this.jornadaId == this.JornadasCompeticion[0].id) {
          this.ObtenerEnfrentamientosDeCadaJornada(this.jornadaId);
          console.log(this.modoAsignacionId);
          if (this.modoAsignacionId === undefined || this.jornadaId === undefined) {
            this.botonAsignarAleatorioDesactivado = true;
            this.botonAsignarManualDesactivado = true;
            this.botonAsignarJuegoDesactivado = true;
          } else if (Number(this.modoAsignacionId) === 1) { // Manual
            console.log('Modo manual');
            this.botonAsignarAleatorioDesactivado = true;
            this.botonAsignarManualDesactivado = false;
            this.botonAsignarJuegoDesactivado = true;
            this.ObtenerEnfrentamientosDeCadaJornada(this.jornadaId);
          } else if (Number(this.modoAsignacionId) === 2) { // Aleatorio
            console.log('Modo aleatorio');
            this.botonAsignarManualDesactivado = true;
            this.botonAsignarAleatorioDesactivado = false;
            this.botonAsignarJuegoDesactivado = true;
            this.ObtenerEnfrentamientosDeCadaJornada(this.jornadaId);
          } else if (Number(this.modoAsignacionId) === 3 && this.juegosDisponibles.length !== 0) { // JuegoPuntos
            console.log('Modo puntos');
            this.botonAsignarManualDesactivado = true;
            this.botonAsignarAleatorioDesactivado = true;
            this.botonAsignarJuegoDesactivado = false;
            this.ObtenerEnfrentamientosDeCadaJornada(this.jornadaId);
            this.ActualizarBotonJuego();
          } else if (Number(this.modoAsignacionId) === 3 && this.juegosDisponibles.length === 0) { // JuegoPuntos
            this.botonAsignarManualDesactivado = true;
            this.botonAsignarAleatorioDesactivado = true;
            this.botonAsignarJuegoDesactivado = true;
            Swal.fire('Cuidado', 'No hay juegos disponibles para este este grupo', 'warning');
          }
    } 
   else if (!this.Disputada(jornadaAnterior)){
      Swal.fire('Cuidado, no se ha jugado la jornada anterior');
      this.location.back();
    } else {
      this.ObtenerEnfrentamientosDeCadaJornada(this.jornadaId);
      console.log(this.modoAsignacionId);
      if (this.modoAsignacionId === undefined || this.jornadaId === undefined) {
        this.botonAsignarAleatorioDesactivado = true;
        this.botonAsignarManualDesactivado = true;
        this.botonAsignarJuegoDesactivado = true;
      } else if (Number(this.modoAsignacionId) === 1) { // Manual
        console.log('Modo manual');
        this.botonAsignarAleatorioDesactivado = true;
        this.botonAsignarManualDesactivado = false;
        this.botonAsignarJuegoDesactivado = true;
        this.ObtenerEnfrentamientosDeCadaJornada(this.jornadaId);
      } else if (Number(this.modoAsignacionId) === 2) { // Aleatorio
        console.log('Modo aleatorio');
        this.botonAsignarManualDesactivado = true;
        this.botonAsignarAleatorioDesactivado = false;
        this.botonAsignarJuegoDesactivado = true;
        this.ObtenerEnfrentamientosDeCadaJornada(this.jornadaId);
      } else if (Number(this.modoAsignacionId) === 3 && this.juegosDisponibles.length !== 0) { // JuegoPuntos
        console.log('Modo puntos');
        this.botonAsignarManualDesactivado = true;
        this.botonAsignarAleatorioDesactivado = true;
        this.botonAsignarJuegoDesactivado = false;
        this.ObtenerEnfrentamientosDeCadaJornada(this.jornadaId);
        this.ActualizarBotonJuego();
      } else if (Number(this.modoAsignacionId) === 3 && this.juegosDisponibles.length === 0) { // JuegoPuntos
        this.botonAsignarManualDesactivado = true;
        this.botonAsignarAleatorioDesactivado = true;
        this.botonAsignarJuegoDesactivado = true;
        Swal.fire('Cuidado', 'No hay juegos disponibles para este este grupo', 'warning');
      }
  }
  }

  ActualizarBotonJuego() {
    this.juegoDisponibleSeleccionado = this.juegosDisponibles.filter (juego => juego.id === Number (this.juegoDisponibleSeleccionadoID))[0];
    console.log ('ya he seleccionado el juego');
    console.log (this.juegoDisponibleSeleccionado);
    if ( this.juegoDisponibleSeleccionado.Tipo === 'Juego De Puntos') {
      if (this.juegoSeleccionado.Modo === 'Individual') {
        this.RecuperarInscripcionesAlumnosJuegoPuntos();
      } else {
        this.RecuperarInscripcionesEquiposJuegoPuntos();
      }
    } else {
      // Tiene que ser de cuestionario, y de momento solo hay individual
      this.RecuperarInscripcionesAlumnosJuegoCuestionario();
    }
  }

  // Cuando marco una casilla desmarco las otras casillas de esa fila
   Verificar(row, n) {
    if (n === 1) {
      this.selectionDos.deselect(row);
    }
    if (n === 2) {
      this.selectionUno.deselect(row);
    }
  }

  ////////////// FUNCIONES PARA ASIGNAR LOS RESULTADOS ///////////////////////////

  AsignarGanadorManualmente() {
    // tslint:disable-next-line:no-inferrable-types
    
      let error: boolean = false;
      this.resultados= [];
      let dataSource: any;
      let dataSourceEliminacion: any;
      if (this.juegoSeleccionado.Modo === 'Individual') {
        dataSource = this.dataSourceTablaGanadorIndividual;
        dataSourceEliminacion = this.dataSourceTablaPerdedoresIndividual;
      } else {
        dataSource = this.dataSourceTablaGanadorEquipo;
        dataSourceEliminacion = this.dataSourceTablaPerdedoresEquipo;
      }
        // tslint:disable-next-line:prefer-for-of
      
      this.listaGanadores=[];
      this.listaGanadoresPerdedores=[];
      this.listaPerdedores=[];
      console.log ('listaganadores vacia?');
      console.log (this.listaGanadores);
      this.ObtenerEnfrentamientosDeCadaJornada(this.jornadaId);
      dataSource.data.forEach (row => {
          console.log (row.JugadorUno);
          console.log (row.JugadorDos);
          
          if (this.selectionUno.isSelected(row) && row.JugadorUno !==0) {
            
            this.resultados.push (1);
            this.listaGanadores.push(row.JugadorUno);
            this.listaPerdedores.push(row.JugadorDos);
            
           
            
          } else if (this.selectionUno.isSelected(row) && row.JugadorUno ===0) {
            Swal.fire('El jugador fantasma no puede ganar el enfrentamiento, seleccione al otro jugador');
            error = true; 
          } else if (this.selectionDos.isSelected(row)&& row.JugadorDos !==0) {
            this.resultados.push (2);
            this.listaGanadores.push(row.JugadorDos);
            this.listaPerdedores.push(row.JugadorUno);
            
                
          } else if (this.selectionDos.isSelected(row) && row.JugadorDos ===0) {
            Swal.fire('El jugador fantasma no puede ganar el enfrentamiento, seleccione al otro jugador');
            error = true;
          }
          else {
                Swal.fire('Cuidado', 'No se han seleccionado resultados para todos los enfrentamientos de la jornada', 'warning');
                error = true;
          }
      });
      console.log( this.resultados);
      console.log('resultados');
      console.log(this.listaGanadores);
      console.log('listaganadores');
      console.log(this.listaPerdedores);
      console.log('perdedores');

      if (!error) {
        
        console.log(this.jornadaId);
        const numEnfrentamientos =  this.resultados.length / 2;
        console.log(numEnfrentamientos);
        if (this.EnfrentamientosGanadoresJornadaSeleccionada.length > 1) {
        let EnfrentamientosTorneo: EnfrentamientoTorneo;
        this.jornadaSiguiente= Number(this.jornadaId) + 1;
        console.log(this.jornadaSiguiente);
            for (let i = 0, j= 0; i < numEnfrentamientos ; i++,j=j+2) {
              
                EnfrentamientosTorneo= new EnfrentamientoTorneo (this.listaGanadores[j], this.listaGanadores[j+1], undefined, this.jornadaSiguiente);
                console.log(EnfrentamientosTorneo);
            
              this.peticionesAPI.CrearEnfrentamientoTorneo(EnfrentamientosTorneo,this.jornadaSiguiente)
              .subscribe(enfrentamientocreado => {
              console.log('enfrentamiento creado');
              console.log(enfrentamientocreado);
              });

        }
        Swal.fire('Enhorabuena', 'Resutados asignados manualmente', 'success');
        this.calculos.AsignarResultadosJornadaTorneo(this.juegoSeleccionado , this.jornadaId,  this.resultados);
        this.asignados = true;
        this.ActualizarTablaClasificacion();


      } else {
        if (this.juegoSeleccionado.Modo === 'Individual') {
          const ganador = this.alumnosDelJuego.filter (alumno => alumno.id === Number(this.listaGanadores))[0];
          console.log(ganador.Nombre);
          this.calculos.AsignarResultadosJornadaTorneo(this.juegoSeleccionado , this.jornadaId,  this.resultados);
          this.asignados = true;
          this.ActualizarTablaClasificacion();
          Swal.fire('El torneo ha finalizado, el ganador es: ' + ganador.Nombre + ganador.PrimerApellido + ganador.SegundoApellido);
          this.location.back();
        } else {
          const ganador = this.equiposDelJuego.filter (equipo => equipo.id === Number(this.listaGanadores))[0];
          console.log(ganador.Nombre);
          this.calculos.AsignarResultadosJornadaTorneo(this.juegoSeleccionado , this.jornadaId,  this.resultados);
          this.asignados = true;
          this.ActualizarTablaClasificacion();
          Swal.fire('El torneo ha finalizado, el ganador es: ' + ganador.Nombre);
          this.location.back();
        }
      }
    }    
  }
      

  AsignarGanadorAleatoriamente() {
    // tslint:disable-next-line:prefer-for-of
  
    const resultados: number[] = [];
    let listaGanadores: number[];
    listaGanadores=[];
    console.log ('listaganadores vacia?');
    console.log (listaGanadores);
    for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {
      const random = Math.random();
      console.log('Random ' + i + ' = ' + random);
    
      if (this.EnfrentamientosJornadaSeleccionada[i].JugadorUno !==0 && this.EnfrentamientosJornadaSeleccionada[i].JugadorDos !==0) {
        if (random < 0.5) {
          resultados.push (1);
          listaGanadores.push(this.EnfrentamientosJornadaSeleccionada[i].JugadorUno);
          if (this.juegoSeleccionado.Modo === 'Individual') {
            
            this.selectionUno.select(this.dataSourceTablaGanadorIndividual.data[i]);
          } else {
            this.selectionUno.select(this.dataSourceTablaGanadorEquipo.data[i]);
          }

        } else if (random >= 0.5) {
          resultados.push (2);
          listaGanadores.push(this.EnfrentamientosJornadaSeleccionada[i].JugadorDos);
          if (this.juegoSeleccionado.Modo === 'Individual') {
            this.selectionDos.select(this.dataSourceTablaGanadorIndividual.data[i]);
          } else {
            this.selectionDos.select(this.dataSourceTablaGanadorEquipo.data[i]);
          }

        } 
      } else if (this.EnfrentamientosJornadaSeleccionada[i].JugadorUno ===0) {
          console.log('Primer jugador fantasma');
          resultados.push (2);
          listaGanadores.push(this.EnfrentamientosJornadaSeleccionada[i].JugadorDos);
          if (this.juegoSeleccionado.Modo === 'Individual') {
            this.selectionDos.select(this.dataSourceTablaGanadorIndividual.data[i]);
          } else {
            this.selectionDos.select(this.dataSourceTablaGanadorEquipo.data[i]);
          }
      } else if (this.EnfrentamientosJornadaSeleccionada[i].JugadorDos ===0) {
          console.log('Segundo jugador fantasma');
          resultados.push (1);
          listaGanadores.push(this.EnfrentamientosJornadaSeleccionada[i].JugadorUno);
          if (this.juegoSeleccionado.Modo === 'Individual') {
            this.selectionUno.select(this.dataSourceTablaGanadorIndividual.data[i]);
          } else {
            this.selectionUno.select(this.dataSourceTablaGanadorEquipo.data[i]);
          }
        }
    }
    console.log(resultados);
    console.log('resultados');
    console.log(listaGanadores);
    this.calculos.AsignarResultadosJornadaTorneo(this.juegoSeleccionado , this.jornadaId, resultados);
    const numEnfrentamientos = resultados.length / 2;
    console.log(numEnfrentamientos);
    if (numEnfrentamientos>=1) {
      let EnfrentamientosTorneo: EnfrentamientoTorneo;
      this.jornadaSiguiente= Number(this.jornadaId) + 1;
      console.log(this.jornadaSiguiente);
        for (let i = 0, j= 0; i < numEnfrentamientos ; i++,j=j+2) {
            
            EnfrentamientosTorneo= new EnfrentamientoTorneo (listaGanadores[j], listaGanadores[j+1], undefined, this.jornadaSiguiente);
            console.log(EnfrentamientosTorneo);
        
          this.peticionesAPI.CrearEnfrentamientoTorneo(EnfrentamientosTorneo,this.jornadaSiguiente)
          .subscribe(enfrentamientocreado => {
          console.log('enfrentamiento creado');
          console.log(enfrentamientocreado);
          });
        }
      
      Swal.fire('Enhorabuena', 'Resutados asignados aleatoriamente', 'success');
      this.asignados = true;
      this.ActualizarTablaClasificacion();
    } else{
      if (this.juegoSeleccionado.Modo === 'Individual') {
        const ganador = this.alumnosDelJuego.filter (alumno => alumno.id === Number(listaGanadores))[0];
        console.log(ganador.Nombre);
        Swal.fire('El torneo ha finalizado, el ganador es: ' + ganador.Nombre + ganador.PrimerApellido + ganador.SegundoApellido);
        this.location.back();
      } else {
        const ganador = this.equiposDelJuego.filter (equipo => equipo.id === Number(listaGanadores))[0];
        console.log(ganador.Nombre);
        Swal.fire('El torneo ha finalizado, el ganador es: ' + ganador.Nombre);
        this.location.back();
      }



      
      
    }
  }

  AsignarGanadoresJuegoDisponibleSeleccionado() {
    const resultados: number [] = [];
    let listaGanadores: number[];
    listaGanadores=[];
    if (this.juegoDisponibleSeleccionado.Tipo === 'Juego De Puntos') {

      if (this.juegoDisponibleSeleccionado.Modo === 'Individual') {

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {

          // Saco al jugador uno de la lista de participantes del juego de puntos
          // tslint:disable-next-line:max-line-length
          if (this.EnfrentamientosJornadaSeleccionada[i].JugadorUno !==0 && this.EnfrentamientosJornadaSeleccionada[i].JugadorDos !==0) {
          // tslint:disable-next-line:max-line-length
            const JugadorUno = this.listaAlumnosJuegoDePuntos.filter (a => a.alumnoId === Number (this.EnfrentamientosJornadaSeleccionada[i].JugadorUno))[0];
            // tslint:disable-next-line:max-line-length
            const JugadorDos = this.listaAlumnosJuegoDePuntos.filter (a => a.alumnoId === Number (this.EnfrentamientosJornadaSeleccionada[i].JugadorDos))[0];
            
            if (JugadorUno.PuntosTotalesAlumno > JugadorDos.PuntosTotalesAlumno) {
              resultados.push (1);
              listaGanadores.push(this.EnfrentamientosJornadaSeleccionada[i].JugadorUno);
              this.selectionUno.select(this.dataSourceTablaGanadorIndividual.data[i]);

            } else  if (JugadorUno.PuntosTotalesAlumno < JugadorDos.PuntosTotalesAlumno) {
              resultados.push (2);
              listaGanadores.push(this.EnfrentamientosJornadaSeleccionada[i].JugadorDos);
              this.selectionDos.select(this.dataSourceTablaGanadorIndividual.data[i]);

            } else { // Empate: Se hará aleatoriamente
              const random = Math.random();
              console.log('Random ' + i + ' = ' + random);
              
                if (random < 0.5) {
                  resultados.push (1);
                  listaGanadores.push(this.EnfrentamientosJornadaSeleccionada[i].JugadorUno);
                  this.selectionUno.select(this.dataSourceTablaGanadorIndividual.data[i]);

                } else if (random >= 0.5) {
                  resultados.push (2);
                  listaGanadores.push(this.EnfrentamientosJornadaSeleccionada[i].JugadorDos);
                  this.selectionDos.select(this.dataSourceTablaGanadorIndividual.data[i]);
                } 
                Swal.fire('Empate! Se ha seleccionado un ganador aleatoriamente');
            }
              
          } else if (this.EnfrentamientosJornadaSeleccionada[i].JugadorUno ===0) {
            console.log('Primer jugador fantasma');
            resultados.push (2);
            listaGanadores.push(this.EnfrentamientosJornadaSeleccionada[i].JugadorDos);
              this.selectionDos.select(this.dataSourceTablaGanadorIndividual.data[i]);
          } else if (this.EnfrentamientosJornadaSeleccionada[i].JugadorDos ===0) {
            console.log('Segundo jugador fantasma');
            resultados.push (1);
            listaGanadores.push(this.EnfrentamientosJornadaSeleccionada[i].JugadorUno);
            this.selectionUno.select(this.dataSourceTablaGanadorIndividual.data[i]);
          }
        }
      } else {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {
          if (this.EnfrentamientosJornadaSeleccionada[i].JugadorUno !==0 && this.EnfrentamientosJornadaSeleccionada[i].JugadorDos !==0) {
            // Saco al jugador uno de la lista de participantes del juego de puntos
            // tslint:disable-next-line:max-line-length
            const equipoUno = this.listaEquiposJuegoDePuntos.filter (a => a.equipoId === this.EnfrentamientosJornadaSeleccionada[i].JugadorUno)[0];
            // tslint:disable-next-line:max-line-length
            const equipoDos = this.listaEquiposJuegoDePuntos.filter (a => a.equipoId === this.EnfrentamientosJornadaSeleccionada[i].JugadorDos)[0];

            if (equipoUno.PuntosTotalesEquipo > equipoDos.PuntosTotalesEquipo) {
              resultados.push (1);
              listaGanadores.push(this.EnfrentamientosJornadaSeleccionada[i].JugadorUno);
              this.selectionUno.select(this.dataSourceTablaGanadorEquipo.data[i]);

            } else  if (equipoUno.PuntosTotalesEquipo < equipoDos.PuntosTotalesEquipo) {
              resultados.push (2);
              listaGanadores.push(this.EnfrentamientosJornadaSeleccionada[i].JugadorDos);
              this.selectionDos.select(this.dataSourceTablaGanadorEquipo.data[i]);

            } else {// Empate: Se hará aleatoriamente
              const random = Math.random();
              console.log('Random ' + i + ' = ' + random);
              
                if (random < 0.5) {
                  resultados.push (1);
                  listaGanadores.push(this.EnfrentamientosJornadaSeleccionada[i].JugadorUno);
                  this.selectionUno.select(this.dataSourceTablaGanadorEquipo.data[i]);

                } else if (random >= 0.5) {
                  resultados.push (2);
                  listaGanadores.push(this.EnfrentamientosJornadaSeleccionada[i].JugadorDos);
                  this.selectionDos.select(this.dataSourceTablaGanadorEquipo.data[i]);
                } 
                Swal.fire('Empate! Se ha seleccionado un ganador aleatoriamente');
            }
          }
        }
      }
    } else if (this.juegoDisponibleSeleccionado.Tipo === 'Juego De Cuestionario') {
      // El juego elegido es de cuestionario
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {
        if (this.EnfrentamientosJornadaSeleccionada[i].JugadorUno !==0 && this.EnfrentamientosJornadaSeleccionada[i].JugadorDos !==0) {
            // Saco al jugador uno de la lista de participantes del juego de cuestionario
            // tslint:disable-next-line:max-line-length

            // tslint:disable-next-line:max-line-length
            const JugadorUno = this.listaAlumnosJuegoDeCuestionario.filter (a => a.alumnoId === Number (this.EnfrentamientosJornadaSeleccionada[i].JugadorUno))[0];
            // tslint:disable-next-line:max-line-length
            const JugadorDos = this.listaAlumnosJuegoDeCuestionario.filter (a => a.alumnoId === Number (this.EnfrentamientosJornadaSeleccionada[i].JugadorDos))[0];

            if (JugadorUno.Nota > JugadorDos.Nota) {
              resultados.push (1);
              listaGanadores.push(this.EnfrentamientosJornadaSeleccionada[i].JugadorUno);
              this.selectionUno.select(this.dataSourceTablaGanadorIndividual.data[i]);

            } else  if (JugadorUno.Nota < JugadorDos.Nota) {
              resultados.push (2);
              listaGanadores.push(this.EnfrentamientosJornadaSeleccionada[i].JugadorDos);
              this.selectionDos.select(this.dataSourceTablaGanadorIndividual.data[i]);

            } else {
            // Empate: Se hará aleatoriamente
            const random = Math.random();
            console.log('Random ' + i + ' = ' + random);
            
              if (random < 0.5) {
                resultados.push (1);
                listaGanadores.push(this.EnfrentamientosJornadaSeleccionada[i].JugadorUno);
                this.selectionUno.select(this.dataSourceTablaGanadorIndividual.data[i]);

              } else if (random >= 0.5) {
                resultados.push (2);
                listaGanadores.push(this.EnfrentamientosJornadaSeleccionada[i].JugadorDos);
                this.selectionDos.select(this.dataSourceTablaGanadorIndividual.data[i]);
              } 
              Swal.fire('Empate! Se ha seleccionado un ganador aleatoriamente');
            }
        }
      }
    }  else if (this.juegoDisponibleSeleccionado.Tipo === 'Juego De Votación Uno A Todos') {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {
          if (this.EnfrentamientosJornadaSeleccionada[i].JugadorUno !==0 && this.EnfrentamientosJornadaSeleccionada[i].JugadorDos !==0) {
          // Saco al jugador uno de la lista de participantes del juego de votacion
          // tslint:disable-next-line:max-line-length

          // tslint:disable-next-line:max-line-length
          const JugadorUno = this.listaAlumnosJuegoDeVotacionUnoATodos.filter (a => a.alumnoId === Number (this.EnfrentamientosJornadaSeleccionada[i].JugadorUno))[0];
          // tslint:disable-next-line:max-line-length
          const JugadorDos = this.listaAlumnosJuegoDeVotacionUnoATodos.filter (a => a.alumnoId === Number (this.EnfrentamientosJornadaSeleccionada[i].JugadorDos))[0];

          console.log (JugadorUno.alumnoId + ' versus ' + JugadorDos.alumnoId);
          console.log (JugadorUno.puntosTotales + ' versus ' + JugadorDos.puntosTotales);
          if (JugadorUno.puntosTotales > JugadorDos.puntosTotales) {
            resultados.push (1);
            listaGanadores.push(this.EnfrentamientosJornadaSeleccionada[i].JugadorUno);
            this.selectionUno.select(this.dataSourceTablaGanadorIndividual.data[i]);

          } else  if (JugadorUno.puntosTotales < JugadorDos.puntosTotales) {
            resultados.push (2);
            listaGanadores.push(this.EnfrentamientosJornadaSeleccionada[i].JugadorDos);
            this.selectionDos.select(this.dataSourceTablaGanadorIndividual.data[i]);

          } else {
            // Empate: Se hará aleatoriamente
            const random = Math.random();
            console.log('Random ' + i + ' = ' + random);
            
              if (random < 0.5) {
                resultados.push (1);
                listaGanadores.push(this.EnfrentamientosJornadaSeleccionada[i].JugadorUno);
                this.selectionUno.select(this.dataSourceTablaGanadorIndividual.data[i]);

              } else if (random >= 0.5) {
                resultados.push (2);
                listaGanadores.push(this.EnfrentamientosJornadaSeleccionada[i].JugadorDos);
                this.selectionDos.select(this.dataSourceTablaGanadorIndividual.data[i]);
              } 
              Swal.fire('Empate! Se ha seleccionado un ganador aleatoriamente');
          }
        }
    }
  }
  this.calculos.AsignarResultadosJornadaTorneo(this.juegoSeleccionado , this.jornadaId, resultados);
  const numEnfrentamientos = resultados.length / 2;
  console.log(numEnfrentamientos);
  if (numEnfrentamientos>=1) {
    let EnfrentamientosTorneo: EnfrentamientoTorneo;
    this.jornadaSiguiente= Number(this.jornadaId) + 1;
    console.log(this.jornadaSiguiente);
      for (let i = 0, j= 0; i < numEnfrentamientos ; i++,j=j+2) {
          
          EnfrentamientosTorneo= new EnfrentamientoTorneo (listaGanadores[j], listaGanadores[j+1], undefined, this.jornadaSiguiente);
          console.log(EnfrentamientosTorneo);
      
        this.peticionesAPI.CrearEnfrentamientoTorneo(EnfrentamientosTorneo,this.jornadaSiguiente)
        .subscribe(enfrentamientocreado => {
        console.log('enfrentamiento creado');
        console.log(enfrentamientocreado);
        });
      }
    
    Swal.fire('Enhorabuena', 'Resutados asignados mediante otro juego', 'success');
    this.asignados = true;
    this.ActualizarTablaClasificacion();
  } else{
    const ganador = this.alumnosDelJuego.filter (alumno => alumno.id === Number(listaGanadores))[0];
    console.log(ganador.Nombre);
    Swal.fire('El torneo ha finalizado, el ganador es: ' + ganador.Nombre + ganador.PrimerApellido + ganador.SegundoApellido);
    this.location.back();
  }
}




  goBack() {
    if (this.jornadaId === undefined) {
      this.location.back();
    } else if (!this.asignados && !this.Disputada(this.jornadaId)) {
      Swal.fire({
        title: '¿Estas seguro?',
        text: 'No has realizado la asignación',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, estoy seguro'
      }).then((result) => {
        if (result.value) {
          this.location.back();
        }
      });
    } else {
      this.location.back();
    }
  }


}

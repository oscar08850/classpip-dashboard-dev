import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

import { Alumno, Equipo, Juego, Punto, Nivel, AlumnoJuegoDePuntos, EquipoJuegoDePuntos,
  TablaAlumnoJuegoDePuntos, HistorialPuntosAlumno, TablaEquipoJuegoDePuntos, HistorialPuntosEquipo, Evento, Profesor, } from '../../../../clases/index';

// Services
import { SesionService, CalculosService, PeticionesAPIService, ComServerService } from '../../../../servicios/index';
import {MatTableDataSource} from '@angular/material/table';

import { Location } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-asignar-puntos',
  templateUrl: './asignar-puntos.component.html',
  styleUrls: ['./asignar-puntos.component.scss']
})
export class AsignarPuntosComponent implements OnInit {
  puntoSeleccionadoId: number;
  tiposPuntosDelJuego: Punto[];
  /* Estructura necesaria para determinar que filas son las que se han seleccionado */
  selection = new SelectionModel<any>(true, []);
  // Muestra la posición del alumno, el nombre y los apellidos del alumno, los puntos y el nivel
  rankingJuegoDePuntos: TablaAlumnoJuegoDePuntos[] = [];
  alumnoElegido: TablaAlumnoJuegoDePuntos;

  // tslint:disable-next-line:no-inferrable-types
  valorPunto: number = 1;

  fechaAsignacionPunto: Date;
  fechaString: string;

  juegoSeleccionado: Juego;

  // Recupera la informacion del juego, los alumnos o los equipos, los puntos y los niveles del juego
  alumnosDelJuego: Alumno[];
  equiposDelJuego: Equipo[];
  nivelesDelJuego: Nivel[];
  // Recoge la inscripción de un alumno en el juego ordenada por puntos
  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDePuntos[];
  listaEquiposOrdenadaPorPuntos: EquipoJuegoDePuntos[];

  rankingEquiposJuegoDePunto: TablaEquipoJuegoDePuntos[] = [];
  equipoElegido: TablaEquipoJuegoDePuntos;

  displayedColumnsAlumno: string[] = ['select', 'posicion', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'puntos', 'nivel'];
  // selection = new SelectionModel<TablaAlumnoJuegoDePuntos>(true, []);

  displayedColumnsEquipos: string[] = ['select', 'posicion', 'nombreEquipo', 'miembros', 'puntos', 'nivel'];
  selectionEquipos = new SelectionModel<TablaEquipoJuegoDePuntos>(true, []);

  seleccionados: boolean[];
  seleccionadosEquipos: boolean[];




  alumnosEquipo: Alumno[];

  // tslint:disable-next-line:ban-types
  isDisabled: Boolean = true;
  // tslint:disable-next-line:ban-types
  isDisabledAleatorio: Boolean = true;

  dataSource: any;
  botonAsignarDesactivado = true;
  botonAsignarAleatorioDesactivado = true;


  puntoAleatorioId: number;

  constructor(
               private sesion: SesionService,
               private peticionesAPI: PeticionesAPIService,
               public location: Location,
               private calculos: CalculosService,
               private comService: ComServerService ) { }

  ngOnInit() {
    const datos = this.sesion.DameDatosParaAsignarPuntos();
    console.log ('Datos ' + datos);
    this.puntoAleatorioId = datos.tiposPuntosDelJuego.filter (p => p.Nombre === 'Aleatorio')[0].id;

    // Elimino el tipo de punto aleatorio para que no salga entre los asignables
    // porque ese tipo de punto se asigna al pulsar el boton de asignación aleatoria
    this.tiposPuntosDelJuego = datos.tiposPuntosDelJuego.filter (p => p.Nombre !== 'Aleatorio');
    this.nivelesDelJuego = datos.nivelesDelJuego;
    this.alumnosDelJuego = datos.alumnosDelJuego;
    this.listaAlumnosOrdenadaPorPuntos = datos.listaAlumnosOrdenadaPorPuntos;
    this.rankingJuegoDePuntos = datos.rankingJuegoDePuntos;
    this.equiposDelJuego = datos.equiposDelJuego;
    console.log ('equipos ' + this.equiposDelJuego);

    this.listaEquiposOrdenadaPorPuntos = datos.listaEquiposOrdenadaPorPuntos;
    console.log ('lista ' + this.listaEquiposOrdenadaPorPuntos);

    // Por alguna razon tengo que recoger esto aparte, porque no lo devuelve
    // bien cuando le pido todos los datos.
    this.rankingEquiposJuegoDePunto = this.sesion.DameRankingEquipos();
    console.log ('renkign ' + this.rankingEquiposJuegoDePunto);



    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log ('juego seleccionado ' + this.juegoSeleccionado.Modo);

    // Ordena la lista de niveles por si el profesor no los creó de forma ascendente
     // tslint:disable-next-line:only-arrow-functions
    this.nivelesDelJuego = this.nivelesDelJuego.sort(function(obj1, obj2) {
      return obj1.PuntosAlcanzar - obj2.PuntosAlcanzar;
    });

    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.dataSource = new MatTableDataSource (this.rankingJuegoDePuntos);
    } else {
      this.dataSource = new MatTableDataSource (this.rankingEquiposJuegoDePunto);

    }

  }
  /* Para averiguar si todas las filas están seleccionadas */
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
  ActualizarBoton() {
    if ((this.selection.selected.length === 0) || (this.puntoSeleccionadoId === undefined)) {
      this.botonAsignarDesactivado = true;
    } else {
      this.botonAsignarDesactivado = false;
    }
  }


  AlumnosDelEquipo(equipo: Equipo) {

    this.peticionesAPI.DameAlumnosEquipo (equipo.id)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.alumnosEquipo = res;
        console.log(res);
      } else {
        console.log('No hay alumnos en este equipo');
        // Informar al usuario
        this.alumnosEquipo = undefined;
      }
    });
  }

  AsignarPuntos() {
    console.log('Estoy en AsignarPuntos');

    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('el juego es individual');
      this.AsignarPuntosAlumnos();
    } else {
      console.log('El juego es en equipo');
      this.AsignarPuntosEquipos();
    }

  }


  AsignarPuntosAlumnos() {
    // Tengo que hacer un recorrido diferente del dataSource porque necesito saber el
    // valor de i

    for ( let i = 0; i < this.dataSource.data.length; i++) {
      console.log ('Vuelta ' + i);


      // Buscamos los alumnos que hemos seleccionado
      if (this.selection.isSelected(this.dataSource.data[i]))  {
        console.log ('Voy a asignar ' + this.valorPunto + 'a ' + this.rankingJuegoDePuntos[i].nombre);
        console.log ('Niveles ' + this.nivelesDelJuego);

        let nivelAntes: number = this.listaAlumnosOrdenadaPorPuntos[i].nivelId;
        //console.log("Nivel antes de asignar el Punto: ", nivelAntes);

        this.calculos.AsignarPuntosAlumno (this.listaAlumnosOrdenadaPorPuntos[i], this.nivelesDelJuego, this.valorPunto, this.puntoSeleccionadoId);
        let alumno: Alumno = this.alumnosDelJuego.filter(alumno => alumno.id == this.listaAlumnosOrdenadaPorPuntos[i].alumnoId)[0];
        let profesor: Profesor = this.sesion.DameProfesor();

        // Registrar la Asignación de Punto/s
       
        // tslint:disable-next-line:max-line-length
        const eventoAsignarPuntos: Evento = new Evento(10, new Date(), profesor.id, alumno.id, undefined, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Puntos', this.puntoSeleccionadoId, this.valorPunto);
        this.calculos.RegistrarEvento(eventoAsignarPuntos);

        console.log ('voy a buscar elnombre del punto ', this.puntoSeleccionadoId);
        console.log ('puntos del juego ', this.tiposPuntosDelJuego);

        const tipoPunto: string = this.tiposPuntosDelJuego.filter(punto => punto.id === Number(this.puntoSeleccionadoId))[0].Nombre;
        // Notificar al Alumno
        // tslint:disable-next-line:max-line-length
        this.comService.EnviarNotificacionIndividual(10, alumno.id, `Has obtenido ${this.valorPunto} punto/s de tipo ${tipoPunto} en el Juego de Puntos ${this.juegoSeleccionado.NombreJuego}`);
        
        let nivelDespues: number = this.listaAlumnosOrdenadaPorPuntos[i].nivelId;
        //console.log("Nivel después de asignar el Punto: ", nivelDespues);

        if (nivelAntes !== nivelDespues) {
          // Registrar el Ascenso de Nivel
          // tslint:disable-next-line:max-line-length
          const eventoAscensoNivel: Evento = new Evento(11, new Date(), profesor.id, alumno.id, undefined, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Puntos', undefined, undefined, this.listaAlumnosOrdenadaPorPuntos[i].nivelId);
          this.calculos.RegistrarEvento (eventoAscensoNivel);
        
          // tslint:disable-next-line:max-line-length
          const nombreNivel: string = this.nivelesDelJuego.filter (n => n.id === Number (this.listaAlumnosOrdenadaPorPuntos[i].nivelId))[0].Nombre;
          // Notificar al Alumno
          // tslint:disable-next-line:max-line-length
          this.comService.EnviarNotificacionIndividual(11, alumno.id, `Has ascendido al nivel ${nombreNivel} en el Juego de Puntos ${this.juegoSeleccionado.NombreJuego}`);
        }

        this.rankingJuegoDePuntos[i].puntos = this.rankingJuegoDePuntos[i].puntos + this.valorPunto;
        if (this.listaAlumnosOrdenadaPorPuntos[i].nivelId !== undefined) {
          const nivel = this.nivelesDelJuego.filter (n => n.id === this.listaAlumnosOrdenadaPorPuntos[i].nivelId)[0];
          this.rankingJuegoDePuntos[i].nivel = nivel.Nombre;
        }

      }
      console.log ('ahora ' + this.rankingJuegoDePuntos[i]);
    }
    // tslint:disable-next-line:only-arrow-functions
    this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2) {
      return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
    });
    // tslint:disable-next-line:only-arrow-functions
    this.rankingJuegoDePuntos = this.rankingJuegoDePuntos.sort(function(obj1, obj2) {
      return obj2.puntos - obj1.puntos;
    });
    for (let i = 0; i < this.rankingJuegoDePuntos.length; i++) {
      this.rankingJuegoDePuntos[i].posicion = i + 1;
    }
    this.dataSource = new MatTableDataSource (this.rankingJuegoDePuntos);
    this.selection.clear();
    this.botonAsignarDesactivado = true;
  }

  AsignarPuntosEquipos() {

    for (let i = 0; i < this.dataSource.data.length; i++) {

      // Buscamos los alumnos que hemos seleccionado
      if (this.selection.isSelected(this.dataSource.data[i]))  {

        let nivelAntes: number = this.listaEquiposOrdenadaPorPuntos[i].nivelId;
        //console.log("Nivel antes de asignar el Punto: ", nivelAntes);

        this.calculos.AsignarPuntosEquipo (
                    this.listaEquiposOrdenadaPorPuntos[i],
                    this.nivelesDelJuego,
                    this.valorPunto,
                    this.puntoSeleccionadoId);

        let profesor: Profesor = this.sesion.DameProfesor();
        let equipo: Equipo = this.equiposDelJuego.filter(equipo => equipo.id == this.listaEquiposOrdenadaPorPuntos[i].equipoId)[0];
                  

        // Registrar la Asignación de Punto/s
        // tslint:disable-next-line:max-line-length
        const eventoAsignarPuntos: Evento = new Evento(10, new Date(), profesor.id, undefined, equipo.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Puntos', this.puntoSeleccionadoId, this.valorPunto);
        this.calculos.RegistrarEvento(eventoAsignarPuntos);



        const tipoPunto: string = this.tiposPuntosDelJuego.filter(punto => punto.id === Number (this.puntoSeleccionadoId))[0].Nombre;
        // Notificar a los Alumnos del Equipo
        // tslint:disable-next-line:max-line-length
        this.comService.EnviarNotificacionEquipo(10, equipo.id, `Tu Equipo ${equipo.Nombre} ha obtenido ${this.valorPunto} punto/s de tipo ${tipoPunto} en el Juego de Puntos ${this.juegoSeleccionado.NombreJuego}`);
        
        let nivelDespues: number = this.listaEquiposOrdenadaPorPuntos[i].nivelId;
        //console.log("Nivel después de asignar el Punto: ", nivelDespues);

        if (nivelAntes !== nivelDespues) {
          // Registrar el Ascenso de Nivel
          // tslint:disable-next-line:max-line-length
          const eventoAscensoNivel: Evento = new Evento(11, new Date(), profesor.id, undefined, equipo.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Puntos', undefined, undefined, this.listaEquiposOrdenadaPorPuntos[i].nivelId);
          this.calculos.RegistrarEvento(eventoAscensoNivel);

       
          // tslint:disable-next-line:max-line-length
          const nombreNivel: string = this.nivelesDelJuego.filter (n => n.id === Number(this.listaEquiposOrdenadaPorPuntos[i].nivelId))[0].Nombre;
          // Notificar a los Alumnos del Equipo
          // tslint:disable-next-line:max-line-length
          this.comService.EnviarNotificacionEquipo(11, equipo.id, `Tu Equipo ${equipo.Nombre} ha ascendido al nivel ${nombreNivel} en el Juego de Puntos ${this.juegoSeleccionado.NombreJuego}`);

        }

        this.rankingEquiposJuegoDePunto[i].puntos = this.rankingEquiposJuegoDePunto[i].puntos + this.valorPunto;
        if (this.listaEquiposOrdenadaPorPuntos[i].nivelId !== undefined) {
            const nivel = this.nivelesDelJuego.filter (n => n.id === this.listaEquiposOrdenadaPorPuntos[i].nivelId)[0];
            this.rankingEquiposJuegoDePunto[i].nivel = nivel.Nombre;
        }
      }
    }
    // tslint:disable-next-line:only-arrow-functions
    this.listaEquiposOrdenadaPorPuntos = this.listaEquiposOrdenadaPorPuntos.sort(function(obj1, obj2) {
      return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;
    });
    // tslint:disable-next-line:only-arrow-functions
    this.rankingEquiposJuegoDePunto = this.rankingEquiposJuegoDePunto.sort(function(obj1, obj2) {
      return obj2.puntos - obj1.puntos;
    });
    for ( let i = 0; i < this.rankingEquiposJuegoDePunto.length; i++) {
      this.rankingEquiposJuegoDePunto[i].posicion = i + 1;
    }
    this.dataSource = new MatTableDataSource (this.rankingEquiposJuegoDePunto);
    this.selection.clear();
    this.botonAsignarDesactivado = true;
  }


  AsignarAleatorio() {
    console.log ('niveles del juego');
    console.log (this.nivelesDelJuego);
    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log ('Entramos');
      const numeroAlumnos = this.alumnosDelJuego.length;
      const elegido = Math.floor(Math.random() * numeroAlumnos);
      this.alumnoElegido = this.rankingJuegoDePuntos[elegido];
      Swal.fire({
        title: '¿Asignamos el punto a ' + this.alumnoElegido.nombre + ' ' + this.alumnoElegido.primerApellido + '?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, estoy seguro'
      }).then((result) => {
        if (result.value) {
          let nivelAntes: number = this.listaAlumnosOrdenadaPorPuntos[elegido].nivelId;
          //console.log("Nivel antes de asignar el Punto: ", nivelAntes);

          this.calculos.AsignarPuntosAlumno (this.listaAlumnosOrdenadaPorPuntos[elegido], this.nivelesDelJuego, this.valorPunto, this.puntoAleatorioId);
          let profesor: Profesor = this.sesion.DameProfesor();
          let alumno: Alumno = this.alumnosDelJuego.filter(alumno => alumno.id == this.listaAlumnosOrdenadaPorPuntos[elegido].alumnoId)[0];
       

          // Registrar la Asignación de Punto/s
          // tslint:disable-next-line:max-line-length
          const eventoAsignarPuntos: Evento = new Evento(10, new Date(), profesor.id, alumno.id, undefined, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Puntos', this.puntoAleatorioId, this.valorPunto);
          this.calculos.RegistrarEvento(eventoAsignarPuntos);


          // Notificar al Alumno
          // tslint:disable-next-line:max-line-length
          this.comService.EnviarNotificacionIndividual(10, alumno.id, `Has obtenido ${this.valorPunto} punto/s de tipo Aleatorio en el Juego de Puntos ${this.juegoSeleccionado.NombreJuego}`);
          
          let nivelDespues: number = this.listaAlumnosOrdenadaPorPuntos[elegido].nivelId;
          //console.log("Nivel después de asignar el Punto: ", nivelDespues);

          if (nivelAntes !== nivelDespues) {

            // Registrar el Ascenso de Nivel
            // tslint:disable-next-line:max-line-length
            const eventoAscensoNivel: Evento = new Evento(11, new Date(), profesor.id, alumno.id, undefined, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Puntos', undefined, undefined, this.listaAlumnosOrdenadaPorPuntos[elegido].nivelId);
            this.calculos.RegistrarEvento(eventoAscensoNivel);

            // tslint:disable-next-line:max-line-length
            const nombreNivel: string = this.nivelesDelJuego.filter (n => n.id === Number(this.listaAlumnosOrdenadaPorPuntos[elegido].nivelId))[0].Nombre;
            // Notificar al Alumno
            // tslint:disable-next-line:max-line-length
            this.comService.EnviarNotificacionIndividual(11, alumno.id, `Has ascendido al nivel ${nombreNivel} en el Juego de Puntos ${this.juegoSeleccionado.NombreJuego}`);
          }

          this.rankingJuegoDePuntos[elegido].puntos = this.rankingJuegoDePuntos[elegido].puntos + this.valorPunto;
          if (this.listaAlumnosOrdenadaPorPuntos[elegido].nivelId !== undefined) {
            const nivel = this.nivelesDelJuego.filter (n => n.id === this.listaAlumnosOrdenadaPorPuntos[elegido].nivelId)[0];
            this.rankingJuegoDePuntos[elegido].nivel = nivel.Nombre;
          }

          // tslint:disable-next-line:only-arrow-functions
          this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2) {
            return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
          });
          // tslint:disable-next-line:only-arrow-functions
          this.rankingJuegoDePuntos = this.rankingJuegoDePuntos.sort(function(obj1, obj2) {
            return obj2.puntos - obj1.puntos;
          });
          for (let i = 0; i < this.rankingJuegoDePuntos.length; i++) {
            this.rankingJuegoDePuntos[i].posicion = i + 1;
          }
          this.dataSource = new MatTableDataSource (this.rankingJuegoDePuntos);
          this.selection.clear();
        }
      });

    } else {
      const numeroEquipos = this.equiposDelJuego.length;
      const elegido = Math.floor(Math.random() * numeroEquipos);
      this.equipoElegido = this.rankingEquiposJuegoDePunto[elegido];
      Swal.fire({
        title: '¿Asignamos el punto a ' + this.equipoElegido.nombre + '?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, estoy seguro'
      }).then((result) => {
        if (result.value) {
          let nivelAntes: number = this.listaEquiposOrdenadaPorPuntos[elegido].nivelId;
          //console.log("Nivel antes de asignar el Punto: ", nivelAntes);

          this.calculos.AsignarPuntosEquipo (this.listaEquiposOrdenadaPorPuntos[elegido], this.nivelesDelJuego, this.valorPunto, this.puntoAleatorioId);
          let profesor: Profesor = this.sesion.DameProfesor();
          let equipo: Equipo = this.equiposDelJuego.filter(equipo => equipo.id == this.listaEquiposOrdenadaPorPuntos[elegido].equipoId)[0];
          

          // Registrar la Asignación de Punto/s
          // tslint:disable-next-line:max-line-length
          const eventoAsignarPuntos: Evento = new Evento(10, new Date(), profesor.id, undefined, equipo.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Puntos', this.puntoAleatorioId, this.valorPunto);
          this.calculos.RegistrarEvento(eventoAsignarPuntos);

          // tslint:disable-next-line:max-line-length
          this.comService.EnviarNotificacionEquipo(10, equipo.id, `Tu Equipo ${equipo.Nombre} ha obtenido ${this.valorPunto} punto/s de tipo Aleatorio en el Juego de Puntos ${this.juegoSeleccionado.NombreJuego}`);

          let nivelDespues: number = this.listaEquiposOrdenadaPorPuntos[elegido].nivelId;
          //console.log("Nivel después de asignar el Punto: ", nivelDespues);

          if (nivelAntes !== nivelDespues) {

            // Registrar el Ascenso de Nivel
            // tslint:disable-next-line:max-line-length
            const eventoAscensoNivel: Evento = new Evento(11, new Date(), profesor.id, undefined, equipo.id, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, 'Juego De Puntos', undefined, undefined, this.listaEquiposOrdenadaPorPuntos[elegido].nivelId);
            this.calculos.RegistrarEvento(eventoAscensoNivel);
            

            // tslint:disable-next-line:max-line-length
            const nombreNivel: string = this.nivelesDelJuego.filter (n => n.id === Number(this.listaEquiposOrdenadaPorPuntos[elegido].nivelId))[0].Nombre;
            // Notificar a los Alumnos del Equipo
            // tslint:disable-next-line:max-line-length
            this.comService.EnviarNotificacionEquipo(11, equipo.id, `Tu Equipo ${equipo.Nombre} ha ascendido al nivel ${nombreNivel} en el Juego de Puntos ${this.juegoSeleccionado.NombreJuego}`);

          }

          this.rankingEquiposJuegoDePunto[elegido].puntos = this.rankingEquiposJuegoDePunto[elegido].puntos + this.valorPunto;
          if (this.listaEquiposOrdenadaPorPuntos[elegido].nivelId !== undefined) {
            const nivel = this.nivelesDelJuego.filter (n => n.id === this.listaEquiposOrdenadaPorPuntos[elegido].nivelId)[0];
            this.rankingEquiposJuegoDePunto[elegido].nivel = nivel.Nombre;
          }

          // tslint:disable-next-line:only-arrow-functions
          this.listaEquiposOrdenadaPorPuntos = this.listaEquiposOrdenadaPorPuntos.sort(function(obj1, obj2) {
            return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;
          });
          // tslint:disable-next-line:only-arrow-functions
          this.rankingEquiposJuegoDePunto = this.rankingEquiposJuegoDePunto.sort(function(obj1, obj2) {
            return obj2.puntos - obj1.puntos;
          });
          for (let i = 0; i < this.rankingEquiposJuegoDePunto.length; i++) {
            this.rankingEquiposJuegoDePunto[i].posicion = i + 1;
          }
          this.dataSource = new MatTableDataSource (this.rankingEquiposJuegoDePunto);
          this.selection.clear();
        }
      });
    }
  }
  goBack() {
    this.location.back();
  }
}

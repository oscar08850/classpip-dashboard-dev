import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { Alumno, Equipo, Evento, Grupo, Nivel, Profesor, Punto } from 'src/app/clases/index';
import { PeticionesAPIService, CalculosService, SesionService } from 'src/app/servicios/index';

@Component({
  selector: 'app-registro',
  templateUrl: './actividad-registro.component.html',
  styleUrls: ['./actividad-registro.component.scss']
})
export class ActividadRegistroComponent implements OnInit {
  cargando: boolean; //Variable para mostrar el icono de carga (Progress Spinner)

  //Variables para mostrar el Paginator (Elemento que "corta" la lista de Eventos)
  paginatorLength: number;
  paginatorPageSize: number;
  paginatorPageSizeOptions: number[];
  paginatorPageEvent: PageEvent;

  //Datos
  listaEventos: Evento[];
  listaEventosPaginada: Evento[]; //Lista que se mostrará (es la listaEventos que ha sido "cortada" por el Paginator)
  listaAlumnos: Alumno[];
  listaEquipos: Equipo[];
  listaGrupos: Grupo[];
  listaJuegos: any[];
  listaPuntos: Punto[]; //Todos los Tipos de Punto, para filtrar la lista
  listaNiveles: Nivel[]; //Todos los Niveles (nombres), para filtrar la lista
  alumnoEventoSeleccionado: Alumno; //Alumno del Evento que se ha seleccionado
  equipoEventoSeleccionado: Equipo; //Equipo del Evento que se ha seleccionado
  juegoEventoSeleccionado: any; //Juego del Evento que se ha seleccionado
  grupoEventoSeleccionado: Grupo; //Grupo del Juego del Evento que se ha seleccionado
  puntoEventoSeleccionado: Punto; //Tipo de Punto para los Eventos seleccionados de tipo Asignación de Punto/s
  numeroPuntosEventoSeleccionado: number; //Numero de Puntos para los Eventos seleccionados de tipo Asignación de Punto/s
  nivelEventoSeleccionado: Nivel; //Nivel del Juego de Puntos para los Eventos seleccionados de tipo Ascenso de Nivel
  numeroCromosEventoSeleccionado: number; //Numero de Cromos para los Eventos seleccionados de tipo Asignación de Cromo/s
  alumnoReceptorCromoEventoSeleccionado: Alumno; //Alumno al cual le han regalado un Cromo en el Evento seleccionado
  equipoReceptorCromoEventoSeleccionado: Equipo; //Equipo al cual le han regalado un Cromo en el Evento seleccionado
  privilegioEventoSeleccionado: string; //Privilegio (1, 2, 3, 4, Nota de Voz o Espiar) del Evento que se ha seleccionado

  //Variables para filtrar el registro
  filtrosVisibles: boolean;
  filtroOrdenTemporal: string;
  filtrarFecha: boolean;
  filtroFechaInicial: Date;
  filtroFechaFinal: Date;
  filtrarTipoEvento: boolean;
  filtroTipoEvento: number;
  filtrarAlumno: boolean;
  filtroAlumno: Alumno;
  filtrarEquipo: boolean;
  filtroEquipo: Equipo;
  filtroGrupo: Grupo; //Grupo del cual se van a mostrar los Equipos y Juegos para filtrar
  filtrarJuego: boolean;
  filtroJuego: any;
  filtrarTipoJuego: boolean;
  filtroTipoJuego: string;
  filtrarPunto: boolean;
  filtroPunto: Punto;
  filtrarNivel: boolean;
  filtroNivel: Nivel;
  filtrarAlumnoReceptorCromo: boolean;
  filtroAlumnoReceptorCromo: Alumno; //Alumno al cual le han regalado un Cromo
  filtrarEquipoReceptorCromo: boolean;
  filtroEquipoReceptorCromo: Equipo; //Equipo al cual le han regalado un Cromo
  filtrarPrivilegio: boolean;
  filtroPrivilegio: number;

  constructor(
    private APIService: PeticionesAPIService,
    private calculosService: CalculosService,
    private sesionService: SesionService
  ) {
    this.cargando = false;

    this.paginatorPageSize = 10;
    this.paginatorPageSizeOptions = [5, 10, 15, 20, 50, 100];

    this.listaEventos = [];
    this.listaEventosPaginada = [];
    this.listaAlumnos = [];
    this.listaEquipos = [];
    this.listaGrupos = [];
    this.listaJuegos = [];
    this.listaPuntos = [];
    this.listaNiveles = [];
    this.alumnoEventoSeleccionado = new Alumno();
    this.equipoEventoSeleccionado = new Equipo();
    this.juegoEventoSeleccionado = {};
    this.grupoEventoSeleccionado = new Grupo();
    this.puntoEventoSeleccionado = new Punto();
    this.numeroPuntosEventoSeleccionado = 0;
    this.nivelEventoSeleccionado = new Nivel();
    this.numeroCromosEventoSeleccionado = 0;
    this.alumnoReceptorCromoEventoSeleccionado = new Alumno();
    this.equipoReceptorCromoEventoSeleccionado = new Equipo();
    this.privilegioEventoSeleccionado = " ";

    this.filtrosVisibles = false;
    this.filtroOrdenTemporal = "desc";
    this.filtrarFecha = false;
    this.filtrarTipoEvento = false;
    this.filtroTipoEvento = 0;
    this.filtrarAlumno = false;
    this.filtroAlumno = new Alumno();
    this.filtrarEquipo = false;
    this.filtroEquipo = new Equipo();
    this.filtroGrupo = new Grupo();
    this.filtrarJuego = false;
    this.filtroJuego = {};
    this.filtrarTipoJuego = false;
    this.filtroTipoJuego = " ";
    this.filtrarPunto = false;
    this.filtroPunto = new Punto();
    this.filtrarNivel = false;
    this.filtroNivel = new Nivel();
    this.filtrarAlumnoReceptorCromo = false;
    this.filtroAlumnoReceptorCromo = new Alumno();
    this.filtrarEquipoReceptorCromo = false;
    this.filtroEquipoReceptorCromo = new Equipo();
    this.filtrarPrivilegio = false;
    this.filtroPrivilegio = 0;
  }

  paginatorGetData(event?: PageEvent) {
    this.cargando = true;
    
    this.listaEventosPaginada = this.listaEventos.slice(event.pageIndex * event.pageSize, event.pageIndex * event.pageSize + event.pageSize);

    this.cargando = false;
    return event;
  }

  tipoEventoCambiado(){
    if(!this.filtrarTipoEvento){
      this.filtrarTipoEvento = true;
    }
  }

  filtrarAlumnoCambiado(event: any){ //Para que los filtros de Alumno y Equipo sean excluyentes
    if(event.checked){
      this.filtrarEquipo = false;
    }
  }

  alumnoCambiado(){
    if(!this.filtrarAlumno){
      this.filtrarAlumno = true;
      if(this.filtrarEquipo){ //Para que los filtros de Alumno y Equipo sean excluyentes
        this.filtrarEquipo = false;
      }
    }
  }

  grupoCambiado(event: any){
    //console.log(event);
    this.listaEquipos = [];
    this.listaJuegos = [];
    this.listaPuntos = [];
    this.listaNiveles = [];

    if(event.value.id != null){
      this.listaEquipos = [];
      this.APIService.DameEquiposDelGrupo(this.filtroGrupo.id).subscribe((equipos) => {
        //console.log(equipos);
        equipos.forEach((equipo) => {
          if(!this.listaEquipos.includes(equipo)){
            this.listaEquipos.push(equipo);
          }
        });
      }, (err) => {
        console.log(err);
        Swal.fire({
          title: "Error al obtener los Equipos para el filtro del Registro",
          text: err.message,
          icon: "error",
          showConfirmButton: false,
          timer: 3000
        });
      });
    }
  }

  filtrarEquipoCambiado(event: any){ //Para que los filtros de Alumno y Equipo sean excluyentes
    if(event.checked){
      this.filtrarAlumno = false;
    }
  }

  equipoCambiado(){
    if(!this.filtrarEquipo){
      this.filtrarEquipo = true;
      if(this.filtrarAlumno){ //Para que los filtros de Alumno y Equipo sean excluyentes
        this.filtrarAlumno = false;
      }
    }
  }

  tipoJuegoCambiado(event: any){
    //console.log(event);
    if(!this.filtrarTipoJuego){
      this.filtrarTipoJuego = true;
    }

    this.listaJuegos = [];

    if((this.filtroGrupo.id != null) && (event.value != null)){
      this.calculosService.DameJuegosDelGrupoSegunTipo(this.filtroTipoJuego, this.filtroGrupo.id).subscribe((juegos) => {
        //console.log(juegos);
        this.listaJuegos = juegos;
      }, (err) => {
        console.log(err);
        Swal.fire({
          title: "Error al obtener los Juegos para el filtro del Registro",
          text: err.message,
          icon: "error",
          showConfirmButton: false,
          timer: 3000
        });
      });
    }
  }

  juegoCambiado(event: any) {
    //console.log(event);
    if (!this.filtrarJuego){
      this.filtrarJuego = true;
    }
    
    if((this.filtroGrupo.id != null) && (event.value != null)) {
      switch (this.filtroTipoJuego){
        case "Juego De Puntos": 
          this.listaPuntos = [];
          this.listaNiveles = [];

          this.APIService.DameNivelesJuegoDePuntos(this.filtroJuego.id).subscribe((niveles) => {
            //console.log(niveles);
            niveles.forEach(nivel => {
              if(!this.listaNiveles.includes(nivel)) {
                this.listaNiveles.push(nivel);
              }
            });

            this.APIService.DamePuntosJuegoDePuntos(this.filtroJuego.id).subscribe((puntos) => {
              //console.log(puntos);
              puntos.forEach((punto) => {
                if(!this.listaPuntos.includes(punto)) {
                  this.listaPuntos.push(punto);
                }
              });
            }, (err) => {
              console.log(err);
              Swal.fire({
                title: "Error al obtener los Puntos para el filtro del Registro",
                text: err.message,
                icon: "error",
                showConfirmButton: false,
                timer: 3000
              });
            });
          }, (err) => {
            console.log(err);
            Swal.fire({
              title: "Error al obtener los Niveles para el filtro del Registro",
              text: err.message,
              icon: "error",
              showConfirmButton: false,
              timer: 3000
            });
          });
          break;

        default:
          break;
      }
    }
  }

  puntoCambiado(){
    if (!this.filtrarPunto){
      this.filtrarPunto = true;
    }
  }

  nivelCambiado(){
    if (!this.filtrarNivel){
      this.filtrarNivel = true;
    }
  }

  alumnoReceptorCromoCambiado(){
    if(!this.filtrarAlumnoReceptorCromo){
      this.filtrarAlumnoReceptorCromo = true;
    }
  }

  equipoReceptorCromoCambiado(){
    if(!this.filtrarEquipoReceptorCromo){
      this.filtrarEquipoReceptorCromo = true;
    }
  }

  privilegioCambiado(){
    if(!this.filtrarPrivilegio){
      this.filtrarPrivilegio = true;
    }
  }

  DameListaEventos(): Observable<any> {
    const listaEventosObservable: Observable<any> = new Observable((obs) => {
      this.listaEventos = [];
      this.listaEventosPaginada = [];

      let profesor: Profesor = this.sesionService.DameProfesor();

      this.APIService.DameEventosFiltrados(`?filter[where][ProfesorID]=${profesor.id}`).subscribe((eventos) => { //Buscamos sólo los Eventos relacionados con el profesor de esta Sesión
        //console.log(eventos);
        let lista: Evento[] = [];
        eventos.forEach((evento) => {
          //Para parsear las fechas que vienen de la API
          lista.push(new Evento(evento.TipoEvento, new Date(evento.FechayHora), evento.ProfesorID, evento.AlumnoID, evento.EquipoID, evento.JuegoID, evento.NombreJuego, evento.TipoJuego, evento.PuntoID, evento.NumeroPuntos, evento.NivelID, evento.NumeroCromos, evento.AlumnoReceptorCromoID, evento.EquipoReceptorCromoID, evento.Privilegio));
        });

        //Para ordenar la lista según la fecha y hora
        lista.sort((a: Evento, b: Evento) => {
          return b.FechayHora.getTime() - a.FechayHora.getTime();
        });

        this.APIService.DameTodosMisAlumnos(profesor.id).subscribe((alumnos) => {
          //console.log(alumnos);
          this.listaAlumnos = alumnos;

          this.APIService.DameGruposProfesor(profesor.id).subscribe((grupos) => {
            //console.log(grupos);
            this.listaGrupos = grupos;

            obs.next(lista);
          }, (err) => {
            console.log(err);
            obs.next([]);
            Swal.fire({
              title: "Error al obtener los Grupos para mostrar el Registro",
              text: err.message,
              icon: "error",
              showConfirmButton: false,
              timer: 3000
            });
          });
        }, (err) => {
          console.log(err);
          obs.next([]);
          Swal.fire({
            title: "Error al obtener los Alumnos para mostrar el Registro",
            text: err.message,
            icon: "error",
            showConfirmButton: false,
            timer: 3000
          });
        });
      }, (err) => {
        console.log(err);
        obs.next([]);
        Swal.fire({
          title: "Error al obtener los Eventos para mostrar el Registro",
          text: err.message,
          icon: "error",
          showConfirmButton: false,
          timer: 3000
        });
      });
    });
    return listaEventosObservable;
  }

  ngOnInit() {
    this.cargando = true;

    this.DameListaEventos().subscribe((lista) => {
      //console.log(lista);
      this.listaEventos = lista;

      this.listaEventosPaginada = this.listaEventos.slice(0, this.paginatorPageSize);
      this.paginatorLength = this.listaEventos.length;

      this.cargando = false;
    }, (err) => {
      console.log(err);
      Swal.fire({
        title: "Error al obtener la Lista de Eventos para mostrar el Registro",
        text: err.message,
        icon: "error",
        showConfirmButton: false,
        timer: 3000
      });
    });
  }

  MostrarFiltros() {
    this.filtrosVisibles = !this.filtrosVisibles;
  }

  FiltrarListaEventos() {
    this.cargando = true;

    this.MostrarFiltros();

    this.DameListaEventos().subscribe((lista) => {
      this.listaEventos = lista;

      if (this.filtroOrdenTemporal == "asc") {
        this.listaEventos.sort((a: Evento, b: Evento) => {
          return a.FechayHora.getTime() - b.FechayHora.getTime();
        });
      }
      if (this.filtroOrdenTemporal == "desc") {
        this.listaEventos.sort((a: Evento, b: Evento) => {
          return b.FechayHora.getTime() - a.FechayHora.getTime();
        });
      }
      if (this.filtrarFecha) {
        if ((this.filtroFechaInicial == null) || (this.filtroFechaFinal == null)) {
          Swal.fire({
            title: "Cuidado",
            text: "No has seleccionado la Fecha Inicial y/o Final para filtrar",
            icon: "warning",
          });
        }
        else {
          //Para que se busque hasta el último día, incluido:
          this.filtroFechaFinal.setHours(23);
          this.filtroFechaFinal.setMinutes(59);
          this.filtroFechaFinal.setSeconds(59);
          this.filtroFechaFinal.setMilliseconds(999);

          this.listaEventos = this.listaEventos.filter(
            evento => ((evento.FechayHora.getTime() >= this.filtroFechaInicial.getTime()) && (evento.FechayHora.getTime() <= this.filtroFechaFinal.getTime()))
          );
        }
      }
      if (this.filtrarTipoEvento) {
        if (this.filtroTipoEvento == 0) {
          Swal.fire({
            title: "Cuidado",
            text: "No has seleccionado el Tipo de Evento para filtrar",
            icon: "warning",
          });
        }
        else {
          this.listaEventos = this.listaEventos.filter(evento => evento.TipoEvento == this.filtroTipoEvento);
        }
      }
      if (this.filtrarAlumno) {
        if (this.filtroAlumno.id == null) {
          Swal.fire({
            title: "Cuidado",
            text: "No has seleccionado el Alumno para filtrar",
            icon: "warning",
          });
        }
        else {
          this.listaEventos = this.listaEventos.filter(evento => evento.AlumnoID === this.filtroAlumno.id);
        }
      }
      if (this.filtrarEquipo) {
        if (this.filtroEquipo.id == null) {
          Swal.fire({
            title: "Cuidado",
            text: "No has seleccionado el Equipo para filtrar",
            icon: "warning",
          });
        }
        else {
          this.listaEventos = this.listaEventos.filter(evento => evento.EquipoID === this.filtroEquipo.id);
        }
      }
      if (this.filtrarJuego) {
        if (this.filtroJuego == {}) {
          Swal.fire({
            title: "Cuidado",
            text: "No has seleccionado el Juego para filtrar",
            icon: "warning",
          });
        }
        else {
          this.listaEventos = this.listaEventos.filter(evento => ((evento.JuegoID === this.filtroJuego.id) && (evento.TipoJuego == this.filtroTipoJuego)));
        }
      }
      if (this.filtrarTipoJuego) {
        if (this.filtroTipoJuego == " ") {
          Swal.fire({
            title: "Cuidado",
            text: "No has seleccionado el Tipo de Juego para filtrar",
            icon: "warning",
          });
        }
        else {
          this.listaEventos = this.listaEventos.filter(evento => evento.TipoJuego === this.filtroTipoJuego);
        }
      }
      if (this.filtrarPunto) {
        if (this.filtroPunto.id == null) {
          Swal.fire({
            title: "Cuidado",
            text: "No has seleccionado el Tipo de Punto para filtrar",
            icon: "warning",
          });
        }
        else {
          this.listaEventos = this.listaEventos.filter(evento => ((evento.PuntoID === this.filtroPunto.id) && (evento.JuegoID === this.filtroJuego.id)));
        }
      }
      if (this.filtrarNivel) {
        if (this.filtroNivel.id == null) {
          Swal.fire({
            title: "Cuidado",
            text: "No has seleccionado el Nivel de Juego de Puntos para filtrar",
            icon: "warning",
          });
        }
        else {
          this.listaEventos = this.listaEventos.filter(evento => ((evento.NivelID === this.filtroNivel.id) && (evento.JuegoID === this.filtroJuego.id)));
        }
      }
      if (this.filtrarAlumnoReceptorCromo) {
        if (this.filtroAlumnoReceptorCromo.id == null) {
          Swal.fire({
            title: "Cuidado",
            text: "No has seleccionado el Alumno al que le han regalado un Cromo para filtrar",
            icon: "warning",
          });
        }
        else {
          this.listaEventos = this.listaEventos.filter(evento => (evento.AlumnoReceptorCromoID === this.filtroAlumnoReceptorCromo.id));
        }
      }
      if (this.filtrarEquipoReceptorCromo) {
        if (this.filtroEquipoReceptorCromo.id == null) {
          Swal.fire({
            title: "Cuidado",
            text: "No has seleccionado el Equipo al que le han regalado un Cromo para filtrar",
            icon: "warning",
          });
        }
        else {
          this.listaEventos = this.listaEventos.filter(evento => (evento.EquipoReceptorCromoID === this.filtroEquipoReceptorCromo.id));
        }
      }
      if (this.filtrarPrivilegio) {
        if (this.filtroPrivilegio == 0) {
          Swal.fire({
            title: "Cuidado",
            text: "No has seleccionado el Privilegio para filtrar",
            icon: "warning",
          });
        }
        else {
          this.listaEventos = this.listaEventos.filter(evento => (evento.Privilegio === this.filtroPrivilegio));
        }
      }

      this.listaEventosPaginada = this.listaEventos.slice(0, this.paginatorPageSize);
      this.paginatorLength = this.listaEventos.length;

      this.cargando = false;
    }, (err) => {
      console.log(err);
      Swal.fire({
        title: "Error al obtener la Lista de Eventos para mostrar el Registro",
        text: err.message,
        icon: "error",
        showConfirmButton: false,
        timer: 3000
      });
    });
  }

  ReiniciarFiltros() {
    this.cargando = true;

    this.MostrarFiltros();

    this.filtroOrdenTemporal = "desc";
    this.filtrarFecha = false;
    this.filtroFechaInicial = null;
    this.filtroFechaFinal = null;
    this.filtrarTipoEvento = false;
    this.filtroTipoEvento = 0;
    this.filtrarAlumno = false;
    this.filtroAlumno = new Alumno();
    this.filtrarEquipo = false;
    this.filtroEquipo = new Equipo();
    this.filtroGrupo = new Grupo();
    this.filtrarTipoJuego = false;
    this.filtroTipoJuego = " ";
    this.filtrarJuego = false;
    this.filtroJuego = {};
    this.filtrarPunto = false;
    this.filtroPunto = new Punto;
    this.filtrarNivel = false;
    this.filtroNivel = new Nivel();
    this.filtrarAlumnoReceptorCromo = false;
    this.filtroAlumnoReceptorCromo = new Alumno();
    this.filtrarEquipoReceptorCromo = false;
    this.filtroEquipoReceptorCromo = new Equipo();
    this.filtrarPrivilegio = false;
    this.filtroPrivilegio = 0;

    this.DameListaEventos().subscribe((lista) => {
      this.listaEventos = lista;

      this.listaEventosPaginada = this.listaEventos.slice(0, this.paginatorPageSize);
      this.paginatorLength = this.listaEventos.length;

      this.cargando = false;
    }, (err) => {
      console.log(err);
      Swal.fire({
        title: "Error al obtener la Lista de Eventos para mostrar el Registro",
        text: err.message,
        icon: "error",
        showConfirmButton: false,
        timer: 3000
      });
    });
  }

  DameDescripcionEvento(i: number) {
    this.calculosService.DameDatosEvento(this.listaEventosPaginada[i]).subscribe((datos) => {
      if (datos.hasOwnProperty('juego')) { //Todos
        this.juegoEventoSeleccionado = datos.juego;
      }
      else {
        this.juegoEventoSeleccionado = {}; //Para evitar que se muestren los datos del anterior Evento seleccionado si hay error
      }
      if (datos.hasOwnProperty('grupo')) { //Todos 
        this.grupoEventoSeleccionado = datos.grupo;
      }
      else {
        this.grupoEventoSeleccionado = new Grupo(); //Para evitar que se muestren los datos del anterior Evento seleccionado si hay error
      }
      if (datos.hasOwnProperty('alumno')) { //Tipo 2, 10, 11, 20, 21, 22, 30, 31, 32
        this.alumnoEventoSeleccionado = datos.alumno;
      }
      else {
        this.alumnoEventoSeleccionado = new Alumno(); //Para evitar que se muestren los datos del anterior Evento seleccionado si hay error
      }
      if(datos.hasOwnProperty('equipo')) { //Tipo 10, 11, 20, 21, 22
        this.equipoEventoSeleccionado = datos.equipo;
      }
      else {
        this.equipoEventoSeleccionado = new Equipo(); //Para evitar que se muestren los datos del anterior Evento seleccionado si hay error
      }
      if (datos.hasOwnProperty('punto')) { //Tipo 10
        this.puntoEventoSeleccionado = datos.punto;
      }
      else {
        this.puntoEventoSeleccionado = new Punto(); //Para evitar que se muestren los datos del anterior Evento seleccionado si hay error
      }
      if (datos.hasOwnProperty('nivel')) { //Tipo 11
        this.nivelEventoSeleccionado = datos.nivel;
      }
      else {
        this.nivelEventoSeleccionado = new Nivel(); //Para evitar que se muestren los datos del anterior Evento seleccionado si hay error
      }
      if (datos.hasOwnProperty('alumnoReceptorCromo')) { //Tipo 21
        this.alumnoReceptorCromoEventoSeleccionado = datos.alumnoReceptorCromo;
      }
      else {
        this.alumnoReceptorCromoEventoSeleccionado = new Alumno(); //Para evitar que se muestren los datos del anterior Evento seleccionado si hay error
      }
      if (datos.hasOwnProperty('equipoReceptorCromo')) { //Tipo 21
        this.equipoReceptorCromoEventoSeleccionado = datos.equipoReceptorCromo;
      }
      else {
        this.equipoReceptorCromoEventoSeleccionado = new Equipo(); //Para evitar que se muestren los datos del anterior Evento seleccionado si hay error
      }

      this.numeroPuntosEventoSeleccionado = this.listaEventosPaginada[i].NumeroPuntos;
      this.numeroCromosEventoSeleccionado = this.listaEventosPaginada[i].NumeroCromos;

      if (this.listaEventosPaginada[i].Privilegio == 5) { 
        this.privilegioEventoSeleccionado = "Privilegio Nota de Voz"; 
      }
      else if (this.listaEventosPaginada[i].Privilegio == 6) {
        this.privilegioEventoSeleccionado = "Privilegio Espiar";
      }
      else {
        this.privilegioEventoSeleccionado = `Privilegio ${this.listaEventosPaginada[i].Privilegio}`;
      }
    }, (err) => {
      console.log(err);
      Swal.fire({
        title: `Error al obtener los Datos para mostrar el Evento número ${i}`,
        text: err.message,
        icon: "error",
        showConfirmButton: false,
        timer: 3000
      });
    });
  }

  GenerarPDFRegistro() {
    this.cargando = true;

    const doc: jsPDF = new jsPDF();

    //Márgenes
    let margenSup: number = 20;
    let margenIzq: number = 15;

    //Título
    doc.setFont("times", "bold");
    doc.setFontSize(30);
    doc.setTextColor(63, 81, 181);

    doc.text("Registro de Actividad", margenIzq, margenSup);
    doc.line(margenIzq, margenSup + 5, margenIzq + 150, margenSup + 5);

    //Subtítulos
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor("black");

    let profesor: Profesor = this.sesionService.DameProfesor();
    let datosProfesor: string = doc.splitTextToSize(`Profesor: ${profesor.Nombre} ${profesor.PrimerApellido} ${profesor.SegundoApellido} (${profesor.email})`, 180);
    doc.text(datosProfesor, margenIzq, margenSup + 15);

    let fecha: Date = new Date();
    let dia = ('0' + fecha.getDate()).slice(-2);
    let mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
    let anyo = fecha.getFullYear();
    let hora = ('0' + fecha.getHours()).slice(-2);
    let minutos = ('0' + fecha.getMinutes()).slice(-2);
    let datosFecha: string = doc.splitTextToSize(`Fecha y hora de generación: ${dia}/${mes}/${anyo}  ${hora}:${minutos}`, 180);
    doc.text(datosFecha, margenIzq, margenSup + 22);

    //Generar mini tabla con los filtros usados en el Registro de Actividad
    doc.text("Filtros Usados:", margenIzq, margenSup + 30);

    this.calculosService.DameTablaFiltros(this.filtrarTipoEvento, this.filtroTipoEvento, this.filtrarFecha, this.filtroFechaInicial, this.filtroFechaFinal, this.filtroGrupo, this.filtrarAlumno, this.filtroAlumno, this.filtrarEquipo, this.filtroEquipo, this.filtrarTipoJuego, this.filtroTipoJuego, this.filtrarJuego, this.filtroJuego, this.filtrarPunto, this.filtroPunto, this.filtrarNivel, this.filtroNivel, this.filtrarAlumnoReceptorCromo, this.filtroAlumnoReceptorCromo, this.filtrarEquipoReceptorCromo, this.filtroEquipoReceptorCromo, this.filtrarPrivilegio, this.filtroPrivilegio).subscribe((tablaFiltros) => {
      //console.log(tablaFiltros);
      
      //Insertar la mini tabla de filtros en el documento PDF
      autoTable(doc, {
        startY: margenSup + 35,
        styles: {
          fontSize: 8
        },
        theme: 'grid',
        head: [['Tipo de Evento', 'Fecha', 'Grupo', 'Alumno/Equipo', 'Juego', 'Puntos', 'Nivel', 'Cromos', 'Privilegio']],
        body: [tablaFiltros]
      });

      //Generar tabla del Registro de Actividad
      this.calculosService.DameTablaEventos(this.listaEventos).subscribe((tablaEventos) => {
        //console.log(tablaEventos);

        //Insertar la tabla del registro de actividad en el documento PDF
        autoTable(doc, {
          startY: margenSup + 60,
          styles: {
            fontSize: 8
          },
          headStyles: {
            fillColor: [63, 81, 181]
          },
          head: [['Tipo de Evento', 'Fecha', 'Grupo', 'Alumno/Equipo', 'Juego', 'Puntos', 'Nivel', 'Cromos', 'Privilegio']],
          body: tablaEventos
        });

        //Nombre del fichero y Guardado
        let filename: string = `RegistroActividadClasspip_${dia}-${mes}-${anyo}_${hora}-${minutos}.pdf`;
        doc.save(filename);

        this.cargando = false;
      }, (err) => {
        console.log(err);
        Swal.fire({
          title: "Error al obtener la tabla de Eventos para generar el PDF",
          text: err.message,
          icon: "error",
          showConfirmButton: false,
          timer: 3000
        });
        this.cargando = false;
      });
    }, (err) => {
      console.log(err);
      Swal.fire({
        title: "Error al obtener la tabla de Filtros para generar el PDF",
        text: err.message,
        icon: "error",
        showConfirmButton: false,
        timer: 3000
      });
      this.cargando = false;
    });
  }
}

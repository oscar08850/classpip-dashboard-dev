import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

// Clases
import { Juego, Jornada, TablaJornadas, TablaAlumnoJuegoDeCompeticion,
         TablaEquipoJuegoDeCompeticion, TablaClasificacionJornada, AlumnoJuegoDeCompeticionFormulaUno,
         EquipoJuegoDeCompeticionFormulaUno} from '../../../../clases/index';

// Servicio
import { SesionService , CalculosService, PeticionesAPIService } from '../../../../servicios/index';
import { forEach } from '@angular/router/src/utils/collection';
import { MatTableDataSource } from '@angular/material';
import { identifierModuleUrl } from '@angular/compiler';

export interface Asignacion {
  modo: string;
  id: number;
}

const ModoAsignacion: Asignacion[] = [
  {modo: 'Manualmente', id: 1},
  {modo: 'Aleatoriamente', id: 2},
];

@Component({
  selector: 'app-ganadores-juego-de-competicion-formula-uno',
  templateUrl: './ganadores-juego-de-competicion-formula-uno.component.html',
  styleUrls: ['./ganadores-juego-de-competicion-formula-uno.component.scss']
})
export class GanadoresJuegoDeCompeticionFormulaUnoComponent implements OnInit {

  // Juego De CompeticionLiga seleccionado
  juegoSeleccionado: Juego;
  numeroTotalJornadas: number;
  jornadasDelJuego: Jornada[];
  JornadasCompeticion: TablaJornadas[] = [];
  tablaJornadaSelccionada: TablaJornadas;
  jornadaId: number;

  modoAsignacion: Asignacion[] = ModoAsignacion;
  modoAsignacionId: number;
  botonAsignarAleatorioDesactivado = true;
  botonAsignarManualDesactivado = true;

  manualmente = false;
  aleatoriamente = true;

  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeCompeticionFormulaUno[];
  listaEquiposOrdenadaPorPuntos: EquipoJuegoDeCompeticionFormulaUno[];

  listaAlumnosClasificacion: TablaAlumnoJuegoDeCompeticion[] = [];
  listaEquiposClasificacion: TablaEquipoJuegoDeCompeticion[] = [];
  datosClasificaciónJornada: {participante: string[];
                              puntos: number[];
                              posicion: number[];
                              participanteId: number[];
                             };

  TablaClasificacionJornadaSeleccionada: TablaClasificacionJornada[];

  // Columnas Tabla
  displayedColumns: string[] = ['posicion', 'participante', 'puntos'];

  dataSourceClasificacionJornada;

  constructor(public sesion: SesionService,
              public location: Location,
              public calculos: CalculosService,
              public peticionesAPI: PeticionesAPIService) { }


  ngOnInit() {
    console.log('Estoy en ngOnInit de ganadores formula uno');
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.numeroTotalJornadas = this.juegoSeleccionado.NumeroTotalJornadas;
    console.log('Juego seleccionado: ');
    console.log(this.juegoSeleccionado);
    console.log('Número total de jornadas: ');
    console.log(this.numeroTotalJornadas);
    const datos = this.sesion.DameDatosJornadas();
    this.JornadasCompeticion = datos.JornadasCompeticion;
    this.jornadasDelJuego = datos.jornadas;
    this.listaAlumnosClasificacion = this.sesion.DameTablaAlumnoJuegoDeCompeticion();
    console.log('tabla alumnos clasificación:');
    console.log(this.listaAlumnosClasificacion);
    this.listaEquiposClasificacion = this.sesion.DameTablaEquipoJuegoDeCompeticion();
    console.log('tabla equipos clasificación:');
    console.log(this.listaEquiposClasificacion);
    this.listaAlumnosOrdenadaPorPuntos = this.sesion.DameInscripcionAlumno();
    this.listaEquiposOrdenadaPorPuntos = this.sesion.DameInscripcionEquipo();
  }

  ActualizarBoton() {
    console.log('Estoy en actualizar botón');
    console.log(this.modoAsignacionId);
    if (this.modoAsignacionId === undefined || this.jornadaId === undefined) {
      this.botonAsignarAleatorioDesactivado = true;
      this.botonAsignarManualDesactivado = true;
    } else if (Number(this.modoAsignacionId) === 1) { // Manual
      console.log('Modo manual');
      this.botonAsignarAleatorioDesactivado = true;
      this.botonAsignarManualDesactivado = false;
    } else if (Number(this.modoAsignacionId) === 2) { // Aleatorio
      console.log('Modo aleatorio');
      this.botonAsignarManualDesactivado = true;
      this.botonAsignarAleatorioDesactivado = false;
      this.ObtenerClasificaciónDeCadaJornada();
    }
  }

  ObtenerClasificaciónDeCadaJornada() {
    console.log('Estoy en ObtenerClasificaciónDeCadaJornada');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.JornadasCompeticion.length; i++) {
      const JornadasCompeticionId = this.JornadasCompeticion[i].id;
      console.log(JornadasCompeticionId + '===' + this.jornadaId);
      if (JornadasCompeticionId === Number(this.jornadaId)) {
        this.tablaJornadaSelccionada = this.JornadasCompeticion[i];
      }
    }
    console.log(this.tablaJornadaSelccionada);
    console.log('El id de la jornada seleccionada es: ' + this.tablaJornadaSelccionada.id);
    this.datosClasificaciónJornada = this.calculos.ClasificacionJornada(this.juegoSeleccionado, this.listaAlumnosClasificacion,
                                                     this.listaEquiposClasificacion,
                                                     this.tablaJornadaSelccionada.GanadoresFormulaUno.nombre,
                                                     this.tablaJornadaSelccionada.GanadoresFormulaUno.id);
    // console.log(this.datosClasificaciónJornada.participante);
    // console.log(this.datosClasificaciónJornada.puntos);
    // console.log(this.datosClasificaciónJornada.posicion);
    this.ConstruirTablaClasificaciónJornada();
  }

  ConstruirTablaClasificaciónJornada() {
    console.log ('Aquí tendré la tabla de clasificación, los participantes ordenados son:');
    console.log(this.datosClasificaciónJornada.participante);
    console.log(this.datosClasificaciónJornada.puntos);
    console.log(this.datosClasificaciónJornada.posicion);
    this.TablaClasificacionJornadaSeleccionada = this.calculos.PrepararTablaRankingJornadaFormulaUno(this.datosClasificaciónJornada);
    this.dataSourceClasificacionJornada = new MatTableDataSource(this.TablaClasificacionJornadaSeleccionada);
    console.log(this.dataSourceClasificacionJornada.data);
  }

  AsignarAleatoriamente() {
    console.log('Falta hacer la función de aleatoriamente');
    const numeroParticipantesPuntuan = this.juegoSeleccionado.NumeroParticipantesPuntuan;
    const participantesPuntuan: AlumnoJuegoDeCompeticionFormulaUno[] = [];
    const participantes: AlumnoJuegoDeCompeticionFormulaUno[] = this.listaAlumnosOrdenadaPorPuntos;
    let i = 0;
    while (i < numeroParticipantesPuntuan) {
      const numeroParticipantes = participantes.length;
      const elegido = Math.floor(Math.random() * numeroParticipantes);
      participantesPuntuan.push(this.listaAlumnosOrdenadaPorPuntos[elegido]);
      participantes.splice(elegido, 1);
      i++;
    }
    console.log('Los participantes que puntúan son: ');
    console.log(participantesPuntuan);
    // Swal.fire(this.alumnoElegido.Nombre + ' Enhorabuena', 'Cromo asignado correctamente', 'success');
  }

  goBack() {
    this.location.back();
  }
}

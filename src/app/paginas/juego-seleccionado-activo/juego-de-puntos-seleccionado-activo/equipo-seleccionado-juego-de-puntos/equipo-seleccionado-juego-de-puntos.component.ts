import { Component, OnInit } from '@angular/core';
import { ResponseContentType, Http, Response } from '@angular/http';

import { Alumno, Equipo, Juego, Punto, Nivel, AlumnoJuegoDePuntos, EquipoJuegoDePuntos,
  TablaAlumnoJuegoDePuntos, HistorialPuntosAlumno, TablaHistorialPuntosEquipo } from '../../../../clases/index';

// Services
import { JuegoService, JuegoDePuntosService, AlumnoService, EquipoService } from '../../../../servicios/index';


// Imports para abrir diálogo
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogoConfirmacionComponent } from '../../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';

@Component({
  selector: 'app-equipo-seleccionado-juego-de-puntos',
  templateUrl: './equipo-seleccionado-juego-de-puntos.component.html',
  styleUrls: ['./equipo-seleccionado-juego-de-puntos.component.scss']
})
export class EquipoSeleccionadoJuegoDePuntosComponent implements OnInit {

  juegoSeleccionado: Juego;
  equipoSeleccionado: Equipo;
  equipoJuegoDePuntos: EquipoJuegoDePuntos;

  // Recupera la informacion del juego, los alumnos o los equipos, los puntos y los niveles del juego
  equiposDelJuego: Equipo[];
  puntosDelJuego: Punto[];
  nivelesDelJuego: Nivel[];

  nivel: Nivel;
  siguienteNivel: Nivel;

  // imagen
  imagenPerfil: string;

  alumnosEquipo: Alumno[];

  listaSeleccionable: Punto[] = [];

  puntoSeleccionadoId: number;

  historial: TablaHistorialPuntosEquipo[] = [];
  historialTotal: TablaHistorialPuntosEquipo[] = [];

  displayedColumnsAlumnos: string[] = ['nombre', 'descripcion', 'valorPunto', 'fecha', ' '];

  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres borrar estos puntos a ';

  posicion: number;

  constructor( private juegoService: JuegoService,
               private equipoService: EquipoService,
               private juegoDePuntosService: JuegoDePuntosService,
               public dialog: MatDialog,
               public snackBar: MatSnackBar,
               private http: Http) { }

  ngOnInit() {

    this.nivelesDelJuego = this.juegoDePuntosService.RecibirNivelesDelServicio();
    this.equipoSeleccionado = this.equipoService.RecibirEquipoDelServicio();
    this.juegoSeleccionado = this.juegoService.RecibirJuegoDelServicio();
    this.equipoJuegoDePuntos = this.juegoDePuntosService.RecibirInscripcionEquipoDelServicio();
    this.puntosDelJuego = this.juegoDePuntosService.RecibirPuntosDelServicio();
    this.posicion = this.juegoDePuntosService.RecibirPosicionDelServicio();


    this.Nivel();
    this.GET_ImagenPerfil();

    this.listaSeleccionable[0] =  new Punto('Totales');

    this.AlumnosDelEquipo(this.equipoSeleccionado[0]);

    this.MostrarHistorialSeleccionado();
  }

  AlumnosDelEquipo(equipo: Equipo) {

    this.equipoService.GET_AlumnosEquipo(equipo.id)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.alumnosEquipo = res;
        console.log(res);
      } else {
        console.log('No hay alumnos en este equipo');
        this.alumnosEquipo = undefined;
      }
    });
  }

  // Busca el logo que tiene el nombre del equipo.FotoEquipo y lo carga en imagenLogo
  GET_ImagenPerfil() {

    if (this.equipoSeleccionado[0].FotoEquipo !== undefined ) {
      this.http.get('http://localhost:3000/api/imagenes/LogosEquipos/download/' + this.equipoSeleccionado[0].FotoEquipo,
      { responseType: ResponseContentType.Blob })
      .subscribe(response => {

        const blob = new Blob([response.blob()], { type: 'image/jpg'});

        const reader = new FileReader();
        reader.addEventListener('load', () => {
          this.imagenPerfil = reader.result.toString();
        }, false);

        if (blob) {
          reader.readAsDataURL(blob);
        }

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.puntosDelJuego.length; i ++) {
          this.listaSeleccionable.push(this.puntosDelJuego[i]);
        }
      });
    }
  }


  Nivel() {

    this.OrdenarNiveles();
    this.nivel = this.BuscarNivelActual(this.equipoJuegoDePuntos[0].nivelId);
    console.log(this.nivel);


    // Si el alumno ya ha alcanzado algun nivel, buscamos cual es el siguiente nivel del que ya tiene. Sino el siguiente
    // nivel será el primero
    if (this.equipoJuegoDePuntos[0].nivelId !== undefined) {
      console.log('tiene un nivel');
      // Si no estoy en el último nivel, busco el siguiente nivel
      if (this.equipoJuegoDePuntos[0].nivelId !== this.nivelesDelJuego[this.nivelesDelJuego.length - 1].id) {
        this.siguienteNivel = this.BuscarSiguienteNivel(this.equipoJuegoDePuntos[0].nivelId);
      } else {
        this.siguienteNivel = undefined;
      }
      this.porcentaje();
    } else {
      console.log('no tiene un nivel');
      this.siguienteNivel = this.nivelesDelJuego[0];
      this.porcentaje();
    }
  }

  OrdenarNiveles() {

    // tslint:disable-next-line:only-arrow-functions
    this.nivelesDelJuego = this.nivelesDelJuego.sort(function(obj1, obj2) {
      return obj1.PuntosAlcanzar - obj2.PuntosAlcanzar;
    });
    return this.nivelesDelJuego;
  }

  BuscarSiguienteNivel(nivelId: number): Nivel {

    console.log('Voy a buscar el siguiente nivel');
    // tslint:disable-next-line:no-inferrable-types
    let encontrado: boolean = false;
    let i = 0;
    while ((i < this.nivelesDelJuego.length) && (encontrado === false)) {

      if (this.nivelesDelJuego[i].id === nivelId) {
        encontrado = true;
      }
      i = i + 1;
    }

    return this.nivelesDelJuego[i];
  }

  BuscarNivelActual(nivelId: number): Nivel {

    this.nivel = this.nivelesDelJuego.filter(res => res.id === nivelId)[0];

    return this.nivel;
  }

  porcentaje(): number {

    let porcentaje: number;
    console.log('voy a mostrar el porcentaje');
    if (this.nivel !== undefined) {
      // Si no estoy en el útlimo nivel, busco el porcentaje. Sino el porcentaje es 1.
      if (this.equipoJuegoDePuntos[0].nivelId !== this.nivelesDelJuego[this.nivelesDelJuego.length - 1].id) {
        porcentaje = (this.equipoJuegoDePuntos[0].PuntosTotalesEquipo - this.nivel.PuntosAlcanzar) /
        (this.siguienteNivel.PuntosAlcanzar - this.nivel.PuntosAlcanzar);
        console.log('no estoy en el ultimo nivel');

      } else {
        porcentaje = 1;
      }

    } else {
      console.log('El sigueinte nivel es el primero');
      console.log(this.equipoJuegoDePuntos[0].PuntosTotalesEquipo);
      porcentaje = (this.equipoJuegoDePuntos[0].PuntosTotalesEquipo - 0) / (this.siguienteNivel.PuntosAlcanzar - 0);
    }

    return porcentaje;
  }

  MostrarHistorialSeleccionado() {

    console.log('voy a por el historial');

    // Si es indefinido muestro la tabla del total de puntos
    if (this.puntosDelJuego.filter(res => res.id === Number(this.puntoSeleccionadoId))[0] === undefined) {
      console.log('entro a mostrar la tabla');

      this.HistorialTotal();

    } else {

      console.log('Tabla historial de un punto concreto');
      this.HistorialPorPunto();

    }
  }

  HistorialTotal() {
    console.log('Voy a por el historial');
    this.historial = [];

    this.juegoDePuntosService.GET_HistorialPuntosEquipo(this.equipoJuegoDePuntos[0].id)
    .subscribe(historial => {
      console.log(historial);

      if (historial[0] !== null) {
        for (let i = 0; i < historial.length; i++) {
          this.historial[i] = new TablaHistorialPuntosEquipo (this.BuscarPunto(historial[i].puntoId).Nombre,
          this.BuscarPunto(historial[i].puntoId).Descripcion, historial[i].ValorPunto, historial[i].fecha,
          historial[i].equipoJuegoDePuntosId, historial[i].id, historial[i].puntoId);
        }
      } else {
        this.historial = undefined;
      }


    });

    this.historial = this.historial.filter(res => res.nombre !== '');
    this.historialTotal = this.historial;
    return this.historial;
  }

  HistorialPorPunto() {

    this.historial = this.historialTotal;
    this.historial = this.historial.filter(historial => historial.puntoId === Number(this.puntoSeleccionadoId));
    return this.historial;
    console.log(this.historial);
  }

  BuscarPunto(puntoId: number): Punto {

    let punto: Punto;
    punto = this.puntosDelJuego.filter(res => res.id === puntoId)[0];
    return (punto);
  }

  BorrarPunto(punto: TablaHistorialPuntosEquipo) {
    console.log(punto);

    // Buscamos los nuevos puntos
    let nuevosPuntos: number;
    nuevosPuntos = (Number(this.equipoJuegoDePuntos[0].PuntosTotalesEquipo) - Number(punto.valorPunto));
    console.log(nuevosPuntos);
    this.equipoJuegoDePuntos[0].PuntosTotalesEquipo = nuevosPuntos;

    this.juegoDePuntosService.DELETE_PuntosEquipo(punto.historialId).subscribe();



    console.log('Borro los puntos y miro que puntos totales tengo');

    // Comprobamos si subimos de nivel o no
    // tslint:disable-next-line:curly
    if (this.nivel !== undefined) {
      if (nuevosPuntos < this.nivel.PuntosAlcanzar) {
        if (this.nivel !== undefined) {
          console.log('Voy a bajar de nivel');
          this.siguienteNivel = this.nivel;
          this.nivel = this.BuscarNivelAnterior(this.nivel.id);
        }

      } else {
        console.log('mantengo el nivel');
      }
    }

    console.log('Voy a editar la base de datos y actualizar la tabla');
    if (this.nivel !== undefined) {
      this.juegoDePuntosService.PUT_PuntosEquiposJuegoDePuntos( new EquipoJuegoDePuntos(this.equipoSeleccionado[0].id,
        this.juegoSeleccionado.id, nuevosPuntos, this.nivel.id), this.equipoJuegoDePuntos[0].id).subscribe(res => {
          console.log(res);
          this.equipoJuegoDePuntos[0] = res;
          this.MostrarHistorialSeleccionado();
        });
    } else {
      this.juegoDePuntosService.PUT_PuntosEquiposJuegoDePuntos( new EquipoJuegoDePuntos(this.equipoSeleccionado[0].id,
        this.juegoSeleccionado.id, nuevosPuntos), this.equipoJuegoDePuntos[0].id).subscribe(res => {
          console.log(res);
          this.equipoJuegoDePuntos[0] = res;
          this.MostrarHistorialSeleccionado();
        });
    }

  }


  BuscarNivelAnterior(nivelId: number): Nivel {

    // tslint:disable-next-line:no-inferrable-types
    let encontrado: boolean = false;
    let i = 0;
    while ((i < this.nivelesDelJuego.length) && (encontrado === false)) {

      if (this.nivelesDelJuego[i].id === nivelId) {
        encontrado = true;
      }
      i = i + 1;
    }
    if (i >= 2) {
      return this.nivelesDelJuego[i - 2];
      console.log('punto plata o mas');
    } else {
      return undefined;
      console.log('punto bronce');
    }
  }

  AbrirDialogoConfirmacionBorrarPunto(punto: TablaHistorialPuntosEquipo): void {

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        nombre: this.equipoSeleccionado[0].Nombre,
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.BorrarPunto(punto);
        this.snackBar.open('Puntos eliminados correctamente', 'Cerrar', {
          duration: 2000,
        });
      }
    });
  }

  prueba() {
    console.log(this.historial);
  }

  prueba2() {
    console.log(this.historial);
  }
}

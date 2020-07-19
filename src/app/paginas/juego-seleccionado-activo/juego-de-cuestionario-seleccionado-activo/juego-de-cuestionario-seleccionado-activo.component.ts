import { Component, OnInit } from '@angular/core';
import { Juego, Alumno } from 'src/app/clases';
import { AlumnoJuegoDeCuestionario } from 'src/app/clases/AlumnoJuegoDeCuestionario';
import { TablaAlumnoJuegoDeCuestionario } from 'src/app/clases/TablaAlumnoJuegoDeCuestionario';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { SesionService, PeticionesAPIService, CalculosService, ComServerService } from 'src/app/servicios';
import { JuegoDeCuestionario } from 'src/app/clases/JuegoDeCuestionario';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
// tslint:disable-next-line:max-line-length
import { InformacionJuegoDeCuestionarioDialogComponent } from './informacion-juego-de-cuestionario-dialog/informacion-juego-de-cuestionario-dialog.component';

import { Howl } from 'howler';



@Component({
  selector: 'app-juego-de-cuestionario-seleccionado-activo',
  templateUrl: './juego-de-cuestionario-seleccionado-activo.component.html',
  styleUrls: ['./juego-de-cuestionario-seleccionado-activo.component.scss']
})
export class JuegoDeCuestionarioSeleccionadoActivoComponent implements OnInit {

  // Juego de Cuestionario saleccionado
  juegoSeleccionado: Juego;

  // Recuperamos la informacion del juego
  alumnosDelJuego: Alumno[];

  // Lista de los alumnos ordenada segun su nota
  listaAlumnosOrdenadaPorNota: AlumnoJuegoDeCuestionario[];
  rankingAlumnosPorNota: TablaAlumnoJuegoDeCuestionario[];

  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estas segura/o que quieres desactivar: ';

  // tslint:disable-next-line:no-inferrable-types
  mensajeFinalizar: string = 'Estas segura/o de que quieres finalizar: ';

  // Orden conlumnas de la tabla
  displayedColumnsAlumnos: string[] = ['nombreAlumno', 'primerApellido', 'segundoApellido', 'nota', ' '];

  dataSourceAlumno;

  // tslint:disable-next-line:no-inferrable-types
  respuestas: number = 0;
  alumnosQueHanContestado: any[];


  constructor(  public dialog: MatDialog,
                public sesion: SesionService,
                public peticionesAPI: PeticionesAPIService,
                public calculos: CalculosService,
                public comServer: ComServerService,
                private location: Location) { }

  ngOnInit() {
    const sound = new Howl({
      src: ['/assets/got-it-done.mp3']
    });
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.AlumnosDelJuego();
    // this.alumnosQueHanContestado = this.sesion.DameAlumnosQueHanContestadoCuestionario();
    // if (this.alumnosQueHanContestado === undefined) {
    //   this.alumnosQueHanContestado = [];
    // }
    this.comServer.EsperoRespuestasJuegoDeCuestionarip()
    .subscribe((alumno: any) => {
        sound.play();
        console.log ('Ya ha contestado: ' + alumno.id);
        console.log ('La nota es: ' + alumno.nota);
        // this.alumnosQueHanContestado.push (alumno);
        // console.log (this.alumnosQueHanContestado);
        // this.sesion.TomaAlumnosQueHanContestadoCuestionario (this.alumnosQueHanContestado);
        this.rankingAlumnosPorNota.filter (a => a.id === alumno.id )[0].nota = alumno.nota;
        this.rankingAlumnosPorNota.filter (a => a.id === alumno.id )[0].contestado = true;
        this.dataSourceAlumno = new MatTableDataSource(this.rankingAlumnosPorNota);
    });
  }

  HaContestado(alumnoId: number): boolean {
    console.log ('voy a ver si ha contestado ' + alumnoId);
    if (this.alumnosQueHanContestado.find (alumno => alumno.id === alumnoId) === undefined) {
      console.log ('No');
      return false;
    } else {
      console.log ('SI');
      return true;
    }
  }
  AlumnosDelJuego() {
    this.peticionesAPI.DameAlumnosJuegoDeCuestionario(this.juegoSeleccionado.id)
    .subscribe(alumnosJuego => {
      this.alumnosDelJuego = alumnosJuego;
      this.RecuperarInscripcionesAlumnoJuego();
    });
  }

  RecuperarInscripcionesAlumnoJuego() {
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeCuestionario(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorNota = inscripciones;
      // tslint:disable-next-line:only-arrow-functions
      this.listaAlumnosOrdenadaPorNota = this.listaAlumnosOrdenadaPorNota.sort(function(a, b) {
        return b.Nota - a.Nota;
      });
      console.log ('inscripciones');
      console.log (this.listaAlumnosOrdenadaPorNota);
      this.TablaClasificacionTotal();
    });
  }

  TablaClasificacionTotal() {
    this.rankingAlumnosPorNota = this.calculos.PrepararTablaRankingCuestionario(this.listaAlumnosOrdenadaPorNota,
      this.alumnosDelJuego);
    this.dataSourceAlumno = new MatTableDataSource(this.rankingAlumnosPorNota);
  }

  DesactivarJuego() {
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.ModificaJuegoDeCuestionario(new JuegoDeCuestionario(this.juegoSeleccionado.NombreJuego, this.juegoSeleccionado.Tipo, this.juegoSeleccionado.PuntuacionCorrecta,
      this.juegoSeleccionado.PuntuacionIncorrecta, this.juegoSeleccionado.Presentacion, false, this.juegoSeleccionado.JuegoTerminado,
      // tslint:disable-next-line:max-line-length
      this.juegoSeleccionado.profesorId, this.juegoSeleccionado.grupoId, this.juegoSeleccionado.cuestionarioId), this.juegoSeleccionado.id, this.juegoSeleccionado.grupoId)
      .subscribe(res => {
        this.location.back();
      });
  }

  AbrirDialogoConfirmacionDesactivar(): void {

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        nombre: this.juegoSeleccionado.Tipo,
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.DesactivarJuego();
        Swal.fire('Desactivado', this.juegoSeleccionado.Tipo + ' Desactivado correctamente', 'success');
      }
    });
  }

  FinalizarJuego() {
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.ModificaJuegoDeCuestionario(new JuegoDeCuestionario(this.juegoSeleccionado.NombreJuego, this.juegoSeleccionado.Tipo, this.juegoSeleccionado.PuntuacionCorrecta,
      this.juegoSeleccionado.PuntuacionIncorrecta, this.juegoSeleccionado.Presentacion, false, true,
      // tslint:disable-next-line:max-line-length
      this.juegoSeleccionado.profesorId, this.juegoSeleccionado.grupoId, this.juegoSeleccionado.cuestionarioId), this.juegoSeleccionado.id, this.juegoSeleccionado.grupoId)
      .subscribe(res => {
        this.location.back();
      });
  }

  AbrirDialogoConfirmacionFinalizar(): void {

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensajeFinalizar,
        nombre: this.juegoSeleccionado.Tipo,
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.FinalizarJuego();
        Swal.fire('Finalizado', this.juegoSeleccionado.Tipo + ' Finalizado correctamente', 'success');
      }
    });
  }

  AbrirDialogoInformacionJuego(): void {
    const dialogRef = this.dialog.open(InformacionJuegoDeCuestionarioDialogComponent, {
      width: '45%',
      height: '60%',
      position: {
        top: '0%'
      }
    });
  }
  applyFilter(filterValue: string) {
    this.dataSourceAlumno.filter = filterValue.trim().toLowerCase();
  }

}

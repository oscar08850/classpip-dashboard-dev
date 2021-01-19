import { Component, OnInit } from '@angular/core';
import { Juego, Alumno } from 'src/app/clases';
import { AlumnoJuegoDeCuestionario } from 'src/app/clases/AlumnoJuegoDeCuestionario';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { SesionService, PeticionesAPIService, CalculosService } from 'src/app/servicios';
import { Location } from '@angular/common';
import { JuegoDeCuestionario } from 'src/app/clases/JuegoDeCuestionario';
import Swal from 'sweetalert2';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { TablaAlumnoJuegoDeCuestionario } from 'src/app/clases/TablaAlumnoJuegoDeCuestionario';
// tslint:disable-next-line:max-line-length
import { InformacionJuegoDeCuestionarioDialogComponent } from '../../juego-seleccionado-activo/juego-de-cuestionario-seleccionado-activo/informacion-juego-de-cuestionario-dialog/informacion-juego-de-cuestionario-dialog.component';

@Component({
  selector: 'app-juego-de-cuestionario-seleccionado-preparado',
  templateUrl: './juego-de-cuestionario-seleccionado-preparado.component.html',
  styleUrls: ['./juego-de-cuestionario-seleccionado-preparado.component.scss']
})
export class JuegoDeCuestionarioSeleccionadoPreparadoComponent implements OnInit {

  // Juego de Cuestionario saleccionado
  juegoSeleccionado: Juego;

  // Recuperamos la informacion del juego
  alumnosDelJuego: Alumno[];
  // Lista de los alumnos ordenada segun su nota
  listaAlumnosOrdenadaPorNota: AlumnoJuegoDeCuestionario[];
  rankingAlumnosPorNota: TablaAlumnoJuegoDeCuestionario[];

  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estas segura/o que quieres activar: ';

  // tslint:disable-next-line:no-inferrable-types
  mensajeFinalizar: string = 'Estas segura/o de que quieres finalizar: ';
  // tslint:disable-next-line:no-inferrable-types
  mensajeEliminar: string = 'Estas segura/o de que quieres eliminar: ';

  // Orden conlumnas de la tabla
  displayedColumnsAlumnos: string[] = ['nombreAlumno', 'primerApellido', 'segundoApellido', 'nota'];

  dataSourceAlumno;

  constructor(  public dialog: MatDialog,
                public sesion: SesionService,
                public peticionesAPI: PeticionesAPIService,
                public calculos: CalculosService,
                private location: Location) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.AlumnosDelJuego();
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
      this.TablaClasificacionTotal();
    });
  }

  TablaClasificacionTotal() {
    this.rankingAlumnosPorNota = this.calculos.PrepararTablaRankingCuestionario(this.listaAlumnosOrdenadaPorNota,
      this.alumnosDelJuego);
    this.dataSourceAlumno = new MatTableDataSource(this.rankingAlumnosPorNota);
  }

  ActivarJuego() {
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.ModificaJuegoDeCuestionario(new JuegoDeCuestionario(this.juegoSeleccionado.NombreJuego, this.juegoSeleccionado.Tipo, this.juegoSeleccionado.Modalidad, this.juegoSeleccionado.PuntuacionCorrecta,
      this.juegoSeleccionado.PuntuacionIncorrecta, this.juegoSeleccionado.Presentacion, true, this.juegoSeleccionado.JuegoTerminado,
      // tslint:disable-next-line:max-line-length
      this.juegoSeleccionado.profesorId, this.juegoSeleccionado.grupoId, this.juegoSeleccionado.cuestionarioId), this.juegoSeleccionado.id, this.juegoSeleccionado.grupoId)
      .subscribe(res => {
        this.location.back();
      });
  }

  AbrirDialogoConfirmacionActivar(): void {

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        nombre: this.juegoSeleccionado.Tipo,
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.ActivarJuego();
        Swal.fire('Activado', this.juegoSeleccionado.Tipo + ' activado correctamente', 'success');
      }
    });
  }

  EliminarJuego() {
    this.calculos.EliminarJuegoDeCuestionario()
      .subscribe(() => {
        this.location.back();
      });
  }

  AbrirDialogoConfirmacionEliminar(): void {

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensajeEliminar,
        nombre: this.juegoSeleccionado.Tipo,
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.EliminarJuego();
        Swal.fire('Eliminado', this.juegoSeleccionado.Tipo + ' eliminado correctamente', 'success');
      }
    });
  }

  AbrirDialogoInformacionJuego(): void {
    const dialogRef = this.dialog.open(InformacionJuegoDeCuestionarioDialogComponent, {
      width: '45%',
      height: '70%',
      position: {
        top: '0%'
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSourceAlumno.filter = filterValue.trim().toLowerCase();
  }

}

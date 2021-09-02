import { Component, OnInit } from '@angular/core';
import { Juego, Alumno, Equipo, EquipoJuegoDeCuestionario, TablaEquipoJuegoDeCuestionario } from 'src/app/clases';
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
  juegoSeleccionado: any;

  // Recuperamos la informacion del juego
  alumnosDelJuego: Alumno[];
  equiposDelJuego: Equipo[];
  // Lista de los alumnos ordenada segun su nota
  listaAlumnosOrdenadaPorNota: AlumnoJuegoDeCuestionario[];
  rankingAlumnosPorNota: TablaAlumnoJuegoDeCuestionario[];
  listaEquiposOrdenadaPorNota: EquipoJuegoDeCuestionario[];
  rankingEquiposPorNota: TablaEquipoJuegoDeCuestionario[];

  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estas segura/o que quieres activar: ';

  // tslint:disable-next-line:no-inferrable-types
  mensajeFinalizar: string = 'Estas segura/o de que quieres finalizar: ';
  // tslint:disable-next-line:no-inferrable-types
  mensajeEliminar: string = 'Estas segura/o de que quieres eliminar: ';

  // Orden conlumnas de la tabla
  displayedColumnsAlumnos: string[] = ['nombreAlumno', 'primerApellido', 'segundoApellido', 'nota'];
  displayedColumnsEquipos: string[] = ['nombreEquipo', 'nota'];

  dataSourceAlumno;
  dataSourceEquipo;

  constructor(  public dialog: MatDialog,
                public sesion: SesionService,
                public peticionesAPI: PeticionesAPIService,
                public calculos: CalculosService,
                private location: Location) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log ('ya tengo el juego');
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.AlumnosDelJuego();
    } else {
      this.EquiposDelJuego();
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
      this.TablaClasificacionTotal();
    });
  }

  TablaClasificacionTotal() {
    this.rankingAlumnosPorNota = this.calculos.PrepararTablaRankingCuestionario(this.listaAlumnosOrdenadaPorNota,
      this.alumnosDelJuego);
    this.dataSourceAlumno = new MatTableDataSource(this.rankingAlumnosPorNota);
  }

  
  EquiposDelJuego() {
    console.log ('vamos por los alumnos');
    this.peticionesAPI.DameEquiposJuegoDeCuestionario(this.juegoSeleccionado.id)
    .subscribe(equiposJuego => {
      this.equiposDelJuego = equiposJuego;
      this.RecuperarInscripcionesEquipoJuego();
    });
  }

  RecuperarInscripcionesEquipoJuego() {
    this.peticionesAPI.DameInscripcionesEquipoJuegoDeCuestionario(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaEquiposOrdenadaPorNota = inscripciones;
      // En el caso de que el cuestionario sea clásico y algunos equipos hayan contestado, entonces en la propia inscripción
      // está la nota que sacó el alumno y el tiempo que empleó en contestar. Asi que ordeno la lista segun nota y tiempo (en caso de misma nota)
      // tslint:disable-next-line:only-arrow-functions
      this.listaEquiposOrdenadaPorNota = this.listaEquiposOrdenadaPorNota.sort(function(a, b) {
        if (b.Nota !== a.Nota) {
          return b.Nota - a.Nota;
        } else {
          // en caso de empate en la nota, gana el que empleó menos tiempo
          return a.TiempoEmpleado - b.TiempoEmpleado;
        }
      });
      console.log ('inscripciones');
      console.log (this.listaEquiposOrdenadaPorNota);
      this.TablaClasificacionTotalEquipos();
    });
  }

  TablaClasificacionTotalEquipos() {
    // Ahora preparo la tabla para mostrar la clasificación. Básicamente, junto en la misma tabla nombre del equipo con la nota
    this.rankingEquiposPorNota = this.calculos.PrepararTablaRankingEquiposCuestionario(this.listaEquiposOrdenadaPorNota,
      this.equiposDelJuego);
    this.dataSourceEquipo = new MatTableDataSource(this.rankingEquiposPorNota);
  }

  

  ActivarJuego() {
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.ModificaJuegoDeCuestionario(new JuegoDeCuestionario(this.juegoSeleccionado.NombreJuego, this.juegoSeleccionado.Tipo, this.juegoSeleccionado.Modo, this.juegoSeleccionado.Modalidad, this.juegoSeleccionado.PuntuacionCorrecta,
      this.juegoSeleccionado.PuntuacionIncorrecta, this.juegoSeleccionado.Presentacion, true, this.juegoSeleccionado.JuegoTerminado,
      // tslint:disable-next-line:max-line-length
      this.juegoSeleccionado.profesorId, this.juegoSeleccionado.grupoId, this.juegoSeleccionado.cuestionarioId), this.juegoSeleccionado.id)
      .subscribe(res => {
        this.location.back();
      });
  }

 
  
  Activar() {
    Swal.fire({
      title: '¿Seguro que quieres activar el juego?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {

        this.juegoSeleccionado.JuegoActivo = true;
        this.peticionesAPI.ModificaJuegoDeCuestionario (this.juegoSeleccionado, this.juegoSeleccionado.id)
        .subscribe(res => {
            if (res !== undefined) {
              Swal.fire('El juego se ha activado correctamente');
              this.location.back();
            }
        });
      }
    });
  }



  
  AbrirDialogoConfirmacionEliminar(): void {

    Swal.fire({
      title: 'Confirma que quieres eliminar el juego <b>' + this.juegoSeleccionado.NombreJuego + '</b>',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
    }).then(async (result) => {
      if (result.value) {
        await this.calculos.EliminarJuegoDeCuestionario(this.juegoSeleccionado);
        Swal.fire('Juego eliminado correctamente', ' ', 'success');
        this.location.back();
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

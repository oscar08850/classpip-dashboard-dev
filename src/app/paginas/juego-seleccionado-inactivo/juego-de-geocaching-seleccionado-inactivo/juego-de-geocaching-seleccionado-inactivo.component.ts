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
import { InformacionJuegoDeGeocachingDialogComponent } from '../../juego-seleccionado-activo/juego-de-geocaching-seleccionado-activo/informacion-juego-de-geocaching-dialog/informacion-juego-de-geocaching-dialog.component';
import { AlumnoJuegoDeGeocaching } from 'src/app/clases/AlumnoJuegoDeGeocaching';
import { TablaAlumnoJuegoDeGeocaching } from 'src/app/clases/TablaAlumnoJuegoDeGeocaching';

@Component({
  selector: 'app-juego-de-geocaching-seleccionado-inactivo',
  templateUrl: './juego-de-geocaching-seleccionado-inactivo.component.html',
  styleUrls: ['./juego-de-geocaching-seleccionado-inactivo.component.scss']
})
export class JuegoDeGeocachingSeleccionadoInactivoComponent implements OnInit {

  // Juego de Cuestionario saleccionado
  juegoSeleccionado: Juego;

  // Recuperamos la informacion del juego
  alumnosDelJuego: Alumno[];

  // Lista de los alumnos ordenada segun su nota
  listaAlumnosOrdenadaPorPuntuacion: AlumnoJuegoDeGeocaching[];
  rankingAlumnosPorPuntuacion: TablaAlumnoJuegoDeGeocaching[];

  // tslint:disable-next-line:no-inferrable-types
  mensajeEliminar: string = 'Estas segura/o de que quieres eliminar: ';

  // Orden conlumnas de la tabla
  displayedColumnsAlumnos: string[] = ['nombreAlumno', 'primerApellido', 'segundoApellido', 'puntuacion', 'etapas'];

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
    this.peticionesAPI.DameAlumnosJuegoDeGeocaching(this.juegoSeleccionado.id)
    .subscribe(alumnosJuego => {
      this.alumnosDelJuego = alumnosJuego;
      this.RecuperarInscripcionesAlumnoJuego();
    });
  }

  RecuperarInscripcionesAlumnoJuego() {
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeGeocaching(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorPuntuacion = inscripciones;
      // tslint:disable-next-line:only-arrow-functions
      this.listaAlumnosOrdenadaPorPuntuacion = this.listaAlumnosOrdenadaPorPuntuacion.sort(function(a, b) {
        return b.Puntuacion - a.Puntuacion;
      });
      this.TablaClasificacionTotal();
    });
  }

  TablaClasificacionTotal() {
    this.rankingAlumnosPorPuntuacion = this.calculos.PrepararTablaRankingGeocaching(this.listaAlumnosOrdenadaPorPuntuacion,
      this.alumnosDelJuego);
    this.dataSourceAlumno = new MatTableDataSource(this.rankingAlumnosPorPuntuacion);
  }


 
  AbrirDialogoConfirmacionEliminar(): void {

    Swal.fire({
      title: 'Confirma que quieres eliminar el juego <b>' + this.juegoSeleccionado.NombreJuego + '</b>',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
    }).then(async (result) => {
      if (result.value) {
        await this.calculos.EliminarJuegoDeGeocaching(this.juegoSeleccionado);
        Swal.fire('Juego eliminado correctamente', ' ', 'success');
        this.location.back();
      }
    });





    // const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
    //   height: '150px',
    //   data: {
    //     mensaje: this.mensajeEliminar,
    //     nombre: this.juegoSeleccionado.Tipo,
    //   }
    // });

    // dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    //   if (confirmed) {
    //     this.EliminarJuego();
    //     Swal.fire('Eliminado', this.juegoSeleccionado.Tipo + ' eliminado correctamente', 'success');
    //   }
    // });
  }

  AbrirDialogoInformacionJuego(): void {
    const dialogRef = this.dialog.open(InformacionJuegoDeGeocachingDialogComponent, {
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

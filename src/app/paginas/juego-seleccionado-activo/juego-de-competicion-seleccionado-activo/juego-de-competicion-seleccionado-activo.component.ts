import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
// Clases
import { Alumno, Equipo, Juego, AlumnoJuegoDeCompeticionLiga, EquipoJuegoDeCompeticionLiga } from '../../../clases/index';

// Servicio
import { JuegoService, EquipoService, AlumnoService, ColeccionService, JuegoDeColeccionService } from '../../../servicios/index';
import { SesionService, PeticionesAPIService, CalculosService } from '../../../servicios/index';

// Imports para abrir diálogo y snackbar
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';


@Component({
  selector: 'app-juego-de-competicion-seleccionado-activo',
  templateUrl: './juego-de-competicion-seleccionado-activo.component.html',
  styleUrls: ['./juego-de-competicion-seleccionado-activo.component.scss']
})
export class JuegoDeCompeticionSeleccionadoActivoComponent implements OnInit {

  juegoSeleccionado: Juego;

  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres desactivar el ';

  constructor(private juegoService: JuegoService,
              private alumnoService: AlumnoService,
              private equipoService: EquipoService,
              private coleccionService: ColeccionService,
              private juegoDeColeccionService: JuegoDeColeccionService,
              public dialog: MatDialog,
              public snackBar: MatSnackBar,
              public sesion: SesionService,
              public peticionesAPI: PeticionesAPIService,
              public calculos: CalculosService,
              private location: Location) {}

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log(this.juegoSeleccionado);
  }


  DesactivarJuego() {
    console.log(this.juegoSeleccionado);
    this.peticionesAPI.CambiaEstadoJuegoDeCompeticionLiga(new Juego (this.juegoSeleccionado.Tipo, this.juegoSeleccionado.Modo,
      undefined, false), this.juegoSeleccionado.id, this.juegoSeleccionado.grupoId).subscribe(res => {
        if (res !== undefined) {
          console.log(res);
          console.log('juego desactivado');
          this.location.back();
        }
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
        this.snackBar.open(this.juegoSeleccionado.Tipo + ' desactivado correctamente', 'Cerrar', {
          duration: 2000,
        });
      }
    });
  }
  goBack() {
    this.location.back();
  }
}

import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
// Clases
// tslint:disable-next-line:max-line-length
import { Alumno, Juego, AlumnoJuegoDeCompeticionLiga, TablaAlumnoJuegoDeCompeticion } from '../../../../clases/index';

// Servicio
import { SesionService, PeticionesAPIService, CalculosService } from '../../../../servicios/index';

// Imports para abrir diálogo y snackbar
import { MatDialog, MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-editar-jornadas-juego-de-competicion',
  templateUrl: './editar-jornadas-juego-de-competicion.component.html',
  styleUrls: ['./editar-jornadas-juego-de-competicion.component.scss']
})
export class EditarJornadasJuegoDeCompeticionComponent implements OnInit {

  constructor(  public dialog: MatDialog,
                public snackBar: MatSnackBar,
                public sesion: SesionService,
                public peticionesAPI: PeticionesAPIService,
                public calculos: CalculosService,
                private location: Location) {}

  ngOnInit() {

  }
}

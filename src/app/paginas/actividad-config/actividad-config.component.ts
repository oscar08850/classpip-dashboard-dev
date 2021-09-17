import { Component, OnInit } from '@angular/core';
import { Profesor } from 'src/app/clases';
import { SesionService } from 'src/app/servicios';
import { CdkColumnDef } from '@angular/cdk/table';

@Component({
  selector: 'app-actividad-config',
  templateUrl: './actividad-config.component.html',
  styleUrls: ['./actividad-config.component.scss']
})
export class ActividadConfigComponent implements OnInit {

  //Arrays que contienen los flags para configurar los registros y notificaciones ([1] → Creación del Juego, [2] → Acceso al Juego, [10] → Asignación de Puntos, etc.)
  registros: boolean[];
  notificaciones: boolean[];

  constructor(
    private sesionService: SesionService
  ) { }

  ngOnInit() {
    //Los arrays se rellenarán con los datos que le vengan de la última configuración del profesor (nuevo parámetro Config del modelo Profesor)
    let profesor: Profesor = this.sesionService.DameProfesor();
    this.registros = [];
    this.notificaciones = [];
  }

  GuardarCambios(){

  }

}

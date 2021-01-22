import { Component, OnInit } from '@angular/core';
import {PeticionesAPIService, SesionService} from '../../../servicios';
import {JuegoDeEvaluacion} from '../../../clases/JuegoDeEvaluacion';
import {Alumno} from '../../../clases';
import {AlumnoJuegoDeEvaluacion} from '../../../clases/AlumnoJuegoDeEvaluacion';

@Component({
  selector: 'app-juego-de-evaluacion-activo',
  templateUrl: './juego-de-evaluacion-activo.component.html',
  styleUrls: ['./juego-de-evaluacion-activo.component.scss']
})
export class JuegoDeEvaluacionActivoComponent implements OnInit {

  juego: JuegoDeEvaluacion;
  alumnos: Alumno[];
  alumnosRelacion: AlumnoJuegoDeEvaluacion[];
  // Tabla
  displayedColumns: string[];
  tmpDisplayedColumns: (number | string)[][];
  datosTablaIndividual = [];

  constructor(
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService
  ) { }

  ngOnInit() {
    this.juego = this.sesion.DameJuego() as unknown as JuegoDeEvaluacion;
    console.log(this.juego);
    if (this.juego.Modo === 'Individual') {
      this.peticionesAPI.DameRelacionAlumnosJuegoDeEvaluacion(this.juego.id)
        .subscribe((res: AlumnoJuegoDeEvaluacion[]) => {
          this.alumnosRelacion = res;
          this.ConstruirTablaIndividual();
        });
      this.peticionesAPI.DameAlumnosJuegoDeEvaluacion(this.juego.id)
        .subscribe((res: Alumno[]) => {
          this.alumnos = res;
          this.ConstruirTablaIndividual();
        });
    }
  }

  ConstruirTablaIndividual() {
    if (!this.alumnos || !this.alumnosRelacion) {
      return;
    }
    this.tmpDisplayedColumns = this.alumnos.map(item => [item.id, item.Nombre]);
    this.alumnos.forEach((alumno) => {
      const row = {
        Nombre: undefined
      };
      const evaluado = this.alumnosRelacion.find(item => item.alumnoId === alumno.id);
      row.Nombre = this.alumnos.find(item => item.id === evaluado.alumnoId).Nombre;
      this.tmpDisplayedColumns.forEach((item: (number|string)[]) => {
        row[item[1]] = evaluado.respuestas.find(res => res.alumnoId === item[0]) ? 'YES' : 'NO';
      });
      this.datosTablaIndividual.push(row);
    });
    this.displayedColumns = this.tmpDisplayedColumns.map(item => item[1]) as string[];
    this.displayedColumns.unshift('Nombre');
    this.displayedColumns.push('Nota Media');
    console.log(this.tmpDisplayedColumns);
    console.log(this.displayedColumns);
    console.log(this.datosTablaIndividual);
  }

}

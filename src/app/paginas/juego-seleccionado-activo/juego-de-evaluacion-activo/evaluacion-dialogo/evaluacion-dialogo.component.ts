import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {JuegoDeEvaluacion} from '../../../../clases/JuegoDeEvaluacion';
import {Alumno, Equipo, Rubrica} from '../../../../clases';
import {AlumnoJuegoDeEvaluacion} from '../../../../clases/AlumnoJuegoDeEvaluacion';
import {EquipoJuegoDeEvaluacion} from '../../../../clases/EquipoJuegoDeEvaluacion';

export interface DialogData {
  juego: JuegoDeEvaluacion;
  rubrica: Rubrica;
  alumnos: Alumno[];
  alumnosRelacion: AlumnoJuegoDeEvaluacion[];
  equipos: Equipo[];
  equiposRelacion: EquipoJuegoDeEvaluacion[];
  alumnosDeEquipo;
  evaluadorId: number;
  evaluadoId: number;
}

@Component({
  selector: 'app-evaluacion-dialogo',
  templateUrl: './evaluacion-dialogo.component.html',
  styleUrls: ['./evaluacion-dialogo.component.scss']
})
export class EvaluacionDialogoComponent implements OnInit {

  respuestaEvaluacion: any[];

  constructor(
    public dialogRef: MatDialogRef<EvaluacionDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    if (this.data.juego.Modo === 'Individual') {
      const evaluado = this.data.alumnosRelacion.find(item => item.alumnoId === this.data.evaluadoId);
      this.respuestaEvaluacion = evaluado.respuestas.find(item => item.alumnoId === this.data.evaluadorId).respuesta;
    } else if (this.data.juego.Modo === 'Equipos') {
      const evaluado = this.data.equiposRelacion.find(item => item.equipoId === this.data.evaluadoId);
      if (evaluado.alumnosEvaluadoresIds !== null) {
        this.respuestaEvaluacion = evaluado.respuestas.find(item => item.alumnoId === this.data.evaluadorId).respuesta;
      } else {
        const alumnosDeEquipo = this.data.alumnosDeEquipo.find(item => item.equipoId === evaluado.equipoId).alumnos.map(item => item.id);
        this.respuestaEvaluacion = evaluado.respuestas.find(item => alumnosDeEquipo.includes(item.alumnoId)).respuesta;
      }
    }
  }

  CalcularNotaCriterio(index: number): number {
    let subNota: number;
    if (this.data.juego.metodoSubcriterios) {
      subNota = 0;
      for (let j = 1; j < this.data.juego.Pesos[index].length; j++) {
        if (this.respuestaEvaluacion[index][j - 1]) {
          subNota += this.data.juego.Pesos[index][j] / 10;
        }
      }
    } else {
      subNota = 10;
      const fallos = this.respuestaEvaluacion[index].filter(item => item === false).length;
      if (fallos > 0) {
        const minimo = this.data.juego.Penalizacion[index].filter(item => item.num <= fallos);
        const maximo = Math.max.apply(Math, minimo.map(item => item.num));
        const penalizacion = this.data.juego.Penalizacion[index].find(item => item.num === maximo).p;
        subNota = penalizacion / 10;
      }
    }
    return Math.round((subNota + Number.EPSILON) * 100) / 100;
  }

  CalcularNotaFinal(): number {
    let finalNota = 0;
    let subNota: number;
    if (this.data.juego.metodoSubcriterios) {
      for (let i = 0; i < this.data.juego.Pesos.length; i++) {
        subNota = 0;
        for (let j = 1; j < this.data.juego.Pesos[i].length; j++) {
          if (this.respuestaEvaluacion[i][j - 1]) {
            subNota += this.data.juego.Pesos[i][j] / 10;
          }
        }
        finalNota += subNota * this.data.juego.Pesos[i][0] / 100;
      }
    } else {
      for (let i = 0; i < this.data.juego.Penalizacion.length - 1; i++) {
        subNota = 10;
        const fallos = this.respuestaEvaluacion[i].filter(item => item === false).length;
        if (fallos > 0) {
          const minimo = this.data.juego.Penalizacion[i].filter(item => item.num <= fallos);
          const maximo = Math.max.apply(Math, minimo.map(item => item.num));
          const penalizacion = this.data.juego.Penalizacion[i].find(item => item.num === maximo).p;
          subNota = penalizacion / 10;
        }
        finalNota += subNota * this.data.juego.Penalizacion[this.data.juego.Penalizacion.length - 1][i] / 100;
      }
    }
    return Math.round((finalNota + Number.EPSILON) * 100) / 100;
  }

  close(): void {
    this.dialogRef.close();
  }
}

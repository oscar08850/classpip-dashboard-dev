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

  close(): void {
    this.dialogRef.close();
  }
}

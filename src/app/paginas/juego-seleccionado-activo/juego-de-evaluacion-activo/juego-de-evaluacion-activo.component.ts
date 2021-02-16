import {Component, OnInit} from '@angular/core';
import {PeticionesAPIService, SesionService} from '../../../servicios';
import {JuegoDeEvaluacion} from '../../../clases/JuegoDeEvaluacion';
import {Alumno, Equipo, Rubrica} from '../../../clases';
import {AlumnoJuegoDeEvaluacion} from '../../../clases/AlumnoJuegoDeEvaluacion';
import {EquipoJuegoDeEvaluacion} from '../../../clases/EquipoJuegoDeEvaluacion';
import {MatDialog} from '@angular/material/dialog';
import {EvaluacionDialogoComponent} from './evaluacion-dialogo/evaluacion-dialogo.component';
import {EvaluacionBorrarDialogoComponent} from './evaluacion-borrar-dialogo/evaluacion-borrar-dialogo.component';

@Component({
  selector: 'app-juego-de-evaluacion-activo',
  templateUrl: './juego-de-evaluacion-activo.component.html',
  styleUrls: ['./juego-de-evaluacion-activo.component.scss']
})
export class JuegoDeEvaluacionActivoComponent implements OnInit {

  juego: JuegoDeEvaluacion;
  rubrica: Rubrica;
  alumnos: Alumno[];
  alumnosRelacion: AlumnoJuegoDeEvaluacion[];
  equipos: Equipo[];
  equiposRelacion: EquipoJuegoDeEvaluacion[];
  alumnosDeEquipo = [];
  // Tabla
  displayedColumns: string[];
  tmpDisplayedColumns = [];
  datosTabla = [];
  hoverColumn = [];

  constructor(
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.juego = this.sesion.DameJuego() as unknown as JuegoDeEvaluacion;
    console.log(this.juego);
    this.peticionesAPI.DameRubrica(this.juego.rubricaId).subscribe((res: Rubrica) => {
      this.rubrica = res;
      console.log(this.rubrica);
    });
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
    } else if (this.juego.Modo === 'Equipos') {
      this.peticionesAPI.DameRelacionEquiposJuegoDeEvaluacion(this.juego.id)
        .subscribe((res: EquipoJuegoDeEvaluacion[]) => {
          this.equiposRelacion = res;
          this.equiposRelacion.forEach((equipoRelacion: EquipoJuegoDeEvaluacion) => {
            this.peticionesAPI.DameAlumnosEquipo(equipoRelacion.equipoId)
              .subscribe((res2: Alumno[]) => {
                const obj = {equipoId: equipoRelacion.equipoId, alumnos: res2};
                this.alumnosDeEquipo.push(obj);
                this.ConstruirTablaEquipos();
              });
          });
        });
      this.peticionesAPI.DameEquiposJuegoDeEvaluacion(this.juego.id)
        .subscribe((res: Equipo[]) => {
          this.equipos = res;
          this.ConstruirTablaEquipos();
        });
    }
  }

  CalcularNotaMedia(row): number | string {
    let media = 0;
    let p = 0;
    for (const nombre in row) {
      if (typeof row[nombre] === 'number' && nombre !== 'id') {
        media += row[nombre];
        p++;
      }
    }
    if (p > 0) {
      return Math.round(((media / p) + Number.EPSILON) * 100) / 100;
    } else {
      return '-';
    }
  }

  CalcularNota(respuesta: any[]): number {
    if (this.juego.metodoSubcriterios) {
      console.log('Calcular nota por pesos', respuesta);
      let finalNota = 0;
      for (let i = 0; i < this.juego.Pesos.length; i++) {
        let subNota = 0;
        for (let j = 1; j < this.juego.Pesos[i].length; j++) {
          if (respuesta[i][j - 1]) {
            subNota += this.juego.Pesos[i][j] / 10;
          }
          console.log(this.juego.Pesos[i][j], respuesta[i][j - 1], subNota);
        }
        finalNota += subNota * this.juego.Pesos[i][0] / 100;
        console.log(this.juego.Pesos[i][0], subNota, finalNota);
      }
      return Math.round((finalNota + Number.EPSILON) * 100) / 100;
    } else { // Penalizacion
      console.log('Calcular nota por penalizacion', respuesta);
      let finalNota = 0;
      for (let i = 0; i < this.juego.Penalizacion.length - 1; i++) {
        let subNota = 10;
        const fallos = respuesta[i].filter(item => item === false).length;
        console.log('fallos', fallos);
        if (fallos > 0) {
          let minimo: number;
          let rangoMinimo;
          let maximo: number;
          minimo = Math.min.apply(Math, this.juego.Penalizacion[i].map(item => item.num));
          console.log('minimo', minimo);
          if (fallos >= minimo) {
            rangoMinimo = this.juego.Penalizacion[i].filter(item => item.num <= fallos);
            if (rangoMinimo.length === 0) {
              maximo = Math.max.apply(Math, this.juego.Penalizacion[i].map(item => item.num));
            } else {
              maximo = Math.max.apply(Math, rangoMinimo.map(item => item.num));
            }
            console.log('rango minimo', rangoMinimo);
            console.log('maximo', maximo);
            const penalizacion = this.juego.Penalizacion[i].find(item => item.num === maximo).p;
            console.log('penalizacion', penalizacion);
            subNota = penalizacion / 10;
          }
        }
        console.log(i, this.juego.Penalizacion[this.juego.Penalizacion.length - 1][i]);
        finalNota += subNota * this.juego.Penalizacion[this.juego.Penalizacion.length - 1][i] / 100;
        console.log('finalnota', finalNota);
      }
      return Math.round((finalNota + Number.EPSILON) * 100) / 100;
    }
  }

  ConstruirTablaIndividual() {
    if (!this.alumnos || !this.alumnosRelacion) {
      return;
    }
    this.tmpDisplayedColumns = this.alumnos.map(item => [item.id, item.Nombre]);
    this.alumnos.forEach((alumno) => {
      const row = {
        Nombre: undefined,
        id: undefined
      };
      const evaluado = this.alumnosRelacion.find(item => item.alumnoId === alumno.id);
      row.Nombre = this.alumnos.find(item => item.id === evaluado.alumnoId).Nombre;
      row.id = alumno.id;
      this.tmpDisplayedColumns.forEach((item: (number|string)[]) => {
        // const respuesta = evaluado.respuestas.find(res => res.alumnoId === item[0]);
        if (evaluado.respuestas && evaluado.respuestas.find(res => res.alumnoId === item[0])) {
          row[item[1]] = this.CalcularNota(evaluado.respuestas.find(res => res.alumnoId === item[0]).respuesta);
        } else {
          row[item[1]] = '-';
        }
      });
      row['Nota Media'] = this.CalcularNotaMedia(row);
      this.datosTabla.push(row);
    });
    this.displayedColumns = this.tmpDisplayedColumns.map(item => item[1]) as string[];
    this.displayedColumns.unshift('Nombre');
    this.displayedColumns.push('Nota Media');
    this.hoverColumn = new Array(this.displayedColumns.length).fill(false);
  }

  ConstruirTablaEquipos() {
    if (!this.equipos || !this.equiposRelacion) {
      return;
    }
    if (this.alumnosDeEquipo.length !== this.equipos.length) {
      return;
    }
    if (this.equiposRelacion[0].alumnosEvaluadoresIds !== null) {
      console.log('Equipos evaluados por alumnos');
      console.log('Equipos Relacion', this.equiposRelacion);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.alumnosDeEquipo.length; i++) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.alumnosDeEquipo[i].alumnos.length; j++) {
          this.tmpDisplayedColumns.push([this.alumnosDeEquipo[i].alumnos[j].id, this.alumnosDeEquipo[i].alumnos[j].Nombre]);
        }
      }
      console.log('Columnas tmp', this.tmpDisplayedColumns);
      this.equipos.forEach((equipo) => {
        const row = {
          Nombre: undefined
        };
        const evaluado = this.equiposRelacion.find(item => item.equipoId === equipo.id);
        row.Nombre = this.equipos.find(item => item.id === evaluado.equipoId).Nombre;
        this.tmpDisplayedColumns.forEach((item: (number|string)[]) => {
          if (evaluado.respuestas && evaluado.respuestas.find(res => res.alumnoId === item[0])) {
            row[item[1]] = this.CalcularNota(evaluado.respuestas.find(res => res.alumnoId === item[0]).respuesta);
          } else {
            row[item[1]] = '-';
          }
        });
        row['Nota Media'] = this.CalcularNotaMedia(row);
        this.datosTabla.push(row);
      });
    } else {
      this.tmpDisplayedColumns = this.equipos.map(item => [item.id, item.Nombre]);
      console.log('Equipos por equipos');
      console.log('Columnas tmp', this.tmpDisplayedColumns);
      this.equipos.forEach((equipo) => {
        const row = {
          Nombre: undefined
        };
        const evaluado = this.equiposRelacion.find(item => item.equipoId === equipo.id);
        console.log('evaluado', evaluado);
        row.Nombre = this.equipos.find(item => item.id === evaluado.equipoId).Nombre;
        const alumnosDeEquipo = this.alumnosDeEquipo.find(item => item.equipoId === equipo.id).alumnos.map(item => item.id);
        console.log('alumnos de equipo', alumnosDeEquipo);
        this.tmpDisplayedColumns.forEach((item: (number|string)[]) => {
          if (evaluado.respuestas && evaluado.respuestas.find(res => alumnosDeEquipo.includes(res.alumnoId))) {
            row[item[1]] = this.CalcularNota(evaluado.respuestas.find(res => alumnosDeEquipo.includes(res.alumnoId)).respuesta);
          } else {
            row[item[1]] = '-';
          }
        });
        row['Nota Media'] = this.CalcularNotaMedia(row);
        this.datosTabla.push(row);
      });
    }
    this.displayedColumns = this.tmpDisplayedColumns.map(item => item[1]) as string[];
    this.displayedColumns.unshift('Nombre');
    this.displayedColumns.push('Nota Media');
    this.hoverColumn = new Array(this.displayedColumns.length).fill(false);
  }

  openDialog(i: number, c: number): void {
    this.dialog.open(EvaluacionDialogoComponent, {
      width: '800px',
      data: {
        juego: this.juego,
        rubrica: this.rubrica,
        alumnos: this.alumnos,
        alumnosRelacion: this.alumnosRelacion,
        equipos: this.equipos,
        equiposRelacion: this.equiposRelacion,
        alumnosDeEquipo: this.alumnosDeEquipo,
        evaluadorId: this.tmpDisplayedColumns[i - 1][0],
        evaluadoId: c
      }
    });
  }

  MouseOver(i: number): void {
    // const columnNum = event.target.className.match('\-([0-9]+)')[1];
    this.hoverColumn[i] = true;
  }

  MouseOut(i: number): void {
    // const columnNum = event.target.className.match('\-([0-9]+)')[1];
    this.hoverColumn[i] = false;
  }

  isNumber(val): boolean { return typeof val === 'number'; }

  eliminarNota(i: number, evaluadoId: number): void {
    const evaluadorId = this.tmpDisplayedColumns[i - 1][0];
    console.log(evaluadorId, evaluadoId);
    const dialogRef = this.dialog.open(EvaluacionBorrarDialogoComponent, {
      width: '300px',
      data: {
        juego: this.juego,
        evaluadorId,
        evaluadoId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (typeof result === 'undefined') {
        return;
      }
      this.tmpDisplayedColumns = [];
      this.datosTabla = [];
      this.hoverColumn = [];
      if (this.juego.Modo === 'Individual') {
        this.alumnosRelacion = result;
        this.ConstruirTablaIndividual();
      } else if (this.juego.Modo === 'Equipos') {
        this.equiposRelacion = result;
        this.ConstruirTablaEquipos();
      }
    });
  }

}

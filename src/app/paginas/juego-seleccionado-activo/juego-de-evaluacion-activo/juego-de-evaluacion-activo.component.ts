import {Component, OnInit} from '@angular/core';
import {PeticionesAPIService, SesionService, CalculosService} from '../../../servicios';
import {JuegoDeEvaluacion} from '../../../clases/JuegoDeEvaluacion';
import {Alumno, Equipo, Rubrica} from '../../../clases';
import {AlumnoJuegoDeEvaluacion} from '../../../clases/AlumnoJuegoDeEvaluacion';
import {EquipoJuegoDeEvaluacion} from '../../../clases/EquipoJuegoDeEvaluacion';
import {MatDialog} from '@angular/material/dialog';
import {EvaluacionDialogoComponent} from './evaluacion-dialogo/evaluacion-dialogo.component';
import {EvaluacionBorrarDialogoComponent} from './evaluacion-borrar-dialogo/evaluacion-borrar-dialogo.component';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';


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
  displayedColumns: string[] = [];
  tmpDisplayedColumns = [];
  datosTabla = [];
  hoverColumn = [];



  constructor(
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
    private dialog: MatDialog,
    private location: Location
  ) { }
  
  

  ngOnInit() {
    this.juego = this.sesion.DameJuego() as unknown as JuegoDeEvaluacion;
    console.log(this.juego);
    if (this.juego.rubricaId > 0) {
      this.peticionesAPI.DameRubrica(this.juego.rubricaId).subscribe((res: Rubrica) => {
        this.rubrica = res;
        console.log(this.rubrica);
      });
    }
    if (this.juego.Modo === 'Individual') {
      this.peticionesAPI.DameRelacionAlumnosJuegoDeEvaluacion(this.juego.id)
        .subscribe((res: AlumnoJuegoDeEvaluacion[]) => {
          this.alumnosRelacion = res;
          console.log ('vamos a construir la tabla');
          this.ConstruirTablaIndividual();
        });
      this.peticionesAPI.DameAlumnosJuegoDeEvaluacion(this.juego.id)
        .subscribe((res: Alumno[]) => {
          this.alumnos = res;
          this.ConstruirTablaIndividual();
        });
    } else if (this.juego.Modo === 'Equipos') {
      // NECESITO LA LISTA DE ALUMNOS DEL GRUPO EN CASO DE EVALUACION DE EQUIPOS POR ALUMNOS, SIN RUBRICA
      // DE ESTA LISTA SACARÉ LOS NOMBRES DE LOS ALUMNOS PARA MOSTRARLOS
      this.peticionesAPI.DameAlumnosGrupo(this.juego.grupoId)
      .subscribe((res: Alumno[]) => {
        this.alumnos = res;
      });
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
    console.log('calcular media', row);
    if (this.juego.notaProfesorNormal) {
      for (const nombre in row) {
        if (typeof row[nombre] === 'number' && nombre !== 'id') {
          console.log('media, p, nombre', media, p, nombre, row[nombre]);
          media += row[nombre];
          p++;
        }
      }
    } else {
      for (const nombre in row) {
        if (typeof row[nombre] === 'number' && nombre !== 'id' && nombre !== 'Profesor') {
          console.log('D/media, p, nombre', media, p, nombre, row[nombre]);
          media += row[nombre];
          p++;
        }
      }
    }
    if (p > 0 || typeof row['Profesor'] === 'number') {
      if (this.juego.notaProfesorNormal || (this.juego.profesorEvalua && typeof row['Profesor'] !== 'number')) {
        return Math.round(((media / p) + Number.EPSILON) * 100) / 100;
      } else if (p === 0) {
        return Math.round(((row['Profesor']) + Number.EPSILON) * 100) / 100;
      } else {
        return Math.round(((((media / p) + row['Profesor']) / 2) + Number.EPSILON) * 100) / 100;
      }
    } else {
      return '-';
    }
  }

  CalcularNota(respuesta: any[]): number {
    if (this.juego.metodoSubcriterios) {
      // console.log('Calcular nota por pesos', respuesta);
      let finalNota = 0;
      for (let i = 0; i < this.juego.Pesos.length; i++) {
        let subNota = 0;
        for (let j = 1; j < this.juego.Pesos[i].length; j++) {
          if (respuesta[i][j - 1]) {
            subNota += this.juego.Pesos[i][j] / 10;
          }
          // console.log(this.juego.Pesos[i][j], respuesta[i][j - 1], subNota);
        }
        finalNota += subNota * this.juego.Pesos[i][0] / 100;
        // console.log(this.juego.Pesos[i][0], subNota, finalNota);
      }
      return Math.round((finalNota + Number.EPSILON) * 100) / 100;
    } else { // Penalizacion
      // console.log('Calcular nota por penalizacion', respuesta);
      let finalNota = 0;
      for (let i = 0; i < this.juego.Penalizacion.length - 1; i++) {
        let subNota = 10;
        const fallos = respuesta[i].filter(item => item === false).length;
        // console.log('fallos', fallos);
        if (fallos > 0) {
          let minimo: number;
          let rangoMinimo;
          let maximo: number;
          minimo = Math.min.apply(Math, this.juego.Penalizacion[i].map(item => item.num));
          // console.log('minimo', minimo);
          if (fallos >= minimo) {
            rangoMinimo = this.juego.Penalizacion[i].filter(item => item.num <= fallos);
            if (rangoMinimo.length === 0) {
              maximo = Math.max.apply(Math, this.juego.Penalizacion[i].map(item => item.num));
            } else {
              maximo = Math.max.apply(Math, rangoMinimo.map(item => item.num));
            }
            // console.log('rango minimo', rangoMinimo);
            // console.log('maximo', maximo);
            const penalizacion = this.juego.Penalizacion[i].find(item => item.num === maximo).p;
            // console.log('penalizacion', penalizacion);
            subNota = penalizacion / 10;
          }
        }
        // console.log(i, this.juego.Penalizacion[this.juego.Penalizacion.length - 1][i]);
        finalNota += subNota * this.juego.Penalizacion[this.juego.Penalizacion.length - 1][i] / 100;
        // console.log('finalnota', finalNota);
      }
      return Math.round((finalNota + Number.EPSILON) * 100) / 100;
    }
  }

  ConstruirTablaIndividual() {
    if (!this.alumnos || !this.alumnosRelacion) {
      return;
    }

    if (this.juego.rubricaId > 0) {
     // this.tmpDisplayedColumns = this.alumnos.map(item => [item.id, item.Nombre]);
      this.tmpDisplayedColumns = this.alumnos.map(item => [item.id, item.Username]);
      console.log ('1111111111111111');
      console.log (this.tmpDisplayedColumns);
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
          } else if (!this.juego.autoEvaluacion && alumno.id === item[0]) {
            row[item[1]] = 'X';
          } else if (alumno.id !== item[0] && !evaluado.alumnosEvaluadoresIds.includes(item[0] as number)) {
            row[item[1]] = 'X';
          } else {
            row[item[1]] = '-';
          }
        });
        if (this.juego.profesorEvalua) {
          if (evaluado.respuestas && evaluado.respuestas.find(item => item.profesorId)) {
            row['Profesor'] = this.CalcularNota(evaluado.respuestas.find(item => item.profesorId).respuesta);
          } else {
            row['Profesor'] = '-';
          }
        }
        row['Nota Media'] = this.CalcularNotaMedia(row);
        this.datosTabla.push(row);
      });
      this.displayedColumns = this.tmpDisplayedColumns.map(item => item[1]) as string[];
      this.displayedColumns.unshift('Nombre');
      if (this.juego.profesorEvalua) {
        this.displayedColumns.push('Profesor');
      }
      this.displayedColumns.push('Nota Media');
      this.hoverColumn = new Array(this.displayedColumns.length).fill(false);
    } else {
    //  this.tmpDisplayedColumns = this.alumnos.map(item => [item.id, item.Nombre]);
      this.tmpDisplayedColumns = this.alumnos.map(item => [item.id, item.Username]);
      console.log ('1111111111111111');
      console.log (this.tmpDisplayedColumns);
      console.log (this.alumnos);
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
            row[item[1]] = -1; // doy un valor numerico para provocar que se muestren los iconos de ver y borrar
          } else if (!this.juego.autoEvaluacion && alumno.id === item[0]) {
            row[item[1]] = 'X';
          } else if (alumno.id !== item[0] && !evaluado.alumnosEvaluadoresIds.includes(item[0] as number)) {
            row[item[1]] = 'X';
          } else {
            row[item[1]] = '-';
          }
        });
        if (this.juego.profesorEvalua) {
          if (evaluado.respuestas && evaluado.respuestas.find(item => item.profesorId)) {
            row['Profesor'] = -1; //doy un valor numeroco para provocar que se muestren los iconos de ver y borrar
          } else {
            row['Profesor'] = '-';
          }
        }
        if (evaluado.respuestas && evaluado.respuestas.length > 0) {
          row['Resumen'] = -1; // doy un valor numeroco para provocar que se muestren los iconos de ver y borrar
        }
        this.datosTabla.push(row);
      });
      this.displayedColumns = this.tmpDisplayedColumns.map(item => item[1]) as string[];
      this.displayedColumns.unshift('Nombre');
      if (this.juego.profesorEvalua) {
        this.displayedColumns.push('Profesor');
      }
      this.displayedColumns.push('Resumen');
      this.hoverColumn = new Array(this.displayedColumns.length).fill(false);
    }
    console.log ('ya tengo las columnas');
    console.log (this.displayedColumns);
  }


  ConstruirTablaEquipos() {
    if (!this.equipos || !this.equiposRelacion) {
      return;
    }
    if (this.alumnosDeEquipo.length !== this.equipos.length) {
      return;
    }
    if (this.juego.rubricaId > 0) {
      if (this.equiposRelacion[0].alumnosEvaluadoresIds !== null) {
        console.log('Equipos evaluados por alumnos');
        console.log('Equipos Relacion', this.equiposRelacion);
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.alumnosDeEquipo.length; i++) {
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < this.alumnosDeEquipo[i].alumnos.length; j++) {
            //this.tmpDisplayedColumns.push([this.alumnosDeEquipo[i].alumnos[j].id, this.alumnosDeEquipo[i].alumnos[j].Nombre]);
            this.tmpDisplayedColumns.push([this.alumnosDeEquipo[i].alumnos[j].id, this.alumnosDeEquipo[i].alumnos[j].Username]);
          }
        }
        console.log('Columnas tmp', this.tmpDisplayedColumns);
        this.equipos.forEach((equipo) => {
          const row = {
            Nombre: undefined,
            id: undefined
          };
          const evaluado = this.equiposRelacion.find(item => item.equipoId === equipo.id);
          row.Nombre = this.equipos.find(item => item.id === evaluado.equipoId).Nombre;
          row.id = equipo.id;
          this.tmpDisplayedColumns.forEach((item: (number|string)[]) => {
            const alumnosDeEquipo = this.alumnosDeEquipo.find(a => a.equipoId === equipo.id).alumnos.map(b => b.id);
            if (evaluado.respuestas && evaluado.respuestas.find(res => res.alumnoId === item[0])) {
              row[item[1]] = this.CalcularNota(evaluado.respuestas.find(res => res.alumnoId === item[0]).respuesta);
            } else if (!this.juego.autoEvaluacion && alumnosDeEquipo.includes(item[0])) {
              row[item[1]] = 'X';
            } else if (!alumnosDeEquipo.includes(item[0]) && !evaluado.alumnosEvaluadoresIds.includes(item[0] as number)) {
              row[item[1]] = 'X';
            } else {
              row[item[1]] = '-';
            }
          });
          if (this.juego.profesorEvalua) {
            if (evaluado.respuestas && evaluado.respuestas.find(item => item.profesorId)) {
              row['Profesor'] = this.CalcularNota(evaluado.respuestas.find(item => item.profesorId).respuesta);
            } else {
              row['Profesor'] = '-';
            }
          }
          row['Nota Media'] = this.CalcularNotaMedia(row);
          this.datosTabla.push(row);
        });
      } else {
        this.tmpDisplayedColumns = this.equipos.map(item => [item.id, item.Nombre]);
        console.log('Equipos por equipos');
        console.log('Columnas', this.tmpDisplayedColumns);
        this.equipos.forEach((equipo) => {
          const row = {
            Nombre: undefined,
            id: undefined
          };
          const evaluado = this.equiposRelacion.find(item => item.equipoId === equipo.id);
          row.Nombre = this.equipos.find(item => item.id === evaluado.equipoId).Nombre;
          row.id = equipo.id;
          this.tmpDisplayedColumns.forEach((item: (number|string)[]) => {
            const alumnosDeEquipo = this.alumnosDeEquipo.find(a => a.equipoId === item[0]).alumnos.map(b => b.id);
            if (evaluado.respuestas && evaluado.respuestas.find(res => alumnosDeEquipo.includes(res.alumnoId))) {
              row[item[1]] = this.CalcularNota(evaluado.respuestas.find(res => alumnosDeEquipo.includes(res.alumnoId)).respuesta);
            } else if (!this.juego.autoEvaluacion && equipo.id === item[0]) {
              row[item[1]] = 'X';
            } else if (equipo.id !== item[0] && !evaluado.equiposEvaluadoresIds.includes(item[0] as number)) {
              row[item[1]] = 'X';
            } else {
              row[item[1]] = '-';
            }
          });
          if (evaluado.respuestas && this.juego.profesorEvalua) {
            if (evaluado.respuestas.find(item => item.profesorId)) {
              row['Profesor'] = this.CalcularNota(evaluado.respuestas.find(item => item.profesorId).respuesta);
            } else {
              row['Profesor'] = '-';
            }
          }
          row['Nota Media'] = this.CalcularNotaMedia(row);
          this.datosTabla.push(row);
        });
      }
      this.displayedColumns = this.tmpDisplayedColumns.map(item => item[1]) as string[];
      this.displayedColumns.unshift('Nombre');
      if (this.juego.profesorEvalua) {
        this.displayedColumns.push('Profesor');
      }
      this.displayedColumns.push('Nota Media');
      this.hoverColumn = new Array(this.displayedColumns.length).fill(false);
    } else {
      if (this.equiposRelacion[0].alumnosEvaluadoresIds !== null) {
        console.log('Equipos evaluados por alumnos sin rubrica');
        console.log('Equipos Relacion', this.equiposRelacion);
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.alumnosDeEquipo.length; i++) {
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < this.alumnosDeEquipo[i].alumnos.length; j++) {
            this.tmpDisplayedColumns.push([this.alumnosDeEquipo[i].alumnos[j].id, this.alumnosDeEquipo[i].alumnos[j].Username]);
            //this.tmpDisplayedColumns.push([this.alumnosDeEquipo[i].alumnos[j].id, this.alumnosDeEquipo[i].alumnos[j].Nombre]);
          }
        }
        console.log('Columnas tmp', this.tmpDisplayedColumns);
        this.equipos.forEach((equipo) => {
          const row = {
            Nombre: undefined,
            id: undefined
          };
          const evaluado = this.equiposRelacion.find(item => item.equipoId === equipo.id);
          row.Nombre = this.equipos.find(item => item.id === evaluado.equipoId).Nombre;
          row.id = equipo.id;
          this.tmpDisplayedColumns.forEach((item: (number|string)[]) => {
            const alumnosDeEquipo = this.alumnosDeEquipo.find(a => a.equipoId === equipo.id).alumnos.map(b => b.id);
            if (evaluado.respuestas && evaluado.respuestas.find(res => res.alumnoId === item[0])) {
              row[item[1]] = -1;
            } else if (!this.juego.autoEvaluacion && alumnosDeEquipo.includes(item[0])) {
              row[item[1]] = 'X';
            } else if (!alumnosDeEquipo.includes(item[0]) && !evaluado.alumnosEvaluadoresIds.includes(item[0] as number)) {
              row[item[1]] = 'X';
            } else {
              row[item[1]] = '-';
            }
          });
          if (this.juego.profesorEvalua) {
            if (evaluado.respuestas && evaluado.respuestas.find(item => item.profesorId)) {
              row['Profesor'] = -1;
            } else {
              row['Profesor'] = '-';
            }
          }
          if (evaluado.respuestas && evaluado.respuestas.length > 0) {
            row['Resumen'] = -1;
          }
          this.datosTabla.push(row);
        });
      } else {
        this.tmpDisplayedColumns = this.equipos.map(item => [item.id, item.Nombre]);
        console.log('Equipos por equipos');
        console.log('Columnas', this.tmpDisplayedColumns);
        this.equipos.forEach((equipo) => {
          const row = {
            Nombre: undefined,
            id: undefined
          };
          const evaluado = this.equiposRelacion.find(item => item.equipoId === equipo.id);
          row.Nombre = this.equipos.find(item => item.id === evaluado.equipoId).Nombre;
          row.id = equipo.id;
          this.tmpDisplayedColumns.forEach((item: (number|string)[]) => {
            const alumnosDeEquipo = this.alumnosDeEquipo.find(a => a.equipoId === item[0]).alumnos.map(b => b.id);
            if (evaluado.respuestas && evaluado.respuestas.find(res => alumnosDeEquipo.includes(res.alumnoId))) {
              row[item[1]] = -1;
            } else if (!this.juego.autoEvaluacion && equipo.id === item[0]) {
              row[item[1]] = 'X';
            } else if (equipo.id !== item[0] && !evaluado.equiposEvaluadoresIds.includes(item[0] as number)) {
              row[item[1]] = 'X';
            } else {
              row[item[1]] = '-';
            }
          });
          if (evaluado.respuestas && this.juego.profesorEvalua) {
            if (evaluado.respuestas.find(item => item.profesorId)) {
              row['Profesor'] = -1;
            } else {
              row['Profesor'] = '-';
            }
          }
          if (evaluado.respuestas && evaluado.respuestas.length > 0) {
            row['Resumen'] = -1;
          }
          this.datosTabla.push(row);
        });
      }
      this.displayedColumns = this.tmpDisplayedColumns.map(item => item[1]) as string[];
      this.displayedColumns.unshift('Nombre');
      if (this.juego.profesorEvalua) {
        this.displayedColumns.push('Profesor');
      }
      this.displayedColumns.push('Resumen');
      this.hoverColumn = new Array(this.displayedColumns.length).fill(false);

    }
  } 

  openDialog1(i: number, c: any, profesor: boolean = false, editar: boolean = false, global: boolean = false): void {

    if (profesor) {
      const dialogRef = this.dialog.open(EvaluacionDialogoComponent, {
        width: '800px',
        data: {
          juego: this.juego,
          rubrica: this.rubrica,
          alumnos: this.alumnos,
          alumnosRelacion: this.alumnosRelacion,
          equipos: this.equipos,
          equiposRelacion: this.equiposRelacion,
          alumnosDeEquipo: this.alumnosDeEquipo,
          evaluadorId: this.sesion.DameProfesor().id,
          evaluadoId: c,
          profesor: true,
          editable: editar,
          global: false,
          notaMedia: null
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
    } else {
      console.log ('OOOOOOOOOOOO ');
      console.log (c);
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
          evaluadorId: global ? 0 : this.tmpDisplayedColumns[i - 1][0],
          evaluadoId: c.id,
          profesor: false,
          editable: false,
          global,
          notaMedia: c['Nota Media']
        }
      });
    }
  }
  openDialog(i: number, c: any, profesor: boolean = false, editar: boolean = false, global: boolean = false): void {
    if (profesor) {
      const dialogRef = this.dialog.open(EvaluacionDialogoComponent, {
        width: '800px',
        data: {
          juego: this.juego,
          rubrica: this.rubrica,
          alumnos: this.alumnos,
          alumnosRelacion: this.alumnosRelacion,
          equipos: this.equipos,
          equiposRelacion: this.equiposRelacion,
          alumnosDeEquipo: this.alumnosDeEquipo,
          evaluadorId: this.sesion.DameProfesor().id,
          evaluadoId: c,
          profesor: true,
          editable: editar,
          global: false,
          notaMedia: null
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
    } else if (!global) {
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
          evaluadoId: c,
          profesor: false,
          editable: false,
          global: false,
          notaMedia: null
        }
      });
    } else {
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
          evaluadorId: global ? 0 : this.tmpDisplayedColumns[i - 1][0],
          evaluadoId: c.id,
          profesor: false,
          editable: false,
          global,
          notaMedia: c['Nota Media']
        }
      });
    }
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

  eliminarNota(i: number, evaluadoId: number, profesor: boolean = false): void {
    let evaluadorId;
    if (!profesor) {
      evaluadorId = this.tmpDisplayedColumns[i - 1][0];
    } else {
      evaluadorId = this.sesion.DameProfesor().id;
    }
    const dialogRef = this.dialog.open(EvaluacionBorrarDialogoComponent, {
      width: '300px',
      data: {
        juego: this.juego,
        evaluadorId,
        evaluadoId,
        alumnosDeEquipo: this.alumnosDeEquipo,
        profesor
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


  Eliminar(): void {

    Swal.fire({
      title: 'Confirma que quieres eliminar el juego <b>' + this.juego.NombreJuego + '</b>',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
    }).then((result) => {
      if (result.value) {
        this.calculos.EliminarJuegoDeEvaluacion(this.juego)
        .subscribe(() => {
          this.location.back();
          Swal.fire('Juego eliminado correctamente', ' ', 'success');
        });
      }
    });
  }

}


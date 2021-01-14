import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SesionService, PeticionesAPIService, CalculosService } from 'src/app/servicios';
// tslint:disable-next-line:max-line-length
import { Juego, Alumno , Cuestionario, Pregunta, AlumnoJuegoDeCuestionario, PreguntaDelCuestionario, TablaAlumnoJuegoDeCuestionario } from 'src/app/clases';


@Component({
  selector: 'app-respuestas-alumno-juego-de-cuestionario',
  templateUrl: './respuestas-alumno-juego-de-cuestionario.component.html',
  styleUrls: ['./respuestas-alumno-juego-de-cuestionario.component.scss']
})
export class RespuestasAlumnoJuegoDeCuestionarioComponent implements OnInit {
alumno: TablaAlumnoJuegoDeCuestionario;
inscripcionAlumnoJuegoDeCuestionario: AlumnoJuegoDeCuestionario;
info: any;
juegoSeleccionado: any;
cuestionario: Cuestionario;
preguntas: Pregunta[];

// guardo aqui los títulos de las preguntas
titulos: string[];

barras: any[];



  constructor( public peticionesApi: PeticionesAPIService,
               public sesion: SesionService,
               public dialogRef: MatDialogRef<RespuestasAlumnoJuegoDeCuestionarioComponent>) { }

  ngOnInit() {
    this.alumno = this.sesion.DameAlumnoJuegoDeCuestionario();
    this.inscripcionAlumnoJuegoDeCuestionario = this.sesion.DameInscripcionAlumnoJuegoDeCuestionario();
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.PrepararInfoAlumno();
  }

  PrepararInfoAlumno() {
    // Me traigo el cuestionario y las preguntas
    this.peticionesApi.DameCuestionario (this.juegoSeleccionado.cuestionarioId)
    .subscribe (cuestionario => {
            this.cuestionario = cuestionario;
            this.peticionesApi.DamePreguntasCuestionario (this.cuestionario.id)
            .subscribe ( preguntas => {
              this.preguntas = preguntas;
              this.preguntas.sort((a , b) => (a.id > b.id ? 1 : -1));
              // guardo los titulos de las preguntas para mostrarlos en el grafico
              this.titulos = [];
              this.preguntas.forEach (pregunta => this.titulos.push (pregunta.Titulo));

              // Traigo las respuestas del alumno a las preguntas
              this.peticionesApi.DameRespuestasAlumnoJuegoDeCuestionario (this.inscripcionAlumnoJuegoDeCuestionario.id)
              .subscribe (respuestas => {
                // preparo la información para cada una de las barras horizontales
                this.barras = [];
                respuestas.sort((a , b) => (a.preguntaId > b.preguntaId) ? 1 : -1);
                respuestas.forEach (respuesta => {
                  // tslint:disable-next-line:max-line-length
                  const respuestaCorrecta = this.preguntas.filter (pregunta => pregunta.id === respuesta.preguntaId)[0].RespuestaCorrecta;
                  if (respuestaCorrecta === respuesta.Respuesta) {
                    // la respuesta es correcta: barra verde
                    this.barras.push (
                      {value: 1, respuesta: respuesta.Respuesta, itemStyle: {color: 'green'}}
                    );
                  } else {
                    // la respuesta es incorrecta: barra roja
                    this.barras.push (
                      {value: -1, respuesta: respuesta.Respuesta, label: {position: 'right'}, itemStyle: {color: 'red'}}
                    );
                  }
                });

                // preparo el objeto json que se necesita para crear el gráfico
                this.PreparaBarras();

              });
            });
    });
  }


  PreparaBarras() {

    this.info = {
     // aqui se indica lo que se mostrará cuando el ratón esté sobre la barra
      tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'shadow'
          },
          formatter(data) {
            // mostraré la respuesta que dió el alumno, que está en el campo respuesta del
            // objeto que creé para la barra
            // data es un vector, pero en esta caso solo hay una barra para cada elemento de la serie. Por eso
            // solo me interesa data[0]
            return 'respuesta: ' + data[0].data.respuesta;
          }
      },
      grid: {
          top: 80,
          bottom: 30,
          letf: 50,
          right: 50
      },
      xAxis: {
        type: 'value',
        show: false,
        splitLine: {show: false}
      },
      yAxis: {
          // en el eje y estará los títulos de las preguntas
          type: 'category',
          axisLine: {show: false},
          axisLabel: {show: false},
          axisTick: {show: false},
          splitLine: {show: false},
          data: this.titulos,
      },
      series: [
          {
              name: 'Res ',
              type: 'bar',
              label: {
                // en cada barra muestro el titulo de la pregunta
                show: true,
                formatter: '{b}'
              },
              data: this.barras
          }
      ]
    };


  }



  goBack() {
    this.dialogRef.close();
  }
}

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SesionService, PeticionesAPIService, CalculosService } from 'src/app/servicios';
import { Juego, Alumno , Cuestionario, Pregunta, AlumnoJuegoDeCuestionario,
RespuestaJuegoDeCuestionario} from 'src/app/clases';
@Component({
  selector: 'app-informacion-respuestas-juego-de-cuestionario-dialog',
  templateUrl: './informacion-respuestas-juego-de-cuestionario-dialog.component.html',
  styleUrls: ['./informacion-respuestas-juego-de-cuestionario-dialog.component.scss']
})
export class InformacionRespuestasJuegoDeCuestionarioDialogComponent implements OnInit {
  donut = {
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [
        {
            name: '',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '30',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                {value: 5, name: 'respuesta A'},
                {value: 7, name: 'respuesta B'},
                {value: 2, name: 'respuesta C'},
                {value: 0, name: 'respuesta D'}
            ]
        }
    ]
  };


  datos: any[] = [];
  donuts: any[] = [];
  misDonuts: any[] = [];

  histogramaAciertos: any [];
  grafico: any;
  infA: any;

  juegoSeleccionado: Juego;
  cuestionario: Cuestionario;
  preguntas: Pregunta[];
  inscripcionesAlumnosJuegoDeCuestionario: AlumnoJuegoDeCuestionario[];
  respuestasJuegoDeCuestionario: RespuestaJuegoDeCuestionario[];
  categoriasEjeX;

  constructor(public location: Location,
              public peticionesApi: PeticionesAPIService,
              public sesion: SesionService,
              public dialogRef: MatDialogRef<InformacionRespuestasJuegoDeCuestionarioDialogComponent>) { }

  ngOnInit() {

    this.TraeInfo();

  }

  TraeInfo() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.peticionesApi.DameCuestionario (this.juegoSeleccionado.cuestionarioId)
    .subscribe (cuestionario => {
            this.cuestionario = cuestionario;

            this.peticionesApi.DamePreguntasCuestionario (this.cuestionario.id)
            .subscribe ( preguntas => {
              this.preguntas = preguntas;
              // voy a hacer el histograma de alumnos x número de aciertos
              this.histogramaAciertos = Array(this.preguntas.length + 1).fill(0);
              this.peticionesApi.DameInscripcionesAlumnoJuegoDeCuestionario (this.juegoSeleccionado.id)
              .subscribe (alumnos => {
                    this.inscripcionesAlumnosJuegoDeCuestionario = alumnos;
                    // aqui guardare las respuestas de todos los alumnos
                    this.respuestasJuegoDeCuestionario = [];
                    let cont = 0;
                    this.inscripcionesAlumnosJuegoDeCuestionario.forEach (alumno => {
                      this.peticionesApi.DameRespuestasAlumnoJuegoDeCuestionario (alumno.id)
                      .subscribe (respuestas => {
                        console.log ('respuestas del alumno ' + alumno.id );
                        console.log (respuestas);
                        let aciertos = 0;
                        // voy a contar los aciertos de este alumno
                        respuestas.forEach (respuesta => {
                          // tslint:disable-next-line:max-line-length
                          const respuestaCorrecta = this.preguntas.filter (pregunta => pregunta.id === respuesta.preguntaId)[0].RespuestaCorrecta;
                          if (respuestaCorrecta === respuesta.Respuesta) {
                            aciertos++;
                          }
                        });
                        this.histogramaAciertos[aciertos]++;
                        this.respuestasJuegoDeCuestionario = this.respuestasJuegoDeCuestionario.concat (respuestas);
                        cont++;
                        if (cont === this.inscripcionesAlumnosJuegoDeCuestionario.length) {
                          // preparo el vector con las categorias para el eje X del histograma
                          this.categoriasEjeX = [];
                          for (let n = 0; n < this.histogramaAciertos.length ; n++) {
                            this.categoriasEjeX.push (n.toString());
                          }
                          this.PrepararDonuts();
                        }

                      });
                    });
              });
            });
    });

  }

  PrepararDonuts() {
    // preparo un donut para cada pregunta
    this.preguntas.forEach (pregunta => {
      // selecciono las respuestas para esa pregunta
      const respuestas = this.respuestasJuegoDeCuestionario.filter (respuesta => respuesta.preguntaId === pregunta.id);
      let miDonut: any;
      miDonut = [];
      // preparo los datos del donut
      miDonut.push ( { respuesta: pregunta.RespuestaCorrecta, cont: 0});
      miDonut.push ( { respuesta: pregunta.RespuestaIncorrecta1, cont: 0});
      miDonut.push ( { respuesta: pregunta.RespuestaIncorrecta2, cont: 0});
      miDonut.push ( { respuesta: pregunta.RespuestaIncorrecta3, cont: 0});
      // esto es para el caso de respuesta en blando
      miDonut.push ( { respuesta: '-', cont: 0});
      // ahora cuento las veces que aparece cada una de las respuestas
      respuestas.forEach (respuesta =>
        miDonut.filter (entrada => entrada.respuesta === respuesta.Respuesta)[0].cont++
      );
      this.misDonuts.push (miDonut);

    });

    this.PrepararGraficos();
  }

  PrepararGraficos() {
    // Histograda de número de aciertos

    const histo = this.histogramaAciertos;

    this.grafico = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: 'aciertos: {b}  <br/>{c}'
      },
      grid: {
        left: '20%',
        right: '20%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          name: 'Número de aciertos',
          data: this.categoriasEjeX,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [{
        type: 'value',
        name: 'Número de alumnos'
      }],
      series: [{
        type: 'bar',
        barWidth: '60%',
        data: this.histogramaAciertos,
      }]
    };

    // ahora preparo los donuts
    let i = 1;
    this.misDonuts.forEach (miDonut => {
      const datos = [
        // las respuestas correctas siempre en verde
        {value: miDonut[0].cont, name: miDonut[0].respuesta, itemStyle: {color: 'green'}},
        {value: miDonut[1].cont, name: miDonut[1].respuesta, itemStyle: {color: 'rgb(50,50,50)'}},
        {value: miDonut[2].cont, name: miDonut[2].respuesta, itemStyle: {color: 'rgb(100,100,100)'}},
        {value: miDonut[3].cont, name: miDonut[3].respuesta, itemStyle: {color: 'rgb(125,125,125)'}},
        {value: miDonut[4].cont, name: 'No contesta ' , itemStyle: {color: 'rgb(150,150,150)'}}
      ];
      const  donut = {
        title: {
          text: 'Pregunta ' + i++,
          subtext: 'Respuesta correcta: ' + miDonut[0].respuesta ,
          left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{c} alumnos <br/> ({d}%)'
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: datos
            }
        ]
      };
      this.donuts.push (donut);
    });

  }


  goBack() {
    this.dialogRef.close();
  }
}

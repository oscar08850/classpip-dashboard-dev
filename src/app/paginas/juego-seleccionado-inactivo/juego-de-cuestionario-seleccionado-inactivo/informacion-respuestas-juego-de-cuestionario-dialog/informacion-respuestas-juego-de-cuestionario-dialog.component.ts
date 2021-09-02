import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SesionService, PeticionesAPIService, CalculosService } from 'src/app/servicios';
import { Juego, Alumno , Cuestionario, Pregunta, AlumnoJuegoDeCuestionario,
RespuestaJuegoDeCuestionario,
EquipoJuegoDeCuestionario} from 'src/app/clases';
import { RespuestaEquipoJuegoDeCuestionario } from 'src/app/clases/RespuestaEquipoJuegoDeCuestionario';
@Component({
  selector: 'app-informacion-respuestas-juego-de-cuestionario-dialog',
  templateUrl: './informacion-respuestas-juego-de-cuestionario-dialog.component.html',
  styleUrls: ['./informacion-respuestas-juego-de-cuestionario-dialog.component.scss']
})
export class InformacionRespuestasJuegoDeCuestionarioDialogComponent implements OnInit {

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
  inscripcionesEquiposJuegoDeCuestionario: EquipoJuegoDeCuestionario[];
  respuestasEquipoJuegoDeCuestionario: RespuestaEquipoJuegoDeCuestionario[];
  categoriasEjeX;

  constructor(public location: Location,
              public peticionesApi: PeticionesAPIService,
              public sesion: SesionService,
              public dialogRef: MatDialogRef<InformacionRespuestasJuegoDeCuestionarioDialogComponent>) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.TraeInfoAlumnos();
    } else {
      this.TraeInfoEquipos ();
    }
  }

  TraeInfoAlumnos() {
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
                          const pregunta = this.preguntas.filter (p => p.id === respuesta.preguntaId)[0];
                          if (pregunta.Tipo === 'Emparejamiento') {
                            if (respuesta.Respuesta !== undefined) {
                              let n = 0;
                              for (let i = 0; i < pregunta.Emparejamientos.length; i++) {
                                if (pregunta.Emparejamientos[i].r === respuesta.Respuesta[i]) {
                                  n++;
                                }
                              }
                              if (n === pregunta.Emparejamientos.length) {
                                aciertos++;
                              }
                            }

                          } else {
                            if (pregunta.RespuestaCorrecta === respuesta.Respuesta[0]) {
                              aciertos++;
                            }
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
  
  TraeInfoEquipos() {
 
    this.peticionesApi.DameCuestionario (this.juegoSeleccionado.cuestionarioId)
    .subscribe (cuestionario => {
            this.cuestionario = cuestionario;

            this.peticionesApi.DamePreguntasCuestionario (this.cuestionario.id)
            .subscribe ( preguntas => {
              this.preguntas = preguntas;
              // voy a hacer el histograma de alumnos x número de aciertos
              this.histogramaAciertos = Array(this.preguntas.length + 1).fill(0);
              this.peticionesApi.DameInscripcionesEquipoJuegoDeCuestionario (this.juegoSeleccionado.id)
              .subscribe (equipos => {
                    this.inscripcionesEquiposJuegoDeCuestionario = equipos;
                    // aqui guardare las respuestas de todos los alumnos
                    this.respuestasEquipoJuegoDeCuestionario = [];
                    let cont = 0;
                    this.inscripcionesEquiposJuegoDeCuestionario.forEach (equipo => {
                      this.peticionesApi.DameRespuestasEquipoJuegoDeCuestionario (equipo.id)
                      .subscribe (respuestas => {

                        let aciertos = 0;
                        // voy a contar los aciertos de este alumno
                        respuestas.forEach (respuesta => {
                          const pregunta = this.preguntas.filter (p => p.id === respuesta.preguntaId)[0];
                          if (pregunta.Tipo === 'Emparejamiento') {
                            if (respuesta.Respuesta !== undefined) {
                              let n = 0;
                              for (let i = 0; i < pregunta.Emparejamientos.length; i++) {
                                if (pregunta.Emparejamientos[i].r === respuesta.Respuesta[i]) {
                                  n++;
                                }
                              }
                              if (n === pregunta.Emparejamientos.length) {
                                aciertos++;
                              }
                            }

                          } else {
                            if (pregunta.RespuestaCorrecta === respuesta.Respuesta[0]) {
                              aciertos++;
                            }
                          }
                        });
                        this.histogramaAciertos[aciertos]++;
                        this.respuestasEquipoJuegoDeCuestionario = this.respuestasEquipoJuegoDeCuestionario.concat (respuestas);
                        cont++;
                        if (cont === this.inscripcionesEquiposJuegoDeCuestionario.length) {
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
      let respuestas;
      if (this.juegoSeleccionado.Modo === 'Individual') {
        respuestas = this.respuestasJuegoDeCuestionario.filter (respuesta => respuesta.preguntaId === pregunta.id);
   
      } else {
        respuestas = this.respuestasEquipoJuegoDeCuestionario.filter (respuesta => respuesta.preguntaId === pregunta.id);
      }
      let miDonut: any;
      miDonut = [];
      // preparo los datos del donut
      // primero meto el tipo de pregunta
      miDonut.push ( { tipo: pregunta.Tipo});
      if (pregunta.Tipo === 'Cuatro opciones') {
        miDonut.push ( { respuesta: pregunta.RespuestaCorrecta, cont: 0});
        miDonut.push ( { respuesta: pregunta.RespuestaIncorrecta1, cont: 0});
        miDonut.push ( { respuesta: pregunta.RespuestaIncorrecta2, cont: 0});
        miDonut.push ( { respuesta: pregunta.RespuestaIncorrecta3, cont: 0});
        // esto es para el caso de respuesta en blando
        miDonut.push ( { respuesta: '-', cont: 0});
        // ahora cuento las veces que aparece cada una de las respuestas
        respuestas.forEach (respuesta =>
          miDonut.filter (entrada => entrada.respuesta === respuesta.Respuesta[0])[0].cont++
        );

      } else if (pregunta.Tipo === 'Respuesta abierta') {
        miDonut.push ( { respuesta: pregunta.RespuestaCorrecta, cont: 0});
        miDonut.push ( { respuesta: 'Otras respuestas', cont: 0});
        // esto es para el caso de respuesta en blando
        miDonut.push ( { respuesta: '-', cont: 0});
        // ahora cuento las veces que aparece cada una de las respuestas
        respuestas.forEach (respuesta => {
          if (respuesta.Respuesta[0] === pregunta.RespuestaCorrecta) {
            miDonut.filter (entrada => entrada.respuesta === pregunta.RespuestaCorrecta)[0].cont++;
          } else if (respuesta.Respuesta[0] === '-') {
            miDonut.filter (entrada => entrada.respuesta === '-')[0].cont++;
          } else {
            miDonut.filter (entrada => entrada.respuesta === 'Otras respuestas')[0].cont++;
          }
        });

      } else if (pregunta.Tipo === 'Verdadero o falso') {
        miDonut.push ( { respuesta: pregunta.RespuestaCorrecta, cont: 0});
        miDonut.push ( { respuesta: 'Mal', cont: 0});
        // esto es para el caso de respuesta en blando
        miDonut.push ( { respuesta: '-', cont: 0});
        // ahora cuento las veces que aparece cada una de las respuestas
        respuestas.forEach (respuesta => {
          if (respuesta.Respuesta[0] === pregunta.RespuestaCorrecta) {
            miDonut.filter (entrada => entrada.respuesta === pregunta.RespuestaCorrecta)[0].cont++;
          } else if (respuesta.Respuesta[0] === '-') {
            miDonut.filter (entrada => entrada.respuesta === '-')[0].cont++;
          } else {
            miDonut.filter (entrada => entrada.respuesta === 'Mal')[0].cont++;
          }
        });

      } else {
        miDonut.push ( { respuesta: 'Emparejamientos correctos', cont: 0});
        miDonut.push ( { respuesta: 'Otros emparejamientos incorrectos', cont: 0});
        // esto es para el caso de respuesta en blando
        miDonut.push ( { respuesta: '-', cont: 0});
        // ahora cuento las veces que aparece cada una de las respuestas
        respuestas.forEach (respuesta => {
          if (respuesta.Respuesta === undefined) {
            miDonut.filter (entrada => entrada.respuesta === '-')[0].cont++;
          } else {
            let n = 0;
            for (let i = 0; i < pregunta.Emparejamientos.length; i++) {
              if (pregunta.Emparejamientos[i].r === respuesta.Respuesta[i]) {
                n++;
              }
            }
            if (n === pregunta.Emparejamientos.length) {
              miDonut.filter (entrada => entrada.respuesta === 'Emparejamientos correctos')[0].cont++;
            } else {
              miDonut.filter (entrada => entrada.respuesta ===  'Otros emparejamientos incorrectos')[0].cont++;
            }
          }
        });

      }

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
        name: 'Número de participantes'
      }],
      series: [{
        type: 'bar',
        barWidth: '60%',
        data: this.histogramaAciertos,
      }]
    };

    // ahora preparo los donuts
    console.log ('PREPARO DONUTS');
    console.log (this.misDonuts);
    let i = 1;
    this.misDonuts.forEach (miDonut => {
      if (miDonut[0].tipo === 'Cuatro opciones') {
        const datos = [
          // las respuestas correctas siempre en verde
          {value: miDonut[1].cont, name: miDonut[1].respuesta, itemStyle: {color: 'green'}},
          {value: miDonut[2].cont, name: miDonut[2].respuesta, itemStyle: {color: 'rgb(50,50,50)'}},
          {value: miDonut[3].cont, name: miDonut[3].respuesta, itemStyle: {color: 'rgb(100,100,100)'}},
          {value: miDonut[4].cont, name: miDonut[4].respuesta, itemStyle: {color: 'rgb(125,125,125)'}},
          {value: miDonut[5].cont, name: 'No contesta ' , itemStyle: {color: 'rgb(150,150,150)'}}
        ];
        const  donut = {
          title: {
            // text: 'Pregunta ' + i++,
            // subtext: 'Respuesta correcta: ' + miDonut[1].respuesta ,
            // left: 'center'
          },
          tooltip: {
              trigger: 'item',
              formatter: '{c} participantes <br/> ({d}%)'
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
      } else if (miDonut[0].tipo === 'Respuesta abierta') {
        const datos = [
          // las respuestas correctas siempre en verde
          {value: miDonut[1].cont, name: miDonut[1].respuesta, itemStyle: {color: 'green'}},
          {value: miDonut[2].cont, name: 'Otras respuestas', itemStyle: {color: 'rgb(50,50,50)'}},
          {value: miDonut[3].cont, name: 'No contesta ' , itemStyle: {color: 'rgb(150,150,150)'}}
        ];
        const  donut = {
          title: {
            // text: 'Pregunta ' + i++,
            // subtext: 'Respuesta correcta: ' + miDonut[1].respuesta ,
            // left: 'center'
          },
          tooltip: {
              trigger: 'item',
              formatter: '{c} participantes <br/> ({d}%)'
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
      } else if (miDonut[0].tipo === 'Verdadero o falso') {
        const datos = [
          // las respuestas correctas siempre en verde
          {value: miDonut[1].cont, name: miDonut[1].respuesta, itemStyle: {color: 'green'}},
          {value: miDonut[2].cont, name: 'Mal', itemStyle: {color: 'rgb(50,50,50)'}},
          {value: miDonut[3].cont, name: 'No contesta ' , itemStyle: {color: 'rgb(150,150,150)'}}
        ];
        const  donut = {
          title: {
            // text: 'Pregunta ' + i++,
            // subtext: 'Respuesta correcta: ' + miDonut[1].respuesta ,
            // left: 'center'
          },
          tooltip: {
              trigger: 'item',
              formatter: '{c} participantes <br/> ({d}%)'
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
      } else {
        const datos = [
          // las respuestas correctas siempre en verde
          {value: miDonut[1].cont, name: 'Emparejamientos correctos', itemStyle: {color: 'green'}},
          {value: miDonut[2].cont, name: 'Otros emparejamientos incorrectos', itemStyle: {color: 'rgb(50,50,50)'}},
          {value: miDonut[3].cont, name: 'No contesta ' , itemStyle: {color: 'rgb(150,150,150)'}}
        ];
        const  donut = {
          title: {
            // text: 'Pregunta ' + i++,
            // subtext: 'Respuesta correcta: ' + miDonut[1].respuesta ,
            // left: 'center'
          },
          tooltip: {
              trigger: 'item',
              formatter: '{c} participantes <br/> ({d}%)'
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
      }
    });

  }


  goBack() {
    this.dialogRef.close();
  }
}

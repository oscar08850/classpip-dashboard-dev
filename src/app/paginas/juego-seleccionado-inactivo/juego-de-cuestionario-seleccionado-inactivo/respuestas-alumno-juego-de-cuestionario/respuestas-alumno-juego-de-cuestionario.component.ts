import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SesionService, PeticionesAPIService, CalculosService } from 'src/app/servicios';
// tslint:disable-next-line:max-line-length
import { Juego, Alumno , Cuestionario, Pregunta, AlumnoJuegoDeCuestionario, PreguntaDelCuestionario, TablaAlumnoJuegoDeCuestionario, EquipoJuegoDeCuestionario, TablaEquipoJuegoDeCuestionario } from 'src/app/clases';


@Component({
  selector: 'app-respuestas-alumno-juego-de-cuestionario',
  templateUrl: './respuestas-alumno-juego-de-cuestionario.component.html',
  styleUrls: ['./respuestas-alumno-juego-de-cuestionario.component.scss']
})
export class RespuestasAlumnoJuegoDeCuestionarioComponent implements OnInit {
alumno: TablaAlumnoJuegoDeCuestionario;
alumnosDelEquipo: Alumno[];
alumnosOrdenados: Alumno[];
equipo: TablaEquipoJuegoDeCuestionario;
inscripcionAlumnoJuegoDeCuestionario: AlumnoJuegoDeCuestionario;
inscripcionesAlumnos: AlumnoJuegoDeCuestionario[];
inscripcionEquipoJuegoDeCuestionario: EquipoJuegoDeCuestionario;
info: any;
infoMiembrosEquipo: any;
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
    // Voy a usar este componente para mostrar las respuestas del alumno o del equipo elegido
    // porque en ambos casos hay que hacer practicamente lo mismo y no vale la pena hacer componentes
    // separados para alumno y para equipo
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log ('juego ', this.juegoSeleccionado);
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.alumno = this.sesion.DameAlumnoJuegoDeCuestionario();
      this.inscripcionAlumnoJuegoDeCuestionario = this.sesion.DameInscripcionAlumnoJuegoDeCuestionario();
      this.PrepararInfo();
    } else if (this.juegoSeleccionado.Presentacion !== 'Primero') {
      // tenemos que mostrar las respuestas de los miembros del equipo
      this.equipo = this.sesion.DameEquipoJuegoDeCuestionario();
      this.PrepararRespuestasMiembrosDelEquipo ();
      this.PrepararInfoMiembrosDelEquipo ();
    } else {
      this.equipo = this.sesion.DameEquipoJuegoDeCuestionario();
      this.inscripcionEquipoJuegoDeCuestionario = this.sesion.DameInscripcionEquipoJuegoDeCuestionario();
      this.PrepararInfo();
    }

  

  }

  async PrepararRespuestasMiembrosDelEquipo() {
    this.inscripcionesAlumnos = [];
    const alumnosDelEquipo = await this.peticionesApi.DameEquipoConAlumnos (this.equipo.id).toPromise();
    this.inscripcionesAlumnos = this.sesion.DameInscripcionesMiembrosDelEquipo ();
  }

  PrepararInfo() {
    // Me traigo el cuestionario y las preguntas
    this.peticionesApi.DameCuestionario (this.juegoSeleccionado.cuestionarioId)
    .subscribe (cuestionario => {
            this.cuestionario = cuestionario;
            this.peticionesApi.DamePreguntasCuestionario (this.cuestionario.id)
            .subscribe ( async preguntas => {
              this.preguntas = preguntas;
              this.preguntas.sort((a , b) => (a.id > b.id ? 1 : -1));
              // guardo los titulos de las preguntas para mostrarlos en el grafico
              this.titulos = [];
              this.preguntas.forEach (pregunta => this.titulos.push (pregunta.Titulo));
              let respuestas;
              if (this.juegoSeleccionado.Modo === 'Individual') {
                // tslint:disable-next-line:max-line-length
                respuestas = await this.peticionesApi.DameRespuestasAlumnoJuegoDeCuestionario (this.inscripcionAlumnoJuegoDeCuestionario.id).toPromise();
              } else {
                 // tslint:disable-next-line:max-line-length
                 respuestas = await this.peticionesApi.DameRespuestasEquipoJuegoDeCuestionario (this.inscripcionEquipoJuegoDeCuestionario.id).toPromise();
              }


              // preparo la información para cada una de las barras horizontales
              this.barras = [];
              respuestas.sort((a , b) => (a.preguntaId > b.preguntaId) ? 1 : -1);
              respuestas.forEach (respuesta => {
                const pregunta = this.preguntas.filter (p => p.id === respuesta.preguntaId)[0];
                if (pregunta.Tipo === 'Emparejamiento') {

                      if (respuesta.Respuesta === undefined) {
                        this.barras.push (
                          {value: -1, respuesta: '-', label: {position: 'right'}, itemStyle: {color: 'red'}}
                        );
                      } else {
                        let cont = 0;
                        for (let i = 0; i < pregunta.Emparejamientos.length; i++) {
                          if (pregunta.Emparejamientos[i].r === respuesta.Respuesta[i]) {
                            cont++;
                          }
                        }
                        if (cont === pregunta.Emparejamientos.length) {
                          this.barras.push (
                            {value: 1, respuesta: respuesta.Respuesta, itemStyle: {color: 'green'}}
                          );
                        } else {
                          this.barras.push (
                            {value: -1, respuesta: respuesta.Respuesta, label: {position: 'right'}, itemStyle: {color: 'red'}}
                          );
                        }
                      }

                } else {
                      const respuestaCorrecta = pregunta.RespuestaCorrecta;
                      if (respuestaCorrecta === respuesta.Respuesta[0]) {
                        // la respuesta es correcta: barra verde
                        this.barras.push (
                          {value: 1, respuesta: respuesta.Respuesta[0], itemStyle: {color: 'green'}}
                        );
                      } else {
                        // la respuesta es incorrecta: barra roja
                        this.barras.push (
                          {value: -1, respuesta: respuesta.Respuesta[0], label: {position: 'right'}, itemStyle: {color: 'red'}}
                        );
                      }
                }
                 // preparo el objeto json que se necesita para crear el gráfico
                //this.info = this.PreparaBarras();


              });

              // preparo el objeto json que se necesita para crear el gráfico
              this.info = this.PreparaBarras();


            });
    });
  }

  async PrepararInfoMiembrosDelEquipo() {
     // Necesitaré los nombres de los alumnos
     this.alumnosDelEquipo = await this.peticionesApi.DameEquipoConAlumnos(this.equipo.id).toPromise();
     // Me traigo el cuestionario y las preguntas
     this.peticionesApi.DameCuestionario (this.juegoSeleccionado.cuestionarioId)
     .subscribe (cuestionario => {
             this.cuestionario = cuestionario;
             this.peticionesApi.DamePreguntasCuestionario (this.cuestionario.id)
             .subscribe ( async preguntas => {
               this.preguntas = preguntas;
               this.preguntas.sort((a , b) => (a.id > b.id ? 1 : -1));
               // guardo los titulos de las preguntas para mostrarlos en el grafico
               this.titulos = [];
               this.preguntas.forEach (pregunta => this.titulos.push (pregunta.Titulo));
               let respuestas;
               this.infoMiembrosEquipo = [];
               this.alumnosOrdenados = [];
               // tslint:disable-next-line:prefer-for-of
               for (let i = 0; i < this.inscripcionesAlumnos.length ; i++) {
                if (this.inscripcionesAlumnos[i].Contestado) {
                  this.alumnosOrdenados.push(this.alumnosDelEquipo.find (al => al.id === this.inscripcionesAlumnos[i].alumnoId));
                  // tslint:disable-next-line:max-line-length
                  respuestas = await this.peticionesApi.DameRespuestasAlumnoJuegoDeCuestionario (this.inscripcionesAlumnos[i].id).toPromise();
                  // preparo la información para cada una de las barras horizontales
                  this.barras = [];
                  respuestas.sort((a , b) => (a.preguntaId > b.preguntaId) ? 1 : -1);
                  respuestas.forEach (respuesta => {
                    const pregunta = this.preguntas.filter (p => p.id === respuesta.preguntaId)[0];
                    if (pregunta.Tipo === 'Emparejamiento') {
      
                          if (respuesta.Respuesta === undefined) {
                            this.barras.push (
                              {value: -1, respuesta: '-', label: {position: 'right'}, itemStyle: {color: 'red'}}
                            );
                          } else {
                            let cont = 0;
                            for (let i = 0; i < pregunta.Emparejamientos.length; i++) {
                              if (pregunta.Emparejamientos[i].r === respuesta.Respuesta[i]) {
                                cont++;
                              }
                            }
                            if (cont === pregunta.Emparejamientos.length) {
                              this.barras.push (
                                {value: 1, respuesta: respuesta.Respuesta, itemStyle: {color: 'green'}}
                              );
                            } else {
                              this.barras.push (
                                {value: -1, respuesta: respuesta.Respuesta, label: {position: 'right'}, itemStyle: {color: 'red'}}
                              );
                            }
                          }
      
                    } else {
                          const respuestaCorrecta = pregunta.RespuestaCorrecta;
                          if (respuestaCorrecta === respuesta.Respuesta[0]) {
                            // la respuesta es correcta: barra verde
                            this.barras.push (
                              {value: 1, respuesta: respuesta.Respuesta[0], itemStyle: {color: 'green'}}
                            );
                          } else {
                            // la respuesta es incorrecta: barra roja
                            this.barras.push (
                              {value: -1, respuesta: respuesta.Respuesta[0], label: {position: 'right'}, itemStyle: {color: 'red'}}
                            );
                          }
                    }
                  });
                  // preparo el objeto json que se necesita para crear el gráfico
                  this.infoMiembrosEquipo.push (this.PreparaBarras ());
                }
              }
          });
     });

  }


  PreparaBarras(): any {

    return {
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

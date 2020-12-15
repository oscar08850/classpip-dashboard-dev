import { Component, OnInit } from '@angular/core';
import {SesionService, PeticionesAPIService, CalculosService, ComServerService} from '../../../servicios/index';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { Howl } from 'howler';
import { MatTableDataSource } from '@angular/material/table';
import { Cuestionario, CuestionarioSatisfaccion, Pregunta} from '../../../clases/index';
import { Router, ActivatedRoute } from '@angular/router';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Observable} from 'rxjs';
import { of } from 'rxjs';
import 'rxjs';

import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';



@Component({
  selector: 'app-juego-de-cuestionario-rapido',
  templateUrl: './juego-de-cuestionario-rapido.component.html',
  styleUrls: ['./juego-de-cuestionario-rapido.component.scss']
})
export class JuegoDeCuestionarioRapidoComponent implements OnInit {
  juegoSeleccionado: any;
  participantes: any[];
  respuestas: any[];
  cuestionario: Cuestionario;
  preguntas: Pregunta[];
  histogramaAciertos: number[] = [];

  mostrarParticipantes = true;
  informacionPreparada = false;
  profesorId: number;
  numeroRespuestas = 0;
  numeroParticipantes = 0;
  clasificacion: any [];
  dataSource;
  displayedColumns: string[] = ['nick', 'nota'];
  categoriasEjeX;
  grafico;
  donuts: any[] = [];
  misDonuts: any[] = [];
  sonido = true;
  ficheroGenerado = false;

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = '147.83.118.92:8100/home';

  constructor(
    private calculos: CalculosService,
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    public comServer: ComServerService,
    private router: Router ) { }

  ngOnInit() {
    const sound = new Howl({
      src: ['../assets/got-it-done.mp3']
    });
    this.participantes = [];
    this.respuestas = [];
    this.clasificacion = [];

    console.log ('tengo juego');
    this.profesorId = this.sesion.DameProfesor().id;
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.PreparaInfo();

    console.log ('tengo juego');
    console.log (this.juegoSeleccionado);


    this.comServer.EsperoNickNames()
    .subscribe((nick) => {
        this.numeroParticipantes++;
        if (this.sonido) {
          sound.volume (0.1);
          sound.play();
        }
        console.log ('se ha conectado ' + nick);
        this.participantes.push ({
          nickName: nick,
          contestado: false
        });
    });
    this.comServer.EsperoRespuestasCuestionarioRapido()
    .subscribe((respuesta) => {
        this.numeroRespuestas++;
        if (this.sonido) {
          sound.volume (0.1);
          sound.play();
        }
        console.log ('ha contestado ' + respuesta.nick);
        console.log ('respuestas ');
        console.log (respuesta.respuestas);
        this.respuestas.push (respuesta.respuestas);

        // Actualizo el histograma

        let aciertos = 0;
        let j;
        for (j = 0; j < respuesta.respuestas.Preguntas.length; j++) {
          // tslint:disable-next-line:max-line-length
          const respuestaCorrecta = this.preguntas.filter (pregunta => pregunta.id === respuesta.respuestas.Preguntas[j])[0].RespuestaCorrecta;
          if (respuestaCorrecta === respuesta.respuestas.Respuestas[j]) {
              aciertos++;
          }
        }
        this.histogramaAciertos[aciertos]++;


        // actualizo los donuts

        for (j = 0; j < respuesta.respuestas.Preguntas.length; j++) {
          const e = this.misDonuts.filter (elemento => elemento.id === respuesta.respuestas.Preguntas[j]);
          const donut = e[0].donut;
          donut.filter (p => p.respuesta === respuesta.respuestas.Respuestas [j])[0].cont++;

        }


        this.clasificacion.push ({
          nick: respuesta.nick,
          nota: respuesta.respuestas.Nota,
          tiempo: respuesta.respuestas.Tiempo
        });

        // tslint:disable-next-line:only-arrow-functions
        this.clasificacion = this.clasificacion.sort(function(a, b) {
          if (b.nota !== a.nota) {
            return b.nota - a.nota;
          } else {
            // en caso de empate en la nota, gana el que empleó menos tiempo
            return a.tiempo - b.tiempo;
          }
        });

        this.dataSource = new MatTableDataSource(this.clasificacion);

        this.participantes.filter (participante => participante.nickName === respuesta.nick)[0].contestado = true;
        this.PrepararGraficos();
    });
  }



  PreparaInfo() {
    this.peticionesAPI.DameCuestionario (this.juegoSeleccionado.cuestionarioId)
    .subscribe (cuestionario => {
      this.cuestionario = cuestionario;

      this.peticionesAPI.DamePreguntasCuestionario (this.cuestionario.id)
      .subscribe ( preguntas => {
        this.preguntas = preguntas;
        // preparo el histograma
        this.histogramaAciertos = Array(this.preguntas.length + 1).fill(0);
        // preparo los donuts


        let i;
        for (i = 0; i < this.preguntas.length; i++) {
          let miDonut: any;
          miDonut = [];
          // preparo los datos del donut
          miDonut.push ( { respuesta: preguntas[i].RespuestaCorrecta, cont: 0});
          miDonut.push ( { respuesta: preguntas[i].RespuestaIncorrecta1, cont: 0});
          miDonut.push ( { respuesta: preguntas[i].RespuestaIncorrecta2, cont: 0});
          miDonut.push ( { respuesta: preguntas[i].RespuestaIncorrecta3, cont: 0});
          // esto es para el caso de respuesta en blando
          miDonut.push ( { respuesta: '-', cont: 0});
          this.misDonuts.push ({
            id: preguntas[i].id,
            donut: miDonut
          });
        }
        console.log ('ya he preparado los donuts');
        console.log (this.misDonuts);
        this.respuestas = this.juegoSeleccionado.Respuestas;
        this.numeroRespuestas = this.respuestas.length;
        this.numeroParticipantes = this.numeroRespuestas;

        if (this.numeroRespuestas !== 0) {
          console.log ('hay respuestas');
          this.PrepararHitogramaInicial();
          this.PrepararGraficos();
        }
      });
    });

  }
  EliminarJuegoRapido() {
    Swal.fire({
      title: '¿Seguro que quieres eliminar este juego rápido?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {
        this.peticionesAPI.BorraJuegoDeCuestionarioRapido (this.juegoSeleccionado.id)
        .subscribe(res => {
            if (res !== undefined) {
              Swal.fire('El juego se ha eliminado correctamente');
              this.router.navigate(['/inicio/' + this.profesorId]);
            }
        });
      }
    });

  }
  // Esto es para cuando el juego ya tenia respuestas de otras sesiones

  PrepararHitogramaInicial() {

    console.log ('voy a preparar el histograma');
    console.log (this.respuestas);
    console.log ('preguntas');
    console.log (this.preguntas);

    this.respuestas.forEach (respuesta => {

      let aciertos = 0;
      let j;
      for (j = 0; j < respuesta.respuestas.Preguntas.length; j++) {
        // tslint:disable-next-line:max-line-length
        const respuestaCorrecta = this.preguntas.filter (pregunta => pregunta.id === respuesta.respuestas.Preguntas[j])[0].RespuestaCorrecta;
        if (respuestaCorrecta === respuesta.respuestas.Respuestas[j]) {
            aciertos++;
        }
      }
      this.histogramaAciertos[aciertos]++;


      // actualizo los donuts

      for (j = 0; j < respuesta.respuestas.Preguntas.length; j++) {
        const e = this.misDonuts.filter (elemento => elemento.id === respuesta.respuestas.Preguntas[j]);
        const donut = e[0].donut;
        donut.filter (p => p.respuesta === respuesta.respuestas.Respuestas [j])[0].cont++;

      }


      this.clasificacion.push ({
        nick: respuesta.nick,
        nota: respuesta.respuestas.Nota,
        tiempo: respuesta.respuestas.Tiempo
      });

      // tslint:disable-next-line:only-arrow-functions
      this.clasificacion = this.clasificacion.sort(function(a, b) {
        if (b.nota !== a.nota) {
          return b.nota - a.nota;
        } else {
          // en caso de empate en la nota, gana el que empleó menos tiempo
          return a.tiempo - b.tiempo;
        }
      });
    });

    this.dataSource = new MatTableDataSource(this.clasificacion);


  }


  PrepararGraficos() {
    // Histograda de número de aciertos
    this.categoriasEjeX = [];
    for (let n = 0; n < this.histogramaAciertos.length ; n++) {
      this.categoriasEjeX.push (n.toString());
    }


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
    this.donuts = [];
    let i = 1;
    this.misDonuts.forEach (elem => {
      const miDonut = elem.donut;
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
    console.log ('DONUTS');
    console.log (this.donuts);

  }



canExit(): Observable <boolean> {
  // esta función se llamará cada vez que quedamos salir de la página
    const confirmacionObservable = new Observable <boolean>( obs => {
      let mensaje;
      if (!this.ficheroGenerado) {
        mensaje = 'No has generado el fichero PDF.';
      }

      Swal.fire({
          title: '¿Seguro que quieres salir?',
          html: mensaje,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, estoy seguro'
        }).then((result) => {
          if (result.value) {
            this.sonido = false;
          }
          obs.next (result.value);
      });
    });

    return confirmacionObservable;
}


GenerarInforme() {
  Swal.fire ('Atención', 'Esta funcionalidad aún no está operativa' , 'error');

  // const margenIzquierdo = 15;
  // const margenSuperior = 20;
  // const interlineado = 5;
  // const doc = new jsPDF();


  // doc.setFontSize(20);
  // doc.setFont('arial', 'normal');
  // doc.setTextColor("blue");
  // doc.text('Resultado de la asignación de turnos', margenIzquierdo, margenSuperior);
  // doc.line(margenIzquierdo, margenSuperior + 5, margenIzquierdo + 150, margenSuperior + 5);
  // const fecha = new Date().toLocaleDateString();


  // doc.setTextColor("black");
  // doc.setFontSize(14);
  // const splittedText = doc.splitTextToSize('Presentación: ' + this.juegoSeleccionado.Presentacion,  180);
  // doc.text (splittedText, margenIzquierdo, margenSuperior + 20);
  // doc.text('Fecha: ' + fecha, margenIzquierdo, margenSuperior + 40);

  // autoTable(doc, { html: '#tabla',  startY:  margenSuperior + 70 });


  // const pageCount = doc.getNumberOfPages(); //Total Page Number
  // let i;
  // for (i = 0; i < pageCount; i++) {
  //   doc.setPage(i);
  //   const pageCurrent = doc.getCurrentPageInfo().pageNumber; //Current Page
  //   doc.setFontSize(12);
  //   doc.text('página: ' + pageCurrent + '/' + pageCount, 180,  margenSuperior);
  // }

  // doc.save('informe.pdf');
  // this.ficheroGenerado = true;
}





}

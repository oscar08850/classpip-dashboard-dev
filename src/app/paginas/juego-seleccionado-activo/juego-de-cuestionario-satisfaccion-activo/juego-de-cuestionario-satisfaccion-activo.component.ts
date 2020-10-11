import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import {SesionService, PeticionesAPIService, CalculosService} from '../../../servicios/index';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import {AlumnoJuegoDeCuestionarioSatisfaccion, CuestionarioSatisfaccion } from '../../../clases/index';
import { MatTableDataSource } from '@angular/material/table';

import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-juego-de-cuestionario-satisfaccion-activo',
  templateUrl: './juego-de-cuestionario-satisfaccion-activo.component.html',
  styleUrls: ['./juego-de-cuestionario-satisfaccion-activo.component.scss']
})
export class JuegoDeCuestionarioSatisfaccionActivoComponent implements OnInit {
  @ViewChild('htmlData') htmlData: ElementRef;

  juegoSeleccionado: any;
  inscripciones: AlumnoJuegoDeCuestionarioSatisfaccion[];
  respuestasAfirmaciones: number[];
  respuestasPreguntasAbiertas: string [][];
  cuestionario: CuestionarioSatisfaccion;
  numeroRespuestas: number;
  informacionPreparada = false;
  afirmaciones: any[];
  datosGrafico: any[];
  dataSource;
  displayedColumns: string[] = ['afirmacion', 'media'];
  grafico;


  constructor(
    private calculos: CalculosService,
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    private location: Location
  ) { }

  ngOnInit() {
    // const doc = new jsPDF();

    // doc.text('Hello world', 20, 20);
    // doc.save('Test.pdf');


    this.juegoSeleccionado = this.sesion.DameJuego();
    this.peticionesAPI.DameCuestionarioSatisfaccion (this.juegoSeleccionado.cuestionarioSatisfaccionId)
    .subscribe (cuestionario => {
      this.cuestionario = cuestionario;
      this.RecuperarInscripcionesAlumnoJuego();
    });

  }

  RecuperarInscripcionesAlumnoJuego() {
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeCuestionarioSatisfaccion(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.inscripciones = inscripciones;
      // tslint:disable-next-line:only-arrow-functions
      this.PreparaInformacion();
      this.informacionPreparada = true;
    });
  }

  PreparaInformacion() {
    this.numeroRespuestas = 0;
    this.respuestasAfirmaciones = Array(this.cuestionario.Afirmaciones.length).fill (0);
    this.respuestasPreguntasAbiertas = Array(this.cuestionario.PreguntasAbiertas.length);
    let i: number;
    for ( i = 0; i < this.respuestasPreguntasAbiertas.length; i++) {
      this.respuestasPreguntasAbiertas[i] = [];
    }
    this.inscripciones.forEach (inscripcion => {
      if (inscripcion.Contestado) {
        this.numeroRespuestas++;
        for ( i = 0; i < this.respuestasAfirmaciones.length; i++) {
          this.respuestasAfirmaciones[i] =  this.respuestasAfirmaciones[i]  + inscripcion.RespuestasAfirmaciones[i];
        }
        for ( i = 0; i < this.respuestasPreguntasAbiertas.length; i++) {
          this.respuestasPreguntasAbiertas[i].push (inscripcion.RespuestasPreguntasAbiertas[i]);
        }
      }
    });
    this.afirmaciones = [];
    this.datosGrafico = [];


    for ( i = 0; i < this.respuestasAfirmaciones.length; i++) {
      const media =  this.respuestasAfirmaciones[i] / this.numeroRespuestas;
      this.afirmaciones.push ({
        Texto: this.cuestionario.Afirmaciones[i],
        Media: media
      });
      this.datosGrafico.push ( [this.cuestionario.Afirmaciones[i], media]);
    }


    this.datosGrafico = [['afirmaciones', 'media']].concat(this.datosGrafico.reverse());

    console.log ('datos para grafico');
    console.log (this.datosGrafico);

    this.dataSource = new MatTableDataSource(this.afirmaciones);

    this.grafico = {
      dataset: {
          source: this.datosGrafico,
      },
      grid: {containLabel: true},
      xAxis: {name: 'media', min: 1, max: 5},
      yAxis: {type: 'category'},
      visualMap: {
          orient: 'horizontal',
          left: 'center',
          min: 1,
          max: 5,
          text: ['High Score', 'Low Score'],
          // Map the score column to color
          dimension: 1,
          inRange: {
              color: ['#FFF633', '#33FF49']
          }
      },
      series: [
          {
              type: 'bar',
              encode: {
                  // Map the "amount" column to X axis.
                  x: 'media',
                  // Map the "product" column to Y axis
                  y: 'afirmacion'
              }
          }
      ]
    };


  }

  DesactivarJuego() {
    Swal.fire({
      title: '¿Seguro que quieres desactivar el juego?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {

        this.juegoSeleccionado.JuegoActivo = false;
        this.peticionesAPI.CambiaEstadoJuegoDeCuestionarioSatisfaccion (this.juegoSeleccionado)
        .subscribe(res => {
            if (res !== undefined) {
              console.log(res);
              console.log('juego desactivado');
              Swal.fire('El juego se ha desactivado correctamente');
              this.location.back();
            }
        });
      }
    });
  }

  GenerarInforme() {
    const pdf = new jsPDF();
    pdf.text('Hello world!', 10, 10 );

    pdf.text('Hola', 50, 10 );
    pdf.setFont('courier', 'italic');
    pdf.setFontSize(40);
    pdf.setTextColor(255, 0, 0);



    pdf.text('tres', 10, 50 );




    autoTable(pdf, { html: '#tabla' });
    autoTable(pdf, { html: '#tabla',  startY: 50 });

    pdf.save('table.pdf');




    // const tabla = window.document.getElementById('tabla');
    // pdf.fromHTML (tabla, 20, 20);
    // pdf.addHTML (tabla, 10, 10,);
    // tslint:disable-next-line:only-arrow-functions
  //   pdf.addHTML(document.body, function() {
  //     pdf.save('web.pdf');
  // });

  }
}

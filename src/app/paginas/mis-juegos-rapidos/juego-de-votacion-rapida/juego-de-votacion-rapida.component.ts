import { Component, OnInit } from '@angular/core';
import {SesionService, PeticionesAPIService, CalculosService, ComServerService} from '../../../servicios/index';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { Howl } from 'howler';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-juego-de-votacion-rapida',
  templateUrl: './juego-de-votacion-rapida.component.html',
  styleUrls: ['./juego-de-votacion-rapida.component.scss']
})
export class JuegoDeVotacionRapidaComponent implements OnInit {
  juegoSeleccionado: any;
  participantes: any[];

  mostrarParticipantes = true;
  puntos: number[];
  numeroRespuestas = 0;
  informacionPreparada = false;
  datos: any[];
  dataSource;
  displayedColumns: string[] = ['concepto', 'puntos'];
  profesorId: number;

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
      this.profesorId = this.sesion.DameProfesor().id;
      this.juegoSeleccionado = this.sesion.DameJuego();
      this.puntos = Array (this.juegoSeleccionado.Conceptos.length).fill (0);

      console.log ('tengo juego');
      this.comServer.EsperoNickNames()
      .subscribe((nick) => {
          sound.play();
          console.log ('se ha conectado ' + nick);
          this.participantes.push ({
            nickName: nick,
            contestado: false
          });
      });

      // preparamos la tabla para guardar los votos
      this.datos = [];
      let i;
      for (i = 0; i < this.juegoSeleccionado.Conceptos.length; i++) {
        this.datos.push ({
          concepto:  this.juegoSeleccionado.Conceptos[i],
          puntos: 0
        });
      }
      this.comServer.EsperoRespuestasVotacionRapida()
      .subscribe((respuesta) => {
          sound.play();
          this.numeroRespuestas++;
          // tslint:disable-next-line:no-shadowed-variable
          let i;
          for (i = 0; i < respuesta.votos.length; i++) {
            const index = this.datos.findIndex (entrada => entrada.concepto === respuesta.votos[i] );
            this.datos [index].puntos =  this.datos [index].puntos + this.juegoSeleccionado.Puntos[i];
          }
          this.datos.sort((a, b) => b.puntos - a.puntos);
          this.dataSource = new MatTableDataSource(this.datos);

          this.participantes.filter (participante => participante.nickName === respuesta.nick)[0].contestado = true;
      });
    }

  Toogle() {
    this.mostrarParticipantes = !this.mostrarParticipantes;
  }

  EliminarJuegoRapido () {
    Swal.fire({
      title: '¿Seguro que quieres eliminar este juego rápido?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {
        this.peticionesAPI.BorraJuegoDeVotacionRapida (this.juegoSeleccionado.id)
        .subscribe(res => {
            if (res !== undefined) {
              Swal.fire('El juego se ha eliminado correctamente');
              this.router.navigate(['/inicio/' + this.profesorId]);
            }
        });
      }
    });

  }
  GenerarInforme() {
    const margenIzquierdo = 15;
    const margenSuperior = 20;
    const interlineado = 5;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setFont('arial', 'normal');
    doc.setTextColor("blue");
    doc.text('Resultados de la votación rápida', margenIzquierdo, margenSuperior);
    doc.line(margenIzquierdo, margenSuperior + 5, margenIzquierdo + 150, margenSuperior + 5);
    const fecha = new Date().toLocaleDateString();


    doc.setTextColor("black");
    doc.setFontSize(14);
    doc.text('Titulo de la votación: ' + this.juegoSeleccionado.NombreJuego, margenIzquierdo, margenSuperior + 20);
    doc.text('Fecha: ' + fecha, margenIzquierdo, margenSuperior + 30);
    doc.text('Número de participantes: ' + this.participantes.length, margenIzquierdo,  margenSuperior + 40);
    const porcentaje = ((this.numeroRespuestas / this.participantes.length) * 100 ).toFixed(0);
    doc.text('Número de respuestas: ' + this.numeroRespuestas + ' (' + porcentaje + '%)', margenIzquierdo, margenSuperior + 50);

    autoTable(doc, { html: '#tabla',  startY:  margenSuperior + 70 });


    doc.save('informe.pdf');

  }

}

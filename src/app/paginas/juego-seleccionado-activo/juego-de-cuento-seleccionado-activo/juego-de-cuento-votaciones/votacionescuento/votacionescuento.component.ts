import { Component, ConstructorSansProvider, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { PeticionesAPIService, SesionService, ComServerService } from 'src/app/servicios';
import {
  Alumno, Equipo, Juego, Punto, Nivel, AlumnoJuegoDePuntos, JuegoDeLibros, concursoLibro, EquipoJuegoDePuntos,
  TablaAlumnoJuegoDePuntos, TablaEquipoJuegoDePuntos, JuegoDeAvatar, AlumnoJuegoDeAvatar, AlumnoJuegoDeLibro
} from '../../../../../clases/index';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Libro } from 'src/app/clases/Libro';
import { Console } from 'console';





@Component({
  selector: 'app-votacionescuento',
  templateUrl: './votacionescuento.component.html',
  styleUrls: ['./votacionescuento.component.scss']
})

export class VotacionescuentoComponent implements OnInit {

  myform: FormGroup;
  ganador;
  muestralista: Libro[] = [];
  juegoSeleccionado: any;
  grupoid;
  listainscritos: any = [];x
  listaLibros: Libro[] = [];
  displayedColumns: string[] = ['titulo', 'autor', 'criterio1', 'criterio2', 'criterio3', 'criteriototal'];
  datasourcelibros;
  concurso: concursoLibro;
  primerpuesto;
  segundopuesto;
  tercerpuesto;


  ganadorform = new FormGroup({

    g1: new FormControl(),
    g2: new FormControl(),
    g3: new FormControl()

  });

  constructor(public dialog: MatDialog,
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    private comServerService: ComServerService,
    private location: Location,
    private router: Router) { }


  ngOnInit() {

    this.juegoSeleccionado = this.sesion.DameJuego();

    this.grupoid = this.sesion.DameGrupo();
    this.obtenerlibrosconcurso();


    this.comServerService.Conectar();
    console.log("ESTOY CONECTANDOME DESDE EL DASHBOARD");

    this.comServerService.Esperovotacionconcurso()
      .subscribe((res: any) => {

        console.log(res);
        this.obtenerlibrosconcurso();
      });


  }
  obtenerlibrosconcurso() {

    this.listainscritos = [];
    this.peticionesAPI.dameConcurso(this.juegoSeleccionado.id)
      .subscribe(res => {


        res.forEach(element => {
          this.concurso = element;
          this.listainscritos = element.listaLibrosParticipantes;


        });
        this.getLibro();


      });



  }

  getLibro() {


    var i = 0;

    this.listainscritos.forEach(element => {

      this.listaLibros = [];
      this.peticionesAPI.dameunlibro(element)
        .subscribe((res) => {



          var libro = res as Libro;

          this.listaLibros.push(libro);
          console.log(this.listaLibros);



          i = i + 1;

          if (i == this.listainscritos.length) {
            this.pintartabla();
          }


        }, (err) => {

        })

    });


  }



  pintartabla() {


    this.listaLibros.sort((a, b) => a.criteriototal - b.criteriototal);

    // this.listalibros.sort((a, b) =>
    // a.criteriototal === b.criteriototal ? -1 : 0);
    this.muestralista = [];
    console.log(this.listaLibros);

    this.muestralista = this.listaLibros;

    this.muestralista.reverse();
    console.log(this.muestralista);




    // this.listaLibros.sort((a, b) =>
    //  a.criterio1===b.criterio1?-1:0); 
    // this.listaLibros.sort((a, b) =>
    //   a.criteriototal === b.criteriototal ? -1 : 0);




    this.datasourcelibros = new MatTableDataSource(this.muestralista);
    console.log(this.datasourcelibros);
  }


  guardar() {

    this.primerpuesto = this.ganadorform.value.g1;
    this.segundopuesto = this.ganadorform.value.g2;
    this.tercerpuesto = this.ganadorform.value.g3;


    if (this.primerpuesto == this.segundopuesto || this.primerpuesto == this.tercerpuesto) {

      console.log("selecciona un libro diferente para cada puesto");
      Swal.fire('Alerta', 'Selecciona un libro diferente para cada puesto', 'warning');
    }


    if (this.primerpuesto == this.segundopuesto || this.segundopuesto == this.tercerpuesto) {

      console.log("selecciona un libro diferente para cada puesto");
      Swal.fire('Alerta', 'Selecciona un libro diferente para cada puesto', 'warning');
    }

    else {

      this.acabarconcurso();
    }

  }


  acabarconcurso() {

    this.concurso.primerpuesto = this.primerpuesto;
    this.concurso.segundopuesto = this.segundopuesto;
    this.concurso.tercerpuesto = this.tercerpuesto;
    this.concurso.acabado = true;

    this.peticionesAPI.modificarConcurso(this.concurso.id, this.concurso)
      .subscribe(res => {

        console.log(res);

      });



  }




}

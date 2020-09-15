import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { PeticionesAPIService, SesionService } from 'src/app/servicios';


import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-votacionescuento',
  templateUrl: './votacionescuento.component.html',
  styleUrls: ['./votacionescuento.component.scss']
})

export class VotacionescuentoComponent implements OnInit {

  juegoSeleccionado: any;
  grupoid;
  listainscritos: any = [];
  listaLibros: any = [];
  displayedColumns: string[] = ['titulo', 'autor'];
  datasourcelibros;

  constructor(public dialog: MatDialog,
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    private location: Location,
    private router: Router) { }


  ngOnInit() {

    this.juegoSeleccionado = this.sesion.DameJuego();

    this.grupoid = this.sesion.DameGrupo();
    this.obtenerlibrosconcurso();


  }

  obtenerlibrosconcurso() {


    this.peticionesAPI.dameConcurso(this.juegoSeleccionado.id)
      .subscribe(res => {
        this.listainscritos = [];

        res.forEach(element => {

          this.listainscritos = element.listaLibrosParticipantes;
          
          this.listainscritos.forEach(element => {

            this.getLibro(element);
          });


          this.pintartabla();    
        });

        this.pintartabla();    
      });  
    
  }

  getLibro(element) {
    this.peticionesAPI.dameLibro(element)
      .subscribe((res) => {

        if (res.length != 0) {
          this.listaLibros.push(res[0]);
        }
      }, (err) => {
        this.pintartabla();    
      })
  }



  pintartabla(){

    var datasourcelibros = new MatTableDataSource(this.listaLibros);
  }




}






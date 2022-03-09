import { Component, OnInit } from '@angular/core';
import {SesionService, PeticionesAPIService, CalculosService} from '../../../servicios/index';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-juego-de-memorama-seleccionado-inactivo',
  templateUrl: './juego-de-memorama-seleccionado-inactivo.component.html',
  styleUrls: ['./juego-de-memorama-seleccionado-inactivo.component.scss']
})
export class JuegoDeMemoramaSeleccionadoInactivoComponent implements OnInit {

  constructor( private calculos: CalculosService,
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    private location: Location
     ) { }

displayedColumnsAlumnos: string[] = ['posicion', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'puntuacion','tiempo'];

  juegoSeleccionado:any;
  
  idjuegomemorama:any;
  alumnosDelJuego:any;
  listaAlumnosOrdenadaPorPuntos:any;
  rankingJuegoDePuntos:any;
  datasourceAlumno:any;

  ngOnInit() {

    this.juegoSeleccionado= this.sesion.DameJuego();
    console.log(this.juegoSeleccionado);

    console.log(this.juegoSeleccionado.id);


    this.DameInfoAlumnosJuegoDeMemorama();

  }

  async DameInfoAlumnosJuegoDeMemorama(){
    
    this.alumnosDelJuego = await this.peticionesAPI.DameInfoAlumnosJuegoDeMemorama(this.juegoSeleccionado.id).toPromise();
    
    
    
    this.DamealumnosjuegoMemorama();

  }
  
  DamealumnosjuegoMemorama(){
    this.peticionesAPI.DamealumnosjuegoMemorama(this.juegoSeleccionado.id).subscribe(alumnos =>{
      console.log(alumnos);
      this.listaAlumnosOrdenadaPorPuntos = alumnos;
      // ordena la lista por puntos
      this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2) {
        return obj2.puntuacion - obj1.puntuacion;

      });

      this.TablaClasificacionTotal();

    })

  }

 

  TablaClasificacionTotal(){

    console.log(this.alumnosDelJuego,this.listaAlumnosOrdenadaPorPuntos);

    this.rankingJuegoDePuntos = this.calculos.PrepararTablaRankingIndividualMemorama(this.listaAlumnosOrdenadaPorPuntos,this.alumnosDelJuego);
      console.log ('Ya tengo la tabla');
      console.log(this.rankingJuegoDePuntos);
      // tslint:disable-next-line:max-line-length
     // this.rankingJuegoDePuntosTotal = this.calculos.DameRanking (this.listaAlumnosOrdenadaPorPuntos, this.alumnosDelJuego, this.nivelesDelJuego);
      this.datasourceAlumno = new MatTableDataSource(this.rankingJuegoDePuntos);

  }


  Reactivar() {
    Swal.fire({
      title: '¿Seguro que quieres activar el juego?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {

        this.juegoSeleccionado.JuegoActivo = true;
        this.peticionesAPI.CambiaEstadoJuegoDeMemorama (this.juegoSeleccionado)
        .subscribe(res => {
            if (res !== undefined) {
              Swal.fire('El juego se ha activado correctamente');
              this.location.back();
            }
        });
      }
    });
  }

   
  Eliminar() {
    Swal.fire({
      title: '¿Seguro que quieres eliminar el juego?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then( async (result) => {
      if (result.value) {
        await this.calculos.EliminarJuegoDeMemorama(this.juegoSeleccionado);
        Swal.fire('El juego se ha eliminado correctamente');
        this.location.back();
      }
    });
  }

  

}

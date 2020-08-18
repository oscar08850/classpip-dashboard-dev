import { Component, OnInit } from '@angular/core';
import { PeticionesAPIService } from '../../servicios/peticiones-api.service';
import { SesionService } from '../../servicios/sesion.service';



@Component({
  selector: 'app-mis-recursos-libro',
  templateUrl: './mis-recursos-libro.component.html',
  styleUrls: ['./mis-recursos-libro.component.scss']
})
export class MisRecursosLibroComponent implements OnInit {


  listaRecursos: any[] = [];


  constructor(public API: PeticionesAPIService, public sesion: SesionService) { }


  ngOnInit() {

    this.recuperarListaRecursos();
  }


  recuperarListaRecursos() {
    this.listaRecursos = [];

    this.API.recuperarListaRecursos(this.sesion.DameProfesor().id)
      .subscribe((res) => {

        this.listaRecursos = res;
        console.log(this.listaRecursos);
      }, (err) => {

      })
  }

}

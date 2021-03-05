import { Component, OnInit } from '@angular/core';
import { SesionService, CalculosService, PeticionesAPIService } from '../../servicios';
import { Router } from '@angular/router';
import { Rubrica } from 'src/app/clases';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-rubricas',
  templateUrl: './mis-rubricas.component.html',
  styleUrls: ['./mis-rubricas.component.scss']
})
export class MisRubricasComponent implements OnInit {

  listaRubricas: Rubrica[];
  rubricaElegida: Rubrica;
  rubricaId: number;

  constructor(
                private peticionesAPI: PeticionesAPIService,
                private sesion: SesionService,   private location: Location,
                private router: Router
  ) { }

  ngOnInit() {
    this.peticionesAPI.DameRubricasProfesor (this.sesion.DameProfesor().id)
    .subscribe (lista => {
      this.listaRubricas = lista;
      console.log ('Rubrias');
      console.log (this.listaRubricas);
    });
  }
  MuestraRubrica() {
    this.rubricaElegida = this.listaRubricas.filter (rubrica => rubrica.id === Number(this.rubricaId))[0]

  }
  EliminarRubrica () {
    Swal.fire({
      title: '¿Seguro que quieres eliminar esta rúbrica?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {
        this.peticionesAPI.BorrarRubrica (this.rubricaElegida.id)
        .subscribe (() =>  {
          this.rubricaElegida = undefined;
          this.listaRubricas = this.listaRubricas.filter (rubrica => rubrica.id !== Number(this.rubricaId));
          Swal.fire('OK', 'Rúbrica eliminada', 'success');
        });
      }
    });

  }

}

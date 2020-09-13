import { Component, OnInit } from '@angular/core';
import { SesionClase } from 'src/app/clases';
import { PeticionesAPIService, SesionService } from 'src/app/servicios';



@Component({
  selector: 'app-listado-cuentos',
  templateUrl: './listado-cuentos.component.html',
  styleUrls: ['./listado-cuentos.component.scss']
})

export class ListadoCuentosComponent implements OnInit {


  juegoSeleccionado: any;
  grupoid: any;

  listaJuegoAlumnosCuentos: any = [];
  listaLibros: any = [];


  constructor(private sesion: SesionService, private peticionesAPI: PeticionesAPIService) { }

  ngOnInit() {


    this.juegoSeleccionado = this.sesion.DameJuego();

    this.grupoid = this.sesion.DameGrupo();
    this.obtenerAlumnosJuegoCuento();


  }


  obtenerAlumnosJuegoCuento() {
    this.peticionesAPI.DameAlumnosJuegoLibro(this.juegoSeleccionado.id)
      .subscribe(res => {

        this.listaJuegoAlumnosCuentos = res;
        var i = 0;

        this.listaJuegoAlumnosCuentos.forEach(element => {

          this.getLibro(element);

        });
      });
  }

  getLibro(element) {
    this.peticionesAPI.dameLibro(element.id)
      .subscribe((res) => {
        if (res.length != 0) {
          this.listaLibros.push(res[0]);
        }
      }, (err) => {

      })
  }
}
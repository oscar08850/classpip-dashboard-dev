import { Component, OnInit } from '@angular/core';
import { SesionService, CalculosService, PeticionesAPIService } from '../../../servicios';
import { FamiliaAvatares } from 'src/app/clases';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import * as URL from '../../../URLs/urls';

@Component({
  selector: 'app-guardar-familia',
  templateUrl: './guardar-familia.component.html',
  styleUrls: ['./guardar-familia.component.scss']
})
export class GuardarFamiliaComponent implements OnInit {

 familiaElegida: FamiliaAvatares;
 imagenSilueta;
 c1: any[];
 c2: any[];
 c3: any[];
 c4: any[];



  constructor( private peticionesAPI: PeticionesAPIService,
               private sesion: SesionService,   private location: Location,
               private router: Router
) { }

  ngOnInit() {
    this.familiaElegida = this.sesion.DameFamilia ();
    console.log ('ya tengo la familia');
    console.log (this.familiaElegida);
    this.PreparaImagenes();
    console.log ('Voy a guardar');
    // Ni el identificador de la familia ni el del profesor van en el fichero JSON
    delete this.familiaElegida.id;
    delete this.familiaElegida.profesorId;

    const theJSON = JSON.stringify(this.familiaElegida);
    console.log (theJSON);

    const uri = "data:application/json;charset=UTF-8," + encodeURIComponent(theJSON);

    const a = document.getElementById('generarJSON');
    a.setAttribute ('href', uri);
    a.setAttribute ('download', this.familiaElegida.NombreFamilia);
    a.innerHTML = "Botón derecho y selecciona 'deja el enlace como...'";
  }


  PreparaImagenes() {

    // Vamos a por las imagenes de cada uno de los complementos
    this.imagenSilueta = URL.ImagenesAvatares + this.familiaElegida.Silueta;

    this.c1 = [];
    this.familiaElegida.Complemento1.forEach (imagenComplemento => {
      this.c1.push (URL.ImagenesAvatares + imagenComplemento);
    });

    this.c2 = [];
    this.familiaElegida.Complemento2.forEach (imagenComplemento => {
      this.c2.push (URL.ImagenesAvatares + imagenComplemento);
    });
    this.c3 = [];
    this.familiaElegida.Complemento3.forEach (imagenComplemento => {
      this.c3.push (URL.ImagenesAvatares + imagenComplemento);
    });
    this.c4 = [];
    this.familiaElegida.Complemento4.forEach (imagenComplemento => {
      this.c4.push (URL.ImagenesAvatares + imagenComplemento);
    });
  }

  goBack() {
    this.location.back();
  }


}

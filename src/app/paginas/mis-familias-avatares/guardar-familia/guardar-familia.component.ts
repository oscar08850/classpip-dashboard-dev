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
    delete this.familiaElegida.id;
    delete this.familiaElegida.profesorId;

    const theJSON = JSON.stringify(this.familiaElegida);
    console.log (theJSON);

    const uri = "data:application/json;charset=UTF-8," + encodeURIComponent(theJSON);

    const a = document.getElementById('generarJSON');
    a.setAttribute ('href', uri);
    // a.href = 'http://147.83.118.92:3000/api/imagenes/imagenesAvatares/download/cute_silueta11.png';
    a.setAttribute ('download', this.familiaElegida.NombreFamilia);
    // document.body.appendChild(a);
    //a.setAttribute ('style',  'display: none');
    // a.style = 'display: none';
    //a.click();
    // a.remove();
    a.innerHTML = "Botón derecho y selecciona 'deja el enlace como...'";
   // document.body.appendChild(a);



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

  goBack2() {
    if (true) {
      Swal.fire({
        title: '¿Estas seguro que quieres salir?',
        text: 'No has registrado los cambios que has hecho en los criterios',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, quiero salir'
      }).then((result) => {
        if (result.value) {
          this.location.back();
        }
      });

    } else {
      this.location.back();
    }
  }



}

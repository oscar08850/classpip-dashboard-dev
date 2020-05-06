import { Component, OnInit } from '@angular/core';
import {SesionService, PeticionesAPIService, CalculosService} from '../../../../servicios/index';
import { Juego, FamiliaAvatares, JuegoDeAvatar } from 'src/app/clases';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informacion-juego-avatar',
  templateUrl: './informacion-juego-avatar.component.html',
  styleUrls: ['./informacion-juego-avatar.component.scss']
})
export class InformacionJuegoAvatarComponent implements OnInit {

  juegoAvatar: Juego;
  familiasDelJuego: FamiliaAvatares[];
  displayedColumns: string[] = ['privilegio', 'criterio', 'edit'];
  criterios: any [] = [];
  dataSource;
  familiaElegida;
  imagenSilueta;
  imagenComp1;
  dobleancho;
  doblealto;
  ancho;
  alto;
  familiaCargada = false;
  criterioCambiado = false;

  // En estos vectores almacenare las imagenes, que no las puedo colocar de forma dinámica
  // debido al uso del expansion panel.
  c1: any[];
  c2: any[];
  c3: any[];
  c4: any[];



  constructor(
                private sesion: SesionService,
                private location: Location,
                private peticionesAPI: PeticionesAPIService
  ) { }

  ngOnInit() {
    this.juegoAvatar = this.sesion.DameJuego ();
    console.log ('ya tengo juego');
    console.log (this.juegoAvatar);
    // me traigo las familias del juego

    this.familiasDelJuego = [];
    this.juegoAvatar.Familias.forEach (familiaId =>
      this.peticionesAPI.DameFamilia(familiaId)
      .subscribe ( familia => this.familiasDelJuego.push(familia)
      ));
    // Preparo los datos para la tabla de criterios
    this.criterios.push ({ privilegio: 'Cambiar el complemento 1', criterio: this.juegoAvatar.CriteriosPrivilegioComplemento1});
    this.criterios.push ({ privilegio: 'Cambiar el complemento 2', criterio: this.juegoAvatar.CriteriosPrivilegioComplemento2});
    this.criterios.push ({ privilegio: 'Cambiar el complemento 3', criterio: this.juegoAvatar.CriteriosPrivilegioComplemento3});
    this.criterios.push ({ privilegio: 'Cambiar el complemento 4', criterio: this.juegoAvatar.CriteriosPrivilegioComplemento4});
    this.criterios.push ({ privilegio: 'Hacer que el avatar hable', criterio: this.juegoAvatar.CriteriosPrivilegioVoz});
    this.criterios.push ({ privilegio: 'Ver avatares de toda la clase', criterio: this.juegoAvatar.CriteriosPrivilegioVerTodos});
    this.dataSource = new MatTableDataSource(this.criterios);

  }

  TraeImagenesFamilia(familia: FamiliaAvatares) {
    this.familiaCargada = false;
    this.familiaElegida = familia;

    this.peticionesAPI.DameImagenAvatar (this.familiaElegida.Silueta)
    .subscribe(response => {
          const blob = new Blob([response.blob()], { type: 'image/jpg'});

          const reader = new FileReader();
          reader.addEventListener('load', () => {
            this.imagenSilueta = reader.result.toString();
            // Lo siguiente es para conseguir el tamaño de la silueta
            const imagen = new Image();
            imagen.src = reader.result.toString();
            console.log ('ya he cargado la silueta');
            imagen.onload = () => {
              this.ancho = imagen.width.toString();
              this.alto = imagen.height.toString();
              this.dobleancho = (imagen.width * 2).toString();
              this.doblealto = (imagen.height * 2).toString();
              this.TraerImagenesComplementos();

          };
          }, false);
          if (blob) {
            reader.readAsDataURL(blob);
      }
    });
  }

  TraerImagenesComplementos() {

    // Vamos a por las imagenes de cada uno de los complementos

    console.log ('voy a por los complementos de la familia ');
    console.log (this.familiaElegida);
    this.c1 = [];
    this.familiaElegida.Complemento1.forEach (imagenComplemento => {
      this.peticionesAPI.DameImagenAvatar (imagenComplemento)
      .subscribe(response => {
        const blob = new Blob([response.blob()], { type: 'image/jpg'});
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            this.c1.push (reader.result.toString());
        }, false);

        if (blob) {
          reader.readAsDataURL(blob);
        }
      });
    });

    this.c2 = [];
    this.familiaElegida.Complemento2.forEach (imagenComplemento => {
       this.peticionesAPI.DameImagenAvatar (imagenComplemento)
       .subscribe(response => {
         const blob = new Blob([response.blob()], { type: 'image/jpg'});
         const reader = new FileReader();
         reader.addEventListener('load', () => {
            this.c2.push (reader.result.toString());
         }, false);
         if (blob) {
           reader.readAsDataURL(blob);
         }
       });
    });
    this.c3 = [];
    this.familiaElegida.Complemento3.forEach (imagenComplemento => {
        this.peticionesAPI.DameImagenAvatar (imagenComplemento)
        .subscribe(response => {
          const blob = new Blob([response.blob()], { type: 'image/jpg'});
          const reader = new FileReader();
          reader.addEventListener('load', () => {
              this.c3.push (reader.result.toString());
          }, false);
          if (blob) {
            reader.readAsDataURL(blob);
          }
        });
    });
    this.c4 = [];
    this.familiaElegida.Complemento4.forEach (imagenComplemento => {
         this.peticionesAPI.DameImagenAvatar (imagenComplemento)
         .subscribe(response => {
           const blob = new Blob([response.blob()], { type: 'image/jpg'});
           const reader = new FileReader();
           reader.addEventListener('load', () => {
              this.c4.push (reader.result.toString());
           }, false);
           if (blob) {
             reader.readAsDataURL(blob);
           }
         });
    });

    this.familiaCargada = true;
  }

  PonDoble(img) {
    img.setAttribute ('width', this.dobleancho);
    img.setAttribute ('height', this.doblealto );
  }

  goBack() {
    if (this.criterioCambiado) {
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

  AbrirDialogoCambiarCriterio(elemento) {
    Swal.fire({
      title: 'Cambia el criterio para: <b> ' + elemento.privilegio + '</b>',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Cambiar',
    }).then((result) => {
      if (result.value) {
        elemento.criterio = result.value;
        this.criterioCambiado = true;
        Swal.fire({
          title: `Criterio cambiado`,
        });
      }
    });

  }

  ActualizarJuego() {
    console.log ('vamos a actualizar los cambios');
    this.criterioCambiado = false;
    this.juegoAvatar.CriteriosPrivilegioComplemento1 = this.criterios[0].criterio;
    this.juegoAvatar.CriteriosPrivilegioComplemento2 = this.criterios[1].criterio;
    this.juegoAvatar.CriteriosPrivilegioComplemento3 = this.criterios[2].criterio;
    this.juegoAvatar.CriteriosPrivilegioComplemento4 = this.criterios[3].criterio;
    this.juegoAvatar.CriteriosPrivilegioVoz = this.criterios[4].criterio;
    this.juegoAvatar.CriteriosPrivilegioVerTodos = this.criterios[5].criterio;
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.ModificaJuegoDeAvatar (this.juegoAvatar).subscribe ( juego => {
      Swal.fire('Criterios modificados con éxito', ' ', 'success');
      console.log (juego);
    });

  }

}

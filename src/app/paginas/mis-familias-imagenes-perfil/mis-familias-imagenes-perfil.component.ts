import { Component, OnInit } from '@angular/core';
import { PeticionesAPIService, SesionService } from '../../servicios';
import { FamiliaDeImagenesDePerfil, Profesor, FamiliaAvatares } from 'src/app/clases';
import * as URL from '../../URLs/urls';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-mis-familias-imagenes-perfil',
  templateUrl: './mis-familias-imagenes-perfil.component.html',
  styleUrls: ['./mis-familias-imagenes-perfil.component.scss']
})
export class MisFamiliasImagenesPerfilComponent implements OnInit {
  profesor: Profesor;
  familias: FamiliaDeImagenesDePerfil[];
  listaFamilias: any[] = [];
  dataSource;
  displayedColumns: string[] = ['ejemplo1', 'ejemplo2', 'ejemplo3', 'nombreFamilia', 'numeroImagenes', 'delete'];

  constructor(
                private peticionesAPI: PeticionesAPIService,
                private sesion: SesionService,
                private location: Location
  ) { }

  ngOnInit() {
    this.profesor = this.sesion.DameProfesor();
    this.peticionesAPI.DameFamiliasDeImagenesDePerfilProfesor (this.profesor.id)
    .subscribe (familias => {
      this.familias = familias;
      console.log ('ya tengo las familias de imagenes de perfil');
      console.log (familias);
      this.familias.forEach (f => {
        const ejemploImagen1 = URL.ImagenesPerfil + f.Imagenes[0];
        const ejemploImagen2 = URL.ImagenesPerfil + f.Imagenes[1];
        const ejemploImagen3 = URL.ImagenesPerfil + f.Imagenes[2];
        this.listaFamilias.push ({
          familia: f,
          ejemplo1: ejemploImagen1,
          ejemplo2: ejemploImagen2,
          ejemplo3: ejemploImagen3
        });
      });
      console.log ('ya tengo la lista');
      console.log (this.listaFamilias);
      this.dataSource = new MatTableDataSource(this.listaFamilias);
    });
  }

  BorrarFamilia(familia: FamiliaDeImagenesDePerfil) {
    this.peticionesAPI.BorrarFamiliaDeImagenesDePerfil (familia.id)
    .subscribe (() => {
      let cont = 0;
      familia.Imagenes.forEach (imagen => {
        this.peticionesAPI.BorraImagenPerfil (imagen)
        .subscribe (() => {
          cont++;
          if (cont === familia.Imagenes.length) {
            Swal.fire('OK', 'Familia de imagenes de perfil eliminada', 'success');
            this.listaFamilias = this.listaFamilias.filter (elemento => elemento.familia.id !== familia.id);
            console.log (this.listaFamilias);
            console.log (familia);
            this.dataSource = new MatTableDataSource(this.listaFamilias);
          }
        });
      });
    });
  }
  AdvertenciaBorrar(familia: FamiliaDeImagenesDePerfil) {
    Swal.fire({
      title: '¿Seguro que quieres eliminar la familia: ' + familia.NombreFamilia + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {
        this.BorrarFamilia (familia);
      }
    });

  }

  goBack() {
    this.location.back();
  }
}

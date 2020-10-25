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
  familiasPublicas:  FamiliaDeImagenesDePerfil[];
  listaFamilias: any[] = [];
  listaFamiliasPublicas: any[] = [];
  dataSource;
  dataSourcePublicas;
  propietarios: string[];
  displayedColumns: string[] = [ 'nombreFamilia', 'numeroImagenes', 'ejemplos', 'iconos'];
  displayedColumnsPublicas: string[] = [ 'nombreFamilia', 'numeroImagenes', 'ejemplos'];

  constructor(
                private peticionesAPI: PeticionesAPIService,
                private sesion: SesionService,
                private location: Location
  ) { }

  ngOnInit() {
    this.profesor = this.sesion.DameProfesor();
    this.peticionesAPI.DameFamiliasDeImagenesDePerfilProfesor (this.profesor.id)
    .subscribe (familias => {
      if (familias.length !== 0) {
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
      } else {
        this.familias = undefined;
      }
    });
    this.DameFamiliasDeImagenesDePerfilPublicas();
  }


  DameFamiliasDeImagenesDePerfilPublicas() {
    // traigo todas las familias publicas
    this.peticionesAPI.DameFamiliasDeImagenesDePerfilPublicas()
    .subscribe ( res => {
      console.log ('familias publicas');
      console.log (res);
      if (res[0] !== undefined) {
        // quito las que son del profesor
        this.familiasPublicas = res.filter (familia => familia.profesorId !== this.profesor.id);
        if (this.familiasPublicas.length === 0) {
          this.familiasPublicas = undefined;

        } else {
          this.familiasPublicas.forEach (f => {
            const ejemploImagen1 = URL.ImagenesPerfil + f.Imagenes[0];
            const ejemploImagen2 = URL.ImagenesPerfil + f.Imagenes[1];
            const ejemploImagen3 = URL.ImagenesPerfil + f.Imagenes[2];
            this.listaFamiliasPublicas.push ({
              familia: f,
              ejemplo1: ejemploImagen1,
              ejemplo2: ejemploImagen2,
              ejemplo3: ejemploImagen3
            });
          });
          this.dataSourcePublicas = new MatTableDataSource(this.listaFamiliasPublicas);
          this.propietarios = [];
          // Traigo profesores para preparar los nombres de los propietarios
          this.peticionesAPI.DameProfesores()
          .subscribe ( profesores => {
            this.familiasPublicas.forEach (familia => {
              const propietario = profesores.filter (p => p.id === familia.profesorId)[0];
              this.propietarios.push (propietario.Nombre + ' ' + propietario.Apellido);
            });
          });
        }
      }
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

  HazPublica(familia: FamiliaDeImagenesDePerfil) {
    familia.Publica = true;
    this.peticionesAPI.ModificaFamiliaDeImagenesDePerfil (familia).subscribe();
  }


  HazPrivada(familia: FamiliaDeImagenesDePerfil) {
    familia.Publica = false;
    this.peticionesAPI.ModificaFamiliaDeImagenesDePerfil (familia).subscribe();
  }

  goBack() {
    this.location.back();
  }
}

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PeticionesAPIService, SesionService } from '../../../servicios';
import { FamiliaDeImagenesDePerfil, Profesor, FamiliaAvatares } from 'src/app/clases';
import * as URL from '../../../URLs/urls';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-asignar-familia-imagenes-perfil',
  templateUrl: './asignar-familia-imagenes-perfil.component.html',
  styleUrls: ['./asignar-familia-imagenes-perfil.component.scss']
})
export class AsignarFamiliaImagenesPerfilComponent implements OnInit {
  mensaje: string;
  familias: FamiliaDeImagenesDePerfil[];
  listaFamilias: any[] = [];
  listaFamiliasMias: any[] = [];
  listaFamiliasPublicas: any[] = [];
  profesor: Profesor;
  dataSource;
  propietarios: string [];

  displayedColumns: string[] = ['select', 'ejemplo', 'nombreFamilia', 'numeroImagenes'];
  selection = new SelectionModel<any>(true, []);

  muestroPublicas = false;

  constructor(  private peticionesAPI: PeticionesAPIService,
                private sesion: SesionService,
                public dialogRef: MatDialogRef<string>,
                @Inject(MAT_DIALOG_DATA) public mensajeConfirmacion: any) {

        // El componente recibe un mensaje que le pasamos desde el componente que lo iniciamos
        if (mensajeConfirmacion) {
          this.mensaje = mensajeConfirmacion;
        }
    }

  ngOnInit() {
    this.profesor = this.sesion.DameProfesor();
    this.peticionesAPI.DameFamiliasDeImagenesDePerfilProfesor (this.profesor.id)
    .subscribe (familias => {
      this.familias = familias;
      console.log ('ya tengo las familias de imagenes de perfil');
      console.log (familias);
      this.familias.forEach (f => {
        const ejemploImagen = URL.ImagenesPerfil + f.Imagenes[0];
        this.listaFamiliasMias.push ({
          familia: f,
          ejemplo: ejemploImagen
        });
      });
      this.listaFamilias = this.listaFamiliasMias;
      this.dataSource = new MatTableDataSource(this.listaFamilias);
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
        const familiasPublicas = res.filter (familia => familia.profesorId !== this.profesor.id);
        if (familiasPublicas.length === 0) {
          this.listaFamiliasPublicas = undefined;

        } else {
          this.propietarios = [];
          // Traigo profesores para preparar los nombres de los propietarios
          this.peticionesAPI.DameProfesores()
          .subscribe ( profesores => {
            familiasPublicas.forEach (familia => {
              const propietario = profesores.filter (p => p.id === familia.profesorId)[0];
              this.propietarios.push (propietario.Nombre + ' ' + propietario.Apellido);
            });
            let i;
            for (i = 0; i < familiasPublicas.length; i++ ) {
              const ejemploImagen = URL.ImagenesPerfil + familiasPublicas[i].Imagenes[0];
              familiasPublicas[i].NombreFamilia = familiasPublicas[i].NombreFamilia + ' (' + this.propietarios[i] + ')';
              this.listaFamiliasPublicas.push ({
                familia: familiasPublicas[i],
                ejemplo: ejemploImagen,
              });
            }
          });
        }
      }
    });
  }



  Volver(): void {
    let familiaElegida: FamiliaAvatares;
    this.listaFamilias.forEach(row => {
      if (this.selection.isSelected(row)) {
        console.log ('ha elegido ');
        console.log (row);
        familiaElegida = row.familia;
      }
    });
    if (familiaElegida === undefined) {
        Swal.fire({
          title: '¿Seguro que salir?',
          text: 'No has seleccionado ninguna familia',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, estoy seguro'
        }).then((result) => {
          if (result.value) {
            this.dialogRef.close(undefined);
          }
        });
    } else {
      this.dialogRef.close(familiaElegida);
    }
  }


  MostrarPublicas() {
    this.muestroPublicas = true;
    this.listaFamilias = this.listaFamiliasMias.concat (this.listaFamiliasPublicas);
    this.dataSource = new MatTableDataSource(this.listaFamilias);
  }

  QuitarPublicas() {
    this.muestroPublicas = false;
    this.listaFamilias = this.listaFamiliasMias;
    this.dataSource = new MatTableDataSource(this.listaFamilias);
  }

}

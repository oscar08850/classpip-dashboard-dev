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
  profesor: Profesor;
  dataSource;

  displayedColumns: string[] = ['select', 'ejemplo', 'nombreFamilia', 'numeroImagenes'];
  selection = new SelectionModel<any>(true, []);


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
        this.listaFamilias.push ({
          familia: f,
          ejemplo: ejemploImagen
        });
      });
      console.log ('ya tengo la lista');
      console.log (this.listaFamilias);
      this.dataSource = new MatTableDataSource(this.listaFamilias);
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

}

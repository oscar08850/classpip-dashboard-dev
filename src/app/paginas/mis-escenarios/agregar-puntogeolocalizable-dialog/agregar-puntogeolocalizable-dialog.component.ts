import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

// Clases

// Servicios
import { PeticionesAPIService } from '../../../servicios/index';
import { PuntoGeolocalizable } from 'src/app/clases/PuntoGeolocalizable';
import { EscenarioService } from 'src/app/servicios/escenario.service';


export interface OpcionSeleccionada {
  nombre: string;
  id: string;
}

@Component({
  selector: 'app-agregar-puntogeolocalizable-dialog',
  templateUrl: './agregar-puntogeolocalizable-dialog.component.html',
  styleUrls: ['./agregar-puntogeolocalizable-dialog.component.scss']
})
export class AgregarPuntoGeolocalizableDialogComponent implements OnInit {

  idescenario: number;

  nombrePuntoGeolocalizable: string;
  latitudPuntoGeolocalizable: string;
  longitudPuntoGeolocalizable: string;
  pistafacilPuntoGeolocalizable: string;
  pistadificilPuntoGeolocalizable: string;
  puntosgeolocalizablesAgregados: PuntoGeolocalizable [] = [];
  isDisabledPuntoGeolocalizable: Boolean = true;
  fileCromo: File;

  displayedColumns: string[] = ['nombrePuntoGeolocalizable', 'latitudPuntoGeolocalizable', 'longitudPuntoGeolocalizable', 'pistafacilPuntoGeolocalizable', 'pistadificilPuntoGeolocalizable', ' '];


  constructor(  private escenarioService: EscenarioService,
                private formBuilder: FormBuilder,
                public dialogRef: MatDialogRef<AgregarPuntoGeolocalizableDialogComponent>,
                private peticionesAPI: PeticionesAPIService,
                @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.idescenario = this.data.idescenario;
  }

  AgregarPuntoGeolocalizableEscenario() {

    this.peticionesAPI.PonPuntoGeolocalizableEscenario(new PuntoGeolocalizable(this.nombrePuntoGeolocalizable, this.latitudPuntoGeolocalizable, this.longitudPuntoGeolocalizable , this.pistafacilPuntoGeolocalizable, this.pistadificilPuntoGeolocalizable), this.idescenario)
    .subscribe((res) => {
      if (res != null) {
        this.puntosgeolocalizablesAgregados.push(res);
        this.puntosgeolocalizablesAgregados = this.puntosgeolocalizablesAgregados.filter(puntogeolocalizable => puntogeolocalizable.Nombre !== '');
        this.LimpiarCampos();
      } else {
        console.log('fallo en la asignación');
      }
    });
  }


  BorrarPuntoGeolocalizable(puntogeolocalizable: PuntoGeolocalizable) {
    this.peticionesAPI.BorrarPuntoGeolocalizable(puntogeolocalizable.id, this.idescenario)
    .subscribe(() => {
      this.puntosgeolocalizablesAgregados = this.puntosgeolocalizablesAgregados.filter(res => res.id !== puntogeolocalizable.id);
      console.log('PuntoGeolocalizable borrado correctamente');

    });
  }


   ActivarInputPuntoGeolocalizable() {
    console.log('Activar input');
    document.getElementById('inputPuntoGeolocalizable').click();
  }

  LimpiarCampos() {
      this.nombrePuntoGeolocalizable = '';
      this.latitudPuntoGeolocalizable = '';
      this.longitudPuntoGeolocalizable = '';
      this.pistafacilPuntoGeolocalizable='';
      this.pistadificilPuntoGeolocalizable='';
      this.isDisabledPuntoGeolocalizable = true;

  }

  Disabled() {

  if (this.nombrePuntoGeolocalizable === '' || this.latitudPuntoGeolocalizable === '' || this.longitudPuntoGeolocalizable === '' || this.pistafacilPuntoGeolocalizable === '' ||
        this.pistadificilPuntoGeolocalizable === '') {
        this.isDisabledPuntoGeolocalizable = true;
  } else {
        this.isDisabledPuntoGeolocalizable = false;
    }
  }

  Cerrar() {
    this.dialogRef.close(this.puntosgeolocalizablesAgregados);
  }
}

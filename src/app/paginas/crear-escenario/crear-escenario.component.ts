import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Imports para abrir diálogo confirmar eliminar equipo
import { MatDialog, MatTabGroup } from '@angular/material';

// Servicios



// Servicios
import { SesionService, PeticionesAPIService } from '../../servicios/index';

// Clases
import { Location } from '@angular/common';
import { of } from 'rxjs';
import 'rxjs';

import { DialogoConfirmacionComponent } from '../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { Observable} from 'rxjs';
import { Escenario } from 'src/app/clases/Escenario';
import { PuntoGeolocalizable } from 'src/app/clases/PuntoGeolocalizable';



export interface OpcionSeleccionada {
  nombre: string;
  id: string;
}

@Component({
  selector: 'app-crear-escenario',
  templateUrl: './crear-escenario.component.html',
  styleUrls: ['./crear-escenario.component.scss']
})
export class CrearEscenarioComponent implements OnInit {

  // Para el paso finalizar limpiar las variables y volver al mat-tab de "Lista de equipos"
  @ViewChild('stepper') stepper;
  @ViewChild('tabs') tabGroup: MatTabGroup;
  myForm: FormGroup;
  myForm2: FormGroup;


  // CREAR COLECCION
  mapaEscenario: string;
  escenarioCreado: Escenario;
  descripcionEscenario: string;

  // CREAR CROMO
  nombrePuntoGeolocalizable: string;
  latitudPuntoGeolocalizable: string;
  longitudPuntoGeolocalizable: string;
  pistafacilPuntoGeolocalizable: string;
  pistadificilPuntoGeolocalizable: string;
  puntosgeolocalizablesAgregados: PuntoGeolocalizable [] = [];
  // tslint:disable-next-line:ban-types
  isDisabledPuntoGeolocalizable: Boolean = true;

  // COMPARTIDO
  profesorId: number;


  // Al principio coleccion no creada y imagen no cargada
  // tslint:disable-next-line:ban-types
  escenarioYaCreado: Boolean = false;
  // tslint:disable-next-line:ban-types
  // tslint:disable-next-line:ban-types

  // tslint:disable-next-line:ban-types
  finalizar: Boolean = false;


  // PONEMOS LAS COLUMNAS DE LA TABLA Y LA LISTA QUE TENDRÁ LA INFORMACIÓN QUE QUEREMOS MOSTRAR
  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['nombrePuntoGeolocalizable', 'latitudPuntoGeolocalizable', 'longitudPuntoGeolocalizable', 'pistafacilPuntoGeolocalizable','pistadificilPuntoGeolocalizable', ' '];



  constructor(
    private router: Router,
    public dialog: MatDialog,
    public sesion: SesionService,
    public peticionesAPI: PeticionesAPIService,
    public location: Location,
    private formBuilder: FormBuilder) { }

  ngOnInit() {

    console.log(this.sesion.DameProfesor());
    // REALMENTE LA APP FUNCIONARÁ COGIENDO AL PROFESOR DEL SERVICIO, NO OBSTANTE AHORA LO RECOGEMOS DE LA URL
    // this.profesorId = this.profesorService.RecibirProfesorIdDelServicio();
    this.profesorId = this.sesion.DameProfesor().id;


    // Constructor myForm
    this.myForm = this.formBuilder.group({
     descripcionEscenario: ['', Validators.required],
     mapaEscenario: ['', Validators.required]
    });
    this.myForm2 = this.formBuilder.group({
      nombrePuntoGeolocalizable : ['', Validators.required],
      latitudPuntoGeolocalizable : ['', Validators.required],
      longitudPuntoGeolocalizable : ['', Validators.required],
      pistafacilPuntoGeolocalizable : ['', Validators.required],
      pistadificilPuntoGeolocalizable : ['', Validators.required]
     });

    }

  CrearEscenario() {

    let descripcionEscenario: string;
    let mapaEscenario: string;

    descripcionEscenario = this.myForm.value.descripcionEscenario;
    mapaEscenario = this.myForm.value.mapaEscenario;

    this.peticionesAPI.CreaEscenario (new Escenario(mapaEscenario, descripcionEscenario), this.profesorId)
    .subscribe((res) => {
      if (res != null) {
        console.log ('ESCENARIO CREADO: ' + res.id );
        console.log(res);
        this.escenarioYaCreado = true;
        this.escenarioCreado = res;


      } else {
        console.log('Fallo en la creación');
      }
    });
  }

  EditarEscenario() {

    console.log('Entro a editar');
    let descripcionEscenario: string;
    let mapaEscenario: string;

    descripcionEscenario = this.myForm.value.descripcionEscenario;
    mapaEscenario = this.myForm.value.mapaEscenario;

    this.peticionesAPI.ModificaEscenario(new Escenario(this.mapaEscenario, descripcionEscenario), this.profesorId, this.escenarioCreado.id)
    .subscribe((res) => {
      if (res != null) {
        console.log('Voy a editar el escenario con id ' + this.escenarioCreado.id);
        this.escenarioCreado = res;

      } else {
        console.log('fallo editando');
      }
    });
  }


  AgregarPuntoGeolocalizableEscenario() {

    let nombrePuntoGeolocalizable: string;
    let latitudPuntoGeolocalizable: string;
    let longitudPuntoGeolocalizable: string;
    let pistafacilPuntoGeolocalizable: string;
    let pistadificilPuntoGeolocalizable: string;

    nombrePuntoGeolocalizable = this.myForm2.value.nombrePuntoGeolocalizable;
    latitudPuntoGeolocalizable = this.myForm2.value.latitudPuntoGeolocalizable;
    longitudPuntoGeolocalizable = this.myForm2.value.longitudPuntoGeolocalizable;
    pistafacilPuntoGeolocalizable = this.myForm2.value.pistafacilPuntoGeolocalizable;
    pistadificilPuntoGeolocalizable = this.myForm2.value.pistadificilPuntoGeolocalizable;



    this.peticionesAPI.PonPuntoGeolocalizableEscenario(
      new PuntoGeolocalizable(this.nombrePuntoGeolocalizable, this.latitudPuntoGeolocalizable, this.longitudPuntoGeolocalizable , this.pistafacilPuntoGeolocalizable, this.pistadificilPuntoGeolocalizable), this.escenarioCreado.id)
    .subscribe((res) => {
      if (res != null) {
        console.log('asignado correctamente');
        this.puntosgeolocalizablesAgregados.push(res);
        this.puntosgeolocalizablesAgregados = this.puntosgeolocalizablesAgregados.filter(result => result.Latitud !== '');
        this.LimpiarCampos();
      } else {
        console.log('fallo en la asignación');
      }
    });
  }

  BorrarPuntoGeolocalizable(puntogeolocalizable: PuntoGeolocalizable) {
    this.peticionesAPI.BorrarPuntoGeolocalizable(puntogeolocalizable.id, this.escenarioCreado.id)
    .subscribe(() => {
      this.puntosgeolocalizablesAgregados = this.puntosgeolocalizablesAgregados.filter(res => res.id !== puntogeolocalizable.id);
      console.log('PuntoGeolocalizable borrado correctamente');

    });
  }
  LimpiarCampos() {
      this.nombrePuntoGeolocalizable = '';
      this.latitudPuntoGeolocalizable = '';
      this.longitudPuntoGeolocalizable = '';
      this.pistafacilPuntoGeolocalizable = '';
      this.pistadificilPuntoGeolocalizable = '';
  }

  Disabled() {

  if (this.nombrePuntoGeolocalizable === '' || this.latitudPuntoGeolocalizable === '' || this.longitudPuntoGeolocalizable === '' || this.pistafacilPuntoGeolocalizable === '' ||
        this.pistadificilPuntoGeolocalizable === '') {
        this.isDisabledPuntoGeolocalizable = true;
  } else {
        this.isDisabledPuntoGeolocalizable = false;
    }
  }

  Finalizar() {
      this.myForm.reset();
      this.myForm2.reset();
      this.stepper.reset();

      this.escenarioYaCreado = false;
      this.mapaEscenario = '';
      this.descripcionEscenario = '';
      this.finalizar = true;
      this.router.navigate(['/inicio/' + this.profesorId]);


  }

  canExit(): Observable <boolean> {
    if (!this.escenarioYaCreado || this.finalizar) {
      return of (true);
    } else {
      const confirmacionObservable = new Observable <boolean>( obs => {
          const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
            height: '150px',
            data: {
              mensaje: 'Confirma que quieres abandonar el proceso de creación del escenario',
            }
          });

          dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
              this.BorrarEscenario (this.escenarioCreado).subscribe ( () => obs.next (confirmed));
            } else {
              obs.next (confirmed);
            }
          });
      });
      return confirmacionObservable;
    }
  }

  BorrarEscenario(escenario: Escenario): any {
    const eliminaObservable = new Observable ( obs => {


        this.peticionesAPI.BorraEscenario(escenario.id, escenario.profesorId)
        .subscribe( () => { console.log ('Ya he borrado el escenario');
                            obs.next();
        });
    });
    return eliminaObservable;
  }
}

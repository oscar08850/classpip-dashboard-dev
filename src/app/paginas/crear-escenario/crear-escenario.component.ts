import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Imports para abrir diálogo confirmar eliminar equipo
import { MatDialog, MatTabGroup } from '@angular/material';

// Servicios
import { ProfesorService } from '../../servicios/index';


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
import { EscenarioService } from 'src/app/servicios/escenario.service';


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
  latitudPuntoGeolocalizable: string;
  longitudPuntoGeolocalizable: string;
  pistafacilPuntoGeolocalizable: string;
  pistadificilPuntoGeolocalizable: string;
  puntosgeolocalizablesAgregados: PuntoGeolocalizable [] = [];
  // tslint:disable-next-line:ban-types
  isDisabledPuntoGeolocalizable: Boolean = true;

  // COMPARTIDO
  profesorId: number;
  nombreImagen: string;


  // Al principio coleccion no creada y imagen no cargada
  // tslint:disable-next-line:ban-types
  escenarioYaCreado: Boolean = false;
  // tslint:disable-next-line:ban-types
  // tslint:disable-next-line:ban-types

  // tslint:disable-next-line:ban-types
  finalizar: Boolean = false;


  // PONEMOS LAS COLUMNAS DE LA TABLA Y LA LISTA QUE TENDRÁ LA INFORMACIÓN QUE QUEREMOS MOSTRAR
  displayedColumns: string[] = ['latitudPuntoGeolocalizable', 'longitudPuntoGeolocalizable', 'pistafacilPuntoGeolocalizable','pistadificilPuntoGeolocalizable', ' '];



  constructor(
    private escenarioService: EscenarioService,
    private router: Router,
    public dialog: MatDialog,
    public sesion: SesionService,
    public peticionesAPI: PeticionesAPIService,
    public location: Location,
    private formBuilder: FormBuilder) { }

  ngOnInit() {

    console.log('vamos a empezar');
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
      latitudPuntoGeolocalizable : ['', Validators.required],
      longitudPuntoGeolocalizable : ['', Validators.required],
      pistafacilPuntoGeolocalizable : ['', Validators.required],
      pistadificilPuntoGeolocalizable : ['', Validators.required]
     });

    }


  // Creamos una coleccion dandole un nombre y una imagen
  CrearEscenario() {

    let descripcionEscenario: string;
    let mapaEscenario: string;

    descripcionEscenario = this.myForm.value.descripcionEscenario;
    mapaEscenario = this.myForm.value.mapaEscenario;

    // Hace el POST del equipo
    this.peticionesAPI.CreaEscenario (new Escenario(mapaEscenario, descripcionEscenario), this.profesorId)
    // this.peticionesAPI.CreaColeccion(new Coleccion(nombreColeccion, this.nombreImagen), this.profesorId)
    .subscribe((res) => {
      if (res != null) {
        console.log ('ESCENARIO CREADO: ' + res.id );
        console.log(res);
        this.escenarioYaCreado = true; // Si tiro atrás y cambio algo se hará un PUT y no otro POST
        this.escenarioCreado = res; // Lo metemos en coleccionCreada, y no en coleccion!!
        // Hago el POST de la imagen SOLO si hay algo cargado. Ese boolean se cambiará en la función ExaminarImagen

      } else {
        console.log('Fallo en la creación');
      }
    });
  }

  // Si estamos creando la coleccion y pasamos al siguiente paso, pero volvemos hacia atrás para modificar el nombre y/o el
  // imagen, entonces no deberemos hacer un POST al darle a siguiente, sino un PUT. Por eso se hace esta función, que funciona
  // de igual manera que la de Crear Equipo pero haciendo un PUT.
  EditarEscenario() {

    console.log('Entro a editar');
    let descripcionEscenario: string;
    let mapaEscenario: string;

    descripcionEscenario = this.myForm.value.descripcionEscenario;
    mapaEscenario = this.myForm.value.mapaEscenario;

    this.peticionesAPI.ModificaEscenario(new Escenario(this.mapaEscenario, descripcionEscenario), this.profesorId, this.escenarioCreado.id)
    .subscribe((res) => {
      if (res != null) {
        console.log('Voy a editar la coleccion con id ' + this.escenarioCreado.id);
        this.escenarioCreado = res;

      } else {
        console.log('fallo editando');
      }
    });
  }





  // Creamos una cromo y lo añadimos a la coleccion dandole un nombre, una probabilidad, un nivel y una imagen
  AgregarPuntoGeolocalizableEscenario() {

    let latitudPuntoGeolocalizable: string;
    let longitudPuntoGeolocalizable: string;
    let pistafacilPuntoGeolocalizable: string;
    let pistadificilPuntoGeolocalizable: string;
    
    latitudPuntoGeolocalizable = this.myForm2.value.latitudPuntoGeolocalizable;
    longitudPuntoGeolocalizable = this.myForm2.value.longitudPuntoGeolocalizable;
    pistafacilPuntoGeolocalizable = this.myForm2.value.pistafacilPuntoGeolocalizable;
    pistadificilPuntoGeolocalizable = this.myForm2.value.pistadificilPuntoGeolocalizable;



    this.peticionesAPI.PonPuntoGeolocalizableEscenario(
      new PuntoGeolocalizable(this.latitudPuntoGeolocalizable, this.longitudPuntoGeolocalizable , this.pistafacilPuntoGeolocalizable, this.pistadificilPuntoGeolocalizable), this.escenarioCreado.id)
    .subscribe((res) => {
      if (res != null) {
        console.log('asignado correctamente');
        // Añadimos el cromo a la lista
        this.puntosgeolocalizablesAgregados.push(res);
        this.puntosgeolocalizablesAgregados = this.puntosgeolocalizablesAgregados.filter(result => result.Latitud !== '');
        // this.CromosAgregados(res);
        this.LimpiarCampos();
      } else {
        console.log('fallo en la asignación');
      }
    });
  }


  // Utilizamos esta función para eliminar un cromo de la base de datos y de la lista de añadidos recientemente
  BorrarPuntoGeolocalizable(puntogeolocalizable: PuntoGeolocalizable) {
    this.peticionesAPI.BorrarPuntoGeolocalizable(puntogeolocalizable.id, this.escenarioCreado.id)
    .subscribe(() => {
      // Elimino el cromo de la lista
      this.puntosgeolocalizablesAgregados = this.puntosgeolocalizablesAgregados.filter(res => res.id !== puntogeolocalizable.id);
     // this.CromosEliminados(cromo);
      console.log('Cromo borrado correctamente');

    });
  }
  // Limpiamos los campos del cromo
  LimpiarCampos() {
      this.latitudPuntoGeolocalizable = '';
      this.longitudPuntoGeolocalizable = '';
      this.pistafacilPuntoGeolocalizable = '';
      this.pistadificilPuntoGeolocalizable = '';
  }

  // Esta función se utiliza para controlar si el botón de siguiente del stepper esta desativado.
  // Si en alguno de los inputs no hay nada, esta disabled. Sino, podremos clicar.
  Disabled() {

  if (this.latitudPuntoGeolocalizable === '' || this.longitudPuntoGeolocalizable === '' || this.pistafacilPuntoGeolocalizable === '' ||
        this.pistadificilPuntoGeolocalizable === '') {
        this.isDisabledPuntoGeolocalizable = true;
  } else {
        this.isDisabledPuntoGeolocalizable = false;
    }
  }
    // Función que se activará al clicar en finalizar el último paso del stepper
  Finalizar() {
      // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
      this.myForm.reset();
      this.myForm2.reset();
      this.stepper.reset();

      // Tambien limpiamos las variables utilizadas para crear el nueva coleccion, por si queremos crear otra.
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
              mensaje: 'Confirma que quieres abandonar el proceso de creación de coleccion',
            }
          });

          dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
              // Si confirma que quiere salir entonces eliminamos el grupo que se ha creado
              // this.sesion.TomaGrupo (this.grupo);
              // this.calculos.EliminarGrupo();
              this.BorrarEscenario (this.escenarioCreado).subscribe ( () => obs.next (confirmed));
            } else {
              obs.next (confirmed);
            }
          });
      });
      return confirmacionObservable;
    }
  }

  // Utilizamos esta función para eliminar una colección de la base de datos y actualiza la lista de colecciones
  // Retornamos un observable para que el que la llame espere hasta que se haya completado la eliminación
  // en la base de datos.
  BorrarEscenario(escenario: Escenario): any {
    const eliminaObservable = new Observable ( obs => {


        this.peticionesAPI.BorraEscenario(escenario.id, escenario.profesorId)
        .subscribe( () => { console.log ('Ya he borrado la coleccion'); 
                            obs.next();
        });
    });
        //this.coleccionesProfesor = this.coleccionesProfesor.filter(res => res.id !== coleccion.id);
    return eliminaObservable;
  }
}

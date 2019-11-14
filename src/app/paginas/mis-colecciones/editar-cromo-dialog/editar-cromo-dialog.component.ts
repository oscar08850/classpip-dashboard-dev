import { MatDialog } from '@angular/material';
import { ResponseContentType, Http, Response } from '@angular/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

// Clases
import { Cromo, Coleccion } from '../../../clases/index';

// Servicios
import { ColeccionService } from '../../../servicios/index';

// Servicios
import { SesionService, PeticionesAPIService } from '../../../servicios/index';

export interface OpcionSeleccionada {
  nombre: string;
  id: string;
}

@Component({
  selector: 'app-editar-cromo-dialog',
  templateUrl: './editar-cromo-dialog.component.html',
  styleUrls: ['./editar-cromo-dialog.component.scss']
})
export class EditarCromoDialogComponent implements OnInit {

  cromo: Cromo;
  coleccion: Coleccion;
  cromosColeccion: Cromo[];
  cromosEditados: Cromo [] = [];
  cromosAMostrar: Cromo[];


  nombreCromo: string;
  nivelCromo: string;
  probabilidadCromo: string;


  // imagen cromo
  imagenCromo: string;
  nombreImagenCromo: string;
  fileCromo: File;

  // tslint:disable-next-line:ban-types
  imagenCargadoCromo: Boolean = false;

    // Opciones para mostrar en la lista desplegable para seleccionar el tipo de juego que listar
    opcionesProbabilidad: OpcionSeleccionada[] = [
      {nombre: 'Muy Baja', id: 'Muy Baja'},
      {nombre: 'Baja', id: 'Baja'},
      {nombre: 'Media', id: 'Media'},
      {nombre: 'Alta', id: 'Alta'},
      {nombre: 'Muy Alta', id: 'Muy Alta'},

    ];

    opcionSeleccionadaProbabilidad: string;

      // Opciones para mostrar en la lista desplegable para seleccionar el tipo de juego que listar
    opcionesNivel: OpcionSeleccionada[] = [
        {nombre: 'Diamante', id: 'Diamante'},
        {nombre: 'Platino', id: 'Platino'},
        {nombre: 'Oro', id: 'Oro'},
        {nombre: 'Plata', id: 'Plata'},
        {nombre: 'Bronce', id: 'Bronce'},
    ];
    opcionSeleccionadaNivel: string;
  constructor(
              private coleccionService: ColeccionService,
              public dialog: MatDialog,
              // private location: Location,
              private sesion: SesionService,
              private peticionesAPI: PeticionesAPIService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<EditarCromoDialogComponent>,
              private http: Http,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.cromo = this.data.cr;
    this.nombreCromo = this.cromo.Nombre;
    this.nivelCromo = this.cromo.Nivel;
    this.probabilidadCromo = this.cromo.Probabilidad;
    this.cromosColeccion = this.sesion.DameCromos();

    this.opcionSeleccionadaNivel = this.cromo.Nivel;
    // this.opcionSeleccionadaProbabilidad = this.cromo.Probabilidad;
    console.log(this.cromo);
    // Cargo el imagen del cromo
    this.TraeImagenCromo();
  }

  EditarCromo() {
    console.log('Entro a editar');
    console.log(this.probabilidadCromo);
    const ImagenAntigua = this.data.cr.Imagen;
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.ModificaCromoColeccion(new Cromo(this.nombreCromo, this.nombreImagenCromo, this.probabilidadCromo, this.nivelCromo), this.cromo.coleccionId, this.cromo.id)
    .subscribe((res) => {
      if (res != null) {
        this.cromo = res;
        this.cromosEditados.push (res);
        console.log('nombre del cromo + nivel' + this.cromosEditados[0].Nombre + this.cromosEditados[0].Nivel);
        if (this.imagenCargadoCromo === true) {
          // HACEMOS EL POST DE LA NUEVA IMAGEN EN LA BASE DE DATOS
          const formData: FormData = new FormData();
          formData.append(this.nombreImagenCromo, this.fileCromo);
          this.peticionesAPI.PonImagenCromo(formData)
          .subscribe(() => console.log('Imagen cargado'));
        }
        console.log(this.nombreImagenCromo);
        console.log(ImagenAntigua);
        if (this.nombreImagenCromo !== ImagenAntigua) {
          this.peticionesAPI.BorrarImagenCromo(ImagenAntigua).subscribe(() => {

          });
        }
      } else {
        console.log('fallo editando');
      }
    });
    // this.dialogRef.close(this.cromosEditados);
 }

  TraeImagenCromo() {

    if (this.cromo.Imagen !== undefined ) {
        // Busca en la base de datos la imágen con el nombre registrado en cromo.Imagen y la recupera
        this.http.get('http://localhost:3000/api/imagenes/ImagenCromo/download/' + this.cromo.Imagen,
        { responseType: ResponseContentType.Blob })
        .subscribe(response => {
          const blob = new Blob([response.blob()], { type: 'image/jpg'});

          const reader = new FileReader();
          reader.addEventListener('load', () => {
            this.imagenCromo = reader.result.toString();
          }, false);

          if (blob) {
            reader.readAsDataURL(blob);
          }
      });
    }
  }
    // AL CLICAR EN AGREGAR LOGO NOS ACTIVARÁ LA FUNCIÓN MOSTRAR DE ABAJO
  ActivarInputCromo() {
      console.log('Activar input 2');
      document.getElementById('inputCromo').click();
  }
    // Buscaremos la imagen en nuestro ordenador y después se mostrará en el form con la variable "imagen" y guarda el
    // nombre de la foto en la variable nombreImagen
  ExaminarImagenCromo($event) {
    this.fileCromo = $event.target.files[0];
    console.log('fichero ' + this.fileCromo.name);
    this.nombreImagenCromo = this.fileCromo.name;
    const reader = new FileReader();
    reader.readAsDataURL(this.fileCromo);
    reader.onload = () => {
      console.log('ya Cromo');
      this.imagenCargadoCromo = true;
      this.imagenCromo = reader.result.toString();
      };
  }

  OpcionNivelSeleccionado() {
    console.log('AAAA' + this.opcionSeleccionadaNivel);
    // Opcion selecionada para nivel
    if (this.opcionSeleccionadaNivel === 'Diamante') {
      this.nivelCromo = 'Diamante';
      this.probabilidadCromo = 'Muy Baja';
     // this.opcionSeleccionadaProbabilidad = 'Muy Baja';

    }
    if (this.opcionSeleccionadaNivel === 'Platino') {
      this.nivelCromo = 'Platino';
      this.probabilidadCromo = 'Baja';
      // this.opcionSeleccionadaProbabilidad = 'Baja';
    }

    if (this.opcionSeleccionadaNivel === 'Oro') {
      this.nivelCromo = 'Oro';
      this.probabilidadCromo = 'Media';
      // this.opcionSeleccionadaProbabilidad = 'Media';
    }

    if (this.opcionSeleccionadaNivel === 'Plata') {
      this.nivelCromo = 'Plata';
      this.probabilidadCromo = 'Alta';
      // this.opcionSeleccionadaProbabilidad = 'Alta';
    }

    if (this.opcionSeleccionadaNivel === 'Bronce') {
      this.nivelCromo = 'Bronce';
      this.probabilidadCromo = 'Muy Alta';
      // this.opcionSeleccionadaProbabilidad = 'Muy Alta';
    }
  }

   Cerrar() {
     this.dialogRef.close(this.cromosEditados);
   }



}

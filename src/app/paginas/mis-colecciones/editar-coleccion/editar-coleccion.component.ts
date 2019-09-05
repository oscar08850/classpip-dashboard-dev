import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ResponseContentType, Http, Response } from '@angular/http';
import { AgregarCromoDialogComponent } from '../agregar-cromo-dialog/agregar-cromo-dialog.component';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';

// Clases
import { Cromo, Coleccion } from '../../../clases/index';

// Servicios
import { ColeccionService } from '../../../servicios/index';

@Component({
  selector: 'app-editar-coleccion',
  templateUrl: './editar-coleccion.component.html',
  styleUrls: ['./editar-coleccion.component.scss']
})
export class EditarColeccionComponent implements OnInit {

  coleccion: Coleccion;
  cromosColeccion: Cromo[];

  cromo: Cromo;
  imagenCromo: string;
  imagenCromoArray: string[] = [];

  nombreColeccion: string;
  // imagen coleccion
  imagenColeccion: string;
  nombreImagenColeccion: string;
  file: File;

  // tslint:disable-next-line:ban-types
  imagenCambiada: Boolean = false;

  // PARA DIÁLOGO DE CONFIRMACIÓN
  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres eliminar el equipo llamado: ';

  constructor(
              private coleccionService: ColeccionService,
              public dialog: MatDialog,
              private location: Location,
              private http: Http,
              public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.coleccion = this.coleccionService.RecibirColeccionDelServicio();
    this.nombreColeccion = this.coleccion.Nombre;

    this.CromosEImagenDeLaColeccion(this.coleccion);
    // Cargo el imagen de la coleccion
    this.GET_Imagen();
  }

  // Se hace un PUT de la coleccion seleccionada para editar
  EditarColeccion() {
    console.log('Entro a editar');

    // tslint:disable-next-line:max-line-length
    this.coleccionService.PUT_Coleccion(new Coleccion(this.nombreColeccion, this.nombreImagenColeccion), this.coleccion.profesorId, this.coleccion.id)
    .subscribe((res) => {
      if (res != null) {
        console.log('Voy a editar la coleccion con id ' + this.coleccion.id);
        this.coleccion = res;

        if (this.imagenCambiada === true) {
          // HACEMOS EL POST DE LA NUEVA IMAGEN EN LA BASE DE DATOS
          const formData: FormData = new FormData();
          formData.append(this.nombreImagenColeccion, this.file);
          this.coleccionService.POST_ImagenColeccion(formData)
          .subscribe(() => console.log('Imagen cargada'));
        }

      } else {
        console.log('fallo editando');
      }
    });
    this.goBack();
  }


    // Busca la imagen que tiene el nombre del coleccion.ImagenColeccion y lo carga en imagenColeccion
    GET_Imagen() {

      if (this.coleccion.ImagenColeccion !== undefined ) {
        // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
        this.http.get('http://localhost:3000/api/imagenes/ImagenColeccion/download/' + this.coleccion.ImagenColeccion,
        { responseType: ResponseContentType.Blob })
        .subscribe(response => {
          const blob = new Blob([response.blob()], { type: 'image/jpg'});

          const reader = new FileReader();
          reader.addEventListener('load', () => {
            this.imagenColeccion = reader.result.toString();
          }, false);

          if (blob) {
            reader.readAsDataURL(blob);
          }
      });

      }
    }

  // Busca la imagen que tiene el nombre del cromo.Imagen y lo carga en imagenCromo
  GET_ImagenCromo() {

      // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.cromosColeccion.length; i++) {

      this.cromo = this.cromosColeccion[i];

      if (this.cromo.Imagen !== undefined ) {
        // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
        this.http.get('http://localhost:3000/api/imagenes/ImagenCromo/download/' + this.cromo.Imagen,
        { responseType: ResponseContentType.Blob })
        .subscribe(response => {
          const blob = new Blob([response.blob()], { type: 'image/jpg'});

          const reader = new FileReader();
          reader.addEventListener('load', () => {
            this.imagenCromoArray[i] = reader.result.toString();
          }, false);

          if (blob) {
            reader.readAsDataURL(blob);
          }
      });
      }
    }
  }

  // Ordena los cromos por nombre. Asi si tengo algun cromo repetido, salen juntos
  OrdenarCromos() {
    this.cromosColeccion.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
  }

      // AL CLICAR EN AGREGAR LOGO NOS ACTIVARÁ LA FUNCIÓN MOSTRAR DE ABAJO
  ActivarInput() {
    console.log('Activar input');
    document.getElementById('input').click();
  }


   // Seleccionamos una foto y guarda el nombre de la foto en la variable logo
  Mostrar($event) {
    this.file = $event.target.files[0];

    console.log('fichero ' + this.file.name);
    this.nombreImagenColeccion = this.file.name;

    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      console.log('ya');
      this.imagenCambiada = true;
      this.imagenColeccion = reader.result.toString();
    };
  }

  // SI QUEREMOS AÑADIR CROMOS MANUALMENTE LO HAREMOS EN UN DIALOGO
  AbrirDialogoAgregarCromoColeccion(): void {
    const dialogRef = this.dialog.open(AgregarCromoDialogComponent, {
      width: '900px',
      maxHeight: '600px',
      // Le pasamos solo los id del grupo y profesor ya que es lo único que hace falta para vincular los alumnos
      data: {
        coleccionId: this.coleccion.id,
      }
    });

     // RECUPERAREMOS LA NUEVA LISTA DE LOS CROMO Y VOLVEREMOS A BUSCAR LOS CROMOS QUE TIENE LA COLECCION
    dialogRef.afterClosed().subscribe(cromo => {

    this.CromosEImagenDeLaColeccion(this.coleccion);

     });
  }

  // Una vez seleccionado un cromo, lo podemos editar o eliminar. Esta función se activará si clicamos en editar.
  // Envía el cromo específico al componente editar-cromo
  EnviarCromoEditar(cromo: Cromo) {
    console.log('voy a enviar');
    this.coleccionService.EnviarCromoAlServicio(cromo);


  }

  // Si queremos borrar un cromo, antes nos saldrá un aviso para confirmar la acción como medida de seguridad. Esto se
  // hará mediante un diálogo al cual pasaremos el mensaje y el nombre del equipo
  AbrirDialogoConfirmacionBorrarCromo(cromo: Cromo): void {

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        nombre: cromo.Nombre,
      }
    });

    // Antes de cerrar recogeremos el resultado del diálogo: Borrar (true) o cancelar (false). Si confirmamos, borraremos
    // el punto (función BorrarPunto) y mostraremos un snackBar con el mensaje de que se ha eliminado correctamente.
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.BorrarCromo(cromo);
        this.snackBar.open(cromo.Nombre + ' eliminado correctamente', 'Cerrar', {
          duration: 2000,
        });

      }
    });
  }

  // Utilizamos esta función para eliminar un cromo de la base de datos y actualiza la lista de cromos
  BorrarCromo(cromo: Cromo) {
    this.coleccionService.DELETE_Cromo(cromo.id, this.coleccion.id)
    .subscribe(() => {
      this.CromosEImagenDeLaColeccion(this.coleccion);

    });
  }

  // Borramos el punto de la lista de puntos agregados
  // CromosEliminados(cromo: Cromo) {
  //   this.cromosColeccion = this.cromosColeccion.filter(res => res.id !== cromo.id);
  //   return this.cromosColeccion;


  // }

  // Le pasamos la coleccion y buscamos la imagen que tiene y sus cromos
 CromosEImagenDeLaColeccion(coleccion: Coleccion) {

  console.log('entro a buscar cromos y foto');
  console.log(coleccion.ImagenColeccion);
  // Si la coleccion tiene una foto (recordemos que la foto no es obligatoria)
  if (coleccion.ImagenColeccion !== undefined) {

    // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
    this.http.get('http://localhost:3000/api/imagenes/ImagenColeccion/download/' + coleccion.ImagenColeccion,
    { responseType: ResponseContentType.Blob })
    .subscribe(response => {
      const blob = new Blob([response.blob()], { type: 'image/jpg'});

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.imagenColeccion = reader.result.toString();
      }, false);

      if (blob) {
        reader.readAsDataURL(blob);
      }
    });

    // Sino la imagenColeccion será undefined para que no nos pinte la foto de otro equipo préviamente seleccionado
  } else {
    this.imagenColeccion = undefined;
  }


  // Una vez tenemos el logo del equipo seleccionado, buscamos sus alumnos
  console.log('voy a mostrar los cromos de la coleccion ' + coleccion.id);

  // Busca los cromos dela coleccion en la base de datos
  this.coleccionService.GET_CromosColeccion(coleccion.id)
  .subscribe(res => {
    if (res[0] !== undefined) {
      this.cromosColeccion = res;
      this.OrdenarCromos();
      this.GET_ImagenCromo();
      console.log(res);
    } else {
      console.log('No hay cromos en esta coleccion');
      this.cromosColeccion = undefined;
    }
  });
}
  goBack() {
    this.location.back();
  }

}

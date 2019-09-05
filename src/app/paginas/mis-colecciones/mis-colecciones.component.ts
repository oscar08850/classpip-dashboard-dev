import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResponseContentType, Http, Response } from '@angular/http';


// Imports para abrir diálogo confirmar eliminar equipo
import { MatDialog, MatSnackBar, MatTabGroup } from '@angular/material';
import { DialogoConfirmacionComponent } from '../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';

// Servicios
import { ColeccionService, ProfesorService } from '../../servicios/index';

// Clases
import { Coleccion, Cromo } from '../../clases/index';

@Component({
  selector: 'app-mis-colecciones',
  templateUrl: './mis-colecciones.component.html',
  styleUrls: ['./mis-colecciones.component.scss']
})
export class MisColeccionesComponent implements OnInit {

  profesorId: number;


  coleccionesProfesor: Coleccion[];
  cromosColeccion: Cromo[];
  imagenColeccion: string;

  numeroDeCromos: number;

  // PARA DIÁLOGO DE CONFIRMACIÓN
  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres eliminar el equipo llamado: ';

  constructor(
    private coleccionService: ColeccionService,
    private profesorService: ProfesorService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private http: Http
  ) { }

  ngOnInit() {

    // REALMENTE LA APP FUNCIONARÁ COGIENDO AL PROFESOR DEL SERVICIO, NO OBSTANTE AHORA LO RECOGEMOS DE LA URL
    // this.profesorId = this.profesorService.RecibirProfesorIdDelServicio();
    this.profesorId = Number (this.route.snapshot.paramMap.get('id'));

    console.log(this.profesorId);

    this.ColeccionesDelProfesor();
    console.log(this.coleccionesProfesor);


  }

  // Obtenemos todas las colecciones del profesor
  ColeccionesDelProfesor() {

    this.coleccionService.GET_ColeccionesDelProfesor(this.profesorId)
    .subscribe(coleccion => {
      if (coleccion[0] !== undefined) {
        console.log('Voy a dar la lista');
        this.coleccionesProfesor = coleccion;
        console.log(this.coleccionesProfesor);
        this.profesorService.EnviarProfesorIdAlServicio(this.profesorId);
      } else {
        this.coleccionesProfesor = undefined;
      }

    });
  }

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
      console.log(res);
      this.numeroDeCromos = this.cromosColeccion.length;
    } else {
      console.log('No hay cromos en esta coleccion');
      this.cromosColeccion = undefined;
      this.numeroDeCromos = 0;
    }
  });
  }

  // Una vez seleccionado una coleccion, lo podemos editar o eliminar. Esta función se activará si clicamos en editar.
  // Envía la coleccion específico al componente editar-coleccion
  EnviarColeccionEditar(coleccion: Coleccion, cromosColeccion: Cromo[]) {
    console.log('voy a enviar');
    this.coleccionService.EnviarColeccionAlServicio(coleccion);
    console.log(cromosColeccion);
    if (cromosColeccion !== undefined) {
      this.coleccionService.EnviarCromosColeccionAlServicio(cromosColeccion);
    } else {
      this.coleccionService.EnviarCromosColeccionAlServicio(cromosColeccion);
      console.log('no hay cromos en esta coleccion');
    }

  }

  // Utilizamos esta función para eliminar una colección de la base de datos y actualiza la lista de colecciones
  BorrarColeccion(coleccion: Coleccion) {
    this.coleccionService.DELETE_Coleccion(coleccion.id, coleccion.profesorId)
    .subscribe(() => {
      this.ColeccionesEliminadas(coleccion);
      console.log('Coleccion borrada correctamente');
      console.log(this.coleccionesProfesor);
    });
  }

  // Borramos la colección de la lista de colecciones del profesor
  ColeccionesEliminadas(coleccion: Coleccion) {
    this.coleccionesProfesor = this.coleccionesProfesor.filter(res => res.id !== coleccion.id);
    return this.coleccionesProfesor;
  }


  // Si queremos borrar un equipo, antes nos saldrá un aviso para confirmar la acción como medida de seguridad. Esto se
  // hará mediante un diálogo al cual pasaremos el mensaje y el nombre del equipo
  AbrirDialogoConfirmacionBorrarColeccion(coleccion: Coleccion): void {

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        nombre: coleccion.Nombre,
      }
    });

    // Antes de cerrar recogeremos el resultado del diálogo: Borrar (true) o cancelar (false). Si confirmamos, borraremos
    // el punto (función BorrarPunto) y mostraremos un snackBar con el mensaje de que se ha eliminado correctamente.
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.BorrarColeccion(coleccion);
        this.snackBar.open(coleccion.Nombre + ' eliminado correctamente', 'Cerrar', {
          duration: 2000,
        });

      }
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResponseContentType, Http, Response } from '@angular/http';


// Imports para abrir diálogo confirmar eliminar equipo
import { MatDialog, MatSnackBar, MatTabGroup } from '@angular/material';
import { DialogoConfirmacionComponent } from '../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';

// Servicios
import { PuntosInsigniasService, ProfesorService } from '../../servicios/index';

// Clases
import { Punto, Insignia } from '../../clases/index';

@Component({
  selector: 'app-mis-puntos',
  templateUrl: './mis-puntos.component.html',
  styleUrls: ['./mis-puntos.component.scss']
})
export class MisPuntosComponent implements OnInit {

  profesorId: number;


  puntosProfesor: Punto[];
  insigniasProfesor: Insignia[];

  imagenInsignia: string;


  // PARA DIÁLOGO DE CONFIRMACIÓN
  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres eliminar el equipo llamado: ';

  constructor(
    private puntosInsigniasService: PuntosInsigniasService,
    private profesorService: ProfesorService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private http: Http) { }

  ngOnInit() {

    // REALMENTE LA APP FUNCIONARÁ COGIENDO AL PROFESOR DEL SERVICIO, NO OBSTANTE AHORA LO RECOGEMOS DE LA URL
    // this.profesorId = this.profesorService.RecibirProfesorIdDelServicio();
    this.profesorId = Number (this.route.snapshot.paramMap.get('id'));

    console.log(this.profesorId);

    this.PuntosDelProfesor();
    console.log(this.puntosProfesor);

    this.InsigniasDelProfesor();
    console.log(this.insigniasProfesor);

  }

  ////////////////////////////////////////////// PARA PUNTOS ////////////////////////////////////////////////
  PuntosDelProfesor() {

    this.puntosInsigniasService.GET_Puntos(this.profesorId)
    .subscribe(puntos => {
      if (puntos[0] !== undefined) {
        console.log('Voy a dar la lista');
        this.puntosProfesor = puntos;
        console.log(this.puntosProfesor);
        this.profesorService.EnviarProfesorIdAlServicio(this.profesorId);
      } else {
        this.puntosProfesor = undefined;
      }

    });
  }

  // Una vez seleccionado un punto, lo podemos editar o eliminar. Esta función se activará si clicamos en editar.
  // Envía el punto específico al componente editar-punto
  EnviarPuntoEditar(punto: Punto) {
    console.log('voy a enviar');
    this.puntosInsigniasService.EnviarPuntoAlServicio(punto);
    console.log(punto.Nombre);

  }

  // Si queremos borrar un equipo, antes nos saldrá un aviso para confirmar la acción como medida de seguridad. Esto se
  // hará mediante un diálogo al cual pasaremos el mensaje y el nombre del equipo
  AbrirDialogoConfirmacionBorrarPunto(punto: Punto): void {

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        nombre: punto.Nombre,
      }
    });

    // Antes de cerrar recogeremos el resultado del diálogo: Borrar (true) o cancelar (false). Si confirmamos, borraremos
    // el punto (función BorrarPunto) y mostraremos un snackBar con el mensaje de que se ha eliminado correctamente.
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.BorrarPunto(punto);
        this.snackBar.open(punto.Nombre + ' eliminado correctamente', 'Cerrar', {
          duration: 2000,
        });

      }
    });
  }


  // Utilizamos esta función para eliminar un punto de la base de datos y actualiza la lista de puntos
  BorrarPunto(punto: Punto) {
    this.puntosInsigniasService.DELETE_Punto(punto.id, punto.profesorId)
    .subscribe(() => {
      this.PuntosEliminados(punto);
      console.log('punto borrado correctamente');
      console.log(this.puntosProfesor);
    });
  }

  // Borramos el punto de la lista de puntos agregados
  PuntosEliminados(punto: Punto) {
    this.puntosProfesor = this.puntosProfesor.filter(res => res.id !== punto.id);
    return this.puntosProfesor;
  }

    ////////////////////////////////////////////// PARA INSIGNIAS ////////////////////////////////////////////////
    InsigniasDelProfesor() {

      this.puntosInsigniasService.GET_Insignias(this.profesorId)
      .subscribe(insignas => {
        if (insignas[0] !== undefined) {
          console.log('Voy a dar la lista');
          this.insigniasProfesor = insignas;
          console.log(this.insigniasProfesor);
          this.profesorService.EnviarProfesorIdAlServicio(this.profesorId);
        } else {
          this.insigniasProfesor = undefined;
        }

      });
    }


    // Lo mismo que con el punto
     EnviarInsigniaEditar(insigna: Insignia) {
      console.log('voy a enviar');
      this.puntosInsigniasService.EnviarInsigniaAlServicio(insigna);
      console.log(insigna.Nombre);
    }

    // Lo mismo que con el punto
    AbrirDialogoConfirmacionBorrarInsignia(insigna: Insignia): void {

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        nombre: insigna.Nombre,
      }
    });

    // Antes de cerrar recogeremos el resultado del diálogo: Borrar (true) o cancelar (false). Si confirmamos, borraremos
    // el punto (función BorrarPunto) y mostraremos un snackBar con el mensaje de que se ha eliminado correctamente.
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.BorrarInsignia(insigna);
        this.snackBar.open(insigna.Nombre + ' eliminado correctamente', 'Cerrar', {
          duration: 2000,
        });

      }
    });
  }

    // Utilizamos esta función para eliminar una insignia de la base de datos y de la lista de añadidos recientemente
    BorrarInsignia(insignas: Insignia) {
      this.puntosInsigniasService.DELETE_Insignia(insignas.id, insignas.profesorId)
      .subscribe(() => {
        this.InsigniasEliminadas(insignas);
        console.log('insignia borrada correctamente');
        console.log(this.insigniasProfesor);
      });
    }

    // Borramos la insignia de la lista de insingias agregadas
    InsigniasEliminadas(insignas: Insignia) {
      this.insigniasProfesor = this.insigniasProfesor.filter(res => res.id !== insignas.id);
      return this.insigniasProfesor;
    }

  ImagenDelaInsignia(insigna: Insignia) {

    console.log('entro a buscar insignia y foto');
    console.log(insigna.Imagen);
    // Si la insignia tiene una foto (recordemos que la foto no es obligatoria)
    if (insigna.Imagen !== undefined) {

      // Busca en la base de datos la imágen con el nombre registrado en insingnia.Imagen y la recupera
      this.http.get('http://localhost:3000/api/imagenes/ImagenInsignia/download/' + insigna.Imagen,
      { responseType: ResponseContentType.Blob })
      .subscribe(response => {
        const blob = new Blob([response.blob()], { type: 'image/jpg'});

        const reader = new FileReader();
        reader.addEventListener('load', () => {
          this.imagenInsignia = reader.result.toString();
        }, false);

        if (blob) {
          reader.readAsDataURL(blob);
        }
      });

      // Sino la imagenInsignia será undefined para que no nos pinte la foto de otra insignia préviamente seleccionado
    } else {
      this.imagenInsignia = undefined;
    }
  }

}

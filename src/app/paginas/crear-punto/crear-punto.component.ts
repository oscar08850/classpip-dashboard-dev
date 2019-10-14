import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';

// Servicios
import { ProfesorService, PeticionesAPIService } from '../../servicios/index';

// Clases
import { Punto, Insignia } from '../../clases/index';

@Component({
  selector: 'app-crear-punto',
  templateUrl: './crear-punto.component.html',
  styleUrls: ['./crear-punto.component.scss']
})
export class CrearPuntoComponent implements OnInit {

  // Columnas para la tabla de los puntos añadidos recientemente
  displayedColumns: string[] = ['nombre', 'descripcion', ' '];

  // Identificador del profesor
  profesorId: number;

  // Habilitador para poder crear puntos
  // tslint:disable-next-line:ban-types
  isDisabledPuntos: Boolean = true;

  // Habilitador para poder crear insignias
  // tslint:disable-next-line:ban-types
  isDisabledInsignias: Boolean = true;

  // Lista de los puntos agregados
  puntosAgregados: Punto [] = [];

  // Lista de las insignias agregadss
  insigniasAgregadas: Insignia [] = [];

  // Nombre del punto y descripción que creo
  nombrePunto: string;
  descripcionPunto: string;

  // Nombre de insignia y descripción que creo
  nombreInsignia: string;
  descripcionInsignia: string;

  // Nombre del logo que cargo para la insignia
  nombreLogo: string;
  file: File;
  logo: string;

  // Para saber si se ha cargado un logo o no
  // tslint:disable-next-line:ban-types
  logoCargado: Boolean = false;

  constructor( private peticionesAPI: PeticionesAPIService,
               private profesorService: ProfesorService,
               private route: ActivatedRoute,
               public dialog: MatDialog,
               public snackBar: MatSnackBar) { }

  ngOnInit() {

    // REALMENTE LA APP FUNCIONARÁ COGIENDO AL PROFESOR DEL SERVICIO, NO OBSTANTE AHORA LO RECOGEMOS DE LA URL
    // this.profesorId = this.profesorService.RecibirProfesorIdDelServicio();
    this.profesorId = Number (this.route.snapshot.paramMap.get('id'));

  }

  ///////////////////////////////////////////// CREAR PUNTO ///////////////////////////////////////////////////////

  // Función para crear punto
  CrearPunto() {

    this.peticionesAPI.CreaTipoDePunto(new Punto(this.nombrePunto, this.descripcionPunto), this.profesorId)
    .subscribe(res => {
      if (res !== undefined) {

        this.snackBar.open(this.nombrePunto + ' creado correctamente', 'Cerrar', {
          duration: 2000,
        });
        // añadimos el punto a la lista que se muestra al usuario
        this.puntosAgregados.push(res);
        this.puntosAgregados = this.puntosAgregados.filter(punto => punto.Nombre !== '');
        // limpiamos los campos del formulario
        this.nombrePunto = undefined;
        this.descripcionPunto = undefined;
        this.isDisabledPuntos = true;
      } else {
        console.log('Fallo añadiendo');
      }
    });
  }


  // Utilizamos esta función para eliminar un punto de la base de datos y de la lista de añadidos recientemente
  BorrarPunto(punto: Punto) {
    this.peticionesAPI.BorraTipoDePunto(punto.id, punto.profesorId)
    .subscribe(() => this.puntosAgregados = this.puntosAgregados.filter(res => res.id !== punto.id));
  }



  // Los campos de nombre y descripción son obligatorios. Si son undefined o '' no podremos clicar en crear
  Disabled() {

    if (this.nombrePunto === undefined || this.descripcionPunto === undefined || this.nombrePunto === '' ||
      this.descripcionPunto === '') {
      this.isDisabledPuntos = true;
    } else {
      this.isDisabledPuntos = false;
    }
  }



  ///////////////////////////////////////////// CREAR INSIGNIA ///////////////////////////////////////////////////////


  // Las insignias además de un nombre y descripción podrá tener una imagen (opcional). Si decidimos poner una imagen la
  // examinaremos (ExaminarImagen)

  // Activa la función ExaminarImagen
  ActivarInput() {
    document.getElementById('input').click();
  }


  // Buscaremos la imagen en nuestro ordenador y después se mostrará en el form con la variable "logo" y guarda el
  // nombre de la foto en la variable nombreLogo
  ExaminarImagen($event) {

    this.file = $event.target.files[0];

    this.nombreLogo = this.file.name;

    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {

      this.logoCargado = true;
      this.logo = reader.result.toString();
    };
  }

  // Una vez examinado el logo (o no), procedemos a hacer el POST de la nueva insignia
  CrearInsignia() {

    this.peticionesAPI.CreaInsignia(new Insignia(this.nombreInsignia, this.descripcionInsignia, this.nombreLogo)
    , this.profesorId).subscribe(insignia => {
      if (insignia !== undefined) {

        this.snackBar.open(this.nombreInsignia + ' creada correctamente', 'Cerrar', {
          duration: 2000,
        });

        // Hago el POST de la imagen SOLO si hay algo cargado. Ese boolean se cambiará en la función ExaminarImagen
        if (this.logoCargado === true) {

          // Hacemos el POST de la nueva imagen en la base de datos recogida de la función ExaminarImagen
          const formData: FormData = new FormData();
          formData.append(this.nombreLogo, this.file);
          this.peticionesAPI.PonImagenInsignia(formData)
          .subscribe(() => console.log('Logo cargado'));
        }
        // Ponemos la insignia en la lista que ve el usuario
        this.insigniasAgregadas.push(insignia);
        this.insigniasAgregadas = this.insigniasAgregadas.filter(res => res.Nombre !== '');
        // Limpiamos los campos del formulario
        this.nombreInsignia = undefined;
        this.descripcionInsignia = undefined;
        this.isDisabledInsignias = true;
        this.logoCargado = false;
        this.logo = undefined;
        this.nombreLogo = undefined;
      } else {
        console.log('Fallo añadiendo');
      }
    });
  }


  // Hasta que no ponemos los parámetros de nombre y descripción no deja crear la insignia. La imagen es opcional
  DisabledInsignia() {
    if (this.nombreInsignia === undefined || this.descripcionInsignia === undefined || this.nombreInsignia === '' ||
    this.descripcionInsignia === '') {
    this.isDisabledInsignias = true;
    } else {
    this.isDisabledInsignias = false;
    }
  }


  // Borra la insignia que le pasamos de la API
  BorrarInsignia(insignia: Insignia) {
    this.peticionesAPI.BorraInsignia(insignia.id, insignia.profesorId)
    .subscribe(() => this.insigniasAgregadas = this.insigniasAgregadas.filter(res => res.id !== insignia.id));
  }

}

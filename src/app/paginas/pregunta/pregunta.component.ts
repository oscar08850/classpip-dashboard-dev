import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as URL from '../../URLs/urls';

//Servicios
import { SesionService, PeticionesAPIService, CalculosService } from 'src/app/servicios';

//Clases
import { Pregunta } from 'src/app/clases';
import { ChipColor } from '../juego/juego.component';
//import { Console } from 'console';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.component.html',
  styleUrls: ['./pregunta.component.scss']
})
export class PreguntaComponent implements OnInit {

  // Identificador del profesor
  profesorId: number;

  //Pregunta a crear
  nuevaPregunta: Pregunta


  // URL del inicio
  URLVueltaInicio: string;

  // Para saber si el botón está habilitado o no
  // tslint:disable-next-line:ban-types

  // tslint:disable-next-line:ban-types
  finalizar: Boolean = false;

  existeImagen: Boolean = false;


  infoPreguntas: any;
  ficherosPreguntas;
  advertencia = true;
  ficheroCargado = false;
  imagenCargado: Boolean = false;

  // variables necesarias para la carga de la foto
  filePregunta: File;
  imagenPregunta: string;
  nombreFicheroImagen: string;

  misPreguntas: Pregunta[];
  ficherosQueFaltan: string[];
  faltanFicheros = false;
  hayFicherosRepetidos = false;
  ficherosRepetidos: string[];
  seleccionTipoPregunta: ChipColor[] = [
    {nombre: 'Cuatro opciones', color: 'primary'},
    {nombre: 'Respuesta abierta', color: 'accent'},
    {nombre: 'Verdadero o falso', color: 'warn'},
    {nombre: 'Emparejamiento', color: 'primary'},
  ];

  tengoTipo = false;


  titulo: string;
  pregunta: string;
  tematica: string;
  tipoDePreguntaSeleccionado: string;
  respuestaCorrecta: string;
  respuestaIncorrecta1: string;
  respuestaIncorrecta2: string;
  respuestaIncorrecta3: string;;
  feedbackCorrecto: string;
  feedbackIncorrecto: string;
  emparejamientos: any[] = [];

  nuevaParejaL: string;
  nuevaParejaR: string;




  constructor(private route: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog,
              public sesion: SesionService,
              public peticionesAPI: PeticionesAPIService,
              public calculos: CalculosService
              ) { }

  ngOnInit() {

    this.profesorId = this.sesion.DameProfesor().id;

    // tslint:disable-next-line:no-string-literal
    this.URLVueltaInicio = this.route.snapshot.queryParams['URLVueltaInicio'] || '/inicio';


  }

  //CREAMOS Y GUARDAMOS LA PREGUNTA CON LOS VALORES AÑADIDOS
  CrearPregunta() {
    //Añadimos al final del constructor el nombre de la imagen nombreFicheroImagen
    // tslint:disable-next-line:max-line-length
    const pregunta = new Pregunta (this.titulo, this.tipoDePreguntaSeleccionado, this.pregunta, this.tematica, this.nombreFicheroImagen, this.feedbackCorrecto, this.feedbackIncorrecto);

    pregunta.Emparejamientos = this.emparejamientos;
    pregunta.RespuestaCorrecta = this.respuestaCorrecta;
    pregunta.RespuestaIncorrecta1 = this.respuestaIncorrecta1;
    pregunta.RespuestaIncorrecta2 = this.respuestaIncorrecta2;
    pregunta.RespuestaIncorrecta3 = this.respuestaIncorrecta3;



    console.log ('vamos a crear pregunta');

    //Creamos y guardamos el modelo de Pregunta
    this.peticionesAPI.CreaPregunta(pregunta, this.profesorId)
      .subscribe((res) => {
        if (res != null) {
          console.log('Pregunta creada correctamente' + res);
          this.nuevaPregunta = res;

          if (this.nombreFicheroImagen !== undefined){
            const imagenPreguntaData: FormData = new FormData();
            imagenPreguntaData.append(this.filePregunta.name, this.filePregunta);
            this.peticionesAPI.PonImagenPregunta(imagenPreguntaData)
            .subscribe();
          }
          Swal.fire('OK', 'Pregunta creada con éxito', 'success');

          this.goBack();
        } else {
          console.log('Fallo en la creacion de la pregunta');
          Swal.fire('Se ha producido un error creando la pregunta', 'ERROR', 'error');
        }
      });
  }


  VueltaInicio() {
    this.router.navigate([this.URLVueltaInicio, this.profesorId]);
    console.log(this.URLVueltaInicio);
  }

  goBack() {
    this.router.navigate(['/inicio/' + this.profesorId]);
  }
  aceptarGoBack() {
    Swal.fire('La pregunta se ha creado correctamente', 'Enhorabuena', 'success');
    this.finalizar = true;
    this.goBack();
  }


  tengoDatosBasicos(): boolean {
    // tslint:disable-next-line:max-line-length
    if (this.titulo === undefined || this.pregunta === undefined || this.tematica === undefined || this.tipoDePreguntaSeleccionado === undefined) {
      return false;
    } else {
      return true;
    }
  }

  tengoCuatroOpciones(): boolean {
    if (this.respuestaCorrecta === undefined || this.respuestaIncorrecta1 === undefined ||
     this.respuestaIncorrecta2 === undefined || this.respuestaIncorrecta3 === undefined ) {
      return false;
    } else {
      return true;
    }
  }

   tengoRespuestaCorrecta(): boolean {
    if (this.respuestaCorrecta === undefined) {
      return false;
    } else {
      return true;
    }
  }


  tengoOpcionesVerdaderoFalso(): boolean {
      if (this.respuestaCorrecta === undefined) {
        return false;
      } else {
        return true;
      }
  }

  tengoFeedback(): boolean {
    if (this.feedbackCorrecto === undefined || this.feedbackIncorrecto === undefined){
      return false;
    } else {
      return true;
    }
  }

  hayNuevaPareja (): boolean {
    if (this.nuevaParejaL === undefined || this.nuevaParejaR === undefined){
      return false;
    } else {
      return true;
    }

  }

  tengoEmparejamientos (): boolean {
    return this.emparejamientos.length > 0;
  }


 // Activa la función SeleccionarInfoPreguntas
 ActivarInputInfo() {
  console.log('Activar input');
  document.getElementById('inputInfo').click();
}


   // Par abuscar el fichero JSON que contiene la info de las preguntas que se van
  // a cargar desde fichero
  SeleccionarInfoPreguntas($event) {
    const fileInfo = $event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(fileInfo, 'ISO-8859-1');
    reader.onload = () => {
      try {
        this.infoPreguntas = JSON.parse(reader.result.toString());
        console.log ('Ya tengo las preguntas');
        console.log (this.infoPreguntas);
        if (this.infoPreguntas.some (pregunta => pregunta.Imagen)) {
        // hay imagenes en alguna de las preguntas
          this.calculos.VerificarFicherosPreguntas (this.infoPreguntas)
          .subscribe (lista => {
            console.log ('lista de ficheros repetidos');
            console.log (lista);
            if (lista.length === 0) {
              Swal.fire({
                title: 'Selecciona ahora las imagenes de las preguntas',
                icon: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Selecciona'
              }).then((result) => {
                if (result.value) {
                  // Activamos la función SeleccionarFicherosCromos
                  document.getElementById('inputImagenes').click();
                }
              });
            } else {
              this.hayFicherosRepetidos = true;
              this.ficherosRepetidos = lista;
            }
          });
        } else {
          this.ficheroCargado = true;
        }
      } catch (e) {
        Swal.fire('Error en el formato del fichero', '', 'error');
      }
    };
  }

  SeleccionarFicherosPreguntas($event) {
    this.ficherosPreguntas = Array.from($event.target.files);
    console.log ('He cargado ' + this.ficherosPreguntas.length + ' imagenes');
    this.ficherosQueFaltan = [];
    this.infoPreguntas.forEach (pregunta => {
      if (pregunta.Imagen) {
        if (!this.ficherosPreguntas.some (fichero => fichero.name === pregunta.Imagen)) {
          this.ficherosQueFaltan.push (pregunta.Imagen);
        }
      }
    });
    if (this.ficherosQueFaltan.length > 0) {
      this.faltanFicheros = true;
    } else {
      this.ficheroCargado = true;
    }
  }

  RegistrarPreguntas() {
    let cont = 0;

    this.infoPreguntas.forEach (pregunta => {
      this.peticionesAPI.CreaPregunta(pregunta, this.profesorId)
      .subscribe((res) => {
        if (res != null) {
          cont++;
          // tslint:disable-next-line:no-shadowed-variable
          const pregunta = res;
          //Si la pregunta se registra correctamente, enviamos también la imagen (si es que la hay)
          if (pregunta.Imagen) {
            console.log ('Si que registro');
            console.log (pregunta.Imagen);
            //guardamos la imagen de la pregunta
            const ImagenPregunta = this.ficherosPreguntas.filter (f => f.name === pregunta.Imagen)[0];
            console.log ('imagen ');
            console.log (ImagenPregunta);
            const formDataImagen = new FormData();
            formDataImagen.append(pregunta.Imagen, ImagenPregunta);
            this.peticionesAPI.PonImagenPregunta (formDataImagen)
            .subscribe(() => console.log('Imagen cargado'));
           }

          if (cont === this.infoPreguntas.length) {
            Swal.fire('Las preguntas se han registrado correctamente', '', 'success');
            this.finalizar = true;
            this.goBack();
          }
        } else {
          console.log('Fallo en la creacion de la pregunta');
          Swal.fire('Error en la creación de las preguntas', '', 'error');
        }
      });
    });
  }

  Cancelar() {
    this.router.navigate(['/inicio/' + this.profesorId]);
  }


  ActivarInputImagen() {
    document.getElementById('inputImagenPregunta').click();
  }




  // Evento que nos permite cargar una imagen y guardarla en el atributo imagenPregunta
  CargarImagenPregunta($event) {
    this.filePregunta = $event.target.files[0];

    this.calculos.NombreFicheroImagenPreguntaRepetido ( this.filePregunta.name)
    .subscribe (repetido => {
      if (repetido) {
        Swal.fire('Error', 'Ya hay un fichero en la base de datos con el mismo nombre', 'error');
      } else {
          this.nombreFicheroImagen  = this.filePregunta.name;
          const reader = new FileReader();
          reader.readAsDataURL(this.filePregunta);
          reader.onload = () => {
            this.imagenPregunta = reader.result.toString();
          };
      }
    });
  }


ExisteImagen(){
  console.log("EMPEZAMOS GUARDADO");
  console.log("RECUPERAMOS LAS PREGUNTAS EXISTENTES");
  this.peticionesAPI.DameTodasMisPreguntas (this.profesorId)
  .subscribe( res => {
    if (res[0] !== undefined) {
      this.misPreguntas = res;
      console.log("PREGUNTAS RECUPERADAS");
      console.log(this.misPreguntas);
    }})

  if (this.misPreguntas != null) {
  this.misPreguntas.forEach( pregunta => {
    if (pregunta.Imagen === this.imagenPregunta) {
        this.existeImagen = true} });
  }
}

TipoDePreguntaSeleccionado(tipo: ChipColor) {
  console.log ('tengo tipo');
  this.tipoDePreguntaSeleccionado = tipo.nombre;
  this.tengoTipo = true;
}


EliminarPareja(i) {
  this.emparejamientos.splice (i, 1);
}
NuevoEmparejamiento() {
  this.emparejamientos.push ({
    l: this.nuevaParejaL,
    r: this.nuevaParejaR
  });
  this.nuevaParejaL = undefined;
  this.nuevaParejaR = undefined;
}

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

//Servicios
import { SesionService, PeticionesAPIService, CalculosService } from 'src/app/servicios';

//Clases
import { Pregunta } from 'src/app/clases';
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
  pregunta: Pregunta

  //Para el stepper
  myForm: FormGroup;

  //Para el stepper
  myForm2: FormGroup;

  // URL del inicio
  URLVueltaInicio: string;

  // Para saber si el botón está habilitado o no
  // tslint:disable-next-line:ban-types
  isDisabled: Boolean = true;
  isDisabled2: Boolean = true;

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

  constructor(private route: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog,
              public sesion: SesionService,
              public peticionesAPI: PeticionesAPIService,
              public calculos: CalculosService,
              private _formBuilder: FormBuilder) { }

  ngOnInit() {

    this.profesorId = this.sesion.DameProfesor().id;

    // tslint:disable-next-line:no-string-literal
    this.URLVueltaInicio = this.route.snapshot.queryParams['URLVueltaInicio'] || '/inicio';

    this.myForm = this._formBuilder.group({
      tituloPregunta: ['', Validators.required],
      preguntaPregunta: ['', Validators.required],
      tematicaPregunta: ['', Validators.required]
    })

    this.myForm2 = this._formBuilder.group({
      respuestaCorrecta: ['', Validators.required],
      respuestaIncorrecta1: ['', Validators.required],
      respuestaIncorrecta2: ['', Validators.required],
      respuestaIncorrecta3: ['', Validators.required],
      feedbackCorrecto: ['', Validators.required],
      feedbackIncorrecto: ['', Validators.required]
    })
  }

  //CREAMOS Y GUARDAMOS LA PREGUNTA CON LOS VALORES AÑADIDOS
  CrearPregunta() {
    let tituloPregunta: string;
    let preguntaPregunta: string;
    let tematicaPregunta: string;
    let respuestaCorrecta: string;
    let respuestaIncorrecta1: string;
    let respuestaIncorrecta2: string;
    let respuestaIncorrecta3: string;
    let feedbackCorrecto: string;
    let feedbackIncorrecto: string;

    tituloPregunta = this.myForm.value.tituloPregunta;
    preguntaPregunta = this.myForm.value.preguntaPregunta;
    tematicaPregunta = this.myForm.value.tematicaPregunta;
    respuestaCorrecta = this.myForm2.value.respuestaCorrecta;
    respuestaIncorrecta1 = this.myForm2.value.respuestaIncorrecta1;
    respuestaIncorrecta2 = this.myForm2.value.respuestaIncorrecta2;
    respuestaIncorrecta3 = this.myForm2.value.respuestaIncorrecta3;
    feedbackCorrecto = this.myForm2.value.feedbackCorrecto;
    feedbackIncorrecto = this.myForm2.value.feedbackIncorrecto;

    //Añadimos al final del constructor el nombre de la imagen nombreFicheroImagen
    const pregunta = new Pregunta(tituloPregunta, preguntaPregunta,
      tematicaPregunta, respuestaCorrecta, respuestaIncorrecta1,
      respuestaIncorrecta2, respuestaIncorrecta3, feedbackCorrecto,
      feedbackIncorrecto, this.nombreFicheroImagen);

    console.log ('vamos a crear pregunta');

    //Creamos y guardamos el modelo de Pregunta
    this.peticionesAPI.CreaPregunta(pregunta, this.profesorId)
      .subscribe((res) => {
        if (res != null) {
          console.log('Pregunta creada correctamente' + res);
          this.pregunta = res;

          /*El modelo Pregunta y la imagen son independientes, por eso,
          una vez creado el modelo de la pregunta, necesitamos guardar la imagen
          a la que hace referencia el nombreFicheroImagen dentro de la API.*/

          //No queremos duplicidades en la BD, por eso, antes de añadir la imagen comprobaremos que no esté ya guardada en ella.

          this.ExisteImagen();

          //Finalmente, añadimos la imagen a la BD.
          if (!this.existeImagen && this.filePregunta != null){
            const imagenPreguntaData: FormData = new FormData();
            console.log(this.filePregunta.name);
            console.log(this.filePregunta);
            imagenPreguntaData.append(this.filePregunta.name, this.filePregunta);
            this.peticionesAPI.PonImagenPregunta(imagenPreguntaData)
                .subscribe();
          }

          this.aceptarGoBack();
        } else {
          console.log('Fallo en la creacion de la pregunta');
          Swal.fire('Se ha producido un error creando la pregunta', 'ERROR', 'error');
        }
      });
  }


  // VUELTA AL INICIO
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

  // MIRO SI HAY ALGO SIMULTÁNEAMENTE EN EL TITULO, PREGUNTA Y LA TEMATICA
  Disabled() {
    if (this.myForm.value.tituloPregunta === '' || this.myForm.value.preguntaPregunta === '' || this.myForm.value.tematicaPregunta === '') {
      // Si alguno de los valores es igual a nada, entonces estará desactivado
      this.isDisabled = true;
    } else {
      // Si ambos son diferentes a nulo, estará activado.
      this.isDisabled = false;
    }
  }

  // MIRO SI HAY ALGO SIMULTÁNEAMENTE EN EL TODAS LAS RESPUESTAS Y EN LOS FEEDBACKS
  Disabled2() {
    if (this.myForm2.value.respuestaCorrecta === '' || this.myForm2.value.respuestaIncorrecta1 === '' ||
     this.myForm2.value.respuestaIncorrecta2 === '' || this.myForm2.value.respuestaIncorrecta3 === '' ||
      this.myForm2.value.feedbackCorrecto === '' || this.myForm2.value.feedbackIncorrecto === '') {
      // Si alguno de los valores es igual a nada, entonces estará desactivado
      this.isDisabled2 = true;
    } else {
      // Si ambos son diferentes a nulo, estará activado.
      this.isDisabled2 = false;
    }
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
          this.pregunta = res;
          //Si la pregunta se registra correctamente, enviamos también la imagen (si es que la hay)
          if (this.pregunta.Imagen) {
            console.log ('Si que registro');
            console.log (this.pregunta.Imagen);
            //guardamos la imagen de la pregunta
            const ImagenPregunta = this.ficherosPreguntas.filter (f => f.name === this.pregunta.Imagen)[0];
            console.log ('imagen ');
            console.log (ImagenPregunta);
            const formDataImagen = new FormData();
            formDataImagen.append(this.pregunta.Imagen, ImagenPregunta);
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

  //Evento que nos permite cargar una imagen y guardarla en el atributo imagenPregunta
  CargarImagenPregunta($event) {
    this.filePregunta = $event.target.files[0];
    this.nombreFicheroImagen = this.filePregunta.name;

    const reader = new FileReader();
    reader.readAsDataURL(this.filePregunta);
    reader.onload = () => {
      this.imagenPregunta = reader.result.toString();

    };
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

}

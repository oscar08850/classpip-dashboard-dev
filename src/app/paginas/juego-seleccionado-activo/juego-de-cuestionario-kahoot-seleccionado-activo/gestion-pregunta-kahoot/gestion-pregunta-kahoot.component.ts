import { Component, OnInit } from '@angular/core';
import { Alumno, Juego, Pregunta } from 'src/app/clases';
import { ComServerService, PeticionesAPIService, SesionService } from 'src/app/servicios';
import Swal from 'sweetalert2';
import * as URL from 'src/app/URLs/urls';

@Component({
  selector: 'app-gestion-pregunta-kahoot',
  templateUrl: './gestion-pregunta-kahoot.component.html',
  styleUrls: ['./gestion-pregunta-kahoot.component.scss']
})
export class GestionPreguntaKahootComponent implements OnInit {
  
  // Juego de Cuestionario seleccionado
   juegoSeleccionado: Juego;

   //Para cargar la pregunta mostrada
   preguntasCuestionario: Pregunta[];
   preguntaCargada: Pregunta;
 
    // Recuperamos la informacion del juego
    alumnosDelJuego: Alumno[];

    //Indice para conseguir la pregunta
    indicePregunta: number;

    //Para cargar la Imagen
    imagenPregunta: string;

    //Para almacenar las respuestas recibidas
    respuestasAlumnos: any[];
 
  
  constructor(public sesion: SesionService,
              public peticionesAPI: PeticionesAPIService,
              public comServer: ComServerService) {}
  
  ngOnInit() {
    //Recuperamos el juego
    this.juegoSeleccionado = this.sesion.DameJuego();

    //Recuperamos las preguntas asociadas al juego de cuestionario
    this.DamePreguntasDelJuego();

    //Cargamos la espera de respuestas de los alumnos
    this.EsperoRespuestaAlumno();

  }

  DamePreguntasDelJuego(){
    this.peticionesAPI.DamePreguntasCuestionario(this.juegoSeleccionado.cuestionarioId)
      .subscribe(res => {
       this.preguntasCuestionario = res;
       
       //Seleccionamos la primera pregunta
      this.preguntaCargada = this.preguntasCuestionario[0];

      //Recuperamos la imagen de la primera pregunta
      this.TraeImagenPregunta(this.preguntaCargada);

      //Iniciamos el índice para la siguiente pregunta
      this.indicePregunta = 1;
     })
     
  }

  Siguiente(){

     //Seleccionamos la pregunta
     console.log("VOY A MOSTRAR LA PREGUNTA: " +this.indicePregunta);
     if (this.indicePregunta < this.preguntasCuestionario.length){
        this.preguntaCargada = this.preguntasCuestionario[this.indicePregunta];
        
        //Una vez cargada la nueva pregunta, actualizamos su imagen
        this.TraeImagenPregunta(this.preguntaCargada);
        
        //Dejamos el índice preparado para la próxima pregunta
        this.indicePregunta ++;

        //PARTE SERVIDOR
        //Para mostrar las nuevas respuestas en el móvil del alumno
        this.comServer.AvanzarPregunta(this.juegoSeleccionado.grupoId);

     }else{
        Swal.fire('Error', 'No hay más preguntas', 'error');
     }
  } 
  
  // Recuperamos la imagen asociada a la pregunta.
  TraeImagenPregunta(pregunta: Pregunta) {

    // Si la pregunta tiene una foto (recordemos que la foto no es obligatoria)
    if (pregunta.Imagen !== undefined) {
      this.imagenPregunta = URL.ImagenesPregunta + pregunta.Imagen ;
      console.log (this.imagenPregunta);

      // Si no, la imagenPregunta será undefined para que no nos pinte la foto de otro equipo préviamente seleccionado
    } else {
      this.imagenPregunta = undefined;
    }

  }

  //Para recibir las respuestas de los alumnos
  EsperoRespuestaAlumno(){
    this.comServer.EsperoRespuestasCuestionarioKahoot().subscribe((respuesta) =>{
      console.log("Recibo respuesta Kahoot");
      console.log(respuesta.alumnoId);
      console.log(respuesta.respuesta);
      this.respuestasAlumnos.push({
        alumnoId: respuesta.alumnoId ,
        respuestaAlumno: respuesta.respuesta
      });
      console.log(this.respuestasAlumnos[0]);
    });
  }

}

export class Pregunta {
    titulo: string;
    pregunta: string;
    tematica: string;
    respuestaCorrecta: string;
    respuestaIncorrecta1: string;
    respuestaIncorrecta2: string;
    respuestaIncorrecta3: string;
    feedbackCorrecto: string;
    feedbackIncorrecto: string;
    id: number;
    profesorId: number;

    constructor(titulo?: string, pregunta?: string, tematica?: string, respuestaCorrecta?: string, respuestaIncorrecta1?: string, respuestaIncorrecta2?: string, respuestaIncorrecta3?: string, feedbackCorrecto?: string, feedbackIncorrecto?: string){
        this.titulo = titulo;
        this.pregunta = pregunta;
        this.tematica = tematica;
        this.respuestaCorrecta = respuestaCorrecta;
        this.respuestaIncorrecta1 = respuestaIncorrecta1;
        this.respuestaIncorrecta2 = respuestaIncorrecta2;
        this.respuestaIncorrecta3 = respuestaIncorrecta3;
        this.feedbackCorrecto = feedbackCorrecto;
        this.feedbackIncorrecto = feedbackIncorrecto;
    }
}

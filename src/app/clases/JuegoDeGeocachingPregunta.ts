export class JuegoDeGeocachingPregunta {
  id: number;
  JuegoDeGeocachingId: number;
  preguntaId: number;

  constructor(JuegoDeGeocachingId?: number, preguntaId?: number) {

    this.JuegoDeGeocachingId = JuegoDeGeocachingId;
    this.preguntaId = preguntaId;
  }
}

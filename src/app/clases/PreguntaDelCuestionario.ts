export class PreguntaDelCuestionario {
    preguntaId: number;
    cuestionarioId: number;
    id: number;

  constructor(preguntaId?: number, cuestionarioId?: number) {

    this.preguntaId = preguntaId;
    this.cuestionarioId = cuestionarioId;
  }
}

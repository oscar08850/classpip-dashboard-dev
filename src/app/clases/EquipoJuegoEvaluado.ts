export class EquipoJuegoEvaluado {

  id: number;
  juegoEvaluacionId: number;
  equipoEvaluadoId: number;
  equiposEvaluadoresIds: number[];
  notaFinal: number;

  constructor(id: number, juegoEvaluacionId: number, equipoEvaluadoId: number, equiposEvaluadoresIds: number[], notaFinal: number) {
    this.id = id;
    this.juegoEvaluacionId = juegoEvaluacionId;
    this.equipoEvaluadoId = equipoEvaluadoId;
    this.equiposEvaluadoresIds = equiposEvaluadoresIds;
    this.notaFinal = notaFinal;
  }
}

export class AlumnoJuegoDeVotacionTodosAUno {

  PuntosTotales: number;
  id: number;
  alumnoId: number;
  juegoDeVotacionTodosAUnoId: number;
  VotosEmitidos: any[];
  VotosRecibidos: any[];

  constructor(alumnoId?: number, juegoDeVotacionTodosAUnoId?: number) {

    this.alumnoId = alumnoId;
    this.juegoDeVotacionTodosAUnoId = juegoDeVotacionTodosAUnoId;
    this.PuntosTotales = 0;
    this.VotosEmitidos = [];
    this.VotosRecibidos = [];
  }
}

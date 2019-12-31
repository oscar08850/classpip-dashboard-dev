export class TablaJornadas {

  NumeroDeJornada: number;
  Fecha: any;
  CriterioGanador: string;
  id: number;

  constructor(NumeroDeJornada?: number, Fecha?: any, CriterioGanador?: string) {

    this.NumeroDeJornada = NumeroDeJornada;
    this.Fecha = Fecha;
    this.CriterioGanador = CriterioGanador;

  }
}

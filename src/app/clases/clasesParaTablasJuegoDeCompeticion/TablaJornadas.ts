export class TablaJornadas {

  NumeroDeJornada: number;
  Fecha: any;
  CriterioGanador: string;
  id: number;
  GanadoresFormulaUno: string[];

  constructor(NumeroDeJornada?: number, Fecha?: any, CriterioGanador?: string, id?: number, GanadoresFormulaUno?: string[]) {

    this.NumeroDeJornada = NumeroDeJornada;
    this.Fecha = Fecha;
    this.CriterioGanador = CriterioGanador;
    this.id = id;
    this.GanadoresFormulaUno = GanadoresFormulaUno;

  }
}

export class Jornada {
  Fecha: Date;
  CriterioGanador: string;
  JuegoDeCompeticionLigaId: number;
  id: number;

  constructor(Fecha?: Date, CriterioGanador?: string, JuegoDeCompeticionLigaId?: number) {

    this.Fecha = Fecha;
    this.CriterioGanador = CriterioGanador;
    this.JuegoDeCompeticionLigaId = JuegoDeCompeticionLigaId;
  }
}

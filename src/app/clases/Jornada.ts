export class Jornada {
  Fecha: Date;
  Criterio: string;
  JuegoDeCompeticionLigaId: number;
  id: number;

  constructor(Fecha?: Date, Criterio?: string, JuegoDeCompeticionLigaId?: number) {

    this.Fecha = Fecha;
    this.Criterio = Criterio;
    this.JuegoDeCompeticionLigaId = JuegoDeCompeticionLigaId;
  }
}

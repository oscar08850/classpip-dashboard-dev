export class JuegoDeCompeticion {
  NumeroTotalJornadas: number;
  Tipo: string;
  Modo: string;
  JuegoActivo: boolean;

  constructor(NumeroTotalJornas?: number, Tipo?: string, Modo?: string, JuegoActivo?: boolean) {

    this.Tipo = Tipo;
    this.Modo = Modo;
    this.JuegoActivo = JuegoActivo;
    this.NumeroTotalJornadas = NumeroTotalJornas;
  }
}

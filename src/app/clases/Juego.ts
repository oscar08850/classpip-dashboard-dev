export class Juego {
  Tipo: string;
  Modo: string;
  JuegoActivo: boolean;
  grupoId: number;
  id: number;
  NumeroTotalJornadas: number;
  coleccionId: number;

  constructor(Tipo?: string, Modo?: string, coleccionId?: number, JuegoActivo?: boolean,
              NumeroTotalJornadas?: number) {

    this.Tipo = Tipo;
    this.Modo = Modo;
    this.JuegoActivo = JuegoActivo;
    this.coleccionId = coleccionId;
    this.NumeroTotalJornadas = NumeroTotalJornadas;
  }
}

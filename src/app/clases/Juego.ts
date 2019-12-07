export class Juego {
  Tipo: string;
  Modo: string;
  JuegoActivo: boolean;
  grupoId: number;
  id: number;
  numerodejornadas: number;
  coleccionId: number;
  TipoDeCompeticion: string;

  constructor(Tipo?: string, Modo?: string, coleccionId?: number, JuegoActivo?: boolean,
              TipoDeCompeticion?: string, numerodejornadas?: number) {

    this.Tipo = Tipo;
    this.Modo = Modo;
    this.JuegoActivo = JuegoActivo;
    this.coleccionId = coleccionId;
    this.TipoDeCompeticion = TipoDeCompeticion;
    this.numerodejornadas = numerodejornadas;
  }
}

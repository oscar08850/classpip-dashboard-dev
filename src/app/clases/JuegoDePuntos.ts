export class JuegoDePuntos {

  NombreJuego: string;
  Tipo: string;
  Modo: string;
  JuegoActivo: boolean;
  id: number;
  profesorId: number;
  grupoId: number;

  constructor( NombreJuego?: string, Tipo?: string, Modo?: string, JuegoActivo?: boolean,
               profesorId?: number, grupoId?: number) {

    this.Tipo = Tipo;
    this.Modo = Modo;
    this.NombreJuego = NombreJuego;
    this.JuegoActivo = JuegoActivo;
    this.profesorId = profesorId;
    this.grupoId = grupoId;
  }
}

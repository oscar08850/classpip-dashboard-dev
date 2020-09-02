export class JuegoDeLibros {
    NombreJuego: string;
    Tipo: string;
    Modo: string;
    JuegoActivo: boolean;
    Familias: number[];
    Temporada: string;
    id: number;
    grupoId: number;
    descripcion: string;

    constructor( NombreJuego?: string, Tipo?: string, Modo?: string, JuegoActivo?: boolean,  Temporada?: string,  descripcion?: string) {

      this.Tipo = Tipo;
      this.Modo = Modo;
      this.JuegoActivo = JuegoActivo;
      this.NombreJuego = NombreJuego;
      this.Temporada = Temporada;
    }
  }
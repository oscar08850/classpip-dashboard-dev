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
    criterioprivilegio1: string;
    criterioprivilegio2: string;
    criterioprivilegio3: string;

    constructor( NombreJuego?: string, Tipo?: string, Modo?: string, JuegoActivo?: boolean,  Temporada?: string,  descripcion?: string, criterioprivilegio1?: string, criterioprivilegio2?: string, criterioprivilegio3?: string) {

      this.Tipo = Tipo;
      this.Modo = Modo;
      this.JuegoActivo = JuegoActivo;
      this.NombreJuego = NombreJuego;
      this.Temporada = Temporada;
      this.criterioprivilegio1 =criterioprivilegio1;
      this.criterioprivilegio2 =criterioprivilegio2;
      this.criterioprivilegio3 =criterioprivilegio3;
    }
  }
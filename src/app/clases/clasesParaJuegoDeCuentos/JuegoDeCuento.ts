export class JuegoDeCuento {
    NombreJuego: string;
    Tipo: string;
    Modo: string;
    JuegoActivo: boolean;
    id: number;
    grupoId: number;
    descripcion: string;
    criterioprivilegio1: string;
    criterioprivilegio2: string;
    criterioprivilegio3: string;

    constructor( NombreJuego?: string, Tipo?: string, Modo?: string, JuegoActivo?: boolean,  descripcion?: string, criterioprivilegio1?: string, criterioprivilegio2?: string, criterioprivilegio3?: string) {

      this.Tipo = Tipo;
      this.Modo = Modo;
      this.JuegoActivo = JuegoActivo;
      this.NombreJuego = NombreJuego;
      this.criterioprivilegio1 =criterioprivilegio1;
      this.criterioprivilegio2 =criterioprivilegio2;
      this.criterioprivilegio3 =criterioprivilegio3;
    }
  }
export class JuegoDeVotacionRapida {

    NombreJuego: string;
    Tipo: string;
    Clave: string;
    id: number;
    profesorId: number;
    Conceptos: string[];
    Puntos: number[];

    // tslint:disable-next-line:max-line-length
    constructor(NombreJuego?: string, Tipo?: string, Clave?: string,
                profesorId?: number,  Conceptos?: string[], Puntos?: number[]) {
        this.NombreJuego = NombreJuego;
        this.Tipo = Tipo;
        this.profesorId = profesorId;
        this.Clave = Clave;
        this.Conceptos = Conceptos;
        this.Puntos = Puntos;
    }
}

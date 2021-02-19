export class JuegoDeKahootRapido {

    NombreJuego: string;
    Tipo: string;
    Clave: string;
    TiempoPorPregunta: number;
    Presentacion: string;
    JuegoActivo: boolean;
    JuegoTerminado: boolean;
    id: number;
    profesorId: number;
    cuestionarioId: number;
    Respuestas: any;

    // tslint:disable-next-line:max-line-length
    constructor(NombreJuego?: string, Tipo?: string,  Clave?: string, Presentacion?: string, JuegoActivo?: boolean, JuegoTerminado?: boolean,
                profesorId?: number, cuestionarioId?: number,
                TiempoPorPregunta?: number) {
        this.NombreJuego = NombreJuego;
        this.Tipo = Tipo;
        this.Clave = Clave;
        this.Presentacion = Presentacion;
        this.JuegoActivo = JuegoActivo;
        this.JuegoTerminado = JuegoTerminado;
        this.profesorId = profesorId;
        this.cuestionarioId = cuestionarioId;
        this.TiempoPorPregunta = TiempoPorPregunta;
        this.Respuestas = [];
    }
}

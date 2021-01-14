export class JuegoDeCuestionario {

    NombreJuego: string;
    Tipo: string;
    PuntuacionCorrecta: number;
    PuntuacionIncorrecta: number;
    TiempoLimite: number;
    Presentacion: string;
    JuegoActivo: boolean;
    JuegoTerminado: boolean;
    id: number;
    profesorId: number;
    grupoId: number;
    cuestionarioId: number;

    // tslint:disable-next-line:max-line-length
    constructor(NombreJuego?: string, Tipo?: string, PuntuacionCorrecta?: number, PuntuacionIncorrecta?: number, Presentacion?: string, JuegoActivo?: boolean, JuegoTerminado?: boolean,
                profesorId?: number, grupoId?: number, cuestionarioId?: number,
                TiempoLimite?: number) {
        this.NombreJuego = NombreJuego;
        this.Tipo = Tipo;
        this.PuntuacionCorrecta = PuntuacionCorrecta;
        this.PuntuacionIncorrecta = PuntuacionIncorrecta;
        this.Presentacion = Presentacion;
        this.JuegoActivo = JuegoActivo;
        this.JuegoTerminado = JuegoTerminado;
        this.profesorId = profesorId;
        this.grupoId = grupoId;
        this.cuestionarioId = cuestionarioId;
        this.TiempoLimite = TiempoLimite;
    }
}

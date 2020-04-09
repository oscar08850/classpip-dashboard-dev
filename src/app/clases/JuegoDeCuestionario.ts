export class JuegoDeCuestionario {

    NombreJuego: string;
    PuntuacionCorrecta: number;
    PuntuacionIncorrecta: number;
    Presentacion: string;
    JuegoActivo: boolean;
    JuegoTermiando: boolean;
    id: number;
    profesorId: number;
    grupoId: number;
    cuestionarioId: number;

    constructor(NombreJuego?: string, PuntuacionCorrecta?: number, PuntuacionIncorrecta?: number, Presentacion?: string, JuegoActivo?: boolean, JuegoTerminado?: boolean, profesorId?: number, grupoId?: number, cuestionarioId?: number){
        this.NombreJuego = NombreJuego;
        this.PuntuacionCorrecta = PuntuacionCorrecta;
        this.PuntuacionIncorrecta = PuntuacionIncorrecta;
        this.Presentacion = Presentacion;
        this.JuegoActivo = JuegoActivo;
        this.JuegoTermiando = JuegoTerminado;
        this.profesorId = profesorId;
        this.grupoId = grupoId;
        this.cuestionarioId = cuestionarioId;
    }
}
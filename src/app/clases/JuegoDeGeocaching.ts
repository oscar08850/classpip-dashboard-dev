export class JuegoDeGeocaching {

    NombreJuego: string;
    Tipo: string;
    PuntuacionCorrecta: number;
    PuntuacionIncorrecta: number;
    PuntuacionCorrectaBonus: number;
    PuntuacionIncorrectaBonus: number;
    PreguntasBasicas: number[];
    PreguntasBonus: number[];
    JuegoActivo: boolean;
    JuegoTerminado: boolean;
    id: number;
    profesorId: number;
    grupoId: number;
    idescenario: number;

    // tslint:disable-next-line:max-line-length
    constructor(NombreJuego?: string, Tipo?: string, PuntuacionCorrecta?: number, PuntuacionIncorrecta?: number, PuntuacionCorrectaBonus?: number, PuntuacionIncorrectaBonus?: number, PreguntasBasicas?: number[], PreguntasBonus?: number[], JuegoActivo?: boolean, JuegoTerminado?: boolean, profesorId?: number, grupoId?: number, idescenario?: number) {
        this.NombreJuego = NombreJuego;
        this.Tipo = Tipo;
        this.PuntuacionCorrecta = PuntuacionCorrecta;
        this.PuntuacionIncorrecta = PuntuacionIncorrecta;
        this.PuntuacionCorrectaBonus = PuntuacionCorrectaBonus;
        this.PuntuacionIncorrectaBonus = PuntuacionIncorrectaBonus;
        this.PreguntasBasicas = PreguntasBasicas;
        this.PreguntasBonus = PreguntasBonus;
        this.JuegoActivo = JuegoActivo;
        this.JuegoTerminado = JuegoTerminado;
        this.profesorId = profesorId;
        this.grupoId = grupoId;
        this.idescenario = idescenario;
    }
}

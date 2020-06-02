export class AlumnoJuegoDeGeocaching {

    Puntuacion: number;
    Etapa: number;
    id: number;
    AlumnoId: number;
    juegoDeGeocachingId: number;

    constructor(Puntuacion?: number, Etapa?: number, AlumnoId?: number, juegoDeGeocaching?: number) {
        this.Puntuacion = Puntuacion;
        this.Etapa = Etapa;
        this.AlumnoId = AlumnoId;
        this.juegoDeGeocachingId = juegoDeGeocaching;
    }
}

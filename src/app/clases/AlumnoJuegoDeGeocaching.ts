export class AlumnoJuegoDeGeocaching {

    Puntuacion: number;
    Etapa: number;
    id: number;
    alumnoId: number;
    juegoDeGeocachingId: number;

    constructor(Puntuacion?: number, Etapa?: number, AlumnoId?: number, juegoDeGeocaching?: number) {
        this.Puntuacion = Puntuacion;
        this.Etapa = Etapa;
        this.alumnoId = AlumnoId;
        this.juegoDeGeocachingId = juegoDeGeocaching;
    }
}

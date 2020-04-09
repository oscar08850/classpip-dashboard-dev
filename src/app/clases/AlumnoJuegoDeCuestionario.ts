export class AlumnoJuegoDeCuestionario {

    Nota: number;
    id: number;
    alumnoId: number;
    juegoDeCuestionarioId: number;

    constructor(Nota?: number, juegoDeCuestionarioId?: number, alumnoId?: number){
        this.Nota = Nota;
        this.alumnoId = alumnoId;
        this.juegoDeCuestionarioId = juegoDeCuestionarioId;
    }
}

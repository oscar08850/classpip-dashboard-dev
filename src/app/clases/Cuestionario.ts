export class Cuestionario {
    Titulo: string;
    Descripcion: string;
    Publico: boolean;
    profesorId: number;
    id: number;

    constructor(titulo?: string, descripcion?: string, profesorId?: number) {
        this.Titulo = titulo;
        this.Descripcion = descripcion;
        this.profesorId = profesorId;
        this.Publico = false;
    }
}

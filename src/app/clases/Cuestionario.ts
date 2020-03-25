export class Cuestionario {
    titulo: string;
    descripcion: number;
    profesorId: number;
    id: number;

    constructor(titulo?: string, descripcion?: number){
        this.titulo = titulo;
        this.descripcion = descripcion;
    }
}

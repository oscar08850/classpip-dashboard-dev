export class Escenario {

    Mapa: string;
    Descripcion: string;
    id: number;
    profesorId: number;

    constructor(mapa?: string, descripcion?: string){
        this.Mapa=mapa;
        this.Descripcion=descripcion;
    }
}

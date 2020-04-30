export class PuntoGeolocalizable {
    Latitud: string;
    Longitud: string;
    PistaFacil: string;
    PistaDificil: string;
    id: number;
    idescenario: number;
    profesorId: number;

    constructor(latitud?: string, longitud?: string, pistafacil?: string, pistadificil?: string){
        this.Latitud = latitud;
        this.Longitud = longitud;
        this.PistaFacil = pistafacil;
        this.PistaDificil = pistadificil;
    }
}

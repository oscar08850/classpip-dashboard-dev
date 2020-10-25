import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { TablaHistorialPuntosAlumno } from './clasesParaTablasJuegoDePuntos/TablaHistorialPuntosAlumno';

export class JuegoDeVotacionRapida {

    NombreJuego: string;
    Tipo: string;
    Clave: string;
    id: number;
    profesorId: number;
    Conceptos: string[];
    Puntos: number[];
    Respuestas: any;

    // tslint:disable-next-line:max-line-length
    constructor(NombreJuego?: string, Tipo?: string, Clave?: string,
                profesorId?: number,  Conceptos?: string[], Puntos?: number[]) {
        this.NombreJuego = NombreJuego;
        this.Tipo = Tipo;
        this.profesorId = profesorId;
        this.Clave = Clave;
        this.Conceptos = Conceptos;
        this.Puntos = Puntos;
        this.Respuestas = [];
    }
}

export class JuegoMEMORAMA {

[x: string]: any;
    Tipo: string;
    Modo: string;
    Asignacion: string;
    JuegoActivo: boolean;
    grupoId: number;
    id: number;
    familiaId:number;
    TipoJuegoCompeticion: string;
    NumeroParticipantesPuntuan: number;
    Puntos: number[];
    NombreJuego: string;
    PuntuacionCorrecta: number;
    PuntuacionIncorrecta: number;
    Presentacion: string;
    JuegoTerminado: boolean;
    profesorId: number;
    cuestionarioId: number;
    idcartas:string[];
    puntuacionCorrecta:number;
    puntuacionIncorrecta:number;
    dificultad:string;
    tiempoduracion:number;
  
    constructor(Tipo?: string, Modo?: string,familiaId?:number, JuegoActivo?: boolean, NombreJuego?: string, idcartas?: string[],puntuacionCorrecta?:number,puntuacionIncorrecta?:number,dificultad?:string,tiempoduracion?:number)  
    {
  
      this.Tipo = Tipo;
      this.Modo = Modo;
      this.JuegoActivo = JuegoActivo;
      this.familiaId = familiaId;
      this.NombreJuego = NombreJuego;
      this.idcartas = idcartas;
      this.puntuacionCorrecta= puntuacionCorrecta;
      this.puntuacionIncorrecta=puntuacionIncorrecta;
      this.dificultad=dificultad;
      this.tiempoduracion=tiempoduracion;
    }
}
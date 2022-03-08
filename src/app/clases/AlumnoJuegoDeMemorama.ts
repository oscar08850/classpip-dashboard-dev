export class AlumnoJuegoDeMemorama {

    alumnoId: number;
    juegoDeMemoramaId: number;
    id: number;
    puntuacion:number;
    tiempo:any;
  
    constructor(alumnoId?: number, juegoDePuntosId?: number, puntuacion?:number,tiempo?:any) {
  
      this.alumnoId = alumnoId;
      this.juegoDeMemoramaId = juegoDePuntosId;
      this.puntuacion = puntuacion;
      this.tiempo=tiempo;
  
    }
  }
  
export class TablaAlumnoJuegoDeMemorama {

    posicion: number;
    nombre: string;
    primerApellido: string;
    segundoApellido: string;
    puntuacion: number;
    tiempo:any;
    
  
    constructor(posicion?: number, nombre?: string, primerApellido?: string, segundoApellido?: string, puntuacion?: number, tiempo?:any) {
  
      this.posicion = posicion;
      this.nombre = nombre;
      this.primerApellido = primerApellido;
      this.segundoApellido = segundoApellido;
      this.puntuacion = puntuacion;
      this.tiempo=tiempo;
    }
  }
  
export class TablaAlumnoJuegoDeLingo {

    posicion: number;
    nombre: string;
    primerApellido: string;
    segundoApellido: string;
    puntuacion: number;
    
  
    constructor(posicion?: number, nombre?: string, primerApellido?: string, segundoApellido?: string, puntuacion?: number) {
  
      this.posicion = posicion;
      this.nombre = nombre;
      this.primerApellido = primerApellido;
      this.segundoApellido = segundoApellido;
      this.puntuacion = puntuacion;
    }
  }
  
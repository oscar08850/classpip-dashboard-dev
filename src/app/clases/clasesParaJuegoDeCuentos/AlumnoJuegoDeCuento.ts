export class AlumnoJuegoDeCuento {

    nivel1: boolean;
    nivel2: boolean;
    nivel3: boolean;
    permisoparaver: boolean;
    permisoparavotar: boolean;
    Nombre: string;
    id: number;
    alumnoID: number;
    alumnojuegodecuentoId: number;
  
    constructor(nivel1?: boolean, nivel2?: boolean, nivel3?: boolean, permisoparaver?: boolean, Nombre?: string, alumnoID?: number) {
  
      this.nivel1 = nivel1;
      this.nivel2 = nivel2;
      this.nivel3 = nivel3;
      this.permisoparaver = permisoparaver;
      this.alumnoID = alumnoID;
      this.Nombre = Nombre;
    }
  }
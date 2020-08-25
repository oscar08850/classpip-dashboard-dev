export class AlumnoJuegoDeLibro {

    nivel1: boolean;
    nivel2: boolean;
    nivel3: boolean;
    permisoparaver:boolean ;
    permisoparavotar: boolean;
   
    id: number;
    alumnoId: number;
    juegoDeLibroId: number;
    alumnojuegodecuentoId: any;
  
    constructor(alumnoId?: number, juegoDeLibroId?: number,   alumnojuegodecuentoId?: any)  {
      this.alumnoId = alumnoId;
      this.juegoDeLibroId = juegoDeLibroId;
     this.alumnojuegodecuentoId = alumnojuegodecuentoId;
    }
  }
  
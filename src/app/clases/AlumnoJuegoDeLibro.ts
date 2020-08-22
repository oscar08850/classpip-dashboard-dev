export class AlumnoJuegoDeLibro {

    nivel1: boolean;
    nivel2: boolean;
    nivel3: boolean;
    permisoparaver: string;
    permisoparavotar: string;
   
    id: number;
    alumnoId: number;
    juegoDeLibroId: number;
  
    constructor(alumnoId?: number, juegoDeLibroId?: number) {
      this.alumnoId = alumnoId;
      this.juegoDeLibroId = juegoDeLibroId;
     
    }
  }
  
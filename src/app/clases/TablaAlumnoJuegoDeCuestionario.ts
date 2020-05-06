export class TablaAlumnoJuegoDeCuestionario {

    nombre: string;
    primerApellido: string;
    segundoApellido: string;
    nota: number;
    id: number;
  
    constructor(nombre?: string, primerApellido?: string, segundoApellido?: string,
                nota?: number, id?: number) {
  
      this.nombre = nombre;
      this.primerApellido = primerApellido;
      this.segundoApellido = segundoApellido;
      this.nota = nota;
      this.id = id;
    }
  }
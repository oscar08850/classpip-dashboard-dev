export class TablaAlumnoJuegoDeCuestionario {

    nombre: string;
    primerApellido: string;
    segundoApellido: string;
    nota: number;
    contestado: boolean;
    id: number;

    constructor(nombre?: string, primerApellido?: string, segundoApellido?: string,
                nota?: number, contestado?: boolean, id?: number) {

      this.nombre = nombre;
      this.primerApellido = primerApellido;
      this.segundoApellido = segundoApellido;
      this.nota = nota;
      this.contestado = contestado;
      this.id = id;
    }
  }

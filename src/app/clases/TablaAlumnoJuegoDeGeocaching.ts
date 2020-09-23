export class TablaAlumnoJuegoDeGeocaching {

    nombre: string;
    primerApellido: string;
    segundoApellido: string;
    puntuacion: number;
    etapa: number;
    id: number;

    constructor(nombre?: string, primerApellido?: string, segundoApellido?: string,
                puntuacion?: number, etapa?:number, id?: number) {

      this.nombre = nombre;
      this.primerApellido = primerApellido;
      this.segundoApellido = segundoApellido;
      this.puntuacion = puntuacion;
      this.etapa = etapa;
      this.id = id;
    }
  }

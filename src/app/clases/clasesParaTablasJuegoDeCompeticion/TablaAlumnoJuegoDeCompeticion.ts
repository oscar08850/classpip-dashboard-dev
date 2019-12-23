export class TablaAlumnoJuegoDeCompeticion {

  posicion: number;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  puntos: number;

  constructor(posicion?: number, nombre?: string, primerApellido?: string, segundoApellido?: string, puntos?: number) {

    this.posicion = posicion;
    this.nombre = nombre;
    this.primerApellido = primerApellido;
    this.segundoApellido = segundoApellido;
    this.puntos = puntos;
  }
}

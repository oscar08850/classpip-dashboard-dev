export class TablaEquipoJuegoDeVotacionUnoATodos {

  posicion: number;
  nombre: string;
  puntos: number;
  id: number; // equipoId
  votado: boolean;
  incremento: number;

  constructor(posicion?: number, nombre?: string,
              puntos?: number, id?: number) {

    this.posicion = posicion;
    this.nombre = nombre;
    this.puntos = puntos;
    this.id = id;
    this.votado = false;
    this.incremento = 0;
  }
}

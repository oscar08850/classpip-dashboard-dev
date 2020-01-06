export class TablaEquipoJuegoDeCompeticion {

  posicion: number;
  nombre: string;
  puntos: number;
  id: number;


  constructor(posicion?: number, nombre?: string, puntos?: number, id?: number) {

    this.posicion = posicion;
    this.nombre = nombre;
    this.puntos = puntos;
    this.id = id;
  }
}

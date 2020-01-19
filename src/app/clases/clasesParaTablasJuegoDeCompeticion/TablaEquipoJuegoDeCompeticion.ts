export class TablaEquipoJuegoDeCompeticion {

  posicion: number;
  nombre: string;
  puntos: number;
  id: number;
  partidosTotales: number;
  partidosJugados: number;
  partidosGanador: number;
  partidosEmpatados: number;
  partidosPerdidos: number;


  constructor(posicion?: number, nombre?: string, puntos?: number, id?: number, partidosTotales?: number) {

    this.posicion = posicion;
    this.nombre = nombre;
    this.puntos = puntos;
    this.id = id;
    this.partidosTotales = partidosTotales;
  }
}

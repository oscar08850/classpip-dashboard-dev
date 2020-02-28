export class TablaClasificacionJornada {

  participante: string;
  puntos: number;
  posicion: number;

  constructor(participante?: string, puntos?: number, posicion?: number) {
    this.participante = participante;
    this.puntos = puntos;
    this.posicion = posicion;
  }
}

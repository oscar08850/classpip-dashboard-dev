export class EquipoJuegoDeCompeticionLiga {

  PuntosTotalesEquipo: number;
  equipoId: number;
  juegoDeCompeticionId: number;
  id: number;

  constructor(equipoId?: number, juegoDePuntosId?: number, PuntosTotalesEquipo?: number ) {

    this.equipoId = equipoId;
    this.juegoDeCompeticionId = juegoDePuntosId;
    this.PuntosTotalesEquipo = PuntosTotalesEquipo;

  }
}

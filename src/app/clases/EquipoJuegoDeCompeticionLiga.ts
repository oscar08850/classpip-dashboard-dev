export class EquipoJuegoDeCompeticionLiga {

  PuntosTotalesEquipo: number;
  EquipoId: number;
  JuegoDeCompeticionId: number;
  id: number;

  constructor(EquipoId?: number, JuegoDeCompeticionId?: number, PuntosTotalesEquipo?: number ) {

    this.EquipoId = EquipoId;
    this.JuegoDeCompeticionId = JuegoDeCompeticionId;
    this.PuntosTotalesEquipo = PuntosTotalesEquipo;

  }
}

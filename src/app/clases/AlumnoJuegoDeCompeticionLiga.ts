export class AlumnoJuegoDeCompeticionLiga {

  PuntosTotalesAlumno: number;
  AlumnoId: number;
  JuegoDeCompeticionLigaId: number;
  id: number;

  constructor(AlumnoId?: number, JuegoDeCompeticionLigaId?: number, PuntosTotalesAlumno?: number ) {

    this.PuntosTotalesAlumno = PuntosTotalesAlumno;
    this.AlumnoId = AlumnoId;
    this.JuegoDeCompeticionLigaId = JuegoDeCompeticionLigaId;

  }
}

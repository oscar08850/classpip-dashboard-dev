export class AlumnoJuegoDeCompeticionLiga {

  PuntosTotalesAlumno: number;
  alumnoId: number;
  juegoDeCompeticionId: number;
  id: number;

  constructor(alumnoId?: number, juegoDePuntosId?: number, PuntosTotalesAlumno?: number ) {

    this.alumnoId = alumnoId;
    this.juegoDeCompeticionId = juegoDePuntosId;
    this.PuntosTotalesAlumno = PuntosTotalesAlumno;

  }
}

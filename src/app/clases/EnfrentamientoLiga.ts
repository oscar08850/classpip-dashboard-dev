export class EnfrentamientoLiga {
  JugadorUno: number;
  JugadorDos: number;
  Ganador: number;
  JornadaDeCompeticionLigaId: number;
  id: number;

  constructor(JugadorUno?: number, JugadorDos?: number, Ganador?: number, JornadaDeCompeticionLigaId?: number) {

    this.JugadorUno = JugadorUno;
    this.JugadorDos = JugadorDos;
    this.Ganador = Ganador;
    this.JornadaDeCompeticionLigaId = JornadaDeCompeticionLigaId;
  }
}

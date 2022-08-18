export class AlumnoJuegoDeLingo {



  Contestado: boolean;
  Puntuacion: number;
  id: number;
  alumnoId: number;
  juegoDeLingoId: number;


  constructor(Contestado?: boolean, juegodeLingoId?: number, alumnoId?: number) {
      this.Contestado = Contestado;
      this.alumnoId = alumnoId;
      this.juegoDeLingoId = juegodeLingoId;
  }
}





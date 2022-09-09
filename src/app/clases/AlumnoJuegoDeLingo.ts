export class AlumnoJuegoDeLingo {



  Contestado: boolean;
  Puntuacion: number;
  id: number;
  alumnoId: number;
  juegoDeLingoId: number;


  constructor(Contestado?: boolean, alumnoId?: number, juegodeLingoId?: number) {
      this.Contestado = Contestado;
      this.alumnoId = alumnoId;
      this.juegoDeLingoId = juegodeLingoId;
  }
}





export class JuegoLINGO {
  //Juego de evaluacion
  id: number;
  NombreJuego: string;
  palabraSecreta: string;
  Tipo: string;
  Modo: string;
  JuegoActivo: boolean;
  JuegoTerminado: boolean;
  letras: number;
  intentos: number;
  profesorId: number;
  grupoId: number;

  // tslint:disable-next-line:max-line-length
  //constructor(Tipo: string, NombreJuego: string, Palabra: string,  Modo: string, JuegoActivo: boolean, JuegoTerminado: boolean, letras : number, intentos: number, profesorId: number, grupoId: number) {
  constructor(
    Tipo: string,
    Modo: string,
    Palabra: string,
    JuegoActivo: boolean,
    letras: number,
    intentos: number
  ) {
    this.NombreJuego = "TestNombreJuego";
    this.palabraSecreta = Palabra;
    this.Tipo = Tipo;
    this.Modo = Modo;
    this.JuegoActivo = JuegoActivo;
    this.letras = letras;
    this.intentos = intentos;
    this.JuegoTerminado = true;
     //this.profesorId = profesorId;
    //this.grupoId = grupoId;
  }
}
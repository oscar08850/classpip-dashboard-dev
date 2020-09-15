export class Alumno {
  Nombre: string;
  PrimerApellido: string;
  SegundoApellido: string;
  ImagenPerfil: string;
  PermisoCambioImagenPerfil: boolean;
  profesorId: number;
  id: number;

  constructor(nombre?: string, primerApellido?: string, segundoApellido?: string, imagenPerfil?: string) {

    this.Nombre = nombre;
    this.PrimerApellido = primerApellido;
    this.SegundoApellido = segundoApellido;
    this.ImagenPerfil = imagenPerfil;
    this.PermisoCambioImagenPerfil = false;
  }
}

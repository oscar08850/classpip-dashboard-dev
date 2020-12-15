export class Coleccion {
  Nombre: string;
  ImagenColeccion: string;
  Publica: boolean;
  DosCaras: boolean;
  id: number;
  profesorId: number;

  constructor(nombre?: string, imagenColeccion?: string, dosCaras?: boolean, profesorId?: number) {

    this.Nombre = nombre;
    this.ImagenColeccion = imagenColeccion;
    this.DosCaras = dosCaras;
    this.profesorId = profesorId;
    this.Publica = false;
  }
}

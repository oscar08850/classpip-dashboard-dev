export class FamiliaDeImagenesDePerfil {
  NombreFamilia: string;
  NumeroImagenes: number;
  Imagenes: string[];
  profesorId: number;
  id: number;

  constructor(nombreFamilia?: string, numeroImagenes?: number, imagenes?: string[]) {
    this.NombreFamilia = nombreFamilia;
    this.NumeroImagenes = numeroImagenes;
    this.Imagenes = imagenes;
  }
}

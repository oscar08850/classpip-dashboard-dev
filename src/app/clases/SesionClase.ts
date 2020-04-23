export class SesionClase {
  Dia: string;
  Hora: string;
  Descripcion: string;
  id: number;
  grupoId: number;

  constructor(Dia?: string, Hora?: string,  Descripcion?: string) {

    this.Dia = Dia;
    this.Hora = Hora;
    this.Descripcion = Descripcion;
  }

}

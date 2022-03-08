export class Familia {
    Nombre: string;
    ImagenFamilia: string;
    Publica: boolean;
    id: number;
    profesorId: number;
    relacion: boolean;
  
    constructor(nombre?: string, imagenFamilia?: string, profesorId?: number,relacion?:boolean) {
  
      this.Nombre = nombre;
      this.ImagenFamilia= imagenFamilia;
      this.profesorId = profesorId;
      this.Publica = false;
      this.relacion= relacion;
    }
  }
  
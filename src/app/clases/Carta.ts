export class Carta {
    Nombre: string;
    imagenDelante: string;
    imagenDetras: string;
    id: number;
    familiaId: number;
    relacion: number;
  
    constructor(nombre?: string, imagenDelante?: string, imagenDetras?: string , familiaId?: number , relacion?: number
      ) {
  
      this.Nombre = nombre;
      this.imagenDelante = imagenDelante;
      this.imagenDetras = imagenDetras;
      this.familiaId=familiaId;
      this.relacion=relacion;
    }
  }
  
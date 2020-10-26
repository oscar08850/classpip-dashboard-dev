export class Profesor {
  Nombre: string;
  PrimerApellido: string;
  SegundoApellido: string;
  NombreUsuario: string;
  email: string;
  Password: string;
  ImagenPerfil: string;
  id: number;

  constructor(  Nombre?: string, PrimerApellido?: string, SegundoApellido?: string,
                NombreUsuario?: string, email?: string, Password?: string, ImagenPerfil?: string,
                id?: number) {

    this.Nombre = Nombre;
    this.PrimerApellido = PrimerApellido;
    this.SegundoApellido = SegundoApellido;
    this.NombreUsuario = NombreUsuario;
    this.email = email;
    this.Password = Password;
    this.ImagenPerfil = ImagenPerfil;
    this.id = id;
  }
}

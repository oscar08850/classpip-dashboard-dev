import { Component, OnInit } from '@angular/core';
import { Profesor } from 'src/app/clases';
import {SesionService, PeticionesAPIService, CalculosService, ComServerService} from '../../servicios/index';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-perfil',
  templateUrl: './modificar-perfil.component.html',
  styleUrls: ['./modificar-perfil.component.scss']
})
export class ModificarPerfilComponent implements OnInit {

  profesor: Profesor;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  username: string;
  email: string;
  contrasena: string;
  contrasenaRepetida: string;
  cambio = false;
  cambioPass = false;
  identificador: string;
  imagenPerfil: string;


  constructor(
    private sesion: SesionService,
    private router: Router,
    private peticionesAPI: PeticionesAPIService,
  ) { }

  ngOnInit() {
    this.profesor = this.sesion.DameProfesor();
    this.nombre = this.profesor.Nombre;
    this.primerApellido = this.profesor.PrimerApellido;
    this.segundoApellido = this.profesor.SegundoApellido;
    this.username = this.profesor.NombreUsuario;
    this.email = this.profesor.email;
    this.contrasena = this.profesor.Password;
    this.identificador = this.profesor.Identificador;
    this.imagenPerfil = this.profesor.ImagenPerfil;



  }
  Volver() {
    this.router.navigate(['/inicio/' + this.profesor.id]);

  }
  ValidaEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  ValidaPass(pass) {
    // La contraseña solo puede tener numeros y digitos
    const re = /[^A-Za-z0-9]+/;
    return !re.test(pass);
  }


  Registrar() {
    if ( !this.ValidaPass (this.contrasena)) {
      Swal.fire('Error', 'La contraseña solo puede tener letras y dígitos', 'error');

    } else if (this.cambioPass && (this.contrasena !== this.contrasenaRepetida)) {
      Swal.fire('Error', 'No coincide la contraseña con la contraseña repetida', 'error');
    } else if (!this.ValidaEmail (this.email)) {
      Swal.fire('Error', 'El email no es correcto', 'error');
    } else {

        Swal.fire({
          title: '¿Seguro que quieres modificar los datos?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, estoy seguro'
        }).then((result) => {
          if (result.value) {
              this.profesor.Nombre = this.nombre,
              this.profesor.PrimerApellido = this.primerApellido,
              this.profesor.SegundoApellido = this.segundoApellido,
              this.profesor.NombreUsuario = this.username,
              this.profesor.email = this.email,
              this.profesor.Password = this.contrasena,
              this.profesor.Identificador = this.identificador,
              this.profesor.ImagenPerfil = this.imagenPerfil,
              console.log ('voy a modificar profesor');
              console.log (this.profesor);

              this.peticionesAPI.ModificaProfesor (this.profesor)
              .subscribe (  (res) => Swal.fire('OK', 'Datos modificados', 'success'),
                          (err) => {
                            Swal.fire('Error', 'Fallo en la conexion con la base de datos', 'error');
            });
          }
        });
    }

  }

}

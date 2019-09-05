import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseContentType, Http, Response } from '@angular/http';

// Imports para abrir diálogo confirmar eliminar equipo
import { MatDialog, MatSnackBar, MatTabGroup } from '@angular/material';
import { DialogoConfirmacionComponent } from '../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';

// Import para agregar alumnos al equipo
import { AgregarAlumnoEquipoComponent } from './agregar-alumno-equipo/agregar-alumno-equipo.component';

// Clases
import { Equipo, Alumno, AsignacionEquipo } from '../../clases/index';

// Servicios
import { GrupoService, EquipoService, AlumnoService } from '../../servicios/index';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.scss']
})
export class EquiposComponent implements OnInit {

  // Para el paso finalizar limpiar las variables y volver al mat-tab de "Lista de equipos"
  @ViewChild('stepper') stepper;
  @ViewChild('tabs') tabGroup: MatTabGroup;
  myForm: FormGroup;


  // Como estamos en un mismo controlador y una misma vista, hay que diferenciar las variables de equipo cuando manipulamos
  // la lista y cuando creamos un nuevo equipo

  // LISTAR EQUIPOS
  listaEquipos: Equipo[];
  alumnosEquipo: Alumno[];
  imagenLogo: string;
  equipo: Equipo;

  // CREAR EQUIPO
  alumnosEquipoCreado: Alumno[];
  logo: string;
  equipoCreado: Equipo;

  // Al principio grupo no creado y logo no cargado
  // tslint:disable-next-line:ban-types
  equipoYaCreado: Boolean = false;
  // tslint:disable-next-line:ban-types
  logoCargado: Boolean = false;

  // SEGUNDO PASO (Recupero asignaciones)
  asginacionEquipo: AsignacionEquipo[];

  // Alumnos que ya estan asignados a un equipo. Debemos iniciarlo vacio para que vaya el push
  alumnosConEquipo: Alumno[] = [];

  // Lista con los alumnos del grupo que todavida no tienen equipo. Debemos iniciarlo vacio para que vaya el push
  alumnosSinEquipo: Alumno[] = [];

  // PONEMOS LAS COLUMNAS DE LA TABLA Y LA LISTA QUE TENDRÁ LA INFORMACIÓN QUE QUEREMOS MOSTRAR
  displayedColumns: string[] = ['nombreAlumno', 'primerApellido', 'segundoApellido', 'alumnoId', ' '];


  // COMPARTIDO
  grupoId: number;
  nombreLogo: string;
  file: File;
  alumnosGrupo: Alumno[];


  // PARA DIÁLOGO DE CONFIRMACIÓN
  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres eliminar el equipo llamado: ';


  constructor( private grupoService: GrupoService,
               private equipoService: EquipoService,
               public dialog: MatDialog,
               public snackBar: MatSnackBar,
               private alumnoService: AlumnoService,
               private location: Location,
               private formBuilder: FormBuilder,
               private http: Http
               ) { }

  ngOnInit() {

    // Recogemos el id, los alumnos y los equipos del grupo
    this.grupoId = this.grupoService.RecibirGrupoIdDelServicio();
    this.alumnosGrupo = this.grupoService.RecibirAlumnosGrupoDelServicio();
    this.EquiposDelGrupo();

    // Constructor myForm
    this.myForm = this.formBuilder.group({
      nombreEquipo: ['', Validators.required]
    });
  }


  /////////////////////////////////// FUNCIONES PARA MAT-TAB LISTAR EQUIPOS /////////////////////////////////////////////

  // Coge el identificador del grupo que le pasamos del otro componente a través del servicio y busca los equipos que tiene
  EquiposDelGrupo() {

    this.equipoService.GET_EquiposDelGrupo(this.grupoId)
    .subscribe(res => {
      if (res[0] !== undefined) {

        this.listaEquipos = res;
      } else {
        console.log('Este grupo no tiene equipos');
      }
    });
  }

  // Le pasamos el equipo y buscamos el logo que tiene y sus alumnos
  AlumnosYLogoDelEquipo(equipo: Equipo) {


    // Si el equipo tiene una foto (recordemos que la foto no es obligatoria)
    if (equipo.FotoEquipo !== undefined) {

      // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
      this.http.get('http://localhost:3000/api/imagenes/LogosEquipos/download/' + equipo.FotoEquipo,
      { responseType: ResponseContentType.Blob })
      .subscribe(response => {
        const blob = new Blob([response.blob()], { type: 'image/jpg'});

        const reader = new FileReader();
        reader.addEventListener('load', () => {
          this.imagenLogo = reader.result.toString();
        }, false);

        if (blob) {
          reader.readAsDataURL(blob);
        }
      });

      // Sino la imagenLogo será undefined para que no nos pinte la foto de otro equipo préviamente seleccionado
    } else {
      this.imagenLogo = undefined;
    }


    // Una vez tenemos el logo del equipo seleccionado, buscamos sus alumnos

    // Busca los alumnos del equipo en la base de datos
    this.equipoService.GET_AlumnosEquipo(equipo.id)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.alumnosEquipo = res;

      } else {
        console.log('No hay alumnos en este equipo');
        this.alumnosEquipo = undefined;
      }
    });
  }



  // Una vez seleccionado un equipo, lo podemos editar o eliminar. La primera se activará si clicamos en editar.
  // Envía el equipo y los alumnos de un equipo específico al componente editar-equipo
  EnviarEquipoEditar(equipo: Equipo, alumnosEquipo: Alumno[]) {

    // Envio el equipo al servicio para posteriormente recuperarlo en el componente editar-equipo
    this.equipoService.EnviarEquipoAlServicio(equipo);

    if (alumnosEquipo !== undefined) {
      this.alumnoService.EnviarListaAlumnosAlServicio(alumnosEquipo);
    } else {
      this.alumnoService.EnviarListaAlumnosAlServicio(alumnosEquipo);
      console.log('no hay alumnos en este equipo');
    }
  }

  // Si queremos borrar un equipo, antes nos saldrá un aviso para confirmar la acción como medida de seguridad. Esto se
  // hará mediante un diálogo al cual pasaremos el mensaje y el nombre del equipo
  AbrirDialogoConfirmacionBorrar(equipo: Equipo): void {

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        nombre: equipo.Nombre,
      }
    });

    // Antes de cerrar recogeremos el resultado del diálogo: Borrar (true) o cancelar (false). Si confirmamos, borraremos
    // el equipo (función EliminarEquipo) y mostraremos un snackBar con el mensaje de que se ha eliminado correctamente.
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.EliminarEquipo(equipo);
        this.snackBar.open(equipo.Nombre + ' eliminado correctamente', 'Cerrar', {
          duration: 2000,
        });

      }
    });
  }

  // Esta función borra el equipo que le pasamos como parámetro y actualiza la lista
  EliminarEquipo(equipo: Equipo) {

    this.equipoService.DELETE_EquipoDelGrupo(equipo)
    .subscribe(() => {

      // Borro las asignaicones del equipo ya que no van a servir
      this.EliminarAsignacionesEquipo(equipo);

      // Actualizo la tabla de equipos
      this.EquiposDelGrupo();

    });
  }

  // Esta función recupera todas las asignaciones del equipo que vamos a borrar y después las borra.
  // Esto lo hacemos para no dejar asignaciones a equipos que no nos sirven en la base de datos
  EliminarAsignacionesEquipo(equipo: Equipo) {
    this.equipoService.GET_AsignacionesDelEquipo(equipo)
    .subscribe(asignaciones => {

      if (asignaciones[0] !== undefined) {

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < asignaciones.length; i++) {
          this.equipoService.DELETE_AlumnoEquipo(asignaciones[i])
          .subscribe(() => {
            console.log('asginacion borrada');
          });
        }
      } else {
        console.log('No hay asignaciones a equipos');
      }
    });
  }



  ////////////////////////////////////////// FUNCIONES PARA CREAR EQUIPO /////////////////////////////////////////////


  // Para crear un equipo utilizaremos algunos nuevos parámetros para no mezclar con los utilizados para las listas


  ///////////// PRIMER PASO STEPPER


  // Coge lo que introducimos en el input (el controlador del myForm) y el nombreLogo que le pasamos y hace el POST en
  // la base de datos tanto del equipo como del logo
  CrearEquipo() {

    let nombreEquipo: string;

    nombreEquipo = this.myForm.value.nombreEquipo;

    // Hace el POST del equipo
    this.equipoService.POST_Equipo(new Equipo(nombreEquipo, this.nombreLogo), this.grupoId)
    .subscribe((res) => {
      if (res != null) {

        this.equipoYaCreado = true; // Si tiro atrás y cambio algo se hará un PUT y no otro POST
        this.equipoCreado = res; // Lo metemos en equipoCreado, y no en equipo!!

        // Cuando creo un equipo separo entre alumnos con equipo y sin equipo para el segundo paso
        this.ClasificacionAlumnos();

        // Hago el POST de la imagen SOLO si hay algo cargado. Ese boolean se cambiará en la función ExaminarLogo
        if (this.logoCargado === true) {

          // Hacemos el POST de la nueva imagen en la base de datos recogida de la función ExaminarLogo
          const formData: FormData = new FormData();
          formData.append(this.nombreLogo, this.file);
          this.equipoService.POST_LogoEquipo(formData);
        }

      } else {
        console.log('Fallo en la creación');
      }
    });
  }

  // Activa la función ExaminarLogo
  ActivarInput() {
    document.getElementById('input').click();
  }


  // Buscaremos la imagen en nuestro ordenador y después se mostrará en el form con la variable "logo" y guarda el
  // nombre de la foto en la variable nombreLogo
  ExaminarLogo($event) {
    this.file = $event.target.files[0];
    this.nombreLogo = this.file.name;

    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {

      this.logoCargado = true;
      this.logo = reader.result.toString();
    };
  }


  // Si estamos creando el equipo y pasamos al siguiente paso, pero volvemos hacia atrás para modificar el nombre y/o el
  // logo, entonces no deberemos hacer un POST al darle a siguiente, sino un PUT. Por eso se hace esta función, que funciona
  // de igual manera que la de Crear Equipo pero haciendo un PUT.
  EditarEquipo() {

    let nombreEquipo: string;

    nombreEquipo = this.myForm.value.nombreEquipo;

    this.equipoService.PUT_Equipo(new Equipo(nombreEquipo, this.nombreLogo), this.grupoId, this.equipoCreado.id)
    .subscribe((res) => {
      if (res != null) {

        this.equipoCreado = res;

        // Hago el POST de la imagen SOLO si hay algo cargado
        if (this.logoCargado === true) {
          // HACEMOS EL POST DE LA NUEVA IMAGEN EN LA BASE DE DATOS
          const formData: FormData = new FormData();
          formData.append(this.nombreLogo, this.file);
          this.equipoService.POST_LogoEquipo(formData)
          .subscribe(() => console.log('Logo cargado'));
        }

      } else {
        console.log('fallo editando');
      }
    });
  }


  ///////////// SEGUNDO PASO STEPPER


  // Esta función la activamos cuando creamos el equipo. Nos separará a los alumnos que podemos asignar al nuevo equipo
  ClasificacionAlumnos() {

    // Recogemos las asignaciones del grupo
    this.equipoService.GET_AsignacionesEquipoDelGrupo(this.grupoId)
    .subscribe(asignaciones => {

      // Si hay algun alumno en algun equipo, devolveremos las asignaciones y activaremos la funcion AlumnosAsignables
      if (asignaciones [0] !== undefined) {

        // cuando recibimos las asignaciones las metemos en su lista
        this.asginacionEquipo = asignaciones;
        this.AlumnosAsignables();

        // En el caso de que no haya ningún alumno en ningun grupo, igualmente activamos la función AlumnosAsignables
      } else {

        this.AlumnosAsignables();
      }
    });
  }


  // ESTA FUNCIÓN RECORRE TODA LA LISTA DE LOS ALUMNOS QUE TIENE EL GRUPO Y BUSCA SI YA TIENE ASIGNADO UN EQUIPO O NO.
  // ESTO NOS PERMITIRÁ CREAR DOS LISTAS: UNO CON LOS ALUMNOS QUE YA TIENEN EQUIPO Y OTROS QUE TODAVÍA NO TIENEN.
  AlumnosAsignables() {

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.alumnosGrupo.length; i++) {

      // PRIMERO MIRAMOS SI HAY ALGUNA ASIGNACIÓN HECHA EN ESTE GRUPO O NO. SI NO HAY NINGUNA ASIGNACIÓN A NINGÚN EQUIPO HECHA
      // SIGNIFICA QUE TODOS LOS ALUMNOS DEL GRUPO PUEDEN METERSE EN CUALQUIER EQUIPO. SERÍA ILÓGICO BUSCAR EN ALGO VACÍO
      if (this.asginacionEquipo != null) {

        // EN CASO DE TENER ASIGNADO UN EQUIPO (TRUE) LO INCLUIMOS EN LA LISTA DE ALUMNOS CON EQUIPO
        if (this.BuscarAlumnoAsignacionEquipo(this.alumnosGrupo[i].id) === true) {
          this.alumnosConEquipo.push(this.alumnosGrupo[i]);

          // SI NO ESTA ASIGNADO TODAVIDA A NINGÚN EQUIPO, LO PONEMOS EN LA LISTA DE ALUMNOS SIN EQUIPO
        } else  {
          this.alumnosSinEquipo.push(this.alumnosGrupo[i]);
        }

      // SI NO HAY NINGUNA ASIGNACIÓN HECHA SIGNIFICA QUE TODOS LOS ALUMNOS DEL GRUPO ESTAN SIN EQUIPO
      } else {
        this.alumnosSinEquipo.push(this.alumnosGrupo[i]);
      }
    }
  }


  // ESTA FUNCIÓN NOS DEVOLERÁ UN TRUE O FALSE EN FUNCIÓN DE SI ENCUENTRA UNA ASIGNACIÓN A EQUIPO DEL ALUMNO DEL QUE PASAMOS
  // SU IDENTIFICADOR
  BuscarAlumnoAsignacionEquipo(alumnoId: number): boolean {

    let alumnoEncontrado: boolean;

    // BUSCO DENTRO DE LA LISTA QUE LE PASO AL INICIAR EL COMPONENTE QUE CONTIENE LAS ASIGNACIONES DE ESTE GRUPO
    const asignacion = this.asginacionEquipo.filter(res => res.alumnoId === alumnoId)[0];

    // SI NOS DEVUELVE ALGO, SIGNIFICA QUE ESTE ALUMNO TIENE UNA ASIGNACIÓN A ALGUN EQUIPO EN ESE GRUPO
    if (asignacion !== undefined) {
      alumnoEncontrado = true;

      // SI NOS DEVUELVE UNDEFINED, SIGNIFICA QUE ESE ALUMNO NO TIENE EQUIPO TODAVIA
    } else {
      alumnoEncontrado = false;
    }

    return alumnoEncontrado;
  }


  // SE ABRE EL DIÁLOGO PARA AÑADIR ALUMNOS AL EQUIPO
  AbrirDialogoAgregarAlumnosEquipo(): void {

    const dialogRef = this.dialog.open(AgregarAlumnoEquipoComponent, {
      height: '95%',

      // LE ENVIAMOS LOS ALUMNOS QUE TIENE ACTUALMENTE EL EQUIPO Y LOS QUE PODEMOS AÑADIR, ADEMÁS DEL EQUIPO QUE NOS SERÁ
      // ÚTIL PARA SABER SU ID Y EL ID DEL GRUPO AL QUE PERTENCE
      data: {
        alumnosEquipo: this.alumnosEquipoCreado,
        alumnosSinEquipo: this.alumnosSinEquipo,
        equipo: this.equipoCreado
      }
    });

    // RECUPERAREMOS LA NUEVA LISTA DE LOS ALUMNOS ASIGNABLES Y VOLVEREMOS A BUSCAR LOS ALUMNOS QUE TIENE EL EQUIPO
    dialogRef.afterClosed().subscribe(alumnosEquipo => {

      // Si el usuario clica a aceptar para cerrar el dialogo, se enviarán los alumnos del equipo
      if (alumnosEquipo !== undefined) {
        this.alumnosEquipoCreado = alumnosEquipo;

        // Si clica fuera del diálogo para cerrarlo, recuperaremos la lista de la base de datos
      } else {
        this.AlumnosEquipoCreado();
      }

      // Limpiamos las listas que teniamos antes
      this.alumnosConEquipo = [];
      this.alumnosSinEquipo = [];

      // Volvemos a hacer la clasificación
      this.ClasificacionAlumnos();

    });
  }


  // Utilizaremos esta función para actualizar la lista de alumnosEquipoCreado y, asi, la tabla.
  AlumnosEquipoCreado() {

    // Busca los alumnos del equipo en la base de datos
    this.equipoService.GET_AlumnosEquipo(this.equipoCreado.id)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.alumnosEquipoCreado = res;
        console.log(res);
      } else {
        console.log('No hay alumnos en este equipo');
        this.alumnosEquipoCreado = undefined;
      }
    });
  }





  // Borra al alumno del equipo
  BorrarAlumnoEquipo(alumno: Alumno) {
    console.log('voy a borrar a ' + alumno.id);
    // PRIMERO BUSCO LA ASIGNACIÓN QUE VINCULA EL ALUMNO CON ID QUE PASO COMO PARÁMETRO Y EL EQUIPO EN EL QUE ESTOY
    this.equipoService.GET_AsignacionEquipoAlumno(alumno.id, this.equipoCreado.id, this.equipoCreado.grupoId)
    .subscribe(asignacion => {
      console.log(asignacion);

      // UNA VEZ LO TENGO, BORRO ESA ASIGNACIÓN Y, POR TANTO, EL VÍNCULO ENTRE ALUMNO Y EQUIPO
      if (asignacion[0] !== undefined) {
        this.equipoService.DELETE_AlumnoEquipo(asignacion[0]).subscribe(res => {
          console.log(res);
          // SI SE BORRA CORRECTAMENTE NOS DEVUELVE NULL
          if (res === null) {
            console.log('eliminado correctamente');
            this.AlumnosEquipoCreado(); // ACTUALIZAMOS LA TABLA
            this.AlumnoBorrado(alumno); // ACTUALIZAMOS LA LISTA DE ALUMNOS CON/SIN EQUIPO
          } else {
            console.log('No se ha podido eliminar');
          }
        });
      } else {
        console.log('no se ha encontrado la asignación');
        }
      });
  }

  // Borra al alumno de alumnosConEquipo y lo pone en alumnosSinEquipo
  AlumnoBorrado(alumno: Alumno): Alumno[] {
    this.alumnosConEquipo = this.alumnosConEquipo.filter(res => res.id !== alumno.id);
    this.alumnosSinEquipo.push(alumno);
    return this.alumnosConEquipo;
  }


  ///////////// TERCER PASO STEPPER

  // Función que se activará al clicar en finalizar el último paso del stepper
  Finalizar() {

        // Actualizamos la tabla de equipos con el equipo nuevo
    this.EquiposDelGrupo();

    // Regresamos a la lista de equipos (mat-tab con índice 0)
    this.tabGroup.selectedIndex = 0;

    // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
    this.myForm.reset();
    this.stepper.reset();

    // Tambien limpiamos las variables utilizadas para crear el nuevo equipo, por si queremos crear otro.
    this.equipoYaCreado = false;
    this.logoCargado = false;
    this.logo = undefined;
    this.alumnosEquipoCreado = undefined;
    this.equipoCreado = undefined;
    this.alumnosConEquipo = [];
    this.alumnosGrupo = [];

  }

  // NOS DEVOLVERÁ A LA DE LA QUE VENIMOS
  goBack() {
    this.location.back();
  }
}

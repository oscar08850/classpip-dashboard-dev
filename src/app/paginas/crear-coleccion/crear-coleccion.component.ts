import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Imports para abrir diálogo confirmar eliminar equipo
import { MatDialog, MatSnackBar, MatTabGroup } from '@angular/material';

// Servicios
import { ColeccionService, ProfesorService } from '../../servicios/index';

// Clases
import { Coleccion, Cromo } from '../../clases/index';

export interface OpcionSeleccionada {
  nombre: string;
  id: string;
}

@Component({
  selector: 'app-crear-coleccion',
  templateUrl: './crear-coleccion.component.html',
  styleUrls: ['./crear-coleccion.component.scss']
})
export class CrearColeccionComponent implements OnInit {

  // Para el paso finalizar limpiar las variables y volver al mat-tab de "Lista de equipos"
  @ViewChild('stepper') stepper;
  @ViewChild('tabs') tabGroup: MatTabGroup;
  myForm: FormGroup;
  myForm2: FormGroup;


  // CREAR COLECCION
  imagen: string;
  coleccionCreada: Coleccion;
  nombreColeccion: string;

  // CREAR CROMO
  nombreCromo: string;
  probabilidadCromo: string;
  nivelCromo: string;
  imagenCromo: string;
  cromosAgregados: Cromo [] = [];
  // tslint:disable-next-line:ban-types
  isDisabledCromo: Boolean = true;

  // COMPARTIDO
  profesorId: number;
  nombreImagen: string;
  file: File;

  nombreImagenCromo: string;
  fileCromo: File;

  // Al principio coleccion no creada y imagen no cargada
  // tslint:disable-next-line:ban-types
  coleccionYaCreada: Boolean = false;
  // tslint:disable-next-line:ban-types
  imagenCargado: Boolean = false;
  // tslint:disable-next-line:ban-types
  imagenCargadoCromo: Boolean = false;



    // Opciones para mostrar en la lista desplegable para seleccionar el tipo de probabilidad que listar
    opcionesProbabilidad: OpcionSeleccionada[] = [
      {nombre: 'Muy Baja', id: 'Muy Baja'},
      {nombre: 'Baja', id: 'Baja'},
      {nombre: 'Media', id: 'Media'},
      {nombre: 'Alta', id: 'Alta'},
      {nombre: 'Muy Alta', id: 'Muy Alta'},

    ];

    opcionSeleccionadaProbabilidad: string;

      // Opciones para mostrar en la lista desplegable para seleccionar el tipo de nivel que listar
    opcionesNivel: OpcionSeleccionada[] = [
        {nombre: 'Diamante', id: 'Diamante'},
        {nombre: 'Platino', id: 'Platino'},
        {nombre: 'Oro', id: 'Oro'},
        {nombre: 'Plata', id: 'Plata'},
        {nombre: 'Bronce', id: 'Bronce'},
    ];
    opcionSeleccionadaNivel: string;


  // PONEMOS LAS COLUMNAS DE LA TABLA Y LA LISTA QUE TENDRÁ LA INFORMACIÓN QUE QUEREMOS MOSTRAR
  displayedColumns: string[] = ['nombreCromo', 'probabilidadCromo', 'nivelCromo', ' '];



  constructor(
    private coleccionService: ColeccionService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private formBuilder: FormBuilder) { }

  ngOnInit() {

    // REALMENTE LA APP FUNCIONARÁ COGIENDO AL PROFESOR DEL SERVICIO, NO OBSTANTE AHORA LO RECOGEMOS DE LA URL
    // this.profesorId = this.profesorService.RecibirProfesorIdDelServicio();
    this.profesorId = Number (this.route.snapshot.paramMap.get('id'));


    // Constructor myForm
    this.myForm = this.formBuilder.group({
     nombreColeccion: ['', Validators.required]
    });
    this.myForm2 = this.formBuilder.group({
      nombreCromo : ['', Validators.required]
     });
  }

  pr() {
    console.log('hoo');
  }
  // Creamos una coleccion dandole un nombre y una imagen
  CrearColeccion() {

    let nombreColeccion: string;

    nombreColeccion = this.myForm.value.nombreColeccion;

    console.log('Entro a crear la coleccion ' + nombreColeccion);
    console.log(this.nombreImagen);

    // Hace el POST del equipo
    this.coleccionService.POST_Coleccion(new Coleccion(nombreColeccion, this.nombreImagen), this.profesorId)
    .subscribe((res) => {
      if (res != null) {
        console.log(res);
        this.coleccionYaCreada = true; // Si tiro atrás y cambio algo se hará un PUT y no otro POST
        this.coleccionCreada = res; // Lo metemos en coleccionCreada, y no en coleccion!!

        // Hago el POST de la imagen SOLO si hay algo cargado. Ese boolean se cambiará en la función ExaminarImagen
        if (this.imagenCargado === true) {

          // Hacemos el POST de la nueva imagen en la base de datos recogida de la función ExaminarImagen
          const formData: FormData = new FormData();
          formData.append(this.nombreImagen, this.file);
          this.coleccionService.POST_ImagenColeccion(formData)
          .subscribe(() => console.log('Imagen cargado'));
        }

      } else {
        console.log('Fallo en la creación');
      }
    });
  }

  // Si estamos creando la coleccion y pasamos al siguiente paso, pero volvemos hacia atrás para modificar el nombre y/o el
  // imagen, entonces no deberemos hacer un POST al darle a siguiente, sino un PUT. Por eso se hace esta función, que funciona
  // de igual manera que la de Crear Equipo pero haciendo un PUT.
  EditarColeccion() {

    console.log('Entro a editar');
    let nombreColeccion: string;

    nombreColeccion = this.myForm.value.nombreColeccion;

    this.coleccionService.PUT_Coleccion(new Coleccion(nombreColeccion, this.nombreImagen), this.profesorId, this.coleccionCreada.id)
    .subscribe((res) => {
      if (res != null) {
        console.log('Voy a editar la coleccion con id ' + this.coleccionCreada.id);
        this.coleccionCreada = res;

        // Hago el POST de la imagen SOLO si hay algo cargado
        if (this.imagenCargado === true) {
          // HACEMOS EL POST DE LA NUEVA IMAGEN EN LA BASE DE DATOS
          const formData: FormData = new FormData();
          formData.append(this.nombreImagen, this.file);
          this.coleccionService.POST_ImagenColeccion(formData)
          .subscribe(() => console.log('Imagen cargada'));
        }

      } else {
        console.log('fallo editando');
      }
    });
  }

  // Creamos una cromo y lo añadimos a la coleccion dandole un nombre, una probabilidad, un nivel y una imagen
  AgregarCromoColeccion() {

    console.log('Entro a asignar el cromo ' + this.nombreCromo);
    console.log('Entro a asignar el cromo a la coleccionID' + this.coleccionCreada.id);
    console.log(this.nombreImagenCromo );

    this.coleccionService.POST_CromoColeccion(
      new Cromo(this.nombreCromo, this.nombreImagenCromo , this.probabilidadCromo, this.nivelCromo), this.coleccionCreada.id)
    .subscribe((res) => {
      if (res != null) {
        console.log('asignado correctamente');
        this.CromosAgregados(res);

         // Hago el POST de la imagen SOLO si hay algo cargado. Ese boolean se cambiará en la función ExaminarImagenCromo
        if (this.imagenCargadoCromo === true) {

          // Hacemos el POST de la nueva imagen en la base de datos recogida de la función ExaminarImagenCromo
          const formData: FormData = new FormData();
          formData.append(this.nombreImagenCromo, this.fileCromo);
          this.coleccionService.POST_ImagenCromo(formData)
          .subscribe(() => console.log('Imagen cargado'));
        }
        this.LimpiarCampos();
      } else {
        console.log('fallo en la asignación');
      }
    });
  }
  // Lista de los cromos añadidos a la coleccion
  CromosAgregados(cromo: Cromo) {
    this.cromosAgregados.push(cromo);
    this.cromosAgregados = this.cromosAgregados.filter(res => res.Nombre !== '');
    return this.cromosAgregados;
  }

  // Utilizamos esta función para eliminar un cromo de la base de datos y de la lista de añadidos recientemente
  BorrarCromo(cromo: Cromo) {
    console.log('Id cromo ' + this.coleccionCreada.id);
    this.coleccionService.DELETE_Cromo(cromo.id, this.coleccionCreada.id)
    .subscribe(() => {
      this.CromosEliminados(cromo);
      console.log('Cromo borrado correctamente');

    });
  }
  // Elimina el cromo de la lista de añadidos a la coleccion
  CromosEliminados(cromo: Cromo) {
    this.cromosAgregados = this.cromosAgregados.filter(res => res.id !== cromo.id);
    return this.cromosAgregados;
  }

  // Activa la función ExaminarImagenColeccion
  ActivarInputColeccion() {
    console.log('Activar input');
    document.getElementById('inputColeccion').click();
  }

    // Activa la función ExaminarImagenCromo
  ActivarInputCromo() {
    console.log('Activar input');
    document.getElementById('inputCromo').click();
  }


  // Buscaremos la imagen en nuestro ordenador y después se mostrará en el form con la variable "imagen" y guarda el
  // nombre de la foto en la variable nombreImagen
  ExaminarImagenColeccion($event) {
    this.file = $event.target.files[0];
    console.log('fichero ' + this.file.name);
    this.nombreImagen = this.file.name;
    this.nombreImagenCromo = this.file.name;

    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {

      console.log('ya');
      this.imagenCargado = true;
      this.imagen = reader.result.toString();
    };
  }

  ExaminarImagenCromo($event) {
    this.fileCromo = $event.target.files[0];

    console.log('fichero ' + this.fileCromo.name);
    this.nombreImagenCromo = this.fileCromo.name;

    const reader = new FileReader();
    reader.readAsDataURL(this.fileCromo);
    reader.onload = () => {
      console.log('ya Cromo');
      this.imagenCargadoCromo = true;
      this.imagenCromo = reader.result.toString();
    };
  }

  // Una vez seleccionada la probabilidad se asigna a la varible del cromo
  OpcionProbabilidadSeleccionada() {
    // Opcion selecionada para probabilidad
    if (this.opcionSeleccionadaProbabilidad === 'Muy Baja') {
      this.probabilidadCromo = 'Muy Baja';
    }
    if (this.opcionSeleccionadaProbabilidad === 'Baja') {
      this.probabilidadCromo = 'Baja';
    }

    if (this.opcionSeleccionadaProbabilidad === 'Media') {
      this.probabilidadCromo = 'Media';
    }

    if (this.opcionSeleccionadaProbabilidad === 'Alta') {
      this.probabilidadCromo = 'Alta';
    }

    if (this.opcionSeleccionadaProbabilidad === 'Muy Alta') {
      this.probabilidadCromo = 'Muy Alta';
    }
  }

  OpcionNivelSeleccionado() {
    console.log(this.opcionSeleccionadaNivel);
    // Opcion selecionada para nivel
    if (this.opcionSeleccionadaNivel === 'Diamante') {
      this.nivelCromo = 'Diamante';
      this.probabilidadCromo = 'Muy Baja';
      this.opcionSeleccionadaProbabilidad = 'Muy Baja';

    }
    if (this.opcionSeleccionadaNivel === 'Platino') {
      this.nivelCromo = 'Platino';
      this.probabilidadCromo = 'Baja';
      this.opcionSeleccionadaProbabilidad = 'Baja';
    }

    if (this.opcionSeleccionadaNivel === 'Oro') {
      this.nivelCromo = 'Oro';
      this.probabilidadCromo = 'Media';
      this.opcionSeleccionadaProbabilidad = 'Media';
    }

    if (this.opcionSeleccionadaNivel === 'Plata') {
      this.nivelCromo = 'Plata';
      this.probabilidadCromo = 'Alta';
      this.opcionSeleccionadaProbabilidad = 'Alta';
    }

    if (this.opcionSeleccionadaNivel === 'Bronce') {
      this.nivelCromo = 'Bronce';
      this.probabilidadCromo = 'Muy Alta';
      this.opcionSeleccionadaProbabilidad = 'Muy Alta';
    }
  }

  // Limpiamos los campos del cromo
  LimpiarCampos() {
      this.nombreCromo = undefined;
      this.probabilidadCromo = undefined;
      this.nivelCromo = null;
      this.isDisabledCromo = true;
      this.imagenCargadoCromo = false;
      this.imagenCromo = undefined;
      this.nombreImagenCromo = undefined;
      this.opcionSeleccionadaProbabilidad = null;
      this.opcionSeleccionadaNivel = null;
  }

  // Esta función se utiliza para controlar si el botón de siguiente del stepper esta desativado.
  // Si en alguno de los inputs no hay nada, esta disabled. Sino, podremos clicar.
  Disabled() {

  if (this.nombreCromo === undefined || this.probabilidadCromo === undefined || this.nivelCromo === undefined ||
        this.nivelCromo === '' || this.probabilidadCromo === '' || this.nivelCromo === null) {
        this.isDisabledCromo = true;
  } else {
        this.isDisabledCromo = false;
    }
  }
    // Función que se activará al clicar en finalizar el último paso del stepper
  Finalizar() {
      // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
      this.myForm.reset();
      this.myForm2.reset();
      this.stepper.reset();

      // Tambien limpiamos las variables utilizadas para crear el nueva coleccion, por si queremos crear otra.
      this.coleccionYaCreada = false;
      this.imagenCargado = false;
      this.imagen = undefined;
      this.imagenCargadoCromo = false;
      this.imagenCromo = undefined;
      this.coleccionCreada = undefined;
      this.cromosAgregados = [];

  }
}

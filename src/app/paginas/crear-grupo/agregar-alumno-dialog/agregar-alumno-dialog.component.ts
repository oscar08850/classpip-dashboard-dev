import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
// Servicios
import {PeticionesAPIService} from '../../../servicios/index';

// Clases
import { Grupo, Alumno, Matricula } from '../../../clases/index';

@Component({
  selector: 'app-agregar-alumno-dialog',
  templateUrl: './agregar-alumno-dialog.component.html',
  styleUrls: ['./agregar-alumno-dialog.component.scss']
})
export class AgregarAlumnoDialogComponent implements OnInit {

  // PONEMOS LAS COLUMNAS DE LA TABLA Y LA LISTA QUE TENDRÁ LA INFORMACIÓN QUE QUEREMOS MOSTRAR (alumnosEquipo) y (alumnosAsignables)
  displayedColumns: string[] = ['nombreAlumno', 'primerApellido', 'segundoApellido', 'alumnoId', ' '];

  alumno: Alumno;
  alumnosAgregados: Alumno[] = []; // Inicializamos vacio
  grupoId: number;
  profesorId: number;


  // Declaramos el FormGroup que tendrá los tres controladores que recibirán los parámetros de entrada
  myForm: FormGroup;
  myForm2: FormGroup;

  constructor(
              private formBuilder: FormBuilder,
              private peticionesAPI: PeticionesAPIService,
              public dialogRef: MatDialogRef<AgregarAlumnoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

    // Recogemos los datos que le pasamos desde el componente que nos llama
    // Podríamos recogerlos de la sesión, pero en el caso de los dialogos
    // estamos usando el mecanismo de pasarle parametos, que es sencillo
    this.grupoId = this.data.grupoId;
    this.profesorId = this.data.profesorId;

    // Usaremos dos formularios, que tienen los campos que se indican

    this.myForm = this.formBuilder.group({
      nombreAlumno: ['', Validators.required],
      primerApellido: ['', Validators.required],
      segundoApellido: ['', Validators.required],
      textoAlumnos: ['', Validators.required],
    });

    this.myForm2 = this.formBuilder.group({
      textoAlumnos: ['', Validators.required],
    });

  }

  // Esta función es la que se llama desde el formulario cuando ya hemos introducido
  // los datos del alumno que vamos a asignar
  // Simplemente preparamos el alumno y llamamos a la función de asignar alumno
  AsignacionIndividual() {
    console.log('voy a entrar a buscar alumno');

    const nombreAlumno = this.myForm.value.nombreAlumno;
    const primerApellido = this.myForm.value.primerApellido;
    const segundoApellido = this.myForm.value.segundoApellido;
    const alumno = new Alumno (nombreAlumno, primerApellido, segundoApellido);
    this.AsignaAlumno (alumno);
  }

  // Para asignar al alumno primero vemos si ya está en la base de datos
  // en cuyo caso ya podemos matricularlo directamente en el grupo
  // o si no está en la base de datos, en cuyo caso hay que ponerlo en la base
  // de datos antes de matricularlo
  AsignaAlumno(alumno: Alumno) {

    this.peticionesAPI.DameAlumnoConcreto(alumno, this.profesorId)
      .subscribe((respuesta) => {
        if (respuesta[0] !== undefined) {
          // el alumno ya está en la base de datos
          console.log ('Ya esta en la base de datos');
          this.MatricularAlumno(respuesta[0] );
       } else {
          // el alumno no está en la base de datos.
          console.log ('NO esta en la base de datos');
          this.AgregarAlumnoNuevoGrupo(alumno );
        }
      });
  }


  // Esta función es la que se llama desde el formulario cuando están preparados los
  // datos de los alumnos para asignación masiva
  // Simplemente procesamos la linea de texto con los nombres de los alumnos para
  // asignarlos uno a uno

  AsignacionMasiva() {

    let textoAlumnos: string;

    textoAlumnos = this.myForm2.value.textoAlumnos;

    for (let i = 0; i < textoAlumnos.split(';').length; i++) {
      // Vamos a preparar el siguiente alumno
        const nombreCompleto = textoAlumnos.split('; ')[0 + i];
        const nombreAlumno = nombreCompleto.split(' ')[0];
        const primerApellido = nombreCompleto.split(' ')[1];
        const segundoApellido = nombreCompleto.split(' ')[2];
        const alumno = new Alumno (nombreAlumno, primerApellido, segundoApellido);
        console.log(nombreCompleto);
        this.AsignaAlumno (alumno);
    }
  }


   // Para matricularlo enviamos la matricula a la base de datos y
   // agregamos al alumno en la lista de alumnos inscritos que se muestra en pantalla
   MatricularAlumno(alumno: Alumno) {
    this.peticionesAPI.MatriculaAlumnoEnGrupo(new Matricula (alumno.id, this.grupoId))
    .subscribe((resMatricula) => {
      if (resMatricula != null) {
        // Añadimos el alumno a la lista que hay que mostrar
        this.alumnosAgregados.push(alumno);
        this.alumnosAgregados = this.alumnosAgregados.filter(res => res.Nombre !== '');
        this.myForm.reset();
      } else {
        // Aqui habria que mostrar algun mensaje al usuario
        console.log('fallo en la matriculación');
      }
    });

  }
  // Si el alumno no está en la base de datos lo enviamos a la base de datos (asignado al profesor)
  // y lo matriculamos en el grupo
  AgregarAlumnoNuevoGrupo(alumno: Alumno) {
    this.peticionesAPI.AsignaAlumnoAlProfesor( alumno, this.profesorId)
      .subscribe(res => {
        if (res != null) {
          console.log('Voy a añadir a ' + res);
          this.MatricularAlumno(res);

        } else {
          // Aqui habria que mostrar algun mensaje al usuario

          console.log('fallo añadiendo');
        }
      });
  }



  // Para borrar al alumno del grupo primero recuperamos la matricula del alumno en el grupo
  // y luego eliminamos esa matricula
  BorrarAlumno(alumno: Alumno) {
    console.log('voy a borrar a ' + alumno.id);
    console.log(alumno.Nombre + ' seleccionado');

    // Recupero la matrícula del alumno en este grupo
    this.peticionesAPI.DameMatriculaAlumno(alumno.id, this.grupoId)
    .subscribe(matricula => {
          console.log('Doy la matricula de ' + alumno.Nombre);
          console.log(matricula[0]);

          // Una vez recupero la matrícula, la borro
          this.peticionesAPI.BorraMatricula(matricula[0].id)
          .subscribe(res => {
            console.log(alumno.Nombre + ' borrado correctamente');
            // Ahora saco al alumno de la tabla que se muestra en pantalla
            const id = alumno.id;
            // tslint:disable-next-line:no-shadowed-variable
            this.alumnosAgregados = this.alumnosAgregados.filter(alumno => alumno.id !== id);

          });
        });
  }

}

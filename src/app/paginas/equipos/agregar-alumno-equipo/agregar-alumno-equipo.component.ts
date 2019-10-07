import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// Servicios
import {EquipoService, MatriculaService} from '../../../servicios/index';


// Servicios
import {PeticionesAPIService} from '../../../servicios/index';

// Clases
import { Alumno, AsignacionEquipo, Equipo } from '../../../clases/index';

@Component({
  selector: 'app-agregar-alumno-equipo',
  templateUrl: './agregar-alumno-equipo.component.html',
  styleUrls: ['./agregar-alumno-equipo.component.scss']
})
export class AgregarAlumnoEquipoComponent implements OnInit {

  // PONEMOS LAS COLUMNAS DE LA TABLA Y LA LISTA QUE TENDRÁ LA INFORMACIÓN QUE QUEREMOS MOSTRAR (alumnosEquipo) y (alumnosAsignables)
  displayedColumns: string[] = ['nombreAlumno', 'primerApellido', 'segundoApellido', 'alumnoId', ' '];

  // Lista con los alumnos del grupo que todavida no tienen equipo. Debemos iniciarlo vacio para que vaya el push
  alumnosSinEquipo: Alumno[] = [];

  // Equipo seleccionado
  equipo: Equipo;

  // alumnos del equipo
  alumnosEquipo: Alumno[] = [];

  constructor( public dialogRef: MatDialogRef<AgregarAlumnoEquipoComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private equipoService: EquipoService,
               private peticionesAPI: PeticionesAPIService) {

               dialogRef.disableClose = true;
               }

  ngOnInit() {

    this.equipo = this.data.equipo;
    this.alumnosSinEquipo = this.data.alumnosSinEquipo;
  }

  // Meto al alumno con el id que paso como parámetro en el equipo
  AgregarAlumnosEquipo(alumnoId: number) {

    this.peticionesAPI.PonAlumnoEquipo(new AsignacionEquipo(alumnoId, this.equipo.id), this.equipo.grupoId)
    .subscribe((res) => {
      if (res != null) {
        this.AlumnosDelEquipo(this.equipo.id); // Para actualizar la tabla
        // Borramos al alumno de la lista de alumnos sin equipo
        this.alumnosSinEquipo = this.alumnosSinEquipo.filter(alumno => alumno.id !== alumnoId);

        console.log('asignado correctamente');

      } else {
        console.log('fallo en la asignación');
      }
    });

  }

  // LE PASAMOS EL IDENTIFICADOR DEL GRUPO Y BUSCAMOS LOS ALUMNOS QUE TIENE
  AlumnosDelEquipo(equipoId: number) {

    this.peticionesAPI.DameAlumnosEquipo(equipoId)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.data.alumnosEquipo = res;
        console.log(this.data.alumnosEquipo);
      } else {
        console.log('No hay alumnos en este grupo');
      }
    });
  }

/*
  // Añadimos a la lista de alumnos sin equipo al alumno que paso como parámetro
  AgregarAlumnoListaSinEquipo(alumno: Alumno): Alumno[] {
    this.alumnosSinEquipo.push(alumno);

    // Hacemos esto para que nos actualice la tabla. No se sabe por que al hacer el push actualiza la lista pero no la
    // tabla. Asi que hacemos un filtrado que nos devuelve la lista excepto el alumno con nombre '' (cosa que no puede pasar)
    this.alumnosSinEquipo = this.alumnosSinEquipo.filter(res => res.Nombre !== '');

    return this.alumnosSinEquipo;
  } */

  // Borro al alumno del equipo mediante la base de datos
  BorrarAlumnoEquipo(alumno: Alumno) {
    console.log('voy a borrar a ' + alumno.id);
    // PRIMERO BUSCO LA ASIGNACIÓN QUE VINCULA EL ALUMNO CON ID QUE PASO COMO PARÁMETRO Y EL EQUIPO EN EL QUE ESTOY
    this.peticionesAPI.DameAsignacionEquipoAlumno(alumno.id, this.equipo.id, this.equipo.grupoId)
    .subscribe(asignacion => {
      console.log(asignacion);

      // UNA VEZ LO TENGO, BORRO ESA ASIGNACIÓN Y, POR TANTO, EL VÍNCULO ENTRE ALUMNO Y EQUIPO
      if (asignacion[0] !== undefined) {
        this.peticionesAPI.BorraAlumnoEquipo(asignacion[0]).subscribe(res => {
          console.log(res);
          // SI SE BORRA CORRECTAMENTE NOS DEVUELVE NULL
          if (res === null) {
            console.log('eliminado correctamente');
            this.AlumnosDelEquipo(this.equipo.id); // ACTUALIZAMOS LA TABLA ALUMNOS DEL EQUIPO
            // Actualizamos la lista de alumnos sin equipo
            this.alumnosSinEquipo.push(alumno);
            // Hacemos esto para que nos actualice la tabla. No se sabe por que al hacer el push actualiza la lista pero no la
            // tabla. Asi que hacemos un filtrado que nos devuelve la lista excepto el alumno con nombre '' (cosa que no puede pasar)
            this.alumnosSinEquipo = this.alumnosSinEquipo.filter(result => result.Nombre !== '');
            //this.AgregarAlumnoListaSinEquipo(alumno); // ACTUALIZAMOS LA TABLA ALUMNOS SIN EQUIPO
            console.log(this.alumnosSinEquipo);
          } else {
            console.log('No se ha podido eliminar');
          }
        });
      } else {
        console.log('no se ha encontrado la asignación');
        }
      });
  }
}

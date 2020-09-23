import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialog, MatTabGroup } from '@angular/material';
import Swal from 'sweetalert2';
// Servicios
import {PeticionesAPIService} from '../../../servicios/index';
import { Location } from '@angular/common';

// Clases
import { Grupo, Alumno, Matricula } from '../../../clases/index';
import {MatTableDataSource} from '@angular/material/table';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';


@Component({
  selector: 'app-agregar-alumno-dialog',
  templateUrl: './agregar-alumno-dialog.component.html',
  styleUrls: ['./agregar-alumno-dialog.component.scss']
})
export class AgregarAlumnoDialogComponent implements OnInit {

  // PONEMOS LAS COLUMNAS DE LA TABLA Y LA LISTA QUE TENDRÁ LA INFORMACIÓN QUE QUEREMOS MOSTRAR (alumnosEquipo) y (alumnosAsignables)
  displayedColumnsMisAlumnos: string[] = ['nombre', 'primerApellido', 'segundoApellido', ' '];
  dataSourceMisAlumnos;
  misAlumnos: Alumno[] = [];

  displayedColumnsAlumnosDelGrupo: string[] = ['nombre', 'primerApellido', 'segundoApellido', ' '];
  dataSourceAlumnosDelGrupo;
  alumnosDelGrupo: Alumno[] = [];

  alumno: Alumno;

  grupoId: number;
  profesorId: number;
  mensaje = 'Confirma que quieres quitar del grupo a ';

  constructor(
              public dialog: MatDialog,
              public location: Location,
              private peticionesAPI: PeticionesAPIService,
              public dialogRef: MatDialogRef<AgregarAlumnoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

    // Recogemos los datos que le pasamos desde el componente que nos llama
    // Podríamos recogerlos de la sesión, pero en el caso de los dialogos
    // estamos usando el mecanismo de pasarle parametos, que es sencillo
    this.grupoId = this.data.grupoId;
    this.profesorId = this.data.profesorId;


    this.peticionesAPI.DameTodosMisAlumnos (this.profesorId )
    .subscribe ( res => {
                          this.misAlumnos = res;
                          this.misAlumnos.sort((a, b) => a.PrimerApellido.localeCompare(b.PrimerApellido));

                          this.dataSourceMisAlumnos = new MatTableDataSource (this.misAlumnos);

                        }
    );

    this.peticionesAPI.DameAlumnosGrupo (this.grupoId)
    .subscribe ( res => {
                          this.alumnosDelGrupo = res;
                          this.alumnosDelGrupo.sort((a, b) => a.PrimerApellido.localeCompare(b.PrimerApellido));

                          this.dataSourceAlumnosDelGrupo = new MatTableDataSource (this.alumnosDelGrupo);

                        }
    );

  }

  applyFilterMisAlumnos(filterValue: string) {
    this.dataSourceMisAlumnos.filter = filterValue.trim().toLowerCase();
  }

  applyFilterAlumnosDelGrupo(filterValue: string) {
    this.dataSourceAlumnosDelGrupo.filter = filterValue.trim().toLowerCase();
  }



  AsignarAlumno(alumno: Alumno) {
    // tslint:disable-next-line:max-line-length
    const found = this.alumnosDelGrupo.find (a => a.Nombre === alumno.Nombre &&  a.PrimerApellido === alumno.PrimerApellido && a.SegundoApellido === alumno.SegundoApellido);
    if (found === undefined) {

      this.peticionesAPI.MatriculaAlumnoEnGrupo(new Matricula (alumno.id, this.grupoId))
      .subscribe();

      // Añado los nuevos alumnos a la lista.
      // AQUI ESTOY DANDO POR SENTADO QUE LA MATRICULACION SE PUEDE HACER
      // ESTO HABRA QUE REVISARLO SI CONTROLAMOS QUE NO SE PUEDA ASIGNAR UN ALUMNO QUE YA ESTA
      this.alumnosDelGrupo.push (alumno);
      this.alumnosDelGrupo.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
      this.dataSourceAlumnosDelGrupo = new MatTableDataSource (this.alumnosDelGrupo);

      // tslint:disable-next-line:max-line-length
      this.misAlumnos = this.misAlumnos.filter (a => a.Nombre !== alumno.Nombre &&  a.PrimerApellido !== alumno.PrimerApellido && a.SegundoApellido !== alumno.SegundoApellido);
      this.dataSourceMisAlumnos = new MatTableDataSource (this.misAlumnos);

    } else {
      Swal.fire('Cuidado', 'Este alumno ya está en el grupo', 'error');

    }

  }

  AbrirDialogoConfirmacionBorrar(alumno: Alumno): void {

    Swal.fire({
      title: 'Eliminar',
      text: "Confirma que quieres quitar del grupo a : " + alumno.Nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'

    }).then((result) => {
      if (result.value) {
        this.EliminarDelGrupo(alumno);
        Swal.fire('Eliminado','Alumno eliminado correctamente', 'success');
      }
    })




    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        nombre: alumno.Nombre,
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.EliminarDelGrupo(alumno);
        Swal.fire('Eliminado', 'Alumno eliminado correctamente', 'success');
      }
    });
  }

  EliminarDelGrupo(alumno: Alumno) {
    // Deberia poder borrar la matricula directamente pero no he visto como
    console.log ('Borrar ');
    console.log ('alumnoID: ' + alumno.id);
    console.log ('grupoID: ' + this.grupoId);
    this.peticionesAPI.DameMatriculaAlumno (alumno.id, this.grupoId)
    .subscribe( (matricula) => {
        console.log ('voy a borrar: ' + matricula.id);
        this.peticionesAPI.BorraMatricula (matricula[0].id).subscribe( () => {
            console.log ('Borrada');
            // tslint:disable-next-line:max-line-length
            this.alumnosDelGrupo = this.alumnosDelGrupo.filter (a => a.Nombre !== alumno.Nombre &&  a.PrimerApellido !== alumno.PrimerApellido && a.SegundoApellido !== alumno.SegundoApellido);
            this.dataSourceAlumnosDelGrupo = new MatTableDataSource (this.alumnosDelGrupo);
            this.misAlumnos.push (alumno);
            this.misAlumnos.sort((a, b) => a.PrimerApellido.localeCompare(b.PrimerApellido));
            this.dataSourceMisAlumnos = new MatTableDataSource (this.misAlumnos);
        }
        );
    });
  }

  goBack() {
    this.dialogRef.close();
  }

}

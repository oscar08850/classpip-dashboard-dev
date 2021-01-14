import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Clases
import { Grupo, Alumno, SesionClase, AsistenciaClase, Matricula } from '../../clases/index';

// Servicios

import { SesionService, PeticionesAPIService } from '../../servicios/index';
// Imports para abrir diálogo agregar alumno/confirmar eliminar grupo
import { MatDialog } from '@angular/material';
import { SummaryResolver } from '@angular/compiler';

@Component({
  selector: 'app-sesiones-clase',
  templateUrl: './sesiones-clase.component.html',
  styleUrls: ['./sesiones-clase.component.scss']
})
export class SesionesClaseComponent implements OnInit {
  // PARÁMETROS QUE RECOGEMOS DEL COMPONENTE GRUPO
  grupoSeleccionado: Grupo;
  profesorId: number;
  alumnosGrupoSeleccionado: Alumno[];
  botonTablaDesactivado = true;
  //
  alumnosSeleccionados: Alumno[];
  alumnosConMarcaTiempo: any [] = [];

  alumnosElegido: Alumno;

  dataSource;
  mensaje: string = null;

  columnasElegirAleatoriamente: string[] = ['nombreAlumno', 'primerApellido', 'segundoApellido'];
  columnasMarcarHora: string[] = ['select', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'marca'];
  selection = new SelectionModel<Alumno>(true, []);

  myForm: FormGroup;
  fecha: string = null;
  horaSesion: string = null;
  descripcionSesion: string = null;
  // tslint:disable-next-line:no-inferrable-types
  sesionCreada: boolean = false;
  sesionClaseId: number;
  matriculasGrupo: Matricula[];
  sesiones: SesionClase[];
  asistencias: any[];
  tiempos: any[][] = [];
  porcentajeAsistencia: any[];

  constructor(
               public dialog: MatDialog,
               public location: Location,
               private sesion: SesionService,
               private peticionesAPI: PeticionesAPIService,
               // tslint:disable-next-line:variable-name
               private _formBuilder: FormBuilder) { }

  ngOnInit() {
    // Recupero de la sesión la información que necesito
    console.log ('abcdefghai'.substring (1, 5));
    this.grupoSeleccionado = this.sesion.DameGrupo();
    this.profesorId = this.grupoSeleccionado.profesorId;
    this.alumnosGrupoSeleccionado = this.sesion.DameAlumnosGrupo();
    // Necesito las matriculas de los alumnos en el grupo porque para crear una asistencia
    // a clase tengo que usar el id de la matricula
    this.peticionesAPI.DameMatriculasGrupo (this.grupoSeleccionado.id)
    .subscribe ( res => this.matriculasGrupo = res);

    if (this.alumnosGrupoSeleccionado !== undefined) {
      // Al principio no hay alumnos seleccionados para eliminar
      this.alumnosGrupoSeleccionado.forEach (a => this.alumnosConMarcaTiempo.push ({
          id: a.id,
          Nombre: a.Nombre,
          PrimerApellido: a.PrimerApellido,
          SegundoApellido: a.SegundoApellido,
          marca: undefined
      }));
      console.log ('Alumnos con marca');
      console.log (this.alumnosConMarcaTiempo);
      this.dataSource = new MatTableDataSource(this.alumnosConMarcaTiempo);
    }
    this.myForm = this._formBuilder.group({
      descripcionSesion: ['', Validators.required],
      picker: ['', Validators.required],
      hora:  ['', Validators.required]
    });


  }


  // si cambiamos de tab saltamos aqui
  onSelectChange(event) {
    if (event.index === 2) {
      // Aqui tenemos que preparar la información para la tabla de asistencia
      // Recupero las sesiones del grupo
      this.asistencias = [];
      let cont = 0;
      this.peticionesAPI.DameSesionesClaseGrupo (this.grupoSeleccionado.id).
      subscribe (sesiones => {
        this.sesiones = sesiones;
        this.sesiones.forEach (sesion => this.peticionesAPI.DameAsistenciasClase (sesion.id).
          subscribe ( asistencias => {
                this.asistencias.push ({s: sesion, a: asistencias});
                cont++;
                if (cont === this.sesiones.length) {
                  // ha llegado toda la información y podemos preparar la tabla
                  this.PreparaTabla();
                }

           })
        );
      });
    }
  }

  PreparaTabla() {
    // ordeno las sesiones por la fecha
    this.asistencias.sort((a, b) => (a.s.Dia < b.s.Dia ? -1 : 1));
    this.tiempos = [];
    // preparo la matriz con los datos de asistencia
    this.porcentajeAsistencia = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.alumnosGrupoSeleccionado.length ; i++) {
      console.log ('siguiente aluimno');
      const tiemposAlumno: any[] = [];
      let cont = 0;
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < this.asistencias.length ; j++) {
        console.log ('****');
        tiemposAlumno.push (this.asistencias[j].a[i].Hora);
        console.log (tiemposAlumno);
        if (this.asistencias[j].a[i].Hora !== undefined) {
          cont++;
        }
      }
      console.log ('tiempos del alumno');
      console.log (tiemposAlumno);
      const p: number = Math.floor((cont * 100 / this.asistencias.length));
      this.porcentajeAsistencia.push(p);
      this.tiempos.push (tiemposAlumno);
    }
    console.log ('tiempos');
    console.log (this.tiempos);
  }

  GuardarFecha(e): void {
    this.fecha = e.target.value;
  }
  CrearSesion() {
    // Verificamos que la hora se ha introducido en el formato hh:mm
    const regex = /([0-2])([0-9]):([0-5])([0-9])/;
    if (regex.test(this.horaSesion)) {
    this.peticionesAPI.CreaSesionClase(new SesionClase (this.fecha, this.horaSesion, this.descripcionSesion), this.grupoSeleccionado.id)
      .subscribe((res) => {
        if (res != null) {
          console.log('Ya se ha creado el grupo ' + res);
          this.sesionCreada = true; // Si tiro atrás y cambio algo se hará un PUT y no otro POST
          this.sesionClaseId = res.id;
          Swal.fire('Sesión de clase creada correctamente');
          this.horaSesion = null;
          this.descripcionSesion = null;
        } else {
          console.log('Fallo en la creación');
          Swal.fire('Se ha producido un error creando el grupo', 'ERROR', 'error');
        }
      });
    } else {
          Swal.fire('Error en el formato de la hora de inicio', 'ERROR', 'error');
    }

  }
  // Filtro para alumnos
    applyFilter(filterValue: string) {

      console.log ('aplicamos filtro ' + filterValue);
      console.log (this.dataSource);
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    /** Whether the number of selected elements matches the total number of rows. */
    IsAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.alumnosConMarcaTiempo.length;
      return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    MasterToggle() {
      this.IsAllSelected() ?
          this.selection.clear() :
          this.alumnosConMarcaTiempo.forEach(row => {
            if (!this.selection.isSelected(row)) {
              const d = new Date();
              const marca = d.getHours() + ':' + d.getMinutes();
              row.marca = marca;
              this.selection.select(row);
            }
          });
    }

  /* Esta función decide si el boton debe estar activo (si hay al menos
  una fila seleccionada) o si debe estar desactivado (si no hay ninguna fila seleccionada) */
  ActualizarBotonTabla(row) {
    if (this.selection.selected.length === 0) {
      this.botonTablaDesactivado = true;
    } else {
      this.botonTablaDesactivado = false;
    }
    this.mensaje = '';
    if (!this.selection.isSelected(row)) {
      row.marca = undefined;
    } else {
      let marca: string;
      const d = new Date();
      if (d.getMinutes() < 10 ) {
        marca = d.getHours() + ':0' + d.getMinutes();
      } else {
        marca = d.getHours() + ':' + d.getMinutes();
      }
      row.marca = marca;
    }
  }
  RegistrarAsistencia() {
    if (this.selection.selected.length === 0) {
      // No hay nadie seleccionado. Hay que asegurarse de que no es un error
      Swal.fire({
        title: '¿Estas seguro?',
        text: '¿No ha asistido nadie a clase?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, estoy seguro'
      }).then((result) => {
        if (result.value) {
          this.alumnosConMarcaTiempo.forEach (alumno => {
            const matricula = this.matriculasGrupo.filter (a => a.alumnoId === alumno.id)[0];
            this.peticionesAPI.RegistraAsistenciaAlumno(new AsistenciaClase (matricula.id, this.sesionClaseId, alumno.marca))
            .subscribe();
          });
          Swal.fire('Asistencia registrada con éxito');
          this.location.back();
        }
      });
    } else {
      this.alumnosConMarcaTiempo.forEach (alumno => {
        const matricula = this.matriculasGrupo.filter (a => a.alumnoId === alumno.id)[0];
        this.peticionesAPI.RegistraAsistenciaAlumno(new AsistenciaClase (matricula.id, this.sesionClaseId, alumno.marca))
        .subscribe();
      });
      Swal.fire('Asistencia registrada con éxito');
      this.location.back();
    }
  }

  ElegirAleatoriamente() {
    console.log ('Entramos');
    const numeroAlumnos = this.alumnosGrupoSeleccionado.length;
    const elegido = Math.floor(Math.random() * numeroAlumnos);
    const alumnoElegido = this.alumnosGrupoSeleccionado[elegido];
    console.log ('Hemos elegido a ' + elegido);
    Swal.fire(alumnoElegido.Nombre + ' ' + alumnoElegido.PrimerApellido, 'Enhorabuena', 'success');

  }

  goBack() {
    this.location.back();
  }


  // this.peticionesAPI.CreaGrupo(new Grupo(nombreGrupo, descripcionGrupo), this.profesorId)
  //   .subscribe((res) => {
  //     if (res != null) {
  //       console.log('Ya se ha creado el grupo ' + res);
  //       this.grupoYaCreado = true; // Si tiro atrás y cambio algo se hará un PUT y no otro POST
  //       this.grupo = res;
  //     } else {
  //       console.log('Fallo en la creación');
  //       Swal.fire('Se ha producido un error creando el grupo', 'ERROR', 'error');
  //     }
  //   });

}

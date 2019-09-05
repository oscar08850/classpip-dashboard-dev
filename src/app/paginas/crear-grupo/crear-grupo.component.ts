import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AgregarAlumnoDialogComponent } from './agregar-alumno-dialog/agregar-alumno-dialog.component';

// Servicios
import { GrupoService } from '../../servicios/index';

// Clases
import { Grupo } from '../../clases/index';


@Component({
  selector: 'app-crear-grupo',
  templateUrl: './crear-grupo.component.html',
  styleUrls: ['./crear-grupo.component.scss']
})
export class CrearGrupoComponent implements OnInit {

  // Identificador del profesor
  profesorId: number;

  // Grupo que hemos creado
  grupo: Grupo;

  // Para el stepper
  myForm: FormGroup;

  // URL del inicio
  URLVueltaInicio: string;

  // Para saber si el botón está habilitado o no
  // tslint:disable-next-line:ban-types
  isDisabled: Boolean = true;

  // AL PRINCIPIO EL GRUPO NO ESTA CREADO
  // tslint:disable-next-line:ban-types
  grupoYaCreado: Boolean = false;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private grupoService: GrupoService,
              public dialog: MatDialog,
              // tslint:disable-next-line:variable-name
              private _formBuilder: FormBuilder) { }


  ngOnInit() {

    // REALMENTE LA APP FUNCIONARÁ COGIENDO AL PROFESOR DEL SERVICIO, NO OBSTANTE AHORA LO RECOGEMOS DE LA URL
    // this.profesorId = this.profesorService.RecibirProfesorIdDelServicio();
    this.profesorId = Number (this.route.snapshot.paramMap.get('id'));

    // tslint:disable-next-line:no-string-literal
    this.URLVueltaInicio = this.route.snapshot.queryParams['URLVueltaInicio'] || '/inicio';

    this.myForm = this._formBuilder.group({
      nombreGrupo: ['', Validators.required],
      descripcionGrupo: ['', Validators.required]
    });
  }

  // CREAMOS UN GRUPO DÁNDOLE UN NOMBRE Y UNA DESCRIPCIÓN
  CrearGrupo() {

    let nombreGrupo: string;
    let descripcionGrupo: string;

    nombreGrupo = this.myForm.value.nombreGrupo;
    descripcionGrupo = this.myForm.value.descripcionGrupo;

    console.log('Entro a crear el grupo ' + nombreGrupo);

    this.grupoService.POST_Grupo(new Grupo(nombreGrupo, descripcionGrupo), this.profesorId)
    .subscribe((res) => {
      if (res != null) {
        console.log(res);
        this.grupoYaCreado = true; // Si tiro atrás y cambio algo se hará un PUT y no otro POST
        this.grupo = res;
      } else {
        console.log('Fallo en la creación');
      }
    });
  }

  // NOS PERMITE MODIFICAR EL NOMBRE Y LA DESCRIPCIÓN DEL GRUPO QUE ESTAMOS CREANDO
  EditarGrupo() {

    console.log('Entro a editar');
    let nombreGrupo: string;
    let descripcionGrupo: string;

    nombreGrupo = this.myForm.value.nombreGrupo;
    descripcionGrupo = this.myForm.value.descripcionGrupo;

    this.grupoService.PUT_Grupo(new Grupo(nombreGrupo, descripcionGrupo), this.profesorId, this.grupo.id)
    .subscribe((res) => {
      if (res != null) {
        console.log('Voy a editar el equipo con id ' + this.grupo.id);
        this.grupo = res;
      } else {
        console.log('fallo editando');
      }
    });
  }

  // SI QUEREMOS AÑADIR ALUMNOS MANUALMENTE LO HAREMOS A TRAVÉS DE UN DIÁLOGO
  AbrirDialogoAgregarAlumnos(): void {
    const dialogRef = this.dialog.open(AgregarAlumnoDialogComponent, {
      width: '900px',
      maxHeight: '600px',
      // Le pasamos solo los id del grupo y profesor ya que es lo único que hace falta para vincular los alumnos
      data: {
        grupoId: this.grupo.id,
        profesorId: this.profesorId
      }
    });
  }

  // VUELTA AL INICIO
  VueltaInicio() {
    this.router.navigate([this.URLVueltaInicio, this.profesorId]);
    console.log(this.URLVueltaInicio);
  }

  // MIRO SI HAY ALGO SIMULTÁNEAMENTE EN EL NOMBRE Y LA DESCRIPCIÓN
  Disabled() {
    if (this.myForm.value.nombreGrupo === '' || this.myForm.value.descripcionGrupo === '') {
      // Si alguno de los valores es igual a nada, entonces estará desactivado
      this.isDisabled = true;
    } else {
      // Si ambos son diferentes a nulo, estará activado.
      this.isDisabled = false;
    }
  }

}

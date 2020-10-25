import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SesionService, CalculosService, PeticionesAPIService, ComServerService } from '../../servicios/index';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatTabGroup } from '@angular/material';


// tslint:disable-next-line:max-line-length
import { CuestionarioSatisfaccion, JuegoDeEncuestaRapida, TablaPuntosFormulaUno,
          JuegoDeVotacionRapida, Cuestionario, JuegoDeCuestionarioRapido, JuegoDeCogerTurnoRapido } from '../../clases/index';

import Swal from 'sweetalert2';
import { SelectionModel } from '@angular/cdk/collections';

// import { AsignaCuestionarioComponent } from './juego/asigna-cuestionario/asigna-cuestionario.component';

import { AsignaCuestionarioComponent } from './../juego/asigna-cuestionario/asigna-cuestionario.component';



export interface OpcionSeleccionada {
  nombre: string;
  id: string;
}

export interface ChipColor {
  nombre: string;
  color: ThemePalette;
}

@Component({
  selector: 'app-crear-juego-rapido',
  templateUrl: './crear-juego-rapido.component.html',
  styleUrls: ['./crear-juego-rapido.component.scss']
})
export class CrearJuegoRapidoComponent implements OnInit {
  profesorId: number;


  // tslint:disable-next-line:ban-types
  juegoCreado: Boolean = false;

  // Usaré esta variable para determinar si debo advertir al usuario de
  // que está abandonando el proceso de creación del juego
  creandoJuego = false;

  juego: any;


  // Informacion para todos los juegos
  myForm: FormGroup;
  nombreDelJuego: string;
  tipoDeJuegoSeleccionado: string;

  tengoNombre = false;
  tengoTipo = false;

  seleccionTipoJuego: ChipColor[] = [
    {nombre: 'Juego De Encuesta Rápida', color: 'primary'},
    {nombre: 'Juego De Cuestionario Rápido', color: 'accent'},
    {nombre: 'Juego De Votación Rápida', color: 'warn'},
    {nombre: 'Juego De Coger Turno Rápido', color: 'primary'},

  ];




  // Información para el juego de cuestionario de satisfacción
  cuestionarioSatisfaccion: CuestionarioSatisfaccion;
  tengoCuestionarioSatisfaccion = false;


  // Información para el juego de votacion rápida
  listaConceptos: string [] = [];
  dataSourceConceptos;
  conceptosAsignados = false;
  nuevaPuntuacion: number;
  tengoNuevaPuntuacion = false;
  selection = new SelectionModel<any>(true, []);
  dataSource;

  displayedColumnsConceptos: string[] = ['concepto', 'iconos'];

  Puntuacion: number[] = [];

  TablaPuntuacion: TablaPuntosFormulaUno[];
  displayedColumnsTablaPuntuacion: string[] = ['select', 'Posicion', 'Puntos'];


  // Informacion para el juego de coger turno rapido
  listaTurnos: any [] = [];
  dataSourceTurnos;
  turnosAsignados = false;
  presentacionJuegoCogerTurnoRapido: string;

  displayedColumnsTurnos: string[] = ['dia', 'hora', 'iconos'];


  // información para crear un juego de cuestionario
  cuestionario: Cuestionario;
  tengoCuestionario = false;
  puntuacionCorrecta: number;
  puntuacionIncorrecta: number;
  modoPresentacion: string;
  tengoModoPresentacion = false;
  seleccionModoPresentacion: string[] = ['Mismo orden para todos',
  'Preguntas desordenadas',
  'Preguntas y respuestas desordenadas'];
  tiempoLimite: number;


  constructor(
    public dialog: MatDialog,
    private calculos: CalculosService,
    private sesion: SesionService,
    private comService: ComServerService,
    private location: Location,
    private peticionesAPI: PeticionesAPIService,
    // tslint:disable-next-line:variable-name
    private _formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {

    this.profesorId = this.sesion.DameProfesor().id;
    this.myForm = this._formBuilder.group({
      NombreDelJuego: ['', Validators.required],
      Concepto: ['', Validators.required],
      NuevaPuntuacion: ['', Validators.required],
      PuntuacionCorrecta: ['', Validators.required],
      PuntuacionIncorrecta: ['', Validators.required],
      TiempoLimite:  ['', Validators.required],
      Turno: ['', Validators.required],
      Presentacion: ['', Validators.required]
    });

    this.TablaPuntuacion = [];
    this.TablaPuntuacion[0] = new TablaPuntosFormulaUno(1, 10);
    this.dataSource = new MatTableDataSource (this.TablaPuntuacion);
    this.Puntuacion[0] = 10;

    this.listaConceptos = [];

  }

  GuardaNombreDelJuego() {
    this.nombreDelJuego = this.myForm.value.NombreDelJuego;
    if ( this.nombreDelJuego === undefined) {
      this.tengoNombre = false;
    } else {
      this.tengoNombre = true;
      this.creandoJuego = true; // empiezo el proceso de creacion del juego
    }
  }


  TipoDeJuegoSeleccionado(tipo: ChipColor) {
      this.tipoDeJuegoSeleccionado = tipo.nombre;
      this.tengoTipo = true;
  }


  RecibeCuestionarioSatisfaccionElegido($event) {
    this.cuestionarioSatisfaccion = $event;
    this.tengoCuestionarioSatisfaccion = true;
  }

  CrearJuegoDeEncuestaRapida() {

    // genero una clave aleatoria de 8 digitos en forma de string
    const clave = Math.random().toString().substr(2, 8);
    const juegoDeEncuestaRapida = new JuegoDeEncuestaRapida (
      this.nombreDelJuego,
      this.tipoDeJuegoSeleccionado,
      clave,
      this.profesorId,
      this.cuestionarioSatisfaccion.id
    );
    console.log ('voy a crear juego');
    console.log (juegoDeEncuestaRapida);
    this.peticionesAPI.CreaJuegoDeEncuestaRapida (juegoDeEncuestaRapida)
    .subscribe (juegoCreado => {
      this.juego = juegoCreado;

      this.juegoCreado = true;
      Swal.fire('Juego de encuesta rápida creado correctamente', ' ', 'success');
      this.goBack();
    });
  }



PonConcepto() {
  this.listaConceptos.push (this.myForm.value.Concepto);
  this.dataSourceConceptos = new MatTableDataSource (this.listaConceptos);
  this.myForm.reset();
}


BorraConcepto(concepto) {
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < this.listaConceptos.length; i++) {
    if (this.listaConceptos[i] === concepto) {
      this.listaConceptos.splice ( i, 1);
    }
  }
  this.dataSourceConceptos = new MatTableDataSource (this.listaConceptos);
}

AsignarConceptos() {
  this.conceptosAsignados = true;
}

GuardarNuevaPuntuacion() {
  this.nuevaPuntuacion = Number (this.myForm.value.NuevaPuntuacion);
  this.tengoNuevaPuntuacion = true;

}

Preparado() {
  if ((this.tengoNuevaPuntuacion) &&  (this.selection.selected.length > 0)) {
    return true;
  } else {
    return false;
  }
}

AnadirPuntos() {
  console.log ('nueva puntuiacion');
  console.log (this.nuevaPuntuacion);
  if (!isNaN(this.nuevaPuntuacion)) {
    for ( let i = 0; i < this.dataSource.data.length; i++) {
      // Buscamos los alumnos que hemos seleccionado
      if (this.selection.isSelected(this.dataSource.data[i]))  {
        this.Puntuacion[i] = this.nuevaPuntuacion;
        this.TablaPuntuacion[i].Puntuacion = this.nuevaPuntuacion;
      }
    }
  } else {
       Swal.fire('Introduzca una puntuación válida', 'Le recordamos que debe ser un Número', 'error');
  }
  this.dataSource = new MatTableDataSource (this.TablaPuntuacion);
  this.selection.clear();
  this.tengoNuevaPuntuacion = false;
}

AnadirFila() {

  let i: number;
  i = this.Puntuacion.length;

  this.TablaPuntuacion[i] = new TablaPuntosFormulaUno(i + 1, 1);
  this.Puntuacion[i] = this.TablaPuntuacion[i].Puntuacion;
  this.dataSource = new MatTableDataSource (this.TablaPuntuacion);
}

EliminarFila() {

  let i: number;
  i = this.Puntuacion.length;
  console.log(i);
  console.log(this.Puntuacion);
  if (i > 1) {
        this.TablaPuntuacion = this.TablaPuntuacion.splice(0, i - 1);
        this.Puntuacion = this.Puntuacion.slice(0, i - 1);
        console.log(this.TablaPuntuacion);
        console.log(this.Puntuacion);

        this.dataSource = new MatTableDataSource (this.TablaPuntuacion);
  } else {
    Swal.fire('No es posible eliminar otra fila', 'Como mínimo debe haber una', 'error');
  }

}

IsAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}

/* Cuando se clica en el checkbox de cabecera hay que ver si todos los
  * checkbox estan acivados, en cuyo caso se desactivan todos, o si hay alguno
  * desactivado, en cuyo caso se activan todos */

MasterToggle() {
  if (this.IsAllSelected()) {
    this.selection.clear(); // Desactivamos todos
  } else {
    // activamos todos
    this.dataSource.data.forEach(row => this.selection.select(row));
  }
}
CrearJuegoDeVotacionRapida() {
  console.log ('voy a crear un juego de votacion rápida');
  const clave = Math.random().toString().substr(2, 8);
  const juegoDeVotacionRapida = new JuegoDeVotacionRapida (
    this.nombreDelJuego,
    this.tipoDeJuegoSeleccionado,
    clave,
    this.profesorId,
    this.listaConceptos,
    this.Puntuacion
  );
  console.log ('voy a crear un juego de votacion rápida');
  console.log (juegoDeVotacionRapida);
  this.peticionesAPI.CreaJuegoDeVotacionRapida (juegoDeVotacionRapida)
  .subscribe (juegoCreado => {
    this.juego = juegoCreado;

    this.juegoCreado = true;
    Swal.fire('Juego de votación rápida creado correctamente', ' ', 'success');
    this.goBack();
  });


}
  //// FUNCIONES PARA LA CREACION DE JUEGO DE CUESTIONARIO RAPIDO
  AbrirDialogoAgregarCuestionarioRapido(): void {
    const dialogRef = this.dialog.open(AsignaCuestionarioComponent, {
      width: '70%',
      height: '80%',
      position: {
        top: '0%'
      },
      // Pasamos los parametros necesarios
      data: {
        profesorId: this.profesorId
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.cuestionario = this.sesion.DameCuestionario();
      this.tengoCuestionario = true;
    });
  }


  // Para habilitar el boton de guardar puntuaciones
  TengoPuntuaciones() {
    if (this.myForm.value.PuntuacionCorrecta === '' || this.myForm.value.PuntuacionIncorrecta === '') {
      return false;
    } else {
      return true;
    }
  }

  GuardarPuntuacion() {
    this.puntuacionCorrecta = this.myForm.value.PuntuacionCorrecta;
    this.puntuacionIncorrecta = this.myForm.value.PuntuacionIncorrecta;
  }
  GuardarModoPresentacion(modoPresentacion) {
    this.modoPresentacion = modoPresentacion;
    this.tengoModoPresentacion = true;
  }

  GuardarTiempoLimite() {
    this.tiempoLimite = this.myForm.value.TiempoLimite;
    if (this.tiempoLimite === undefined) {
      this.tiempoLimite = 0;
    }
  }


  CrearJuegoDeCuestionarioRapido() {

    // Tengo que crear un juego de tipo JuegoDeCuestionario y no uno de tipo Juego, como en los casos
    // anteriores. La razón es que no están bien organizado el tema de que los modelos de los diferentes juegos
    // tomen como base el modelo Juego genérico. De momento se queda así.
    const clave = Math.random().toString().substr(2, 8);
    const juegoDeCuestionarioRapido = new JuegoDeCuestionarioRapido (
      this.nombreDelJuego, this.tipoDeJuegoSeleccionado,
      clave,
      this.puntuacionCorrecta,
      this.puntuacionIncorrecta, this.modoPresentacion,
      false, false, this.profesorId, this.cuestionario.id, this.tiempoLimite);

    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.CreaJuegoDeCuestionarioRapido(juegoDeCuestionarioRapido)
    .subscribe(juegoCreado => {
      this.juego = juegoCreado;

      this.juegoCreado = true;
      Swal.fire('Juego de cuestionario rapido creado correctamente', ' ', 'success');
      this.goBack();

    });
  }

  // para juego de coger turno rapido


PonTurno() {
  // {{turno.dia | date: 'dd-MM-yyyy'}}
  const turno = this.myForm.value.Turno.toString();
  const diaElegido = turno.split('T')[0];
  const horaElegida = turno.split('T')[1];
  // this.setDob = datePipe.transform(this.myForm.value.Turno, 'dd/MM/yyyy');
  this.listaTurnos.push ({
    dia: diaElegido,
    hora: horaElegida,
    persona: undefined
  });
  this.dataSourceTurnos = new MatTableDataSource (this.listaTurnos);
  this.myForm.reset();
}


BorraTurno(turno) {
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < this.listaTurnos.length; i++) {
    if ((this.listaTurnos[i].dia === turno.dia) && (this.listaTurnos[i].hora === turno.hora)) {
      this.listaTurnos.splice ( i, 1);
    }
  }
  this.dataSourceTurnos = new MatTableDataSource (this.listaTurnos);
}

AsignarTurnos() {
  this.turnosAsignados = true;
}

GuardaPresentacionCogerTurnoRapido() {
  this.presentacionJuegoCogerTurnoRapido = this.myForm.value.Presentacion;
}

CrearJuegoDeCogerTurnoRapido() {

  // genero una clave aleatoria de 8 digitos en forma de string
  const clave = Math.random().toString().substr(2, 8);
  const juegoDeCogerTurnoRapido = new JuegoDeCogerTurnoRapido (
    this.nombreDelJuego,
    this.tipoDeJuegoSeleccionado,
    clave,
    this.profesorId,
    this.presentacionJuegoCogerTurnoRapido,
    this.listaTurnos
  )

  this.peticionesAPI.CreaJuegoDeCogerTurnoRapido (juegoDeCogerTurnoRapido)
  .subscribe (juegoCreado => {
    this.juego = juegoCreado;

    this.juegoCreado = true;
    Swal.fire('Juego de coger turno rapido creado correctamente', ' ', 'success');
    this.goBack();
  });
}


  goBack() {
    this.router.navigate(['/inicio/' + this.profesorId]);
  }

}

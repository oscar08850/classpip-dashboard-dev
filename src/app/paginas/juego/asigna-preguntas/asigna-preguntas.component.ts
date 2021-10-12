import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { Pregunta, PreguntaDelCuestionario } from 'src/app/clases';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { PeticionesAPIService, SesionService } from 'src/app/servicios';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';

@Component({
  selector: 'app-asigna-preguntas',
  templateUrl: './asigna-preguntas.component.html',
  styleUrls: ['./asigna-preguntas.component.scss']
})
export class AsignaPreguntasComponent implements OnInit {
@Output()
  emisorIdPreguntasBasicas = new EventEmitter <number[]>();
  emisorIdPreguntasBonus = new EventEmitter <number[]>();

  // COLUMNAS DE LA TABLA Y LA LISTA CON LA INFORMACION NECESARIA
  displayedColumnsMisPreguntas: string[] = ['titulo', 'pregunta', 'tematica', 'basicas', 'bonus'];
  dataSourceMisPreguntas;
  misPreguntas: Pregunta[] = [];
  dataSourceMisPreguntasBasicas;
  misPreguntasBasicas: Pregunta[] = [];
  IDmisPreguntasBasicas: number[] = [];
  IDmisPreguntasBonus: number[] = []
  dataSourceMisPreguntasBonus;
  misPreguntasBonus: Pregunta[] = [];

  // COLUMNAS DE LA TABLA Y LA LISTA CON LA INFORMACION NECESARIA
  displayedColumnsPreguntasSeleccionadas: string[] = ['titulo', 'pregunta', 'tematica', ' '];

  pregunta: Pregunta;

  numeroDePuntosGeolocalizables: number;
  profesorId: number;
  mensaje = '¿Estas seguro que quieres coger estas preguntas?'
  mensaje1 = 'Confirma que quieres quitar de Preguntas Basicas la pregunta: ';
  mensaje2= 'Confirma que quieres quitar de Preguntas Bonus la pregunta: ';


  constructor(
              public dialog: MatDialog,
              public location: Location,
              private sesion: SesionService,
              private peticionesAPI: PeticionesAPIService,
              public dialogRef: MatDialogRef<AsignaPreguntasComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

    // GUARDAMOS LOS VALORES NECESARIOS QUE TENEMOS DEL COMPONENTE ANTERIOR
    this.numeroDePuntosGeolocalizables = this.data.numeroDePuntosGeolocalizables;
    console.log(this.numeroDePuntosGeolocalizables);
    this.profesorId = this.data.profesorId;

    this.peticionesAPI.DameTodasMisPreguntas (this.profesorId)
    .subscribe (res => {
      console.log(res);
      this.misPreguntas = res;
      this.misPreguntas.sort((a, b) => a.Tematica.localeCompare(b.Tematica));
      this.dataSourceMisPreguntas = new MatTableDataSource (this.misPreguntas);
    })
  }

  applyFilterMisPreguntas(filterValue: string){
    this.dataSourceMisPreguntas.filter = filterValue.trim().toLowerCase();
  }

  AbrirDialogoConfirmacionBorrarBasica(pregunta: Pregunta): void {
    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje1,
        nombre: pregunta.Titulo
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.EliminarDePreguntasBasicas(pregunta);
        Swal.fire('Eliminado', 'Pregunta eliminada correctamente', 'success');
      }
    });
  }

  AbrirDialogoConfirmacionBorrarBonus(pregunta: Pregunta): void {
    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje2,
        nombre: pregunta.Titulo
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.EliminarDePreguntasBonus(pregunta);
        Swal.fire('Eliminado', 'Pregunta eliminada correctamente', 'success');
      }
    });
  }

  AsignarPreguntaBasica(pregunta: Pregunta) {
    const found = this.misPreguntasBasicas.find (a => a.Titulo === pregunta.Titulo && a.Pregunta === pregunta.Pregunta);
    if (found === undefined) {
      // Añadimos las preguntas a la lista
      this.misPreguntasBasicas.push (pregunta);
      this.IDmisPreguntasBasicas.push (pregunta.id);
      console.log(this.IDmisPreguntasBasicas);
      this.misPreguntasBasicas.sort((a, b) => a.Tematica.localeCompare(b.Tematica));
      this.dataSourceMisPreguntasBasicas = new MatTableDataSource (this.misPreguntasBasicas);
      this.misPreguntas = this.misPreguntas.filter (a => a.Titulo !== pregunta.Titulo && a.Pregunta !== pregunta.Pregunta);
      this.dataSourceMisPreguntas = new MatTableDataSource (this.misPreguntas);
    } else {
      Swal.fire('Cuidado', 'Esta pregunta ya esta en el juego', 'error');
    }
  }

  AsignarPreguntaBonus(pregunta: Pregunta) {
    const found = this.misPreguntasBonus.find (a => a.Titulo === pregunta.Titulo && a.Pregunta === pregunta.Pregunta);
    if (found === undefined) {
      // Añadimos las preguntas a la lista
      this.misPreguntasBonus.push (pregunta);
      this.IDmisPreguntasBonus.push (pregunta.id);
      console.log(this.IDmisPreguntasBonus);
      this.misPreguntasBonus.sort((a, b) => a.Tematica.localeCompare(b.Tematica));
      this.dataSourceMisPreguntasBonus = new MatTableDataSource (this.misPreguntasBonus);
      this.misPreguntas = this.misPreguntas.filter (a => a.Titulo !== pregunta.Titulo && a.Pregunta !== pregunta.Pregunta);
      this.dataSourceMisPreguntas = new MatTableDataSource (this.misPreguntas);
    } else {
      Swal.fire('Cuidado', 'Esta pregunta ya esta en el juego', 'error');
    }
  }


  EliminarDePreguntasBasicas(pregunta: Pregunta){
        // tslint:disable-next-line:max-line-length
        this.misPreguntasBasicas = this.misPreguntasBasicas.filter(a => a.Titulo !== pregunta.Titulo && a.Pregunta !== pregunta.Pregunta && a.Tematica !== pregunta.Tematica);
        this.IDmisPreguntasBasicas = this.IDmisPreguntasBasicas.filter(a => a !== pregunta.id);
        this.dataSourceMisPreguntasBasicas = new MatTableDataSource (this.misPreguntasBasicas);
        this.misPreguntas.push(pregunta);
        this.misPreguntas.sort((a, b) => a.Tematica.localeCompare(b.Tematica));
        this.dataSourceMisPreguntas = new MatTableDataSource (this.misPreguntas);
  }

  EliminarDePreguntasBonus(pregunta: Pregunta) {

    // tslint:disable-next-line:max-line-length
    this.misPreguntasBonus = this.misPreguntasBonus.filter(a => a.Titulo !== pregunta.Titulo && a.Pregunta !== pregunta.Pregunta && a.Tematica !== pregunta.Tematica);
    this.IDmisPreguntasBonus = this.IDmisPreguntasBonus.filter(a => a !== pregunta.id);
    this.dataSourceMisPreguntasBonus = new MatTableDataSource (this.misPreguntasBonus);
    this.misPreguntas.push(pregunta);
    this.misPreguntas.sort((a, b) => a.Tematica.localeCompare(b.Tematica));
    this.dataSourceMisPreguntas = new MatTableDataSource (this.misPreguntas);
}

  goBack() {
    // this.emisorIdPreguntasBasicas.emit(this.IDmisPreguntasBasicas)
    // this.emisorIdPreguntasBonus.emit(this.IDmisPreguntasBonus)
    this.dialogRef.close();
  }
  AbrirDialogoConfirmacionAsignarPreguntas(): void {
    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,

      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      this.sesion.TomaIdPreguntasBasicas(this.IDmisPreguntasBasicas);
      this.sesion.TomaIdPreguntasBonus(this.IDmisPreguntasBonus);
      this.dialogRef.close();
    });
  }
}

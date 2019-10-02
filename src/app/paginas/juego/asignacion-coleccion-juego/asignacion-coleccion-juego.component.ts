import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

// Imports para abrir diálogo mostrar cromos
import { MatDialog, MatSnackBar, MatTabGroup } from '@angular/material';
import { DialogMostrarCromosComponent } from './dialog-mostrar-cromos/dialog-mostrar-cromos.component';

import { Coleccion, Juego, Alumno, Equipo, AlumnoJuegoDeColeccion,
 EquipoJuegoDeColeccion} from 'src/app/clases/index';
// Services
import { JuegoService, GrupoService, ColeccionService, ProfesorService,
   JuegoDeColeccionService, EquipoService } from '../../../servicios/index';

   // Services
import { SesionService, PeticionesAPIService, CalculosService } from '../../../servicios/index';

@Component({
  selector: 'app-asignacion-coleccion-juego',
  templateUrl: './asignacion-coleccion-juego.component.html',
  styleUrls: ['./asignacion-coleccion-juego.component.scss']
})
export class AsignacionColeccionJuegoComponent implements OnInit {

  grupoId: number;
  profesorId: number;

  colecciones: Coleccion[];

  alumnos: Alumno[];
  equipos: Equipo[];

  datasourceColecciones;

  // tslint:disable-next-line:ban-types
  isDisabled: Boolean = true;

  displayedColumns: string[] = ['nombreColeccion', ' '];
  coleccionSeleccionada: Coleccion;

  juego: Juego;

  // Para que al hacer click se quede la fila marcada
  selectedRowIndex = -1;


  constructor( private juegoService: JuegoService,
               private profesorService: ProfesorService,
               private grupoService: GrupoService,
               private equipoService: EquipoService,
               private juegoDeColeccionService: JuegoDeColeccionService,
               private coleccionService: ColeccionService,
               private calculos: CalculosService,
               private sesion: SesionService,
               private peticionesAPI: PeticionesAPIService,
               public dialog: MatDialog) { }

  ngOnInit() {

    this.profesorId = this.sesion.DameProfesor().id;
    this.juego = this.sesion.DameJuego();
   // this.coleccionService.RecibirColeccionDelServicio();
    this.alumnos = this.sesion.DameAlumnosGrupo();
    this.TraeEquiposDelGrupo();
    this.TraeListaDeColecciones();
    console.log(this.juegoService.RecibirJuegoDelServicio());

    this.grupoId = this.juego.grupoId;
  }

  // RECUPERA LOS EQUIPOS DEL GRUPO
  TraeEquiposDelGrupo() {
    this.peticionesAPI.DameEquiposDelGrupo(this.juego.grupoId)
    .subscribe(equipos => {
      if (equipos !== undefined) {
        console.log('Hay equipos');
        this.equipos = equipos;
        console.log(this.equipos);
      } else {
        console.log('Este grupo aun no tiene equipos');
      }

    });
  }

  applyFilter(filterValue: string) {
    this.datasourceColecciones.filter = filterValue.trim().toLowerCase();
  }

  // Para que al hacer click se quede la fila marcada
  highlight(row) {
    this.selectedRowIndex = row.id;
  }

  TraeListaDeColecciones() {
    this.peticionesAPI.DameColeccionesDelProfesor(this.profesorId)
    .subscribe(colecciones => {
      this.colecciones = colecciones;
      this.datasourceColecciones = new MatTableDataSource(this.colecciones);
    });
  }

  ColeccionSeleccionada(coleccion: Coleccion) {
    this.coleccionSeleccionada = coleccion;
    this.isDisabled = false;
    console.log(this.coleccionSeleccionada);
  }

  AsignarColeccionJuego() {
    // Añadimos la colección elegida al juego de colección (que ya se había creado)
    this.peticionesAPI.CompletaJuegoDeColeccion(new Juego (this.juego.Tipo, this.juego.Modo, this.coleccionSeleccionada.id),
     this.grupoId, this.juego.id).subscribe(res => {
      this.InscribirParticipantesJuego();
      console.log(res);
     });
  }

  InscribirParticipantesJuego() {

    if (this.juego.Modo === 'Individual') {
      console.log('voy a inscribir alumnos');
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.alumnos.length; i++) {
        console.log(this.alumnos[i]);
        this.peticionesAPI.InscribeAlumnoJuegoDeColeccion(new AlumnoJuegoDeColeccion (this.alumnos[i].id, this.juego.id))
        .subscribe(alumnoJuego => console.log('alumnos inscritos correctamente en el juego de coleccion'));
      }
    } else {
      console.log('voy a inscribir equipos');
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.equipos.length; i++) {
        console.log(this.equipos[i]);
        this.peticionesAPI.InscribeEquipoJuegoDeColeccion(new EquipoJuegoDeColeccion(this.equipos[i].id, this.juego.id))
        .subscribe(equiposJuego => console.log(equiposJuego));
      }
    }

  }

  AbrirDialogoMostrarCromos(coleccionSeleccionada: Coleccion): void {

    const dialogRef = this.dialog.open(DialogMostrarCromosComponent, {
      width: '1000px',
      maxHeight: '600px',
      data: {
        coleccion: coleccionSeleccionada
      }
    });
  }

 }

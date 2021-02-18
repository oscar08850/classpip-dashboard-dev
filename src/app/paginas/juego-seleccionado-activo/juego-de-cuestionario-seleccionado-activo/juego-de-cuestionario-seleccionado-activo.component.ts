import { Component, OnInit } from '@angular/core';
import { Juego, Alumno } from 'src/app/clases';
import { AlumnoJuegoDeCuestionario } from 'src/app/clases/AlumnoJuegoDeCuestionario';
import { TablaAlumnoJuegoDeCuestionario } from 'src/app/clases/TablaAlumnoJuegoDeCuestionario';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { SesionService, PeticionesAPIService, CalculosService, ComServerService } from 'src/app/servicios';
import { JuegoDeCuestionario } from 'src/app/clases/JuegoDeCuestionario';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
// tslint:disable-next-line:max-line-length
import { InformacionJuegoDeCuestionarioDialogComponent } from './informacion-juego-de-cuestionario-dialog/informacion-juego-de-cuestionario-dialog.component';

import { Howl } from 'howler';
import { ActivatedRoute,NavigationExtras, Router} from '@angular/router';

@Component({
  selector: 'app-juego-de-cuestionario-seleccionado-activo',
  templateUrl: './juego-de-cuestionario-seleccionado-activo.component.html',
  styleUrls: ['./juego-de-cuestionario-seleccionado-activo.component.scss']
})
export class JuegoDeCuestionarioSeleccionadoActivoComponent implements OnInit {

  // Juego de Cuestionario saleccionado
  juegoSeleccionado: Juego;

  // Recuperamos la informacion del juego
  alumnosDelJuego: Alumno[];

  // Lista de los alumnos ordenada segun su nota
  listaAlumnosOrdenadaPorNota: AlumnoJuegoDeCuestionario[];
  rankingAlumnosPorNota: TablaAlumnoJuegoDeCuestionario[];

  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estas segura/o que quieres desactivar: ';

  // tslint:disable-next-line:no-inferrable-types
  mensajeFinalizar: string = 'Estas segura/o de que quieres finalizar: ';

  // Orden conlumnas de la tabla
  displayedColumnsAlumnos: string[] = ['nombreAlumno', 'primerApellido', 'segundoApellido', 'nota', ' '];
  displayedColumnsAlumnosKahoot: string[] = ['nombreAlumno', 'primerApellido', 'segundoApellido', 'conexion']; 

  dataSourceAlumno;
  dataSourceAlumnosConectados;

  // tslint:disable-next-line:no-inferrable-types
  respuestas: number = 0;
  alumnosQueHanContestado: any[];
  alumnoIdKahoot: number;
  conexionKahoot: boolean = false;

  //Lista para tratado de conexiones
  alumnosConectados: any[];


  constructor(  public dialog: MatDialog,
                public sesion: SesionService,
                public peticionesAPI: PeticionesAPIService,
                public calculos: CalculosService,
                public comServer: ComServerService,
                private location: Location,
                private router: Router) { }

  ngOnInit() {

    this.alumnosConectados = [];

    const sound = new Howl({
      src: ['/assets/got-it-done.mp3']
    });
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log(this.juegoSeleccionado.Modalidad);
    this.AlumnosDelJuego();

    //Nos suscribimos al método para que actualice el estado de la conexión al juego cuando un alumno entra
      console.log("Esperando conexiones de alumnos");
    this.comServer.EsperoConexionesCuestionarioKahoot().subscribe((respuesta) =>{
      console.log("Se ha conectado un alumno");
      this.MeConectoAKahoot(respuesta);
    });

    this.comServer.EsperoRespuestasJuegoDeCuestionario()
    .subscribe((alumno: any) => {
        sound.play();
        console.log ('Ya ha contestado: ' + alumno.id);
        console.log ('La nota es: ' + alumno.nota);
        // busco al alumno que ha contestado
        // const al = this.listaAlumnosOrdenadaPorNota.filter (a => a.id === alumno.id)[0];
        // al.Nota = alumno.nota;
        // al.Contestado = true;
        // al.TiempoEmpleado = alumno.tiempo;
        // // tslint:disable-next-line:only-arrow-functions
        // this.listaAlumnosOrdenadaPorNota = this.listaAlumnosOrdenadaPorNota.sort(function(a, b) {
        //   if (b.Nota !== a.Nota) {
        //     return b.Nota - a.Nota;
        //   } else {
        //     // en caso de empate en la nota, gana el que empleó menos tiempo
        //     return a.TiempoEmpleado - b.TiempoEmpleado;
        //   }
        // });
        // this.TablaClasificacionTotal();

        // this.alumnosQueHanContestado.push (alumno);
        // console.log (this.alumnosQueHanContestado);
        // this.sesion.TomaAlumnosQueHanContestadoCuestionario (this.alumnosQueHanContestado);
        const al = this.rankingAlumnosPorNota.filter (a => a.id === alumno.id )[0];
        al.nota = alumno.nota;
        al.tiempoEmpleado = alumno.tiempo;
        al.contestado = true;

        console.log ('tabla');
        console.log (this.rankingAlumnosPorNota);

        // tslint:disable-next-line:only-arrow-functions
        this.rankingAlumnosPorNota = this.rankingAlumnosPorNota.sort(function(a, b) {
          if (b.nota !== a.nota) {
            return b.nota - a.nota;
          } else {
            // en caso de empate en la nota, gana el que empleó menos tiempo
            return a.tiempoEmpleado - b.tiempoEmpleado;
          }
        });
        this.dataSourceAlumno = new MatTableDataSource(this.rankingAlumnosPorNota);
    });
  }

  HaContestado(alumnoId: number): boolean {
    console.log ('voy a ver si ha contestado ' + alumnoId);
    if (this.alumnosQueHanContestado.find (alumno => alumno.id === alumnoId) === undefined) {
      console.log ('No');
      return false;
    } else {
      console.log ('SI');
      return true;
    }
  }
  AlumnosDelJuego() {
    this.peticionesAPI.DameAlumnosJuegoDeCuestionario(this.juegoSeleccionado.id)
    .subscribe(alumnosJuego => {
      this.alumnosDelJuego = alumnosJuego;
      this.alumnosDelJuego.forEach(al => {
        this.alumnosConectados.push({
          alumno: al, 
          conectado: false
        })
      })
      this.dataSourceAlumnosConectados = new MatTableDataSource(this.alumnosConectados);
      this.RecuperarInscripcionesAlumnoJuego();
    });
  }

  RecuperarInscripcionesAlumnoJuego() {
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeCuestionario(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorNota = inscripciones;
      // tslint:disable-next-line:only-arrow-functions
      this.listaAlumnosOrdenadaPorNota = this.listaAlumnosOrdenadaPorNota.sort(function(a, b) {
        if (b.Nota !== a.Nota) {
          return b.Nota - a.Nota;
        } else {
          // en caso de empate en la nota, gana el que empleó menos tiempo
          return a.TiempoEmpleado - b.TiempoEmpleado;
        }
      });
      console.log ('inscripciones');
      console.log (this.listaAlumnosOrdenadaPorNota);
      this.TablaClasificacionTotal();
    });
  }

  TablaClasificacionTotal() {
    this.rankingAlumnosPorNota = this.calculos.PrepararTablaRankingCuestionario(this.listaAlumnosOrdenadaPorNota,
      this.alumnosDelJuego);
    this.dataSourceAlumno = new MatTableDataSource(this.rankingAlumnosPorNota);
  }

  DesactivarJuego() {
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.ModificaJuegoDeCuestionario(new JuegoDeCuestionario(this.juegoSeleccionado.NombreJuego, this.juegoSeleccionado.Tipo, this.juegoSeleccionado.Modalidad, this.juegoSeleccionado.PuntuacionCorrecta,
      this.juegoSeleccionado.PuntuacionIncorrecta, this.juegoSeleccionado.Presentacion, false, this.juegoSeleccionado.JuegoTerminado,
      // tslint:disable-next-line:max-line-length
      this.juegoSeleccionado.profesorId, this.juegoSeleccionado.grupoId, this.juegoSeleccionado.cuestionarioId), this.juegoSeleccionado.id, this.juegoSeleccionado.grupoId)
      .subscribe(res => {
        this.location.back();
      });
  }

  AbrirDialogoConfirmacionDesactivar(): void {

    Swal.fire({
      title: 'Desactivar',
      text: "Estas segura/o de que quieres desactivar: " + this.juegoSeleccionado.Tipo,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'

    }).then((result) => {
      if (result.value) {
        this.DesactivarJuego();
        Swal.fire('Desactivado', this.juegoSeleccionado.Tipo + ' Desactivado correctamente', 'success'); 
      }
    })

  }

  FinalizarJuego() {
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.ModificaJuegoDeCuestionario(new JuegoDeCuestionario(this.juegoSeleccionado.NombreJuego, this.juegoSeleccionado.Tipo, this.juegoSeleccionado.Modalidad, this.juegoSeleccionado.PuntuacionCorrecta,
      this.juegoSeleccionado.PuntuacionIncorrecta, this.juegoSeleccionado.Presentacion, false, true,
      // tslint:disable-next-line:max-line-length
      this.juegoSeleccionado.profesorId, this.juegoSeleccionado.grupoId, this.juegoSeleccionado.cuestionarioId), this.juegoSeleccionado.id, this.juegoSeleccionado.grupoId)
      .subscribe(res => {
        this.location.back();
      });
  }

  AbrirDialogoConfirmacionFinalizar(): void {

    Swal.fire({
      title: 'Finalizar',
      text: "Estas segura/o de que quieres finalizar: " + this.juegoSeleccionado.Tipo,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'

    }).then((result) => {
      if (result.value) {
        this.FinalizarJuego();
        Swal.fire('Finalizado', this.juegoSeleccionado.Tipo + ' Finalizado correctamente', 'success');
      }
    })
  }

  AbrirDialogoInformacionJuego(): void {
    const dialogRef = this.dialog.open(InformacionJuegoDeCuestionarioDialogComponent, {
      width: '45%',
      height: '60%',
      position: {
        top: '0%'
      }
    });
  }
  
  AvanzarPregunta(){
    this.comServer.AvanzarPregunta(this.juegoSeleccionado.grupoId);
  }
  applyFilter(filterValue: string) {
    this.dataSourceAlumno.filter = filterValue.trim().toLowerCase();
  }

  //Método para gestionar la conexión de los alumnos en la modalidad Kahoot
  MeConectoAKahoot(idAlumno: number){

    this.alumnosConectados.filter(item => item.alumno.id === idAlumno)[0].conectado = true;
    //Después de actualizar el item con la conexión, debemos volver a cargar la tabla.
    this.dataSourceAlumnosConectados = new MatTableDataSource(this.alumnosConectados);
  }
  //Para abrir la ventana de juego de Kahoot

  IniciarJuegoKahoot() {
    const idGrupo = this.sesion.DameJuego().grupoId;
    let juegoKahoot = new Juego;
    juegoKahoot = this.juegoSeleccionado;
    juegoKahoot.Tipo = "Juego De Cuestionario Kahoot";  
    console.log("Iniciamos navegación");
    //this.router.navigate(['/grupo/' + idGrupo + '/juegos/juegoSeleccionadoActivo/', {juego: juegoKahoot}]);
    
    this.router.navigate(['/grupo/' + idGrupo + '/juegos/juegoSeleccionadoActivo/'], { state: { juegoKahoot: true } });
  }
}

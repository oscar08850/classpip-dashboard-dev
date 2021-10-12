import { Component, OnInit } from '@angular/core';
import { SesionService, PeticionesAPIService, CalculosService } from '../../../servicios/index';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import {
  Alumno, Equipo, Juego, Punto, Nivel, AlumnoJuegoDePuntos, JuegoDeCuento, EquipoJuegoDePuntos,
  TablaAlumnoJuegoDePuntos, TablaEquipoJuegoDePuntos, JuegoDeAvatar, AlumnoJuegoDeAvatar, AlumnoJuegoDeCuento
} from '../../../clases/index';
import { MatDialog } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

import { MatTableDataSource } from '@angular/material/table';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-juego-de-cuento-seleccionado-inactivo',
  templateUrl: './juego-de-cuento-seleccionado-inactivo.component.html',
  styleUrls: ['./juego-de-cuento-seleccionado-inactivo.component.scss']
})
export class JuegoDeCuentoSeleccionadoInactivoComponent implements OnInit {

  
  displayedColumns: string[] = [ 'alumnoID', 'Nombre',  'nivel1', 'nivel2', 'nivel3', 'permisoparaver', 'permisoparavotar'];
  // displayedColumns: string[] = ['alumnoID',  'nivel1', 'nivel2', 'nivel3', 'permisoparaver', 'permisoparavotar'];

  listaDePrueba: any =[];
  listaJuegoAlumnosCuentos: any = [];
  listaLibros: any = [];

  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres reactivar el ';

  // tslint:disable-next-line:no-inferrable-types
  mensajeBorrar: string = 'Estás seguro/a de que quieres borrar el ';

  datasourceAlumno;
  juegoSeleccionado: any;
  grupoid: any;
  alumnosDelJuego: AlumnoJuegoDeCuento[];
  inscripcionesAlumnosJuegodelibro: AlumnoJuegoDeCuento[];
  selection1 = new SelectionModel<any>(true, []);
  selection2 = new SelectionModel<any>(true, []);
  selection3 = new SelectionModel<any>(true, []);
  selection4 = new SelectionModel<any>(true, []);
  selection5 = new SelectionModel<any>(true, []);
  haCambiado: boolean[];
  hayCambios: boolean = false;


  constructor(public dialog: MatDialog,
    private calculos: CalculosService,
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    private location: Location,
    private router: Router) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();

    this.grupoid = this.sesion.DameGrupo();
    this.obteneralumnosdelJuego();

  }
  
  /**
   * Método que permite al profesor ir al reproductor cuento y visualizar el cuento creado
   * @param contenedor Nombre del conteneder del cuento
   */
   irVisorCuento(contenedor){

    if(contenedor){

    
    this.sesion.setContenedor(contenedor);
    console.log("cuentoo: "+ contenedor);
    this.router.navigate(['/grupo/' + this.grupoid.id + '/juego/juegoSeleccionadoActivo/reproductorCuento'])
    }
    else Swal.fire('Alerta', 'El alumno no ha creado ningún cuento', 'warning');

  }


  /**
   * Método que pide a la API todos los alumnos que pertenecen al Juego de Cuento y sus respectivos cuentos
   */
  obteneralumnosdelJuego() {

    this.peticionesAPI.DameAlumnosJuegoCuento(this.juegoSeleccionado.id)
      .subscribe(alumnosJuego => {

        console.log(alumnosJuego);
        this.alumnosDelJuego = alumnosJuego;
        this.haCambiado = Array(this.alumnosDelJuego.length).fill(false);
        this.PrepararTabla();
        this.alumnosDelJuego.forEach(element => {


          this.peticionesAPI.dameCuento(element.id)
          .subscribe((res) => {
            if (res.length != 0) {
              this.listaLibros.push(res[0]);
              console.log(this.listaLibros);
            }
            else this.listaLibros.push(false);
    
          }, (err) => {
          })
        });
      });
  }

  /**
   * Prepara la tabla con todos los privilegios que tengan asignados los alumnos
   */
  PrepararTabla() {
    this.datasourceAlumno = new MatTableDataSource(this.alumnosDelJuego);

    console.log(this.datasourceAlumno);

    this.datasourceAlumno.data.forEach(row => {

      const inscripcion = this.alumnosDelJuego.filter(ins => ins.alumnoID === row.alumnoID)[0];
      // Ahora activo o desactivo el selector de cada privilegio según tenga el alumno ese privilegio o no
      if (inscripcion.nivel1) {
        this.selection1.select(row);
      } else {
        this.selection1.deselect(row);
      }
      if (inscripcion.nivel2) {
        this.selection2.select(row);
      } else {
        this.selection2.deselect(row);
      }
      if (inscripcion.nivel3) {
        this.selection3.select(row);
      } else {
        this.selection3.deselect(row);
      }
      if (inscripcion.permisoparaver) {
        this.selection4.select(row);
      } else {
        this.selection4.deselect(row);
      }
      if (inscripcion.permisoparavotar) {
        this.selection5.select(row);
      } else {
        this.selection5.deselect(row);
      }


    });

  }

    /**
   * Seleccionamos todas la casilla de la columna del privilegio que quiera el profesor
   * @param n se refiere al privilegio seleccionado
   * @returns devuelve el numero de alumnos que hay que seleccionar
   */
  IsAllSelected(n) {
    let numSelected;
    if (n === 1) {
      numSelected = this.selection1.selected.length;
    }
    if (n === 2) {
      numSelected = this.selection2.selected.length;
    }
    if (n === 3) {
      numSelected = this.selection3.selected.length;
    }
    if (n === 4) {
      numSelected = this.selection4.selected.length;
    }
    if (n === 5) {
      numSelected = this.selection5.selected.length;
    }

    const numRows = this.datasourceAlumno.data.length;
    return numSelected === numRows;
  }



  /**
   * Permite modificar el privilegio del alumno
   * @param n 
   */
  MasterToggle(n) {

    if (n === 1) {
      if (this.IsAllSelected(1)) {


        this.selection1.clear();
        this.alumnosDelJuego.forEach(inscripcion => inscripcion.nivel1 = false);
      } else {
        // Tengo que activar todos los elementos del selector
        this.datasourceAlumno.data.forEach(row => this.selection1.select(row));
        // y conceder el privilegio correspondiente a todos los alumnos
        this.alumnosDelJuego.forEach(inscripcion => inscripcion.nivel1 = true);
      }
    }
    if (n === 2) {
      if (this.IsAllSelected(2)) {
        this.selection2.clear(); // Desactivamos todos
        this.alumnosDelJuego.forEach(inscripcion => inscripcion.nivel2 = false);
      } else {
        this.datasourceAlumno.data.forEach(row => this.selection2.select(row));
        this.alumnosDelJuego.forEach(inscripcion => inscripcion.nivel2 = true);
      }
    }
    if (n === 3) {
      if (this.IsAllSelected(3)) {
        this.selection3.clear(); // Desactivamos todos
        this.alumnosDelJuego.forEach(inscripcion => inscripcion.nivel3 = false);
      } else {
        this.datasourceAlumno.data.forEach(row => this.selection3.select(row));
        this.alumnosDelJuego.forEach(inscripcion => inscripcion.nivel3 = true);
      }
    }
    if (n === 4) {
      if (this.IsAllSelected(4)) {
        this.selection4.clear(); // Desactivamos todos
        this.alumnosDelJuego.forEach(inscripcion => inscripcion.permisoparaver = false);
      } else {
        this.datasourceAlumno.data.forEach(row => this.selection4.select(row));
        this.alumnosDelJuego.forEach(inscripcion => inscripcion.permisoparaver = true);
      }
    }
    if (n === 5) {
      if (this.IsAllSelected(5)) {
        this.selection5.clear(); // Desactivamos todos
        this.alumnosDelJuego.forEach(inscripcion => inscripcion.permisoparavotar = false);
      } else {
        this.datasourceAlumno.data.forEach(row => this.selection5.select(row));
        this.alumnosDelJuego.forEach(inscripcion => inscripcion.permisoparavotar = true);
      }
    }
  
  
  }


  /**
   * Comprueba que nivel del alumno ha sido cambiado
   * @param n se refiere al nivel de privilegio: nivel1, nivel2, nivel3, permisoparaver
   * @param i se refiere al alumno del juego de cuento
   */
  HaCambiado(n ,i) {
    if(n==1)
    {
    this.alumnosDelJuego[i].nivel1 = !this.alumnosDelJuego[i].nivel1;

    }

    if(n==2)
    {
    this.alumnosDelJuego[i].nivel2 = !this.alumnosDelJuego[i].nivel2;
 
    }

    if(n==3)
    {
    this.alumnosDelJuego[i].nivel3 = !this.alumnosDelJuego[i].nivel3;
   
    }

    if(n==4)
    {
    this.alumnosDelJuego[i].permisoparaver = !this.alumnosDelJuego[i].permisoparaver;

    }

    if(n==5)
    {
    this.alumnosDelJuego[i].permisoparavotar = !this.alumnosDelJuego[i].permisoparavotar;
    
    }
 
  }



  /**
   * Método que guarda los cambios que el profesor ha realizado en la API
   */
  RegistrarCambios() {

    for (let i = 0; i < this.alumnosDelJuego.length; i++) {
      
  
        this.peticionesAPI.ModificarPermisosJuegoCuento(this.alumnosDelJuego[i], this.juegoSeleccionado.id).subscribe();
      
    }
    Swal.fire('Cambios registrados correctamente', ' ', 'success');
  }



/**
 * Metodo que abre dialogo para que el profesor confirme que desea desactivar el juego
 */  
AbrirDialogoConfirmacionReactivar(): void {

  const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
    height: '150px',
    data: {
      mensaje: this.mensaje,
      nombre: this.juegoSeleccionado.Tipo,
    }
  });

  dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    if (confirmed) {
      this.ReactivarJuego();
      Swal.fire('Reactivado', this.juegoSeleccionado.Tipo + ' reactivado correctamente', 'success');
    }
  });
}

/**
 * El juego vuelve a ser un juego activo
 */
ReactivarJuego() {
  console.log(this.juegoSeleccionado);
  this.peticionesAPI.CambiaEstadoJuegoDeCuentos(new Juego (this.juegoSeleccionado.Tipo, this.juegoSeleccionado.Modo,
    this.juegoSeleccionado.Asignacion,
    undefined, true, this.juegoSeleccionado.NumeroTotalJornadas, this.juegoSeleccionado.TipoJuegoCompeticion,
    this.juegoSeleccionado.NumeroParticipantesPuntuan, this.juegoSeleccionado.Puntos, this.juegoSeleccionado.NombreJuego),
    this.juegoSeleccionado.id, this.juegoSeleccionado.grupoId).subscribe(res => {
      if (res !== undefined) {
        console.log(res);
        console.log('juego reactivado');
        this.location.back();
      }
    });
}

/**
 * Se elimina el juego de forma permanente de la base de datos
 */
EliminarJuego() {

  this.peticionesAPI.BorrarAlumnosJuegoDeCuento(this.juegoSeleccionado.id).subscribe(res=>{

    console.log("alumnos eliminados")

    this.peticionesAPI.borrarRecursoJuegoDeCuento(this.juegoSeleccionado.id).subscribe(res=>{
      console.log("recurso juego de cuento eliminado");
    this.peticionesAPI.BorraJuegoDeCuento(this.juegoSeleccionado.id)
    .subscribe(res => {
      console.log('Juego eliminado');

      this.listaLibros.forEach(element => {
      if(element)
      {
        console.log(element.autor)
     this.peticionesAPI.BorrarCuentoDeAlumno(element.id)
      .subscribe(res =>{

        this.peticionesAPI.borrarCarpeta(element.titulo).subscribe(res=>{

        this.peticionesAPI.dameEscenas(element.id).subscribe( resultado =>{

          if(resultado){

            for(let i=0; i<resultado.length;i++){

              this.peticionesAPI.BorrarElementoDeEscena(resultado[i].id).subscribe(res=>{

                this.peticionesAPI.BorrarEscena(resultado[i].id).subscribe(res=>{
                  //this.location.back();
                });
              })
            }  
          }        
        
        });

      });
      });
      }
    }); 
    this.location.back();
    });
  });
  });
}

/**
 * Dialogo de confirmacion para eliminar el juego
 */
AbrirDialogoConfirmacionEliminar(): void {

  const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
    height: '150px',
    data: {
      mensaje: this.mensajeBorrar,
      nombre: this.juegoSeleccionado.Tipo,
    }
  });

  dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    if (confirmed) {
      this.EliminarJuego();
      Swal.fire('Eliminado', this.juegoSeleccionado.Tipo + ' eliminado correctamente', 'success');
    }
  });
}




}

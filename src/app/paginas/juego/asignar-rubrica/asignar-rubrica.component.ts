import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { CuestionarioSatisfaccion, Rubrica } from 'src/app/clases';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';

@Component({
  selector: 'app-asignar-rubrica',
  templateUrl: './asignar-rubrica.component.html',
  styleUrls: ['./asignar-rubrica.component.scss']
})
export class AsignarRubricaComponent implements OnInit {

  @Output() emisorRubricaElegida = new EventEmitter <number []>();

  profesorId: number;
  rubricas: Rubrica[];
  dataSource;


  displayedColumns: string[] = ['select', 'nombre', 'descripcion'];
  selection = new SelectionModel<any>(true, []);
  // Para que al hacer click se quede la fila marcada
  selectedRowIndex = -1;
 


  constructor(
                private sesion: SesionService,
                private peticionesAPI: PeticionesAPIService,
  ) { }

  ngOnInit() {
    this.profesorId = this.sesion.DameProfesor().id;
    // Peticion API Juego de Evaluacion
    this.peticionesAPI.DameRubricasProfesor(this.profesorId).subscribe(rubricas => {
      console.log('Tengo rubricas', rubricas);
      this.rubricas = rubricas;
      this.dataSource = new MatTableDataSource(this.rubricas);
    });
  }

 

  // TraeCuestionariosSatisfaccion() {
  //   this.peticionesAPI.DameTodosMisCuestionariosSatisfaccion(this.profesorId)
  //   .subscribe(cuestionarios => {
  //     if (cuestionarios !== undefined) {
  //       this.misCuestionarios = cuestionarios;
  //       console.log ('ya tengo mis cuestionarios de satisfaccion');
  //       console.log (this.misCuestionarios);
  //       this.dataSource = new MatTableDataSource(this.misCuestionarios);
  //     }
  //   });
  //   this.peticionesAPI.DameCuestionariosSatisfaccionPublicos()
  //   .subscribe (publicos => {
  //     // me quedo con los públicos de los demás
  //     const publicosDeOtros = publicos.filter (cuestionario => cuestionario.profesorId !== Number(this.profesorId));
  //     // traigo los profesores para añadir a los publicos el nombre del propietario
  //     this.peticionesAPI.DameProfesores ()
  //     .subscribe (profesores => {
  //       publicosDeOtros.forEach (publico => {
  //         const propietario = profesores.filter (profesor => profesor.id === publico.profesorId)[0];
  //         publico.Titulo = publico.Titulo + '(' + propietario.Nombre + ' ' + propietario.PrimerApellido + ')';
  //       });
  //       this.cuestionariosPublicos = publicosDeOtros;
  //       console.log ('ya tengo los cuestionarios de satisfaccion publicos');
  //       console.log (this.cuestionariosPublicos);
  //     });
  //   });
  // }

  
  HaSeleccionado() {
    if (this.selection.selected.length === 0) {
     return false;
    } else {
      return true;
    }
  }
  Marcar(row) {
    if (this.selection.isSelected(row)) {
      this.selection.deselect(row);
    } else {
      this.selection.clear();
      this.selection.select(row);
    }
  }

  AcabarSeleccion() {
    console.log ('voy a cogerlo');
    const rubrica = this.dataSource.data.filter (row => this.selection.isSelected(row))[0];
    this.emisorRubricaElegida.emit (rubrica);
  }
  // MostrarPublicos() {
  //   this.muestroPublicos = true;
  //   this.dataSource = new MatTableDataSource(this.misCuestionarios.concat (this.cuestionariosPublicos));
  // }

  // QuitarPublicos() {
  //   this.muestroPublicos = false;
  //   this.dataSource = new MatTableDataSource(this.misCuestionarios);
  // }

}

import { Component, OnInit } from '@angular/core';
import { SesionService, CalculosService, PeticionesAPIService } from '../../servicios';
import { Router } from '@angular/router';
import { Rubrica } from 'src/app/clases';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-mis-rubricas',
  templateUrl: './mis-rubricas.component.html',
  styleUrls: ['./mis-rubricas.component.scss']
})
export class MisRubricasComponent implements OnInit {


  rubricaElegida: Rubrica;
  rubricaId: number;
  profesorId: number;

  rubricasProfesor: Rubrica[];
  rubricasPublicas: Rubrica[];
  dataSource;
  dataSourcePublicas;
  propietarios: string [];
  displayedColumns: string[] = ['nombre', 'descripcion', 'download', 'iconos'];
  interval;
  mostrarLinkGuardar: boolean[] = [];
  mostrarLinkGuardarPublica: boolean[] = [];

  
  constructor(
                private peticionesAPI: PeticionesAPIService,
                private sesion: SesionService,   private location: Location,
                private router: Router
  ) { }

  ngOnInit() {

    this.profesorId = this.sesion.DameProfesor().id;
    console.log(this.profesorId);

    this.TraeRubricasDelProfesor();
    this.DameTodasLasRubricasPublicas();
    this.mostrarLinkGuardar = Array(this.rubricasProfesor.length).fill (false);
    this.mostrarLinkGuardarPublica = Array(this.rubricasPublicas.length).fill (false);

  }

 

  MuestraRubrica() {
    this.rubricaElegida = this.rubricasProfesor.filter (rubrica => rubrica.id === Number(this.rubricaId))[0];
  }

  EliminarRubrica (rubrica: Rubrica) {
    Swal.fire({
      title: '¿Seguro que quieres eliminar esta rúbrica?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {
        this.peticionesAPI.BorrarRubrica (rubrica.id)
        .subscribe (() =>  {
          this.rubricasProfesor = this.rubricasProfesor.filter (rub => rub.id !== Number(rubrica.id));
          this.dataSource = new MatTableDataSource(this.rubricasProfesor);
          Swal.fire('OK', 'Rúbrica eliminada', 'success');
        });
      }
    });

  }


  
 
  // Obtenemos todas las rubricas del profesor
  TraeRubricasDelProfesor() {

    this.peticionesAPI.DameRubricasProfesor(this.profesorId)
    .subscribe(rubricas => {
      if (rubricas[0] !== undefined) {
        this.rubricasProfesor = rubricas;
        this.dataSource = new MatTableDataSource(this.rubricasProfesor);
        console.log(this.rubricasProfesor);
      } else {
        this.rubricasProfesor = undefined;
      }

    });
  }


  DameTodasLasRubricasPublicas() {
    // traigo todos los publicos excepto los del profesor
    this.peticionesAPI.DameRubricasPublicas()
    .subscribe ( res => {
      console.log ('rubricas publicas');
      console.log (res);

      if (res[0] !== undefined) {
        this.rubricasPublicas = res.filter (rubrica => rubrica.profesorId !== this.profesorId);
        if (this.rubricasPublicas.length === 0) {
          this.rubricasPublicas = undefined;

        } else {
          this.dataSourcePublicas = new MatTableDataSource(this.rubricasPublicas);
          this.propietarios = [];
          // Traigo profesores para preparar los nombres de los propietarios
          this.peticionesAPI.DameProfesores()
          .subscribe ( profesores => {
            this.rubricasPublicas.forEach (rubrica => {
              const propietario = profesores.filter (p => p.id === rubrica.profesorId)[0];
              this.propietarios.push (propietario.Nombre + ' ' + propietario.PrimerApellido);
            });
          });
        }
      }
    });
  }



//  EditarColeccion(coleccion: Coleccion) {

//   // Busca los cromos dela coleccion en la base de datos
//   this.peticionesAPI.DameCromosColeccion(coleccion.id)
//   .subscribe(res => {
//       this.cromosColeccion = res;
//       this.sesion.TomaColeccion(coleccion);
//       console.log ('voy a entregar los cromos');
//       console.log (this.cromosColeccion);
//       this.sesion.TomaCromos (this.cromosColeccion);
//       this.router.navigate(['/inicio/' + this.profesorId + '/misColecciones/editarColeccion']);

//   });
//   }



//  Descargar(coleccion: Coleccion) {

//   this.sesion.TomaColeccion(coleccion);
//   this.router.navigate(['/inicio/' + this.profesorId + '/misColecciones/guardarColeccion']);

// }


// Mostrar(coleccion: Coleccion) {

//   this.sesion.TomaColeccion(coleccion);
//   this.router.navigate(['/inicio/' + this.profesorId + '/misColecciones/mostrarColeccion']);

// }



   // Utilizamos esta función para eliminar una colección de la base de datos y actualiza la lista de colecciones
 





  HazPublicaRubrica(rubrica: Rubrica) {
    rubrica.Publica = true;
    this.peticionesAPI.ModificaRubrica  (rubrica).subscribe();
  }


  HazPrivadaRubrica(rubrica: Rubrica) {
    rubrica.Publica = false;
    this.peticionesAPI.ModificaRubrica  (rubrica).subscribe();
  }

  
  EditarRubrica(rubrica: Rubrica) {
    // enviamos la rubrica para editar
    this.sesion.TomaRubrica(rubrica, true);
    this.router.navigate(['/inicio/' + this.profesorId + '/editarRubrica']);
  }

  
  MostrarRubrica(rubrica: Rubrica) {
    // enviamos la rubrica pero solo para ver
    this.sesion.TomaRubrica(rubrica, false);
    this.router.navigate(['/inicio/' + this.profesorId + '/editarRubrica']);
  }

  CrearCopia(rubrica: Rubrica) {
    console.log ('vamos a crear copia');
    const copia = new Rubrica(
      rubrica.Nombre + '(copia)',
      rubrica.Descripcion,
      rubrica.Criterios,
      rubrica.profesorId);

    this.peticionesAPI.CreaRubrica(copia, this.profesorId)
      .subscribe (nuevo => {
        // Añado la rubrica a la lista que se muestra
        if (this.rubricasProfesor === undefined) {
          this.rubricasProfesor = [];
        }
        this.rubricasProfesor.push (nuevo);
        this.dataSource = new MatTableDataSource(this.rubricasProfesor);
        Swal.fire('OK', 'Se ha creado una copia privada de la rúbrica', 'success');
      });
  }

  DescargarRubrica (rubrica: Rubrica, i) {
    this.mostrarLinkGuardar = Array(this.rubricasProfesor.length).fill (false);
    this.mostrarLinkGuardar [i] = true;
    this.Descargar(rubrica);
  }
  DescargarRubricaPublica (rubrica: Rubrica, i) {
    this.mostrarLinkGuardarPublica = Array(this.rubricasPublicas.length).fill (false);
    this.mostrarLinkGuardarPublica [i] = true;
    this.Descargar(rubrica);
  }

  Descargar(rubrica: Rubrica) {
  
    const rubricaAGuardar = {
      Nombre:  rubrica.Nombre,
      Descripcion: rubrica.Descripcion,
      Criterios: rubrica.Criterios
    };
    

    console.log ('asi queda la rubrica');
    console.log (rubricaAGuardar);




    const theJSON = JSON.stringify(rubricaAGuardar);
    console.log ('asi queda el JSON');
    console.log (theJSON);

    const uri = "data:application/json;charset=ANSI," + encodeURIComponent(theJSON);

    // Este es un nuevo caso en el que tenemos que obtener de la vista html un elemento
    // que está protegido por un *ngIf. El sistema primero intenta obtener el elemento y puede
    // encontrar que el elemento aún no existe. Para invertir el orden ponemos un temporizador,
    // con lo que primero creará el elemento y luego lo obtendrá. Un tiempo 0 es suficiente.

    this.interval = setInterval(() => {
      const a = document.getElementById('generarJSON');
      a.setAttribute ('href', uri);
      a.setAttribute ('download', rubrica.Nombre);
      a.innerHTML = "Botón derecho y guardar como ...'";
      clearInterval(this.interval);
    }, 0);



  }

}

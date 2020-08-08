import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
//Servicios
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import { Rubrica } from 'src/app/clases';

@Component({
  selector: 'app-crear-rubrica',
  templateUrl: './crear-rubrica.component.html',
  styleUrls: ['./crear-rubrica.component.scss']
})
export class CrearRubricaComponent implements OnInit {
  advertencia = true;
  rubrica: Rubrica;
  rubricaCargada = false;
  profesorId: number;
  finalizar: Boolean = false;

  constructor(
    public sesion: SesionService,
    public peticionesAPI: PeticionesAPIService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.profesorId = this.sesion.DameProfesor().id;
  }


 // Activa la función SeleccionarFicheroPreguntas
 ActivarInputInfo() {
  console.log('Activar input');
  document.getElementById('inputInfo').click();
}


   // Par abuscar el fichero JSON que contiene la info de la rubrica
  SeleccionarFicheroRubrica($event) {
    const fileInfo = $event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(fileInfo);
    reader.onload = () => {
      try {
        this.rubrica = JSON.parse(reader.result.toString());
        Swal.fire('La rubrica se ha cargado correctamente', '', 'success');
        this.rubricaCargada = true;
      } catch (e) {
        Swal.fire('Error en el formato del fichero', '', 'error');
      }
    };
  }


  RegistrarRubrica() {
    this.peticionesAPI.CreaRubrica (this.rubrica, this.profesorId)
    .subscribe((res) => {
        if (res != null) {
            Swal.fire('Rúbrica guardada correctamente', '', 'success');
            this.finalizar = true;
            this.goBack();
        } else {
          console.log('Fallo al guardar la rúbrica');
        }
      });
  }


  goBack() {
    this.router.navigate(['/inicio/' + this.profesorId]);
  }

}

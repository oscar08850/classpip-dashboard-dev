import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { Location } from '@angular/common';
import { DataSource } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';

// Servicios
import { ProfesorService, GrupoService } from '../../servicios/index';

// Clases
import { Grupo } from '../../clases/index';


@Component({
  selector: 'app-mis-grupos',
  templateUrl: './mis-grupos.component.html',
  styleUrls: ['./mis-grupos.component.scss']

})

export class MisGruposComponent implements OnInit {

  // PONEMOS LAS COLUMNAS DE LA TABLA Y LA LISTA QUE TENDRÁ LA INFORMACIÓN QUE QUEREMOS MOSTRAR
  displayedColumns: string[] = ['nombre', 'descripcion'];
  listaGrupos: Grupo[];

  // LO USAREMOS PARA EL ROUTE AL SIGUIENTE COMPONENTE
  returnUrl: string;

  // IDENTIFICADOR ÚNICO DEL PROFESOR QUE LO RECUPERAREMOS DE LA URL
  identificadorProfesor: number;



  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private profesorService: ProfesorService,
              private grupoService: GrupoService) { }

  ngOnInit() {

    // tslint:disable-next-line:no-string-literal
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/grupo';

    // RECUPERAMOS EL ID DEL PROFESOR DE LA URL
    this.identificadorProfesor = Number (this.route.snapshot.paramMap.get('id'));


    // CUANDO INICIEMOS EL COMPONENTE NOS LISTARÁ LOS GRUPOS DEL PROFESOR QUE RECUPERAMOS EL ID DE LA URL
    this.GruposDelProfesor();

  }

  // LE PASAMOS EL IDENTIFICADOR DEL PROFESOR Y NOS DEVUELVE UNA LISTA CON LOS GRUPOS QUE TIENE
  GruposDelProfesor() {

    this.grupoService.GET_GruposDelProfesor(this.identificadorProfesor)
    .subscribe(res => {
      if (res[0] !== undefined) {
        console.log('Voy a dar la lista');
        this.listaGrupos = res;
        console.log(this.listaGrupos);
        this.profesorService.EnviarProfesorIdAlServicio(this.identificadorProfesor);
      } else {
        this.listaGrupos = undefined;
      }

    });
  }

  // CUANDO CLICKEMOS ENCIMA DE UNA FILA, ENTRAREMOS EN ESTA FUNCIÓN QUE IDENTIFICA SOBRE EL GRUPO QUE HEMOS CLICKADO
  EntrarGrupo(grupo) {

    // AHORA SE LO ENVIO AL SERVICIO
    this.grupoService.EnviarGrupoAlServicio(grupo);

    // HAGO LA RUTA AL COMPONENTE GRUPO
    this.router.navigate([this.returnUrl, grupo.id]);
  }

  // NOS DEVOLVERÁ AL INICIO
  goBack() {
    this.location.back();
  }
}

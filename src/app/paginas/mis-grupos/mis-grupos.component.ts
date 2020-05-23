import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { Location } from '@angular/common';

// Servicios
import { SesionService, PeticionesAPIService, CalculosService } from '../../servicios/index';

// Clases
import { Grupo, Profesor } from '../../clases/index';


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
  profesor: Profesor;


  gruposObservable: any;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private sesion: SesionService,
              private peticionesAPI: PeticionesAPIService) { }

  ngOnInit() {

    // tslint:disable-next-line:no-string-literal
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/grupo';
    this.profesor = this.sesion.DameProfesor();
    // CUANDO INICIEMOS EL COMPONENTE NOS LISTARÁ LOS GRUPOS DEL PROFESOR QUE RECUPERAMOS EL ID DE LA URL
    this.GruposDelProfesor();
  }

  GruposDelProfesor() {
    console.log ('Busco grupos del profesor');
    this.peticionesAPI.DameGruposProfesor(this.profesor.id)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.listaGrupos = res;
      } else {
        this.listaGrupos = undefined;
      }
    });
  }

  // CUANDO CLICKEMOS ENCIMA DE UNA FILA, ENTRAREMOS EN ESTA FUNCIÓN QUE IDENTIFICA SOBRE EL GRUPO QUE HEMOS CLICKADO
  EntrarGrupo(grupo: Grupo) {

    // Envio el grupo a la sesión
    this.sesion.TomaGrupo (grupo);
    // Envio la lista de grupos porque se necesitará si el grupo elegido es eliminado
    this.sesion.TomaListaGrupos (this.listaGrupos);

    // Navegamos al componente Grupo
    // Aqui tambien pasa eso de que no sería necesario enviarle el identificador de
    // grupo porque el grupo ya está en la sesión. Pero habría que cambiar las rutas y
    // de momento lo dejamos asi.
    this.router.navigate([this.returnUrl, grupo.id]);
  }

  // NOS DEVOLVERÁ AL INICIO
  goBack() {
    this.location.back();
  }

}

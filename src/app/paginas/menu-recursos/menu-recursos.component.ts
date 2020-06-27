import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { SesionService} from '../../servicios/index';


@Component({
  selector: 'app-menu-recursos',
  templateUrl: './menu-recursos.component.html',
  styleUrls: ['./menu-recursos.component.scss']
})
export class MenuRecursosComponent implements OnInit {

  profesor;

  constructor(
    private router: Router,
    private sesion: SesionService
  ) {
  }

  ngOnInit() {
    this.profesor = this.sesion.DameProfesor();
  }

  NavegarA(destino) {
    this.router.navigate(['/inicio/' + this.profesor.id + destino]);
  }
}

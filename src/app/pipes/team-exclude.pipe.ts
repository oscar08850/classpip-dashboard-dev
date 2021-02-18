import { Pipe, PipeTransform } from '@angular/core';
import {JuegoComponent} from '../paginas/juego/juego.component';

@Pipe({
  name: 'teamExclude'
})
export class TeamExcludePipe implements PipeTransform {

  relacionAlumnosEquipos;

  constructor(public juego: JuegoComponent) {
    this.relacionAlumnosEquipos = juego.DameRelacionesAlumnoEquipos();
  }

  transform(items: Array<any>, team: any): Array<any> {
    if (!items || !team) {
      return items;
    }
    for (let equipo of this.relacionAlumnosEquipos) {
      if (equipo.equipoId === team.id) {
        return items.filter(({id: id1}) => !equipo.alumnos.some(({id: id2}) => id1 === id2));
      }
    }
  }

}

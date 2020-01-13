import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router/src/utils/preactivation';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { JuegoComponent } from '../paginas/juego/juego.component';

// Esta es la guarda para impedir que se abandone una página a menos que se confirme
@Injectable()
export class DeactivateGuardCrearJuego implements CanDeactivate {
    // tslint:disable-next-line:ban-types
    component: Object;
    route: ActivatedRouteSnapshot;
   constructor() {
   }

   canDeactivate( component: JuegoComponent,
                  route: ActivatedRouteSnapshot,
                  state: RouterStateSnapshot,
                  nextState: RouterStateSnapshot): Observable <boolean> {
        return component.canExit();
  }
}



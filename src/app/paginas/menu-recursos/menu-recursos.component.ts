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
   /////////////////////////////

   dataSource = ELEMENT_DATA;

   tables = [0];
   displayedColumns = [];

  constructor(
    private router: Router,
    private sesion: SesionService
  ) {
     ///////////////////////////
     this.displayedColumns.length = 24;
     this.displayedColumns.fill('filler');
 
     // The first two columns should be position and name; the last two columns: weight, symbol
     this.displayedColumns[0] = 'position';
     this.displayedColumns[1] = 'name';
     this.displayedColumns[22] = 'weight';
     this.displayedColumns[23] = 'symbol';
  }

  ngOnInit() {
    this.profesor = this.sesion.DameProfesor();
  }

  NavegarA(destino) {
    this.router.navigate(['/inicio/' + this.profesor.id + destino]);
  }
}

//////////////////
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

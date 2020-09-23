import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeColeccionSeleccionadoInactivoComponent } from './juego-de-coleccion-seleccionado-inactivo.component';

describe('JuegoDeColeccionSeleccionadoInactivoComponent', () => {
  let component: JuegoDeColeccionSeleccionadoInactivoComponent;
  let fixture: ComponentFixture<JuegoDeColeccionSeleccionadoInactivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeColeccionSeleccionadoInactivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeColeccionSeleccionadoInactivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeColeccionSeleccionadoActivoComponent } from './juego-de-coleccion-seleccionado-activo.component';

describe('JuegoDeColeccionSeleccionadoActivoComponent', () => {
  let component: JuegoDeColeccionSeleccionadoActivoComponent;
  let fixture: ComponentFixture<JuegoDeColeccionSeleccionadoActivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeColeccionSeleccionadoActivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeColeccionSeleccionadoActivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

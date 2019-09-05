import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnoSeleccionadoJuegoDePuntosComponent } from './alumno-seleccionado-juego-de-puntos.component';

describe('AlumnoSeleccionadoJuegoDePuntosComponent', () => {
  let component: AlumnoSeleccionadoJuegoDePuntosComponent;
  let fixture: ComponentFixture<AlumnoSeleccionadoJuegoDePuntosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlumnoSeleccionadoJuegoDePuntosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnoSeleccionadoJuegoDePuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

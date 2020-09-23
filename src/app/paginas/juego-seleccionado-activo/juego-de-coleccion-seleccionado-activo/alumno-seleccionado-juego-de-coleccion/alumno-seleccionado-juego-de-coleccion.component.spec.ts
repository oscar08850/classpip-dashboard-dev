import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnoSeleccionadoJuegoDeColeccionComponent } from './alumno-seleccionado-juego-de-coleccion.component';

describe('AlumnoSeleccionadoJuegoDeColeccionComponent', () => {
  let component: AlumnoSeleccionadoJuegoDeColeccionComponent;
  let fixture: ComponentFixture<AlumnoSeleccionadoJuegoDeColeccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlumnoSeleccionadoJuegoDeColeccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnoSeleccionadoJuegoDeColeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

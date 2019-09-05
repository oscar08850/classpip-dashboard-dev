import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoSeleccionadoJuegoDeColeccionComponent } from './equipo-seleccionado-juego-de-coleccion.component';

describe('EquipoSeleccionadoJuegoDeColeccionComponent', () => {
  let component: EquipoSeleccionadoJuegoDeColeccionComponent;
  let fixture: ComponentFixture<EquipoSeleccionadoJuegoDeColeccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipoSeleccionadoJuegoDeColeccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipoSeleccionadoJuegoDeColeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

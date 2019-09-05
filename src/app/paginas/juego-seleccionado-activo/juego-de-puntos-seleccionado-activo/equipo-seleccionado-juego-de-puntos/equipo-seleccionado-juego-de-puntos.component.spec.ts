import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoSeleccionadoJuegoDePuntosComponent } from './equipo-seleccionado-juego-de-puntos.component';

describe('EquipoSeleccionadoJuegoDePuntosComponent', () => {
  let component: EquipoSeleccionadoJuegoDePuntosComponent;
  let fixture: ComponentFixture<EquipoSeleccionadoJuegoDePuntosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipoSeleccionadoJuegoDePuntosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipoSeleccionadoJuegoDePuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

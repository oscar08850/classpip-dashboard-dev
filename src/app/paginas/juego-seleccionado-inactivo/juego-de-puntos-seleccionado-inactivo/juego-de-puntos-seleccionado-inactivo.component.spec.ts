import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDePuntosSeleccionadoInactivoComponent } from './juego-de-puntos-seleccionado-inactivo.component';

describe('JuegoDePuntosSeleccionadoInactivoComponent', () => {
  let component: JuegoDePuntosSeleccionadoInactivoComponent;
  let fixture: ComponentFixture<JuegoDePuntosSeleccionadoInactivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDePuntosSeleccionadoInactivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDePuntosSeleccionadoInactivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

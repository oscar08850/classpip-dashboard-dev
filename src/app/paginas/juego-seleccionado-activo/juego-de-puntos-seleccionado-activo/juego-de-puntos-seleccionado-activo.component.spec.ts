import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDePuntosSeleccionadoActivoComponent } from './juego-de-puntos-seleccionado-activo.component';

describe('JuegoDePuntosSeleccionadoActivoComponent', () => {
  let component: JuegoDePuntosSeleccionadoActivoComponent;
  let fixture: ComponentFixture<JuegoDePuntosSeleccionadoActivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDePuntosSeleccionadoActivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDePuntosSeleccionadoActivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

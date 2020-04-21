import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeCuestionarioSeleccionadoPreparadoComponent } from './juego-de-cuestionario-seleccionado-preparado.component';

describe('JuegoDeCuestionarioSeleccionadoPreparadoComponent', () => {
  let component: JuegoDeCuestionarioSeleccionadoPreparadoComponent;
  let fixture: ComponentFixture<JuegoDeCuestionarioSeleccionadoPreparadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeCuestionarioSeleccionadoPreparadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeCuestionarioSeleccionadoPreparadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

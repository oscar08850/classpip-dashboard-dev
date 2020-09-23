import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeCuestionarioSeleccionadoInactivoComponent } from './juego-de-cuestionario-seleccionado-inactivo.component';

describe('JuegoDeCuestionarioSeleccionadoInactivoComponent', () => {
  let component: JuegoDeCuestionarioSeleccionadoInactivoComponent;
  let fixture: ComponentFixture<JuegoDeCuestionarioSeleccionadoInactivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeCuestionarioSeleccionadoInactivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeCuestionarioSeleccionadoInactivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeCuestionarioKahootSeleccionadoActivoComponent } from './juego-de-cuestionario-kahoot-seleccionado-activo.component';

describe('JuegoDeCuestionarioKahootSeleccionadoActivoComponent', () => {
  let component: JuegoDeCuestionarioKahootSeleccionadoActivoComponent;
  let fixture: ComponentFixture<JuegoDeCuestionarioKahootSeleccionadoActivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeCuestionarioKahootSeleccionadoActivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeCuestionarioKahootSeleccionadoActivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeCuestionarioSeleccionadoActivoComponent } from './juego-de-cuestionario-seleccionado-activo.component';

describe('JuegoDeCuestionarioSeleccionadoActivoComponent', () => {
  let component: JuegoDeCuestionarioSeleccionadoActivoComponent;
  let fixture: ComponentFixture<JuegoDeCuestionarioSeleccionadoActivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeCuestionarioSeleccionadoActivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeCuestionarioSeleccionadoActivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

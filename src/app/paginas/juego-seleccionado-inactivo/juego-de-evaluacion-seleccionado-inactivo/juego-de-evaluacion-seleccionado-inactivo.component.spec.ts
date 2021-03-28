import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeEvaluacionSeleccionadoInactivoComponent } from './juego-de-evaluacion-seleccionado-inactivo.component';

describe('JuegoDeEvaluacionSeleccionadoInactivoComponent', () => {
  let component: JuegoDeEvaluacionSeleccionadoInactivoComponent;
  let fixture: ComponentFixture<JuegoDeEvaluacionSeleccionadoInactivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeEvaluacionSeleccionadoInactivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeEvaluacionSeleccionadoInactivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

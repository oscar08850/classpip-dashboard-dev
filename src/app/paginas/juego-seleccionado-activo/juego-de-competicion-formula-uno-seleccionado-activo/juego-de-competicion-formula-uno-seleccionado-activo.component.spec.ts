import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeCompeticionFormulaUnoSeleccionadoActivoComponent } from './juego-de-competicion-formula-uno-seleccionado-activo.component';

describe('JuegoDeCompeticionFormulaUnoSeleccionadoActivoComponent', () => {
  let component: JuegoDeCompeticionFormulaUnoSeleccionadoActivoComponent;
  let fixture: ComponentFixture<JuegoDeCompeticionFormulaUnoSeleccionadoActivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeCompeticionFormulaUnoSeleccionadoActivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeCompeticionFormulaUnoSeleccionadoActivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPuntosJuegoDeCompeticionFormulaUnoComponent } from './editar-puntos-juego-formula-uno.component';

describe('JuegoDeCompeticionSeleccionadoActivoComponent', () => {
  let component: EditarPuntosJuegoDeCompeticionFormulaUnoComponent;
  let fixture: ComponentFixture<EditarPuntosJuegoDeCompeticionFormulaUnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarPuntosJuegoDeCompeticionFormulaUnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarPuntosJuegoDeCompeticionFormulaUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

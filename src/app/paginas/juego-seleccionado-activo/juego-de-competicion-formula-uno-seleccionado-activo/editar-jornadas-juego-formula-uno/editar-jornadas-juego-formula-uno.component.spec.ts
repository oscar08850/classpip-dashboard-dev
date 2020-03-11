import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarJornadasJuegoDeCompeticionFormulaUnoComponent } from './editar-jornadas-juego-formula-uno.component';

describe('JuegoDeCompeticionSeleccionadoActivoComponent', () => {
  let component: EditarJornadasJuegoDeCompeticionFormulaUnoComponent;
  let fixture: ComponentFixture<EditarJornadasJuegoDeCompeticionFormulaUnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarJornadasJuegoDeCompeticionFormulaUnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarJornadasJuegoDeCompeticionFormulaUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

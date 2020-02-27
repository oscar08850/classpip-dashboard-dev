import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// tslint:disable-next-line:max-line-length
import { JuegoDeCompeticionFormulaUnoSeleccionadoInactivoComponent } from './juego-de-competicion-formula-uno-seleccionado-inactivo.component';

describe('JuegoDeCompeticionSeleccionadoInactivoComponent', () => {
  let component: JuegoDeCompeticionFormulaUnoSeleccionadoInactivoComponent;
  let fixture: ComponentFixture<JuegoDeCompeticionFormulaUnoSeleccionadoInactivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeCompeticionFormulaUnoSeleccionadoInactivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeCompeticionFormulaUnoSeleccionadoInactivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

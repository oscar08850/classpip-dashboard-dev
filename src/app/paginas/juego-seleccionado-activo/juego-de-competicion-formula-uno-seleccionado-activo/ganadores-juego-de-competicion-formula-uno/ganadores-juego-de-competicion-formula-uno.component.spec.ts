import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanadoresJuegoDeCompeticionFormulaUnoComponent } from './ganadores-juego-de-competicion-formula-uno.component';

describe('GanadoresJuegoDeCompeticionFormulaUnoComponent', () => {
  let component: GanadoresJuegoDeCompeticionFormulaUnoComponent;
  let fixture: ComponentFixture<GanadoresJuegoDeCompeticionFormulaUnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanadoresJuegoDeCompeticionFormulaUnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanadoresJuegoDeCompeticionFormulaUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

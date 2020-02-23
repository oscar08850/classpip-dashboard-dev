import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionJuegoDeCompeticionFormulaUnoComponent } from './informacion-juego-de-competicion-formula-uno.component';

describe('InformacionJuegoDeCompeticionFormulaUnoComponent', () => {
  let component: InformacionJuegoDeCompeticionFormulaUnoComponent;
  let fixture: ComponentFixture<InformacionJuegoDeCompeticionFormulaUnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionJuegoDeCompeticionFormulaUnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionJuegoDeCompeticionFormulaUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// tslint:disable-next-line:max-line-length
import { InformacionJuegoDeCompeticionFormulaUnoInactivoComponent } from './informacion-juego-de-competicion-formula-uno-inactivo.component';

describe('InformacionJuegoDeCompeticioninactivoComponent', () => {
  let component: InformacionJuegoDeCompeticionFormulaUnoInactivoComponent;
  let fixture: ComponentFixture<InformacionJuegoDeCompeticionFormulaUnoInactivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionJuegoDeCompeticionFormulaUnoInactivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionJuegoDeCompeticionFormulaUnoInactivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

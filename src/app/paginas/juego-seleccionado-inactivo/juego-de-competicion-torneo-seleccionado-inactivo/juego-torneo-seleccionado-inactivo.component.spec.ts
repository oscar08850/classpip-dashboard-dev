import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// tslint:disable-next-line:max-line-length
import { JuegoDeCompeticionTorneoSeleccionadoInactivoComponent } from './juego-torneo-seleccionado-inactivo.component';

describe('JuegoDeCompeticionSeleccionadoInactivoComponent', () => {
  let component: JuegoDeCompeticionTorneoSeleccionadoInactivoComponent;
  let fixture: ComponentFixture<JuegoDeCompeticionTorneoSeleccionadoInactivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeCompeticionTorneoSeleccionadoInactivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeCompeticionTorneoSeleccionadoInactivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

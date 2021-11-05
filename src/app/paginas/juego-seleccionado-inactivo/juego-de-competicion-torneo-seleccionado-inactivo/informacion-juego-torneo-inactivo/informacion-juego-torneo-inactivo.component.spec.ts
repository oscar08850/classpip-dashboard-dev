import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// tslint:disable-next-line:max-line-length
import { InformacionJuegoDeCompeticionTorneoInactivoComponent } from './informacion-juego-torneo-inactivo.component';

describe('InformacionJuegoDeCompeticioninactivoComponent', () => {
  let component: InformacionJuegoDeCompeticionTorneoInactivoComponent;
  let fixture: ComponentFixture<InformacionJuegoDeCompeticionTorneoInactivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionJuegoDeCompeticionTorneoInactivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionJuegoDeCompeticionTorneoInactivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

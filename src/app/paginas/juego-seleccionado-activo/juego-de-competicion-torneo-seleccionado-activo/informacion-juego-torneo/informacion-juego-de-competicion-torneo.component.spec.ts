import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionJuegoDeCompeticionTorneoComponent } from './informacion-juego-de-competicion-torneo.component';

describe('InformacionJuegoDeCompeticionTorneoComponent', () => {
  let component: InformacionJuegoDeCompeticionTorneoComponent;
  let fixture: ComponentFixture<InformacionJuegoDeCompeticionTorneoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionJuegoDeCompeticionTorneoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionJuegoDeCompeticionTorneoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

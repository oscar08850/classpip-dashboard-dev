import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanadorJuegoDeCompeticionTorneoComponent } from './ganador-juego-de-competicion-torneo.component';

describe('GanadorJuegoDeCompeticionTorneoComponent', () => {
  let component: GanadorJuegoDeCompeticionTorneoComponent;
  let fixture: ComponentFixture<GanadorJuegoDeCompeticionTorneoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanadorJuegoDeCompeticionTorneoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanadorJuegoDeCompeticionTorneoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

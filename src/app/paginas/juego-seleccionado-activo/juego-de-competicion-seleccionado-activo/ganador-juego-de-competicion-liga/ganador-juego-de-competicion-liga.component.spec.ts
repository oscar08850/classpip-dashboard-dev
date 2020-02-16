import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanadorJuegoDeCompeticionLigaComponent } from './ganador-juego-de-competicion-liga.component';

describe('GanadorJuegoDeCompeticionLigaComponent', () => {
  let component: GanadorJuegoDeCompeticionLigaComponent;
  let fixture: ComponentFixture<GanadorJuegoDeCompeticionLigaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanadorJuegoDeCompeticionLigaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanadorJuegoDeCompeticionLigaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

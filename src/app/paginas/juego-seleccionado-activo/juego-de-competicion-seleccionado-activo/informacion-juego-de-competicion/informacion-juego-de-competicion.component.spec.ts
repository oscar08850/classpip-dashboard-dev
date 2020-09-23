import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionJuegoDeCompeticionComponent } from './informacion-juego-de-competicion.component';

describe('InformacionJuegoDeCompeticionComponent', () => {
  let component: InformacionJuegoDeCompeticionComponent;
  let fixture: ComponentFixture<InformacionJuegoDeCompeticionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionJuegoDeCompeticionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionJuegoDeCompeticionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

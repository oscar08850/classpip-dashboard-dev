import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionJuegoDeCompeticionInactivoComponent } from './informacion-juego-de-competicion-inactivo.component';

describe('InformacionJuegoDeCompeticioninactivoComponent', () => {
  let component: InformacionJuegoDeCompeticionInactivoComponent;
  let fixture: ComponentFixture<InformacionJuegoDeCompeticionInactivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionJuegoDeCompeticionInactivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionJuegoDeCompeticionInactivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

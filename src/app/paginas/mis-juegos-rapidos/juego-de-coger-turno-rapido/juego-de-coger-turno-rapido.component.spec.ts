import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeCogerTurnoRapidoComponent } from './juego-de-coger-turno-rapido.component';

describe('JuegoDeCogerTurnoRapidoComponent', () => {
  let component: JuegoDeCogerTurnoRapidoComponent;
  let fixture: ComponentFixture<JuegoDeCogerTurnoRapidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeCogerTurnoRapidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeCogerTurnoRapidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

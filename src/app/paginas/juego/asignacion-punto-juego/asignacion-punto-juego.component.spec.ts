import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionPuntoJuegoComponent } from './asignacion-punto-juego.component';

describe('AsignacionPuntoJuegoComponent', () => {
  let component: AsignacionPuntoJuegoComponent;
  let fixture: ComponentFixture<AsignacionPuntoJuegoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignacionPuntoJuegoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionPuntoJuegoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

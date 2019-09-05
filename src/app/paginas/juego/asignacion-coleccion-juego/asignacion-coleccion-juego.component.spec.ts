import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionColeccionJuegoComponent } from './asignacion-coleccion-juego.component';

describe('AsignacionColeccionJuegoComponent', () => {
  let component: AsignacionColeccionJuegoComponent;
  let fixture: ComponentFixture<AsignacionColeccionJuegoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignacionColeccionJuegoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionColeccionJuegoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

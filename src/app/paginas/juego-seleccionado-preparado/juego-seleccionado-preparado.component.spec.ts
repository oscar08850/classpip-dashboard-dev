import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoSeleccionadoPreparadoComponent } from './juego-seleccionado-preparado.component';

describe('JuegoSeleccionadoPreparadoComponent', () => {
  let component: JuegoSeleccionadoPreparadoComponent;
  let fixture: ComponentFixture<JuegoSeleccionadoPreparadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoSeleccionadoPreparadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoSeleccionadoPreparadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

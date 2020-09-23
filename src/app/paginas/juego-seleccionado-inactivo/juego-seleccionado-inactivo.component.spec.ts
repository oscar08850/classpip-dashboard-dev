import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoSeleccionadoInactivoComponent } from './juego-seleccionado-inactivo.component';

describe('JuegoSeleccionadoInactivoComponent', () => {
  let component: JuegoSeleccionadoInactivoComponent;
  let fixture: ComponentFixture<JuegoSeleccionadoInactivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoSeleccionadoInactivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoSeleccionadoInactivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

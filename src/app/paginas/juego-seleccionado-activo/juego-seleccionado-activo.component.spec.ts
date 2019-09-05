import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoSeleccionadoActivoComponent } from './juego-seleccionado-activo.component';

describe('JuegoSeleccionadoActivoComponent', () => {
  let component: JuegoSeleccionadoActivoComponent;
  let fixture: ComponentFixture<JuegoSeleccionadoActivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoSeleccionadoActivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoSeleccionadoActivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

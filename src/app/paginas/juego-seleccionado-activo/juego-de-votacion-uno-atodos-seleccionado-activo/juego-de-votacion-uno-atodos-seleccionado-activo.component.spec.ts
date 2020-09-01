import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeVotacionUnoATodosSeleccionadoActivoComponent } from './juego-de-votacion-uno-atodos-seleccionado-activo.component';

describe('JuegoDeVotacionUnoATodosSeleccionadoActivoComponent', () => {
  let component: JuegoDeVotacionUnoATodosSeleccionadoActivoComponent;
  let fixture: ComponentFixture<JuegoDeVotacionUnoATodosSeleccionadoActivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeVotacionUnoATodosSeleccionadoActivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeVotacionUnoATodosSeleccionadoActivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

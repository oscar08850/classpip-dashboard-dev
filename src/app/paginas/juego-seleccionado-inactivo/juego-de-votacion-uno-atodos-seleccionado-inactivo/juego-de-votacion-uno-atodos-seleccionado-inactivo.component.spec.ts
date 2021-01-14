import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeVotacionUnoATodosSeleccionadoInactivoComponent } from './juego-de-votacion-uno-atodos-seleccionado-inactivo.component';

describe('JuegoDeVotacionUnoATodosSeleccionadoInactivoComponent', () => {
  let component: JuegoDeVotacionUnoATodosSeleccionadoInactivoComponent;
  let fixture: ComponentFixture<JuegoDeVotacionUnoATodosSeleccionadoInactivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeVotacionUnoATodosSeleccionadoInactivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeVotacionUnoATodosSeleccionadoInactivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

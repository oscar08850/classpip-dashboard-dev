import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeVotacionTodosAUnoSeleccionadoInactivoComponent } from './juego-de-votacion-todos-auno-seleccionado-inactivo.component';

describe('JuegoDeVotacionTodosAUnoSeleccionadoInactivoComponent', () => {
  let component: JuegoDeVotacionTodosAUnoSeleccionadoInactivoComponent;
  let fixture: ComponentFixture<JuegoDeVotacionTodosAUnoSeleccionadoInactivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeVotacionTodosAUnoSeleccionadoInactivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeVotacionTodosAUnoSeleccionadoInactivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

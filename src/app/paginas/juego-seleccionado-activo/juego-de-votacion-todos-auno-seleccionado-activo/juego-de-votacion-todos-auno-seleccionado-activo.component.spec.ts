import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeVotacionTodosAUnoSeleccionadoActivoComponent } from './juego-de-votacion-todos-auno-seleccionado-activo.component';

describe('JuegoDeVotacionTodosAUnoSeleccionadoActivoComponent', () => {
  let component: JuegoDeVotacionTodosAUnoSeleccionadoActivoComponent;
  let fixture: ComponentFixture<JuegoDeVotacionTodosAUnoSeleccionadoActivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeVotacionTodosAUnoSeleccionadoActivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeVotacionTodosAUnoSeleccionadoActivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

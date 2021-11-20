import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeVotacionAOpcionesSeleccionadoInactivoComponent } from './juego-de-votacion-aopciones-seleccionado-inactivo.component';

describe('JuegoDeVotacionAOpcionesSeleccionadoInactivoComponent', () => {
  let component: JuegoDeVotacionAOpcionesSeleccionadoInactivoComponent;
  let fixture: ComponentFixture<JuegoDeVotacionAOpcionesSeleccionadoInactivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeVotacionAOpcionesSeleccionadoInactivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeVotacionAOpcionesSeleccionadoInactivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

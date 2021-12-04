import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeVotacionAOpcionesSeleccionadoActivoComponent } from './juego-de-votacion-aopciones-seleccionado-activo.component';

describe('JuegoDeVotacionAOpcionesSeleccionadoActivoComponent', () => {
  let component: JuegoDeVotacionAOpcionesSeleccionadoActivoComponent;
  let fixture: ComponentFixture<JuegoDeVotacionAOpcionesSeleccionadoActivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeVotacionAOpcionesSeleccionadoActivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeVotacionAOpcionesSeleccionadoActivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

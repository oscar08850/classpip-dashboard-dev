import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeControlDeTrabajoEnEquipoSeleccionadoInactivoComponent } from './juego-de-control-de-trabajo-en-equipo-seleccionado-inactivo.component';

describe('JuegoDeControlDeTrabajoEnEquipoSeleccionadoInactivoComponent', () => {
  let component: JuegoDeControlDeTrabajoEnEquipoSeleccionadoInactivoComponent;
  let fixture: ComponentFixture<JuegoDeControlDeTrabajoEnEquipoSeleccionadoInactivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeControlDeTrabajoEnEquipoSeleccionadoInactivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeControlDeTrabajoEnEquipoSeleccionadoInactivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

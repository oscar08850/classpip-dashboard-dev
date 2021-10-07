import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeControlDeTrabajoEnEquipoSeleccionadoActivoComponent } from './juego-de-control-de-trabajo-en-equipo-seleccionado-activo.component';

describe('JuegoDeControlDeTrabajoEnEquipoSeleccionadoActivoComponent', () => {
  let component: JuegoDeControlDeTrabajoEnEquipoSeleccionadoActivoComponent;
  let fixture: ComponentFixture<JuegoDeControlDeTrabajoEnEquipoSeleccionadoActivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeControlDeTrabajoEnEquipoSeleccionadoActivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeControlDeTrabajoEnEquipoSeleccionadoActivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

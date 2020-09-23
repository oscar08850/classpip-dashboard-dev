import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeCompeticionSeleccionadoActivoComponent } from './juego-de-competicion-seleccionado-activo.component';

describe('JuegoDeCompeticionSeleccionadoActivoComponent', () => {
  let component: JuegoDeCompeticionSeleccionadoActivoComponent;
  let fixture: ComponentFixture<JuegoDeCompeticionSeleccionadoActivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeCompeticionSeleccionadoActivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeCompeticionSeleccionadoActivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

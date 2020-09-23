import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeCompeticionSeleccionadoInactivoComponent } from './juego-de-competicion-seleccionado-inactivo.component';

describe('JuegoDeCompeticionSeleccionadoInactivoComponent', () => {
  let component: JuegoDeCompeticionSeleccionadoInactivoComponent;
  let fixture: ComponentFixture<JuegoDeCompeticionSeleccionadoInactivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeCompeticionSeleccionadoInactivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeCompeticionSeleccionadoInactivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

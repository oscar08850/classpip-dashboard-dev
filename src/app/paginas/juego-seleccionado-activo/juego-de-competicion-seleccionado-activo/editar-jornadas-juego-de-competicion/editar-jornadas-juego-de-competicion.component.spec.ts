import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarJornadasJuegoDeCompeticionComponent } from './editar-jornadas-juego-de-competicion.component';

describe('JuegoDeCompeticionSeleccionadoActivoComponent', () => {
  let component: EditarJornadasJuegoDeCompeticionComponent;
  let fixture: ComponentFixture<EditarJornadasJuegoDeCompeticionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarJornadasJuegoDeCompeticionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarJornadasJuegoDeCompeticionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

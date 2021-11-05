import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarJornadasJuegoDeCompeticionTorneoComponent } from './editar-jornadas-juego-de-competicion-torneo.component';

describe('JuegoDeCompeticionTorneoSeleccionadoActivoComponent', () => {
  let component: EditarJornadasJuegoDeCompeticionTorneoComponent;
  let fixture: ComponentFixture<EditarJornadasJuegoDeCompeticionTorneoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarJornadasJuegoDeCompeticionTorneoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarJornadasJuegoDeCompeticionTorneoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

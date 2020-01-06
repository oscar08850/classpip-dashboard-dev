import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnosSeleccionadoJuegoDeCompeticionLigaComponent } from './alumnos-seleccionado-juego-de-competicion-liga.component';

describe('AlumnosSeleccionadoJuegoDeCompeticionLigaComponent', () => {
  let component: AlumnosSeleccionadoJuegoDeCompeticionLigaComponent;
  let fixture: ComponentFixture<AlumnosSeleccionadoJuegoDeCompeticionLigaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlumnosSeleccionadoJuegoDeCompeticionLigaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnosSeleccionadoJuegoDeCompeticionLigaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

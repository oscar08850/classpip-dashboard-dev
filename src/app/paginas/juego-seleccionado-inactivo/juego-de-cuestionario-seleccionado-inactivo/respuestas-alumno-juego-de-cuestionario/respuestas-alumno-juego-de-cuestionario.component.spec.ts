import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RespuestasAlumnoJuegoDeCuestionarioComponent } from './respuestas-alumno-juego-de-cuestionario.component';

describe('RespuestasAlumnoJuegoDeCuestionarioComponent', () => {
  let component: RespuestasAlumnoJuegoDeCuestionarioComponent;
  let fixture: ComponentFixture<RespuestasAlumnoJuegoDeCuestionarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RespuestasAlumnoJuegoDeCuestionarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RespuestasAlumnoJuegoDeCuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionRespuestasJuegoDeCuestionarioDialogComponent } from './informacion-respuestas-juego-de-cuestionario-dialog.component';

describe('InformacionRespuestasJuegoDeCuestionarioDialogComponent', () => {
  let component: InformacionRespuestasJuegoDeCuestionarioDialogComponent;
  let fixture: ComponentFixture<InformacionRespuestasJuegoDeCuestionarioDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionRespuestasJuegoDeCuestionarioDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionRespuestasJuegoDeCuestionarioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

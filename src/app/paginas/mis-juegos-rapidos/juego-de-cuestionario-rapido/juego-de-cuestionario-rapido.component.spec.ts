import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeCuestionarioRapidoComponent } from './juego-de-cuestionario-rapido.component';

describe('JuegoDeCuestionarioRapidoComponent', () => {
  let component: JuegoDeCuestionarioRapidoComponent;
  let fixture: ComponentFixture<JuegoDeCuestionarioRapidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeCuestionarioRapidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeCuestionarioRapidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeEncuestaRapidaComponent } from './juego-de-encuesta-rapida.component';

describe('JuegoDeEncuestaRapidaComponent', () => {
  let component: JuegoDeEncuestaRapidaComponent;
  let fixture: ComponentFixture<JuegoDeEncuestaRapidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeEncuestaRapidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeEncuestaRapidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

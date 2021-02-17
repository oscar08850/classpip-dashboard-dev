import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeCuestionarioSatisfaccionInactivoComponent } from './juego-de-cuestionario-satisfaccion-inactivo.component';

describe('JuegoDeCuestionarioSatisfaccionInactivoComponent', () => {
  let component: JuegoDeCuestionarioSatisfaccionInactivoComponent;
  let fixture: ComponentFixture<JuegoDeCuestionarioSatisfaccionInactivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeCuestionarioSatisfaccionInactivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeCuestionarioSatisfaccionInactivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

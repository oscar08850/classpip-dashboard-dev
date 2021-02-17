import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeCuestionarioSatisfaccionActivoComponent } from './juego-de-cuestionario-satisfaccion-activo.component';

describe('JuegoDeCuestionarioSatisfaccionActivoComponent', () => {
  let component: JuegoDeCuestionarioSatisfaccionActivoComponent;
  let fixture: ComponentFixture<JuegoDeCuestionarioSatisfaccionActivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeCuestionarioSatisfaccionActivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeCuestionarioSatisfaccionActivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

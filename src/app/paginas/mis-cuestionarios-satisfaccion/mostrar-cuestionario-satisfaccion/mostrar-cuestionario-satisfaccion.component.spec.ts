import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarCuestionarioSatisfaccionComponent } from './mostrar-cuestionario-satisfaccion.component';

describe('MostrarCuestionarioSatisfaccionComponent', () => {
  let component: MostrarCuestionarioSatisfaccionComponent;
  let fixture: ComponentFixture<MostrarCuestionarioSatisfaccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostrarCuestionarioSatisfaccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostrarCuestionarioSatisfaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

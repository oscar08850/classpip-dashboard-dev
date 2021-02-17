import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCuestionarioSatisfaccionComponent } from './crear-cuestionario-satisfaccion.component';

describe('CrearCuestionarioSatisfaccionComponent', () => {
  let component: CrearCuestionarioSatisfaccionComponent;
  let fixture: ComponentFixture<CrearCuestionarioSatisfaccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearCuestionarioSatisfaccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearCuestionarioSatisfaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

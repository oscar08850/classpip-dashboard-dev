import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarCuestionarioSatisfaccionComponent } from './asignar-cuestionario-satisfaccion.component';

describe('AsignarCuestionarioSatisfaccionComponent', () => {
  let component: AsignarCuestionarioSatisfaccionComponent;
  let fixture: ComponentFixture<AsignarCuestionarioSatisfaccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarCuestionarioSatisfaccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarCuestionarioSatisfaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

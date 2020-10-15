import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCuestionarioSatisfaccionComponent } from './editar-cuestionario-satisfaccion.component';

describe('EditarCuestionarioSatisfaccionComponent', () => {
  let component: EditarCuestionarioSatisfaccionComponent;
  let fixture: ComponentFixture<EditarCuestionarioSatisfaccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarCuestionarioSatisfaccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarCuestionarioSatisfaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

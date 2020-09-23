import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCuestionarioComponent } from './editar-cuestionario.component';

describe('EditarCuestionarioComponent', () => {
  let component: EditarCuestionarioComponent;
  let fixture: ComponentFixture<EditarCuestionarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarCuestionarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarCuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

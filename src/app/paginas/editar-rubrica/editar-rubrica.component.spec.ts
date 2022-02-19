import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarRubricaComponent } from './editar-rubrica.component';

describe('EditarRubricaComponent', () => {
  let component: EditarRubricaComponent;
  let fixture: ComponentFixture<EditarRubricaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarRubricaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarRubricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

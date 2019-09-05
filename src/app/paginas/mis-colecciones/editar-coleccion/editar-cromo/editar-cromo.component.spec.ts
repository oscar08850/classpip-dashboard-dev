import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCromoComponent } from './editar-cromo.component';

describe('EditarCromoComponent', () => {
  let component: EditarCromoComponent;
  let fixture: ComponentFixture<EditarCromoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarCromoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarCromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

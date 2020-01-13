import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCromoDialogComponent } from './editar-cromo-dialog.component';

describe('EditarCromoDialogComponent', () => {
  let component: EditarCromoDialogComponent;
  let fixture: ComponentFixture<EditarCromoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarCromoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarCromoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

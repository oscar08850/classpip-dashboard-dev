import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarCromoDialogComponent } from './agregar-cromo-dialog.component';

describe('AgregarCromoDialogComponent', () => {
  let component: AgregarCromoDialogComponent;
  let fixture: ComponentFixture<AgregarCromoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarCromoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarCromoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

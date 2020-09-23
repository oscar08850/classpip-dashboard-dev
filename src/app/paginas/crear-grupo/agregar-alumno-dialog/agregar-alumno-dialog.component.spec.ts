import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarAlumnoDialogComponent } from './agregar-alumno-dialog.component';

describe('AgregarAlumnoDialogComponent', () => {
  let component: AgregarAlumnoDialogComponent;
  let fixture: ComponentFixture<AgregarAlumnoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarAlumnoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarAlumnoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

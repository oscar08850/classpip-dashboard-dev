import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoverAlumnoComponent } from './mover-alumno.component';

describe('MoverAlumnoComponent', () => {
  let component: MoverAlumnoComponent;
  let fixture: ComponentFixture<MoverAlumnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoverAlumnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoverAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

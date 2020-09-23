import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisAlumnosComponent } from './mis-alumnos.component';

describe('MisAlumnosComponent', () => {
  let component: MisAlumnosComponent;
  let fixture: ComponentFixture<MisAlumnosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisAlumnosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisAlumnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

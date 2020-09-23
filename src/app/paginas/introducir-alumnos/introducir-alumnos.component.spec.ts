import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroducirAlumnosComponent } from './introducir-alumnos.component';

describe('IntroducirAlumnosComponent', () => {
  let component: IntroducirAlumnosComponent;
  let fixture: ComponentFixture<IntroducirAlumnosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntroducirAlumnosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroducirAlumnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

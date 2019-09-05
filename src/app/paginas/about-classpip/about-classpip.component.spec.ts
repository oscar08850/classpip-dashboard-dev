import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutClasspipComponent } from './about-classpip.component';

describe('AboutClasspipComponent', () => {
  let component: AboutClasspipComponent;
  let fixture: ComponentFixture<AboutClasspipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutClasspipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutClasspipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

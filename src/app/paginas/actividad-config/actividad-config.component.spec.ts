import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadConfigComponent } from './actividad-config.component';

describe('ActividadConfigComponent', () => {
  let component: ActividadConfigComponent;
  let fixture: ComponentFixture<ActividadConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActividadConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActividadConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

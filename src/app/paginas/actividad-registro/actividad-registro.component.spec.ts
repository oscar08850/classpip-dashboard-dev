import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadRegistroComponent } from './actividad-registro.component';

describe('ActividadRegistroComponent', () => {
  let component: ActividadRegistroComponent;
  let fixture: ComponentFixture<ActividadRegistroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActividadRegistroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActividadRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

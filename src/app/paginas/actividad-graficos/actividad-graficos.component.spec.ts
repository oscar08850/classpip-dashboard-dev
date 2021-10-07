import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadGraficosComponent } from './actividad-graficos.component';

describe('ActividadGraficosComponent', () => {
  let component: ActividadGraficosComponent;
  let fixture: ComponentFixture<ActividadGraficosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActividadGraficosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActividadGraficosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

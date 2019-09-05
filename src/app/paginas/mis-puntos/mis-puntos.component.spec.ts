import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisPuntosComponent } from './mis-puntos.component';

describe('MisPuntosComponent', () => {
  let component: MisPuntosComponent;
  let fixture: ComponentFixture<MisPuntosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisPuntosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisPuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

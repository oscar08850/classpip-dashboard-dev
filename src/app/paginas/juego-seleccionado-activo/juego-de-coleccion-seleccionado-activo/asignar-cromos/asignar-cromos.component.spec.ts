import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarCromosComponent } from './asignar-cromos.component';

describe('AsignarCromosComponent', () => {
  let component: AsignarCromosComponent;
  let fixture: ComponentFixture<AsignarCromosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarCromosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarCromosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarRubricaComponent } from './asignar-rubrica.component';

describe('AsignarRubricaComponent', () => {
  let component: AsignarRubricaComponent;
  let fixture: ComponentFixture<AsignarRubricaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarRubricaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarRubricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

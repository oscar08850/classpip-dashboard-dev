import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignaCuestionarioComponent } from './asigna-cuestionario.component';

describe('AsignaCuestionarioComponent', () => {
  let component: AsignaCuestionarioComponent;
  let fixture: ComponentFixture<AsignaCuestionarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignaCuestionarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignaCuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

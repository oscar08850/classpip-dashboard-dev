import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignaPreguntasComponent } from './asigna-preguntas.component';

describe('AsignaPreguntasComponent', () => {
  let component: AsignaPreguntasComponent;
  let fixture: ComponentFixture<AsignaPreguntasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignaPreguntasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignaPreguntasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

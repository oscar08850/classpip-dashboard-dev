import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearRubricaComponent } from './crear-rubrica.component';

describe('CrearRubricaComponent', () => {
  let component: CrearRubricaComponent;
  let fixture: ComponentFixture<CrearRubricaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearRubricaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearRubricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

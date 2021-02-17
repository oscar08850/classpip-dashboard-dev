import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisRubricasComponent } from './mis-rubricas.component';

describe('MisRubricasComponent', () => {
  let component: MisRubricasComponent;
  let fixture: ComponentFixture<MisRubricasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisRubricasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisRubricasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

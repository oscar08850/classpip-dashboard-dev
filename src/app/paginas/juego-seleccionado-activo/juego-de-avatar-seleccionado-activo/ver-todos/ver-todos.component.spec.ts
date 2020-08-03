import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerTodosComponent } from './ver-todos.component';

describe('VerTodosComponent', () => {
  let component: VerTodosComponent;
  let fixture: ComponentFixture<VerTodosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerTodosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerTodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuRecursosComponent } from './menu-recursos.component';

describe('MenuRecursosComponent', () => {
  let component: MenuRecursosComponent;
  let fixture: ComponentFixture<MenuRecursosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuRecursosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuRecursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

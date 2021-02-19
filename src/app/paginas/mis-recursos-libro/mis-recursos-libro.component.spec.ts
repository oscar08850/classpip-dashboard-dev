import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisRecursosLibroComponent } from './mis-recursos-libro.component';

describe('MisRecursosLibroComponent', () => {
  let component: MisRecursosLibroComponent;
  let fixture: ComponentFixture<MisRecursosLibroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisRecursosLibroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisRecursosLibroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

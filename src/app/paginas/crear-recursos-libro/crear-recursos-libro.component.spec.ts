import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearRecursosLibroComponent } from './crear-recursos-libro.component';

describe('CrearRecursosLibroComponent', () => {
  let component: CrearRecursosLibroComponent;
  let fixture: ComponentFixture<CrearRecursosLibroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearRecursosLibroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearRecursosLibroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

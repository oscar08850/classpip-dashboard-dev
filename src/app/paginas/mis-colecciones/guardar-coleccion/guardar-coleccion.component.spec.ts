import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardarColeccionComponent } from './guardar-coleccion.component';

describe('GuardarColeccionComponent', () => {
  let component: GuardarColeccionComponent;
  let fixture: ComponentFixture<GuardarColeccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuardarColeccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardarColeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

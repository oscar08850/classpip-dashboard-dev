import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarColeccionComponent } from './mostrar-coleccion.component';

describe('MostrarColeccionComponent', () => {
  let component: MostrarColeccionComponent;
  let fixture: ComponentFixture<MostrarColeccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostrarColeccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostrarColeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

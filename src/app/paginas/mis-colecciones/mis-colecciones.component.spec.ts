import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisColeccionesComponent } from './mis-colecciones.component';

describe('MisColeccionesComponent', () => {
  let component: MisColeccionesComponent;
  let fixture: ComponentFixture<MisColeccionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisColeccionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisColeccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarAlumnoEquipoComponent } from './agregar-alumno-equipo.component';

describe('AgregarAlumnoEquipoComponent', () => {
  let component: AgregarAlumnoEquipoComponent;
  let fixture: ComponentFixture<AgregarAlumnoEquipoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarAlumnoEquipoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarAlumnoEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

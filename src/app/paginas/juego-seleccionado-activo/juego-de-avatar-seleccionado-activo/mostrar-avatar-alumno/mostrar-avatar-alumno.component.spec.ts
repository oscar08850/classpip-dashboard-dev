import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarAvatarAlumnoComponent } from './mostrar-avatar-alumno.component';

describe('MostrarAvatarAlumnoComponent', () => {
  let component: MostrarAvatarAlumnoComponent;
  let fixture: ComponentFixture<MostrarAvatarAlumnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostrarAvatarAlumnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostrarAvatarAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

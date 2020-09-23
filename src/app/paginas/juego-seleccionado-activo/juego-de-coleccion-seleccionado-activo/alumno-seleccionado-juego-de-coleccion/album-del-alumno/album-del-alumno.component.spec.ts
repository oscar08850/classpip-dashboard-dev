import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumDelAlumnoComponent } from './album-del-alumno.component';

describe('AlbumDelAlumnoComponent', () => {
  let component: AlbumDelAlumnoComponent;
  let fixture: ComponentFixture<AlbumDelAlumnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumDelAlumnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumDelAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

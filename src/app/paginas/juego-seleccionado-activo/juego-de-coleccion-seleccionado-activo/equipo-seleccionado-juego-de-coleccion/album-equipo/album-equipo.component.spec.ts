import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumEquipoComponent } from './album-equipo.component';

describe('AlbumEquipoComponent', () => {
  let component: AlbumEquipoComponent;
  let fixture: ComponentFixture<AlbumEquipoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumEquipoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

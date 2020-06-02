import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeGeocachingSeleccionadoInactivoComponent } from './juego-de-geocaching-seleccionado-inactivo.component';

describe('JuegoDeGeocachingSeleccionadoInactivoComponent', () => {
  let component: JuegoDeGeocachingSeleccionadoInactivoComponent;
  let fixture: ComponentFixture<JuegoDeGeocachingSeleccionadoInactivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeGeocachingSeleccionadoInactivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeGeocachingSeleccionadoInactivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

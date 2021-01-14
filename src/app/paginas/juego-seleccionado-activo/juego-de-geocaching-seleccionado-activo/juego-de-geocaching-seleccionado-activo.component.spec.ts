import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeGeocachingSeleccionadoActivoComponent } from './juego-de-geocaching-seleccionado-activo.component';

describe('JuegoDeGeocachingSeleccionadoActivoComponent', () => {
  let component: JuegoDeGeocachingSeleccionadoActivoComponent;
  let fixture: ComponentFixture<JuegoDeGeocachingSeleccionadoActivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeGeocachingSeleccionadoActivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeGeocachingSeleccionadoActivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

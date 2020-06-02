import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeGeocachingSeleccionadoPreparadoComponent } from './juego-de-geocaching-seleccionado-preparado.component';

describe('JuegoDeCuestionarioSeleccionadoPreparadoComponent', () => {
  let component: JuegoDeGeocachingSeleccionadoPreparadoComponent;
  let fixture: ComponentFixture<JuegoDeGeocachingSeleccionadoPreparadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeGeocachingSeleccionadoPreparadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeGeocachingSeleccionadoPreparadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

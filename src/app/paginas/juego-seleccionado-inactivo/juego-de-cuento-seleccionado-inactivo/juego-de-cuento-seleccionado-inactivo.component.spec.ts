import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeCuentoSeleccionadoInactivoComponent } from './juego-de-cuento-seleccionado-inactivo.component';

describe('JuegoDeCuentoSeleccionadoInactivoComponent', () => {
  let component: JuegoDeCuentoSeleccionadoInactivoComponent;
  let fixture: ComponentFixture<JuegoDeCuentoSeleccionadoInactivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeCuentoSeleccionadoInactivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeCuentoSeleccionadoInactivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeCuentoSeleccionadoActivoComponent } from './juego-de-cuento-seleccionado-activo.component';

describe('JuegoDeCuentoSeleccionadoActivoComponent', () => {
  let component: JuegoDeCuentoSeleccionadoActivoComponent;
  let fixture: ComponentFixture<JuegoDeCuentoSeleccionadoActivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeCuentoSeleccionadoActivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeCuentoSeleccionadoActivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeMemoramaSeleccionadoActivoComponent } from './juego-de-memorama-seleccionado-activo.component';

describe('JuegoDeMemoramaSeleccionadoActivoComponent', () => {
  let component: JuegoDeMemoramaSeleccionadoActivoComponent;
  let fixture: ComponentFixture<JuegoDeMemoramaSeleccionadoActivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeMemoramaSeleccionadoActivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeMemoramaSeleccionadoActivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

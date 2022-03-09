import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeMemoramaSeleccionadoInactivoComponent } from './juego-de-memorama-seleccionado-inactivo.component';

describe('JuegoDeMemoramaSeleccionadoInactivoComponent', () => {
  let component: JuegoDeMemoramaSeleccionadoInactivoComponent;
  let fixture: ComponentFixture<JuegoDeMemoramaSeleccionadoInactivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeMemoramaSeleccionadoInactivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeMemoramaSeleccionadoInactivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

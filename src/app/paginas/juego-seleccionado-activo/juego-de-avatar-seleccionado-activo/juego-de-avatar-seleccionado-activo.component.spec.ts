import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeAvatarSeleccionadoActivoComponent } from './juego-de-avatar-seleccionado-activo.component';

describe('JuegoDeAvatarSeleccionadoActivoComponent', () => {
  let component: JuegoDeAvatarSeleccionadoActivoComponent;
  let fixture: ComponentFixture<JuegoDeAvatarSeleccionadoActivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeAvatarSeleccionadoActivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeAvatarSeleccionadoActivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

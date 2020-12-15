import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeAvatarSeleccionadoInactivoComponent } from './juego-de-avatar-seleccionado-inactivo.component';

describe('JuegoDeAvatarSeleccionadoInactivoComponent', () => {
  let component: JuegoDeAvatarSeleccionadoInactivoComponent;
  let fixture: ComponentFixture<JuegoDeAvatarSeleccionadoInactivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeAvatarSeleccionadoInactivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeAvatarSeleccionadoInactivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

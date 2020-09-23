import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionJuegoColeccionComponent } from './informacion-juego-coleccion.component';

describe('InformacionJuegoColeccionComponent', () => {
  let component: InformacionJuegoColeccionComponent;
  let fixture: ComponentFixture<InformacionJuegoColeccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionJuegoColeccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionJuegoColeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

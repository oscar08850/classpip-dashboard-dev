import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearJuegoRapidoComponent } from './crear-juego-rapido.component';

describe('CrearJuegoRapidoComponent', () => {
  let component: CrearJuegoRapidoComponent;
  let fixture: ComponentFixture<CrearJuegoRapidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearJuegoRapidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearJuegoRapidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

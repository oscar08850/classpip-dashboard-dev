import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarFamiliasJuegoAvataresComponent } from './asignar-familias-juego-avatares.component';

describe('AsignarFamiliasJuegoAvataresComponent', () => {
  let component: AsignarFamiliasJuegoAvataresComponent;
  let fixture: ComponentFixture<AsignarFamiliasJuegoAvataresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarFamiliasJuegoAvataresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarFamiliasJuegoAvataresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

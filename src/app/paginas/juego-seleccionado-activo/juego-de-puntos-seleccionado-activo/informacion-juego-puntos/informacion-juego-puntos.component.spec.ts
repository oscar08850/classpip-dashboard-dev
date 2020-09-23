import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionJuegoPuntosComponent } from './informacion-juego-puntos.component';

describe('InformacionJuegoPuntosComponent', () => {
  let component: InformacionJuegoPuntosComponent;
  let fixture: ComponentFixture<InformacionJuegoPuntosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionJuegoPuntosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionJuegoPuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

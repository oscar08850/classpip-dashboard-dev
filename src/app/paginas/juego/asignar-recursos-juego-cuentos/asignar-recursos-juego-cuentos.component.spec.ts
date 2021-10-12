import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarRecursosJuegoCuentosComponent } from './asignar-recursos-juego-cuentos.component';

describe('AsignarRecursosJuegoCuentosComponent', () => {
  let component: AsignarRecursosJuegoCuentosComponent;
  let fixture: ComponentFixture<AsignarRecursosJuegoCuentosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarRecursosJuegoCuentosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarRecursosJuegoCuentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

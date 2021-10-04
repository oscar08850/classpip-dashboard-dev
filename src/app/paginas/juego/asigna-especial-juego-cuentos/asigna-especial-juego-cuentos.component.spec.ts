import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignaEspecialJuegoCuentosComponent } from './asigna-especial-juego-cuentos.component';

describe('AsignaEspecialJuegoCuentosComponent', () => {
  let component: AsignaEspecialJuegoCuentosComponent;
  let fixture: ComponentFixture<AsignaEspecialJuegoCuentosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignaEspecialJuegoCuentosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignaEspecialJuegoCuentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

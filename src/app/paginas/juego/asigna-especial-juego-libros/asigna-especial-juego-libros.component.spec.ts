import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignaEspecialJuegoLibrosComponent } from './asigna-especial-juego-libros.component';

describe('AsignaEspecialJuegoLibrosComponent', () => {
  let component: AsignaEspecialJuegoLibrosComponent;
  let fixture: ComponentFixture<AsignaEspecialJuegoLibrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignaEspecialJuegoLibrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignaEspecialJuegoLibrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

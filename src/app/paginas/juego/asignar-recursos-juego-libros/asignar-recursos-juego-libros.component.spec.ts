import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarRecursosJuegoLibrosComponent } from './asignar-recursos-juego-libros.component';

describe('AsignarRecursosJuegoLibrosComponent', () => {
  let component: AsignarRecursosJuegoLibrosComponent;
  let fixture: ComponentFixture<AsignarRecursosJuegoLibrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarRecursosJuegoLibrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarRecursosJuegoLibrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

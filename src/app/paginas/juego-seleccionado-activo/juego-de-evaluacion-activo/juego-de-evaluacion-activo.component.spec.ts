import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeEvaluacionActivoComponent } from './juego-de-evaluacion-activo.component';

describe('JuegoDeEvaluacionActivoComponent', () => {
  let component: JuegoDeEvaluacionActivoComponent;
  let fixture: ComponentFixture<JuegoDeEvaluacionActivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeEvaluacionActivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeEvaluacionActivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

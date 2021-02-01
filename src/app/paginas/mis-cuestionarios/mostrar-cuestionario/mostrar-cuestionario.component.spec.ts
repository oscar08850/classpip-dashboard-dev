import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarCuestionarioComponent } from './mostrar-cuestionario.component';

describe('MostrarCuestionarioComponent', () => {
  let component: MostrarCuestionarioComponent;
  let fixture: ComponentFixture<MostrarCuestionarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostrarCuestionarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostrarCuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCuestionarioComponent } from './crear-cuestionario.component';

describe('CrearCuestionarioComponent', () => {
  let component: CrearCuestionarioComponent;
  let fixture: ComponentFixture<CrearCuestionarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearCuestionarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearCuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

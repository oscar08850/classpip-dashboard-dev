import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearRecursosCuentoComponent } from './crear-recursos-cuento.component';

describe('CrearRecursosCuentoComponent', () => {
  let component: CrearRecursosCuentoComponent;
  let fixture: ComponentFixture<CrearRecursosCuentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearRecursosCuentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearRecursosCuentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

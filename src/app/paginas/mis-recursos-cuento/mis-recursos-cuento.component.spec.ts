import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisRecursosCuentoComponent } from './mis-recursos-cuento.component';

describe('MisRecursosCuentoComponent', () => {
  let component: MisRecursosCuentoComponent;
  let fixture: ComponentFixture<MisRecursosCuentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisRecursosCuentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisRecursosCuentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

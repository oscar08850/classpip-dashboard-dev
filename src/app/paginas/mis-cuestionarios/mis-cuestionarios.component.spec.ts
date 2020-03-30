import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisCuestionariosComponent } from './mis-cuestionarios.component';

describe('MisCuestionariosComponent', () => {
  let component: MisCuestionariosComponent;
  let fixture: ComponentFixture<MisCuestionariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisCuestionariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisCuestionariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

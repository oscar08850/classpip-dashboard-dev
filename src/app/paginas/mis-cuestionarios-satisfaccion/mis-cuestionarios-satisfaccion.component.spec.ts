import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisCuestionariosSatisfaccionComponent } from './mis-cuestionarios-satisfaccion.component';

describe('MisCuestionariosSatisfaccionComponent', () => {
  let component: MisCuestionariosSatisfaccionComponent;
  let fixture: ComponentFixture<MisCuestionariosSatisfaccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisCuestionariosSatisfaccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisCuestionariosSatisfaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

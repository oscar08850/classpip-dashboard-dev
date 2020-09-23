import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionProfesorComponent } from './configuracion-profesor.component';

describe('ConfiguracionProfesorComponent', () => {
  let component: ConfiguracionProfesorComponent;
  let fixture: ComponentFixture<ConfiguracionProfesorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfiguracionProfesorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracionProfesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

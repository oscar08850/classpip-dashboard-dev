import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SesionesClaseComponent } from './sesiones-clase.component';

describe('PasarListaComponent', () => {
  let component: SesionesClaseComponent;
  let fixture: ComponentFixture<SesionesClaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SesionesClaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SesionesClaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

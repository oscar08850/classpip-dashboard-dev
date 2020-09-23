import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearNivelComponent } from './crear-nivel.component';

describe('CrearNivelComponent', () => {
  let component: CrearNivelComponent;
  let fixture: ComponentFixture<CrearNivelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearNivelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearNivelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

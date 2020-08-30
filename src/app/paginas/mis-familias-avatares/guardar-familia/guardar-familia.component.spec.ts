import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardarFamiliaComponent } from './guardar-familia.component';

describe('GuardarFamiliaComponent', () => {
  let component: GuardarFamiliaComponent;
  let fixture: ComponentFixture<GuardarFamiliaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuardarFamiliaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardarFamiliaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

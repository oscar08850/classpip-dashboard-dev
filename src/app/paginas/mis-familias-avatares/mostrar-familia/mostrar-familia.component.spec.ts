import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarFamiliaComponent } from './mostrar-familia.component';

describe('MostrarFamiliaComponent', () => {
  let component: MostrarFamiliaComponent;
  let fixture: ComponentFixture<MostrarFamiliaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostrarFamiliaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostrarFamiliaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

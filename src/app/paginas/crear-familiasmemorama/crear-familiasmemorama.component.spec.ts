import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearFamiliasmemoramaComponent } from './crear-familiasmemorama.component';

describe('CrearFamiliasmemoramaComponent', () => {
  let component: CrearFamiliasmemoramaComponent;
  let fixture: ComponentFixture<CrearFamiliasmemoramaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearFamiliasmemoramaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearFamiliasmemoramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisFamiliasmemoramaComponent } from './mis-familiasmemorama.component';

describe('MisFamiliasmemoramaComponent', () => {
  let component: MisFamiliasmemoramaComponent;
  let fixture: ComponentFixture<MisFamiliasmemoramaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisFamiliasmemoramaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisFamiliasmemoramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

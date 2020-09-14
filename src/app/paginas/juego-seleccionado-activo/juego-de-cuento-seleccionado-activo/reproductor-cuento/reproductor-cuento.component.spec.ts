import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReproductorCuentoComponent } from './reproductor-cuento.component';

describe('ReproductorCuentoComponent', () => {
  let component: ReproductorCuentoComponent;
  let fixture: ComponentFixture<ReproductorCuentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReproductorCuentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReproductorCuentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

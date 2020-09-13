import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotacionescuentoComponent } from './votacionescuento.component';

describe('VotacionescuentoComponent', () => {
  let component: VotacionescuentoComponent;
  let fixture: ComponentFixture<VotacionescuentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotacionescuentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotacionescuentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

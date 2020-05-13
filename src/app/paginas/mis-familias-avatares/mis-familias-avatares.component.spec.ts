import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisFamiliasAvataresComponent } from './mis-familias-avatares.component';

describe('MisFamiliasAvataresComponent', () => {
  let component: MisFamiliasAvataresComponent;
  let fixture: ComponentFixture<MisFamiliasAvataresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisFamiliasAvataresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisFamiliasAvataresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

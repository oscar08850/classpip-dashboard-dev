import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisGruposComponent } from './mis-grupos.component';

describe('MisGruposComponent', () => {
  let component: MisGruposComponent;
  let fixture: ComponentFixture<MisGruposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisGruposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisGruposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

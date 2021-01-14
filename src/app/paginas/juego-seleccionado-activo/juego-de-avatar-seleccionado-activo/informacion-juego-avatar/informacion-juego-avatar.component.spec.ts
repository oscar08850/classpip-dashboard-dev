import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionJuegoAvatarComponent } from './informacion-juego-avatar.component';

describe('InformacionJuegoAvatarComponent', () => {
  let component: InformacionJuegoAvatarComponent;
  let fixture: ComponentFixture<InformacionJuegoAvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionJuegoAvatarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionJuegoAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

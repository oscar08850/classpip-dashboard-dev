import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionJuegoDeGeocachingDialogComponent } from './informacion-juego-de-geocaching-dialog.component';

describe('InformacionJuegoDeGeocachingDialogComponent', () => {
  let component: InformacionJuegoDeGeocachingDialogComponent;
  let fixture: ComponentFixture<InformacionJuegoDeGeocachingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionJuegoDeGeocachingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionJuegoDeGeocachingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarPuntoGeolocalizableDialogComponent } from './agregar-cromo-dialog.component';

describe('AgregarCromoDialogComponent', () => {
  let component: AgregarPuntoGeolocalizableDialogComponent;
  let fixture: ComponentFixture<AgregarPuntoGeolocalizableDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarPuntoGeolocalizableDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarPuntoGeolocalizableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

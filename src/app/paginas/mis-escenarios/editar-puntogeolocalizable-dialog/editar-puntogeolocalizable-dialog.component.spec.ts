import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPuntoGeolocalizableDialogComponent } from './editar-puntogeolocalizable-dialog.component';

describe('EditarPuntoGeolocalizableDialogComponent', () => {
  let component: EditarPuntoGeolocalizableDialogComponent;
  let fixture: ComponentFixture<EditarPuntoGeolocalizableDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarPuntoGeolocalizableDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarPuntoGeolocalizableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

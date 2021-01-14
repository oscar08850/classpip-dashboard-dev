import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisFamiliasImagenesPerfilComponent } from './mis-familias-imagenes-perfil.component';

describe('MisFamiliasImagenesPerfilComponent', () => {
  let component: MisFamiliasImagenesPerfilComponent;
  let fixture: ComponentFixture<MisFamiliasImagenesPerfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisFamiliasImagenesPerfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisFamiliasImagenesPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

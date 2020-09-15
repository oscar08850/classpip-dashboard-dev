import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarFamiliaImagenesPerfilComponent } from './asignar-familia-imagenes-perfil.component';

describe('AsignarFamiliaImagenesPerfilComponent', () => {
  let component: AsignarFamiliaImagenesPerfilComponent;
  let fixture: ComponentFixture<AsignarFamiliaImagenesPerfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarFamiliaImagenesPerfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarFamiliaImagenesPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

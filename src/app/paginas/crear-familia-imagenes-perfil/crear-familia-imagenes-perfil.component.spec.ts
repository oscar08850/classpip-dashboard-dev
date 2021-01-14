import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearFamiliaImagenesPerfilComponent } from './crear-familia-imagenes-perfil.component';

describe('CrearFamiliaImagenesPerfilComponent', () => {
  let component: CrearFamiliaImagenesPerfilComponent;
  let fixture: ComponentFixture<CrearFamiliaImagenesPerfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearFamiliaImagenesPerfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearFamiliaImagenesPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

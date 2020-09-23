import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEscenarioComponent } from './editar-escenario.component';

describe('EditarColeccionComponent', () => {
  let component: EditarEscenarioComponent;
  let fixture: ComponentFixture<EditarEscenarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarEscenarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarEscenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

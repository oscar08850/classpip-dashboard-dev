import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPreguntaDialogComponent } from './editar-pregunta-dialog.component';

describe('EditarPreguntaDialogComponent', () => {
  let component: EditarPreguntaDialogComponent;
  let fixture: ComponentFixture<EditarPreguntaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarPreguntaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarPreguntaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

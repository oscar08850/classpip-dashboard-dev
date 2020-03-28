import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarPreguntasDialogComponent } from './agregar-preguntas-dialog.component';

describe('AgregarPreguntasDialogComponent', () => {
  let component: AgregarPreguntasDialogComponent;
  let fixture: ComponentFixture<AgregarPreguntasDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarPreguntasDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarPreguntasDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

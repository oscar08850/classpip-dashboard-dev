import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionJuegoDeCuestionarioDialogComponent } from './informacion-juego-de-cuestionario-dialog.component';

describe('InformacionJuegoDeCuestionarioDialogComponent', () => {
  let component: InformacionJuegoDeCuestionarioDialogComponent;
  let fixture: ComponentFixture<InformacionJuegoDeCuestionarioDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionJuegoDeCuestionarioDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionJuegoDeCuestionarioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
